<template>
  <div class="app">
    <el-form label-width="72px">
      <el-form-item label="姓名">
        <el-input v-model="formData.u_name" @keydown.enter.native="add"></el-input>
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="formData.code" @keydown.enter.native="add"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formData.email_addr" @keydown.enter.native="add"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password" placeholder="不修改请勿输入" @keydown.enter.native="add"></el-input>
      </el-form-item>
    </el-form>
    <div class="all-item-hcenter">
      <el-button size="small" type="warning" @click="close">取消</el-button>
      <el-button size="small" type="primary" @click="add">提交</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "EditStudent",
  data() {
    return {
      formData:{}
    };
  },
  methods:{
    close(){
      this.$emit('closeDialog');
    },
    init(data){
      let temp = {};
      Object.assign(temp,data);
      this.formData=temp;
      this.formData.password='';
    },
    add(){
      let _this = this;
      $http.put(`/user/${this.formData.u_id}/change_student_info`,this.formData).then(res=>{
        _this.$message({message:"操作成功",type:"success",center:true});
        _this.$emit('closeDialog',this.formData);
      })
    },
    success(res){

    }
  }
};
</script>
<style scoped>
.app {
  max-width: 350px;
  margin: 0 auto;
}
</style>

