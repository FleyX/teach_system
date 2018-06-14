<template>
  <el-form label-width="100px" style="margin-bottom:20px" >
    <el-form-item label="选择出题方式">
      <el-select v-model="type" @change="typeChange">
        <el-option label="选择题组" value="1"></el-option>
        <el-option label="自动组卷" value="2"></el-option>
      </el-select>
    </el-form-item>
    <!-- 选择题组 -->
    <div v-if="type=='1'">
      <div>当前选中：{{qg_data.qg_name}}</div>
      <question-group-table type="2" v-on:choseQuestionGroup="data=>this.qg_data=data"></question-group-table>
    </div>
    <!-- 自动组卷 -->
    <div v-if="type=='2'">
      <el-form-item label='试卷难度'>
        <el-input type="text" style="width:100px" v-model="param.level"></el-input>
      </el-form-item>
      <el-form-item label="考试范围">
        <el-transfer @change="update" :props="{key:'s_id',label:'s_name'}" :data="sectionData" v-model="param.sections" :titles="['所有章节','出题范围']">
        </el-transfer>
      </el-form-item>
      <el-form-item label="题目详情">
        <el-form label-width="70px">
          <el-form-item label="单择题">
            <el-input @input="update" class="question-num" v-model="param.question.single.num"></el-input> 道，每题
            <el-input @input="update" class="question-num" v-model="param.question.single.score"></el-input> 分
          </el-form-item>
          <el-form-item label="多择题">
            <el-input @input="update" class="question-num" v-model="param.question.mult.num"></el-input> 道，每题
            <el-input @input="update" class="question-num" v-model="param.question.mult.score"></el-input> 分
          </el-form-item>
          <el-form-item label="填空题">
            <el-input @input="update" class="question-num" v-model="param.question.gap.num"></el-input> 道，每题
            <el-input @input="update" class="question-num" v-model="param.question.gap.score"></el-input> 分
          </el-form-item>
          <el-form-item label="编程题">
            <el-input @input="update" class="question-num" v-model="param.question.program.num"></el-input> 道，每题
            <el-input @input="update" class="question-num" v-model="param.question.program.score"></el-input> 分
          </el-form-item>
        </el-form>
        总分：{{allScore}}

      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import QuestionGroupTable from "../../QuestionBank/common/QuestionGroupTable";
export default {
  name: "ChoseExamQuestion",
  components: {
    QuestionGroupTable
  },
  props: ["name"],
  data() {
    return {
      type: "",
      qg_data: {},
      param: {
        question: {
          single: { num: "5", score: "5" },
          mult: { num: "3", score: "5" },
          gap: { num: "4", score: "5" },
          program: { num: "2", score: "20" }
        },
        sections: [],
        level: "3",
        allScore:0
      },
      sectionData: []
    };
  },
  watch: {
    qg_data(newValue) {
      this.update();
    },
    'param.sections':function(newValue){
      this.update();
    }
  },
  computed: {
    allScore() {
      let num = 0;
      for (let key in this.param.question) {
        num +=
          parseInt(this.param.question[key].num) * parseInt(this.param.question[key].score);
      }
      this.param.allScore=num;
      return num;
    }
  },
  created() {
    this.c_id = this.$route.params.c_id;
    this.getSectionData();
  },
  methods: {
    getSectionData() {
      $http.get(`/course/${this.c_id}/section`).then(res => {
        this.sectionData = res;
      });
    },
    typeChange(){
      this.$emit("questionChange", null);
    },
    update() {
      let data;
      if (this.type == "1") {
        data = this.qg_data;
      } else if (this.type == "2") {
        data = this.param;
      }
      this.$emit("questionChange", { type: this.type, data });
    }
  }
};
</script>

<style scoped>
.question-num {
  width: 4em;
}
</style>
