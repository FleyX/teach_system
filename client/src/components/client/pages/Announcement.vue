<template>
  <div class="app">
    <el-breadcrumb class="breadcrumb">
      <el-breadcrumb-item>课程公告</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <h4 style="text-align:center" v-if="announcementList.length==0">当前无公告</h4>
      <div class="all-item-between" v-for="(item,index) in announcementList" :key="item.a_id">
        <div>
          <span class="num">{{index+1}}.</span>
          <span class="topic pointer" @click="showContent(item.a_id)">{{item.topic}}</span>
        </div>
        <span class="time">{{moment(item.start_time).format("YYYY-MM-DD hh:mm")}}</span>
      </div>
    </div>
    <el-dialog :visible.sync="isDialogShow" title="详情">
      <show-text :data="currentContent"></show-text>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Announcement",
  data() {
    return {
      announcementList: [],
      moment: null,
      isDialogShow: false,
      currentContent: ""
    };
  },
  created() {
    this.getData();
    this.moment = this.$moment;
  },
  watch: {
    "$route.path": function () {
      this.announcementList = [];
      this.getData();
    }
  },
  methods: {
    getData() {
      $httpc
        .get(`/course/${this.$route.params.c_id}/announcement/open`)
        .then(res => {
          this.announcementList = res;
        });
    },
    showContent(a_id) {
      this.currentContent = "";
      $httpc.get(`/announcement/${a_id}/content`).then(res => {
        this.currentContent = res;
      });
      this.isDialogShow = true;
    }
  }
};
</script>

<style scoped>
.content {
  width: 700px;
  margin: 0 auto;
}
.num {
  color: black;
}
.topic {
  font-weight: 600;
}
.time {
  color: grey;
  font-size: 12px;
  display: inline-block;
  margin-left: 30px;
}
</style>
