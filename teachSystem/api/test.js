'use strict'
const testDao = require('../dao/testDao.js');
const testHelper = require('./testHelper.js');
const ErrorHelper = require('../util/ErrorHelper.js');
/**
 * 条件查询测试
 */
exports["GET /test"] = async (ctx, next) => {
    let res = await testDao.getByCId(ctx.allParams.c_id);
    ctx.onSuccess(res);
}

//测试数目统计
exports["GET /test/statistics/test_num"] = async ctx => {
    let res = await testDao.getTestNum();
    ctx.onSuccess(res);
}

//代码查重
exports["GET /test/:test_id/code_check"] = async ctx => {
    let res = await testDao.codeCheck(ctx.params.test_id, ctx.allParams.type);
    ctx.onSuccess(res);
}

//查找某学生某门客测试 ?type=类型&isCurrent=是否当前待完成
exports['GET /user/:u_id/course/:c_id/test'] = async (ctx, next) => {
    let res = await testDao.getTest(ctx.userInfo.u_id, ctx.params.c_id, ctx.allParams);
    ctx.onSuccess(res);
}

//查找某学生某门客所有知识点练习
exports['GET /user/:u_id/course/:c_id/knowledge_test'] = async (ctx, next) => {
    let res = await testDao.getKnowledgeTest(ctx.params.u_id, ctx.params.c_id);
    ctx.onSuccess(res);
}

//查询某学生所有待完成测试包括作业和考试
exports['GET /user/:u_id/test/undo'] = async (ctx, next) => {
    let res = await testDao.getUndoTest(ctx.params.u_id);
    ctx.onSuccess(res);
}


//返回测试题目
exports['GET /user/:u_id/course/:c_id/test/:test_id/detail'] = async (ctx, next) => {
    //检查是否是否可以查看题目
    await testHelper.checkTest(ctx.userInfo.u_id, ctx.params.c_id, ctx.params.test_id);
    let res = await testDao.getTestDetail(ctx.userInfo.u_id, ctx.params.c_id, ctx.params.test_id);
    ctx.onSuccess(res);
}

//返回学生提交的答案
exports['GET /user/:u_id/course/:c_id/test/:test_id/answer'] = async (ctx, next) => {
    let res = await testDao.getAnswer(ctx.userInfo.u_id, ctx.params.c_id, ctx.params.test_id);
    ctx.onSuccess(res);
}

//返回一次测试的详细信息:提交情况，高错误率题目，高错误率知识点，查看成绩：表格，统计图表
exports['GET /test/:test_id/detail'] = async (ctx) => {
    let res = await testDao.getTestSum(ctx.params.test_id, ctx.allParams.type);
    ctx.onSuccess(res);
}

//新增一个测试
exports["POST /test"] = async (ctx, next) => {
    let res = await testDao.addOne(ctx.allParams);
    ctx.onSuccess(res);
}

//新增一个知识点专项练习
exports["POST /user/:u_id/course/:c_id/test"] = async (ctx, next) => {
    let res = await testDao.addOneKnowledgeTest(ctx.params.u_id, ctx.params.c_id, ctx.allParams);
    ctx.onSuccess(res);
}

//提交答案
exports["PUT /user/:u_id/course/:c_id/test/:test_id/submit_answer"] = async (ctx, next) => {
    //检查是否可以提交答案
    await testHelper.checkSubmit(ctx.userInfo.u_id, ctx.params.c_id, ctx.params.test_id);
    await testDao.submitAnswer(ctx.userInfo.u_id, ctx.params.c_id, ctx.params.test_id, ctx.allParams.answer);
    ctx.onSuccess();
}

//删除某学生某课程当前知识点专项练习
exports['DELETE /user/:u_id/course/:c_id/test/:test_id/knowledge'] = async (ctx, next) => {
    await testDao.deleteKnowledgeTest(ctx.userInfo.u_id, ctx.params.c_id, ctx.params.test_id);
    ctx.onSuccess();
}

//删除一个测试
exports["DELETE /course/:c_id/test/:test_id"] = async (ctx, next) => {
    await testDao.deleteOne(ctx.params.c_id, ctx.params.test_id);
    ctx.onSuccess();
}