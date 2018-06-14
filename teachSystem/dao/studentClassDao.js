let mysqlHelper = require('../util/MysqlHelper.js');

class StudentClass {
    static async add(u_id,class_id) {
        await mysqlHelper.execute(`
            insert into student_class values(?,?)
        `, class_id, u_id);
    }
}

module.exports=StudentClass;