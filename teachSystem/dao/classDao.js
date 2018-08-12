const mysqlHelper = require('../util/MysqlHelper.js');
const stringHelper = require('../util/StringHelper.js');
const ErrorHelper = require('../util/ErrorHelper.js');
const asyncx = require('async');

class classDao {

    static async getStudentOfClass(class_id) {
        return await mysqlHelper.row(`
            select b.u_id,b.code,b.u_name,b.email_addr,b.create_time,b.sex,a.evaluate from student_class a inner join user b on a.u_id=b.u_id where a.class_id=?
            `, class_id);
    }

    static async addOne(data) {
        let res = await mysqlHelper.execute(`insert into class(g_id,content) value(?,?)`, data.g_id, data.content);
        return res.insertId;
    }

    static async addOneStudent(class_id, data) {
        //判断学生是否已经存在
        let u_id = await mysqlHelper.single(`select u_id from user where code=?`, data.code);
        if (u_id == null) {
            //加入该学生到用户表中
            u_id = await mysqlHelper.insert(`
                insert into user(j_id,u_name,u_type,code,password,email_addr,icon,sex,last_login_time,create_time) 
                value(3,?,3,?,?,'','default.jpg',2,0,${Date.now()})
                `, data.u_name, data.code, data.password);
        }
        let c_id = await mysqlHelper.single(`select c_id from grade a inner join class b on a.g_id=b.g_id where b.class_id=?`, class_id);
        //判断学生是否已经存在该课程中
        let count = await mysqlHelper.single(`select count(*) from student_evaluate_view where c_id=? and u_id=?`, c_id, u_id);
        if (count > 0)
            throw ErrorHelper.Error403("加入失败,该学生已存在与该课程");
        let sc_id = await mysqlHelper.insert(`insert into student_class(u_id,class_id) value(?,?)`, u_id, class_id);
        //加入课程测试信息
        let testList = await mysqlHelper.row(`select b.test_id,b.qg_id from test_class a inner join test b on a.test_id = b.test_id where class_id=?`, class_id);
        for (let i = 0; i < testList.length; i++) {
            if (testList[i].qg_id == null) {
                await mysqlHelper.insert("insert into student_test(sc_id,test_id) value(?,?)", sc_id, testList[i].test_id);
            } else {
                await mysqlHelper.insert("insert into student_test(sc_id,test_id,qg_id) value(?,?,?)", sc_id, testList[i].test_id, testList[i].qg_id);
            }
        }
    }

    static async addManyStudent(class_id, data) {
        return new Promise((resolve, reject) => {
            asyncx.mapLimit(data, 10, async function (item) {
                try {
                    await classDao.addOneStudent(class_id, item);
                } catch (error) {
                    return {
                        info: `${item.u_name} ${item.code} 加入失败`,
                        errorInfo: error.toString()
                    };
                }
            }, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res.filter(item => item != undefined));
            })
        })

    }

    static async deleteOneStudent(class_id, u_id) {
        await mysqlHelper.delete(`delete from student_class where class_id=? and u_id=?`, class_id, u_id);
    }

    static async deleteOneClass(class_id) {
        await mysqlHelper.delete(`delete from class where class_id=?`, class_id);
    }

}

module.exports = classDao;