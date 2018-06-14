<template>
  <div class="app" style="padding:10px">
    <question-table ref="table" type="1" v-on:deleteQuestion="deleteQuestion"></question-table>
  </div>
</template>
<script>
import QuestionTable from "./common/QuestionTable";
export default {
  name: "Overview",
  components: {
    QuestionTable
  },
  props: ["type"],
  data() {
    return {
      isDialogShow: false,
      current_ql_id: ""
    };
  },
  methods: {
    deleteQuestion(data) {
      let _this =this;
      let table = this.$refs.table;
      let url = `/course/${
        this.$route.params.c_id
      }/question_library?id=${data.map(item=>{return item.ql_id}).join(',')}`;
      alertConfirm("确认删除该题目(未被使用才可删除)?").then(() => {
        $http.delete(url).then(res => {
          if(res.length ==0){
            alertMessage("删除成功",'success');
          }else{
            let str = '';
            res.forEach(item=>{
              let index = data.findIndex(temp=>temp.ql_id==item);
              if(index>-1)
                str+=data[index].q_simple_description+' ';
            })
            str+='删除失败';
            alertMessage(str,'error');
          }
          data.forEach(item => {
            if(res.findIndex(item1=>item1==item.ql_id)!=-1)
              return;
            let index = table.tableData.indexOf(item);
            table.tableData.splice(index, 1);
          });
        });
      });
    },
    deleteOne(info) {
      let _this = this;
    },
    showQuestion(id) {
      this.current_ql_id = id;
      this.isDialogShow = true;
    }
  }
};
</script>
<style scoped>

</style>

