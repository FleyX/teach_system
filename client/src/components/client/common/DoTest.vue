<template>
  <div>
    <el-collapse accordion v-if="isFailed==false" v-loading="isLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-collapse-item name="1" v-if="data.single.length>0">
        <template slot="title">
          <h3>&nbsp;<i class="el-icon-caret-right"></i>单选题</h3>
        </template>
        <do-question v-for="(item,index) in data.single" :key="index" :index="index+1" :data="item" :value="answers[item.ql_id]" :sum="sum[item.ql_id]" :action="action"></do-question>
      </el-collapse-item>
      <el-collapse-item name="2" v-if="data.mult.length>0">
        <template slot="title">
          <h3>&nbsp;<i class="el-icon-caret-right"></i>多选题</h3>
        </template>
        <do-question v-for="(item,index) in data.mult" :key="index" :index="index+1" :data="item" :value="answers[item.ql_id]" :sum="sum[item.ql_id]" :action="action"></do-question>
      </el-collapse-item>
      <el-collapse-item name="3" v-if="data.gap.length>0">
        <template slot="title">
          <h3>&nbsp;<i class="el-icon-caret-right"></i>填空题</h3>
        </template>
        <do-question v-for="(item,index) in data.gap" :key="index" :index="index+1" :data="item" :value="answers[item.ql_id]" :sum="sum[item.ql_id]" :action="action"></do-question>
      </el-collapse-item>
      <el-collapse-item v-if="data.program.length>0" name="4">
        <template slot="title">
          <h3>&nbsp;<i class="el-icon-caret-right"></i>编程题</h3>
        </template>
        <do-question v-for="(item,index) in data.program" :key="index" :index="index+1" :data="item" :value="answers[item.ql_id]" :sum="sum[item.ql_id]" :action="action"></do-question>
      </el-collapse-item>
    </el-collapse>
    <div v-else style="text-align:center">
      无法获取题目
    </div>
    <div class="all-item-hcenter" v-if="action=='do'&&isFailed==false" style="margin-top:40px">
      <el-button type="primary" size="small" @click="submitConfirm">提交</el-button>
    </div>
    <!-- 考试倒计时 -->
    <div class="count-down" v-if="type==2&&action=='do'&&isFailed==false&&isLoading==false">
      结束时间：{{moment(endTime).format('HH:mm')}}<br/> 还有：{{mm}}分{{ss}}秒
    </div>
  </div>
</template>

<script>
import DoQuestion from "./DoQuestion";
export default {
  name: "DoTest",
  components: {
    DoQuestion
  },
  props: ["type"],
  data() {
    return {
      u_id: "",
      c_id: "",
      test_id: "",
      isFailed: false,
      isLoading: true,
      action: "",
      isSubmit: "",
      startTime: 0,
      endTime: 0,
      answers: {},
      sum:{},
      data: {},
      moment: "",
      mm: 0,
      ss: 0,
      timer: null
    };
  },
  created() {
    this.moment = this.$moment;
    this.u_id = getClientUserInfo().u_id;
    this.c_id = this.$route.params.c_id;
    this.test_id = this.$route.params.test_id;
    this.action = this.$route.query.action;
    this.isSubmit = this.$route.query.isSubmit == "yes" ? true : false;
    try {
      this.endTime = parseInt(this.$route.query.endTime);
      this.startTime = parseInt(this.$route.query.startTime);
    } catch (err) {}
    this.getQuestion();
  },
  methods: {
    getQuestion() {
      $httpc
        .get(
          `/user/${this.u_id}/course/${this.c_id}/test/${this.test_id}/detail`
        )
        .then(res => {
          if (this.action == "do" && this.type == 2)
            this.timer = setInterval(this.startCountdown, 1000);
          res.single.forEach(item => {
            item.alternative_answer = JSON.parse(item.alternative_answer);
          });
          res.mult.forEach(item => {
            item.alternative_answer = JSON.parse(item.alternative_answer);
          });
          this.data = res;
          this.getAnswer();
          this.isLoading = false;
        })
        .catch(err => {
          console.error(err);
          this.isFailed = true;
          this.isLoading = false;
        });
    },
    startCountdown() {
      let now = Date.now();
      let left = this.endTime - now;
      if (left < 0) {
        clearInterval(this.timer);
        alertMessage("已到结束数据，自动提交");
        this.submit();
      } else {
        this.mm = Math.round(left / 1000 / 60);
        this.ss = Math.round((left % (1000 * 60)) / 1000);
      }
    },
    getAnswer() {
      if (this.action == "watch" && this.isSubmit) {
        $httpc
          .get(
            `/user/${this.u_id}/course/${this.c_id}/test/${this.test_id}/answer`
          )
          .then(res => {
            this.answers = JSON.parse(res.answer);
            this.sum = JSON.parse(res.sum);
          });
      } else {
        this.data.single.forEach(item => {
          let arr = new Array(item.alternative_answer.length);
          arr.fill(false);
          this.$set(this.answers, item.ql_id, arr);
        });
        this.data.mult.forEach(item => {
          let arr = new Array(item.alternative_answer.length);
          arr.fill(false);
          this.$set(this.answers, item.ql_id, arr);
        });
        this.data.program.forEach(item =>
          this.$set(this.answers, item.ql_id, ["java", ""])
        );
        this.data.gap.forEach(item => {
          let count = item.q_description.match(/\[blank_space\]/g).length;
          let arr = new Array(count);
          arr.fill("");
          this.$set(this.answers, item.ql_id, arr);
        });
      }
    },
    submitConfirm() {
      alertConfirm("确认提交吗（提交后无法修改）？").then(() => {
        this.submit();
      });
    },
    submit() {
      $httpc
        .put(
          `/user/${this.u_id}/course/${this.c_id}/test/${
            this.test_id
          }/submit_answer`,
          { answer: this.answers }
        )
        .then(res => {
          alertMessage("提交成功", "success");
          this.$router.replace(".");
        });
    }
  }
};
</script>

<style scoped>
h3 {
  margin: 0;
  background: #ffe4c4;
}
.count-down {
  position: fixed;
  top: 100px;
  right: 30px;
  padding: 10px;
  background: #75d2f4;
  font-size: 1.3em;
  font-weight: 600;
  color: white;
}
</style>
