<template>
  <div>
    <el-form label-width="150px">
      <el-form-item label="当前在线用户">
        {{onlineNum}}
      </el-form-item>
      <el-form-item label="用户上次登录时间">
        <div class="chart" id="chart1"></div>
      </el-form-item>
      <el-form-item label="测试数目">
        <span>系统共进行：{{testData.count}}次测试</span>
        <h5>最近7天测试情况</h5>
        <div id="test-chart" class="chart"></div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "TotalStatistic",
  data() {
    return {
      visitData: [],
      testData: {},
      onlineNum: "加载中",
    };
  },
  mounted() {
    this.getOnlineNum();
    this.getVisitData();
    this.getTestData();
  },
  methods: {
    getVisitData() {
      $http.get(`/user/statistics/login_time`).then(res => {
        this.visitData = res;
        this.createLoginTimeChart();
      });
    },
    getTestData() {
      $http.get(`/test/statistics/test_num`).then(res => {
        this.testData = res;
        this.createTestChart();
      })
    },
    getOnlineNum() {
      $http.get(`/user/statistics/online`).then(res => (this.onlineNum = res));
    },
    createLoginTimeChart() {
      let chart1 = new G2.Chart({
        container: "chart1",
        width: 700,
        heigth: 600,
        forceFit: true
      });
      let defs = {
        key: {
          type: "cat",
          alias: "时间"
        },
        value: {
          alias: "人数",
          range: [0, 1]
        }
      };
      chart1.source(this.visitData, defs);
      chart1.line().position("key*value");
      chart1
        .point()
        .position("key*value")
        .size(4)
        .shape("circle")
        .style({
          stroke: "#fff",
          lineWidth: 1
        });
      chart1.render();
      this.chart1 = chart1;
    },
    createTestChart() {
      let chart1 = new G2.Chart({
        container: "test-chart",
        width: 700,
        heigth: 600,
        forceFit: true
      });
      let defs = {
        key: {
          type: "cat",
          alias: "时间"
        },
        value: {
          alias: "次数",
          range: [0, 1]
        }
      };
      chart1.source(this.testData.data, defs);
      chart1.line().position("key*value");
      chart1
        .point()
        .position("key*value")
        .size(4)
        .shape("circle")
        .style({
          stroke: "#fff",
          lineWidth: 1
        });
      chart1.render();
      this.chart2 = chart1;
    }
  }
};
</script>
<style scoped>
.chart{
  max-width:80%;
}
</style>

