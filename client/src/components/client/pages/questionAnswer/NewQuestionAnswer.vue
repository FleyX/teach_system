<template>
  <div>
    <breadcrumb :data="['新的答疑']"></breadcrumb>
    <el-tabs type="border-card" @tab-click="reset">
      <el-tab-pane label="向老师提问">
        <div class="content">
          <el-button :type="form.id==item.u_id?'warning':''" round v-for="item in teachers" :key="item.u_id" @click="form.id=item.u_id">{{item.u_name}}</el-button>
          <div class="center" style="width:500px;text-align:center" v-show="form.id!=''">
            <el-input type="text" v-model="form.topic" placeholder="请输入主题"></el-input>
            <el-button type="primary" style="margin-top:20px;" size="small" @click="submit">提交</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="向同学提问">
        <div class="all-item-around" style="min-height:300px;margin-bottom:20px">
          <el-tree :data="tree" highlight-current accordion @node-click="nodeClick" style="width:300px;"></el-tree>
          <div style="width:500px">
            <el-table ref="table" :data="studnet" highlight-current-row max-height="500px" @current-change="studentChange" v-show="class_id!=''">
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="u_name" label="姓名" sortable>
                <template slot-scope="scope">
                  <student-badge :data="scope.row"></student-badge>
                </template>
              </el-table-column>
              <el-table-column prop="evaluate" label="水平值" sortable></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="center" style="width:500px;text-align:center" v-show="form.id!=''">
          <el-input type="text" v-model="form.topic" placeholder="请输入主题"></el-input>
          <el-button type="primary" style="margin-top:20px;" size="small" @click="submit">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import StudentBadge from '../../common/StudentBadge'
export default {
  name: "NewQuestionAnswer",
  components: {
    StudentBadge
  },
  data() {
    return {
      form: {
        id: "",
        topic: "",
        c_id: "",
      },
      class_id: '',
      teachers: [],
      tree: [],
      studnet: []
    };
  },
  created() {
    this.form.c_id = this.$route.params.c_id;
    this.getTeacher();
    this.getTree();
  },
  methods: {
    reset(){
      this.form.id='';
      this.$refs.table.store.states.currentRow=null;
    },
    getTeacher() {
      $httpc.get(`/course/${this.form.c_id}/teacher`).then(res => {
        this.teachers = res;
      })
    },
    getTree() {
      $httpc.get(`/course/tree?c_id=${this.form.c_id}`).then(res => {
        this.tree = res.children;
      })
    },
    getClass() {
      $httpc.get(`/class/${this.class_id}/user`).then(res => {
        this.studnet = res;
      })
    },
    nodeClick(data) {
      if (data.level == 3) {
        this.class_id = data.id;
        this.getClass();
      } else {
        this.class_id = '';
      }
    },
    studentChange(row) {
      if (row != null)
        this.form.id = row.u_id;
      else
        this.form.id = '';
    },
    submit() {
      if(this.form.id==''){
        alertMessage("请选择对象",'warning');
        return;
      }
      if(this.form.topic==''){
        alertMessage("请输入主题",'warning');
        return;
      }
      $httpc.post(`/question_answer`, this.form).then(res => {
        alertMessage("操作成功",'success');
        this.$router.push('./current');
      });
    }
  }
};
</script>

<style>

</style>
