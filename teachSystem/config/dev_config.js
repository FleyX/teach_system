'use strict';
const base = require('./base_config.js');
const objectOperate = require('../util/ObjectOperate.js');
const path = require('path');

const config = {
    //redis配置，由于redis不开放，故无需设置账号密码
    redis: {
        host: '192.168.1.100',
        prot: 6379,
        password:'123456'
    },
    //mysql配置
    mysql: {
        connectionLimit: 50, //默认值10
        host: '192.168.1.100',
        user: 'root',
        password: '123456',
        database: 'teach_system',
        multipleStatements: false//默认值false
    },
    //返回的资源文件访问路径前缀
    host:'/files',
    //端口
    port:8082,
    //编程题判题接口
    judgeUrl:'http://192.168.189.132:12358/judge',
    //编程题判题令牌
    judgeToken: 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 
    //测试用例存储路径
    testSavePath:path.join(base.rootPath,'files','tests')
}

module.exports = objectOperate.combineObject(base, config);