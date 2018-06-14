<template>
  <div>
    <el-table :data="data" max-height="400">
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column prop="content" label="名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="count" label="总数" sortable width="100px"></el-table-column>
      <el-table-column prop="rightCount" label="正确数" sortable width="100px"></el-table-column>
      <el-table-column prop="rightPercent" label="正确率(%)" width="140px" sortable :formatter="row=>(row.rightPercent*100).toFixed(2)"></el-table-column>
    </el-table>
    </div>
</template>

<script>
export default {
  name: "KnowledgePontPercent",
  props: ["data"]
};
</script>

<style>

</style>
