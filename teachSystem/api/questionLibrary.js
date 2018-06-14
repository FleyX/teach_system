'use strict'
const questionLibraryHelper = require('./questionLibraryHelper.js');
const questionLibraryDao = require('../dao/questionLibraryDao.js');

/**
 * 条件检索用户
 * {
 *  searchContent:'', 搜索内容
 *  searchColumn:'', 搜索字段
 *  c_id:'',课程id
 *  q_type:[],显示题型
 *  isExam:0/1/2 0:练习用 1：考试用 2：所有
 *  count:false 是否返回总记录数
 *  start:0
 *  pageSize:10
 * }
 */
exports["GET /question_library"] = async (ctx, next) => {
    let params = questionLibraryHelper.checkGetParam(ctx.allParams);
    let res = await questionLibraryDao.getByParam(params);
    ctx.onSuccess(res);
}

//获取展示题目需要信息
exports["GET /question_library/:ql_id/show_question"] = async (ctx, next) => {
    let res = await questionLibraryDao.getShowQuestion(ctx.params.ql_id);
    ctx.onSuccess(res);
}

/**
 * 插入题目
 */
exports["POST /question_library"] = async (ctx, next) => {
    questionLibraryHelper.checkPostParam(ctx.allParams);
    let res = await questionLibraryDao.addOne(ctx.allParams);
    ctx.onSuccess(res);
}

/**
 * 删除题目
 */
exports["DELETE /question_library/:ql_id"] = async (ctx, next) => {
    await questionLibraryDao.deleteOne(ctx.params.ql_id);
    ctx.onSuccess();
}

/**
 * 批量删除题目
 */
exports["DELETE /course/:c_id/question_library"] = async (ctx, next) => {
    let id = ctx.allParams.id.split(',');
    let failList = [];
    for (let i = 0; i < id.length; i++) {
        try {
            await questionLibraryDao.deleteOne(id[i]);
        } catch (err) {
            failList.push(id[i]);
        }
    }
    ctx.onSuccess(failList);
}