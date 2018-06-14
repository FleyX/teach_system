const base = require('./base_config.js');
const objectOperate = require('../util/ObjectOperate.js');
const config = {
    redis: {
        host: 'localhost',
        prot: 6379
    },
    mysql: {
        connectionLimit: 50, //默认值10
        host: 'localhost',
        user: '',
        password: '',
        database: 'teach_system',
        multipleStatements: false//默认值false
    },
    host:'',
    port:8088,
    judgeUrl:'http://localhost:12358/judge',
    judgeToken:'',
    testSavePath:'/home/ubuntu/JudgeServer/tests/test_case'//编程题测试点存储路径
}

module.exports = objectOperate.combineObject(base, config);