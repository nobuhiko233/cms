<script setup>
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import Axios from "@/utils/Axios";
import Time from "@/utils/Time";

// 数据
const data = reactive({
  name: "",
  password: "",
  email: "",
  gender: "0",
  remark: "",
});

// 添加
const add = () => {
  // 校验
  if (data.name == "") {
    ElMessage.error("请填写姓名");
    return;
  }

  if (data.password == "") {
    ElMessage.error("请填写密码");
    return;
  }

  data.create_time = Time.now();

  Axios.post("/api/adm/add", data)
    .then((result) => {
      if (!result.status) {
        ElMessage.error(result.msg);
        return;
      }

      ElMessage.success("添加成功");
    })
    .catch((error) => {
      ElMessage.error(error);
    });
};

// 重置
const reset = () => {
  data.name = "";
  data.password = "";
  data.email = "";
  data.gender = "0";
  data.remark = "";
};
</script>

<template>
  <el-form label-width="80" style="width: 400px">
    <el-form-item label="名称">
      <el-input v-model="data.name"></el-input>
    </el-form-item>

    <el-form-item label="密码">
      <el-input v-model="data.password" show-password></el-input>
    </el-form-item>

    <el-form-item label="邮箱">
      <el-input v-model="data.email"></el-input>
    </el-form-item>

    <el-form-item label="备注">
      <el-input type="textarea" v-model="data.remark"></el-input>
    </el-form-item>

    <el-form-item label="性别">
      <el-radio-group v-model="data.gender">
        <el-radio value="0">未知</el-radio>
        <el-radio value="1">男</el-radio>
        <el-radio value="2">女</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="add">添加</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
