<script setup>
import { onMounted, onBeforeUnmount, reactive, shallowRef } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import CategoryAPI from "@/api/CategoryAPI";
import ArticleAPI from "@/api/ArticleAPI";

// 初始化
const route = useRoute();
const router = useRouter();

// wangeditor
import "@wangeditor/editor/dist/css/style.css";
import "@/assets/admin/css/wangEditor.css";
import wangEditor from "@/assets/admin/js/wangEditor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const editorRef = shallowRef();

const editorInit = (editor) => {
  editorRef.value = editor;
};

// 组件卸载时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor) {
    editor.destroy();
  }
});

// 数据
const data = reactive({
  category_id: "",
  title: "",
  author: "邓瑞",
  url: "dengruicode.com",
  thumbnail: "",
  content: "",
  sort: "0",
  status: "1",
});

// 类别下拉框的数据
const category = reactive({
  list: [],
});

// 挂载后获取列表
onMounted(() => {
  CategoryAPI.getAllById(import.meta.env.VITE_CATEGORY_ID)
    .then((result) => {
      if (!result.status) {
        ElMessage.error(result.msg);
        return;
      }

      category.list = result.data;
    })
    .catch((error) => {
      ElMessage.error(error);
    });

  ArticleAPI.getById(route.query.id)
    .then((result) => {
      if (!result.status) {
        ElMessage.error(result.msg);
        return;
      }

      data.category_id = result.data.category_id;
      data.title = result.data.title;
      data.author = result.data.author;
      data.url = result.data.url;
      data.thumbnail = result.data.thumbnail;
      data.content = result.data.content;
      data.sort = result.data.sort;
      data.status = result.data.status;
    })
    .catch((error) => {
      ElMessage.error(error);
    });
});

// 上传缩略图
let apiUrl = import.meta.env.VITE_API_URL;

const beforeUpload = (file) => {
  if (file.type !== "image/jpeg") {
    ElMessage.error("请上传 jpg 格式图片");
    return false;
  }

  if (file.size / 1024 / 1024 > 2) {
    ElMessage.error("图片大小不能超过2MB");
    return false;
  }

  return true;
};

const uploadSuccess = (result) => {
  data.thumbnail = apiUrl + "/" + result.data.filePath;
};

// 编辑
const edit = () => {
  // 校验
  if (data.category_id == "") {
    ElMessage.error("请选择类别");
    return;
  }
  if (data.title == "") {
    ElMessage.error("请填写标题");
    return;
  }

  data.id = route.query.id;

  ArticleAPI.edit(data)
    .then((result) => {
      if (!result.status) {
        ElMessage.error(result.msg);
        return;
      }

      ElMessage.success("编辑成功");
    })
    .catch((error) => {
      console.log(error);
    });
};

// 返回
const back = () => {
  router.go(-1);
};
</script>

<template>
  <el-form label-width="80" style="width: 400px">
    <el-form-item label="类别">
      <el-select v-model="data.category_id" placeholder="请选择">
        <el-option
          v-for="value in category.list"
          :value="String(value.id)"
          :label="value.level_padding + value.name"
          :key="value.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="标题">
      <el-input v-model="data.title" placeholder="请填写标题" />
    </el-form-item>

    <el-form-item label="作者">
      <el-input v-model="data.author" />
    </el-form-item>

    <el-form-item label="作者网站">
      <el-input v-model="data.url" />
    </el-form-item>

    <el-form-item label="缩略图">
      <el-upload
        :action="`${apiUrl}/api/article/uploadImg`"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :show-file-list="false"
      >
        <img v-if="data.thumbnail" :src="data.thumbnail" style="width: 180px" />
        <el-icon v-else><Plus /></el-icon>
      </el-upload>
    </el-form-item>

    <el-form-item label="内容" style="width: 1000px">
      <div class="wangEditor">
        <Toolbar
          class="toolbar"
          :editor="editorRef"
          :defaultConfig="wangEditor.toolbarConfig"
        />
        <Editor
          class="content"
          v-model="data.content"
          :defaultConfig="wangEditor.editorConfig"
          @onCreated="editorInit"
        />
      </div>
    </el-form-item>

    <el-form-item label="排序">
      <el-input v-model="data.sort" />
    </el-form-item>

    <el-form-item label="状态">
      <el-radio-group v-model="data.status">
        <el-radio value="1">显示</el-radio>
        <el-radio value="0">隐藏</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="edit">编辑</el-button>
      <el-button @click="back">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
