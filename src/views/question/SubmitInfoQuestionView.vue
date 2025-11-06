<template>
  <div id="submitInfoQuestionView">
    <div class="page-header">
      <h2>题目提交信息</h2>
    </div>

    <div class="table-container">
      <a-table
        :columns="columns"
        :data="dataList"
        :pagination="paginationConfig"
        row-key="id"
        bordered
        :scroll="{ x: 1200 }"
        @page-change="onPageChange"
      >
        <!-- 判题结果列 -->
        <template #judgeInfo="{ record }">
          <a-tag v-if="record.status === 0" color="orange">
            Wating
          </a-tag>
          <a-tag v-else-if="record.status === 1" color="orange">
            Running
          </a-tag>
          <a-tag v-else :color="getMessageColor(record.judgeInfo?.message)">
            {{ getMessageText(record.judgeInfo?.message) }}
          </a-tag>
        </template>

        <!-- 内存列 -->
        <template #memory="{ record }">
          <span v-if="shouldShowPerformance(record)">
            {{ (record.judgeInfo?.memory / 1024 / 1024).toFixed(2) }} MB
          </span>
        </template>

        <!-- 时间列 -->
        <template #time="{ record }">
          <span v-if="shouldShowPerformance(record)">
            {{ record.judgeInfo?.time }} ms
          </span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { QuestionSubmitControllerService } from '@/api'
import type { QuestionSubmitVO, QuestionSubmitQueryRequest, JudgeInfo } from '@/api'

// ---------- 判题结果映射 ----------
const messageMap: Record<string, { text: string; color: string }> = {
  'Accepted': { text: 'Accepted', color: 'green' },
  'Wrong Answer': { text: 'Wrong Answer', color: 'red' },
  'Compile Error': { text: 'Compile Error', color: 'orange' },
  'Memory Limit Exceeded': { text: 'Memory Limit Exceeded', color: 'orange' },
  'Time Limit Exceeded': { text: 'Time Limit Exceeded', color: 'orange' },
  'Presentation Error': { text: 'Presentation Error', color: 'orange' },
  'Waiting': { text: 'Waiting', color: 'gray' },
  'Output Limit Exceeded': { text: 'Output Limit Exceeded', color: 'orange' },
  'Dangerous Operation': { text: 'Dangerous Operation', color: 'purple' },
  'Runtime Error': { text: 'Runtime Error', color: 'orange' },
  'System Error': { text: 'System Error', color: 'gray' }
}




// 获取标签文字
const getMessageText = (msg?: string) => {
  return messageMap[msg || '']?.text || 'Unknown'
}
// 获取标签颜色
const getMessageColor = (msg?: string) => {
  return messageMap[msg || '']?.color || 'gray'
}

// ---------- 数据 ----------
const dataList = ref<QuestionSubmitVO[]>([])

// ---------- 查询与分页 ----------
const searchParams = reactive<QuestionSubmitQueryRequest>({
  current: 1,
  pageSize: 10,
  sortOrder: 'desc',
  sortField: 'createTime'
})

const paginationConfig = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true
})

// ---------- 表格列 ----------
const columns = [
  { title: '提交ID', dataIndex: 'id', width: 140 },
  { title: '题目ID', dataIndex: 'questionId', width: 140 },
  { title: '语言', dataIndex: 'language', width: 100 },
  { title: '判题结果', dataIndex: 'judgeInfo', slotName: 'judgeInfo', width: 160 },
  { title: '内存', dataIndex: 'memory', slotName: 'memory', width: 120 },
  { title: '时间', dataIndex: 'time', slotName: 'time', width: 120 },
  { title: '用户名', dataIndex: 'userName', width: 160 },
  { title: '用户ID', dataIndex: 'userId', width: 120 },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 200,
    render: ({ record }: { record: QuestionSubmitVO }) =>
      record.createTime ? new Date(record.createTime).toLocaleString() : ''
  }
]

// ---------- 控制性能列显示 ----------
const shouldShowPerformance = (record: QuestionSubmitVO): boolean => {
  const msg = record.judgeInfo?.message
  return msg === 'Accepted' // 只有 Accepted 显示内存和时间
}

// ---------- 数据加载 ----------
const loadData = async () => {
  try {
    const res = await QuestionSubmitControllerService.listQuestionSubmitVoByPageUsingPost(searchParams)
    if (res.code === 0) {
      dataList.value = res.data.records
      paginationConfig.total = Number(res.data.total)
    } else {
      Message.error('加载失败：' + res.message)
    }
  } catch (err) {
    Message.error('请求异常：' + err)
  }
}

// ---------- 分页 ----------
const onPageChange = (page: number) => {
  searchParams.current = page
  paginationConfig.current = page
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
#submitInfoQuestionView {
  padding: 24px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e6eb;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
}

.table-container {
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
</style>
