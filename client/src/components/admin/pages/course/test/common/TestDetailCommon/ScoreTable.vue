<template>
  <div>
    <el-select v-model="type" @change="changeData">
      <el-option value="0" label="全部"></el-option>
      <el-option v-for="item in options" :key="item.class_id" :label="item.label" :value="item.class_id"></el-option>
    </el-select>
    <el-table :data="tableData" max-height="500">
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column prop="code" label="学号" sortable></el-table-column>
      <el-table-column prop="u_name" label="姓名"></el-table-column>
      <el-table-column prop="class" label="班级" ></el-table-column>
      <el-table-column width="100px" label="成绩" prop="score" :formatter="showScore" sortable></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ScoreTable",
  props: ["data","classList"],
  data() {
    return {
      tableData: [],
      options: [],
      type: "0"
    };
  },
  created() {
    this.$watch("data", this.init);
    this.init();
    bus.$on('testDetailRefresh',()=>{
      this.type='0';
    })
  },
  methods: {
    init() {
      this.tableData = this.data;
      this.data.forEach(item=>item.score==null?item.score=-1:null);
      this.options=this.class;
    },
    showScore(row){
      return row.score==-1 ? '未提交':row.score;
    },
    changeData(value) {
      if (value == "0") this.tableData = this.data;
      else {
        this.tableData = [];
        this.data.forEach(
          item =>
            item.class_id.toString() == value ? this.tableData.push(item) : null
        );
      }
    }
  }
};
</script>

<style>

</style>
