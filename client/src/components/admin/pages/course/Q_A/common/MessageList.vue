<template>
  <div class="app">
    <div v-for="item in data" :key="item.qa_id" class="item all-item-between all-item-vcenter" :class="{'active':current!=null&&(item.qa_id==current.qa_id)}" @click="change(item)">
      <div style="width:170px;overflow:hidden">
        <student-badge v-if="item.type=='start'" :data="{u_id:item.reply_u_id,u_name:item.reply_u_name}"></student-badge>
        <student-badge v-else :data="{u_id:item.start_u_id,u_name:item.start_u_name}"></student-badge>
        topic:{{item.topic}}
      </div>
      <span class="dot" v-if="(item.type=='start'&&item.is_new_reply==1)||(item.type=='reply'&&item.is_new_question==1)"></span>
    </div>
    <div v-if="data.length==0">
      尚无提问
    </div>
  </div>
</template>

<script>
import StudentBadge from './StudentBadge'
export default {
  name: "MessageList",
  props: ['data'],
  data() {
    return {
      current: null,
      u_id: '',
    }
  },
  components: {
    StudentBadge
  },
  created() {
    this.u_id = getUserInfo().u_id;
    this.$watch('data', this.init);
    this.init();
  },
  methods: {
    init() {
      this.data.forEach(item => {
        if (item != this.current) {
          //我是提问者则判断是否有新的回答，反之相反
          if (item.start_u_id == this.u_id) {
            this.$set(item, 'type', 'start');
          } else {
            this.$set(item, 'type', 'reply');
          }
        }
      })
    },
    change(item) {
      if (this.current !== item) {
        this.$emit("change", item);
        this.current = item;
        item.hasNew = 0;
        if (item.type == 'start')
          item.is_new_reply = 0;
        else
          item.is_new_question = 0;
      }
    }
  }
}
</script>

<style scoped>
.app {
  width: 200px;
}
.item {
  border-bottom: 1px solid black;
  margin-bottom: 5px;
  cursor: pointer;
}
.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
  background: red;
}
.active {
  background: #d0d0d0;
}
</style>
