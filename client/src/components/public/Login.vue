<template xmlns="http://www.w3.org/1999/html">
  <div id="app" class="all-item-vcenter all-item-hcenter">
    <div style="position: relative;top:-30px">
      <div class="welcome-word">{{welcomeWord}}</div>
      <el-form style="width:350px;margin:0 auto;margin-top:60px">
        <el-form-item>
          <el-tooltip effect="dark" content="学生输入学号，教师输入工号" placement="right">
            <el-input placeholder="学工号" v-model="code" @keydown.enter.native="submit" clearable />
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-tooltip effect="dark" content="6-20位数字字母组合" placement="right">
            <el-input type="password" placeholder="密码" v-model="password" @keydown.enter.native="submit" clearable />
          </el-tooltip>
        </el-form-item>
        <div class="all-item-between" style="margin-bottom:22px">
          <el-input style="width:60%" type="text" placeholder="验证码" v-model="authcode" @keyup.enter.native="submit" />
          <el-tooltip effect="dark" content="点击切换" placement="top">
            <img style="width:37%;height:40px;border-radius:5%" :src="'data:image/png;base64,'+imgData" @click="getImg()">
          </el-tooltip>
        </div>
        <div class="all-item-between" style="margin-bottom:22px;line-height:19px">
          <el-checkbox label="记住我" style="color:white" v-model="isRememberMe" />
          <router-link :to="resetPass" style="display:flex">
            <span class="forget-pass">忘记密码？</span>
          </router-link>
        </div>
        <el-button type="primary" style="width:100%" @click="submit">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      welcomeWord: "hello,welcome back!",
      code: "",
      password: "",
      isRememberMe: false,
      imgData: "",
      authcode: "",
      authcodeKey: "",
      resetPass: ""
    };
  },
  beforeCreate() {
    let params = this.$route.path.split("/");
    let userInfo;
    if (params[params.length - 1] == "admin_login") userInfo = getUserInfo();
    else userInfo = getClientUserInfo();
    if (userInfo != null) {
      this.$alert("您已登录，请勿重复操作", "警告", {
        type: "warning",
        showClose: false
      }).then(res => {
        if (userInfo.u_type == 3) {
          this.$router.replace("/client");
        } else {
          this.$router.replace("/admin");
        }
      });
    }
  },
  created() {
    this.resetPass = this.$route.path + "/reset_pass";
    if (this.$route.query.redirect != undefined)
      this.resetPass += "?redirect=" + this.$route.query.redirect;
    this.getImg();
  },
  methods: {
    submit() {
      let _this = this;
      $http
        .post("/public/login", {
          code: this.code,
          password: this.password,
          authcode: this.authcode,
          authcodeKey: this.authcodeKey,
          isRememberMe: this.isRememberMe
        })
        .then(res => {
          _this.do(res);
        });
    },
    do(res) {
      if (res.code === 0) {
        vm.$message({
          message: res.info,
          type: "error",
          center: true
        });
      } else if (res.code === 1) {
        vm.$message({
          message: res.info,
          type: "success",
          center: true,
          duration: 1000
        });
        //跳转到对应页面
        let params = this.$route.query;
        if (res.data.u_type === 3) {
          localStorage.setItem("clientToken", res.data.token);
          window.clientToken = res.data.token;
          localStorage.setItem("clientUserInfo", JSON.stringify(res.data));
        } else {
          localStorage.setItem("token", res.data.token);
          window.token = res.data.token;
          localStorage.setItem("userInfo", JSON.stringify(res.data));
        }
        let url = "";
        if (res.data.u_type === 3) url = "/client";
        else url = "/admin";
        setTimeout(() => {
          console.log(url);
          this.$router.replace(url);
        }, 500);
      }
    },
    getImg() {
      let _this = this;
      $http.get("/public/authcode").then(res => {
        _this.imgData = res.data;
        _this.authcodeKey = res.key;
      });
    }
  }
};
</script>
<style scoped>
#app {
  color: white;
}

.welcome-word {
  font-size: 40px;
  color: white;
  text-align: center;
  margin-bottom: 25px;
}

.forget-pass {
  color: white;
  font-size: 14px;
}
</style>
