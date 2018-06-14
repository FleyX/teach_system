<template>
  <div>
    <el-popover placement="top" trigger="hover">
      <div v-if="type=='person'">
        <div>当前：
          <h5>{{data.b_name}}</h5>
        </div>
        <div style="margin-bottom:10px">获取条件：{{data.get_condition}}</div>
        <div v-if="data.next_level==null">下一阶段：无</div>
        <div v-else>下一阶段：<h5>{{nextData.next.b_name}}</h5></div>
        <div>获取条件：{{nextData.next.get_condition}}</div>
        <div>当前：{{nextData.current}}</div>
      </div>
      <div v-else>
        获取条件：{{data.get_condition}}
      </div>
      <div class="item" slot="reference">
        <img class="badge" :src="data.b_img">
        <span>{{data.b_name}}</span>
      </div>
    </el-popover>
  </div>
</template>

<script>
/**
 * 第一类徽章（总课程数）展示数据
 */
export default {
  name: "Badge",
  props: ["data", "type"],
  data() {
    return {
      u_id: getClientUserInfo().u_id,
      nextData: {},
      isLoading: true
    };
  },
  created() {
    if (this.data.next_level != null && this.type == "person") this.getData();
  },
  methods: {
    getData() {
      $httpc
        .get(
          `/user/${this.u_id}/badge/${this.data.next_level}?type=${
            this.data.b_type
          }`
        )
        .then(res => {
          this.nextData = res;
        });
    }
  }
};
</script>

<style scoped>
h5 {
  display: inline-block;
  margin: 0;
  margin-bottom: 5px;
  text-align: center;
}
.item {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 20px;
  padding-right: 10px;
}
.item > span {
  font-size: 0.9em;
}
</style>
