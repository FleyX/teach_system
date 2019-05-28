const config = require("../config/config.js");
const ObjectHelper = require("../util/ObjectOperate");
const Log = require("../log/log.js");

let doSuccess = (ctx, body) => {
  switch (ctx.method) {
    case "GET":
      ctx.status = body !== null ? 200 : 204;
      ctx.body = body;
      break;
    case "POST":
      ctx.status = body !== null ? 201 : 204;
      ctx.body = body;
      break;
    case "PUT":
      ctx.status = body !== null ? 200 : 204;
      ctx.body = body;
      break;
    case "DELETE":
      ctx.status = body !== null ? 200 : 204;
      ctx.body = body;
      break;
  }
  Object.assign(ctx.allParams, ctx.params);
  //记录用户操作
  if (ctx.userInfo != undefined) {
    Log.operate(ctx.userInfo.u_id, ctx.path, ctx.method, JSON.stringify(ctx.allParams));
  }
};

let doFail = (ctx, body) => {
  if (body != null && body.message == "403") {
    ctx.status = 403;
    ctx.body = "无操作权限";
  } else {
    ctx.status = 400;
    ctx.body = body.message;
  }
};

module.exports = async (ctx, next) => {
  //合并请求参数到allParams
  let objs = [];
  if (ctx.method == "POST" || ctx.method == "PUT") {
    if (ctx.request.body) {
      if (ctx.request.body.fields != undefined && ctx.request.body.files != undefined) {
        objs.push(ctx.request.body.fields, ctx.request.body.files);
      } else {
        objs.push(ctx.request.body);
      }
    }
  }
  objs.push(ctx.query);
  ctx.allParams = ObjectHelper.combineObject(objs);

  ctx.onSuccess = function(body = null) {
    doSuccess(ctx, body);
  };
  ctx.onFail = function(body = null) {
    doFail(ctx, body);
  };
  let ip = config.env == "development" ? ctx.ip : ctx.request.header["x-real-ip"];
  Log.visit(ip, ctx.URL.pathname, ctx.method);
  await next();
};
