<template>
  <div class="all-item-vcenter">
    <el-popover placement="top" trigger="hover" width="200">
      <span>已获得徽章总数:{{badgeList.length}}</span>
      <div class="show-badge">
        <badge v-for="item in badgeList" style="margin-right:5px;margin-bottom:5px" :key="item.b_id" :data="item"></badge>
      </div>
      <div slot="reference" class="all-item-vcenter">
        <span>{{data.u_name}}</span>
        <img class="small-badge" v-for="item in showBadge" :key="item.b_id" :src="item.b_img">
      </div>
    </el-popover>
  </div>
</template>

<script>
import Badge from './Badge'
export default {
  name: "StudentBadge",
  props: ["data"],
  components:{
    Badge
  },
  data() {
    return {
      badgeList: []
    };
  },
  computed:{
    showBadge(){
      return this.badgeList.slice(0,3);
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      $httpc.get(`/user/${this.data.u_id}/badge`).then(res => {
        this.badgeList = res;
      });
    }
  }
};
</script>

<style scoped>
.show-badge{
  display: flex;
  flex-wrap: wrap;
}
</style>
