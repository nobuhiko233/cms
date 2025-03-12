<script setup>
import { useAdminStore } from "@/stores/admin/admin";
import { useRouter } from "vue-router";
import Local from "@/utils/Local";

// 初始化
const adminStore = useAdminStore();
const router = useRouter();

// 登出
const logout = () => {
  Local.remove("admin");

  router.push("/login");
};
</script>

<template>
  <div class="header">
    <div class="title">
      <div class="logo">
        <el-icon><MostlyCloudy /></el-icon>
      </div>
      <div class="text">
        <a href="/admin">CMS</a>
      </div>
    </div>

    <div class="info">
      <div class="admin">
        <div class="name">
          <span>{{ adminStore.data.name }}</span
          ><el-icon><Bell /></el-icon>
        </div>

        <div class="logout" @click="logout">退出</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
