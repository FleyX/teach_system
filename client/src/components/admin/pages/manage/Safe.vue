<template>
  <div class="app">
    <div class="change-email" v-if="type=='change_email'">
      <el-form label-width="60px">
        <el-form-item label="密码">
          <el-input type="password" v-model="password"></el-input>
        </el-form-item>
        <el-form-item label="新邮箱">
          <el-input type="email" v-model="newEmail"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="change-password" v-if="type=='change_password'">
      <el-form label-width="100px">
        <el-form-item label="密码">
          <el-input type="password" v-model="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="newPassword"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码">
          <el-input type="password" v-model="repeatNewPassword"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="action all-item-hcenter">
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      type:'',
      password:'',
      newEmail:'',
      newPassword:'',
      repeatNewPassword:''
    }
  },
  watch:{
    '$route.params.type':function(newData,oldData){
      this.password='';
      this.type = newData;
    }
  },
  created(){
    this.type = this.$route.params.type;
  },
  methods:{
    submit(){
      let _this = this;
      if(this.type=="change_email"){
        $http.put('/user/change_email',{
          password:this.password,
          newEmail:this.newEmail
        }).then(res=>{
          _this.success();
        });
      }else if(this.type == "change_password"){
        $http.put('/user/change_password',{
          password:this.password,
          newPassword:this.newPassword,
          repeatNewPassword:this.repeatNewPassword
        }).then(res=>{
          _this.success();
        });
      }
    },
    success(){
      this.$message({
        message:"修改成功",
        type:"success",
        center:true
      });
      this.password='';
      this.newEmail='';
      this.newPassword='';
      this.repeatNewPassword='';
    }
  }
}
</script>
<style scoped>
.change-password{
  position: relative;
  left:-10%;
}
.app{
  width:400px;
  margin:0 auto;
  margin-top:100px;
}
</style>
