'use strict'
const mysqlHelper = require('../util/MysqlHelper.js');
const stringHelper = require('../util/StringHelper.js');
const ErrorHelper = require('../util/ErrorHelper.js');


class gradeDao {

    static async getByCourseId(courseId) {
        let res = await mysqlHelper.row(`select g_id,content from grade where c_id=? order by content`, courseId);
        res.forEach(item => {
            item.name = item.content;
            delete item.content;
        });
        return res;
    }


    static async addOne(data) {
        let res = await mysqlHelper.execute(`insert into grade(c_id,content) value(?,?)`, data.c_id, data.content);
        return res.insertId;
    }

    static async deleteOneGrade(g_id) {
        let count = await mysqlHelper.single(`select count(*) from class where g_id=?`, g_id);
        if (count == 0) {
            await mysqlHelper.execute(`delete from grade where g_id=?`, g_id);
        } else {
            ErrorHelper.newError(`仅当该年级下无班级时可删除`, 403);
        }
    }
}

module.exports = gradeDao;