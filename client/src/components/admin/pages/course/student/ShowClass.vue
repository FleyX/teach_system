<template>
  <div class="main">
    <el-table :data="tableData" style="width:100%">
      <el-table-column type="index" width="50px" label="#"></el-table-column>
      <el-table-column prop="code" label="学号" sortable></el-table-column>
      <el-table-column prop="u_name" label="姓名" sortable></el-table-column>
      <el-table-column prop="evaluate" label="水平值" sortable></el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex==0">男</span>
          <span v-else-if="scope.row.sex==1">女</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="email_addr" label="邮箱地址"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" style="color:red" @click="deleteOne(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="isDialogShow" :close-on-click-modal="false" :close-on-press-escape="false" title="编辑">
      <edit-student ref="editStudent" v-on:closeDialog="closeDialog" :data="currentRowData"></edit-student>
    </el-dialog>
  </div>
</template>
<script>
import EditStudent from "./EditStudent";
export default {
  name: "ShowClass",
  components: {
    EditStudent
  },
  props: ["id"],
  data() {
    return {
      tableData: [],
      isDialogShow: false,
      currentRowData: ""
    };
  },
  created() {
    this.getData();
  },
  watch: {
    id(val) {
      this.tableData = [];
      this.getData();
    }
  },
  methods: {
    edit(data) {
      this.currentRowData = data;
      this.isDialogShow = true;
      this.$nextTick(function () {
        this.$refs.editStudent.init(data);
      });
    },
    deleteOne(data) {
      let _this = this;
      alertConfirm("确认从本班中删除该同学吗？").then(() => {
        $http.delete(`/class/${_this.id}/user/${data.u_id}`).then(res => {
          _this.$message({ message: '删除成功', type: 'success', center: true });
          _this.tableData.splice(_this.tableData.indexOf(data), 1);
        })
      })
    },
    getData() {
      if (this.id == "") {
        this.tableData = [];
        return;
      }
      let _this = this;
      $http.get(`/class/${this.id}/user`).then(res => {
        _this.tableData = res;
      });
    },
    closeDialog(data) {
      if (data != undefined) {
        this.currentRowData.code = data.code;
        this.currentRowData.u_name = data.u_name;
        this.currentRowData.email_addr = data.email_addr;
      }
      this.isDialogShow = false;
      this.currentRowData = "";
    }
  }
};
</script>
<style scoped>
</style>

