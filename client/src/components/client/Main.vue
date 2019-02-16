<template>
  <div class="client-app">
    <top class="client-top"></top>
    <div class="client-content">
      <transition name="el-fade-in" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <div class="client-bottom all-item-hcenter all-item-vcenter">
      <router-link to="/about"><span style="font-size:.7em">关于</span></router-link>
    </div>
  </div>
</template>
<script>
import Top from "./common/Top";
export default {
  name: "Client",
  components: {
    Top
  },
  data(){
    return{
      timer:null
    }
  },
  beforeCreate() {
    window.type = "client";
  },
  created() {
    document.title = "教学辅助系统";
    this.checkTime();
    this.timer = setInterval(this.checkTime, 60 * 1000);//每分钟检查一次系统时间
  },
  destroyed(){
    if(this.timer!=null)
      clearInterval(this.timer);
  },
  methods: {
    checkTime() {
      $httpc.get(`/public/system_time`).then(res => {
        if (Math.abs(Date.now() - res) > 2 * 60 * 1000) {
          //如果差距达到两分钟，提示时间有误
          this.$alert("当前本地时间与服务器时间差距超过两分钟，请检查", "提示", {
            confirmButtonText: "我知道了"
          })
        }
      })
    }
  }
};
</script>

<style>
.client-app {
  overflow: auto;
  background: white;
}
.client-top {
  position: fixed;
  z-index: 1000;
  width: 100%;
  box-shadow: 1px 1px 1px #c6c0c0;
}
.client-content {
  width: 80%;
  min-width: 600px;
  min-height: calc(100% - 151px);
  margin: 0 auto;
  background: #ededed;
  padding: 20px;
  margin-top: 60px;
}
.client-bottom {
  height: 50px;
  background: #f2efe6;
}
</style>

