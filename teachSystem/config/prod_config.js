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
        user: 'manager',
        password: 'manager',
        database: 'teach_system',
        multipleStatements: false//默认值false
    },
    //今天文件访问路径
    host:'/files',
    //端口
    port:8088,
    //判题接口
    judgeUrl:'http://localhost:12358/judge',
    //判题token
    judgeToken:'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f',
    //测试用例存储路径
    testSavePath:'/home/ubuntu/JudgeServer/tests/test_case'
}

module.exports = objectOperate.combineObject(base, config);