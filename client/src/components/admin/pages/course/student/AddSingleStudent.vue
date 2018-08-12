<template>
  <div class="app">
    <p>如果该学生不存在，将新增一个用户并加入到该班级，如存在直接将该学生加入班级，学生信息不起作用</p>
    <el-form label-width="40px">
      <el-form-item label="班级">
        <chose-class v-on:update="id=>class_id=id"></chose-class>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="u_name" @keydown.enter.native="submit"></el-input>
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="code" @keydown.enter.native="submit"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="password" @keydown.enter.native="submit"></el-input>
      </el-form-item>
    </el-form>
    <div class="all-item-hcenter">
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </div>
  </div>
</template>
<script>
import ChoseClass from "./ChoseClass";
export default {
  name: "AddSingleStudent",
  components: {
    ChoseClass
  },
  data() {
    return {
      class_id: "",
      u_name: "",
      code: "",
      password:"123456",
    };
  },
  methods: {
    resetData() {
      this.optionValue = [];
      this.class_id = "";
      this.u_name = "";
      this.code = "";
    },
    submit() {
      let _this = this;
      if(this.class_id==''||this.u_name ==''||this.code==''||this.password==''){
        alertMessage("请勿留空",'error');
        return;
      }
      $http.post(`/class/${this.class_id}/add_one_student`, {
          code: this.code,
          u_name: this.u_name,
          password:this.password
        })
        .then(res => {
          alertMessage("加入成功",'success');
          this.code='';
          this.u_name='';
        });
    }
  }
};
</script>
<style scoped>
.app {
  text-align: left;
  width: 500px;
  padding: 10px;
  margin:0 auto;
}
</style>


