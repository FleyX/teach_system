<template>
  <div>
    <breadcrumb :data="['实力排行']"></breadcrumb>
    <div style="padding-bottom:10px">我的排名：{{myRank}}</div>
    <el-table :data="dataList" width="100%">
      <el-table-column type="index" ></el-table-column>
      <el-table-column prop="u_name" label="姓名">
        <template slot-scope="scope">
          <student-badge :data="scope.row"></student-badge>
        </template>
      </el-table-column>
      <el-table-column  label="班级" :formatter="row=>row.grade_name+'-'+row.class_name"></el-table-column>
      <el-table-column prop="evaluate" label="水平值" fixed="right" width="150px" ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import StudentBadge from '../../common/StudentBadge'
export default {
  name:"EvaluateList",
  components:{
    StudentBadge
  },
  data(){
    return{
      c_id:'',
      u_id:'',
      dataList:[],
      evaluate:-1
    }
  },
  computed:{
    myRank(){
      let index = this.dataList.findIndex(item=>item.u_id==this.u_id);
      if(index==-1)
        return '未上榜';
      else
        return index+1;
    }
  },
  mounted(){
    this.c_id=this.$route.params.c_id;
    this.u_id=getClientUserInfo().u_id;
    this.getList();
    this.getEvaluate();
  },
  methods:{
    getList(){
      $httpc.get(`/course/${this.c_id}/top30?type=evaluate`).then(res=>{
        this.dataList=res;
      })
    },
    getEvaluate(){
      $httpc.get(`/user/${this.u_id}/course/${this.c_id}/rank?type=evaluate`).then(res=>{
        this.evaluate=res;
      })
    }
  }
}
</script>

<style>

</style>
