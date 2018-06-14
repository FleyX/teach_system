<template>
  <div>
    <el-steps :active="currentStep" align-center style="margin:10px;">
      <el-step title="基本信息"></el-step>
      <el-step title="选择题目"></el-step>
      <el-step title="选择班级"></el-step>
      <el-step title="总览"></el-step>
    </el-steps>
    <!-- 第一步 -->
    <el-form label-width="100px" v-show="currentStep==1">
      <el-form-item label="考试名称">
        <el-input v-model="form.test_name" style="width:250px"></el-input>
      </el-form-item>
      <el-form-item label="考试要求">
        <el-input type="textarea" style="width:250px" :autosize="{minRows:2,maxRows:5}" placeholder="请输入考试要求" v-model="form.demand"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="form.start_time" style="width:250px;" format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="考试时长">
        <el-input v-model="form.work_time" style="width:250px"></el-input>
      </el-form-item>
    </el-form>
    <!-- 第二步 -->
    <chose-exam-question v-show="currentStep==2" :name="form.test_name" v-on:questionChange="changeExamQuestion" ref="choseQuestion">
    </chose-exam-question>
    <!-- 第三部 -->
    <chose-class v-show="currentStep==3" v-on:class-change="classChange"></chose-class>
    <!-- 第四部 -->
    <div v-show="currentStep==4">
      <el-form label-width="100px">
        <el-form-item label="考试名称">{{form.test_name}}</el-form-item>
        <el-form-item label="考试要求">
          <pre style="line-height:20px">{{form.demand}}</pre>
        </el-form-item>
        <el-form-item label="开始时间">{{startTime}}</el-form-item>
        <el-form-item label="考试时长">{{form.work_time}}</el-form-item>
        <el-form-item label="作业题组">
          <template v-if="form.get_question_type=='1'">
            {{form.questionData.qg_name}}
          </template>
          <template v-else-if="form.get_question_type=='2'">
            自动组卷
          </template>
        </el-form-item>
        <el-form-item label="选中班级">
          <div v-for="item in form.choseClass" :key="item.id">
            {{item.label}}
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作 -->
    <div class="all-item-hcenter">
      <el-button size="small" type="primary" @click="currentStep--" v-show="currentStep>1">上一步</el-button>
      <el-button size="small" type="primary" @click="nextStep" v-show="currentStep<4">下一步</el-button>
      <el-button size="small" type="primary" @click="submit" v-show="currentStep==4">提交</el-button>
    </div>
  </div>
</template>

<script>
import ChoseExamQuestion from "./common/ChoseExamQuestion";
import ChoseClass from "./common/ChoseClass";
export default {
  name: "AddTest",
  components: {
    ChoseExamQuestion,
    ChoseClass
  },
  data() {
    return {
      form: {
        test_name: "",
        t_type: 2,
        start_time: "",
        end_time: "",
        work_time: 120,
        get_question_type: "",
        questionData: {},
        choseClass: [],
        c_id: "",
        demand: ""
      },
      currentStep: 1
    };
  },
  computed: {
    startTime() {
      return this.$moment(this.form.start_time).format("YYYY-MM-DD hh:mm");
    }
  },
  created() {
    this.form.c_id = this.$route.params.c_id;
  },
  methods: {
    submit() {
      $http.post(`test`, this.form).then(res => {
        alertMessage("发布成功", "success");
        this.$router.push(".");
      });
    },
    classChange(data, checked, father) {
      if (checked)
        this.form.choseClass.push({
          id: data.id,
          label: father + "-" + data.label
        });
      else
        this.form.choseClass.splice(
          this.form.choseClass.findIndex(item => item.id == data.id),
          1
        );
    },
    changeExamQuestion(data) {
      if (data == null) {
        this.form.questionData = null;
      } else {
        this.form.get_question_type = data.type;
        this.form.questionData = data.data;
      }
    },
    nextStep(){
if (this.currentStep == 1) {
        if (
          this.form.test_name == "" ||
          this.form.start_time == ""
        ) {
          alertMessage("请勿留空", "error");
          return;
        }
      }
      if (this.currentStep == 2) {
        if (this.form.questionData == null) {
          alertMessage("请选择好题目组", "error");
          return;
        }
      }
      this.currentStep++;
    }

  }
};
</script>

<style>

</style>

