/* 
    访问日志 某ip访问某请求
    操作日志 某用户执行某操作
    响应时间日志 某接口的执行时间(认证时间，操作时间)
*/
const log4js = require('log4js');
const config = require('../config/config.js');

log4js.configure(config.log);
const visitLog = log4js.getLogger('visit');
const operateLog = log4js.getLogger('operate');
const responseTimeLog = log4js.getLogger('responseTime');

let visit = (ip, uri, method) => {
    visitLog.info(ip + ' ' + uri + ' ' + method);
}

let operate = (uid, uri, method, data) => {
    operateLog.info(uid + ' ' + uri + ' ' + method + ' ' + data);
}

//单位ms
let responseTime = (uri, method, identifyTime, operateTime) => {
    responseTimeLog.info(uri + ' ' + method + ' ' + identifyTime + ' ' + operateTime);
}

module.exports = {
    visit,
    operate,
    responseTime
}