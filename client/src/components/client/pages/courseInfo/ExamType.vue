<template>
  <div>
    <breadcrumb :data="['考试方式']"></breadcrumb>
  <show-text class="show-base-info" :data="data"></show-text>
  </div>
</template>

<script>
export default {
  name:"ExamType",
  data(){
    return{
      data:''
    }
  },
  created(){
    $httpc.get(`/course/base_info?c_id=${this.$route.params.c_id}&column=exam_type`).then(res=>{
      this.data=res;
    })
  }
}
</script>

<style>

</style>
