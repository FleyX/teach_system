<template>
  <div>
    <breadcrumb :data="[['专项练习','.'],'完成练习']"></breadcrumb>
    <do-test type='3'></do-test>
  </div>
</template>

<script>
import DoTest from '../../common/DoTest'
export default {
  name:"DoKnowledgeTest",
  components:{
    DoTest
  }
}
</script>

<style>

</style>
