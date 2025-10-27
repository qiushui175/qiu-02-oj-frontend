<template>
  <div id="app">
    <BasicLayout></BasicLayout>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import BasicLayout from './layouts/BasicLayout.vue'
import { useStore } from 'vuex'

// 全局权限管理
const router = useRouter()
const store = useStore()

router.beforeEach((to, from, next) => {
  if (to.meta?.access === 'canAdmin') {
    if (store.state.user?.loginUser?.role !== 'admin') {
      // TODO 添加无权限页面
      next("/noAuth")
      return
    }
  }

  next()
})
</script>

<style>
#app {
}
</style>
