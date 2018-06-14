'use strict'
const MysqlHelper = require('../util/MysqlHelper.js');
const ErrorHelper = require('../util/ErrorHelper.js');

class knowledgePointDao {
    static async getPontsOrderBySection(c_id) {
        let sections = await MysqlHelper.row(`select s_id,s_name from section where c_id=?`, c_id);
        for (let i = 0; i < sections.length; i++) {
            sections[i].children = await MysqlHelper.row(`select kp_id,content from knowledge_point where s_id=?`, sections[i].s_id);
        }
        return sections;
    }
    //某学生知识点掌握情况
    static async getStudentCondition(u_id, c_id) {
        let res = await MysqlHelper.row(`select kp_id,count,right_count from student_knowledge_view where u_id=? and c_id=?`, u_id, c_id);
        return res;
    }

    

    static async addOne(data) {
        let res = await MysqlHelper.execute(`insert into knowledge_point(s_id,content) value(?,?)`, data.s_id, data.content);
        return res.insertId;
    }

    static async deleteOne(kp_id) {
        await MysqlHelper.delete(`delete from knowledge_point where kp_id=?`, kp_id);
    }
}

module.exports = knowledgePointDao;