const Koa = require('koa');
const Router = require('koa-router');
const RouterMW = require('./middleware/controllerEngine.js');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const path = require('path');
const fs = require('fs');
const static = require('koa-static');

const config = require('./config/config.js');
const handleError = require('./middleware/handleError.js');
const auth = require('./middleware/auth.js');
const init = require('./middleware/init.js');
console.log(config);

const app = new Koa();
// 开发阶段使用koa-static返回静态文件，部署后使用nginx代理
app.use(static(config.staticPath));


let router = new Router({
    prefix: config.url_prefix
});

app.use(cors());

app.use(koaBody(config.bodyLimit));

app.use(init);

app.use(handleError);

router.use(auth);
app.use(RouterMW(router, path.join(config.rootPath, 'api')));

app.listen(config.port);
console.log('server listened ', config.port);