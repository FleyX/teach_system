<template>
  <div>
    <el-table :data="data" max-height="400">
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column prop="q_simple_description" label="题目名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="count" label="总数" width="100px"></el-table-column>
      <el-table-column prop="rightCount" label="正确数" width="100px"></el-table-column>
      <el-table-column prop="rightPercent" label="正确率(%)" width="140px" sortable :formatter="row=>(row.rightPercent*100).toFixed(2)"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name:"QuestionRightPercent",
  props:['data']
}
</script>

<style>

</style>
