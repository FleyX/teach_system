'use strict'
const config = require('../config/config.js');
const mysqlHelper = require('../util/MysqlHelper.js');
const stringHelper = require('../util/StringHelper.js');
const redisHelper = require('../util/RedisHelper.js');
const uuid = require('uuid/v1');
const asyncx = require('async');
const studentClassDao = require('../dao/studentClassDao.js');
const fs = require('fs-extra');
const path = require('path');
const ErrorHelper = require('../util/ErrorHelper.js');


class userDao {
    static async getUserById(id) {
        return await mysqlHelper.first(`select * from user where u_id=?`, id);
    }

    static async getUserByParam(params) {
        let res = null;
        let data = null;
        let filter = '';
        if (params.u_type != null) {
            if (params.search != undefined && params.search.content.length > 0) {
                filter = ' and u_type in' + params.u_type;
            } else {
                filter = 'where u_type in ' + params.u_type;
            }
        }
        if (params.search != undefined && params.search.content.length > 0) {
            data = await mysqlHelper.row(`
                select u_id,u_name,code,u_type,email_addr from user where ${params.search.filed} like ? ${filter} order by ? ${params.sort} limit ?,10
                `, '%' + params.search.content + '%', params.orderBy, params.start);
        } else {
            data = await mysqlHelper.row(`
                select u_id,u_name,code,u_type,email_addr from user ${filter} order by ? ${params.sort} limit ?,10
                `, params.orderBy, params.start);
        }
        if (params.count) {
            res = {};
            if (params.search != undefined) {
                res.count = await mysqlHelper.single(`
                    select count(*) from user where ${params.search.filed} like ? ${filter}
                    `, '%' + params.search.content + '%');
            } else {
                res.count = await mysqlHelper.single(`select count(*)  from user ${filter}`);
            }
            res.data = data;
        } else {
            res = data;
        }
        return res;
    }

    static async getUserLoginTime() {
        let redisKey = 'userLoginTime';
        let res = await redisHelper.getString(redisKey);
        if (res == null) {
            let now = new Date();
            let currentDate = new Date(now.toDateString());
            currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
            let lastDate = currentDate;
            res = [];
            for (let i = 1; i <= 7; i++) {
                let tempDate = new Date(lastDate.getTime() - 24 * 60 * 60 * 1000);
                let key = `${tempDate.getMonth()+1}-${tempDate.getDate()}`;
                let value = await mysqlHelper.single(`
                    select count(*) from user where last_login_time <? and last_login_time>?`, lastDate.getTime(), tempDate.getTime());
                res.push({
                    key,
                    value
                });
                if (i == 7) {
                    key += '之前';
                    value = await mysqlHelper.single(`select count(*) from user where last_login_time <?`, tempDate.getTime());
                    res.push({
                        key,
                        value
                    });
                }
                lastDate = tempDate;
            }
            res = res.reverse();
            res = JSON.stringify(res);
            await redisHelper.setString(redisKey, res,30*60);
        }
        return res;
    }

    //获取在用户书数目,上次访问时间半小时内认为在线，每五分钟更新一次数据
    static async getUserOnline() {
        let redisKey = 'userOnlineNum';
        let res = await redisHelper.getString(redisKey);
        if (res == null) {
            res = await mysqlHelper.single(`select count(*) from user where last_login_time > ?`, Date.now() - 30 * 60 * 1000);
            await redisHelper.setString(redisKey, res, 5 * 60);
        }
        return res;
    }

    static async getAllTeacher() {
        return await mysqlHelper.row(`select u_id,u_name from user where u_type in (0,1)`);
    }

    static async addSingleUser(data) {
        //检查学工号是否存在
        let isExist = await mysqlHelper.single(`select count(*) from user where code=?`, data.code);
        if (isExist) {
            throw ErrorHelper.newError("该学号已存在", 403);
        }
        let res = await mysqlHelper.execute(`
            insert into user(j_id,u_name,u_type,code,password,email_addr,icon,last_login_time,create_time) value(?,?,?,?,?,?,?,0,${Date.now()})
        `, data.u_type, data.u_name, data.u_type, data.code, data.password, '', 'default.jpg');
        return res.insertId;
    }

    static async updateOne(data) {
        if (stringHelper.isEmpty(data.password)) {
            await mysqlHelper.execute(`
                update user set u_name=?,u_type=?,email_addr=?,code=? where u_id=?
                `, data.u_name, data.u_type, data.email_addr, data.code, data.u_id);
        } else {
            await mysqlHelper.execute(`
                update user set u_name=?,u_type=?,email_addr=?,code=?,password=? where u_id=?
                `, data.u_name, data.u_type, data.email_addr, data.code, data.password, data.u_id);
        }
        await redisHelper.deleteKey(data.u_id + '_userInfo');
    }

    static async updateStudentInfo(param, u_id) {
        let res;
        if (param.password == '') {
            res = await mysqlHelper.update(`update user set u_name=?,code=?,email_addr=? where u_id=?`, param.u_name, param.code, param.email_addr, u_id);
        } else {
            res = await mysqlHelper.update(`
                update user set u_name=?,code=?,password=?,email_addr=? where u_id=?
                `, param.u_name, param.code, param.password, param.email_addr, u_id)
        }
    }

    static async updateSimpleInfo(data) {
        if (data.icon != undefined) {
            let icon = data.u_id + '_' + stringHelper.getRandomString(0, 10) + '.jpg';
            await mysqlHelper.execute(`update user set icon=? where u_id=?`, icon, data.u_id);
            await fs.rename(data.icon.path, path.join(config.rootPath, `files/userIcon/${icon}`));
        } else if (data.sex != undefined) {
            await mysqlHelper.execute(`update user set sex=? where u_id=?`, data.sex, data.u_id);
        }
    }

    static async updatePassword(oldPass, newPass, u_id) {
        let password = await mysqlHelper.single(`select password from user where u_id=?`, u_id);
        if (oldPass != password) {
            throw ErrorHelper.Error400("旧密码错误");
        }
        await mysqlHelper.execute(`update user set password=? where u_id=?`, newPass, u_id);
    }

    static async updateEmail(password, newEmail, u_id) {
        let realPassword = await mysqlHelper.single(`select password from user where u_id=?`, u_id);
        if (password != realPassword) {
            throw ErrorHelper.Error400('密码错误');
        }
        await mysqlHelper.execute(`update user set email_addr=? where u_id=?`, newEmail, u_id);
    }

    static async deleteById(id) {
        await mysqlHelper.execute(`delete from user where u_id = ?`, id);
    }
}

module.exports = userDao;