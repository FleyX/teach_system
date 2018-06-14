<template>
  <div>
    <breadcrumb :data="[[action=='watch'?'历史考试':'当前考试','.'],'考试详情']"></breadcrumb>
    <do-test ref="doTest" type="2"></do-test>
  </div>

</template>

<script>
import DoTest from "../../common/DoTest";
export default {
  name: "WorkDetail",
  components: {
    DoTest
  },
  data() {
    return {
      action: ""
    };
  },
  created() {
    this.action = this.$route.query.action;
  }
};
</script>

