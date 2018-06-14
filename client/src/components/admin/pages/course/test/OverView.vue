<template>
  <div class="app">
    <div v-show="action=='overview'">
      <div class="all-item-between">
        <el-select v-model="t_type" placeholder="类别">
          <el-option label="作业" value="1"></el-option>
          <el-option label="考试" value="2"></el-option>
          <el-option label="全部" value="0"></el-option>
        </el-select>
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh()"></el-button>
      </div>
      <el-table :data="showData" @sort-change="sortChange">
        <!-- <el-table-column prop="test_id" label="编号"></el-table-column> -->
        <el-table-column type="index" width="50px"></el-table-column>
        <el-table-column prop="test_name" label="测试名称" sortable="custom" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="demand" label="要求" show-overflow-tooltip></el-table-column> -->
        <el-table-column label="题组" >
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.qg_id!=null" size="mini" @click="showQuestionGroup(scope.row.qg_id)">查看</el-button>
            <span v-else>智能组题</span>
          </template>
        </el-table-column>
        <el-table-column prop="t_type" label="类型" :formatter="row=>row.t_type==1?'作业':'考试'" ></el-table-column>
        <el-table-column prop="score" label="总分" ></el-table-column>
        <el-table-column prop="start_time" sortable="custom" label="开始时间"  :formatter="row=>this.$moment.unix(row.start_time/1000).format('YYYY-MM-DD HH:mm')"></el-table-column>
        <el-table-column prop="end_time" sortable="custom" label="结束时间"  :formatter="row=>this.$moment.unix(row.end_time/1000).format('YYYY-MM-DD HH:mm')"></el-table-column>
        <el-table-column label="操作" fixed="right" width="100px">
          <template slot-scope="scope">
            <el-button type="text" class="warning" @click="deleteOne(scope.row)" size="mini">删除</el-button>
            <el-button type="text" @click="testDetail(scope.row)" size="mini">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="all-item-hcenter">
        <el-pagination background layout="prev,pager,next" :total="size" @current-change="page=>this.currentPage=page"></el-pagination>
      </div>
      <el-dialog :visible.sync="isDialogShow" title="题组详情">
        <show-question-group :qg_id="currentQgId"></show-question-group>
      </el-dialog>
    </div>
    <div v-show="action=='detail'">
      <el-button type="text" @click="()=>{this.action='overview'}">返回</el-button>
      <test-detail :data="currentTest"></test-detail>
    </div>
  </div>
</template>

<script>
import ShowQuestionGroup from "../../../common/ShowQuestionGroup";
import TestDetail from "./common/TestDetail";
export default {
  name: "OVerView",
  components: {
    ShowQuestionGroup,
    TestDetail
  },
  data() {
    return {
      size: 0,
      pageSize: 10,
      currentPage: 1,
      c_id: '',
      t_type: '0',
      sort: {
        column: null,
        sort: null
      },
      tableData: [],
      currentQgId: "",
      isDialogShow: false,
      action: "overview",
      currentTest: ""
    };
  },
  computed: {
    showData() {
      let temp = this.tableData.slice(0);
      if (this.t_type == '1' || this.t_type == '2')
        temp = temp.filter(item => item.t_type.toString() == this.t_type);
      if (this.sort.column != null)
        temp.sort((a, b) => {
          let a1 = a[this.sort.column];
          let b1 = b[this.sort.column];
          return this.sort.sort == 'ascending' ? a1 - b1 : b1 - a1;
        })
      let start = this.pageSize * (this.currentPage - 1);
      let res = temp.slice(start, start + this.pageSize);
      return res;
    }
  },
  created() {
    this.c_id = this.$route.params.c_id;
    this.getTableData();
  },
  methods: {
    sortChange(column) {
      this.sort.column = column.prop;
      this.sort.sort = column.order;
    },
    refresh(){
      this.tableData=[];
      this.size=0;
      this.getTableData();
    },
    showQuestionGroup(qg_id) {
      this.currentQgId = qg_id;
      this.isDialogShow = true;
    },
    getTableData() {
      $http.get("/test?c_id=" + this.$route.params.c_id).then(res => {
        this.size = res.length;
        this.tableData = res;
      });
    },
    deleteOne(row) {
      alertConfirm("确认删除吗？").then(() => {
        $http.delete(`/course/${this.c_id}/test/${row.test_id}`).then(res => {
          alertMessage("删除成功", "success");
          this.tableData.splice(this.tableData.indexOf(row), 1);
          this.size--;
        });
      });
    },
    testDetail(row) {
      this.currentTest = row;
      this.action = "detail";
    }
  }
};
</script>

<style scoped>

</style>
