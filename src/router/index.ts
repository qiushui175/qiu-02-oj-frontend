import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BasePage from "@/views/BasePage.vue";
import AdminView from "@/views/AdminView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import EditQuestionView from "@/views/question/EditQuestionView.vue";

// 扩展 RouteMeta 接口以包含我们的自定义属性
declare module 'vue-router' {
  interface RouteMeta {
    isMenu?: boolean; // 标记是否为菜单项
    title?: string; // 菜单项显示的标题
    access?: string; // 用户权限校验项
  }
}

const routes: Array<RouteRecordRaw> = [

  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
  },

  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      isMenu: true,
      title: '主页',
    },
  },

  {
    path: "/base",
    name: "base",
    component: BasePage,
    meta: {
      isMenu: true,
      title: '测试页',
    },
  },

  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    meta: {
      isMenu: true,
      title: '管理员页面',
      access: ACCESS_ENUM.ADMIN
    },
  },

  {
    path: "/question/add",
    name: "addQuestion",
    component: AddQuestionView,
    meta: {
      isMenu: true,
      title: '题目添加页面',
      access: ACCESS_ENUM.ADMIN
    },
  },

  {
    path: "/question/edit/:id",
    name: "editQuestion",
    component: EditQuestionView,
    meta: {
      title: '题目编辑页面',
    },
  },

  {
    path: "/question/management",
    name: "questionManagement",
    component: ManageQuestionView,
    meta: {
      isMenu: true,
      title: '题目管理页面',
      access: ACCESS_ENUM.ADMIN
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
