const publicDao = require("../dao/publicDao.js");
/**
 * 图片上传
 */
exports["POST /public/img_upload"] = async ctx => {
  let res = await publicDao.uploadImg(ctx.allParams);
  ctx.onSuccess(res);
};

/**
 * 获取系统时间
 */
exports["GET /public/system_time"] = async ctx => {
  ctx.onSuccess(Date.now());
};

/**
 * 登录
 */
exports["POST /public/login"] = async ctx => {
  await publicDao.login(ctx);
};

/**
 * 获取验证码
 */
exports["GET /public/authcode"] = async ctx => {
  await publicDao.authCode(ctx);
};

/**
 * 重置密码
 */
exports["POST /public/reset-password"] = async ctx => {
  await publicDao.resetPass(ctx);
};

exports["POST /public/mail-auth-code"] = async ctx => {
  await publicDao.sendMail(ctx);
};
