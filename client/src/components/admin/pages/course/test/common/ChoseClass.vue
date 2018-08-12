<template>
  <el-tree :data="treeData" node-key="id" :default-expanded-keys="[c_id]" :props="props" default-expand-all check-on-click-node show-checkbox @check-change="handleChange">
  </el-tree>
</template>

<script>
export default {
  name: "ChoseClass",
  data() {
    return {
      props: {
        children: "children",
        label: "label"
      },
      c_id: "",
      treeData: []
    };
  },
  created() {
    this.c_id = this.$route.params.c_id;

    this.getData();
  },
  methods: {
    getData() {
      $http.get("/course/tree?c_id=" + this.c_id).then(res => {
        res.disabled = true;
        res.children.forEach(item => (item.disabled = true));
        this.treeData.push(res);
      });
    },
    handleChange(data, checked, indeterminate) {
      let father = "";
      if (data.level == 3) {
        if (checked == true)
          for (let i = 0; i < this.treeData[0].children.length; i++) {
            let children = this.treeData[0].children[i];
            let index = children.children.findIndex(item => item.id == data.id);
            if (index != -1) {
              father = children.label;
              break;
            }
          }
        this.$emit("class-change", data, checked, father);
      }
    }
  }
};
</script>

<style>

</style>
