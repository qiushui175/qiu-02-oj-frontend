<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from './layouts/BasicLayout.vue'
import { onMounted } from 'vue'
import '@/access'
import { useRoute } from 'vue-router'

const route = useRoute()

// 预留全局初始化代码块
const doInit = () => {
  console.log('hello 欢迎来到我的项目')
}
onMounted(() => {
  doInit()
})


</script>

<style>
#app {
}
</style>
