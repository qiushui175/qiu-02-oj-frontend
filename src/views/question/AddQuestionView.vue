<template>
  <div id="addQuestionView">
    <h2>创建题目</h2>
  </div>

  <a-form
    :model="form"
    :style="{ width: '800px', margin: '0 auto' }"
    @submit="handleSubmit"
  >
    <!-- 标题 -->
    <a-form-item field="title" label="标题">
      <a-input v-model="form.title" placeholder="请输入标题" />
    </a-form-item>

    <!-- 内容 -->
    <a-form-item field="content" label="题目内容">
      <MdEditor :value="form.content" :handle-change="onContentChange" />
    </a-form-item>

    <!-- 答案 -->
    <a-form-item field="answer" label="答案">
      <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
    </a-form-item>

    <!-- 标签 -->
    <a-form-item field="tags" label="标签">
      <a-input-tag v-model="form.tags" placeholder="请输入标签" allow-clear />
    </a-form-item>

    <!-- 判题配置 -->
    <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
      <a-space direction="vertical" style="min-width: 480px">
        <a-form-item field="judgeConfig.timeLimit" label="时间限制(ms)">
          <a-input-number
            v-model="form.judgeConfig.timeLimit"
            placeholder="请输入时间消耗"
            mode="button"
            size="large"
            min="0"
          />
        </a-form-item>
        <a-form-item field="judgeConfig.memoryLimit" label="内存限制(MB)">
          <a-input-number
            v-model="form.judgeConfig.memoryLimit"
            placeholder="请输入内存限制"
            mode="button"
            size="large"
            min="0"
          />
        </a-form-item>
        <a-form-item field="judgeConfig.stackLimit" label="堆栈限制(KB)">
          <a-input-number
            v-model="form.judgeConfig.stackLimit"
            placeholder="请输入堆栈限制"
            mode="button"
            size="large"
            min="0"
          />
        </a-form-item>
      </a-space>
    </a-form-item>

    <!-- 测试用例 -->
    <a-form-item
      label="测试用例配置"
      :content-flex="false"
      :merge-props="false"
    >
      <a-form-item
        v-for="(judgeCaseItem, index) of form.judgeCase"
        :key="index"
        no-style
      >
        <div class="judge-case-item">
          <a-form-item
            :field="`form.judgeCase[${index}].input`"
            :label="`输入样例-${index + 1}`"
          >
            <a-input
              v-model="judgeCaseItem.input"
              placeholder="请输入测试输入样例"
            />
          </a-form-item>

          <a-form-item
            :field="`form.judgeCase[${index}].output`"
            :label="`输出样例-${index + 1}`"
          >
            <a-input
              v-model="judgeCaseItem.output"
              placeholder="请输入测试输出样例"
            />
          </a-form-item>

          <a-button @click="handleDelete(index)" status="danger">删除</a-button>
        </div>
      </a-form-item>

      <div style="margin-top: 16px; text-align: center">
        <a-button @click="handleAdd()" type="outline" status="success">
          新增测试样例
        </a-button>
      </div>
    </a-form-item>

    <!-- 提交按钮 -->
    <a-form-item style="text-align: center; margin-top: 24px">
      <a-button type="primary" style="min-width: 200px" @click="doSubmit()">
        提交
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import MdEditor from '@/components/MdEditor.vue'
import { Message } from '@arco-design/web-vue'
import { QuestionControllerService } from '@/api'

const form = reactive({
  answer: '',
  content: '',
  judgeCase: [
  {
    input: '',
    output: ''
  }
  ],
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000
  },
  tags: [],
  title: ''
})

const doSubmit = async () => {
  const res = await QuestionControllerService.addQuestionUsingPost(form)
  if (res.code === 0) {
    Message.success('创建成功')
  } else {
    Message.error('创建失败：' + res.message)
  }
}

const handleAdd = () => {
  form.judgeCase.push({
    input: '',
    output: ''
  })
}

const handleDelete = (index: number) => {
  form.judgeCase.splice(index, 1)
}

const handleSubmit = () => {
  console.log('submit')
}

const onContentChange = (value: string) => {
  form.content = value
}

const onAnswerChange = (value: string) => {
  form.answer = value
}
</script>

<style scoped>
#addQuestionView {
  text-align: center;
  margin-bottom: 24px;
}

#addQuestionView h2 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.a-form-item-label {
  width: 120px; /* 统一 label 宽度 */
  font-weight: 500;
}

.a-input,
.a-input-number,
.a-input-tag {
  border-radius: 6px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.judge-case-item {
  border: 1px solid #eee;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
}

.judge-case-item .a-button {
  position: absolute;
  top: 16px;
  right: 16px;
}
</style>
