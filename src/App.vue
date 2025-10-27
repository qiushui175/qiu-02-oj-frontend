<template>
  <div id="app">
    <BasicLayout></BasicLayout>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from './layouts/BasicLayout.vue'
import { onMounted } from 'vue'
import '@/access'

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
