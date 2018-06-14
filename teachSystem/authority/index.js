const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const static = require('koa-static');
const MysqlHelper = require('../util/MysqlHelper.js');

let app = new Koa();
let router = new Router();

let path = require('path');

//获取角色列表
router.get('/role', async (ctx, next) => {
    let res = await MysqlHelper.row('select * from Jurisdiction');
    ctx.body = res;
    console.log(ctx.body);
    await next();
})

//获取资源列表
router.get('/url', async (ctx, next) => {
    let res = await MysqlHelper.row('select * from resource');
    ctx.body = res;
    await next();
})

//获取某个角色权限
router.get('/role_url', async (ctx, next) => {
    let roleId = ctx.query.roleId;
    ctx.body = await MysqlHelper.row(`select b.r_id from Jurisdiction_resource a inner join
        resource b on a.r_id = b.r_id where a.j_id = ?`, roleId);
})

//新增一个角色
router.get('/add_role', async ctx => {
    let name = ctx.query.name;
    let res = await MysqlHelper.execute(`insert into jurisdiction(content) values(?)`,
        name);
    ctx.body = {
        j_id:res.insertId,
        content: name
    }
})

//修改权限
router.get('/change_role_url', async (ctx, next) => {
    let j_id = ctx.query.j_id;
    let urls = JSON.parse(ctx.query.arr);
    await MysqlHelper.execute(`delete from Jurisdiction_resource where 
        j_id=?`, j_id);
    for (let i = 0; i < urls.length; i++) {
        await MysqlHelper.execute(`insert into Jurisdiction_resource values(?,?)`,
            j_id, urls[i]);
    }
    ctx.body = "操作成功";
})

app.use(static(path.join(__dirname, 'static'), {
    maxAge: 0
})).use(koaBody()).use(router.routes()).listen(8084);
console.log("授权管理启动于:8084");