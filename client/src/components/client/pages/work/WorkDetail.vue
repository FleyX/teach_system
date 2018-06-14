<template>
  <div>
    <breadcrumb :data="[[action=='watch'?'历史作业':'当前作业','.'],'作业详情']"></breadcrumb>
    <do-test type='1' ref='doTest'></do-test>
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
  },
};
</script>
<style scoped>
h3 {
  margin: 0;
  background: #ffe4c4;
}
</style>

