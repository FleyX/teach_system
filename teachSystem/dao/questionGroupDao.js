const MysqlHelper = require('../util/MysqlHelper.js');
const RedisHelper = require('../util/RedisHelper.js');
const ErrorHelper = require('../util/ErrorHelper.js');

class questionGroupDao {
    static async getByParam(params) {
        let qg_type = '';
        if (params.qg_type == '1' || params.qg_type == '2')
            qg_type = ` and qg_type=${params.qg_type}`;
        let data;
        if (params.searchContent.length > 0) {
            if (params.searchColumn === 'qg_id') {
                data = await MysqlHelper.row(`
                    select * from question_group where c_id=? ${qg_type} and qg_id=? and is_random=0
                    `, params.c_id, params.searchContent);
            } else {
                data = await MysqlHelper.row(`
                    select * from question_group where c_id=? and is_random=0 ${qg_type} and ${params.searchColumn} like ? order by qg_id desc limit ?,?
                    `, params.c_id, `%${params.searchContent}%`, params.start, params.pageSize);
            }
        } else {
            data = await MysqlHelper.row(`
                select * from question_group where c_id=? and is_random=0 ${qg_type} order by qg_id desc limit ?,?
                `, params.c_id, params.start, params.pageSize);
        }
        let res;
        if (params.count) {
            res = {};
            res.data = data;
            if (params.searchContent.length > 0) {
                if (params.searchColumn === "qg_id")
                    res.size = 1;
                else
                    res.size = await MysqlHelper.single(`
                        select count(*) from question_group where c_id=? and is_random=0 ${qg_type} and ${params.searchColumn} like ?
                        `, params.c_id, `%${params.searchContent}%`);
            } else {
                res.size = await MysqlHelper.single(`
                    select count(*) from question_group where c_id=? and is_random=0 ${qg_type}
                    `, params.c_id);
            }
        } else {
            res = data;
        }
        return res;
    }

    static async getQuestion(qg_id) {
        let redisKey = qg_id + '_question_group';
        let res = await RedisHelper.getString(redisKey);
        if (res == null) {
            let data = await MysqlHelper.row(`
            select b.q_type,b.q_description,b.alternative_answer,b.ql_id,a.score from group_question a inner join question_library b on a.ql_id=b.ql_id where a.qg_id=?
            `, qg_id);
            res = {
                single: [],
                mult: [],
                gap: [],
                program: []
            }
            data.forEach(item => {
                switch (item.q_type) {
                    case 1:
                        res.single.push(item);
                        break;
                    case 2:
                        res.mult.push(item);
                        break;
                    case 3:
                        res.gap.push(item);
                        break;
                    case 4:
                        res.program.push(item);
                }
            })
            res = JSON.stringify(res); 
            await RedisHelper.setString(redisKey,res,60);
        }
        return res;
    }

    static async addOne(c_id, data) {
        let id = await MysqlHelper.insert(`
            insert into question_group(c_id,qg_name,difficulty,qg_type,score,is_random) value(?,?,?,?,?,?)
            `, c_id, data.qg_name, data.difficulty, data.qg_type, data.score, 0);
        try {
            for (let i = 0; i < data.onSystemQuestion.length; i++) {
                for (let j = 0; j < data.onSystemQuestion[i].length; j++) {
                    let item = data.onSystemQuestion[i][j];
                    await MysqlHelper.insert(`insert into group_question value(?,?,?)`, id, item.ql_id, item.score);
                }
            }
        } catch (err) {
            await MysqlHelper.execute(`delete from qg_type where qg_id=?`, id);
            throw err;
        }
        return id;
    }

    static async deleteOne(c_id, qg_id) {
        try {
            await MysqlHelper.delete(`delete from question_group where c_id=? and qg_id=?`, c_id, qg_id);
        } catch (err) {
            console.log(err);
            throw ErrorHelper.Error403("无法删除，已经在测试中使用");
        }
    }



}

module.exports = questionGroupDao