<script setup>
import { reactive, inject, onUpdated } from "vue";
import { ElMessage } from "element-plus";
import CategoryAPI from "@/api/CategoryAPI";

// 依赖注入
const injectData = inject("provideData");
const injectFuncGetList = inject("provideFuncGetList");

// 数据
const data = reactive({
  name: "",
  sort: "0",
  status: "1",
});

// 打开弹窗后获取数据
onUpdated(() => {
  if (injectData.pageEdit) {
    CategoryAPI.getById(injectData.id)
      .then((result) => {
        if (!result.status) {
          ElMessage.error(result.msg);
          return;
        }

        data.name = result.data.name;
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
  // 校验
  if (data.name == "") {
    ElMessage.error("请填写名称");
    return;
  }

  let values = {
    id: String(injectData.id),
    name: data.name,
    sort: data.sort,
    status: data.status,
  };

  CategoryAPI.edit(values)
    .then((result) => {
      if (!result.status) {
        ElMessage.error(result.msg);
        return;
      }

      ElMessage.success("编辑成功");
      injectData.pageEdit = false;
      // 重新获取列表
      injectFuncGetList();
    })
    .catch((error) => {
      ElMessage.error(error);
    });
};

// 关闭对话框
const close = () => {
  data.name = "";
  data.sort = "0";
  data.status = "1";
};
</script>

<template>
  <el-dialog
    v-model="injectData.pageEdit"
    draggable
    @close="close"
    width="600"
    title="编辑类别"
  >
    <el-form label-width="80">
      <el-form-item label="名称">
        <el-input v-model="data.name"></el-input>
      </el-form-item>

      <el-form-item label="排序">
        <el-input v-model="data.sort"></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-radio-group v-model="data.status">
          <el-radio label="1">显示</el-radio>
          <el-radio label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="edit">编辑</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
