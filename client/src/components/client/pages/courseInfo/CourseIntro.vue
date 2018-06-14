<template>
<div>
<breadcrumb :data="['课程简介']"></breadcrumb>
  <show-text class="show-base-info" :data="data"></show-text>
</div>
</template>

<script>
export default {
  name:"CourseIntro",
  data(){
    return{
      data:''
    }
  },
  created(){
    $httpc.get(`/course/base_info?c_id=${this.$route.params.c_id}&column=c_intro`).then(res=>{
      this.data=res;
    })
  }
}
</script>

<style>

</style>
