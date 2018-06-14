<template>
<div>
<breadcrumb :data="['参考书推荐']"></breadcrumb>
  <show-text class="show-base-info" :data="data"></show-text>
</div>
</template>

<script>
export default {
  name:"ReferenceBook",
  data(){
    return{
      data:''
    }
  },
  created(){
    $httpc.get(`/course/base_info?c_id=${this.$route.params.c_id}&column=reference_book`).then(res=>{
      this.data=res;
    })
  }
}
</script>

<style>

</style>
