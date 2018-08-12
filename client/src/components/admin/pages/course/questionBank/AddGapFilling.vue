<template>
  <div class="app">
    <el-form label-width="100px" @submit.native.prevent label-position="right">
      <el-form-item label="题目描述">
        <el-input v-model="form.q_simple_description"></el-input>
      </el-form-item>
      <el-form-item label="题目内容">
        <editor v-model="form.q_description"></editor>
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
      <el-form-item label="答案">
        <div>共有{{blankCount}}个答案</div>
        <div v-for="(item,index) in form.answer" :key="index">
          <span>{{item}}</span>
          <el-button type="text" size="mini" @click="form.answer.splice(index,1)">删除</el-button>
        </div>
        <!-- 插入答案-->
        <el-form v-if="isAddingAnswer" :inline="true" class="demo-form-inline">
          <el-form-item label="内容">
            <el-input v-model="answerForm.content"></el-input>
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
  name: "AddGapFilling",
  components: {
    ChosePoint
  },
  data() {
    return {
      form: {
        c_id: "",
        q_simple_description: "",
        q_description: "",
        tags: [],
        q_range: 3,
        is_exam: false,
        answer: [],
        q_type: 3
      },
      answerForm: {
        content: ""
      },
      blankCount: 0,
      isAddTagInput: false,
      isAddingAnswer: false
    };
  },
  watch: {
    "form.q_description": function (newValue) {
      this.blankCount = newValue.match(/\[blank_space\]/g).length;
    }
  },
  created() {
    this.form.c_id = this.$route.params.c_id;
    this.form.q_description = "<p>使用[blank_space]表示此处需要留空</p>";
  },
  methods: {
    addOneAnswer() {
      if (this.form.answer.length >= this.blankCount) {
        alertMessage("答案数量超过限定数", "warning");
        return;
      }
      this.form.answer.push(this.answerForm.content);
      this.answerForm.content = "";
    },
    addTag(data) {
      let index = this.form.tags.findIndex(item => item.kp_id == data.value);
      if (index > -1) {
        alertMessage("知识点重复", 'error');
        return;
      }
      this.form.tags.push({
        kp_id: data.value,
        content: data.label
      });
      this.isAddTagInput = false;
    },
    submit() {
      if (this.form.answer.length != this.blankCount) {
        alertMessage("预设答案数目与填空数不匹配", 'error');
        return;
      }
      $http.post(`/question_library`, this.form).then(res => {
        alertMessage("提交成功", "success");
        // this.clear();
      });
    },
    clear() {
      this.form.is_exam = false;
      this.form.q_description = "<p>使用[blank_space]表示此处需要留空</p>";
      this.form.q_range = 3;
      this.form.q_simple_description = "";
      this.form.tags = [];
      this.form.answer = [];
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
