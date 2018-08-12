const MysqlHelper = require('../util/MysqlHelper.js');
const ErrorHelper = require('../util/ErrorHelper.js');

class questionAnswerDao {
    static async getQuestionAnswer(u_id, c_id, type, isClosed) {
        let res;
        if (type == 'start')
            res = await MysqlHelper.row(`
                select * from user_question_answer_view where start_u_id=? and c_id=? and is_closed=? 
                `, u_id, c_id, isClosed);
        else if (type == 'reply')
            res = await MysqlHelper.row(`
                select * from user_question_answer_view where reply_u_id=? and c_id=? and is_closed=? 
                `, u_id, c_id, isClosed);
        else if (type == 'all')
            res = await MysqlHelper.row(`
                select * from user_question_answer_view where (start_u_id=? or reply_u_id=?) and c_id=? and is_closed=? 
                `, u_id, u_id, c_id, isClosed);
        return res;
    }

    static async getMessages(u_id, qa_id, time, type) {
        let res, str;
        if (type == 'start') {
            str = 'start_u_id=?';
        } else if (type == 'reply') {
            str = 'reply_u_id=?';
        } else
            throw ErrorHelper.Error400("type类型错误");
        res = await MysqlHelper.row(`
            select u_id,content,send_time from question_answer_detail_view where ${str} and send_time>? and qa_id=?
            `, u_id, time, qa_id);
        //清除未读标记
        if (res.length > 0) {
            if (type == 'start') {
                await MysqlHelper.execute(`update question_answer set is_new_reply=0 where qa_id=?`, qa_id);
            } else {
                await MysqlHelper.execute(`update question_answer set is_new_question=0 where qa_id=?`, qa_id);
            }
        }
        return res;
    }

    static async addOne(u_id, params) {
        let now = Date.now();
        let res = await MysqlHelper.insert(`
            insert into question_answer(c_id,start_u_id,reply_u_id,create_time,last_update_time,topic) value(?,?,?,?,?,?)
            `, params.c_id, u_id, params.id, now, now, params.topic);
        return res;
    }

    static async addOneMessage(u_id, qa_id, content) {
        let data= await MysqlHelper.first(`select start_u_id,is_closed from question_answer where (start_u_id=? or reply_u_id=?) and qa_id=?`, u_id, u_id,qa_id);
        if (data != null) {
            if(data.is_closed===1)
                throw ErrorHelper.Error403("该答疑已被关闭，无法发送消息");
            let res = await MysqlHelper.insert(`
                insert into question_answer_detail(u_id,qa_id,send_time,content) value(?,?,?,?)
                `, u_id, qa_id, Date.now(), content);
            if (u_id === data.start_u_id) {
                await MysqlHelper.update(`update question_answer set is_new_question=1 where qa_id=?`, qa_id);
            } else {
                await MysqlHelper.update(`update question_answer set is_new_reply =1 where qa_id=?`, qa_id);
            }
            return res;
        } else {
            throw ErrorHelper.Error403("操作失败");
        }
    }

    static async closeOne(u_id, start_u_id, qa_id) {
        if (u_id === start_u_id) {
            await MysqlHelper.execute(`update question_answer set is_closed=1 where start_u_id=?  and qa_id=?`, u_id, qa_id);
        } else {
            await MysqlHelper.execute(`update question_answer set is_closed=1 where reply_u_id=?  and qa_id=?`, u_id, qa_id);
        }
    }
}

module.exports = questionAnswerDao;