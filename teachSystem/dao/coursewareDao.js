const mysqlHelper = require('../util/MysqlHelper.js');
const stringHelper = require('../util/StringHelper.js');
const config = require('../config/config.js');
const fs = require('fs-extra');
const path = require('path');

class coursewareDao {
    static async getAllofClass(c_id) {
        let res = await mysqlHelper.row(`select * from courseware where c_id=?`, c_id);
        res.forEach(item=>{
            item.downloadUrl = `${config.host}/course/${c_id}/courseware/${item.cw_name}`;
        })
        return res;
    }

    static async add(c_id, files) {
        let dir = path.join(config.rootPath, 'files/course', c_id, 'courseware');
        await fs.ensureDir(dir);
        let res = [];
        for (let key in files) {
            let file = files[key];
            let filePath = path.join(dir, file.name);
            await fs.remove(filePath);
            await fs.rename(file.path, filePath);
            let reply = await mysqlHelper.execute(`insert into courseware(c_id,cw_name,create_time) value(?,?,?)`, c_id, file.name, Date.now());
            res.push({
                id: reply.insertId,
                create_time: Date.now(),
                cw_name:file.name
            });
        }
        return res;
    }

    static async deleteOne(c_id, cw_id) {
        let name = await mysqlHelper.single(`select cw_name from courseware where cw_id=?`,cw_id);
        await fs.remove(path.join(config.rootPath,'files/course',c_id,'courseware',name));
        await mysqlHelper.execute(`delete from courseware where c_id=? and cw_id=?`, c_id, cw_id);
    }

}

module.exports = coursewareDao;