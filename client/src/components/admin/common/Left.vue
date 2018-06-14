<template>
  <div class="app">
    <el-menu id="left-ul" :default-active="activeIndex" class="el-menu-vertical-demo" background-color="#393d49" text-color="white" active-text-color="green" @select="handleClick">
      <template v-for="item in menuData">
        <el-submenu v-if="item.hasOwnProperty('data')" :index="item.index" :key="item.index">
          <template slot="title">
            <span>{{item.name}}</span>
          </template>
          <template v-for="item1 in item.data">
            <el-submenu v-if="item1.hasOwnProperty('data')" :index="item1.index" :key="item1.index">
              <template slot="title">
                <span>{{item1.name}}</span>
              </template>
              <el-menu-item v-for="item2 in item1.data" :index="item2.index" :key="item2.index">
                <span slot="title">
                  {{item2.name}}
                </span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="item1.index" :key="item1.index">
              <span slot="title">
                {{item1.name}}
              </span>
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item v-else :index="item.index" :key="item.index">
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>
import config from "./config";
export default {
  name: "left",
  data() {
    return {
      activeIndex: "0",
      menuData: [],
      order: ""
    };
  },
  created() {
    let _this = this;
    bus.$on("leftOrder", data => {
      _this.activeIndex = data.defaultIndex;
      _this.order = data.order;
      _this.menuData = config[data.order];
    });
  },
  methods: {
    handleClick(index) {
      if (this.order == "person_space" || this.order == "manage") {
        this.$router.push(`/admin/${index}`);
      }else if(this.order == 'manage'){
        this.$router.push(`/admin/${index}`);
      }else
      this.$router.push(`/admin/course/${this.$route.params.c_id}/${index}`);
    }
  }
};
</script>
<style scoped>
.app {
  width: 180px;
  overflow-x: hidden;
  text-align: left;
}
#left-ul {
  background: #393d49;
  border-right: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100%;
  width: calc(100% + 18px);
}
</style>


