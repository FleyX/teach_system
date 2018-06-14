<template>
  <div class="app">
    <el-form label-width="70px" >
      <el-form-item label="公告主题">
        <el-input v-model="title"></el-input>
      </el-form-item>
      <el-form-item label="公告内容">
        <editor v-model="content" ref="editor"></editor>
      </el-form-item>
      <el-form-item v-show="!isManualClose" label="起止时间">
        <el-date-picker v-model="time" type="datetimerange"  range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="手动关闭">
        <el-switch v-model="isManualClose" active-color="#13ce66"></el-switch>
      </el-form-item>
    </el-form>
    <div class="all-item-hcenter">
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "AddAnnouncement",
  data() {
    return {
      title: '',
      time:'',
      isManualClose:false,
      content:''
    };
  },
  methods: {
    submit(){
      let  form = {};
      form.c_id=this.$route.params.c_id;
      form.topic=this.title;
      form.content = this.content;
      if(this.isManualClose){
        form.start_time='';
        form.end_time='';
      }else{
        form.start_time=new Date(this.time[0]).getTime();
        form.end_time=new Date(this.time[1]).getTime();
      }
      let _this = this;
      $http.post('/announcement',form).then(res=>{
        _this.$message({message:"发布成功",type:"success",center:true});
        _this.$router.replace(`/admin/course/${_this.$route.params.c_id}/announcement`);
      })
    },
  }
};
</script>
<style scoped>
.app {
  padding: 10px;
  max-width: 800px;
  margin:0 auto;
}
</style>


