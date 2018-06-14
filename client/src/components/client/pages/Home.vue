<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="当前作业">
        <el-badge v-for="(item,index) in work" :key="index" :value="item.count" class="item">
          <router-link :to="`/client/course/${item.c_id}/work/current_work`">
            <el-button size="mini" type="info" plain>{{item.c_name}}</el-button>
          </router-link>
        </el-badge>
        <span v-if="isLoad&&work.length==0">无</span>
      </el-form-item>
      <el-form-item label="当前考试">
        <el-badge v-for="(item,index) in exam" :key="index" :value="item.count">
          <router-link :to="`/client/course/${item.c_id}/exam/current_exam`">
            <el-button size="mini" type="info" plain>{{item.c_name}}</el-button>
          </router-link>
        </el-badge>
        <span v-if="isLoad&&exam.length==0">无</span>
      </el-form-item>
      <el-form-item label="我的徽章">
        <badge style="display:inline-flex" v-for="item in badge" :key="item.b_id" :data="item" type="person"></badge>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Badge from '../common/Badge'
export default {
  name: "ClientHome",
  components:{
    Badge
  },
  data() {
    return {
      work: [],
      exam: [],
      badge:[],
      isLoad: 0,
      u_id: ""
    };
  },
  created() {
    this.u_id = getClientUserInfo().u_id;
    this.getData();
  },
  methods: {
    getData() {
      $httpc.get(`/user/${this.u_id}/test/undo`).then(res => {
        this.work = res.work;
        this.exam = res.exam;
        this.isLoad++;
      });
      $httpc.get(`/user/${this.u_id}/badge`).then(res=>{
        this.badge = res;
        this.isLoad++;
      })
    },
  }
};
</script>

<style scoped>
.item{
  top:3px;
}
.badge{
  width:50px;
  height:50px;
  margin-right:10px;
}
</style>
