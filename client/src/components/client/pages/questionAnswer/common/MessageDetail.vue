<template>
  <div class="app">
    <div id="content" class="content">
      <template v-for="(item,index) in MessageData">
        <!-- 对方发出的消息 -->
        <div class="item" v-if="item.u_id!=u_id" :key="index">
          <img :src="otherUserIcon" class="head-img">
          <show-text class="text" :data="item.content"></show-text>
        </div>
        <!-- 我发出的消息 -->
        <div class="right item" v-else :key="index">
          <show-text class="text" :data="item.content"></show-text>
          <img :src="userIcon" class="head-img">
        </div>
      </template>
    </div>
    <div class="bottom" v-if="data!=null&&data.is_closed===0">
      <editor v-model="form.content"></editor>
      <div class="action">
        <el-button size="small" type="warning" @click="close">关闭答疑</el-button>
        <el-button size="small" type="primary" @click="sendData">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageDetail",
  props: ["data"],
  data() {
    return {
      MessageData: [],
      lastUpdateTime: 0,
      timer: null,
      isGettingData: false,
      u_id: '',
      type: '',
      contentDiv: null,
      otherUserIcon: '',
      userIcon: '',
      form: {
        content: ''
      },
    };
  },
  created() {
    this.$watch("data", this.init);
    let data = getClientUserInfo();
    this.u_id = data.u_id;
    this.userIcon = data.icon;
    this.init();
  },
  destroyed() {
    if (this.timer != null)
      clearInterval(this.timer);
  },
  methods: {
    init() {
      if (this.data == null) {
        if (this.timer != null)
          clearInterval(this.timer);
        return;
      }
      if (this.data.start_u_id == this.u_id)
        this.type = 'start';
      else
        this.type = 'reply';
      this.contentDiv = document.getElementById("content");
      this.MessageData = [];
      this.lastUpdateTime = 0;
      this.isGettingData = false;
      this.getData();
      if (this.data.is_closed === 1)
        return;
      //每隔一秒检查是否有新数据
      this.timer = setInterval(() => {
        this.getNewMessage();
      }, 1000);
    },
    getData() {
      this.isGettingData = true;
      $httpc.get(`question_answer/${this.data.qa_id}/detail?time=${this.lastUpdateTime}&type=${this.type}`).then(res => {
        if (res.length > 0) {
          this.MessageData = res;
          this.lastUpdateTime = res[res.length - 1].send_time;
        }
        this.isGettingData = false;
        this.scrollBottom();
      });
      //获取对方头像
      $httpc.get(`user/${this.type == 'start' ? this.data.reply_u_id : this.data.start_u_id}`).then(res => {
        this.otherUserIcon = res.icon;
      })
    },
    scrollBottom() {
      this.$nextTick(() => {
        this.contentDiv.scrollTop = this.contentDiv.scrollHeight;
      })
    },
    getNewMessage() {
      if (this.isGettingData) return;
      this.isGettingData = true;
      let qa_id = this.data.qa_id;
      $httpc.get(`question_answer/${this.data.qa_id}/detail?time=${this.lastUpdateTime}&type=${this.type}`).then(res => {
        if (res.length > 0 && this.data.qa_id == qa_id) {
          for (let i = 0; i < res.length; i++) {
            this.MessageData.push(res[i]);
          }
          this.lastUpdateTime = res[res.length - 1].send_time;
          this.scrollBottom();
        }
        this.isGettingData = false;
      }).catch(err => {
        this.isGettingData = false;
      });
    },
    sendData() {
      $httpc.post(`/question_answer/${this.data.qa_id}/question_answer_detail`, this.form).then(res => {
        this.form.content = '';
      })
    },
    close() {
      alertConfirm("确定关闭本答疑？（关闭后双方无法再次回复）").then(() => {
        $httpc.put(`/question_answer/${this.data.qa_id}/close`, { start_u_id: this.data.start_u_id }).then(res => {
          alertMessage("关闭成功", 'success');
          this.$emit("closeMessage");
          this.data.is_closed = 1;
        })
      })
    }
  }
};
</script>

<style scoped>
.app {
  width: 70%;
  min-width: 500px;
  background: white;
  margin: 20px;
  margin-top: 0;
  padding: 5px;
  padding-top: 5;
  border-radius: 7px;
}
.content {
  height: 500px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.right {
  justify-content: flex-end;
}
.item {
  display: flex;
  margin-bottom: 10px;
  margin-right: 10px;
  margin-left: 10px;
}
.text {
  display: inline-block;
  background: #b5f2ed;
  padding: 3px;
  border-radius: 5px;
}
.action {
  text-align: right;
  padding-top: 3px;
  padding-right: 3px;
}
</style>
