<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/client'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人资料</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form label-width="100px" style="width:500px;margin:0 auto">
      <!-- 编辑头像 -->
      <el-form-item label="头像">
        <label v-if="currentEdit == 'icon'" class="upload-file all-item-vcenter all-item-hcenter pointer">
          <input type="file" v-show="false" @change="choseImg" accept="image/*">
          <img v-if="imgUrl" :src="imgUrl">
          <i v-else class="el-icon-plus"></i>
        </label>
        <template v-else>
          <el-tooltip class="item" effect="dark" content="点击编辑" placement="right">
            <img :src="userInfo.icon" class="head-icon pointer" @click="currentEdit='icon'">
          </el-tooltip>
        </template>
      </el-form-item>
      <!-- 编辑性别 -->
      <el-form-item label="性别">
        <el-select v-if="currentEdit=='sex'" v-model="sex">
          <el-option label="男" value="0"></el-option>
          <el-option label="女" value="1"></el-option>
        </el-select>
        <template v-else>
          <el-tooltip class="item" effect="dark" content="点击编辑" placement="right">
            <span @click="currentEdit='sex'" class="pointer">{{sexName}}</span>
          </el-tooltip>
        </template>
      </el-form-item>
      <!-- 编辑邮箱 -->
      <el-form-item label="邮箱">
        <template v-if="currentEdit=='email'">
          <el-input type="password" placeholder="密码" v-model="password"></el-input>
          <el-input type="text" placeholder="新邮箱" v-model="newEmail"></el-input>
        </template>
        <template v-else>
          <span>{{userInfo.email_addr}}</span>
          <el-button type="text" size="mini" @click="currentEdit='email'">修改</el-button>
        </template>
      </el-form-item>
      <el-form-item label="密码">
        <template v-if="currentEdit=='password'">
          <el-input type="password" placeholder="旧密码" v-model="password"></el-input>
          <el-input type="password" placeholder="新密码" v-model="newPassword"></el-input>
          <el-input type="password" placeholder="重复新密码" v-model="repeatNewPassword"></el-input>
        </template>
        <el-button v-else type="text" size="mini" @click="currentEdit='password'">修改密码</el-button>
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
  name: "StudentInfo",
  data() {
    return {
      userInfo: {},
      currentEdit: "",
      imgUrl: null,
      sex: "",
      password: "",
      newPassword: "",
      repeatNewPassword:'',
      newEmail: "",
      choseFile: null,
      u_id: ""
    };
  },
  computed: {
    sexName() {
      if (this.userInfo.sex == 0) return "男";
      else if (this.userInfo.sex == 1) return "女";
      else return "未知";
    }
  },
  created() {
    this.u_id = getClientUserInfo().u_id;
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      $httpc.get("/user/" + this.u_id).then(res => {
        localStorage.setItem("clientUserInfo", JSON.stringify(res));
        this.userInfo = res;
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
      if (this.currentEdit === "icon") {
        let form = new FormData();
        form.append("icon", this.choseFile);
        form.append("u_id", this.u_id);
        $httpc.put("/user/change_simple_info", form, true).then(res => {
          alertMessage("修改成功", "success");
          this.getUserInfo();
          bus.$emit("updateUserInfo");
          this.currentEdit = "";
        });
      } else if (this.currentEdit === "sex") {
        $httpc
          .put("/user/change_simple_info", {
            u_id: this.userInfo.u_id,
            sex: this.sex
          })
          .then(res => {
            this.userInfo.sex = this.sex;
            alertMessage("修改成功", "success");
            this.currentEdit = "";
          });
      } else if (this.currentEdit === "password") {
        $httpc.put(`/user/change_password`, {
            password: this.password,
            newPassword: this.newPassword,
            repeatNewPassword: this.repeatNewPassword,
            u_id:this.u_id
          }).then(res => {
            alertMessage("修改成功");
            this.currentEdit='';
          });
      } else if (this.currentEdit === "email") {
        $httpc.put(`/user/change_email`,{
          password:this.password,
          newEmail:this.newEmail,
          u_id:this.u_id
        }).then(res=>{
          alertMessage("修改成功");
          this.userInfo.email_addr=this.newEmail
          this.currentEdit='';
        })
      }
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
