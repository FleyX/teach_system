const Mysqlhelper = require("../util/MysqlHelper.js");
const StringHelper = require("../util/StringHelper.js");
const ErrorHelper = require("../util/ErrorHelper.js");
const config = require("../config/config.js");
const programConfig = config.programConfig;
const RequestHelper = require("../util/RequestHelper.js");
const timeHelper = require("../util/TimeHelper.js");
const fs = require("fs-extra");
const path = require("path");
const process = require("child_process");

/**
 * 是否正在判题
 */
let isJudgeProgram = false;

/**
 * 判题header
 */
let header = {
  "X-Judge-Server-Token": config.judgeToken,
  "Content-Type": "application/json"
};

/**
 * 判题body
 */
let form = {
  language_config: {},
  max_cpu_time: 3000,
  max_memory: 128 * 1024 * 1024,
  test_case_id: "",
  src: "",
  output: false
};

class testHelper {
  //根据总体难度，生成各个难度所占百分比
  static get(target) {
    if (target < 1) target = 1;
    let num1 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    let num2 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    let num3 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    let num4 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    let num5 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    let arr = [];
    num1.forEach(item1 => {
      num2.forEach(item2 => {
        num3.forEach(item3 => {
          num4.forEach(item4 => {
            num5.forEach(item5 => {
              if (item1 + item2 + item3 + item4 + item5 == 1) {
                let num = 1 * item1 + 2 * item2 + 3 * item3 + 4 * item4 + 5 * item5;
                let sum = Math.abs(target - num);
                if (sum == 0) {
                  arr.push([item1, item2, item3, item4, item5, sum.toFixed(4)]);
                }
              }
            });
          });
        });
      });
    });
    if (arr.length == 0) throw ErrorHelper.Error400("无法产生计算难度占比");
    return arr.sort((a, b) => a.filter(item => item == 0).length - b.filter(item => item == 0).length)[0];
  }

  /**
   * 计算各个难度下的题目数量
   */
  static getEachLevelNum(questionNum, persent) {
    let levelNum = {};
    let count = 0;
    for (let i = 0; i < persent.length; i++) {
      let num = Math.round(questionNum * persent[i]);
      if (num == 0 && i < 4) continue;
      if (count + num >= questionNum || i == 4) {
        levelNum[i + 1] = questionNum - count;
        break;
      } else {
        levelNum[i + 1] = num;
        count += num;
      }
    }
    return levelNum;
  }

  /**
   * 对题目根据类别，难度分类
   */
  static getQuestionTyping(questions) {
    let data = {
      single: {},
      mult: {},
      gap: {},
      program: {}
    };
    let range = {
      1: "single",
      2: "mult",
      3: "gap",
      4: "program"
    };
    questions.forEach(item => {
      if (data[range[item.q_type]][item.q_range] == undefined) data[range[item.q_type]][item.q_range] = [];
      data[range[item.q_type]][item.q_range].push(item);
    });
    return data;
  }
  /**
   * 出题
   */
  static choseQuestion(sum, type, num, levelNum, questions) {
    let keys = Object.keys(levelNum);
    sum[type] = [];
    for (let i = 0; i < num; i++) {
      if (keys.length == 0) {
        throw ErrorHelper.Error403("出题失败，备选题目数量不足,请联系教师扩充");
      }
      let random1 = StringHelper.getRandomNumber(keys.length - 1, 0); //难度序号
      let tempQuestion = questions[keys[random1]];
      if (tempQuestion == undefined || tempQuestion.length == 0) {
        throw ErrorHelper.Error403("出题失败，备选题目数量不足,请联系教师扩充");
      }
      let random2 = StringHelper.getRandomNumber(tempQuestion.length - 1, 0); //题目序号
      sum[type].push(tempQuestion[random2]);
      //删除选择过题目
      tempQuestion.splice(random2, 1);
      levelNum[keys[random1]]--;
      if (levelNum[keys[random1]] == 0) {
        delete levelNum[keys[random1]];
        keys = Object.keys(levelNum);
      }
    }
  }
  /**
   * 存入数据库
   */
  static async saveToDb(c_id, test_name, qg_type, difficulty, questionData, sum, isRandom = 0) {
    let qg_id = await Mysqlhelper.insert(
      `
            insert into question_group(c_id,qg_name,difficulty,qg_type,score,is_random) value(?,?,?,?,?,?)
            `,
      c_id,
      test_name + "用题组",
      difficulty,
      qg_type,
      questionData.allScore,
      isRandom
    );
    for (let key in sum) {
      for (let i = 0; i < sum[key].length; i++) {
        await Mysqlhelper.insert(
          `
                    insert into group_question(qg_id,ql_id,score) value(?,?,?)
                    `,
          qg_id,
          sum[key][i].ql_id,
          questionData.question[key].score
        );
      }
    }
    return qg_id;
  }
  //根据出题规则，各难度题目占比生成一套题目
  static async getQuestionGroup(questionData, persent, isExam) {
    let questionNum = parseInt(questionData.question.single.num) + parseInt(questionData.question.mult.num) + parseInt(questionData.question.gap.num) + parseInt(questionData.question.program.num);
    //查询选中章节下的题目
    let knowledgePont;
    if (questionData.sections == undefined) {
      knowledgePont = questionData.knowledgePoint;
    } else {
      knowledgePont = await Mysqlhelper.row(`
                select b.kp_id   from section a INNER JOIN knowledge_point b on a.s_id=b.s_id where a.s_id in (${questionData.sections.join(",")})
                `);
      knowledgePont = knowledgePont.map(item => item.kp_id);
    }
    let questions = await Mysqlhelper.row(
      `select DISTINCT a.ql_id,a.q_range,a.q_type from  question_knowledge b INNER 
                JOIN question_library a on a.ql_id = b.ql_id where b.kp_id in (${knowledgePont.join(",")}) and a.is_exam=?
                `,
      isExam
    );
    //对题目根据难度，类别进行分类
    let data = testHelper.getQuestionTyping(questions);
    let levelNum = testHelper.getEachLevelNum(questionNum, persent);
    //开始随机出题
    let sum = {}; //组题结果
    testHelper.choseQuestion(sum, "single", parseInt(questionData.question.single.num), levelNum, data.single);
    testHelper.choseQuestion(sum, "mult", parseInt(questionData.question.mult.num), levelNum, data.mult);
    testHelper.choseQuestion(sum, "gap", parseInt(questionData.question.gap.num), levelNum, data.gap);
    testHelper.choseQuestion(sum, "program", parseInt(questionData.question.gap.num), levelNum, data.program);
    return sum;
  }

  //判题
  static async judgeQuestion(sc_id, test_id, u_id, c_id, qg_id, answer) {
    let questionList = await Mysqlhelper.row(
      `
        SELECT a.score,b.answer,b.q_type,b.ql_id,q_range FROM group_question a INNER JOIN question_library b ON a.ql_id = b.ql_id WHERE a.qg_id = ?
        `,
      qg_id
    );
    let qlIdList = questionList.map(item => item.ql_id);
    let knowledgePointList = await Mysqlhelper.row(`select ql_id,kp_id from question_knowledge where ql_id in (${qlIdList.join(",")})`);
    let allScore = 0;
    let judgeSum = {}; //判题结果
    let range = {}; //几率各难度做题情况
    let knowledge = {}; //各知识点做题情况
    let questionKnowledge = {}; //每题对应哪些知识点
    knowledgePointList.forEach(item => {
      if (questionKnowledge[item.ql_id] == undefined) questionKnowledge[item.ql_id] = [];
      questionKnowledge[item.ql_id].push(item.kp_id);
    });
    for (let i = 0; i < questionList.length; i++) {
      let question = questionList[i];
      let getScore;
      try {
        getScore = await testHelper.judgeAnswer(question.answer, answer[question.ql_id], question.score, question.q_type, question.ql_id, sc_id, test_id);
      } catch (error) {
        console.log(error);
        getScore = 0;
      }
      //编程题代码存入磁盘以备查重
      if (question.q_type == "4") await testHelper.saveCode(u_id, test_id, question.ql_id, answer[question.ql_id]);
      allScore += getScore;
      let add = 0;
      if (getScore == question.score) add = 1;
      judgeSum[question.ql_id] = add;
      //更新题库中出题记录
      await Mysqlhelper.update(`update question_library set count=count+1,right_count=right_count+? where ql_id=?`, add, question.ql_id);
      //更新各难度做题情况
      if (range[question.q_range] == undefined)
        range[question.q_range] = {
          count: 0,
          rightCount: 0
        };
      range[question.q_range].count++;
      range[question.q_range].rightCount += add;
      //更新知识点掌握情况
      if (questionKnowledge[question.ql_id] == undefined) continue;
      questionKnowledge[question.ql_id].forEach(item => {
        if (knowledge[item] == undefined)
          knowledge[item] = {
            count: 0,
            rightCount: 0
          };
        knowledge[item].count++;
        knowledge[item].rightCount += add;
      });
    }
    //更新测试成绩
    await Mysqlhelper.update(`update student_test set score=?,sum=? where sc_id=? and test_id=?`, allScore, JSON.stringify(judgeSum), sc_id, test_id);
    //更新学生各难度做题情况
    let str = "";
    let keys = Object.keys(range);
    keys.forEach((item, index) => {
      index == 0 ? (str += "") : (str += ",");
      str += `difficulty_${item}=difficulty_${item}+${range[item].count},difficulty_pass_${item}=difficulty_pass_${item}+${range[item].rightCount}`;
    });
    await Mysqlhelper.update(`update student_class set ${str} where sc_id=?`, sc_id);
    //更新学生各知识点做题情况
    for (let key in knowledge) {
      try {
        await Mysqlhelper.update(
          `
                update student_knowledge set count=count+?,right_count=right_count+? where sc_id=? and kp_id=?
                `,
          knowledge[key].count,
          knowledge[key].rightCount,
          sc_id,
          key
        );
      } catch (error) {
        await Mysqlhelper.insert(
          `
                insert into student_knowledge(sc_id,kp_id,count,right_count) value(?,?,?,?)
                `,
          sc_id,
          key,
          knowledge[key].count,
          knowledge[key].rightCount
        );
      }
    }
    //更新学生能力值
    let studentData = await Mysqlhelper.first(`select * from student_class where sc_id=?`, sc_id);
    let evaluate = 0;
    for (let i = 1; i <= 5; i++) {
      if (studentData[`difficulty_${i}`] != 0) evaluate += i * (studentData[`difficulty_pass_${i}`] / studentData[`difficulty_${i}`]);
    }
    evaluate = Math.round(((evaluate * 2) / 3) * 100) / 100;
    //更新学生知识点覆盖率 该知识点做题数>5切正确率>80%,认为掌握该知识点
    let knowledgePointCount = await Mysqlhelper.single(`SELECT count(*) from knowledge_point a INNER JOIN section b on a.s_id=b.s_id where b.c_id=?`, c_id);
    let studentKnowledgeList = await Mysqlhelper.row(`select * from student_knowledge where sc_id=?`, sc_id);
    let coverage = 0;
    studentKnowledgeList.forEach(item => {
      if (item.count >= config.coverage.num && item.right_count / item.count >= config.coverage.persent) coverage++;
    });
    coverage = Math.round(coverage * 100) / 100;
    await Mysqlhelper.update(`update student_class set evaluate=?,coverage=? where sc_id=?`, evaluate, coverage, sc_id);
  }

  //对某一题判分,返回得分
  static async judgeAnswer(realAnswer, answer, score, type, ql_id, sc_id, test_id) {
    realAnswer = JSON.parse(realAnswer);
    if (answer == null || answer == undefined) return 0;
    let tempAnswer = [];
    if (type < 3) {
      answer.forEach((item, index) => (item == true ? tempAnswer.push(index) : null));
    }
    if (type == 1) {
      //单选判分
      if (tempAnswer.length != 1) return 0;
      if (realAnswer[0] == tempAnswer[0]) return score;
      else return 0;
    } else if (type == 2) {
      //多选判分，答案不全一般分，错选或不选0分
      if (tempAnswer.length == 0) return 0;
      let count = 0;
      for (let i = 0; i < tempAnswer.length; i++) {
        if (realAnswer.indexOf(tempAnswer[i]) != -1) count++;
        else return 0;
      }
      if (count == realAnswer.length) return score;
      else return score / 2;
    } else if (type == 3) {
      //填空判分，score*正确数/总数
      let count = 0;
      for (let i = 0; i < answer.length; i++) {
        if (answer[i].trim() == realAnswer[i].trim()) count++;
      }
      let sum = (score * count) / realAnswer.length;
      return Math.round(sum * 10) / 10;
    } else if (type == 4) {
      return await testHelper.judgeProgram(score, sc_id, ql_id, test_id, answer);
    }
  }

  static async addStudentTest(test_id, param, is_random) {
    try {
      for (let i = 0; i < param.choseClass.length; i++) {
        //记录测试班级
        await Mysqlhelper.insert(`insert into test_class value(?,?)`, test_id, param.choseClass[i].id);
        if (!is_random) {
          await Mysqlhelper.insert(`insert into student_test(sc_id,test_id,qg_id) select a.sc_id,b.test_id,b.qg_id  from student_class a inner join test b on b.test_id=? where a.class_id=?`, test_id, param.choseClass[i].id);
        } else {
          await Mysqlhelper.insert(`insert into student_test(sc_id,test_id) select a.sc_id,b.test_id from student_class a inner join test b on b.test_id=? where a.class_id=?`, test_id, param.choseClass[i].id);
        }
      }
    } catch (err) {
      await Mysqlhelper.delete("delete from test where test_id=?", test_id);
      throw ErrorHelper.Error406("发布失败：" + err.message);
    }
  }

  /**
   * 保存代码
   * @param {*} u_id
   * @param {*} test_id
   * @param {*} ql_id
   * @param {*} answer
   */
  static async saveCode(u_id, test_id, ql_id, answer) {
    let dir = path.join(config.codeSavePath, test_id.toString(), ql_id.toString(), answer[0]);
    await fs.ensureDir(dir);
    await fs.writeFile(path.join(dir, u_id.toString()), answer[1]);
  }

  static async judgeProgram(score, sc_id, ql_id, test_id, answer) {
    while (testHelper.isJudgeProgram) {
      await timeHelper.sleep(100);
    }
    try {
      isJudgeProgram = true;
      console.info(`--start program ${test_id}-${sc_id}-${ql_id}`);
      form.language_config = programConfig[answer[0]];
      form.test_case_id = ql_id.toString();
      form.src = answer[1];
      //编程题判分
      let res = await RequestHelper.POST(config.judgeUrl, form, header);
      if (res.err == null) {
        let info = fs.readFileSync(path.join(config.testSavePath, ql_id.toString(), "info"), {
          encoding: "utf-8"
        });
        info = JSON.parse(info);
        let rightCount = 0;
        for (let i = 0; i < res.data.length; i++) {
          let temp = res.data[i];
          if (temp.output_md5 === info.test_cases[temp.test_case].stripped_output_md5) {
            rightCount++;
            temp.right = true;
          } else {
            temp.right = false;
          }
        }
        score = rightCount > 0 ? Math.round(((score * rightCount) / res.data.length) * 10) / 10 : 0;
      } else {
        score = 0;
      }
      // 编程体判题记录写入数据库
      await Mysqlhelper.insert(`insert into judge_program value(?,?,?,?,?,?)`, sc_id, ql_id, test_id, JSON.stringify(res), score, JSON.stringify(answer));
      return score;
    } finally {
      console.info(`--end program ${test_id}-${sc_id}-${ql_id}`);
      isJudgeProgram = false;
    }
  }

  /**
   * 代码查重
   * @param {*} filePath
   */
  static async simCheck(filePath) {
    let type = filePath.split(/[\/\\]/);
    type = type[type.length - 1];
    let shell;
    if (type == "c" || type == "cpp") {
      shell = `sim_c -p ${filePath}/*`;
    } else if (type == "java") {
      shell = `sim_java -p ${filePath}/*`;
    } else {
      shell = `sim_text -p ${filePath}/*`;
    }
    let out = "";
    if (config.env != "development") {
      try {
        out = await exec(shell);
        out = out.stdout;
      } catch (err) {
        console.log(err);
        throw new Error("查重模块异常，无发查重");
      }
    } else {
      return {
        3: {
          u_id: 4,
          percent: 100
        },
        4: {
          u_id: 3,
          percent: 100
        }
      };
    }
    let rep = /\/?(.*?) consists for (.*?) % of (.*?) material/g;
    let temp;
    let res = {};
    while ((temp = rep.exec(out)) != null) {
      console.log(temp[1], temp[2], temp[3]);
      res[temp[1].split(/[\/\\]/).reverse()[0]] = {
        u_id: temp[3].split(/[\/\\]/).reverse()[0],
        percent: temp[2]
      };
    }
    return res;
  }
}

let exec = async shell => {
  shell = shell.replace(/\\/g, "/");
  return new Promise((res, rej) => {
    process.exec(shell, (error, stdout, stderr) => {
      if (error) rej(error);
      else {
        res({
          stdout,
          stderr
        });
      }
    });
  });
};

module.exports = testHelper;
