<template>
  <div ref="editorContainer" class="editor-container"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps } from 'vue'
import * as monaco from 'monaco-editor'
import loader from '@monaco-editor/loader'

// 手动加载语言模块
// import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'
// import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution'
// import 'monaco-editor/esm/vs/basic-languages/html/html.contribution'
// import 'monaco-editor/esm/vs/basic-languages/java/java.contribution'

// Props
const props = defineProps<{
  modelValue: string
  language?: string
  theme?: string
  readOnly?: boolean
}>()

// Emit
const emit = defineEmits(['update:modelValue'])

// Refs
const editorContainer = ref<HTMLElement | null>(null)
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null
let monacoInstance: typeof monaco | null = null // 存储初始化后的 monaco 实例

onMounted(async () => {

  monacoInstance = await loader.init()

  editorInstance = monacoInstance.editor.create(editorContainer.value!, {
    value: props.modelValue || '',
    language: props.language || 'javascript',
    theme: props.theme || 'vs-light',
    automaticLayout: true,
    readOnly: props.readOnly || false,
    minimap: { enabled: true },
    fontSize: 18
  })

  // 内容变更 -> 通知父组件
  editorInstance.onDidChangeModelContent(() => {
    const value = editorInstance!.getValue()
    emit('update:modelValue', value)
  })
})

// 父组件更新值 -> 更新编辑器
watch(
  () => props.modelValue,
  (newValue) => {
    if (editorInstance && newValue !== editorInstance.getValue()) {
      editorInstance.setValue(newValue)
    }
  }
)

watch(
  () => props.language,
  (newLanguage) => {
    // 确保 monaco 实例、编辑器实例、新语言都存在
    if (monacoInstance && editorInstance && newLanguage) {
      const model = editorInstance.getModel()
      if (model) {
        // 使用初始化后的 monacoInstance 调用 API
        monacoInstance.editor.setModelLanguage(model, newLanguage)
        editorInstance.layout(); // 刷新布局
      }
    }
  }
)

// 监听主题变化（可选，如需同步主题）
watch(
  () => props.theme,
  (newTheme) => {
    if (monacoInstance && newTheme) {
      monacoInstance.editor.setTheme(newTheme)
    }
  }
)

// 卸载清理
onBeforeUnmount(() => {
  editorInstance?.dispose()
})
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}
</style>
