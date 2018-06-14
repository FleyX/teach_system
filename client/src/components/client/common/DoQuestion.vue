<template>
  <div class="app">
    <div class="left">{{index}}.【{{data.score}}】</div>
    <div class="right">
      <show-text class="content" :data="data.q_description"></show-text>
      <!-- 选择题答案 -->
      <div class="altertive-answer" v-if="data.q_type<3">
        <div v-for="(item,index) in value" :key="index">
          <el-checkbox v-model="value[index]" :disabled="action=='watch'">{{String.fromCharCode(65+index)}}.{{data.alternative_answer[index]}}</el-checkbox>
        </div>
      </div>
      <!-- 填空题答案 -->
      <div v-else-if="data.q_type==3">
        <el-input v-for="(item,index) in value" :disabled="action=='watch'" :key="item.ql_id" type="text" v-model="value[index]" style="width:150px;border-bottom:2px solid black"></el-input>
      </div>
      <!-- 编程题答案 -->
      <div v-else-if="data.q_type==4&&value!=undefined">
        <el-select v-model="value[0]" placeholder="选择语言" style="width:100px" :disabled="action=='watch'">
          <el-option label="java" value="java"></el-option>
          <el-option label="c++" value="cpp"></el-option>
          <el-option label="c" value="c"></el-option>
          <el-option label="python2" value="py2"></el-option>
          <el-option label="python3" value="py3"></el-option>
        </el-select>
        <el-input type="textarea" :rows="14" v-model="value[1]" style="width:95%" :disabled="action=='watch'"></el-input>
      </div>
    </div>
    <div class="sum" v-if="action=='watch'">
      <i class="el-icon-check primary" v-if="sum===1"></i>
      <i class="el-icon-close warning" v-else></i>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data", "value", "index", "action",'sum'],
  name: "DoQuestion",
  created() {
    this.data.q_description = this.data.q_description.replace(
      /\[blank_space\]/g,
      "<span class='blank'></span>"
    );
  },
};
</script>

<style scoped>
.app {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  position: relative;
}
.left {
  padding-left: 10px;
  padding-right: 5px;
  padding-top: 13px;
}
.right {
  flex: 1;
}
.sum{
  position: absolute;
  left:0;
  top:0;
  font-size: 65px;
}
</style>
