const uuid = require('uuid/v1');
const gradeDao = require('../dao/gradeDao.js');

/**
 * 获取某门课程下所有的年级
 * /course/:c_id/grade
 */
let get_course_cId_grade = async (ctx, next) => {
    let res = await gradeDao.getByCourseId(ctx.params.c_id);
    ctx.onSuccess(res);
}

let post = async (ctx, next) => {
    let res = await gradeDao.addOne(ctx.allParams);
    ctx.onSuccess(res);
}

/**
 * 删除一个年级，仅当该年级下无班级时才可删除 
 */
let delete_gId= async (ctx, next) => {
    await gradeDao.deleteOneGrade(ctx.params.g_id);
    ctx.onSuccess();
}

module.exports = {
    'GET /course/:c_id/grade': get_course_cId_grade,
    'POST /grade': post,
    'DELETE /grade/:g_id': delete_gId
}