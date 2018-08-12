<template>
  <div class="main">
    <h3>
    <router-link to="/client" :replace="false">客户端</router-link>
    </h3>
    <h3>
    <router-link to="/admin" :replace="false">管理端</router-link>
    </h3>
  </div>
</template>

<script>
export default {
  name: "IndexPage"
};
</script>

<style scoped>
.main {
  width: 100%;
  height: 100;
  background: white;
  text-align: center;
  padding-top: 20%;
}
</style>
