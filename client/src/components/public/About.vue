<template>
  <div class="app">
    <span style="padding-top:30%;display:block">本系统github地址：<a target="_blank" :href="github">{{github}}</a></span><br/>
    <span>由于本人能力和时间的问题，本系统为1.0版本，必然存在许多的bug，欢迎大家进行错误反馈。</span>
  </div>
</template>

<script>
export default {
  name:"about",
  data(){
    return{
      github:'https://github.com/FleyX/teach_system'
    }
  }
}
</script>

<style scoped>
.app{
  width: 100%;
  background:white;
  text-align: center;
}
.center{
  margin:0 auto;
  padding-top:30%;
}
</style>
