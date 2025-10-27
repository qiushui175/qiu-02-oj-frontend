<template>
  <div id="app">
    <BasicLayout></BasicLayout>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import BasicLayout from './layouts/BasicLayout.vue'
import { useStore } from 'vuex'
import checkAccess from './access/checkAccess'
import { onMounted } from 'vue'

// 预留全局初始化代码块
const doInit = () => {
  console.log('hello 欢迎来到我的项目')
}
onMounted(() => {
  doInit()
})

// 全局权限管理
const router = useRouter()
const store = useStore()

router.beforeEach((to, from, next) => {
  if (checkAccess(store.state.user?.loginUser, to.meta.access)) {
    next()
    return
  }
  next('/noAuth')
})
</script>

<style>
#app {
}
</style>
