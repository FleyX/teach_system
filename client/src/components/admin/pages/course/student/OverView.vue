<template>
  <div class="app">
    <div class="left">
      <div class="action all-item-between all-item-vcenter">
        <el-input style="width:100%" placeholder="搜索" v-model="filterText"></el-input>
      </div>
      <el-tree ref="tree" :data="treeData" :props="defaultProps" highlight-current accordion  @node-click="handleClick" :filter-node-method="filterNode">
        <div slot-scope="{node,data}">
          <span>{{node.label}}</span>
          <i class="el-icon-circle-plus primary" v-if="data.level<3" @click.stop="append(node,data)"></i>
          <i class="el-icon-remove warning" v-if="data.level>1&&(data.children==undefined||data.children.length==0)" @click.stop="remove(node,data)"></i>
        </div>
      </el-tree>
    </div>
    <div class="right">
      <show-class v-show="isShowTable" :id="currentClassId"></show-class>
    </div>
    <el-dialog :visible.sync="isDialogShow" :title="currentAction=='grade'?'新增年级':'新增班级'">
      <add-node :currentAction="currentAction" :id="currentNode.id" v-on:closeDialog="closeDialog"></add-node>
    </el-dialog>
  </div>
</template>
<script>
import ShowClass from "./ShowClass";
import AddNode from "./AddNode";
export default {
  name: "OverView",
  components: {
    ShowClass,
    AddNode
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      filterText: "",
      isDialogShow: false,
      isShowAddButton: true,
      addButtonText: "新增年级",
      currentAction: "",
      currentNode: {},
      isShowTable: false,
      currentClassId: ""
    };
  },
  created() {
    this.c_id = this.$route.params.c_id;
    $http.get("/course/tree?c_id=" + this.c_id).then(res => {
      this.treeData.push(res);
    });
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    remove(node, data) {
      let text = "确定要删除整个班级吗？";
      let url = `/class/${data.id}`;
      if (data.level == 2) {
        text = "删除该年级吗？";
        url = `/grade/${data.id}`;
      }
      let _this = this;
      alertConfirm(text).then(() => {
        $http.delete(url).then(res => {
          alertMessage("删除成功", "success");
          let list = node.parent.data.children;
          list.splice(list.indexOf(data), 1);
          if (data.level == 3 && data.id == _this.currentClassId) {
            _this.isShowTable = false;
            _this.currentClassId = "";
          }
        });
      });
    },
    append(node, data) {
      this.currentNode = data;
      if (node.level == 1) {
        this.currentAction = "grade";
      } else if (node.level == 2) {
        this.currentAction = "class";
      }
      this.isDialogShow = true;
    },
    closeDialog(data) {
      this.isDialogShow = false;
      if (data != undefined) {
        if (this.currentNode.children == undefined) {
          this.$set(this.currentNode, "children", []);
        }
        this.currentNode.children.push(data);
      }
    },
    handleClick(data) {
      if (data.level == 3) {
        this.currentClassId = data.id;
        this.isShowTable = true;
      } else {
        this.isShowTable = false;
      }
    }
  }
};
</script>
<style scoped>
.app {
  text-align: left;
  display: flex;
}
.left{
  flex:1;
  border-right: 1px solid #fcfcfc;
  padding-right:3px;
}
.right{
  padding-left:3px;
  flex:3;
}
</style>

