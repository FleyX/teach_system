<template xmlns="http://www.w3.org/1999/html">
  <div id="app" class="all-item-vcenter all-item-hcenter">
    <div style="position: relative;top:-30px;text-align:center">
      <div class="welcome-word">{{welcomeWord}}</div>
      <router-link :to="returnUrl" replace class="return">返回登录</router-link>
      <el-form style="width:350px;margin:0 auto;margin-top:30px;">
        <el-form-item>
          <el-input placeholder="账号" v-model="code" clearable @keyup.enter.native="submit" />
        </el-form-item>
        <el-form-item>
          <el-input type="password" placeholder="新密码" v-model="pass" clearable @keyup.enter.native="submit" />
        </el-form-item>
        <el-form-item>
          <el-input type="password" placeholder="重复新密码" v-model="repass" @keyup.enter.native="submit" clearable />
        </el-form-item>
        <div class="all-item-between" style="margin-bottom:22px">
          <el-input style="width:60%" type="text" placeholder="验证码" v-model="authCode" @keyup.enter.native="submit" />
          <el-button style="width:37%" type="warning" @click="getAuthCode()" :disabled="countdown>0">{{text}}</el-button>
        </div>
        <el-button type="primary" style="width:100%" @click="submit">提交</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      welcomeWord: "重置密码",
      code: "",
      pass: "",
      repass: "",
      authCode: "",
      text: "获取验证码",
      countdown: 0,
      returnUrl: '.',
      timer: null
    };
  },
  created() {
    if (this.$route.query.redirect != undefined)
      this.returnUrl += '?redirect=' + this.$route.query.redirect;
  },
  destroyed() {
    if (this.timer != null) clearInterval(this.timer);
  },
  methods: {
    submit() {
      $http
        .post("/public/reset-password", {
          code: this.code,
          mail: this.email,
          pass: this.pass,
          repass: this.repass,
          authCode: this.authCode
        })
        .then(data => {
          if (data.code === 0) {
            alertMessage(data.info, 'error');
          } else {
            alertMessage(data.info, 'success');
            this.$router.replace(this.returnUrl);
          }
        })
    },
    getAuthCode() {
      if (this.countdown > 0) return;
      $http.post("/public/mail-auth-code", {
        code: this.code,
        mail: this.email
      }).then(data => {
        if (data.code === 0) {
          alertMessage(data.info, 'error');
        } else {
          alertMessage(data.info, 'success');
          this.countdown = 60;
          this.text = this.countdown + " 后重试";
          this.timer = setInterval(() => {
            if (--this.countdown <= 0) {
              this.text = "获取验证码";
              clearInterval(this.timer);
            } else {
              this.text = this.countdown + " 后重试";
            }
          }, 1000);
        }
      });
    }
  }
};
</script>
<style scoped>
#app {
  width: 100%;
  height: 100%;
  color: white;
}

.welcome-word {
  font-size: 40px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
}

.return {
  color: white;
  font-size: 14px;
}
</style>
