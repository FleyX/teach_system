const Mysqlhelper = require("../util/MysqlHelper.js");
const RedisHelper = require("../util/RedisHelper.js");
const ErrorHelper = require("../util/ErrorHelper.js");
const StringHelper = require("../util/StringHelper.js");
const questionGroupDao = require("./questionGroupDao.js");
const config = require("../config/config.js");
const fs = require("fs-extra");
const path = require("path");
const testHelper = require("./testHelper.js");

class testDao {
  static async getByCId(c_id) {
    let data = await Mysqlhelper.row(`select * from test where c_id=? and t_type in(1,2)`, c_id);
    return data;
  }

  //统计七天内测试情况
  static async getTestNum() {
    let redisKey = "testNumStatistic";
    let res = await RedisHelper.getString(redisKey);
    if (res == null) {
      res = {};
      res.count = await Mysqlhelper.single(`select count(*) from student_test where submit_time>0`);
      let now = new Date();
      let currentDate = new Date(now.toDateString());
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      let lastDate = currentDate;
      res.data = [];
      for (let i = 1; i <= 7; i++) {
        let tempDate = new Date(lastDate.getTime() - 24 * 60 * 60 * 1000);
        let key = `${tempDate.getMonth() + 1}-${tempDate.getDate()}`;
        let value = await Mysqlhelper.single(
          `
                    select count(*) from student_test where submit_time<? and submit_time>?`,
          lastDate.getTime(),
          tempDate.getTime()
        );
        res.data.push({
          key,
          value
        });
        lastDate = tempDate;
      }
      res.data.reverse();
      res = JSON.stringify(res);
      await RedisHelper.setString(redisKey, res, 30 * 60);
    }
    return res;
  }

  //代码查重
  static async codeCheck(test_id, type) {
    let redisKey = "code_check_" + test_id;
    let reply = await RedisHelper.getString(redisKey);
    if (reply == null || type == "new") {
      reply = {};
      let dir = path.join(config.codeSavePath, test_id.toString());
      reply.res = {};
      if (fs.existsSync(dir)) {
        let qlList = fs.readdirSync(dir);
        for (let i = 0; i < qlList.length; i++) {
          reply.res[qlList[i]] = {};
          let dir1 = path.join(dir, qlList[i]);
          let typeList = fs.readdirSync(dir1);
          for (let j = 0; j < typeList.length; j++) {
            let temp = await testHelper.simCheck(path.join(dir1, typeList[j]));
            Object.assign(reply.res[qlList[i]], temp);
          }
        }
      }
      reply.dataList = await Mysqlhelper.row(`select * from judge_program_view where test_id=?`, test_id);
      reply = JSON.stringify(reply);
      await RedisHelper.setString(redisKey, reply, 5 * 60);
    }
    return reply;
  }

  //查询作业考试
  static async getTest(u_id, c_id, param) {
    let now = Date.now();
    let data;
    if (param.isCurrent === "true") {
      let str;
      if (param.type == "1") str = `start_time<${now} and end_time>${now} and submit_time =0`;
      else if (param.type == "2") str = `end_time>${now} and submit_time=0`;
      else throw ErrorHelper.Error400("请求参数错误" + param.type);
      data = await Mysqlhelper.row(
        `
                select test_id, test_name,u_id,qg_id,start_time,end_time,work_time,demand from student_test_view 
                where u_id=? and c_id=? and t_type=? and ${str}
                `,
        u_id,
        c_id,
        param.type
      );
    } else {
      data = await Mysqlhelper.row(
        `
                select test_id, test_name, u_id,qg_id,start_time,end_time,work_time,demand,submit_time,score from student_test_view 
                where u_id=? and c_id=? and t_type=? and (submit_time >0 or end_time<?)  
                `,
        u_id,
        c_id,
        param.type,
        now
      );
    }
    return data;
  }

  //查询学生某门课所有知识点专项练习
  static async getKnowledgeTest(u_id, c_id) {
    let res = await Mysqlhelper.row(
      `
            select test_id,test_name,start_time,score,submit_time from student_test_view where u_id=? and c_id=? and t_type=3
            `,
      u_id,
      c_id
    );
    return res;
  }

  //查询所有待完成测试
  static async getUndoTest(u_id) {
    let now = Date.now();
    let res = {
      work: await Mysqlhelper.row(
        `
                SELECT count(test_name) as count,c_name,c_id from student_test_view where t_type=1 and  start_time<? and end_time>? and submit_time =0 and u_id=?  GROUP BY c_id
                `,
        now,
        now,
        u_id
      ),
      exam: await Mysqlhelper.row(
        `
                SELECT count(test_name) as count,c_name,c_id from student_test_view where t_type=2 and end_time>? and submit_time =0 and u_id=? GROUP BY c_id
                `,
        now,
        u_id
      )
    };
    return res;
  }

  //返回某次测试的详细信息
  static async getTestSum(test_id, type) {
    let redis_key = test_id + "_test_detail";
    let res = await RedisHelper.getString(redis_key);
    if (res == null || type == "new") {
      res = {};
      //已提交学生成绩
      res["class"] = await Mysqlhelper.row(`SELECT b.class_id,b.content from test_class a inner join class b on a.class_id = b.class_id where test_id=?`, test_id);
      res["score"] = await Mysqlhelper.row(`select u_id,u_name,score,sum,class,class_id,code from student_test_view where test_id=?`, test_id);
      //智能组题无法获取下列信息，因为每个人所做题目不同，无法做统一分析
      let qg_id = await Mysqlhelper.single(`select qg_id from test where test_id=?`, test_id);
      if (qg_id != null) {
        //题组信息
        let questionList = await Mysqlhelper.row(
          `
                    SELECT b.q_type,b.ql_id,q_range,b.q_simple_description FROM group_question a INNER JOIN question_library b ON a.ql_id = b.ql_id WHERE a.qg_id = ?
                    `,
          qg_id
        );
        //题目正确率准备工作
        let questionObject = {};
        questionList.forEach((item, index) => {
          item.count = 0;
          item.rightCount = 0;
          item.rightPercent = 0;
          questionObject[item.ql_id] = index;
        });

        //知识点正确率准备工作
        let qlIdList = questionList.map(item => item.ql_id);
        let questionKnowledge = await Mysqlhelper.row(`
                    select a.ql_id,a.kp_id,b.content from question_knowledge a inner join knowledge_point b on a.kp_id=b.kp_id where ql_id in (${qlIdList.join(",")})
                    `);
        let knowledgeObj = {},
          questionKnowledgeObj = {};
        questionKnowledge.forEach(item => {
          if (knowledgeObj[item.kp_id] == undefined) {
            knowledgeObj[item.kp_id] = {
              count: 0,
              rightCount: 0,
              rightPercent: 0,
              content: item.content
            };
          }
          if (questionKnowledgeObj[item.ql_id] == null) questionKnowledgeObj[item.ql_id] = [];
          questionKnowledgeObj[item.ql_id].push(item.kp_id);
        });
        //计算
        res.score.forEach(item => {
          let sum = JSON.parse(item.sum);
          for (let key in sum) {
            let question = questionList[questionObject[key]];
            question.count++;
            if (sum[key] == 1) question.rightCount++;
            if (questionKnowledgeObj[key] == undefined) return;
            questionKnowledgeObj[key].forEach(item1 => knowledgeObj[item1].count++);
            if (sum[key] == 1) questionKnowledgeObj[key].forEach(item1 => knowledgeObj[item1].rightCount++);
          }
        });
        questionList.forEach(item => (item.rightPercent = item.count > 0 ? item.rightCount / item.count : 0));
        res.questionList = questionList;
        //知识点对象转为数组
        let knowledgeList = [];
        for (let key in knowledgeObj) {
          let knowledge = knowledgeObj[key];
          knowledge.kp_id = key;
          knowledge.rightPercent = knowledge.count > 0 ? knowledge.rightCount / knowledge.count : 0;
          knowledgeList.push(knowledge);
        }
        res.knowledgeList = knowledgeList;
      }
      res.updateTime = Date.now();
      //存入redis,有效期五分钟
      res = JSON.stringify(res);
      await RedisHelper.setString(redis_key, res, 300);
    }
    return res;
  }

  //返回某位学生某次测试提交的答案
  static async getAnswer(u_id, c_id, test_id) {
    let answer = await Mysqlhelper.first(`select answer,sum from student_test_view where u_id=? and c_id=? and test_id=?`, u_id, c_id, test_id);
    return answer;
  }

  //返回一套试题题目
  static async getTestDetail(u_id, c_id, test_id) {
    let data = await Mysqlhelper.first(`select role,qg_id,test_name,sc_id from student_test_view where u_id=? and test_id=? and c_id=?`, u_id, test_id, c_id);
    if (data.qg_id == null) {
      //智能组题，根据学生能力值生成一套新题
      let studentInfo = await Mysqlhelper.first(
        `
                select difficulty_1,difficulty_2,difficulty_3,difficulty_4,difficulty_5,evaluate from student_class where sc_id=?
                `,
        data.sc_id
      );
      let persent = [];
      let difficulty = 0;
      //如每种难度题目做题数低于5题，优先使每种难度题目数达到5
      let temp = []; //记录未达到5题的难度
      for (let i = 1; i <= 5; i++) {
        if (studentInfo["difficulty_" + i] < 5) temp.push(i);
      }
      if (temp.length != 0) {
        //均分每种难度占比
        let avr = Math.round((1 / temp.length) * 10) / 10;
        let count = 0;
        for (let i = 1; i <= 5; i++) {
          if (temp.indexOf != -1 || count < 1) {
            if (count + avr > 1) persent.push(1 - count);
            else persent.push(avr);
            count += avr;
          } else {
            persent.push(0);
          }
        }
        persent.forEach((item, index) => (difficulty += (index + 1) * item));
      } else {
        difficulty = Math.round((studentInfo.evaluate / 2) * 10) / 10;
        persent = testHelper.get(difficulty);
      }
      let questionData = JSON.parse(data.role);
      let sum = await testHelper.getQuestionGroup(questionData, persent, 0);
      let qg_id = await testHelper.saveToDb(c_id, data.test_name, 1, difficulty, questionData, sum, 1);
      await Mysqlhelper.execute(`update student_test set qg_id=? where sc_id=? and test_id=?`, qg_id, data.sc_id, test_id);
      data.qg_id = qg_id;
    }
    let res = await questionGroupDao.getQuestion(data.qg_id);
    return res;
  }

  //生成一场知识点专项练习
  static async addOneKnowledgeTest(u_id, c_id, param) {
    //判断是否有未完成练习
    let count = await Mysqlhelper.single(`select count(*) from student_test_view where u_id=? and c_id=? and t_type=3 and submit_time=0`, u_id, c_id);
    if (count > 0) throw ErrorHelper.Error403("您还有未完成练习，请先完成");
    let sc_id = await Mysqlhelper.single(`select sc_id from student_evaluate_view where u_id=? and c_id=?`, u_id, c_id);
    let test_id = await Mysqlhelper.insert(
      `
                insert into test(c_id,t_type,role,start_time,end_time,work_time,test_name,is_random,demand) value(?,?,?,?,?,?,?,?,?)
                `,
      c_id,
      3,
      JSON.stringify(param),
      Date.now(),
      Number.MAX_SAFE_INTEGER,
      0,
      param.kp_name + "-专项练习",
      1,
      ""
    );

    let res = await Mysqlhelper.insert(`insert into student_test(sc_id,test_id) value(?,?)`, sc_id, test_id);
    return res;
  }

  static async addOne(param) {
    param.start_time = Math.ceil(new Date(param.start_time).getTime() / 1000) * 1000;
    if (param.end_time != "") param.end_time = Math.ceil(new Date(param.end_time).getTime() / 1000) * 1000;
    else param.end_time = param.start_time + parseInt(param.work_time) * 60 * 1000;
    let res;
    if (param.get_question_type == "1") {
      //选择题组
      res = await Mysqlhelper.insert(
        `
                insert into test(c_id,qg_id,score,t_type,start_time,end_time,work_time,test_name,is_random,demand) value(?,?,?,?,?,?,?,?,?,?)
                `,
        param.c_id,
        param.questionData.qg_id,
        param.questionData.score,
        param.t_type,
        param.start_time,
        param.end_time,
        param.work_time,
        param.test_name,
        0,
        param.demand
      );
      await testHelper.addStudentTest(res, param, false);
    } else if (param.t_type == 1 && param.get_question_type == "2") {
      //智能组题，等到学生请求题目时，再生成题组
      res = await Mysqlhelper.insert(
        `
                insert into test(c_id,t_type,score,role,start_time,end_time,work_time,test_name,is_random,demand) value(?,?,?,?,?,?,?,?,?,?)
                `,
        param.c_id,
        1,
        param.questionData.allScore,
        JSON.stringify(param.questionData),
        param.start_time,
        param.end_time,
        param.work_time,
        param.test_name,
        1,
        param.demand
      );
      await testHelper.addStudentTest(res, param, true);
    } else if (param.t_type == 2 && param.get_question_type == "2") {
      //考试自动组题,生成一套题供考试用
      //计算各个难度题目数量
      let persent = testHelper.get(parseInt(param.questionData.level));
      let questionData = param.questionData;
      //题目组
      let sum = await testHelper.getQuestionGroup(questionData, persent, 1);
      //该题组存入数据库
      let qg_id = await testHelper.saveToDb(param.c_id, param.test_name, 2, questionData.level, questionData, sum, 1);
      //插入测试
      res = await Mysqlhelper.insert(
        `
                insert into test(c_id,qg_id,score,t_type,start_time,end_time,work_time,test_name,is_random,demand) value(?,?,?,?,?,?,?,?,?,?)
                `,
        param.c_id,
        qg_id,
        questionData.allScore,
        param.t_type,
        param.start_time,
        param.end_time,
        param.work_time,
        param.test_name,
        0,
        param.demand
      );
      //加入学生
      await testHelper.addStudentTest(res, param, false);
    }
    return res;
  }
  //提交答案并判题
  static async submitAnswer(u_id, c_id, test_id, answer) {
    let data = await Mysqlhelper.first(`select sc_id,qg_id from student_test_view where u_id=? and c_id=? and test_id=?`, u_id, c_id, test_id);
    await Mysqlhelper.update(`update student_test set submit_time=?,answer=? where sc_id=? and test_id=?`, Date.now(), JSON.stringify(answer), data.sc_id, test_id);
    //异步判题
    process.nextTick(async () => {
      try {
        await testHelper.judgeQuestion(data.sc_id, test_id, u_id, c_id, data.qg_id, answer);
      } catch (error) {
        console.log(error);
      }
    });
    // throw new Error("错误了");
  }

  static async deleteKnowledgeTest(u_id, c_id, test_id) {
    let count = await Mysqlhelper.single(`select count(*) from student_test_view where u_id=? and c_id=? and test_id=? and submit_time=0 and t_type=3`, u_id, c_id, test_id);
    if (count > 0) await Mysqlhelper.delete(`delete from test where test_id=? and c_id=? and t_type=3`, test_id, c_id);
  }

  static async deleteOne(c_id, test_id) {
    await Mysqlhelper.delete(`delete from test where test_id=? and c_id=?`, test_id, c_id);
  }
}

module.exports = testDao;
