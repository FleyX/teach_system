<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="课程名称">
        <el-input v-model="form.c_name" @keydown.enter.native="submit"></el-input>
      </el-form-item>
      <el-form-item label="课程代码">
        <el-input v-model="form.code" @keydown.enter.native="submit"></el-input>
      </el-form-item>
      <el-form-item label="授课教师">
        <el-tag v-for="item in form.teacher" closable :key="item.u_id" @close="deleteTeacher(item.u_id)">{{item.u_name}}</el-tag>
        <el-select style="width:130px" v-model="selectValve" @change="addTeacher" filterable placeholder="新增(可搜索)">
          <el-option v-for="(value,key) in allTeacher" :key="key" :label="value" :value="key"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="action all-item-around">
      <el-button type="warning" size="small" @click="close()">取消</el-button>
      <el-button type="primary" size="small" @click="submit()">提交</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "EditCourse",
  data() {
    return {
      form: {},
      selectValve: "",
      allTeacher: {},
      currentAction: "edit"
    };
  },
  methods: {
    addTeacher(key) {
      this.selectValve = "";
      for (let i in this.form.teacher) {
        if (this.form.teacher[i].u_id == key) {
          this.$message({
            message: "本课程已添加该教师",
            type: "error"
          });
          return;
        }
      }
      this.form.teacher.push({ u_id: key, u_name: this.allTeacher[key] });
    },
    deleteTeacher(key) {
      for (let i = 0; i < this.form.teacher.length; i++) {
        if (this.form.teacher[i].u_id == key) {
          this.form.teacher.splice(i, 1);
        }
      }
    },
    edit(course) {
      this.getAllTeacher();
      this.currentAction = "edit";
      this.form = JSON.parse(course);
    },
    add() {
      this.getAllTeacher();
      this.form = {
        code: "",
        c_name: "",
        teacher: []
      };
      this.currentAction = "add";
    },
    submit() {
      if(this.form.code==''||this.form.c_name==''){
        alertMessage("课程名或课程代码为空",'error');
        return;
      }
      if (this.currentAction == "add") {
        $http.post("/course", this.form).then(res => {
          this.form.c_id = res.c_id;
          this.form.create_time = res.create_time;
          alertMessage("操作成功",'success');
          this.$emit("closeDialog", JSON.stringify(this.form));
          this.form.teacher = [];
        });
      } else {
        $http.put("/course/" + this.form.c_id, this.form).then(res => {
          alertMessage("操作成功",'success');
          this.$emit("closeDialog", JSON.stringify(this.form));
          this.form.teacher = [];
        });
      }
    },
    getAllTeacher() {
      $http.get("/user/teachers/all").then(res => {
        res.forEach(item => {
          this.$set(this.allTeacher, item.u_id, item.u_name);
        });
      });
    },
    close() {
      this.form.teacher = [];
      this.$emit("closeDialog");
    },
  }
};
</script>
<style scoped>
.dialog {
  width: 100%;
}
.action {
  width: 300px;
  margin: 0 auto;
}
</style>

