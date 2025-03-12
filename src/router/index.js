import { useAdminStore } from "@/stores/admin/admin";
import { createRouter, createWebHistory } from "vue-router";
import { ElMessage } from "element-plus";
import Time from "@/utils/Time";
import Local from "@/utils/Local";

const routes = [
  {
    path: "/", // http://localhost:5173/
    // 根路径重定向
    redirect: "/admin",
  },
  {
    path: "/login", // http://localhost:5173/login
    component: () => import("@/views/admin/login.vue"),
  },
  {
    path: "/admin", // http://localhost:5173/admin
    component: () => import("@/views/admin/home.vue"),
    // 需要身份验证
    meta: { requireAuth: true },
    children: [
      // 管理员
      {
        path: "administrator/add", // http://localhost:5173/admin/administrator/add
        component: () => import("@/views/admin/administrator/add.vue"),
      },
      {
        path: "administrator/edit", // http://localhost:5173/admin/administrator/edit
        component: () => import("@/views/admin/administrator/edit.vue"),
      },
      {
        path: "administrator/list", // http://localhost:5173/admin/administrator/list
        component: () => import("@/views/admin/administrator/list.vue"),
      },
      // 类别管理
      {
        path: "category/list", // http://localhost:5173/admin/category/list
        component: () => import("@/views/admin/category/list.vue"),
      },
      // 文章管理
      {
        path: "article/list", // http://localhost:5173/admin/article/list
        component: () => import("@/views/admin/article/list.vue"),
      },
      {
        path: "article/add", // http://localhost:5173/admin/article/add
        component: () => import("@/views/admin/article/add.vue"),
      },
      {
        path: "article/edit", // http://localhost:5173/admin/article/edit
        component: () => import("@/views/admin/article/edit.vue"),
      },
      // 导航管理
      {
        path: "nav/list", // http://localhost:5173/admin/nav/list
        component: () => import("@/views/admin/nav/list.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 身份验证
  if (to.meta.requireAuth) {
    // 登陆验证
    const adminStore = useAdminStore();
    if (adminStore.data.token === "") {
      ElMessage.error("未登录");
      router.push("/login");
    }

    // 过期验证
    let startTime = Time.now();
    let endTime = adminStore.data.expireDate;
    let timeSubResult = Time.timeSub(startTime, endTime);
    if (timeSubResult.expire) {
      ElMessage.error("登录已过期，请重新登录");
      Local.remove("admin");
      router.push("/login");
    }
  }
  next();
});

export default router;
