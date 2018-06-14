<template>
  <div>
    <breadcrumb :data="['课件下载']"></breadcrumb>
    <el-table :data="tableData" :default-sort="{prop:'cw_name'}">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="cw_name" sortable label="文件名"></el-table-column>
      <el-table-column prop="create_time" sortable label="上传时间" :formatter="formatter" width="180px"></el-table-column>
      <el-table-column label="操作" fixed="right" width="70px">
        <template slot-scope="scope">
          <a :href="scope.row.downloadUrl" :download="scope.row.cw_name">
            <el-button type="text" size="small">下载</el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Courseware",
  data() {
    return {
      tableData: []
    };
  },
  created() {
    $httpc.get(`/course/${this.$route.params.c_id}/courseware`).then(res => {
      this.tableData = res;
    });
  },
  methods: {
    formatter(row) {
      return this.$moment
        .unix(row.create_time / 1000)
        .format("YYYY-MM-DD HH:mm");
    },
    download(row) {
      window.open(row.downloadUrl);
    }
  }
};
</script>
