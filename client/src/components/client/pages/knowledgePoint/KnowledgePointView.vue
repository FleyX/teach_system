<template>
  <div>
    <breadcrumb :data="['知识点总览']"></breadcrumb>
    <div class="app" v-loading="isLoad!=2" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-tooltip effect="dark" :content="tooltip" placement="right">
        <span>我的覆盖率：{{coverage*100+'%'}}</span>
      </el-tooltip>
      <el-tree style="margin-top:5px" :data="pointData" :props="defaultProps" highlight-current accordion @node-click="handleClick"></el-tree>
      <div v-if="isShow">
        做题数：{{currentKpData.count}} 正确数：{{currentKpData.right_count}} 正确率：{{rightPrecent}}
        <el-button type="primary" size="small" @click="isParamShow=true">专项练习</el-button>
      </div>
      <div v-if="isParamShow">
        <div>
          单选题：
          <el-input type="text" v-model="form.question.single.num" style="width:100px"></el-input>道
        </div>
        <div>
          多选题：
          <el-input type="text" v-model="form.question.mult.num" style="width:100px"></el-input>道
        </div>
        <div>
          填空题：
          <el-input type="text" v-model="form.question.gap.num" style="width:100px"></el-input>道
        </div>
        <div>
          编程题：
          <el-input type="text" v-model="form.question.program.num" style="width:100px"></el-input>道
        </div>
        总分：{{allScore}}
        <div class="all-item-hcenter">
          <el-button type="primary" size="small" @click="submit">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "knowledgePointView",
  data() {
    return {
      c_id: "",
      u_id: "",
      pointData: [],
      studentData: [],
      tooltip: "某知识点做题数达到5题，且正确率达到80%，认为已掌握",
      coverage:'',
      isLoad: 0,
      currentKpData: {},
      isShow: false,
      isParamShow: false,
      form: {
        knowledgePoint: [],
        kp_name: "",
        allScore: 0,
        question: {
          single: { num: "2", score: "5" },
          mult: { num: "2", score: "5" },
          gap: { num: "2", score: "5" },
          program: { num: "1", score: "20" }
        }
      },
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  computed: {
    rightPrecent() {
      if (this.currentKpData.count == 0) return 0;
      else
        return (
          (
            this.currentKpData.right_count /
            this.currentKpData.count *
            100
          ).toFixed(1) + "%"
        );
    },
    allScore() {
      let num = 0;
      for (let key in this.form.question) {
        num +=
          parseInt(this.form.question[key].num) *
          parseInt(this.form.question[key].score);
      }
      this.form.allScore = num;
      return num;
    }
  },
  created() {
    this.c_id = this.$route.params.c_id;
    this.u_id = getClientUserInfo().u_id;
    this.getPointData();
    this.getStudentData();
    this.getCoverage();
  },
  methods: {
    getPointData() {
      $httpc.get(`/course/${this.c_id}/knowledge_point_tree`).then(res => {
        this.pointData = res.children;
        this.isLoad++;
      });
    },
    getCoverage(){
      $httpc.get(`/user/${this.u_id}/course/${this.c_id}/rank?type=coverage`).then(res=>{
        this.coverage=res;
      })
    },
    getStudentData() {
      $httpc
        .get(`/user/${this.u_id}/course/${this.c_id}/knowledge_point/condition`)
        .then(res => {
          let temp = {};
          res.forEach(
            item =>
              (temp[item.kp_id] = {
                count: item.count,
                right_count: item.right_count
              })
          );
          this.studentData = temp;
          this.isLoad++;
        });
    },
    handleClick(data) {
      if (data.level == 3) {
        this.isShow = true;
        this.form.knowledgePoint = [data.id];
        this.form.kp_name = data.label;
        if (this.studentData[data.id] == undefined) {
          this.currentKpData = { count: 0, right_count: 0 };
        } else {
          this.currentKpData = this.studentData[data.id];
        }
      } else {
        this.isShow = false;
      }
    },
    submit() {
      alertConfirm("确认提交？").then(() => {
        $httpc
          .post(`/user/${this.u_id}/course/${this.c_id}/test`, this.form)
          .then(res => {
            alertMessage("提交成功",'success');
            this.$router.push('history');
          });
      });
    }
  }
};
</script>

<style scoped>
.app {
  min-height: 400px;
}
</style>
