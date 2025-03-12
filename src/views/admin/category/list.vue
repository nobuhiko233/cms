<script setup>
import { reactive, watchEffect, provide } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import CategoryAPI from "@/api/CategoryAPI";
import CategoryAdd from "@/components/admin/category/CategoryAdd.vue";
import CategoryEdit from "@/components/admin/category/CategoryEdit.vue";

// 初始化
const route = useRoute();

// 数据
const data = reactive({
  path: [],
  list: [],
});

// 参数
let parentId = route.query.parent_id;

// 向子孙组件提供数据
const provideData = reactive({
  id: 0,
  level: 1,
  parentId,
  pageAdd: false,
  pageEdit: false,
});

provide("provideData", provideData);

// 向子孙组件提供方法
const provideFuncGetList = () => {
  CategoryAPI.getListByParentId(parentId)
    .then((result) => {
      if (!result.status) {
        ElMessage.error(result.msg);
        return;
      }

      data.path = result.data.path;
      data.list = result.data.list;
    })
    .catch((error) => {
      ElMessage.error(error);
    });
};

provide("provideFuncGetList", provideFuncGetList);

// 自动侦听器
watchEffect(() => {
  // 更新 parent_id
  let parentId = route.query.parent_id;

  // 重新获取列表
  CategoryAPI.getListByParentId(parentId)
    .then((result) => {
      if (!result.status) {
        ElMessage.error(result.msg);
        return;
      }

      data.path = result.data.path;
      data.list = result.data.list;

      // 更新 provideData
      if (data.path === null) {
        provideData.level = 1;
      } else {
        provideData.level = data.path.length + 1;
      }
      provideData.parentId = parentId;
    })
    .catch((error) => {
      ElMessage.error(error);
    });
});

// 删除
const del = async (row) => {
  try {
    // 提示
    await ElMessageBox.confirm("确定删除？", "标题", {
      type: "warning",
    });

    // 删除
    let delResult = await CategoryAPI.del(String(row.id));
    if (!delResult.status) {
      ElMessage.error(delResult.msg);
      return;
    }

    // 重新获取列表
    let getListResult = await CategoryAPI.getListByParentId(parentId);
    if (!getListResult.status) {
      ElMessage.error(getListResult.msg);
      return;
    }
    data.list = getListResult.data.list;
  } catch (error) {
    ElMessage.error(error);
  }
};

// 打开添加类别弹窗
const pageAdd = () => {
  provideData.pageAdd = true;
};

// 打开编辑类别弹窗
const pageEdit = (row) => {
  provideData.pageEdit = true;
  provideData.id = row.id;
};
</script>

<template>
  <!-- 添加类别弹窗 -->
  <CategoryAdd />

  <!-- 编辑类别弹窗 -->
  <CategoryEdit />

  <!-- 面包屑 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      :to="{ path: '/admin/category/list', query: { parent_id: 0 } }"
    >
      <el-icon><House /></el-icon
    ></el-breadcrumb-item>

    <el-breadcrumb-item
      v-for="value in data.path"
      :key="value.id"
      :to="{ path: '/admin/category/list', query: { parent_id: value.id } }"
    >
      {{ value.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 按钮 -->
  <el-button type="primary" size="small" @click="pageAdd">添加类别</el-button>

  <!-- 表格 -->
  <el-table :data="data.list" border>
    <el-table-column prop="id" label="ID" width="80"></el-table-column>

    <el-table-column prop="name" label="名称">
      <template #default="scope">
        <router-link
          :to="{
            path: '/admin/category/list',
            query: { parent_id: scope.row.id },
          }"
          class="bule"
          >{{ scope.row.name }}</router-link
        >
      </template>
    </el-table-column>

    <el-table-column prop="status" label="状态" width="80">
      <template #default="scope">
        <span v-if="scope.row.status === '1'" class="green">显示</span>
        <span v-else class="orange">隐藏</span>
      </template>
    </el-table-column>

    <el-table-column
      prop="create_time"
      label="日期"
      width="200"
    ></el-table-column>

    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button size="small" type="primary" @click="pageEdit(scope.row)"
          >编辑</el-button
        >
        <el-button size="small" @click="del(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped></style>
