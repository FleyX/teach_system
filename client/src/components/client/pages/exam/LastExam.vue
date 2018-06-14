<template>
  <div>
      <breadcrumb :data="['历史考试']"></breadcrumb>
    <div>
      <el-table :data="workList" width="100%" :default-sort="{prop:'end_time',order:'descending'}">
        <el-table-column type="index" width="50px"></el-table-column>
        <el-table-column prop="test_name" sortable label="考试名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="demand" label="要求" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.submit_time ==0" type="danger">未提交</el-tag>
            <el-tag v-else type="success">已提交</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="成绩" prop="score" sortable width="80px" :formatter="getScore"></el-table-column>
        <el-table-column  label="开始时间" prop="start_time" sortable width="150px" :formatter="getStartTime"></el-table-column>
        <el-table-column  label="结束时间" prop="end_time" sortable width="150px" :formatter="getEndTime"></el-table-column>
        <el-table-column label="操作" fixed="right" width="70px">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="workDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "LastWork",
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
      .get(`/user/${u_id}/course/${c_id}/test?type=2&isCurrent=false`)
      .then(res => {
        this.workList = res;
      });
  },
  methods:{
    getStartTime(row){
      return this.$moment(row.start_time).format('YYYY-MM-DD HH:mm')
    },
    getEndTime(row){
      return this.$moment(row.end_time).format('YYYY-MM-DD HH:mm')
    },
    getScore(row){
      return row.score==null? '无':row.score;
    },
    workDetail(row){
      this.$router.push(`last_exam/${row.test_id}?action=watch&isSubmit=${row.submit_time==0?'no':'yes'}`);
    }
  }
};
</script>

<style>

</style>
