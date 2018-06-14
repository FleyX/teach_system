<template>
  <div class="app">
    <el-form label-width="72px" @submit.native.prevent>
      <el-form-item :label="currentAction=='grade'? '选择年级':'输入班级'">
        <el-date-picker v-if="currentAction=='grade'" v-model="year" align="left" type="year" placeholder="选择年级">
        </el-date-picker>
        <el-input v-else v-model="name" @keydown.enter.native="add"></el-input>
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
  name: "AddNode",
  props: ["currentAction","id"],
  data() {
    return {
      year:'',
      name:''
    };
  },
  methods:{
    close(){
      this.inputData='';
      this.$emit('closeDialog');
    },
    add(){
      let _this = this;
      if(this.currentAction=='grade'){
        $http.post('/grade',{c_id:this.id,content:new Date(this.year).getFullYear()+"级"}).then(res=>{
          this.success({id:res,label:new Date(this.year).getFullYear()+"级",level:2});
        })
      }else{
        $http.post('/class',{g_id:this.id,content:this.name}).then(res=>{
          this.success({id:res,label:this.name,level:3});
        })
      }
    },
    success(res){
      this.$message({message:"操作成功",type:"success",center:true});
      this.$emit('closeDialog',res);
    }
  }
};
</script>
<style scoped>
.app {
  max-width: 350px;
  margin: 0 auto;
  display: block;
}
</style>

