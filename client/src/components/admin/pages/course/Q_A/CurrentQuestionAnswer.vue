<template>
  <div>
    <div style="display:flex">
      <message-list :data="dataList" @change="data=>this.currentMessage=data"></message-list>
      <message-detail :data="currentMessage" @closeMessage="currentMessage = null" v-show="currentMessage!=null"></message-detail>
    </div>
  </div>
</template>

<script>
import MessageList from './common/MessageList'
import MessageDetail from './common/MessageDetail'
export default {
  name: "CurrentQuestionAnswer",
  components: {
    MessageList,
    MessageDetail
  },
  data() {
    return {
      dataList: [],
      dataObj: {},
      currentMessage: null,
      c_id: "",
      u_id: "",
      timer: null,
      isGettingData: false
    };
  },
  created() {
    this.c_id = this.$route.params.c_id;
    this.u_id = getUserInfo().u_id;
    this.getData();
    this.timer = setInterval(() => {
      this.getData();
    }, 1000);
  },
  destroyed() {
    if (this.timer != null)
      clearInterval(this.timer);
  },
  methods: {
    getData() {
      if (this.isGettingData)
        return;
      this.isGettingData = true;
      $http.get(`/question_answer?c_id=${this.c_id}&type=all&is_closed=0`).then(res => {
        res.sort((a, b) => b.create_time - a.create_time);
        if (this.currentMessage != null) {
          let index = res.findIndex(item => item.qa_id == this.currentMessage.qa_id);
          if (index == -1)
            this.currentMessage = null;
        }
        this.dataList = res;
        this.isGettingData = false;
      }).catch(err => this.isGettingData = false);
    },
  }
};
</script>

<style>
</style>
