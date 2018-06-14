<template>
  <div>
    <breadcrumb :data="['专项练习']"></breadcrumb>
    <div style="margin-bottom:10px">
      待完成练习：
      <span v-if="undoTest!=0">
        <router-link :to="`history/${undoTest.test_id}?action=do`">
          {{undoTest.test_name}}
        </router-link>
        <span class="warning pointer" @click="giveup">放弃</span>
      </span>
      <router-link v-else :to="`overview`">
        无
      </router-link>
    </div>
    <el-table :data="doneTest" :default-sort="{prop:'start_time',order:'descending'}">
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column prop="test_name" label="练习名称"></el-table-column>
      <el-table-column prop="score" label="得分" width="100px" sortable></el-table-column>
      <el-table-column prop="start_time" label="创建时间" sortable width="150px" :formatter="row=>this.$moment(row.start_time).format('YYYY-MM-DD HH:mm:ss')"></el-table-column>
      <el-table-column prop="submit_time" label="完成时间" width="150px" :formatter="row=>this.$moment(row.submit_time).format('YYYY-MM-DD HH:mm:ss')"></el-table-column>
      <el-table-column prop="操作" fixed="right" label="操作" width="70px">
        <template slot-scope="scope">
          <router-link :to="`history/${scope.row.test_id}?action=watch&isSubmit=yes`">查看</router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "knowledgePointHistory",
  data() {
    return {
      u_id: "",
      c_id: "",
      undoTest: 0,
      doneTest: []
    };
  },
  created() {
    this.u_id = getClientUserInfo().u_id;
    this.c_id = this.$route.params.c_id;
    this.getData();
  },
  methods: {
    getData() {
      $httpc
        .get(`/user/${this.u_id}/course/${this.c_id}/knowledge_test`)
        .then(res => {
          let index = res.findIndex(item => item.submit_time == 0);
          if (index != -1) {
            this.undoTest = res[index];
            res.splice(index, 1);
          }
          this.doneTest = res;
        });
    },
    giveup(){
      $httpc.delete(`/user/${this.u_id}/course/${this.c_id}/test/${this.undoTest.test_id}/knowledge`).then(res=>{
        alertMessage("成功放弃",'success');
        this.undoTest=0;
      })
    }
  }
};
</script>

<style>

</style>
