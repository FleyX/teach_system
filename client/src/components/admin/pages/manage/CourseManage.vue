<template>
  <div class="app" style="padding:10px">
    <div class="top" style="text-align:right">
      <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh()"></el-button>
      <el-button type="primary" size="mini" @click="addCourse()">新增课程</el-button>
    </div>
    <el-table :data="showData" @sort-change="sortChange">
      <!-- <el-table-column prop="c_id" label="ID" :show-overflow-tooltip="true"></el-table-column> -->
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column prop="c_name" label="课程名" show-overflow-tooltip sortable='custom'> </el-table-column>
      <el-table-column prop="code" label="课程代码" show-overflow-tooltip sortable='custom'></el-table-column>
      <el-table-column label="任课教师" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.teacher" :key="item.u_id">
            {{index==scope.row.teacher.length-1? item.u_name:item.u_name+', '}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" sortable="custom" show-overflow-tooltip :formatter="row=>this.$moment(row.create_time).format('YYYY-MM-DD')"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button @click="deleteCourse(scope.row)" type="text" style="color:red;" size="small">删除</el-button>
          <el-button @click="editCourse(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="all-item-hcenter">
      <el-pagination layout="prev,pager,next" background :total="size" :current-page="currentPage" @current-change="page=>this.currentPage=page"></el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="isDialogShow" :close-on-click-modal="false" :close-on-press-escape="false" @open="doAction()">
      <edit-course ref="edit-course" v-on:closeDialog="closeDialog"></edit-course>
    </el-dialog>
  </div>
</template>
<script>
import editCourse from "./EditCourse";
export default {
  name: "CourseManage",
  components: {
    editCourse
  },
  data() {
    return {
      isDialogShow: false,
      dialogTitle: "编辑课程",
      currentAction: "edit",
      currentCourse: "",
      currentPage: 1,
      size: 0,
      pageSize: 10,
      tableData: [],
      sort: {
        column: null,
        sort: null
      }
    };
  },
  computed: {
    showData() {
      let temp = this.tableData.slice(0);
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
    this.getCourse();
  },
  methods: {
    sortChange(column) {
      this.sort.column = column.prop;
      this.sort.sort = column.order;
    },
    refresh() {
      this.tableData.splice(0);
      this.getCourse();
    },
    deleteCourse(course) {
      alertConfirm("确认删除该课程及所有相关数据？").then(() => {
        $http.delete("/course/" + course.c_id).then(res => {
          this.tableData.splice(this.tableData.indexOf(course), 1);
          this.size--;
          bus.$emit("updateCourse", "sdf");
          alertMessage("删除成功", 'success');
        });
      })
    },
    editCourse(course) {
      this.dialogTitle = "编辑课程";
      this.currentCourse = JSON.stringify(course);
      this.currentAction = "edit";
      this.isDialogShow = true;
    },
    addCourse() {
      this.dialogTitle = "新增课程";
      this.currentAction = "add";
      this.isDialogShow = true;
    },
    doAction(action) {
      this.$nextTick(function () {
        let editCourse = this.$refs["edit-course"];
        switch (this.currentAction) {
          case "edit":
            editCourse.edit(this.currentCourse);
            break;
          case "add":
            editCourse.add();
            break;
        }
      });
    },
    getCourse() {
      $http.get("/course").then(res => {
        this.size = res.length;
        this.tableData = res;
      });
    },
    closeDialog(data) {
      if (data != undefined) {
        data = JSON.parse(data);
        bus.$emit("updateCourse");
        if (this.currentAction == "edit") {
          let index = this.tableData.findIndex(item => (item.c_id = data.c_id));
          this.$set(this.tableData, index, data);
        } else {
          this.tableData.push(data);
          this.size++;
        }
      }
      this.isDialogShow = false;
    }
  }
};
</script>
<style scoped>
.app {
  text-align: left;
  padding: 10px;
}
.content {
  max-height: calc(100% - 30px);
}
.add-new-corse {
  width: 100%;
}
</style>

