'use strict';
const base = require('./base_config.js');
const objectOperate = require('../util/ObjectOperate.js');
const path = require('path');

const config = {
    redis: {
        host: '192.168.189.132',
        prot: 6379
    },
    mysql: {
        connectionLimit: 50, //默认值10
        host: 'tapme.top',
        user: 'root',
        password: '102030abcd',
        database: 'teach_system',
        multipleStatements: false//默认值false
    },
    host:'http://localhost:3002/files/',//静态文件前缀
    port:8081,
    judgeUrl:'http://tapme.top:12358/judge',
    judgeToken:'',//判题秘钥需用sha256加密
    testSavePath:path.join(base.rootPath,'files','tests')
}

module.exports = objectOperate.combineObject(base, config);