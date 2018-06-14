const path = require('path');
const rootPath = path.dirname(__dirname);

module.exports = {
    rootPath: rootPath,
    env:process.env.NODE_ENV,
    log: {
        appenders: {
            login: {
                type: 'file',
                filename: path.join(rootPath, 'log/login/login.log'),
                "maxLogSize": 104800000,
            },
            success: {
                type: 'file',
                filename: path.join(rootPath, 'log/success/success.log'),
                "maxLogSize": 104800000,
            },
            console:{
                type:'console'
            }
        },
        categories:{
            default:{
                appenders:['console'],
                level: 'all'
            },
            login:{
                appenders:['login'],
                level:'all'
            },
            success:{
                appenders:['success'],
                level:'all'
            },
        },
        replaceConsole:true,
    },
    port: process.env.port == null ? 8083 : process.env.port,
    url_prefix: process.env.url_prefix == null ? '/login-api' : process.env.url_prefix,
    longTokenExpiration: 20*24 * 60 * 60,
    shortTokenExpiration:60*60,
    mail:{
        host:'smtp.qq.com',
        port:465,
        secure:true,
        auth:{
            user:'',
            pass: ''
        }
    }
}