<script setup>
import "@/assets/admin/css/login.css";
import { User, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useAdminStore } from "@/stores/admin/admin";
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import axios from "axios";

// 初始化
const adminStore = useAdminStore();
const router = useRouter();

// 数据
const data = reactive({
  name: "",
  password: "",
});

// 登录规则
const rules = {
  name: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 2,
      max: 10,
      message: "用户名长度限制 2 - 10 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 12,
      message: "密码长度限制 6 - 12 个字符",
      trigger: "blur",
    },
  ],
};

// 存储 el-form 组件实例的引用
const elFormRef = ref();

// 登录
const login = () => {
  // 校验
  elFormRef.value.validate((valid) => {
    if (!valid) {
      return;
    }

    axios
      .post("http://127.0.0.1:8008/api/adm/login", data)
      .then((response) => {
        if (!response.data.status) {
          ElMessage.error(response.data.msg);
          return;
        }

        // token 解码
        let token = response.data.data.token;
        let [headerBase64, payloadBase64, sign] = token.split(".");
        let paylod = atob(payloadBase64);
        let paylodObj = JSON.parse(paylod);

        // 数据存储至 pinia
        adminStore.save(paylodObj.name, token, paylodObj.expireDate);

        // 跳转至后台
        router.push("/admin");
      })
      .catch((error) => {
        ElMessage.error(error);
      });
  });
};
</script>

<template>
  <div class="login">
    <el-form :model="data" :rules="rules" ref="elFormRef">
      <div class="title">CMS</div>

      <el-form-item prop="name">
        <el-input :prefix-icon="User" v-model="data.name"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          :prefix-icon="Lock"
          show-password
          v-model="data.password"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
