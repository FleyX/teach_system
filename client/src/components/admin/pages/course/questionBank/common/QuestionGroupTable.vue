<template>
  <div class="app" style="padding:10px">
    <div class="top all-item-between all-item-vcenter">
      <div class="all-item-vcenter">
        <el-select v-model="param.qg_type" placeholder="题组类别" @change="()=>{this.resetParam();this.getQuestionGroup();}" style="width:130px">
          <el-option label="作业题组" value="1"></el-option>
          <el-option label="考试题组" value="2"></el-option>
          <el-option label="不限" value="3"></el-option>
        </el-select>
        <el-input placeholder="请输入内容" v-model="param.searchContent" @keydown.enter.native="doSearch" class="input-with-select">
          <el-select v-model="param.searchColumn" slot="prepend" placeholder="搜索项">
            <!-- <el-option label="编号" value="qg_id"></el-option> -->
            <el-option label="简述" value="qg_name"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
        </el-input>
      </div>
      <div style="width=50%;text-align:right">
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh()"></el-button>
      </div>
    </div>

    <el-table :data="tableData" ref="table" size="middle">
      <!-- <el-table-column type="selection" width="55px"></el-table-column> -->
      <!-- <el-table-column prop="qg_id" label="编号" width="100px"></el-table-column> -->
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column prop="qg_name" :show-overflow-tooltip="true" label="简述"> </el-table-column>
      <el-table-column label="预览" width="150px">
        <template slot-scope="scope">
          <el-button type="text" @click="showQuestionGroup(scope.row.qg_id)">点击预览</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="总分" width="100px"></el-table-column>
      <el-table-column prop="qg_type" label="类别" width="100px" :formatter="getType"></el-table-column>
      <el-table-column prop="difficulty" label="难度" width="50px"></el-table-column>
      <el-table-column label="操作" fixed="right" width="50px">
        <template slot-scope="scope">
          <el-button @click="deleteQuestionGroup(scope.row)" v-if="type==1" type="text" style="color:red;" size="small">删除</el-button>
          <el-button @click="choseQuestionGroup(scope.row)" v-if="type==2" type="text" size="small">选择</el-button>
          <!-- <el-button @click="editUser(scope.row)" type="text" size="small">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="all-item-hcenter">
      <el-pagination layout="prev,pager,next" background :total="size" @current-change="changePage"></el-pagination>
    </div>

    <!-- 预览 -->
    <el-dialog :visible.sync="isDialogShow" title="题组预览">
      <show-question-group :qg_id="current_qg_id"></show-question-group>
    </el-dialog>
  </div>
</template>
<script>
import ShowQuestionGroup from '../../../../common/ShowQuestionGroup'
export default {
  name: "QuestionGroupTable",
  components: {
    ShowQuestionGroup
  },
  props: ["type", "qg_type"], //type:1,总览 2：选择题目组
  data() {
    return {
      param: {
        c_id: "",
        searchContent: "",
        searchColumn: "qg_name",
        start: 0,
        pageSize: 10,
        qg_type: "",
        count: true
      },

      isDialogShow: false,
      current_qg_id: "",
      size: 0,
      tableData: [],
    };
  },
  created() {
    this.param.c_id = this.$route.params.c_id;
    this.param.qg_type = this.qg_type;
    this.getQuestionGroup();
  },
  methods: {
    showQuestionGroup(qg_id) {
      this.current_qg_id=qg_id;
      this.isDialogShow=true;
    },
    getType(row, column) {
      return row.qg_type == 1 ? "作业" : "考试";
    },
    changePage(currentPage) {
      this.param.start = this.param.pageSize * (currentPage - 1);
      console.log(this.param.start);
      this.getQuestionGroup();
    },
    resetParam() {
      this.param.start = 0;
      this.param.count = true;
      this.size = 0;
      this.tableData = [];
    },
    refresh() {
      this.resetParam();
      this.getQuestionGroup();
    },
    doSearch() {
      this.resetParam();
      this.getQuestionGroup();
    },
    getQuestionGroup() {
      let _this = this;
      $http
        .get(
          "/question_group?data=" + Base64.encodeURI(JSON.stringify(this.param))
        )
        .then(res => {
          if (_this.param.count == true) {
            _this.param.count = false;
            _this.size = res.size;
            _this.tableData = res.data;
          } else {
            _this.tableData = res;
          }
        });
    },
    choseQuestionGroup(data) {
      this.$emit("choseQuestionGroup", data);
    },
    deleteQuestionGroup(data) {
      this.$emit("deleteQuestionGroup", data);
    }
  }
};
</script>
<style scoped>
.app {
  text-align: left;
}
td {
  padding: 5px;
}
.el-select {
  width: 100px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>

