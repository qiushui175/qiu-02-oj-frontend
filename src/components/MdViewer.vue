<template>
  <Viewer :value="props.value" :plugins="plugins" />
</template>

<script lang="ts" setup>
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import { Editor, Viewer } from '@bytemd/vue-next'
import { withDefaults, defineProps } from 'vue'

interface Props {
  value: string,
}
const props = withDefaults(defineProps<Props>(), {
  value: '',
})

const plugins = [
  gfm(),
  highlight()
  // Add more plugins here
]
</script>
