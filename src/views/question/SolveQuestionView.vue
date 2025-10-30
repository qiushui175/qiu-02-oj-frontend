<template>
  <div id="solveQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <!-- <a-tabs default-active-key="question">
          <a-tab-pane key="question" tab="题目" style="width: 100%;">
            <MdViewer :value="questionVO?.content || ''" />
          </a-tab-pane>
          <a-tab-pane key="comment" tab="评论">
            评论
          </a-tab-pane>
          <a-tab-pane key="answer" tab="答案">
            答案
          </a-tab-pane>
        </a-tabs> -->

        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card :title="questionVO?.title || ''">
              <MdViewer :value="questionVO?.content || ''" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="value in questionVO?.tags || []"
                    color="blue"
                    :key="value"
                  >
                    {{ value }}
                  </a-tag>
                </a-space>
              </template>

              <a-divider :margin="20"><icon-star /></a-divider>
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ questionVO?.judgeConfig?.timeLimit || '' }} ms
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ questionVO?.judgeConfig?.memoryLimit || '' }} MB
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ questionVO?.judgeConfig?.stackLimit || '' }} KB
                </a-descriptions-item>
              </a-descriptions>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论" disabled>
            暂时无法查看评论
          </a-tab-pane>
          <a-tab-pane key="answer" title="答案"> 暂时无法查看答案 </a-tab-pane>
        </a-tabs>
      </a-col>

      <a-col :md="12" :xs="24">
        <div class="editor-container">
          <a-form :model="codeForm" layout="inline">
            <a-form-item
              field="title"
              label="编程语言"
              style="min-width: 240px"
            >
              <a-select
                v-model="codeForm.language"
                :style="{ width: '300px' }"
                placeholder="请选择编程语言"
              >
                <a-option>java</a-option>
                <a-option>cpp</a-option>
                <a-option>go</a-option>
                <a-option>html</a-option>
              </a-select>
            </a-form-item>
          </a-form>

          <CodeEditor v-model="code" :language="codeForm.language" theme="vs-light" />
          <a-divider :margin="15"><icon-star /></a-divider>
          <a-button type="primary" @click="submitAnswer" :style="{ width: '200px' , height: '45px' }">提交</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { QuestionControllerService, QuestionSubmitControllerService, QuestionVO } from '@/api'
import CodeEditor from '@/components/CodeEditor.vue'
import MdViewer from '@/components/MdViewer.vue'
import { Message } from '@arco-design/web-vue'
import { languages } from 'monaco-editor/esm/metadata'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// 获取当前路由对象
const route = useRoute()

// 拿到动态参数 id
const id = route.params.id

// 拿到具体的题目信息
const questionVO = ref<QuestionVO | null>(null)
const getQuestion = async (id: string) => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    id as any
  )
  if (res.code === 0 && res.data) {
    questionVO.value = res.data as QuestionVO
  } else {
    Message.error('获取题目信息失败')
  }
}

// 自动加载题目信息
onMounted(() => {
  getQuestion(id as any)
})
watch(
  () => id,
  async () => {
    await getQuestion(id as any)
  }
)

const code = ref('')

const codeForm = reactive({
  language: 'java'
})

const submitAnswer = async () => {
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    code: code.value,
    language: codeForm.language,
    questionId: id as any,
  })

  if (res.code === 0) {
    Message.success('提交成功')
  } else {
    Message.error('提交失败')
  }
}
</script>

<style scoped>
#solveQuestionView {
  max-width: 1700px;
  margin: 0 auto;
}

.editor-container {
  padding-top: 56px;
}
</style>
