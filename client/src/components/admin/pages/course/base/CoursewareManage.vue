<template>
  <div class="app">
    <el-button type="primary" size="small" @click="isDialogShow=true">上传课件</el-button>
    <el-table :data="tableData" class="table" :default-sort="{prop:'cw_name'}">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="cw_name" sortable label="文件名" width="400px"></el-table-column>
      <el-table-column prop="create_time" sortable label="上传时间" :formatter="formatter"></el-table-column>
      <el-table-column label="操作" fixed="right" width="70px">
        <template slot-scope="scope">
          <el-button type="text" size="small" class="warning" @click="deleteOne(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="上传课件" style="text-align:center" :visible.sync="isDialogShow">
      <el-upload drag :action="uploadUrl" multiple :headers="headers" :before-upload="checkFileName" :on-success="uploadSuccess">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击选择</em>(支持多文件上传)
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "CoursewareManage",
  data() {
    return {
      tableData: [],
      isDialogShow: false,
      c_id: "",
      files: [],
      uploadUrl: "",
      headers: {}
    };
  },
  created() {
    this.c_id = this.$route.params.c_id;
    this.uploadUrl = axios.defaults.baseURL + `/course/${this.c_id}/courseware`;
    this.$set(this.headers, "Authorization", getToken());
    this.getTableData();
  },
  methods: {
    formatter(row, cloumn) {
      return this.$moment
        .unix(row.create_time / 1000)
        .format("YYYY-MM-DD HH:mm");
    },
    getTableData() {
      let _this = this;
      $http.get(`/course/${this.c_id}/courseware`).then(res => {
        _this.tableData = res;
      });
    },
    deleteOne(data) {
      let _this = this;
      alertConfirm("确认删除？").then(() => {
        $http
          .delete(`/course/${this.c_id}/courseware/${data.cw_id}`)
          .then(res => {
            alertMessage("删除成功", "success");
            _this.tableData.splice(_this.tableData.indexOf(data), 1);
          });
      });
    },
    checkFileName(file) {
      if (file.name.length > 50) {
        alertMessage(`${file.name} 文件名超过50字符`, "error");
        return false;
      }
      let res = this.tableData.findIndex(item => {
        return item.cw_name === file.name;
      });
      if (res != -1) {
        alertMessage(`${file.name} 文件重复`, "error");
        return false;
      }
    },
    uploadSuccess(res, file, fileList) {
      res.forEach(item => this.tableData.push(item));
    }
  }
};
</script>
<style scoped>
.app {
  width: 700px;
  padding: 10px;
}
</style>


