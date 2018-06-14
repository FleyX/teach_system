<template>
<div>
  <breadcrumb :data="['先导课程']"></breadcrumb>
  <show-text class="show-base-info" :data="data"></show-text>
</div>
</template>

<script>
export default {
  name:"FirstCourse",
  data(){
    return{
      data:''
    }
  },
  created(){
    $httpc.get(`/course/base_info?c_id=${this.$route.params.c_id}&column=first_course`).then(res=>{
      this.data=res;
    })
  }
}
</script>

<style>

</style>
