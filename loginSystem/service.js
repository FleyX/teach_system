'use strict'
const jwt = require('jsonwebtoken');
const captcha = require('trek-captcha');
const crypto = require('crypto');
const MysqlHelper = require('./util/MysqlHelper.js');
const RedisHelper = require('./util/RedisHelper.js');
const MailHelper = require('./util/MailHelper.js');
const StringHelper = require('./util/StringHelper.js');
const TextVerify = require('./util/TextVerify.js');
const logger = require('./log/log.js');
const config = require('./config/config.js');

let login = async (ctx) => {
    let res = {
        code: 0,
        info: '账号密码错误',
        data: ''
    }
    let {
        code,
        password,
        authcode,
        authcodeKey,
        isRememberMe
    } = ctx.request.body;
    if (StringHelper.isEmpty(code) || StringHelper.isEmpty(authcodeKey) || StringHelper.isEmpty(authcode) || (!TextVerify.isPassword(password))) {
        res.info = "输入字段格式有误";
        ctx.body = res;
        return;
    }
    let realAuthcode = await RedisHelper.getString(authcodeKey);
    if (realAuthcode != authcode) {
        res.info = '验证码错误';
        ctx.body = res;
        return;
    }
    let userInfo = await MysqlHelper.first(`
        select * from user where code=?
        `, code);
    if (userInfo != null && userInfo.password == password) {
        let str = StringHelper.getRandomString(0, 10);
        let token = jwt.sign({
            u_id: userInfo.u_id,
            isRememberMe
        }, str, {
            expiresIn: isRememberMe ? config.longTokenExpiration : config.shortTokenExpiration
        });
        await RedisHelper.setString(token, str, 30 * 24 * 60 * 60);
        res.code = 1;
        res.info = '登录成功';
        res.data = {
            u_type: userInfo.u_type,
            u_id: userInfo.u_id,
            token
        };
        RedisHelper.deleteKey(authcodeKey);
        logger.success(ctx.ip, userInfo.u_id);
    }
    ctx.body = res;
}

let sendMail = async ctx => {
    let res = {
        code: 0,
        data: '',
        info: ''
    }
    let {
        code
    } = ctx.request.body;
    let info = await MysqlHelper.first(`select u_id,email_addr from user where code=?`, code);
    if (info == null) {
        res.info = "账号不存在";
        ctx.body = res;
    } else if (info.email_addr == null || info.email_addr.length == 0) {
        res.info = "未设置邮箱";
        ctx.body = res;
    } else {
        let authCode = StringHelper.getRandomString();
        await RedisHelper.setString(info.email_addr, authCode);
        try {
            let reply = await MailHelper.resetPass(authCode, info.email_addr);
            console.log(reply);
            res.code = 1;
            res.info = '发送成功，请注意查收';
            ctx.body = res;
        } catch (err) {
            res.code = 0;
            res.info = '发送失败，可能邮箱不存在';
            ctx.body  =res;
        }
    }
}

let authCode = async (ctx) => {
    let authcodeKey = StringHelper.getRandomString(0, 10);
    let data = await captcha({
        size: 5,
        style: 0
    });
    await RedisHelper.setString(authcodeKey, data.token, 120);
    ctx.body = {
        data: new Buffer(data.buffer).toString('base64'),
        key: authcodeKey
    }
}

let resetPass = async ctx => {
    let res = {
        code: 0,
        data: '',
        info: ''
    }
    let {
        code,
        pass,
        repass,
        authCode
    } = ctx.request.body;
    if (pass != repass) {
        res.info = "两次密码不一致";
        ctx.body = res;
        return;
    }
    let mail = await MysqlHelper.single(`select email_addr from user where code=?`,code);
    let realAuthCode = await RedisHelper.getString(mail);
    if (realAuthCode == null || authCode != realAuthCode) {
        res.info = "验证码错误";
        ctx.body = res;
        return;
    }
    await MysqlHelper.execute(`update user set password=? where email_addr=?`, pass, mail);
    res.code = 1;
    res.info = "重置密码成功";
    ctx.body = res;
}

module.exports = {
    login,
    sendMail,
    authCode,
    resetPass
}