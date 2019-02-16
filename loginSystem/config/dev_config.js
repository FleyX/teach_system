const base = require('./base_config.js');
const objectOperate = require('../util/ObjectOperate.js');
const config = {
    //redis配置，由于redis不开放，故无需设置账号密码
    redis: {
        host: '192.168.1.100',
        prot: 6379,
        password:"123456"
    },
    //mysql配置
    mysql: {
        connectionLimit: 50, //默认值10
        host: '192.168.1.100',
        user: 'root',
        password: '123456',
        database: 'teach_system',
        multipleStatements: false//默认值false
    }
}

module.exports = objectOperate.combineObject(base, config);