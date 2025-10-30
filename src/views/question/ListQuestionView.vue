<template>
  <div id="manageQuestionView">
    <div class="page-header">
      <h2>题目列表</h2>
      <div class="header-actions">
        <a-form :model="searchParams" layout="inline" @submit="handleSearch">
          <a-form-item
            field="title"
            label="名称"
          >
            <a-input
              v-model="searchParams.title"
              placeholder="输入要查找的题目名称"
            />
          </a-form-item>

          <a-form-item
            field="tags"
            label="标签"
          >
            <a-input-tag
              v-model="searchParams.tags"
              placeholder="输入要查找的标签"
              style="min-width: 300px;"
            />
          </a-form-item>

          <a-form-item>
            <a-button html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
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
            <template v-for="tag in record.tags" :key="tag">
              <a-tag color="blue">{{ tag }}</a-tag>
            </template>
          </a-space>
        </template>

        <template #acRate="{ record }">
          <a-space>
            {{ getAcRateStr(record.acceptedNum, record.submitNum) }}
          </a-space>
        </template>

        <template #optional="{ record }">
          <a-button type="primary" @click="doSolve(record.id)" size="small"
            >做题</a-button
          >
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { QuestionControllerService, QuestionVO } from '@/api'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const dataList = ref<QuestionVO[]>([])
const total = ref(0)
const searchParams = ref({
  pageSize: 10,
  current: 1,
  title: '',
  tags: [],
})

// 分页配置单独提取
const paginationConfig = ref({
  pageSize: searchParams.value.pageSize,
  current: searchParams.value.current,
  total: total.value,
  showTotal: true
})

const doSolve = (id: number) => {
  router.push({
    path: `/question/solve/${id}`
  })
}

const loadData = async () => {
  try {
    const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
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

// 列配置（已设置初始宽度，可根据需要调整）
const columns = [
  { title: '题号', dataIndex: 'id', width: 120, align: 'center' },
  {
    title: '题目名称',
    dataIndex: 'title',
    ellipsis: true,
    width: 100,
    align: 'center'
  },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 120,
    slotName: 'tags',
    align: 'center'
  },
  { title: '通过率', width: 90, slotName: 'acRate', align: 'center' },
  { title: '操作', slotName: 'optional', width: 180, align: 'center' }
]

// 页面切换
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page
  }
  // 同步更新分页组件的当前页（关键修正）
  paginationConfig.value.current = page
}

watch(
  () => searchParams.value, // 监听searchParams的变化
  () => {
    loadData() // 只有当搜索参数变化时才重新加载数据
  },
  { immediate: false } // 初始化时立即执行一次（等效于onMounted中的loadData）
)

const getAcRateStr = (acceptedNum: number, submitNum: number) => {
  if (submitNum === 0) {
    return '0%'
  }
  const rate = (acceptedNum / submitNum) * 100
  return `${rate.toFixed(2)}% (${acceptedNum} / ${submitNum})`
}

const handleSearch = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1
  }
  // loadData()
}
</script>

<style scoped>
#manageQuestionView {
  padding: 24px;
  min-height: 100vh;
  background-color: #f5f7fa;
  /* max-width: 1680px; */
  margin: 0 auto;
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
