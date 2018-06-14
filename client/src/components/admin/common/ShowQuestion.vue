<template>
  <div class="app">
    <div class="left" v-if="index!=undefined">{{index}}. </div>
    <div class="right">
      <show-text class="content" :data="realContent"></show-text>
      <div class="altertive-answer" v-if="q_type<3">
        <div v-for="(item,index) in altertiveAnswer" :key="index">
          <span>{{String.fromCharCode(65+index)}}.</span>
          <span>{{item}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowQuestion",
  props: ["id", "data", "index"],
  data() {
    return {
      content: "",
      q_type: "",
      altertiveAnswer: []
    };
  },
  computed: {
    realContent() {
      return this.content.replace(
        /\[blank_space\]/g,
        "<span class='blank'></span>"
      );
    }
  },
  watch: {
    id(newValue) {
      this.getQuestion();
    }
  },
  created() {
    if (this.data == undefined) this.getQuestion();
    else {
      this.q_type = this.data.q_type;
      this.altertiveAnswer = JSON.parse(this.data.alternative_answer);
      this.content = this.data.q_description;
    }
  },
  methods: {
    getQuestion() {
      let _this = this;
      this.question = {};
      $http.get(`/question_library/${this.id}/show_question`).then(res => {
        _this.content = res.q_description;
        _this.q_type = res.q_type;
        _this.altertiveAnswer = JSON.parse(res.alternative_answer);
      });
    }
  }
};
</script>

<style scoped>
.app{
  display: flex;
  justify-content: flex-start;
}
.left{
  padding:12px;
  padding-left: 0;
}
.right{
  flex:1;
}
</style>
