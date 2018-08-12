const path = require('path');
const rootPath = path.dirname(__dirname);

module.exports = {
    //当前根目录
    rootPath: rootPath,
    //当前环境：开发/生产
    env:process.env.NODE_ENV,
    //日志配置
    log: {
        appenders: {
            login: {
                type: 'file',
                filename: path.join(rootPath, 'log/login/login.log'),
                "maxLogSize": 104800,
            },
            success: {
                type: 'file',
                filename: path.join(rootPath, 'log/success/success.log'),
                "maxLogSize": 104800,
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
    //启动端口
    port: process.env.port == null ? 8083 : process.env.port,
    //前缀url
    url_prefix: process.env.url_prefix == null ? '/login-api' : process.env.url_prefix,
    //长时间记住我(s)
    longTokenExpiration: 20*24 * 60 * 60,
    //短时间记住我(s)
    shortTokenExpiration:60*60,
    //配置smtp邮箱，重置密码验证码
    mail:{
        host:'smtp.qq.com',
        port:465,
        secure:true,
        //邮箱密码用于发送重置密码验证码
        auth:{
            user:'',
            pass: ''
        }
    }
}