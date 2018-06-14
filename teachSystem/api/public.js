const publicDao = require("../dao/publicDao.js");
exports['POST /public/img_upload']=async ctx=>{
    let res = await publicDao.uploadImg(ctx.allParams);
    ctx.onSuccess(res);
}

exports['GET /public/system_time']=async ctx=>{
    ctx.onSuccess(Date.now());
}