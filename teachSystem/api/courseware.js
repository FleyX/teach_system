const coursewareDao = require('../dao/coursewareDao.js');
const uuid = require('uuid/v1');
const fs = require('fs-extra');

/**
 * 获取某一门课课件 /course/:c_id/courseware
 */
exports['GET /course/:c_id/courseware'] = async (ctx, next) => {
    let res = await coursewareDao.getAllofClass(ctx.params.c_id);
    ctx.onSuccess(res);
}


/**
 * 提交课件 /course/:c_id/courseware
 */
exports['POST /course/:c_id/courseware'] = async (ctx, next) => {
    let res = await coursewareDao.add(ctx.params.c_id, ctx.request.body.files);
    ctx.onSuccess(res);
}

/**
 * 删除课件/course/:c_id/courseware/:cw_id
 */
exports['DELETE /course/:c_id/courseware/:cw_id'] = async (ctx, next) => {
    await coursewareDao.deleteOne(ctx.params.c_id, ctx.params.cw_id);
    ctx.onSuccess();
}