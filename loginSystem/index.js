'use strict'

const Koa = require('koa');
const Router = require('koa-router');
const parser = require('koa-bodyparser');
const captcha = require('trek-captcha');
const config = require('./config/config.js');
const cors = require('koa2-cors');

const logger = require('./log/log.js');
const service = require('./service.js');

console.log(config);
const app = new Koa();
const router = new Router({
    prefix: config.url_prefix
});
console.log(router);
router.post('/login', service.login)

router.get('/authcode', service.authCode)

router.post('/reset-password', service.resetPass)

router.post('/mail-auth-code', service.sendMail)
app.use(async (ctx, next) => {
    let ip = config.env == 'development' ? ctx.ip : ctx.request.header['x-real-ip'];
    logger.login(ip, ctx.path);
    await next();
})

app.use(parser());
app.use(cors());
app.use(router.routes());
app.listen(config.port);
console.log('login server listen on ', config.port);