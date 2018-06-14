/* 
    访问日志 记录访问ip
*/
const log4js = require('log4js');
const config = require('../config/config.js');

log4js.configure(config.log);
const loginLog = log4js.getLogger('login');
const successLog= log4js.getLogger('success');
const console = log4js.getLogger('console');
let login = (ip,url) => {
    loginLog.info(ip,url);
}

let success = (ip,uid)=>{
    successLog.info(ip,uid);
}

module.exports = {
    login,
    success
}

