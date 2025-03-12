<script setup>
import { onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import NavAPI from "@/api/NavAPI";

// 数据
const data = reactive({
  list: [],
});

// 挂载后获取列表
onMounted(() => {
  NavAPI.getAll()
    .then((result) => {
      if (!result.status) {
        ElMessage.error(result.msg);
        return;
      }

      data.list = result.data;
    })
    .catch((error) => {
      console.log(errors);
    });
});
</script>

<template>
  <div class="side">
    <el-menu
      router
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <template v-for="item in data.list">
        <!-- 不包含子菜单, 则为一级菜单 -->
        <el-menu-item v-if="item.children === null" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon> {{ item.name }}
        </el-menu-item>

        <!-- 包含子菜单, 则为二级菜单 -->
        <el-sub-menu v-else :index="item.path">
          <template #title>
            <el-icon><component :is="item.icon" /></el-icon> {{ item.name }}
          </template>

          <el-menu-item-group>
            <template v-for="childrenItem in item.children">
              <el-menu-item :index="childrenItem.path">{{
                childrenItem.name
              }}</el-menu-item>
            </template>
          </el-menu-item-group>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<style scoped></style>
