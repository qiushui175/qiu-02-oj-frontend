<template>
  <div class="home">
    this is home page
    <MdEditor :value="value" :handleChange="handleChange"></MdEditor>
    <CodeEditor v-model="code" language="typescript" theme="vs-light" />
    <div>{{code}}</div>
  </div>
</template>

<script lang="ts" setup>
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue"
import { ref } from "vue";

const value = ref("")
const handleChange = (v: string) =>{
  value.value = v
}

const code = ref(`function hello() {
  console.log("Hello World");
}`)

</script>
