<template>
  <div>
    <breadcrumb :data="['历史答疑']"></breadcrumb>
    <div class="all-item-between">
      <message-list :data="dataList" @change="data=>this.currentMessage=data"></message-list>
      <message-detail :data="currentMessage" v-show="currentMessage!=null"></message-detail>
    </div>
  </div>
</template>

<script>
import MessageList from './common/MessageList'
import MessageDetail from './common/MessageDetail'
export default {
  name: "QuestionAnswerHistory",
  components: {
    MessageList,
    MessageDetail
  },
  data() {
    return {
      dataList: [],
      currentMessage: null,
      c_id: "",
      u_id: ""
    };
  },
  created() {
    this.c_id = this.$route.params.c_id;
    this.u_id = getUserInfo().u_id;
    this.getData();
  },
  methods: {
    getData() {
      $httpc.get(`/question_answer?c_id=${this.c_id}&type=all&is_closed=1`).then(res => {
        res.sort((a,b)=>b.create_time-a.create_time);
        this.dataList = res;
      });
    },
  }
};
</script>

<style>
</style>
