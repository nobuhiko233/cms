<script setup>
import { onMounted, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useNavStore } from "@/stores/admin/nav";
import NavAPI from "@/api/NavAPI";
import NavAdd from "@/components/admin/nav/NavAdd.vue";
import NavEdit from "@/components/admin/nav/NavEdit.vue";

// 初始化
const route = useRoute();
const navStore = useNavStore();

// 参数
let parentId = route.query.parent_id;

// 挂载后获取列表
onMounted(() => {
  funcGetList();
});

// parent_id 更新后重新获取列表
onUpdated(() => {
  if (parentId !== route.query.parent_id) {
    parentId = route.query.parent_id;
    funcGetList();
  }
});

// 打开添加弹窗
const pageAdd = () => {
  navStore.data.pageAdd = true;
};

// 打开编辑弹窗
const pageEdit = (row) => {
  navStore.data.id = row.id;
  navStore.data.pageEdit = true;
};

// 删除
const del = async (row) => {
  try {
    // 提示
    await ElMessageBox.confirm("确定删除？", "标题", {
      type: "warning",
    });

    // 删除
    let delResult = await NavAPI.del(String(row.id));
    if (!delResult.status) {
      ElMessage.error(delResult.msg);
      return;
    }

    ElMessage.success("删除成功");

    // 重新获取列表
    let getListResult = await NavAPI.getListByParentId(parentId);
    if (getListResult.data == null) {
      navStore.listData.list = [];
      return;
    }
    if (!getListResult.status) {
      ElMessage.error(getListResult.msg);
      return;
    }

    navStore.listData.list = getListResult.data.list;
  } catch (error) {
    ElMessage.error(error);
  }
};

// 获取列表
const funcGetList = () => {
  NavAPI.getListByParentId(parentId)
    .then((result) => {
      if (!result.status) {
        ElMessage.error(result.msg);
        return;
      }

      navStore.listData.path = result.data.path;
      navStore.listData.list = result.data.list;

      navStore.update(navStore.listData.path, parentId);
    })
    .catch((error) => {
      console.log(error);
    });
};

// 日期格式化
const funcFormatDate = (time) => {
  // 截取前 10 个字符
  return time.slice(0, 10);
};
</script>

<template>
  <NavAdd />
  <NavEdit />

  <!-- 面包屑 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      :to="{ path: '/admin/nav/list', query: { parent_id: 0 } }"
    >
      <el-icon><House /></el-icon>
    </el-breadcrumb-item>

    <el-breadcrumb-item
      v-for="value in navStore.listData.path"
      :to="{ path: '/admin/nav/list', query: { parent_id: value.id } }"
      :key="value.id"
    >
      {{ value.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 按钮 -->
  <el-button type="primary" @click="pageAdd">添加导航</el-button>

  <!-- 表格 -->
  <el-table :data="navStore.listData.list" border>
    <el-table-column prop="id" label="ID" width="60" />

    <el-table-column prop="name" label="名称" width="100">
      <template #default="scope">
        <router-link
          :to="{ path: '/admin/nav/list', query: { parent_id: scope.row.id } }"
          class="blue"
        >
          {{ scope.row.name }}
        </router-link>
      </template>
    </el-table-column>

    <el-table-column prop="icon" label="图标" width="60">
      <template #default="scope">
        <el-icon v-if="scope.row.icon"
          ><component :is="scope.row.icon"
        /></el-icon>
      </template>
    </el-table-column>

    <el-table-column prop="path" label="路径" />

    <el-table-column prop="status" label="状态" width="60">
      <template #default="scope">
        <span v-if="scope.row.status === '1'" class="green">显示</span>
        <span v-else class="orange">隐藏</span>
      </template>
    </el-table-column>

    <el-table-column prop="create_time" label="日期" width="180">
      <template #default="scope">
        {{ funcFormatDate(scope.row.create_time) }}
      </template>
    </el-table-column>

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
