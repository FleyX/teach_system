<template>
  <div class="app">
    <el-form label-width="100px">
      <el-form-item label="学生数量">
        {{data.studentNum}}
      </el-form-item>
      <el-form-item label="水平分布">
        <div class="all-item-start">
          <div class="evaluate-text">
            <div v-for="(item,index) in data.evaluate" :key="index">
              <span class="item">{{item.range}}</span>：{{item.num}}人
            </div>
          </div>
          <div class="evaluate-chart" id='sf'></div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "StudentStatistics",
  data() {
    return {
      data: {
        studentNum: 0,
        evaluate: []
      },
      c_id: ""
    };
  },
  mounted() {
    this.$watch('$route.path', this.getData);
    this.getData();
  },
  methods: {
    getData() {
      this.c_id = this.$route.params.c_id;
      document.getElementById("sf").innerHTML='';
      $http.get(`/course/${this.c_id}/statistics`).then(res => {
        this.data = res;
        this.createChart1();
      });
    },
    createChart1() {
      const { DataView } = DataSet;
      const dv = new DataView();
      dv.source(this.data.evaluate).transform({
        type: "percent",
        field: "num",
        dimension: "range",
        as: "percent"
      });
      const chart = new G2.Chart({
        container: "sf",
        forceFit: true,
        height: 300
      });
      chart.source(dv, {
        percent: {
          formatter: val => {
            val = (val * 100).toFixed(0) + "%";
            return val;
          }
        }
      });
      chart.coord("theta");
      chart.tooltip({
        showTitle: false,
        itemTpl:
          '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      });
      chart
        .intervalStack()
        .position("percent")
        .color("range")
        .label("percent", {
          offset: -40,
          // autoRotate: false,
          textStyle: {
            rotate: 0,
            textAlign: "center",
            shadowBlur: 2,
            shadowColor: "rgba(0, 0, 0, .45)"
          }
        })
        .tooltip("range*percent", (range, percent) => {
          percent = (percent * 100).toFixed(0) + "%";
          return {
            name: range,
            value: percent
          };
        })
        .style({
          lineWidth: 1,
          stroke: "#fff"
        });
      chart.render();
    }
  }
};
</script>
<style scoped>
.evaluate-text {
  /* width:300x; */
  padding-top: 30px;
  padding-left: 20px;
}
.evaluate-chart {
  width: 400px;
}
.item {
  display: inline-block;
  width: 30px;
  text-align: right;
}
</style>


