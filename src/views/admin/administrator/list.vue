<script setup>
import { reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Axios from "@/utils/Axios";

// 初始化
const router = useRouter();

// 数据
const data = reactive({
  list: [],
});

// 挂载后获取列表
onMounted(() => {
  Axios.get("/api/adm/list")
    .then((result) => {
      if (!result.status) {
        ElMessage.error(result.msg);
        return;
      }

      data.list = result.data.list;
    })
    .catch((error) => {
      ElMessage.error(error);
    });
});

// 编辑
const edit = (row) => {
  router.push({ path: "/admin/administrator/edit", query: { id: row.id } });
};

// 删除
const del = async (row) => {
  try {
    // 提示
    await ElMessageBox.confirm("确定删除？", "标题", {
      type: "warning",
    });

    // 删除
    let delResult = await Axios.post("/api/adm/del", { id: String(row.id) });
    if (!delResult.status) {
      ElMessage.error(delResult.msg);
      return;
    }

    // 重新获取列表
    let getListResult = await Axios.get("/api/adm/list");
    if (!getListResult.status) {
      ElMessage.error(getListResult.msg);
      return;
    }
    data.list = getListResult.data.list;
  } catch (error) {
    ElMessage.error(error);
  }
};
</script>

<template>
  <el-table :data="data.list" border>
    <el-table-column prop="id" label="ID" width="60"></el-table-column>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column prop="email" label="邮箱"></el-table-column>
    <el-table-column prop="remark" label="备注"></el-table-column>

    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button size="small" type="primary" @click="edit(scope.row)"
          >编辑</el-button
        >
        <el-button size="small" @click="del(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped></style>
