<template>
  <div class="admin-main">
    <top class="admin-top"></top>
    <div class="admin-bottom">
      <left class="admin-left"></left>
      <div class="admin-right">
        <div class="admin-content">
          <transition name="el-fade-in-linear" mode="out-in">
            <router-view style="padding:10px;height:calc(100% - 20px)"></router-view>
          </transition>
        </div>
        <div class="admin-bottom2 all-item-vcenter all-item-hcenter">
          <span>版权所有，侵权必究</span>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import top from "@/components/admin/common/Top.vue";
import left from "@/components/admin/common/Left.vue";
export default {
  name: "Admin",
  components: {
    top,
    left
  },
  data(){
    return{
      timer:null
    }
  },
  beforeCreate() {
    window.type = "admin";
  },
  created() {
    document.title = "教学辅助系统后台管理";
    this.checkTime();
    this.timer = setInterval(this.checkTime,60*1000);//每分钟检查一次时间是否和系统时间相同
  },
  destroyed(){
    if(this.timer!=null){
      clearInterval(this.timer);
    }
  },
  methods:{
    checkTime(){
      $http.get(`/public/system_time`).then(res=>{
        if(Math.abs(Date.now()-res)>2*60*1000){
          //如果差距达到两分钟，提示时间有误
          this.$alert("当前本地时间与服务器时间差距超过两分钟，请检查","提示",{
            confirmButtonText:"我知道了"
          })
        }
      })
    }
  }
};
</script>

<style>
.admin-main{
  background: white;
}
.admin-top {
  height: 60px;
}

.admin-bottom {
  height: calc(100vh - 60px);
  width: 100%;
  display: flex;
}
.admin-right {
  height: 100%;
  width: calc(100% - 180px);
}
.admin-content {
  height: calc(100% - 30px);
  overflow-y: auto;
}
.admin-bottom2 {
  position: relative;
  bottom: 0;
  height: 30px;
  background: #adb9c9;
  font-size: 12px;
}
</style>

