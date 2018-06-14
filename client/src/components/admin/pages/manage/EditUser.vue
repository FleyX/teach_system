<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="form.u_name"></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="form.u_type" placeholder="请选择用户类型">
          <el-option label="管理员" value="0"></el-option>
          <el-option label="教师" value="1"></el-option>
          <!-- <el-option label="助教" value="2"></el-option> -->
          <el-option label="学生" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学工号">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" v-show="currentAction=='edit'">
        <el-input v-model="form.email_addr"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" :placeholder="currentAction!='edit'? '默认密码':'不修改请勿填写'"></el-input>
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
  name: "EditUser",
  data() {
    return {
      form: {},
      currentAction: "edit"
    };
  },
  methods: {
    edit(user) {
      this.currentAction = "edit";
      user = JSON.parse(user);
      user.u_type = user.u_type.toString();
      user.password = "";
      user.repeatPassword = "";
      this.form = user;
    },
    add() {
      this.form = {
        u_name: "",
        u_type: "",
        code: "",
        password: "",
      };
      this.currentAction = "add";
    },
    submit() {
      let _this = this;
      if (this.currentAction == "add") {
        $http.post("/user", this.form).then(res => {
          _this.form.u_id = parseInt(res);
          _this.$message({
            message: "操作成功！",
            type: "success"
          });
          _this.$emit("closeDialog", _this.form);
        });
      } else {
        $http.put("/user/change_person_info" , this.form).then(res => {
          _this.$message({
            message: "操作成功！",
            type: "success"
          });
          _this.$emit("closeDialog", _this.form);
        });
      }
    },
    close(){
      this.$emit('closeDialog');
    }
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

