<script setup lang="ts">

</script>

<template>
  <div id="user-layout">
    <a-layout style="min-height: 100vh;">
      <a-layout-content class="content"><router-view /></a-layout-content>
      <a-layout-footer class="footer">秋水OJ平台 @ by qiu</a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#user-layout .header {
  /* margin-bottom: 16px; */
  box-shadow: #eee 1px 1px 5px;
}

#user-layout .content {

  background: linear-gradient(to right, #eee, #fff);
  padding: 20px;
}

#user-layout .footer {
  background: #efefef;
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  
}
</style>
