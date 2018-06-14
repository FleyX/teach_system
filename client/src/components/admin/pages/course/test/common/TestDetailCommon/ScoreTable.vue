<template>
  <div>
    <el-select v-model="type" @change="changeData">
      <el-option value="0" label="全部"></el-option>
      <el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.class_id"></el-option>
    </el-select>
    <el-table :data="tableData" max-height="500px">
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column prop="code" label="学号" sortable></el-table-column>
      <el-table-column prop="u_name" label="姓名"></el-table-column>
      <el-table-column label="班级" :formatter="row=>row.grade+' - '+row.class"></el-table-column>
      <el-table-column width="100px" label="成绩" prop="score" sortable></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ScoreTable",
  props: ["data"],
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
      this.options=[];
      let temp = {};
      this.data.forEach(item => {
        if (temp[item.class_id] == undefined) {
          temp[item.class_id] = item.grade + "-" + item.class;
        }
      });
      for (let key in temp) {
        this.options.push({
          class_id: key,
          label: temp[key]
        });
      }
      this.options.sort((a, b) => a.label > b.label);
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
