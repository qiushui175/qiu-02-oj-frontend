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

// 全局权限管理
const router = useRouter()
const store = useStore()

router.beforeEach((to, from, next) => {
  if(checkAccess(store.state.user?.loginUser, to.meta.access)) next()
  next("/noAuth")
})
</script>

<style>
#app {
}
</style>
