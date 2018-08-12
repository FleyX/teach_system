<template>
  <div class="app all-item-vcenter all-item-between">
    <!-- logo,导航区域 -->
    <div class="left all-item-vcenter">
      <router-link to="/client">
        <img src="../assets/logo.png" style="width:50px">
      </router-link>
      <el-menu mode="horizontal" background-color="#f2efe6" @select="handleSelect" ref="topMenu" menu-trigger="hover" :unique-opened="true"  style="border-bottom:0">
        <el-submenu index="course" style="margin-right:10px;">
          <template slot="title">
            <span class="course-name">{{courseName}}</span>
          </template>
          <el-menu-item v-for="item in courseList" :disabled="item.c_id==currentCourseId" :index="item.c_id.toString()" :key="item.c_id">{{item.c_name}}</el-menu-item>
        </el-submenu>
        <el-submenu index="base" v-show="currentCourseId>-1">
          <template slot="title">课程信息</template>
          <el-menu-item index="course_intro">课程介绍</el-menu-item>
          <el-menu-item index="teacher_intro">教师介绍</el-menu-item>
          <el-menu-item index="first_course">先导课程</el-menu-item>
          <el-menu-item index="teach_plan">教学计划</el-menu-item>
          <el-menu-item index="exam_type">考试方式</el-menu-item>
          <el-menu-item index="reference_book">参考书目</el-menu-item>
          <el-menu-item index="courseware">课件下载</el-menu-item>
        </el-submenu>
        <el-submenu index="knowledge_point" v-show="currentCourseId>-1">
          <template slot="title">知识点检测</template>
          <el-menu-item index="overview">总览</el-menu-item>
          <el-menu-item index="history">历史</el-menu-item>
        </el-submenu>
        <el-submenu index="work" v-show="currentCourseId>-1">
          <template slot="title">在线作业</template>
          <el-menu-item index="current_work">当前作业</el-menu-item>
          <el-menu-item index="last_work">历史作业</el-menu-item>
        </el-submenu>
        <el-submenu index="exam" v-show="currentCourseId>-1">
          <template slot="title">在线考试</template>
          <el-menu-item index="current_exam">当前考试</el-menu-item>
          <el-menu-item index="last_exam">历史考试</el-menu-item>
        </el-submenu>
        <el-submenu index="rank_list" v-show="currentCourseId>-1">
          <template slot="title">排行榜</template>
          <el-menu-item index="evaluate">实力排行</el-menu-item>
          <el-menu-item index="coverage">知识点覆盖率排行</el-menu-item>
        </el-submenu>
        <el-submenu index="question_answer" v-show="currentCourseId>-1">
          <template slot="title">答疑</template>
          <el-menu-item index="new">我要提问</el-menu-item>
          <el-menu-item index="current">当前答疑</el-menu-item>
          <el-menu-item index="historyqa">历史答疑</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <!-- 个人信息区域 -->
    <div class="right">
      <el-dropdown @command="handleCommand" trigger="hover" style="background:#f2efe6" @visible-change="index=>isPersonInfoDropdown = index">
        <div class="all-item-vcenter pointer">
          <img class="head-img" :src="userInfo.icon">
          <span>
            {{userInfo.u_name}}
            <i :class="isPersonInfoDropdown?  'el-icon-caret-top':'el-icon-caret-bottom'" style="font-size:16px"></i>
          </span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="info">
            我的资料
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            退出系统
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "Top",
  data() {
    return {
      courseList: [],
      currentCourseId: -1,
      isPersonInfoDropdown: false,
      userInfo: {},
      isCompleted: false
    };
  },
  watch: {
    "$route.path": function(value) {
      if (value == "/client"||value.startsWith('/client/person')) {
        this.currentCourseId = -1;
      } else {
        this.init();
      }
    }
  },
  computed: {
    courseName() {
      if (this.isCompleted == false) return "正在加载";
      else {
        if (this.courseList.length == 0) return "无课程";
        if (this.currentCourseId == -1) return "我的课程";
        let index = this.courseList.findIndex(
          item => item.c_id == this.currentCourseId
        );
        if (index == -1) this.$router.replace("/error/404");
        else return this.courseList[index].c_name;
      }
    }
  },
  created() {
    this.getCourse();
    this.getUserInfo();
    // this.init();
    bus.$on("updateUserInfo", () => {
      this.getUserInfo();
    });
  },
  methods: {
    handleSelect(key, keyPath) {
      if (keyPath[0] == "course") {
        this.currentCourseId = keyPath[1];
        this.$refs.topMenu.activeIndex = "adsfad";
        this.$router.push(`/client/course/${keyPath[1]}/announcement`);
      } else {
        let base = `/client/course/${this.currentCourseId}/${keyPath.join(
          "/"
        )}`;
        this.$router.push(base);
      }
    },
    handleCommand(command) {
      switch(command){
        case 'logout':
          clearClientInfo();
          this.$router.push("/public/client_login");
          break;
        case 'info':
          this.$router.push("/client/person/student_info");
          break;
      }
    },
    getCourse() {
      $httpc.get(`/user/${getClientUserInfo().u_id}/course`).then(res => {
        this.courseList = res;
        //传递课程信息到home.vue
        bus.$emit('courseList',res);
        this.isCompleted = true;
        this.$nextTick(() => {
          this.init();
        });
      });
    },
    getUserInfo() {
      $httpc.get("/user/" + getClientUserInfo().u_id).then(res => {
        this.userInfo = res;
        localStorage.setItem("clientUserInfo", JSON.stringify(res));
      });
    },
    init() {
      let path = this.$route.path.split("/").slice(1);
      if (path[1] == "course") {
        let c_id = parseInt(path[2]);
        this.currentCourseId = c_id;
        this.$refs.topMenu.activeIndex = path[4];
      }
    }
  }
};
</script>

<style scoped>
.app {
  height: 60px;
  background: #f2efe6;
}

.left {
  display: flex;
  margin-left:25px;
}
.right {
  display: flex;
  margin-right: 25px;
}
</style>
