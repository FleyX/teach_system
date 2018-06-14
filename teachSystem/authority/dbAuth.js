/**
 * 扫描所有路由加入到资源表中
 */
const fs = require('fs');
const path = require('path');
const config = require('../config/config.js');
const mysqlHelper = require('../util/MysqlHelper.js');

(async() => {
    let folderPath = path.join(config.rootPath, '/api');
    let files = fs.readdirSync(folderPath);
    for (let i = 0; i < files.length; i++) {
        let file = path.join(folderPath, files[i]);
        let temp = require(file);
        let urls = Object.keys(temp);
        for (let j = 0; j < urls.length; j++) {
            let params = urls[j].split(' ');
            try {
                await mysqlHelper.execute(`
                insert into resource(url,method,description) values(?,?,?)        
            `, params[1], params[0], '');
            console.log(`新增资源：${params[1]},方法：${params[0]}`);
            } catch (error) {
            }
        }
    }
    console.log('更新权限资源完毕');
    process.exit();
})();