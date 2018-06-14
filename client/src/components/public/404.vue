<template>
  <div class="app all-item-vcenter all-item-hcenter">
    <h1>您访问的页面不存在
    <el-button type="text" @click="back">点击返回</el-button>
    </h1>
  </div>
</template>
<script>
export default {
  name:'Error404',
  methods:{
    back(){
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.app{
  height: 100%;
  width:100%;
}
</style>
