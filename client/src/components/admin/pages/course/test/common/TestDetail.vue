<template>
  <div class="app" v-loading="isLoading<2" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-form label-width="100px">
      <el-form-item>
        <template slot="label">
          <span class="title">更新时间</span>
        </template>
        {{$moment(detailData.updateTime).format('HH:mm:ss')}}
        <el-button type="primary" size="mini" @click="refresh">刷新</el-button>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <span class="title">{{data.t_type==1?'作业名':'考试名'}}</span>
        </template>
        {{data.test_name}}
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <span class="title">结束时间</span>
        </template>
        {{$moment(data.end_time).format('YYYY-MM-DD HH:mm')}}
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <span class="title">学生成绩</span>
        </template>
        <!-- <el-button type="text" size="small" @click="isScoreTableShow=!isScoreTableShow">{{isScoreTableShow?'取消':'查看'}}</el-button> -->
        <score-table :data="detailData.score" :classList="detailData.class"></score-table>
      </el-form-item>
      <el-form-item v-if="data.qg_id!=null">
        <template slot="label">
          <span class="title">编程题情况</span>
        </template>
        <code-check :data="checkRepeat"></code-check>
      </el-form-item>
      <el-form-item v-if="data.qg_id!=null">
        <template slot="label">
          <span class="title">答题统计</span>
        </template>
        <question-right-percent :data="detailData.questionList"></question-right-percent>
      </el-form-item>
      <el-form-item v-if="data.qg_id!=null" >
        <template slot="label">
          <span class="title">知识点统计</span>
        </template>
        <knowledge-point-percent :data="detailData.knowledgeList"></knowledge-point-percent>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ScoreTable from './TestDetailCommon/ScoreTable'
import QuestionRightPercent from './TestDetailCommon/QuestionRightPercent'
import KnowledgePointPercent from './TestDetailCommon/KnowledgePontPercent'
import CodeCheck from './TestDetailCommon/CodeCheck'
export default {
  name: "TestDetail",
  props: ["data"],
  components: {
    ScoreTable,
    QuestionRightPercent,
    KnowledgePointPercent,
    CodeCheck
  },
  data() {
    return {
      isLoading: 0,
      isScoreTableShow: false,
      checkRepeat: {
        res: {},
        dataList: []
      },
      detailData: {
        score: [],
        questionList: [],
        knowledgeList: [],
        updateTime: 0
      }
    };
  },
  created() {
    this.$watch("data", () => {
      this.isLoading = true;
      this.checkRepeat = {
        res: {}, dataList: []
      };
      this.detailData = {
        score: [],
        questionList: [],
        knowledgeList: [],
        updateTime: 0
      };
      this.getData();
      this.codeCheck();
    });
    this.codeCheck();
    this.getData();
  },
  methods: {
    refresh() {
      this.isLoading = 0;
      bus.$emit('testDetailRefresh');
      this.getData('new');
      this.codeCheck('new');
    },
    getData(type='old') {
      if (this.data == "") return;
      $http.get(`/test/${this.data.test_id}/detail?type=${type}`).then(res => {
        this.detailData = res;
        this.isLoading++;
      });
    },
    codeCheck(type='old') {
      if (this.data == '') return;
      $http.get(`/test/${this.data.test_id}/code_check?type=${type}`).then(res => {
        this.checkRepeat = res;
        this.isLoading++;
      })
    }
  }
};
</script>

<style scoped>
.app {
  min-height: 500px;
  width: 100%;
}
.title{
  font-weight: 600;
  font-size: 1.1em;
}
</style>
