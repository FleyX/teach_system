<template>
  <div>
    <breadcrumb :data="['当前考试']"></breadcrumb>
    <div>
      <el-table :data="workList" width="100%" :default-sort="{prop:'end_time',order:'descending'}">
        <el-table-column type="index" width="50px"></el-table-column>
        <el-table-column prop="test_name" sortable label="考试名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="demand" label="要求" show-overflow-tooltip></el-table-column>
        <el-table-column label="开始时间" prop="start_time" sortable width="150px" :formatter="getStartTime"></el-table-column>
        <el-table-column label="结束时间" prop="end_time" sortable width="150px" :formatter="getEndTime"></el-table-column>
        <el-table-column label="操作" fixed="right" width="70px">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="workDetail(scope.row)">开始</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "CurrentWork",
  data() {
    return {
      workList: [],
      moment: ""
    };
  },
  created() {
    this.moment = this.$moment;
    let u_id = getClientUserInfo().u_id;
    let c_id = this.$route.params.c_id;
    $httpc
      .get(`/user/${u_id}/course/${c_id}/test?type=2&isCurrent=true`)
      .then(res => {
        this.workList = res;
      });
  },
  methods: {
    getStartTime(row) {
      return this.$moment(row.start_time).format("YYYY-MM-DD HH:mm");
    },
    getEndTime(row) {
      return this.$moment(row.end_time).format("YYYY-MM-DD HH:mm");
    },
    workDetail(row){
      if(row.start_time>Date.now()){
        alertMessage("考试还未开始,请等待",'warning');
        return;
      }
      this.$router.push(`current_exam/${row.test_id}?action=do&startTime=${row.start_time}&endTime=${row.end_time}`);
    }
  }
};
</script>

<style>

</style>
