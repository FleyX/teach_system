const base = require('./base_config.js');
const objectOperate = require('../util/ObjectOperate.js');
const config = {
    redis: {
        host: 'redis',
        prot: 6379,
	password:'123456'
    },
    mysql: {
        connectionLimit: 50, //默认值10
        host: 'mysql',
        user: 'root',
        password: '123456',
        database: 'teach_system',
        multipleStatements: false //默认值false
    }
}

module.exports = objectOperate.combineObject(base, config);
