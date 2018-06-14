const badgeDao = require('../dao/badgeDao.js');
const config = require('../config/config.js');

//获取某用户所拥有的徽章
exports['GET /user/:u_id/badge'] = async ctx => {
    let res = await badgeDao.getUserBadge(ctx.params.u_id);
    res.forEach(item => {
        item.b_img = config.host + '/badgeIcon/' + item.b_img;
    })
    ctx.onSuccess(res);
}

//获取课程门数徽章详细数据
exports['GET /user/:u_id/badge/:b_id'] = async ctx => {
    let {u_id,b_id,type} = ctx.params;
    let res = await badgeDao.getBadgeDetail(u_id,b_id,ctx.allParams.type);
    res.next.b_img = config.host + '/badgeIcon/' + res.next.b_img;
    ctx.onSuccess(res);
}