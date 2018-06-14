<template>
  <div class="app" style="padding:10px">
    <div class="top all-item-between all-item-vcenter">
      <div style="width=50%">
        <el-input placeholder="请输入内容" v-model="param.searchContent" @keydown.enter.native="doSearch" class="input-with-select">
          <el-select v-model="param.searchColumn" slot="prepend" placeholder="选择搜索项">
            <!-- <el-option label="题号" value="ql_id"></el-option> -->
            <el-option label="题目简述" value="q_simple_description"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
        </el-input>
      </div>
      <div style="width=50%;text-align:right">
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh()"></el-button>
        <el-button type="primary" size="mini" v-if="type==2" @click="()=>{this.$emit('mult',this.multipleSelection)}">加入选中</el-button>
        <el-button type="danger" size="mini" v-if="type==1" @click="()=>this.$emit('deleteQuestion',this.multipleSelection)">批量删除</el-button>
      </div>
    </div>

    <el-table :data="tableData" ref="table" size="middle" @filter-change="filterChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px"></el-table-column>
      <el-table-column type="index" style="width:50px"></el-table-column>
      <!-- <el-table-column prop="ql_id" label="题号" width="100px"></el-table-column> -->
      <el-table-column prop="q_simple_description" :show-overflow-tooltip="true" label="题目简述"> </el-table-column>
      <el-table-column label="题目内容" width="200px">
        <template slot-scope="scope">
          <el-button type="text" @click="showQuestion(scope.row.ql_id)">查看题目</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="q_range" label="难度" width="100px"></el-table-column>
      <el-table-column column-key="q_type" prop="q_type" width="150px" label="题型" :filtered-value="param.q_type" :filters="questionTypes" filter-placement="bottom-start" :formatter="getQuestionType"></el-table-column>
      <el-table-column column-key="is_exam" prop="is_exam" width="150px" label="题目类别" :filtered-value="is_examFilter" :filters="[{text:'考试用',value:1},{text:'作业用',value:0}]" filter-placement="bottom-start" :formatter="getIsExam"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100px" v-if="type==1">
        <template slot-scope="scope">
          <el-button @click="deleteQuestion([scope.row])" type="text" style="color:red;" size="small">删除</el-button>
          <!-- <el-button @click="editUser(scope.row)" type="text" size="small">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="all-item-hcenter">
      <el-pagination layout="prev,pager,next" background :total="size" @current-change="changePage"></el-pagination>
    </div>
    <el-dialog min-width="400px" :visible.sync="isDialogShow" title="预览">
      <show-question :id="current_ql_id"></show-question>
    </el-dialog>
  </div>
</template>
<script>
import ShowQuestion from "../../../../common/ShowQuestion";
export default {
  name: "QuestionTable",
  components: {
    ShowQuestion
  },
  props: ["type"], //type:1,总览 2：选择题目加入
  data() {
    return {
      param: {
        c_id: "",
        searchContent: "",
        searchColumn: "q_simple_description",
        start: 0,
        pageSize: 10,
        q_type: [],
        count: true,
        is_exam: 2
      },
      isDialogShow: false,
      current_ql_id: "",
      is_examFilter: [],
      questionTypes: [
        {
          text: "单选题",
          value: 1
        },
        {
          text: "多选题",
          value: 2
        },
        {
          text: "填空题",
          value: 3
        },
        {
          text: "编程题",
          value: 4
        }
      ],
      size: 0,
      tableData: [],
      multipleSelection: []
    };
  },
  created() {
    this.param.c_id = this.$route.params.c_id;
    this.getQuestions();
  },
  methods: {
    deleteQuestion(data) {
      this.$emit("deleteQuestion", data);
    },
    showQuestion(ql_id) {
      this.current_ql_id = ql_id;
      this.isDialogShow = true;
    },
    getQuestionType(row, column) {
      switch (row.q_type) {
        case 1:
          return "单选题";
        case 2:
          return "多选题";
        case 3:
          return "填空题";
        case 4:
          return "编程题";
      }
    },
    getIsExam(row, column) {
      if (row.is_exam) return "考试用";
      else return "作业用";
    },
    changePage(currentPage) {
      this.param.start = this.param.pageSize * (currentPage - 1);
      this.getQuestions();
    },
    resetParam() {
      this.param.start = 0;
      this.param.count = true;
      this.size = 0;
      this.tableData = [];
      this.multipleSelection = [];
    },
    refresh() {
      this.resetParam();
      this.getQuestions();
    },
    doSearch() {
      this.resetParam();
      this.getQuestions();
    },
    getQuestions() {
      let _this = this;
      $http
        .get(
          "/question_library?data=" +
            Base64.encodeURI(JSON.stringify(this.param))
        )
        .then(res => {
          if (_this.param.count == true) {
            _this.param.count = false;
            _this.size = res.size;
            _this.param.start += res.data.length;
            _this.tableData = res.data;
          } else {
            _this.tableData = res;
            _this.param.start += res.length;
          }
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    filterChange(data) {
      if (data.q_type !== undefined) {
        this.resetParam();
        this.param.q_type = data.q_type;
        this.getQuestions();
      } else if (data.is_exam !== undefined) {
        this.resetParam();
        if (data.is_exam.length == 2 || data.is_exam.length == 0)
          this.param.is_exam = 2;
        else if (data.is_exam.length == 1) this.param.is_exam = data.is_exam[0];
        this.getQuestions();
      }
    },
    resetMultipleSelection() {
      this.$refs.table.clearSelection();
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
  width: 120px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>

