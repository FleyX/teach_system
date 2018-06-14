const mysqlHelper = require('../util/MysqlHelper.js');
const RedisHelper = require('../util/RedisHelper.js');
const stringHelper = require('../util/StringHelper.js');
let ErrorHelper = require('../util/ErrorHelper.js');
const fs = require('fs-extra');
const config = require('../config/config.js');
const path = require('path');

class courseDao {
    static async getByUserId(userId) {
        return await mysqlHelper.row(`
            select b.c_id,b.code,b.c_name from teacher_course a inner join course b on a.c_id = b.c_id where a.u_id = ?
            `, userId);

    }

    static async getAllCourse() {
        let data = await mysqlHelper.row(`select c_id,code,c_name,create_time from course`);
        for (let i = 0; i < data.length; i++) {
            data[i].teacher = await mysqlHelper.row(`
                select b.u_id,b.u_name from teacher_course a inner join user b on a.u_id = b.u_id where a.c_id=?
            `, data[i].c_id);
        }
        return data;
    }

    static async getTeacher(c_id) {
        let res = await mysqlHelper.row(`select a.u_id,a.u_name from user a inner join teacher_course b on a.u_id=b.u_id where b.c_id=?`, c_id);
        return res;
    }

    //获取课程统计信息
    static async getCourseStatistics(c_id) {
        let redisKey = c_id + '_course_statistics';
        let res = await RedisHelper.getString(redisKey);
        if (res == null) {
            res = {};
            res.studentNum = await mysqlHelper.single(`select count(*) from student_evaluate_view where c_id=?`, c_id);
            res.evaluate = [];
            for (let i = 0; i < 10; i += 2) {
                res.evaluate.push({
                    range: `${i}-${i+2}`,
                    num: await mysqlHelper.single(`
                        select count(*) from student_evaluate_view where c_id=? and evaluate>=? and evaluate<?`, c_id, i, i == 8 ? 11 : i + 2)
                });
            }
            await RedisHelper.setString(redisKey, JSON.stringify(res), 5 * 60);
        }
        return res;
    }

    //获取排行榜前三十,5分钟更新一次
    static async getTop30(c_id, type) {
        let redisKey = c_id + type + '_top30';
        let res = await RedisHelper.getString(redisKey);
        if (res == null) {
            res = await mysqlHelper.row(`select u_id,u_name,class_name,grade_name,${type} from student_evaluate_view where c_id=? order by ${type} desc limit 0,30`, c_id);
            await RedisHelper.setString(redisKey, JSON.stringify(res), 5 * 60);
        }
        return res;
    }

    static async getStudentEvaluate(c_id, u_id, type) {
        return await mysqlHelper.single(`select ${type} from student_evaluate_view where c_id=? and u_id=?`, c_id, u_id);
    }

    static async getCourseByUId(u_id) {
        let res = await mysqlHelper.row(`SELECT a.c_id,a.c_name from course a inner join grade b on a.c_id = b.c_id 
            inner join class c on b.g_id = c.g_id inner join student_class d on c.class_id = d.class_id where d.u_id=?
            `, u_id);
        return res;
    }

    static async getBaseInfo(params) {
        return await mysqlHelper.single(`select ${params.column} from course where c_id=?`, params.c_id);
    }

    static async getTree(c_id) {
        let course = {};
        course.id = c_id;
        course.level = 1;
        course.label = await mysqlHelper.single(`select c_name from course where c_id=?`, c_id);
        let gradeList = await mysqlHelper.row(`select g_id,content from grade where c_id=? order by content`, c_id);
        if (gradeList.length > 0) {
            course.children = [];
            for (let i = 0; i < gradeList.length; i++) {
                let grade = {};
                grade.level = 2;
                grade.id = gradeList[i].g_id;
                grade.label = gradeList[i].content;
                let classList = await mysqlHelper.row(`select class_id,content from class where g_id=? order by content`, grade.id);
                if (classList.length > 0) {
                    grade.children = [];
                    classList.forEach(item => {
                        grade.children.push({
                            id: item.class_id,
                            label: item.content,
                            level: 3
                        });
                    })
                }
                course.children.push(grade);
            }
        }
        return course;
    }

    static async getKnowledgePointTree(c_id) {
        let course = {};
        course.id = c_id;
        course.level = 1;
        course.label = await mysqlHelper.single(`select c_name from course where c_id=?`, c_id);
        let sectionList = await mysqlHelper.row(`select s_id,s_name from section where c_id=? order by s_name`, c_id);
        course.children = [];
        if (sectionList.length > 0) {
            for (let i = 0; i < sectionList.length; i++) {
                let section = {};
                section.level = 2;
                section.id = sectionList[i].s_id;
                section.label = sectionList[i].s_name;
                let pointList = await mysqlHelper.row(`select kp_id,content from knowledge_point where s_id=?`, section.id);
                if (pointList.length > 0) {
                    section.children = [];
                    pointList.forEach(item => {
                        section.children.push({
                            id: item.kp_id,
                            label: item.content,
                            level: 3
                        })
                    })
                }
                course.children.push(section);
            }
        }
        return course;
    }

    static async addOne(data) {
        //检查课程代码是否已经存在
        let isExist = await mysqlHelper.single(`select count(*) from course where code=?`, data.code);
        if (isExist) throw ErrorHelper.Error403("该课程以存在");
        let res = await mysqlHelper.execute(`
            insert into course(code,c_name,c_picture,c_intro,teacher_intro,first_course,teach_plan,
                exam_type,reference_book,update_time,create_time) value(?,?,'','','','','','','',?,?)
                `, data.code, data.c_name, Date.now(), Date.now());
        for (let i in data.teacher) {
            let item = data.teacher[i];
            await mysqlHelper.execute(`insert into teacher_course values(?,?)`, item.u_id, res.insertId);
        }
        let dicPath = path.join(config.rootPath, 'files/course', res.insertId.toString(), 'courseware');
        await fs.mkdirs(dicPath);
        return {
            c_id: res.insertId,
            create_time: Date.now()
        }
    }

    static async updateOne(data, c_id) {
        await mysqlHelper.execute(`
            update course set code=?,c_name=?,update_time=? where c_id=?
            `, data.code, data.c_name, Date.now(), c_id);
        await mysqlHelper.execute(`
            delete from teacher_course where c_id=?
            `, c_id);
        for (let i in data.teacher) {
            let item = data.teacher[i];
            await mysqlHelper.execute(`insert into teacher_course values(?,?)`, item.u_id, c_id);
        }
    }

    static async updateBaseInfo(data, c_id) {
        await mysqlHelper.execute(`update course set ${data.column}=? where c_id=?`, data.value, c_id);
    }

    static async deleteOne(c_id) {
        await mysqlHelper.execute(`delete from test where c_id=?`, c_id);
        await mysqlHelper.execute(`delete from question_group where c_id=?`,c_id);
        await mysqlHelper.execute(`delete from course where c_id=?`, c_id);
        let dirPath = path.join(config.rootPath, 'files/course', c_id.toString())
        await fs.remove(dirPath);
    }
}

module.exports = courseDao;