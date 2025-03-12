<script setup>
import { onUpdated, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useNavStore } from "@/stores/admin/nav";
import NavAPI from "@/api/NavAPI";

// 初始化
const navStore = useNavStore();

// 数据
const data = reactive({
  name: "",
  path: "",
  icon: "",
  sort: "0",
  status: "1",
});

// pageEdit 更新后获取列表
onUpdated(() => {
  if (navStore.data.pageEdit) {
    NavAPI.getById(navStore.data.id)
      .then((result) => {
        if (!result.status) {
          ElMessage.error(result.msg);
          return;
        }

        data.name = result.data.name;
        data.path = result.data.path;
        data.icon = result.data.icon;
        data.sort = result.data.sort;
        data.status = result.data.status;
      })
      .catch((error) => {
        ElMessage.error(error);
      });
  }
});

// 编辑
const edit = () => {
  if (data.name == "") {
    ElMessage.error("请填写名称");
    return;
  }

  if (data.path === "") {
    ElMessage.error("请填写路径");
    return;
  }

  let values = {
    id: String(navStore.data.id),
    name: data.name,
    path: data.path,
    icon: data.icon,
    sort: data.sort,
    status: data.status,
  };

  NavAPI.edit(values)
    .then((result) => {
      if (!result.status) {
        ElMessage.error(result.msg);
        return;
      }

      ElMessage.success("编辑成功");

      navStore.data.pageEdit = false;
      navStore.getList(navStore.data.parentId);
    })
    .catch((error) => {
      console.log(error);
    });
};

// 关闭对话框
const close = () => {
  data.name = "";
  data.path = "";
  data.icon = "";
  data.sort = "0";
  data.status = "1";
};
</script>

<template>
  <el-dialog
    v-model="navStore.data.pageEdit"
    draggable
    @close="close"
    width="600"
    title="编辑导航"
  >
    <el-form label-width="80">
      <el-form-item label="名称">
        <el-input v-model="data.name" placeholder="请填写名称" />
      </el-form-item>

      <el-form-item label="路径">
        <el-input v-model="data.path" placeholder="请填写路径" />
      </el-form-item>

      <el-form-item label="图标">
        <el-input v-model="data.icon" />
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
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
