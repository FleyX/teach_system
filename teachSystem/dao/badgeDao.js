const MysqlHelper = require('../util/MysqlHelper.js');
const RedisHelper = require('../util/RedisHelper.js');
const badgeHelper = require('./badgeHelper.js');

class badgeDao {
    static async getUserBadge(u_id) {
        let redisKey = u_id + '_badge_update';
        let res = await RedisHelper.getString(redisKey);
        if (res == null) {
            await badgeHelper.checkCourseNum(u_id);
            await badgeHelper.checkEvaluate(u_id);
            res = await MysqlHelper.row(`
                SELECT a.get_time,b.* FROM student_badge a INNER JOIN badge b ON a.b_id = b.b_id WHERE u_id = ?
                `, u_id);
            res = JSON.stringify(res);
            await RedisHelper.setString(redisKey,res,60*60);
        }
        return JSON.parse(res);
    }

    static async getBadgeDetail(u_id, b_id, type) {
        let res = {};
        res.next = await MysqlHelper.first(`select b_name,b_img,get_condition,next_level from badge where b_id=?`, b_id);
        if (type == '1') {
            res.current = await MysqlHelper.single(`select count(*) from student_evaluate_view where u_id=?`, u_id)
        } else if (type == '2') {
            let data = await MysqlHelper.row(`select * from student_class where u_id=?`, u_id);
            let evaluate = 0,
                count = 0;
            data.forEach(item => {
                let questionNum = item.difficulty_1 + item.difficulty_2 + item.difficulty_3 + item.difficulty_4 + item.difficulty_5;
                if (questionNum >= 20) {
                    evaluate += item.evaluate;
                    count++;
                }
            })
            res.current = count > 0 ? evaluate / count : 0;
        }
        return res;
    }
}
module.exports = badgeDao;