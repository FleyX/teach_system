<template>
  <div class="app">
    <el-form label-width="100px" @submit.native.prevent label-position="right">
      <el-form-item label="题目描述">
        <el-input v-model="form.q_simple_description"></el-input>
      </el-form-item>
      <el-form-item label="题目内容">
        <editor ref="editor" v-model="form.q_description"></editor>
      </el-form-item>
      <el-form-item label="考试专用 ">
        <el-switch v-model="form.is_exam" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="难易度" class="all-item-vcenter">
        <el-rate class="el-rate" v-model="form.q_range"></el-rate>
      </el-form-item>
      <el-form-item label="知识点">
        <el-tag v-for="(item,index) in form.tags" closable :key="index" @close="form.tags.splice(index,1)">
          {{item.content}}
        </el-tag>
        <chose-point v-if="isAddTagInput" v-on:close="isAddTagInput=false" v-on:update="addTag"></chose-point>
        <el-button v-else size="small" @click="isAddTagInput=true">+new tag</el-button>
      </el-form-item>
      <el-form-item label="备选项">
        <div v-for="(item,index) in temp_answer" :key="index">
          <span>{{String.fromCharCode(65+index)}}.</span>
          <span>{{item.content}}</span>
          <i class="el-icon-circle-check-outline" v-if="item.isRight"></i>
          <i class="el-icon-circle-close-outline" v-else></i>
          <el-button type="text" size="mini" @click="temp_answer.splice(index,1)">删除</el-button>
        </div>
        <!-- 插入备选项 -->
        <el-form v-if="isAddingAnswer" :inline="true" class="demo-form-inline">
          <el-form-item label="内容">
            <el-input v-model="answerForm.content"></el-input>
          </el-form-item>
          <el-form-item label="正确答案">
            <el-switch v-model="answerForm.isRight" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-button type="primary" size="small" @click="addOneAnswer">确认</el-button>
          <el-button type="warning" size="small" @click="isAddingAnswer=false">取消</el-button>
        </el-form>
        <el-button v-else type="text" @click="isAddingAnswer=true">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="all-item-hcenter">
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import ChosePoint from "./common/ChosePoint";
export default {
  name: "AddChoiceQuestion",
  components: {
    ChosePoint
  },
  data() {
    return {
      form: {
        c_id: "",
        q_simple_description: "",
        q_description:'',
        tags: [],
        q_range: 3,
        is_exam: false
      },
      temp_answer: [],
      answerForm: {
        content: "",
        isRight: false
      },
      isAddTagInput: false,
      isAddingAnswer: false
    };
  },
  created() {
    this.form.c_id = this.$route.params.c_id;
    this.form.q_description="<p>使用[blank_space]表示此处需要留空</p>";
  },
  methods: {
    addOneAnswer() {
      this.temp_answer.push({
        content: this.answerForm.content,
        isRight: this.answerForm.isRight
      });
      this.answerForm.isRight = false;
      this.answerForm.content = "";
    },
    addTag(data) {
      let index = this.form.tags.findIndex(item=>item.kp_id == data.value);
      if(index > -1){
        alertMessage("知识点重复",'error');
        return;
      }
      this.form.tags.push({
        kp_id: data.value,
        content: data.label
      });
      this.isAddTagInput = false;
    },
    submit() {
      this.form.answer = [];
      this.form.alternative_answer = [];
      this.temp_answer.forEach((item, index) => {
        this.form.alternative_answer.push(item.content);
        if (item.isRight) {
          this.form.answer.push(index);
        }
      });
      if(this.form.answer.length==0){
        alertMessage("无备选项，无法提交",'error');
        return;
      }
      if (this.form.answer.length > 1) {
        this.form.q_type = 2;
      } else {
        this.form.q_type = 1;
      }
      $http.post(`/question_library`, this.form).then(res => {
        alertMessage("提交成功", "success");
        // this.clear();
      });
    },
    clear() {
      this.form.alternative_answer = [];
      this.form.is_exam = false;
      this.form.q_description="<p>使用[blank_space]表示此处需要留空</p>";
      this.form.q_range = 3;
      this.form.q_simple_description='';
      this.form.tags = [];
      this.temp_answer = [];
    }
  }
};
</script>

<style scoped>
.app {
  margin: 15px;
}
.el-rate {
  position: relative;
  left: -100px;
}
</style>
