'use strict'
const sectionDao = require('../dao/sectionDao.js');

/**
 * 获取某门课程所有章节
 */
exports['GET /course/:c_id/section'] = async (ctx, next) => {
    let res = await sectionDao.getByCourseId(ctx.params.c_id);
    ctx.onSuccess(res);
}

/**
 * 新增一个章节
 */
exports['POST /section'] = async (ctx, next) => {
    let res = await sectionDao.addOne(ctx.allParams);
    ctx.onSuccess(res);
}
/**
 * 删除一个章节
 */
exports['DELETE /section/:s_id'] = async (ctx, next) => {
    await sectionDao.deleteOne(ctx.params.s_id);
    ctx.onSuccess();
}