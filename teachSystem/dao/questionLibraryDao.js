'use strict'
const MysqlHelper = require('../util/MysqlHelper.js');
const config = require('../config/config.js');
const path = require('path');
const fs = require("fs-extra");
const crypto = require('crypto')

class questionLibraryDao {
    static async getByParam(params) {
        let q_type = '',
            isExam = '';
        if (params.is_exam === 1)
            isExam = 'and is_exam=1';
        else if (params.is_exam === 0)
            isExam = 'and is_exam=0';
        if (params.q_type.length > 0)
            q_type = `and q_type in (${params.q_type.join(',')})`;
        let data;
        if (params.searchContent.length > 0) {
            if (params.searchColumn === 'ql_id') {
                data = await MysqlHelper.row(`select ql_id,q_simple_description,q_type,is_exam,answer,q_range from question_library where c_id=? 
                ${q_type} ${isExam} and ql_id = ?`, params.c_id, params.searchContent);
            } else {
                let sql = `select ql_id,q_simple_description,q_type,is_exam,answer,q_range from question_library where c_id=? 
                    ${q_type} ${isExam} and ${params.searchColumn} like ? limit ?,?`
                data = await MysqlHelper.row(sql, params.c_id, '%' + params.searchContent + '%', params.start, params.pageSize);
            }
        } else {
            let sql = `select ql_id,q_simple_description,q_type,is_exam,answer,q_range from question_library where c_id=? 
                ${q_type} ${isExam} limit ?,?`
            data = await MysqlHelper.row(sql, params.c_id, params.start, params.pageSize);
        }
        let res;
        if (params.count) {
            res = {};
            res.data = data;
            if (params.searchContent.length > 0) {
                if (params.searchColumn === "ql_id")
                    res.size = 1;
                else
                    res.size = await MysqlHelper.single(`select count(*) from question_library where 
                        c_id=? ${q_type} ${isExam} and ${params.searchColumn} like ?
                        `, params.c_id, '%' + params.searchContent + '%');
            } else {
                res.size = await MysqlHelper.single(`select count(*) from question_library where c_id=? 
                    ${q_type} ${isExam}
                    `, params.c_id);
            }
        } else {
            res = data;
        }
        return res;
    }

    static async getShowQuestion(ql_id) {
        return await MysqlHelper.first(`select q_description,q_type,alternative_answer from question_library where ql_id=?`, ql_id);
    }


    static async addOne(data) {
        let res = await MysqlHelper.insert(`
            insert into question_library(c_id,q_simple_description,q_description,is_exam,q_range,alternative_answer,answer,q_type) value(?,?,?,?,?,?,?,?)
            `, data.c_id, data.q_simple_description, data.q_description, data.is_exam, data.q_range, JSON.stringify(data.alternative_answer), JSON.stringify(data.answer), data.q_type);
        //如果题目类型为编程题，生成测试文本
        if (data.q_type == 4) {
            let dir = path.join(config.testSavePath, res.toString());
            await fs.emptyDir(dir);
            let info = {};
            info.spj = false
            info.test_cases={};
            for (let i = 0; i < data.answer.length; i++) {
                let item = data.answer[i];
                let h = crypto.createHash('md5');
                let path1 = path.join(dir, `${i+1}.in`);
                'asdf'.trimRight()
                fs.writeFileSync(path1, item.input.trimRight());
                let path2 = path.join(dir, `${i+1}.out`);
                fs.writeFileSync(path2, item.output.trimRight());
                info.test_cases[i + 1] = {
                    input_name: `${i+1}.in`,
                    input_size: fs.statSync(path1).size,
                    output_name: `${i+1}.out`,
                    output_size: fs.statSync(path2).size,
                    stripped_output_md5: h.update(item.output).digest('hex')
                }
            }
            await fs.writeFile(path.join(dir, 'info'), JSON.stringify(info));
        }
        for (let i = 0; i < data.tags.length; i++) {
            await MysqlHelper.insert(`insert into question_knowledge(ql_id,kp_id) value(?,?)`, res, data.tags[i].kp_id);
        }
        return res;
    }

    static async deleteOne(id) {
        await MysqlHelper.delete(`delete from question_library where ql_id=?`, id);
    }
}

module.exports = questionLibraryDao;