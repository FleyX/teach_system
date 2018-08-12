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
      <el-form-item label="测试点">
        <div>
          <el-popover v-for="(item,index) in form.answer" :key="index" placement="top" width="300" trigger="hover">
            <span style="font-weight:600">输入：</span>
            <pre>{{item.input}}</pre>
            <span style="font-weight:600">输出：</span>
            <pre>{{item.output}}</pre>
            <span>点击删除</span>
            <!-- <el-tag type="" closable slot="reference">测试点{{index+1}}</el-tag> -->
            <el-button size="small" @click="form.answer.splice(index,1)" slot="reference">测试点{{index+1}}</el-button>
          </el-popover>
        </div>
        <div class="all-item-around">
          <el-input type="textarea" :rows="5" v-model="tempAnswer.input" placeholder="输入" style="width:50%"></el-input>
          <el-input type="textarea" :rows="5" v-model="tempAnswer.output" placeholder="输出" style="width:50%"></el-input>
        </div>
        <el-button type="primary" size="small" @click="addCesi">新增测试点</el-button>
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
  name: "AddProgram",
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
        q_type: 4
      },
      tempAnswer: { input: '', output: '' },
      isAddTagInput: false
    };
  },
  created() {
    this.form.c_id = this.$route.params.c_id;
    this.form.q_description = "<p>使用[blank_space]表示此处需要留空</p>";
  },
  methods: {
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
      if (this.form.answer.length == 0) {
        alertMessage("请至少输入一组测试数据", 'error');
        return;
      }
      $http.post(`/question_library`, this.form).then(res => {
        alertMessage("提交成功", "success");
        // this.clear();
      });
    },
    addCesi() {
      this.form.answer.push(this.tempAnswer);
      this.tempAnswer = { input: '', output: '' };
    },
    clear() {
      this.form.is_exam = false;
      this.form.q_description = "<p>使用[blank_space]表示此处需要留空</p>";
      this.form.q_range = 3;
      this.form.q_simple_description = "";
      this.form.tags = [];
      this.form.answer = [];
      this.tempAnswer = { input: '', output: '' };
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
