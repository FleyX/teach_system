<template>
  <div class="app">
    <editor v-model="info"></editor>
    <div class="all-item-hcenter" style="margin-top:20px;">
      <el-button size="small" type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name:'CourseIntro',
  props:['column'],
  data(){
    return{
      info:'',
      c_id:''
    }
  },
  created(){
    this.c_id = this.$route.params.c_id;
    this.getCourseInfo();
  },
  methods:{
    getCourseInfo(){
      let _this = this;
      $http.get(`/course/base_info?c_id=${this.c_id}&column=${this.column}`).then(res=>{
        _this.info=res;
      })
    },
    submit(){
      let _this = this;
      $http.put(`/course/${this.c_id}/base_info`,{column:this.column,value:this.info}).then(res=>{
        _this.$message({
          message:"修改成功",
          type:"success",
          center:true
        })
      })
    }
  }
}
</script>
<style scoped>
.app{
  max-width: 700px;
  padding-top:20px;
  margin:0 auto;
}
</style>

