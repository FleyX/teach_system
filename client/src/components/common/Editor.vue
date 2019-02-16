<template>
  <div style="line-height:30px;margin-bottom:30px;position:relative">
    <div class="word-num">您已输入{{currentNum}}字,最多可输入5000</div>
    <div ref="editor">
    </div>
  </div>
</template>
<script>
import E from "wangeditor";
export default {
  name: "Editor",
  props: ["value"],
  data() {
    return {
      editor: {},
      content: this.value,
      currentNum: 0
    };
  },
  watch: {
    value(newData) {
      this.currentNum = this.editor.txt.text().length;
      if (newData !== this.content) {
        this.editor.txt.html(newData);
      }
    }
  },
  mounted() {
    let editor = new E(this.$refs.editor);
    // editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.zIndex = 1;
    editor.customConfig.onchange = html => {
      this.content = html;
      this.$emit("input", html);
    };
    editor.customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      'image',  // 插入图片
      'table',  // 表格
      'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ]
    //配置图片上传回显
    editor.customConfig.uploadImgServer = '/api/v1/public/img_upload';
    let token;
    if (this.$route.path.startsWith('/admin/'))
      token = getToken();
    else
      token = getClientToken();
    editor.customConfig.uploadImgHeaders = {
      'Authorization': token
    }
    editor.create();
    editor.txt.html(this.content);
    this.currentNum = editor.txt.text().length;
    this.editor = editor;
  },
  methods: {
    getText: function () {
      return this.editor.txt.text();
    }
  }
};
</script>
<style scoped>
.word-num {
  display: inline-block;
  position: absolute;
  bottom: -30px;
  right: 3px;
  height: 30px;
  font-size: 10px;
}
</style>

