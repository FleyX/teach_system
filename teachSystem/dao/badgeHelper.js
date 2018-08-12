const MysqlHelper = require('../util/MysqlHelper.js');
class badgeHelper {
    //检查课程注册门数徽章获取情况
    static async checkCourseNum(u_id) {
        let count = await MysqlHelper.single(`select count(*) from student_evaluate_view where u_id=?`, u_id);
        let b_id = await MysqlHelper.single(`select b_id from student_badge where b_id>0 and b_id<5 and u_id=?`, u_id);
        if (count == 0 && b_id != null) {
            await MysqlHelper.delete(`delete from student_badge where b_id=? and u_id=?`,b_id, u_id);
            return;
        }
        let current;
        if (count < 4)
            current= 2;
        else if (count < 7)
            current= 3;
        else if (count >= 7)
            current= 4;
        if (b_id != null) {
            if (b_id != current)
                await MysqlHelper.update(`update student_badge set b_id=?,get_time=? where b_id=? and u_id=?`, current, Date.now(), b_id, u_id);
        } else {
            await MysqlHelper.insert(`insert into student_badge value(?,?,?)`, u_id, current, Date.now());
        }
    }

    //平均能力值徽章<2:青铜 <4白银 <6黄金 <8铂金 <9砖石 <=10王者并且做题数大于20
    static async checkEvaluate(u_id) {
        let data = await MysqlHelper.row(`select * from student_class where u_id=?`, u_id);
        let id = await MysqlHelper.single(`select b_id from student_badge where b_id>4 and b_id<11 and u_id=?`, u_id);
        let evaluate = 0;
        let count = 0;
        data.forEach(item => {
            let questionNum = item.difficulty_1 + item.difficulty_2 + item.difficulty_3 + item.difficulty_4 + item.difficulty_5;
            if (questionNum >= 20) {
                evaluate += item.evaluate;
                count++;
            }
        })
        evaluate = evaluate / count;
        let currentId = 5;
        if (evaluate < 2)
            currentId = 5;
        else if (evaluate < 4)
            currentId = 6;
        else if (evaluate < 6)
            currentId = 7;
        else if (evaluate < 8)
            currentId = 8;
        else if (evaluate < 9)
            currentId = 9;
        else if (evaluate <= 10)
            currentId = 10;
        if (id != null) {
            if (id != currentId)
                await MysqlHelper.execute(`update student_badge set b_id=?,get_time=? where b_id=? and u_id=?`, currentId, Date.now(), id, u_id);
        } else {
            await MysqlHelper.insert(`insert into student_badge value(?,?,?)`, u_id, currentId, Date.now());
        }
    }


}

module.exports = badgeHelper;