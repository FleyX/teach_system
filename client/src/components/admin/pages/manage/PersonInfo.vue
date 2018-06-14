<template>
  <div class="app">
    <el-form label-width="100px">
      <el-form-item label="头像">
        <label v-if="currentEdit == 'icon'" class="upload-file all-item-vcenter all-item-hcenter pointer">
          <input type="file" v-show="false" @change="choseImg" accept="image/*">
          <img v-if="imgUrl" :src="imgUrl">
          <i v-else class="el-icon-plus"></i>
        </label>
        <template v-else>
          <el-tooltip class="item" effect="dark" content="点击编辑" placement="right">
            <img :src="personInfo.icon" class="head-icon pointer" @click="currentEdit='icon'">
          </el-tooltip>
        </template>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-if="currentEdit=='sex'" v-model="sex">
          <el-option label="男" value="0"></el-option>
          <el-option label="女" value="1"></el-option>
        </el-select>
        <template v-else>
          <el-tooltip class="item" effect="dark" content="点击编辑" placement="right">
            <span @click="currentEdit='sex'" class="pointer">{{personInfo.sexInfo}}</span>
          </el-tooltip>
        </template>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-tooltip class="item" effect="dark" content="请到安全选项中修改" placement="right">
          <span>{{personInfo.email_addr}}</span>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div style="text-align:center" v-show="currentEdit!=''">
      <el-button @click="currentEdit =''" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "PersonInfo",
  data() {
    return {
      personInfo: {},
      currentEdit: "",
      imgUrl: null,
      sex:'',
      choseFile: null
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    editIcon() {},
    getInfo() {
      let _this = this;
      $http.get("/user/" + getUserInfo().u_id).then(res => {
        switch(res.sex){
          case 0:res.sexInfo = '男';break;
          case 1:res.sexInfo='女';break;
          case 2:res.sexInfo='未知';break;
        }
        _this.personInfo = res;
      });
    },
    choseImg(data) {
      let file = data.target.files[0];
      console.log(file);
      if (file.size > 2 * 1024 * 1024) {
        this.$message({
          message: "文件大小不得超过2M",
          type: "warning"
        });
      } else {
        this.choseFile = file;
        this.imgUrl = URL.createObjectURL(file);
      }
    },
    submit() {
      let _this = this;
      if (this.currentEdit === "icon") {
        let form = new FormData();
        form.append("icon", this.choseFile);
        form.append("u_id", this.personInfo.u_id);
        $http.put("/user/change_simple_info", form, true).then(res => {
          _this.editSuccess();
        });
      } else {
        $http
          .put("/user/change_simple_info", {
            u_id: this.personInfo.u_id,
            sex: this.sex
          })
          .then(res => {
            _this.editSuccess();
          });
      }
    },
    editSuccess() {
      bus.$emit("updateUserInfo");
      this.getInfo();
      this.$message({
        message: "修改成功",
        type: "success",
        center:true
      });
      this.currentEdit = "";
    }
  }
};
</script>
<style scoped>
.app {
  text-align: left;
  width: 400px;
  margin: 0 auto;
  margin-top: 50px;
}
.head-icon {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
}
.upload-file {
  width: 150px;
  height: 150px;
  border-radius: 6px;
  padding: 1px;
  border: 1px dashed #d9d9d9;
  display: flex;
}
.upload-file:hover {
  border: 1px dashed #5995f7;
}
.upload-file > img {
  overflow: hidden;
  border: 0;
  width: 148px;
  height: 148px;
  border-radius: 5px;
}
.upload-file > i {
  font-size: 28px;
}
</style>

