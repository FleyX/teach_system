<template>
  <el-cascader :options="allPoints" v-model="optionValue" @change="handleChange">
  </el-cascader>
</template>
<script>
export default {
  name: "ChosePoint",
  data() {
    return {
      allPoints: [],
      optionValue: [],
      c_id: ""
    };
  },
  created() {
    this.c_id = this.$route.params.c_id;
    this.getAllClass();
  },
  methods: {
    getAllClass() {
      let _this = this;
      $http.get(`/course/${this.c_id}/knowledge_point_tree`).then(res => {
        if (res.children) {
          _this.dealTreeData(res.children);
          _this.allPoints = res.children;
        }
      });
    },
    dealTreeData(data) {
      data.forEach(item => {
        item.value = item.id;
        if (item.children) {
          this.dealTreeData(item.children);
        }
      });
    },
    handleChange(value) {
      if (value.length == 2) {
        let section = this.allPoints.find(item => item.id == value[0]);
        let point = section.children.find(item => item.id == value[1]);
        this.$emit("update", point);
      }
      this.optionValue = [];
    }
  }
};
</script>



