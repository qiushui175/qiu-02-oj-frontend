<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue';

</script>

<template>
  <div id="basic-layout">
    <a-layout style="height: 400px">
      <a-layout-header class="header"><GlobalHeader /></a-layout-header>
      <a-layout-content class="content"><router-view /></a-layout-content>
      <a-layout-footer class="footer">秋水OJ平台 @ by qiu</a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basic-layout .header {
  margin-bottom: 16px;
}

#basic-layout .content {

  background: linear-gradient(to right, #eee, #fff);
  margin-bottom: 16px;
}

#basic-layout .footer {
  background: #efefef;
  padding: 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  
}
</style>
