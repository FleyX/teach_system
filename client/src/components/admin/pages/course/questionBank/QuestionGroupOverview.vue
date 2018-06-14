<template>
<question-group-table type="1" v-on:deleteQuestionGroup="deleteOne" ref="table"></question-group-table>
</template>

<script>
import QuestionGroupTable from './common/QuestionGroupTable'
export default {
  components:{
    QuestionGroupTable
  },
  name:"QuestionGroupOverview",
  methods:{
    deleteOne(data){
      let _this = this;
      alertConfirm("确认删除该题组吗？").then(()=>{
        $http.delete(`/course/${_this.$route.params.c_id}/question_group/${data.qg_id}`).then(res=>{
          alertMessage("删除成功","success");
          let index = _this.$refs.table.tableData.indexOf(data);
          _this.$refs.table.tableData.splice(index,1);
        })
      })
    }
  }
}
</script>

<style>

</style>
