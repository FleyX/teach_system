"use strict";
const Log = require("../log/log.js");
const config = require("../config/config.js");
const redisHelper = require("../util/RedisHelper.js");
const mysqlHelper = require("../util/MysqlHelper.js");
const StringHelper = require("../util/StringHelper.js");
const TimeHelper = require("../util/TimeHelper.js");
const jwt = require("jsonwebtoken");

let jurisdictionMap = null;

/**
 * 1 验证成功
 * 2 登录信息无效 401
 * 3 已登录，无操作权限 403
 * 4 token已过期
 */
let verify = async ctx => {
  let currentUrl = ctx._matchedRoute.replace(config.url_prefix, "");
  if (currentUrl.startsWith("/public")) {
    return 1;
  }
  let token = ctx.headers.authorization;
  if (typeof token != "string") {
    return 2;
  }
  let yan = await redisHelper.getString(token);
  if (yan == null) {
    return 2;
  }
  let data;
  try {
    data = jwt.verify(token, yan);
  } catch (e) {
    return 2;
  }
  if (data.exp * 1000 < Date.now()) {
    return 4;
  }
  //判断是否需要刷新token，如需要刷新将新token写入响应头
  if (!data.isRememberMe && data.exp * 1000 - Date.now() < 30 * 60 * 1000) {
    //token有效期不足半小时，重新签发新token给客户端
    let newYan = StringHelper.getRandomString(0, 10);
    let newToken = jwt.sign(
      {
        u_id: data.u_id,
        isRememberMe: false
      },
      newYan,
      {
        expiresIn: config.shortTokenExpiration
      }
    );
    // await redisHelper.deleteKey(token);
    await redisHelper.setString(newToken, newYan, config.shortTokenExpiration);
    ctx.response.set("new-token", newToken);
    ctx.response.set("Access-Control-Expose-Headers", "new-token");
  }
  //获取用户信息
  let userInfoKey = data.u_id + "_userInfo";
  let userInfo = await redisHelper.getString(userInfoKey);
  if (userInfo == null) {
    userInfo = await mysqlHelper.first(`select u_id,u_type,j_id from user where u_id=?`, data.u_id);
    await redisHelper.setString(userInfoKey, JSON.stringify(userInfo), 24 * 60 * 60);
  } else {
    userInfo = JSON.parse(userInfo);
  }
  ctx.userInfo = userInfo;
  //更新用户上次访问时间
  mysqlHelper.execute(`update user set last_login_time=? where u_id=?`, Date.now(), userInfo.u_id);
  //管理员拥有全部权限
  if (userInfo.u_type == 0) {
    return 1;
  }
  //获取该用户类型权限
  await initJurisdiction();
  let urls = jurisdictionMap[userInfo.j_id];
  //判断是否拥有权限
  if (urls.hasOwnProperty(currentUrl + ctx.method)) {
    return 1;
  } else {
    return 3;
  }
};

/**
 * 是否正在更新
 */
let isUpdate = false;

/**
 * 初始化角色信息,保持在内存中
 */
let initJurisdiction = async () => {
  if (jurisdictionMap != null) {
    return;
  }
  while (isUpdate) {
    await TimeHelper.sleep(100);
  }
  if (jurisdictionMap != null) {
    return;
  }
  isUpdate = true;
  let urls = await mysqlHelper.row(`select a.j_id, b.r_id,b.url,b.method from jurisdiction_resource a inner join resource b on a.r_id = b.r_id`);
  let temp = {};
  urls.forEach(item => {
    let resourceMap = temp[item["j_id"]];
    if (resourceMap == undefined) {
      resourceMap = {};
      temp[item["j_id"]] = resourceMap;
    }
    resourceMap[item.url + item.method] = true;
  });
  jurisdictionMap = temp;
  isUpdate = false;
};

let auth = async (ctx, next) => {
  let t1, t2, t3;
  t1 = Date.now();
  let sum = await verify(ctx);
  t2 = Date.now();
  if (sum == 1) {
    await next();
    t3 = Date.now();
    Log.responseTime(ctx._matchedRoute, ctx.method, t2 - t1, t3 - t2);
  } else if (sum == 2) {
    //输出无权限错误
    ctx.status = 401;
    ctx.body = "未登录，无访问权限";
  } else if (sum == 3) {
    ctx.status = 403;
    ctx.body = "权限不足";
  } else if (sum == 4) {
    ctx.status = 401;
    ctx.body = "登录信息已过期";
  }
};

module.exports = auth;
