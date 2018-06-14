const base = require('./base_config.js');
const objectOperate = require('../util/ObjectOperate.js');
const config = {
    redis: {
        host: '',
        prot: 6379
    },
    mysql: {
        connectionLimit: 50, //默认值10
        host: '',
        user: '',
        password: '',
        database: 'teach_system',
        multipleStatements: false//默认值false
    }
}

module.exports = objectOperate.combineObject(base, config);