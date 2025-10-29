<template>
  <div ref="editorContainer" class="editor-container"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps } from 'vue'
import * as monaco from 'monaco-editor'
import loader from '@monaco-editor/loader'

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

onMounted(async () => {
  const monacoInstance = await loader.init()

  editorInstance = monacoInstance.editor.create(editorContainer.value!, {
    value: props.modelValue || '',
    language: props.language || 'javascript',
    theme: props.theme || 'vs-light',
    automaticLayout: true,
    readOnly: props.readOnly || false,
    minimap: { enabled: true },
    fontSize: 14,
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