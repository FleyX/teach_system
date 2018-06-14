'use strict'
const knowledgePointDao = require('../dao/knowledgePointDao.js');

/**
 * 返回某门课的全部知识点,按章节分类
 */
exports["GET /course/:c_id/knowledge_point"] = async (ctx, next) => {
    let res = await knowledgePointDao.getPontsOrderBySection(ctx.params.c_id);
    ctx.onSuccess(res);
}

//返回某位学生知识点答题情况
exports["GET /user/:u_id/course/:c_id/knowledge_point/condition"]=async(ctx,next)=>{
    let {u_id,c_id}=ctx.params;
    let res = await knowledgePointDao.getStudentCondition(u_id,c_id);
    ctx.onSuccess(res);
}

/**
 * 新增一个知识点
 */
exports["POST /knowledge_point"] = async (ctx, next) => {
    let res = await knowledgePointDao.addOne(ctx.allParams);
    ctx.onSuccess(res);
}

/**
 * 删除一个知识点
 */
exports[`DELETE /knowledge_point/:kp_id`] = async (ctx, next) => {
    await knowledgePointDao.deleteOne(ctx.params.kp_id);
    ctx.onSuccess();
}