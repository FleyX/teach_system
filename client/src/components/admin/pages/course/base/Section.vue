<template>
  <div class="app">
    <div class="action all-item-between all-item-vcenter">
      <el-input style="width:100%" placeholder="搜索" v-model="filterText"></el-input>
    </div>
    <el-tree ref="tree" :data="tree" :props="defaultProps"  :filter-node-method="filterNode">
      <div slot-scope="{node,data}">
        <span>{{node.label}}</span>
        <i class="el-icon-circle-plus primary" v-if="data.level<3" @click.stop="append(node,data)"></i>
        <i class="el-icon-remove warning" v-if="data.level>1&&(data.children==undefined||data.children.length==0)" @click.stop="remove(node,data)"></i>
      </div>
    </el-tree>
    <el-dialog :visible.sync="isDialogShow" :title="currentAction=='section'?'新增章节':'新增知识点'">
      <el-form label-width="90px" @submit.native.prevent>
        <el-form-item :label="currentAction=='section'?'章节名':'知识点名'" >
          <el-input v-model="newNodeValue" @keyup.enter.native="submit"></el-input>
        </el-form-item>
      </el-form>
      <div class="all-item-hcenter">
        <el-button type="warning" size="small" @click="isDialogShow=false">取消</el-button>
        <el-button type="primary" size="small" @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Section",
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      c_id: "",
      tree: [],
      filterText: "",
      currentAction: "",
      currentNode: "",
      isDialogShow: false,
      newNodeValue: ""
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.c_id = this.$route.params.c_id;
    this.getSectionTree();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getSectionTree() {
      $http
        .get(`/course/${this.c_id}/knowledge_point_tree`)
        .then(res => {
          res.children.sort((a,b)=>a>b);
          this.tree.push(res);

          });
    },
    remove(node, data) {
      let text = "确定要删除整个章节吗？";
      let url = `/section/${data.id}`;
      if (data.level == 3) {
        text = "删除该知识点吗？";
        url = `/knowledge_point/${data.id}`;
      }
      let _this = this;
      alertConfirm(text).then(() => {
        $http.delete(url).then(res => {
          alertMessage("删除成功", "success");
          let list = node.parent.data.children;
          list.splice(list.indexOf(data), 1);
        });
      });
    },
    append(node, data) {
      this.currentNode = data;
      this.newNodeValue = '';
      if (node.level == 1) {
        this.currentAction = "section";
      } else if (node.level == 2) {
        this.currentAction = "knowledgePoint";
      }
      this.isDialogShow = true;
    },
    submit() {
      if (this.newNodeValue.trim().length == 0) {
        alertMessage("请勿为空", 'error');
        return;
      }
      let url = "";
      let form = {};
      if (this.currentAction == "section") {
        url = "/section";
        form.c_id = this.currentNode.id;
        form.s_name = this.newNodeValue;
      } else {
        url = "/knowledge_point";
        form.s_id = this.currentNode.id;
        form.content = this.newNodeValue;
      }
      let _this = this;
      $http.post(url, form).then(res => {
        alertMessage("新增成功", "success");
        _this.isDialogShow = false;
        if (_this.currentNode.children == undefined) {
          _this.$set(_this.currentNode, 'children', []);
        }
        _this.currentNode.children.push({
          id: res,
          label: _this.newNodeValue,
          level: _this.currentNode.level + 1
        });
      });
    }
  }
};
</script>

<style scoped>
.app {
  max-width: 700px;
  margin: 10px;
}
</style>
