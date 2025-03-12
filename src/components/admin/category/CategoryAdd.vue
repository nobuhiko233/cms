<script setup>
import { reactive, inject } from "vue";
import { ElMessage } from "element-plus";
import Time from "@/utils/Time";
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

// 添加
const add = () => {
  // 校验
  if (data.name == "") {
    ElMessage.error("请填写名称");
    return;
  }

  let values = {
    name: data.name,
    sort: data.sort,
    status: data.status,
    parent_id: injectData.parentId,
    level: injectData.level,
    create_time: Time.now(),
  };

  CategoryAPI.add(values)
    .then((result) => {
      if (!result.status) {
        ElMessage.error(result.msg);
        return;
      }

      ElMessage.success("添加成功");
      injectData.pageAdd = false;
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
    v-model="injectData.pageAdd"
    draggable
    @close="close"
    width="600"
    title="添加类别"
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
        <el-button type="primary" @click="add">添加</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
