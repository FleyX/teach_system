'use strict'
const announcementDao = require('../dao/announcementDao.js');
const announcementHelper = require('./announcementHelper.js');
const ErrorHelper = require('../util/ErrorHelper.js');

/**
 * 获取公告 /announcement
 * {
 *   start:0, //开始下标
 *   column:'topic',//排序字段
 *   sort:'desc',//排序顺序
 *   count:true, //是否返回总数
 *   c_id:''
 * }
 */
exports['GET /announcement']= async (ctx, next) => {
    let params = announcementHelper.checkGetParam(ctx.allParams.data);
    let res = await announcementDao.getByParam(params);
    ctx.onSuccess(res);
}

//获取某门课下所有可显示公告
exports['GET /course/:c_id/announcement/open']=async(ctx,next)=>{
    let res = await announcementDao.getOpenAnnouncement(ctx.params.c_id);
    ctx.onSuccess(res);
}

/**
 * 获取公告内容 
 */
exports['GET /announcement/:a_id/content']= async (ctx, next) => {
    let res = await announcementDao.getContent(ctx.params.a_id);
    ctx.onSuccess(res);
}

/**
 * 切换公告显示状态
 * url param:
 *   action:切换到true/false
 */
exports['PUT /announcement/:a_id/switch']= async (ctx, next) => {
    let res = await announcementDao.switchOne(ctx.params.a_id,ctx.allParams.action);
    ctx.onSuccess(res);
}
/**
 * 插入一条公告记录 /announcement
 */
exports['POST /announcement']= async (ctx, next) => {
    await announcementDao.addOne(ctx.allParams);
    ctx.onSuccess();
}
/**
 * 删除一个公告
 */
exports['DELETE /announcement/:a_id']= async (ctx, next) => {
    await announcementDao.deleteOne(ctx.params.a_id);
    ctx.onSuccess();
}