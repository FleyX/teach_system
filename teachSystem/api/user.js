'use strict'
const fs = require('fs');
const path = require('path');
const config = require('../config/config.js');
const userDao = require('../dao/userDao.js');
const userHelper = require('./userHelper.js');
const ErrorHelper = require('../util/ErrorHelper.js');
const xlsx = require('js-xlsx');

/**
 * 查询用户 /user
 * orderBy:'' 默认u_id
 * start:'' 默认0
 * sort:'' 1:desc 0:asc
 * search:{
 *     filed:'',
 *     content:''
 * },
 * count:true 是否需要返回总数
 * u_type: [0,1,2] 过滤用户类型
 */
exports['GET /user'] = async (ctx, next) => {
    let params = userHelper.getParams(ctx.allParams.data);
    let res = await userDao.getUserByParam(params);
    ctx.onSuccess(res);
}

//根据u_id查询用户信息
exports['GET /user/:u_id'] = async (ctx, next) => {
    let sum = await userDao.getUserById(ctx.params.u_id);
    delete sum.password;
    sum.icon = config.host + '/userIcon/' + sum.icon;
    ctx.onSuccess(sum);
}

//查询所有用户登录情况
exports['GET /user/statistics/login_time']=async(ctx,next)=>{
    let res = await userDao.getUserLoginTime();
    ctx.onSuccess(res);
}

//查询在线用户数量
exports['GET /user/statistics/online'] = async(ctx,next)=>{
    let res = await userDao.getUserOnline();
    ctx.onSuccess(res);
}

// 返回所有的教师(包括管理员)
exports['GET /user/teachers/all'] = async (ctx, next) => {
    let res = await userDao.getAllTeacher();
    ctx.onSuccess(res);
}



//管理员修改user单条记录
exports['PUT /user/change_person_info'] = async (ctx, next) => {
    await userDao.updateOne(ctx.allParams);
    ctx.onSuccess();
    await next();
}

//教师修改学生信息 /user/:u_id/change_student_info
exports['PUT /user/:u_id/change_student_info'] = async (ctx, next) => {
    await userDao.updateStudentInfo(ctx.allParams, ctx.params.u_id);
    ctx.onSuccess();
}


//修改个人信息，头像或者性别
exports['PUT /user/change_simple_info'] = async (ctx, next) => {
    if (ctx.allParams.u_id != ctx.userInfo.u_id) {
        throw ErrorHelper.authError();
    }
    await userDao.updateSimpleInfo(ctx.allParams);
    ctx.onSuccess();
}

// 修改绑定邮箱 
exports["PUT /user/change_email"] = async (ctx, next) => {
    await userDao.updateEmail(ctx.allParams.password, ctx.allParams.newEmail, ctx.userInfo.u_id);
    ctx.onSuccess();
}

//修改密码
exports["PUT /user/change_password"] = async (ctx, next) => {
    userHelper.checkChangePasswordParams(ctx.allParams);
    await userDao.updatePassword(ctx.allParams.password, ctx.allParams.newPassword, ctx.userInfo.u_id);
    ctx.onSuccess();
}

//新增单条记录  /user
exports['POST /user'] = async (ctx, next) => {
    userHelper.checkAddUserParams(ctx.allParams);
    let sum = await userDao.addSingleUser(ctx.allParams);
    ctx.onSuccess(sum);
    await next();
}


// 删除记录 
exports['DELETE /user/:u_id'] = async (ctx, next) => {
    if (ctx.params.u_id == ctx.userInfo.u_id) {
        throw ErrorHelper.newError("无法删除自己", 403);
    }
    await userDao.deleteById(ctx.params.u_id);
    ctx.onSuccess();
}