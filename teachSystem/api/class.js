'use strict'
const classDao = require('../dao/classDao.js');
const classHelper = require('./classHelper.js');
/**
 * 获取一个班的学生 /class/:class_id/user
 */
let get_classId_user = async (ctx, next) => {
    let res = await classDao.getStudentOfClass(ctx.params.class_id);
    ctx.onSuccess(res);
}

/**
 * 新增一个班级
 */
let post = async (ctx, next) => {
    let res = await classDao.addOne(ctx.allParams);
    ctx.onSuccess(res);
}

/**
 * 新增一名学生 /class/:class_id/add_one_student
 */
let post_addOneStudent = async (ctx, next) => {
    await classDao.addOneStudent(ctx.params.class_id, ctx.allParams);
    ctx.onSuccess();
}

/**
 *execl提交，批量新增 /class/:class_id/add_many_student
 *execl格式：（无标题）第一列：姓名，第二列：学号，第三列：密码（如账号已存在 ，密码设置无效）
 */
let post_addManyStudent = async (ctx, next) => {
    let tableData = classHelper.getTableInfo(ctx.allParams.xlsx);
    let res = await classDao.addManyStudent(ctx.allParams.class_id, tableData);
    ctx.onSuccess(res);
}

/**
 * 从班级中删除一名学生 /class/:class_id/user/:u_id
 */
let delete_classId_user_uId = async (ctx, next) => {
    await classDao.deleteOneStudent(ctx.params.class_id, ctx.params.u_id);
    ctx.onSuccess();
}

/**
 * 删除一个班级 /class/:class_id
 */
let delete_classId=async(ctx,next)=>{
    await classDao.deleteOneClass(ctx.params.class_id);
    ctx.onSuccess();
}

module.exports = {
    'GET /class/:class_id/user': get_classId_user,
    'POST /class': post,
    'POST /class/:class_id/add_one_student': post_addOneStudent,
    'POST /class/:class_id/add_many_student': post_addManyStudent,
    'DELETE /class/:class_id/user/:u_id': delete_classId_user_uId,
    "DELETE /class/:class_id":delete_classId
}