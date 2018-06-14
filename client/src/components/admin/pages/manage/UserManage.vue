<template>
  <div class="app" style="padding:10px">
    <div class="top all-item-between all-item-vcenter">
      <div style="width=50%">
        <el-input placeholder="请输入内容" v-model="search.content" class="input-with-select">
          <el-select v-model="search.filed" slot="prepend" placeholder="请选择">
            <el-option label="姓名" value="u_name"></el-option>
            <el-option label="学工号" value="code"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
        </el-input>
      </div>
      <div style="width=50%;text-align:right">
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh()"></el-button>
        <el-button type="danger" size="mini" @click="deleteAll()">批量删除</el-button>
        <el-button type="primary" size="mini" @click="addUser()">新增用户</el-button>
      </div>
    </div>
    <el-table :data="tableData" size="middle" @filter-change="filterChange" max-height="800px" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px"></el-table-column>
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column prop="code" sortable label="学工号"></el-table-column>
      <el-table-column prop="u_name" sortable label="姓名"> </el-table-column>
      <el-table-column prop="u_type" label="用户类型" :filters="userFilter" filter-placement="bottom-start">
        <template slot-scope="scope">
          <span v-if="scope.row.u_type=='0'">管理员</span>
          <span v-else-if="scope.row.u_type=='1'">教师</span>
          <!-- <span v-else-if="scope.row.u_type=='2'">助教</span> -->
          <span v-else>学生</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="email_addr" label="邮件地址"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button @click="deleteOne(scope.row)" type="text" style="color:red;" size="small">删除</el-button>
          <el-button @click="editUser(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="all-item-hcenter">
      <el-pagination layout="prev,pager,next" background :total="size" @current-change="changePage"></el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="isDialogShow" :close-on-click-modal="false" :close-on-press-escape="false" @open="doAction()">
      <edit-user ref="edit-user" v-on:closeDialog="closeDialog"></edit-user>
    </el-dialog>
  </div>
</template>
<script>
import EditUser from './EditUser'
export default {
  name: "UserManage",
  components: {
    EditUser
  },
  data() {
    return {
      dialogTitle: "编辑用户",
      isDialogShow: false,
      currentAction: "edit",
      currentUser: {},
      search: {
        filed: "",
        content: ""
      },
      param: {
        start: 0,
        orderBy: "u_id",
        sort: "desc",
        count: true,
        u_type: []
      },
      userFilter: [
        {
          text: "管理员",
          value: 0
        },
        {
          text: "教师",
          value: 1
        },
        // {
        //   text: "助教",
        //   value: 2
        // },
        {
          text: "学生",
          value: 3
        }
      ],
      size: 0,
      pageSize: 10,
      tableData: [],
      multipleSelection: []
    };
  },
  created() {
    this.getUser(this.param);
  },
  methods: {
    changePage(currentPage) {
      this.param.start = this.pageSize * (currentPage - 1);
      this.getUser(this.param);
    },
    resetParam() {
      this.param.start = 0;
      this.param.count = true;
      this.size = 0;
      this.tableData = [];
      this.multipleSelection = [];
    },
    refresh() {
      this.resetParam();
      this.getUser(this.param);
    },
    doSearch() {
      this.resetParam();
      let param = Object.assign(this.param);
      param.search = this.search;
      this.getUser(param);
    },
    editUser(user) {
      this.currentAction = "edit";
      this.currentUser = JSON.stringify(user);
      this.dialogTitle = "编辑用户";
      this.isDialogShow = true;
    },
    addUser() {
      this.currentAction = "add";
      this.dialogTitle = "新增用户";
      this.isDialogShow = true;
    },
    deleteAll() {
      let _this = this;
      this.$confirm("确认删除所有选中用户及所有相关数据？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        _this.multipleSelection.forEach(item => {
          if (item.u_id == getUserInfo().u_id) {
            _this.$notify({
              title: "错误",
              message: "不能删除自己",
              type: "error"
            });
            return;
          }
          $http.delete("/user/" + item.u_id).then(res => {
            let index = _this.tableData.indexOf(item);
            _this.tableData.splice(index, 1);
            _this.$notify({
              title: "成功",
              message: "删除 "+item.u_name+" 成功",
              type: "success"
            });
          });
        });
      });
    },
    deleteOne(info) {
      let _this = this;
      this.$confirm("确认删除该用户及所有相关数据？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        $http.delete("/user/" + info.u_id).then(res => {
          let index = _this.tableData.indexOf(info);
          _this.tableData.splice(index, 1);
          _this.$message({
            message: "删除成功",
            type: "success"
          });
        });
      });
    },
    doAction() {
      this.$nextTick(function() {
        let editUser = this.$refs["edit-user"];
        switch (this.currentAction) {
          case "edit":
            editUser.edit(this.currentUser);
            break;
          case "add":
            editUser.add();
            break;
        }
      });
    },
    getUser(param) {
      let _this = this;
      $http
        .get("/user?data=" + Base64.encodeURI(JSON.stringify(param)))
        .then(res => {
          if (_this.param.count == true) {
            _this.param.count = false;
            _this.size = res.count;
            _this.param.start += res.data.length;
            _this.tableData = res.data;
          } else {
            _this.tableData = res;
            _this.param.start += res.length;
          }
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    closeDialog(data) {
      if (data != undefined) {
        if (this.currentAction == "edit") {
          this.tableData.forEach(item => {
            if (item.u_id == data.u_id) {
              item.u_name = data.u_name;
              item.u_type = parseInt(data.u_type);
              item.code = data.code;
              item.email_addr = data.email_addr;
            }
          });
          if (data.u_id == getUserInfo().u_id) {
            bus.$emit("updateUserInfo");
          }
        } else {
          this.tableData.push({
            u_id: data.u_id,
            u_name: data.u_name,
            u_type: parseInt(data.u_type),
            code: data.code,
            email_addr: data.email_addr
          });
        }
      }
      this.isDialogShow = false;
    },
    filterUserType(val, row, clown) {
      return row["u_type"] == val;
    },
    filterChange(data) {
      console.log(data);
      for (let item in data) {
        this.param.u_type = data[item];
      }
      this.resetParam();
      this.getUser(this.param);
    }
  }
};
</script>
<style scoped>
.app {
  text-align: left;
}
td {
  padding: 5px;
}
.el-select {
  width: 100px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>

