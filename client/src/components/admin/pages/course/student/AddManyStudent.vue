<template>
  <div class="app">
    <a href="/static/student.xlsx" download="模板.xlsx">
      <el-button type="text" size="small">点击下载模板</el-button>
    </a>
    <el-form label-width="50px">
      <el-form-item label="班级">
        <chose-class v-on:update="id=>class_id=id"></chose-class>
      </el-form-item>
      <el-form-item label="文件">
        <el-upload class="upload-demo" drag action="" :file-list="files" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :on-change="choseFile" multiple :auto-upload="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或
            <em>点击选择</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件，且不超过1MB</div>
        </el-upload>
      </el-form-item>
      <div class="all-item-hcenter">
        <el-button type="primary" size="small" @click="submit">提交</el-button>
      </div>
    </el-form>
    <div v-for="(item,index) in errData" :key="index">
      {{index+1}} {{item.info}} {{item.errorInfo}}
    </div>
  </div>
</template>
<script>
import ChoseClass from "./ChoseClass";
export default {
  name: "AddManyStudent",
  components: {
    ChoseClass
  },
  data() {
    return {
      class_id: "",
      fileName: "",
      files: [],
      errData: []
    };
  },
  methods: {
    choseFile(file, fileList) {
      console.log(file);
      this.files = [];
      this.files.push(file);
    },
    submit() {
      let _this = this;
      this.errData = [];
      let form = new FormData();
      form.set('xlsx', this.files[0].raw);
      form.set('class_id', this.class_id);
      $http.post(`/class/${this.class_id}/add_many_student`, form, true).then(res => {
        if (res.length == 0) {
          _this.$message({ message: "全部加入成功", type: "success", center: true });
        } else {
          _this.$message({ message: "部分加入失败", type: "warning", center: true });
          _this.errData = res;
        }
      })
    }
  }
};
</script>
<style scoped>
.app {
  max-width: 700px;
  margin: 0 auto;
  padding: 10px;
}
</style>


