<template>
  <Editor :value="props.value" :plugins="plugins" @change="props.handleChange" />
</template>

<script lang="ts" setup>
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import { Editor, Viewer } from '@bytemd/vue-next'
import { ref, withDefaults, defineProps } from 'vue'

interface Props {
  value: string
  handleChange: (v: string) => void
}
const props = withDefaults(defineProps<Props>(), {
  value: '',
  handleChange: (v: string) => {
    console.log(v)
  }
})

const plugins = [
  gfm(),
  highlight()
  // Add more plugins here
]

// const value = ref("")
// const handleChange = (v: string) =>{
//   value.value = v
// }
</script>
