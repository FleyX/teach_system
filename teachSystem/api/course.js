'use strict'
const uuid = require('uuid/v1');
const courseDao = require('../dao/courseDao.js');
const courseHelper = require('./courseHelper.js');
const ErrorHlper = require('../util/ErrorHelper.js');

//获取所有课程
exports['GET /course'] = async (ctx, next) => {
    let res = await courseDao.getAllCourse();
    ctx.onSuccess(res);
}

//获取该门课程统计信息 1.学生数 2.能力值占比
exports['GET /course/:c_id/statistics'] = async ctx => {
    let res = await courseDao.getCourseStatistics(ctx.params.c_id);
    ctx.onSuccess(res);
}

//获取某门课程任课教师
exports['GET /course/:c_id/teacher']=async ctx=>{
    let res=await courseDao.getTeacher(ctx.params.c_id);
    ctx.onSuccess(res);
}

//获取该课程排行前三十名 type=evaluate/coverage
exports['GET /course/:c_id/top30'] = async (ctx, next) => {
    let type = ctx.allParams.type;
    if (type != 'evaluate' && type != 'coverage')
        throw ErrorHlper.Error400("type参数不合法");
    let res = await courseDao.getTop30(ctx.params.c_id, type);
    ctx.onSuccess(res);
}
//获取某学生某门课程能力值 type=evaluate/coverage
exports['GET /user/:u_id/course/:c_id/rank'] = async (ctx, next) => {
    let type = ctx.allParams.type;
    if (type != 'evaluate' && type != 'coverage')
        throw ErrorHlper.Error400("type参数不合法");
    let res = await courseDao.getStudentEvaluate(ctx.params.c_id, ctx.params.u_id, type);
    ctx.onSuccess(res);
}

// 根据用户id获取已注册课程
exports['GET /user/:u_id/course'] = async (ctx, next) => {
    if (ctx.params.u_id != ctx.userInfo.u_id) {
        throw ErrorHlper.authError();
    }
    let res;
    if (ctx.userInfo.u_type == 3)
        res = await courseDao.getCourseByUId(ctx.userInfo.u_id);
    else
        res = await courseDao.getByUserId(ctx.params.u_id);
    ctx.onSuccess(res);
}

/**
 * 根据c_id 查询基本信息 /course/base_info
 *   c_id:''
 *   column:'c_name' //待需要查询字段
 */
exports['GET /course/base_info'] = async (ctx, next) => {
    courseHelper.checkGetBaseInfoParam(ctx.allParams);
    let res = await courseDao.getBaseInfo(ctx.allParams);
    ctx.onSuccess(res);
}

/**
 * 构建一颗课程班级树
 */
exports['GET /course/tree'] = async (ctx, next) => {
    let res = await courseDao.getTree(ctx.allParams.c_id);
    ctx.onSuccess(res);
}

/**
 * 构建一颗知识点树 /course/:c_id/knowledge_point_tree
 */
exports['GET /course/:c_id/knowledge_point_tree'] = async (ctx, next) => {
    let res = await courseDao.getKnowledgePointTree(ctx.params.c_id);
    ctx.onSuccess(res);
}

/**
 * 新增一个 
 */
exports['POST /course'] = async (ctx, next) => {
    let res = await courseDao.addOne(ctx.allParams);
    ctx.onSuccess(res);
}

/**
 * 修改一个 /course/:c_id
 */
exports['PUT /course/:c_id'] = async (ctx, next) => {
    let params = ctx.allParams;
    let c_id = ctx.params.c_id;
    await courseDao.updateOne(params, c_id);
    ctx.onSuccess();
}

/**
 * 修改课程基本信息 /course/:c_id/base_info
 */
exports['PUT /course/:c_id/base_info'] = async (ctx, next) => {
    await courseDao.updateBaseInfo(ctx.allParams, ctx.params.c_id);
    ctx.onSuccess();
}

/**
 * 删除一个 /course/:c_id
 */
exports['DELETE /course/:c_id'] = async (ctx, next) => {
    await courseDao.deleteOne(ctx.params.c_id);
    ctx.onSuccess();
}