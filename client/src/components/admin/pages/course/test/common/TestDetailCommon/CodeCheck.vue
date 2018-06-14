<template>
  <div>
    <el-select v-model="type" placeholder="编程题名" @change="typeChange">
      <el-option value="0" label="全部"></el-option>
      <el-option v-for="(value,key) in questionType" :key="key" :value="key" :label="value"></el-option>
    </el-select>
    <el-table :data="tableData" max-height="500">
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column label="编程题名" prop="q_simple_description" show-overflow-tooltip></el-table-column>
      <el-table-column label="提交人" prop="u_full_name" show-overflow-tooltip></el-table-column>
      <el-table-column label="编译信息" show-overflow-tooltip :formatter="compileInfo"></el-table-column>
      <el-table-column label="得分" prop="score"></el-table-column>
      <el-table-column label="重复率(%)" sortable prop="percent"></el-table-column>
      <el-table-column label="对方" prop="other_name" show-overflow-tooltip></el-table-column>
      <el-table-column label="代码">
        <template slot-scope="scope">
          <el-button type="text" @click="showCode(scope.row)" size="mini">查看代码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="currentCode[0]" :visible.sync="isDialogShow" width="50%">
      <pre>{{currentCode[1]}}</pre>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "codeCheck",
  props: ['data'],
  data() {
    return {
      type: '0',
      tableData: [],
      nameObj: {},
      currentCode: [],
      isDialogShow: false
    }
  },
  computed: {
    questionType() {
      let temp = {};
      this.data.dataList.forEach(item => {
        if (temp[item.ql_id] == undefined) {
          temp[item.ql_id] = item.q_simple_description;
        }
      })
      return temp;
    }
  },
  created() {
    this.$watch('data', this.init);
    this.init();
    bus.$on('testDetailRefresh',()=>{
      this.type='0';
    })
  },
  methods: {
    init() {
      this.tableData = this.data.dataList;
      let name = {};
      this.data.dataList.forEach(item => {
        if (name[item.u_id] == undefined) {
          name[item.u_id] = item.grade + '-' + item.class + '-' + item.u_name;
        }
      })
      this.data.dataList.forEach(item => {
        item.u_full_name = name[item.u_id];
        let questionList = this.data.res[item.ql_id];
        if (questionList != undefined && questionList[item.u_id] != undefined) {
          let temp = questionList[item.u_id];
          item.percent = parseInt(temp.percent);
          item.other_name = name[temp.u_id];
          item.other_id = temp.u_id;
        } else {
          item.percent = 0;
          item.other_name = '';
          item.other_id = 0;
        }
      })
    },
    compileInfo(row) {
      let temp = JSON.parse(row.sum);
      if (temp.err == null)
        return "编译通过";
      else
        return temp.data;
    },
    typeChange(value) {
      let id = parseInt(value);
      if (id == 0) {
        this.tableData = this.data.dataList;
      } else {
        this.tableData = this.data.dataList.filter(item => item.ql_id == id);
      }
    },
    showCode(row) {
      console.log(row.answer);
      this.currentCode = JSON.parse(row.answer);
      this.isDialogShow = true;
    }
  }
}
</script>

<style>
</style>
