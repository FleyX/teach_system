'use strcit'
const MysqlHelper = require('../util/MysqlHelper.js');
const ErrorHelper = require('../util/ErrorHelper.js');

class sectionDao{
    static async getByCourseId(c_id){
        let res = await MysqlHelper.row(`select s_id,s_name from section where c_id=?`,c_id);
        return res;
    }

    static async addOne(data){
        let res = await MysqlHelper.insert(`insert into section(c_id,s_name) value(?,?)`,data.c_id,data.s_name);
        return res;
    }
    
    static async deleteOne(s_id){
        await MysqlHelper.delete(`delete from section where s_id=?`,s_id);
    }
}

module.exports = sectionDao;