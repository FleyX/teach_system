<template>
  <div class="app">
    <el-table :data="tableData" size="middle" @sort-change="sortTable" :default-sort="{prop:'start_time',order:'descending'}">
      <el-table-column type="index" width="55px"></el-table-column>
      <el-table-column prop="topic" sortable label="主题" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          <el-button type="text" @click="showContent(scope.row.a_id)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="start_time" sortable label="开始时间" :formatter="format1"></el-table-column>
      <el-table-column prop="end_time" sortable label="结束时间" :formatter="format2"></el-table-column>
      <el-table-column label="操作" width="100px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" style="color:red" @click="deleteOne(scope.row)">删除</el-button>
          <el-button type="text" size="small" :class="{warning:!scope.row.isClosed}" @click="switchOne(scope.row)">{{scope.row.isClosed?'开启':'关闭'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="all-item-hcenter">
      <el-pagination layout="prev,pager,next" background :total="size" @current-change="changePage"></el-pagination>
    </div>
    <el-dialog title="公告内容" :visible.sync="isDialogShow" width="800px" center>
      <div v-html="content"></div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "AnnouncementOverView",
  data() {
    return {
      param: {
        start: 0,
        column: "start_time", //排序字段
        sort: "desc", //排序顺序
        count: true,
        c_id: ""
      },
      size: 0,
      pageSize: 10,
      tableData: [],
      content: "",
      isDialogShow: false
    };
  },
  created() {
    this.param.c_id = this.$route.params.c_id;
    this.getTableData();
  },
  methods: {
    sortTable({ column, prop, order }) {
      if (column == null) return;
      this.param.column = prop;
      this.param.sort = order == "ascending" ? "asc" : "desc";
      this.param.start = 0;
      this.param.count = true;
      this.size = 0;
      this.tableData = [];
      this.getTableData();
    },
    changePage(currentPage) {
      this.param.start = this.pageSize * (currentPage - 1);
      this.getTableData();
    },
    getTableData() {
      let _this = this;
      $http
        .get(
          "/announcement?data=" + Base64.encodeURI(JSON.stringify(this.param))
        )
        .then(res => {
          if (_this.param.count == true) {
            _this.param.count = false;
            _this.size = res.count;
            _this.tableData = res.data;
          } else {
            _this.tableData = res.data;
          }
        });
    },
    format1(row, column) {
      return this.$moment
        .unix(row.start_time / 1000)
        .format("YYYY-MM-DD HH:mm");
    },
    format2(row, column) {
      if (row.end_time - Date.now() > 10 * 365 * 24 * 60 * 60 * 1000) {
        return "无";
      } else {
        return this.$moment
          .unix(row.end_time / 1000)
          .format("YYYY-MM-DD HH:mm");
      }
    },
    showContent(a_id) {
      let _this = this;
      $http.get(`/announcement/${a_id}/content?a_id=`).then(res => {
        _this.content = res;
        _this.isDialogShow = true;
      });
    },
    switchOne(data) {
      $http
        .put(`/announcement/${data.a_id}/switch?action=${data.isClosed}`)
        .then(res => {
          data.end_time = res.end_time;
          data.start_time = res.start_time;
          data.isClosed = !data.isClosed;
          if (data.isClosed) alertMessage("关闭成功", "success");
          else alertMessage("开启成功", "success");
        });
    },
    deleteOne(data) {
      let _this = this;
      this.$confirm("确认删除该公告吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        $http.delete(`/announcement/${data.a_id}`).then(res => {
          _this.$message({
            message: "删除成功",
            type: "success",
            center: true
          });
          _this.tableData.splice(_this.tableData.indexOf(data), 1);
        });
      });
    }
  }
};
</script>
<style scoped>

</style>


