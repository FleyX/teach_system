<template>
  <el-collapse accordion>
    <el-collapse-item v-for="(item,index) in question" :key="index" :name="index" :title="item.name+'共：'+item.data.length">
      <div v-for="(item2,index2) in item.data" :key="item2.ql_id">
        <show-question :data="item2" :index="index2+1"></show-question>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import ShowQuestion from "./ShowQuestion";
export default {
  name: "ShowQuestionGroup",
  props: ["qg_id"],
  components: {
    ShowQuestion
  },
  data() {
    return {
      question: [
        { name: "单选题", data: [] },
        { name: "多选题", data: [] },
        { name: "填空题", data: [] },
        { name: "编程题", data: [] }
      ]
    };
  },
  created(){
    this.$watch('qg_id',this.getData);
    this.getData();
  },
  methods: {
    getData() {
      this.question.forEach(item=>item.data=[]);
      $http.get(`/question_group/${this.qg_id}/all_question`).then(res => {
        this.question[0].data = res.single;
        this.question[1].data = res.mult;
        this.question[2].data = res.gap;
        this.question[3].data = res.program;
      });
    }
  }
};
</script>

<style>

</style>
