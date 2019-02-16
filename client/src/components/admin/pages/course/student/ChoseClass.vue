<template>
  <el-cascader :options="allClass" v-model="optionValue" @change="handleChange">
  </el-cascader>
</template>
<script>
export default {
  name: "ChoseClass",
  data() {
    return {
      allClass: [],
      optionValue: []
    };
  },
  created() {
    this.getAllClass();
  },
  methods: {
    getAllClass() {
      let _this = this;
      $http.get("/course/tree?c_id=" + this.$route.params.c_id).then(res => {
        if (res.children) {
          _this.dealTreeData(res.children);
          _this.allClass = res.children;
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
        this.$emit("update", value[1]);
      }else{
        this.optionValue=[];
      }
    }
  }
};
</script>


