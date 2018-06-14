<template>
  <div class="app">
    <el-steps :active="currentStep" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="选择题目"></el-step>
      <el-step title="信息总览"></el-step>
    </el-steps>
    <div class="all-item-hcenter content">
      <div v-show="currentStep==1" style="width:500px">
        <el-form label-width="50px">
          <el-form-item label="描述">
            <el-input v-model="form.qg_name"></el-input>
          </el-form-item>
          <el-form-item label="类别">
            <el-select v-model="form.qg_type" placeholder="请选择">
              <el-option label="作业" value="1"></el-option>
              <el-option label="考试" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div v-show="currentStep==2" style="width:100%">
        <question-table ref="questionTable" type="2" v-on:mult="addOnSystemQuestion"></question-table>
        <div class="show-selected">
          <div>总体难度：{{this.form.difficulty}}</div>
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item :title="'单选题，共：'+form.onSystemQuestion[0].length" name="1">
              <question-list :data="form.onSystemQuestion[0]"></question-list>
            </el-collapse-item>
            <el-collapse-item :title="'多选题，共：'+form.onSystemQuestion[1].length" name="2">
              <question-list :data="form.onSystemQuestion[1]"></question-list>
            </el-collapse-item>
            <el-collapse-item :title="'填空题，共：'+form.onSystemQuestion[2].length" name="3">
              <question-list :data="form.onSystemQuestion[2]"></question-list>
            </el-collapse-item>
            <el-collapse-item :title="'编程题，共：'+form.onSystemQuestion[3].length" name="4">
              <question-list :data="form.onSystemQuestion[3]"></question-list>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <div v-show="currentStep==3" style="width:600px">
        <el-form label-width="100px">
          <el-form-item label="描述">{{form.qg_name}}</el-form-item>
          <el-form-item label="类别">{{form.qg_type==1?'作业':'考试'}}</el-form-item>
          <el-form-item label="难度">{{form.difficulty}}</el-form-item>
          <el-form-item label="题目">
            <div>单选题：{{form.onSystemQuestion[0].length}}道， 共{{num1}}分</div>
            <div>多选题：{{form.onSystemQuestion[1].length}}道， 共{{num2}}分</div>
            <div>填空题：{{form.onSystemQuestion[2].length}}道， 共{{num3}}分</div>
            <div>编程题：{{form.onSystemQuestion[3].length}}道， 共{{num4}}分</div>
            <div>总计：{{num1+num2+num3+num4}}分</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="all-item-hcenter">
      <el-button type="primary" v-if="currentStep>1" @click="currentStep--" size="small">上一步</el-button>
      <el-button type="primary" v-if="currentStep<3" @click="nextStep" size="small">下一步</el-button>
      <el-button type="primary" v-if="currentStep==3" @click="submit" size="small">提交</el-button>
    </div>

  </div>
</template>

<script>
import QuestionTable from "./common/QuestionTable";
import QuestionList from "./common/QuestionList";
export default {
  components: {
    QuestionTable,
    QuestionList
  },
  name: "OrganizeQuestion",
  computed: {
    num1() {
      let num = 0;
      this.form.onSystemQuestion[0].forEach(
        item => (num += parseInt(item.score))
      );
      return num;
    },
    num2() {
      let num = 0;
      this.form.onSystemQuestion[1].forEach(
        item => (num += parseInt(item.score))
      );
      return num;
    },
    num3() {
      let num = 0;
      this.form.onSystemQuestion[2].forEach(
        item => (num += parseInt(item.score))
      );
      return num;
    },
    num4() {
      let num = 0;
      this.form.onSystemQuestion[3].forEach(item => (num += parseInt(item.score)));
      return num;
    }
  },
  data() {
    return {
      currentStep: 1,
      activeName: "",
      form: {
        qg_name: "",
        qg_type: "",
        demand: "",
        onSystemQuestion: [[], [], [], []], //单选，多选，填空,编程
        difficulty: 0
      }
    };
  },
  created() {
    this.$watch(() => this.form.onSystemQuestion, this.cal);
    // this.$watch(() => this.form.onSystemQuestion[1], this.cal);
    // this.$watch(() => this.form.onSystemQuestion[2], this.cal);
  },
  methods: {
    nextStep(){
      if(this.currentStep==1){
        if(this.form.qg_name=='' || this.form.qg_type==''){
          alertMessage("请勿留空",'error');
          return;
        }
      }
      this.currentStep++;
    },
    addOnSystemQuestion(data) {
      let _this = this;
      let index = -1;
      let error = [];
      data.forEach(item => {
        if (item.q_type <= 3) item.score = 5;
        else if (item.q_type == 4) item.score = 20;
        let index = _this.form.onSystemQuestion[item.q_type - 1].findIndex(
          item1 => item1.ql_id == item.ql_id
        );
        if (index == -1)
          _this.form.onSystemQuestion[item.q_type - 1].push(item);
        else error.push(item.ql_id);
      });
      if (error.length > 0) {
        alertNotify("错误", `${error.join(",")} 已存在`, "error");
      }
      this.$refs.questionTable.resetMultipleSelection();
    },
    cal() {
      // 计算总体难度
      let eachRangeCount = {};
      let size = 0;
      for (let i = 0; i < this.form.onSystemQuestion.length; i++) {
        let temp = this.form.onSystemQuestion[i];
        for (let j = 0; j < temp.length; j++) {
          if (eachRangeCount[temp[j].q_range] == undefined)
            eachRangeCount[temp[j].q_range] = 0;
          eachRangeCount[temp[j].q_range]++;
          size++;
        }
      }
      let difficulty = 0;
      for (let key in eachRangeCount) {
        difficulty += eachRangeCount[key] / size * key;
      }
      console.log(difficulty);
      this.form.difficulty = Math.round(difficulty * 10) / 10;
    },
    submit() {
      this.form.score = this.num1 + this.num2 + this.num3 + this.num4;
      $http
        .post(`/course/${this.$route.params.c_id}/question_group`, this.form)
        .then(res => {
          alertMessage("提交成功", "success");
          this.$router.replace("question_group_overview");
        });
    }
  }
};
</script>

<style scoped>
.app {
  padding: 10px;
}
.content {
  margin-top: 20px;
}
</style>
