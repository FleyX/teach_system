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
      $http.get(`/question_answer?c_id=${this.c_id}&type=all&is_closed=1`).then(res => {
          this.dataList = res;
      });
    },
  }
};
</script>

<style>

</style>
