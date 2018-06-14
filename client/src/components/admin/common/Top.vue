<template>
  <div id="top" class="all-item-between">
    <div class="left all-item-between">
      <div class="start all-item-vcenter">
        <router-link to="/admin">
          <span style="display:inline-flex;margin-left:30px;color:white;">{{systemName}}</span>
        </router-link>
      </div>
      <el-menu :default-active="activeIndex" ref='topMenu' class="el-menu-demo" style="border-bottom:0px;margin-left:14px;" background-color="#23262e" text-color="white" active-text-color="green" mode="horizontal" @select="handleSelect">
        <el-submenu v-if="courses.length>0" index="course">
          <template slot="title">
            <span class="course-name">{{currentCourseName}}</span>
          </template>
          <el-menu-item v-for="(item,num) in courses" :index="'course:'+num" :key="item.c_id" :disabled="num==currentCourse">{{item.c_name}}</el-menu-item>
        </el-submenu>
        <el-menu-item index="none" v-else disabled>无课程</el-menu-item>

        <el-menu-item index="base" v-show="currentCourse>=0">课程</el-menu-item>
        <el-menu-item index="announcement" v-show="currentCourse>=0">公告</el-menu-item>
        <el-menu-item index="student" v-show="currentCourse>=0">学生</el-menu-item>
        <el-menu-item index="question_bank" v-show="currentCourse>=0">题库</el-menu-item>
        <el-menu-item index="test" v-show="currentCourse>=0">测试</el-menu-item>
        <el-menu-item index="Q_A" v-show="currentCourse>=0">答疑</el-menu-item>
        <el-menu-item index="statistics" v-show="currentCourse>=0">统计</el-menu-item>
      </el-menu>
    </div>
    <!-- 个人信息 -->
    <div class="right">
      <el-dropdown @command="handleCommand" @visible-change="index=>isPersonInfoDropdown = index">
        <div class="all-item-vcenter pointer">
          <img class="head-img" :src="userInfo.icon">
          <span style="color:white;">
            {{userInfo.u_name}}
            <i :class="isPersonInfoDropdown?  'el-icon-caret-top':'el-icon-caret-bottom'" style="font-size:16px"></i>
          </span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="info">
            我的
          </el-dropdown-item>
          <el-dropdown-item v-if="userInfo.u_type == 0" command="manage">
            管理
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "top",
  data() {
    return {
      systemName: "教学辅助系统",
      userInfo: {},
      courses: [],
      currentCourseName: "我的课程",
      currentCourse: -1,
      activeIndex: "-1",
      isPersonInfoDropdown: false
    };
  },
  watch: {
    $route: function (newPath, oldPath) {
      this.updateChecked(newPath.path);
    }
  },
  created() {
    let _this = this;
    bus.$on("updateUserInfo", data => {
      _this.getInfo();
    });
    bus.$on("updateCourse", data => {
      console.log("updateCourse");
      _this.getCourse();
    });
    this.getInfo();
    this.getCourse();
    let timer = setInterval(function () {
      if (_this.courses.length > 0) {
        clearInterval(timer);
        _this.updateChecked(_this.$route.path);
      }
    }, 300);
  },
  methods: {
    handleSelect(e) {
      console.log(e);
      if (e.startsWith("course")) {
        this.currentCourse = parseInt(e.split(":")[1]);
        this.currentCourseName = this.courses[this.currentCourse].c_name
        this.$router.push(
          `/admin/course/${this.courses[this.currentCourse].c_id}/statistics`
        );
        this.$refs.topMenu.activeIndex = 'statistics';
      } else {
        this.$router.push(
          `/admin/course/${this.courses[this.currentCourse].c_id}/${e}`
        );
      }
    },
    handleCommand(e) {
      switch (e) {
        case "info":
          this.$router.push("/admin/person_space");
          break;
        case "manage":
          this.$router.push("/admin/manage/course_manage");
          break;
        case "logout":
          clearInfo();
          this.$router.replace("/public/admin_login");
      }
      this.currentCourseName = "我的课程";
      this.currentCourse = -1;
      this.activeIndex = "asdfasdf";
    },
    getCourse() {
      let _this = this;
      $http.get("/user/" + getUserInfo().u_id + "/course").then(res => {
        _this.courses = res;
      });
    },
    getInfo() {
      let _this = this;
      $http.get("/user/" + getUserInfo().u_id).then(res => {
        _this.userInfo = res;
        localStorage.setItem('userInfo', JSON.stringify(res));
      });
    },
    updateChecked(path) {
      let data = path.split("/");
      if (!path.startsWith("/admin/course/")) {
        this.currentCourse = -1;
        this.currentCourseName = '我的课程';
        if (path == '/admin')
          bus.$emit('leftOrder', { order: 'admin', defaultIndex: 'overview' });
        else {
          bus.$emit('leftOrder', { order: data[2], defaultIndex: data.slice(2).join('/') });
        }
        return;
      }
      this.currentCourse = this.courses.findIndex(item => {
        return item.c_id.toString() == data[3];
      });
      this.currentCourseName = this.courses[this.currentCourse].c_name;
      this.activeIndex = data[4];
      bus.$emit('leftOrder', {
        order: data[4],
        defaultIndex: data.slice(4).join('/')
      })
    }
  }
};
</script>
<style scoped>
#top {
  width: 100%;
  background: #23262e;
  color: white;
  align-items: center;
}
.start {
  min-width: 180px;
  font-size: 18px;
}
.nav {
  margin-left: 14px;
}
.right {
  margin-right: 40px;
}
</style>
