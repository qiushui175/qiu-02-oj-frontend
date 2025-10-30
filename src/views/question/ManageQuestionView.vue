<template>
  <div id="manageQuestionView">
    <div class="page-header">
      <h2>题目管理</h2>
      <div class="header-actions">
        <!-- 可添加新增按钮等操作 -->
        <!-- <a-button type="primary" @click="goAdd">新增题目</a-button> -->
      </div>
    </div>

    <div class="table-container">
      <a-table
        :columns="columns"
        :data="dataList"
        :pagination="paginationConfig"
        row-key="id"
        :bordered="true"
        :scroll="{ x: 1600 }"
        class="question-table"
        @page-change="onPageChange"
        >
        <template #tags="{ record }">
          <a-space size="small" wrap>
            <template v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">
              <a-tag>{{ tag }}</a-tag>
            </template>
          </a-space>
        </template>

        <template #judgeConfig="{ record }">
          <a-space size="small" wrap>
            <template v-if="record.judgeConfig">
              <a-tag color="arcoblue"
                >时间限制：{{ getParsedConfig(record).timeLimit }} ms</a-tag
              >
              <a-tag color="green"
                >内存限制：{{ getParsedConfig(record).memoryLimit }} MB</a-tag
              >
              <a-tag color="orange"
                >栈限制：{{ getParsedConfig(record).stackLimit }} KB</a-tag
              >
            </template>
            <template v-else>
              <a-tag color="gray">无配置</a-tag>
            </template>
          </a-space>
        </template>

        <template #judgeCase="{ record }">
          <div class="judge-case-list">
            <template v-if="record.judgeCase">
              <template
                v-for="(item, index) in getFirstCase(record.judgeCase)"
                :key="index"
              >
                <div class="case-item">
                  <a-tag color="arcoblue">输入：{{ item.input || '无' }}</a-tag>
                  <a-tag color="green">输出：{{ item.output || '无' }}</a-tag>
                </div>
              </template>

              <!-- 如果有多个用例，显示“查看全部”按钮 -->
              <a-button
                v-if="hasMoreCases(record.judgeCase)"
                type="text"
                size="small"
                @click="showAllCases(record)"
              >
                查看全部
              </a-button>
            </template>

            <template v-else>
              <a-tag color="gray">无用例</a-tag>
            </template>
          </div>

          <!-- 弹窗显示所有用例 -->
          <a-modal
            v-model:visible="caseModalVisible"
            title="判题用例"
            width="600px"
            :footer="false"
          >
            <div v-if="selectedCases.length">
              <div
                v-for="(item, index) in selectedCases"
                :key="index"
                class="case-item"
              >
                <a-tag color="arcoblue">输入：{{ item.input || '无' }}</a-tag>
                <a-tag color="green">输出：{{ item.output || '无' }}</a-tag>
              </div>
            </div>
            <div v-else>
              <a-tag color="gray">无有效用例</a-tag>
            </div>
          </a-modal>
        </template>

        <template #optional="{ record }">
          <a-space size="small" wrap class="judge-config-space">
            <a-button type="primary" @click="doUpdate(record)" size="small"
              >修改</a-button
            >
            <a-popconfirm
              content="确定要删除吗?"
              okText="确定"
              cancelText="取消"
              @ok="() => doDelete(record)"
            >
              <a-button status="danger">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue'
import { Question, QuestionControllerService } from '@/api'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'

function getParsedConfig(record: any) {
  try {
    return JSON.parse(record.judgeConfig || '{}')
  } catch {
    return {}
  }
}

const router = useRouter()
const dataList = ref<Question[]>([])
const total = ref(0)
const searchParams = ref({
  pageSize: 10,
  current: 1
})

// 分页配置单独提取
const paginationConfig = ref({
  pageSize: searchParams.value.pageSize,
  current: searchParams.value.current,
  total: total.value,
  showTotal: true,
})

const loadData = async () => {
  try {
    const res = await QuestionControllerService.listQuestionByPageUsingPost(
      searchParams.value
    )
    if (res.code === 0) {
      dataList.value = res.data.records
      total.value = Number(res.data.total)
      // 同步更新分页总数
      paginationConfig.value.total = Number(res.data.total)
    } else {
      Message.error('加载失败：' + res.message)
    }
  } catch (error) {
    Message.error('加载数据异常：' + error)
  }
}

onMounted(() => {
  loadData()
})

const doDelete = async (question: Question) => {
  console.log('doDelete', question)
  try {
    const res = await QuestionControllerService.deleteQuestionUsingPost({
      id: question.id
    })
    if (res.code === 0) {
      Message.success('删除成功')
      loadData()
    } else {
      Message.error('删除失败：' + res.message)
    }
  } catch (error) {
    Message.error('删除异常：' + error)
  }
}

const doUpdate = (question: Question) => {
  router.push({
    path: `edit/${question.id}`
  })
}

// 列配置（已设置初始宽度，可根据需要调整）
const columns = [
  { title: 'ID', dataIndex: 'id', width: 120 },
  { title: '标题', dataIndex: 'title', ellipsis: true, width: 100 },
  { title: '内容', dataIndex: 'content', ellipsis: true, width: 250 },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 120,
    slotName: 'tags'
    // customRender: ({ record }: { record: Question }) => {
    //   const arr = JSON.parse(record.tags || '[]')
    //   return arr.map((t: string) => `<a-tag>${t}</a-tag>`).join(' ')
    // }
  },
  { title: '答案', dataIndex: 'answer', ellipsis: true, width: 200 },
  { title: '提交数', dataIndex: 'submitNum', width: 90 },
  { title: '通过数', dataIndex: 'acceptedNum', width: 90 },
  {
    title: '判题配置',
    dataIndex: 'judgeConfig',
    ellipsis: true,
    width: 180,
    slotName: 'judgeConfig'
  },
  { title: '判题用例', dataIndex: 'judgeCase', ellipsis: true, width: 180, slotName: 'judgeCase' },
  { title: '用户ID', dataIndex: 'userId', width: 90 },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 160,
    customRender: ({ record }: { record: Question }) =>
      record.createTime ? new Date(record.createTime).toLocaleString() : ''
  },
  { title: '操作', slotName: 'optional', width: 180 }
]

// 弹窗状态与选中数据
const caseModalVisible = ref(false)
const selectedCases = ref<any[]>([])

// 安全解析 JSON
function parseCases(value: string) {
  try {
    return JSON.parse(value || '[]')
  } catch {
    return []
  }
}

// 只取第一个用例
function getFirstCase(value: string) {
  const cases = parseCases(value)
  return cases.length > 0 ? [cases[0]] : []
}

// 判断是否还有更多
function hasMoreCases(value: string) {
  const cases = parseCases(value)
  return cases.length > 1
}

// 弹窗显示全部
function showAllCases(record: any) {
  selectedCases.value = parseCases(record.judgeCase)
  caseModalVisible.value = true
}


// 页面切换
const onPageChange = (page: number)=>{
  searchParams.value = {
    ...searchParams.value,
    current: page
  }
  // 同步更新分页组件的当前页（关键修正）
  paginationConfig.value.current = page;
}

watch(
  () => searchParams.value, // 监听searchParams的变化
  () => {
    loadData(); // 只有当搜索参数变化时才重新加载数据
  },
  { immediate: false } // 初始化时立即执行一次（等效于onMounted中的loadData）
);
</script>

<style scoped>
#manageQuestionView {
  padding: 24px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 页头样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e6eb;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 表格容器样式 */
.table-container {
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* 表格样式优化 */
.question-table {
  --table-header-bg: #f7f8fa;
  --table-header-color: #4e5969;
  --table-row-hover-bg: #f7f8fa;
}

/* 表格单元格样式 */
.a-table .a-table-cell {
  word-break: break-word;
  padding: 12px 16px;
  font-size: 14px;
}

/* 表头样式 */
.a-table-thead .a-table-cell {
  font-weight: 500;
  border-bottom: 1px solid #e5e6eb;
}

/* 表格行分隔线 */
.a-table-tbody .a-table-row {
  border-bottom: 1px solid #f2f3f5;
}

/* 操作列按钮间距 */
:deep(.a-space) {
  width: 100%;
  justify-content: center;
}

/* 标签样式优化 */
:deep(.a-tag) {
  margin-right: 4px;
  margin-bottom: 4px;
  font-size: 12px;
  padding: 2px 6px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  #manageQuestionView {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

.judge-config-space {
  display: flex;
  flex-wrap: wrap;
  white-space: normal;
  line-height: 1.6;
}

.judge-case-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  white-space: normal;
  word-break: break-all;
}

.case-item {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
