const questionAnswerDao = require("../dao/questionAnswerDao.js");

//获取一个用户的对话type=start/reply/all(我发起的/我解答的/全部)
//?type=start&c_id=&is_closed=1
exports['GET /question_answer'] = async ctx => {
    let {
        c_id,
        type,
        is_closed
    } = ctx.allParams;
    let res = await questionAnswerDao.getQuestionAnswer(ctx.userInfo.u_id, c_id, type, is_closed);
    ctx.onSuccess(res);
}

//获取某对话消息中时间大于time的 time=?
exports['GET /question_answer/:qa_id/detail'] = async ctx => {
    let {
        time,
        type
    } = ctx.allParams;
    let res = await questionAnswerDao.getMessages(ctx.userInfo.u_id, ctx.params.qa_id, time, type);
    ctx.onSuccess(res);
}

//新建一个答疑对话
exports['POST /question_answer'] = async ctx => {
    let res = await questionAnswerDao.addOne(ctx.userInfo.u_id, ctx.allParams);
    ctx.onSuccess(res);
}

//对话中新增一条消息
exports['POST /question_answer/:qa_id/question_answer_detail'] = async ctx => {
    let res = await questionAnswerDao.addOneMessage(ctx.userInfo.u_id, ctx.params.qa_id, ctx.allParams.content);
    ctx.onSuccess(res);
}

//关闭一个答疑对话 
exports['PUT /question_answer/:qa_id/close'] = async ctx => {
    await questionAnswerDao.closeOne(ctx.userInfo.u_id, ctx.allParams.start_u_id, ctx.params.qa_id);
    ctx.onSuccess();
}