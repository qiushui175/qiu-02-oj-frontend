<template>
  <div id="global-header">
    <a-row
      class="global-header-grid"
      style="margin-bottom: 16px"
      align="center"
      :warp="false"
    >
      <a-col flex="auto">
        <a-menu
          mode="horizontal"
          :default-selected-keys="['1']"
          :selected-keys="selectedKeys"
        >
          <!-- logo和名称 -->
          <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div class="title-bar">
              <img class="logo" src="../assets/qiu-logo.png" />
              <div class="title">秋水OJ</div>
            </div>
          </a-menu-item>

          <!-- 菜单栏 -->
          <a-menu-item
            v-for="routeItem in menuRoutes"
            :key="routeItem.path"
            @click="handleMenuClick(routeItem.path)"
          >
            {{ routeItem.meta?.title || routeItem.name }}
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col flex="120px" v-if="!isLogin">
        <a-button type="primary" @click="handleLoginOrRegister"
          >登录/注册</a-button
        >
      </a-col>
      <!-- <a-col flex="100px">
        <div>{{ store.state.user?.loginUser?.userName ?? '未登录' }}</div>
      </a-col> -->

      <!-- 用户名区域：替换原有div为下拉菜单 -->
      <a-col flex="120px" style="text-align: left">
        <!-- 已登录：显示用户名 + 下拉菜单 -->
        <a-dropdown
          v-if="isLogin"
          trigger="hover"
          placement="bottomRight"
          @select="handleDropdownSelect"
        >
          <!-- 触发元素：用户名（必须用 a-dropdown-item 或直接嵌套元素） -->
          <span class="username-trigger" style="cursor: pointer">
            {{ store.state.user?.loginUser?.userName }}
          </span>

          <!-- 下拉菜单内容 -->
          <template #content>
            <a-menu>
              <a-menu-item @click="handleDropdownSelect('logout')"
                >退出登录</a-menu-item
              >
            </a-menu>
          </template>
        </a-dropdown>

        <!-- 未登录：显示默认文本 -->
        <span v-else>未登录</span>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import checkAccess from '@/access/checkAccess'
import router from '@/router'
import { Message } from '@arco-design/web-vue'
import { computed, onMounted, ref, watch } from 'vue'
import { RouteLocationRaw, useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

interface MenuItem {
  path: string
  name: string
  meta?: {
    isMenu?: boolean
    title?: string
    access?: string
  }
  // 简化后的类型，实际可能包含更多字段
}

const vueRouter = useRouter()
const vueRoute = useRoute()

const store = useStore()
const loginUser = computed(() => store.state.user?.loginUser)
const isLogin = computed(() => store.getters['user/isLogin'])

// 1. 从路由文件中动态读取菜单项
// 过滤出所有 meta 中 isMenu: true 的路由
const menuRoutes = computed<MenuItem[]>(() => {
  // 访问路由实例的 options.routes 来获取完整的路由配置
  // 在 Vue 3/Vue Router 4 中，直接使用 router.options.routes 即可
  const user = loginUser.value
  return (router.options.routes as unknown as MenuItem[]).filter(
    (route: MenuItem) =>
      route.meta?.isMenu && checkAccess(user, route.meta?.access)
  )
})

// 3. 动态读取当前路径匹配菜单项进行高亮
const selectedKeys = ref<string[]>([])

// 监听路由变化，更新高亮状态
const updateSelectedKeys = (currentRoutePath: string) => {
  // 查找当前路由 path 是否在菜单路由中。
  // 注意：这里简单地使用 path 作为 key。对于嵌套路由，可能需要更复杂的逻辑，
  // 例如使用 vueRoute.matched 来找到最顶层的匹配菜单项。

  const matchedMenu = menuRoutes.value.find(
    (item) => item.path === currentRoutePath
  )

  if (matchedMenu) {
    selectedKeys.value = [matchedMenu.path]
  } else {
    // 如果当前路由不在菜单项中（例如详情页），则清空高亮或采用默认逻辑
    selectedKeys.value = []
  }
}

// 初始设置
onMounted(() => {
  updateSelectedKeys(vueRoute.path)
})

// 监听路由对象的变化
watch(
  () => vueRoute.path,
  (newPath) => {
    updateSelectedKeys(newPath)
  }
)
watch(menuRoutes, () => {
  updateSelectedKeys(vueRoute.path)
})

// 2. 点击对应菜单跳转
const handleMenuClick = (key: string) => {
  // key 被设置为路由的 path
  const path = key

  // 避免点击 logo/title 部分（key='0'）时跳转
  if (path !== '0') {
    vueRouter.push(path as RouteLocationRaw)
  }
}

// 登录测试代码 请注释
// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     userName: "qiushui",
//     userRole: ACCESS_ENUM.ADMIN
//   })
// }, 3000);

const handleLoginOrRegister = () => {
  vueRouter.push('/user/login')
}
// 其他已有代码不变，添加下拉菜单选择事件
const handleDropdownSelect = (key: string) => {
  if (key === 'logout') {
    console.log('logout')
    handleLogout() // 调用退出登录逻辑
  }
}

// 退出登录逻辑（完善版）
const handleLogout = async () => {
  try {
    // 1. 调用后端退出接口（如有）
    // await UserControllerService.logout();

    // 2. 重置用户状态
    store.commit('user/resetUser')

    // 3. 清除Token（如有）
    localStorage.removeItem('token')

    // 4. 提示并跳转
    Message.success('退出登录成功')
    vueRouter.push('/user/login')
  } catch (error) {
    Message.error('退出失败，请重试')
  }
}
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 12px;
}

.logo {
  height: 50px;
}
</style>
