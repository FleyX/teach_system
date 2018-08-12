const ErrorHelper = require('../util/ErrorHelper.js');
const MysqlHelper = require("../util/MysqlHelper.js");

class testHelper {
    static checkGetParam(param) {
        try {
            param = JSON.parse(new Buffer(param.data, 'base64').toString());
        } catch (err) {
            throw ErrorHelper.Error400("参数不符合要求");
        }
        return param;
    }
    //检查能否获取测试题
    static async checkTest(u_id, c_id, test_id) {
        let testData = await MysqlHelper.first(`
            select sc_id,submit_time,start_time,end_time,t_type,start_do_time from student_test_view where u_id=? and c_id=? and test_id=?
            `, u_id, c_id, test_id);
        if (testData == null)
            throw ErrorHelper.Error400("本次测试不存在");
        let now = Date.now();
        if (testData.start_time > now)
            throw ErrorHelper.Error400("测试还未开始");
        if (testData.t_type == 2 && testData.submit_time > 0 && testData.end_time > now)
            throw ErrorHelper.Error403("考试正在进行，且您已提交，无法获取题目");
        if (testData.end_time > now && testData.start_do_time == null)
            await MysqlHelper.update(`update student_test set start_time = ? where sc_id=? and test_id=?`, Date.now(), testData.sc_id, test_id);
    }
    //检查是否可以提交答案
    static async checkSubmit(u_id, c_id, test_id) {
        let testData = await MysqlHelper.first(`
            select sc_id,submit_time,start_time,end_time,t_type,start_do_time from student_test_view where u_id=? and c_id=? and test_id=?
            `, u_id, c_id, test_id);
        if (testData == null)
            throw ErrorHelper.Error400("本次测试不存在");
        let now = Date.now();
        if (testData.start_time > now)
            throw ErrorHelper.Error400("测试还未开始");
        if ((testData.end_time - now) < -60 * 1000) //一分钟缓冲时间，避免提交失败
            throw ErrorHelper.Error400("测试已经结束");
        // if (testData.submit_time > 0)
        //     throw ErrorHelper.Error400("已经提交答案，请勿重复提交");
    }
}

module.exports = testHelper;