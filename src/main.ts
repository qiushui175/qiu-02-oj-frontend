import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";

import 'bytemd/dist/index.css'
import '@/plugins/axios'

// main.ts 或 main.js
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason &&
    event.reason.message &&
    event.reason.message.includes('ResizeObserver loop')
  ) {
    event.preventDefault();
    console.warn('ResizeObserver warning suppressed');
  }
});
const resizeObserverErrHandler = (err: any) => {
  if (err.message.includes('ResizeObserver')) return;
  console.error(err);
};
window.addEventListener('error', resizeObserverErrHandler);


createApp(App).use(store).use(ArcoVue).use(router).mount("#app");
