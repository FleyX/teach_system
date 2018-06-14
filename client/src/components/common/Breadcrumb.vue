<template>
  <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{path:'/client/course/'+c_id+'/announcement'}">课程首页</el-breadcrumb-item>
    <template v-for="(item,index) in data">
     <el-breadcrumb-item v-if="typeof(item)=='object'" :key="index"  :to="{ path: item[1]}">{{item[0]}}</el-breadcrumb-item>
     <el-breadcrumb-item v-else :key="index">{{item}}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script>
export default {
  name:'Breadcrumb',
  props:['data'],
  data(){
    return{
      c_id:''
    }
  },
  watch:{
    '$route.params.c_id':function(value){
      this.c_id=value;
    }
  },
  created(){
    this.c_id=this.$route.params.c_id;
  }

};
</script>

<style>

</style>
