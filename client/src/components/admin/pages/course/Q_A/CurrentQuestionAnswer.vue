<template>
  <div>
    <div style="display:flex">
      <message-list :data="dataList" @change="data=>this.currentMessage=data"></message-list>
      <message-detail :data="currentMessage" v-show="currentMessage!=null"></message-detail>
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
        if (this.dataList.length === 0) {
          res.forEach((item, index) => (this.dataObj[item.qa_id] = index));
          this.dataList = res;
        } else {
          res.forEach((item, index) => {
            if (this.dataObj[item.qa_id] == undefined) {
              this.dataObj[item.qa_id] = this.dataList.length;
              this.dataList.push(item);
            } else if (item.is_new_question === 1) {
              console.log('new question');
              this.dataList[this.dataObj[item.qa_id]].is_new_question = 1;
            } else if (item.is_new_reply === 1) {
              console.log('new reply');
              this.dataList[this.dataObj[item.qa_id]].is_new_reply = 1;
            }
          });
        }
        this.isGettingData = false;
      }).catch(err => this.isGettingData = false);
    },
  }
};
</script>

<style>

</style>
