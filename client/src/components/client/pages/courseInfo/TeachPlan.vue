<template>
  <div>
    <breadcrumb :data="['教学计划']"></breadcrumb>
  <show-text class="show-base-info" :data="data"></show-text>
  </div>
</template>

<script>
export default {
  name:"TeachPlan",
  data(){
    return{
      data:''
    }
  },
  created(){
    $httpc.get(`/course/base_info?c_id=${this.$route.params.c_id}&column=teach_plan`).then(res=>{
      this.data=res;
    })
  }
}
</script>

<style>

</style>
