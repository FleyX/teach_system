'use strict'
let f = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        if (error.status != undefined) {
            ctx.status = error.status;
        } else {
            ctx.status = 500;
        }
        ctx.body = error.message;
        console.error(error);
    }
}

module.exports = f;