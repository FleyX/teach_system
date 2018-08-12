<template>
  <div id="app">
    <router-view style="height:100%"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  beforeCreate(){
    //检测浏览器兼容性
  }
}
</script>

<style>
html,body,#app{
  margin:0;
  padding:0;
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
}
</style>
