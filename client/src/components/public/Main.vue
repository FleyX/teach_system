<template>
  <div class="app">
    <div class="stars"></div>
    <div class="stars1"></div>
    <div class="stars2"></div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "publicMain",
  beforeCreate() {
    window.type = "public";
  }
};
</script>
<style>
html {
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;
}
@keyframes animStar {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-2000px);
  }
}
</style>
