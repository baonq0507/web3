<template>
  <div class="reports">
    <div class="page-header">
      <h1>Báo cáo</h1>
      <a-space>
        <a-button @click="exportReport">
          <template #icon><DownloadOutlined /></template>
          Xuất báo cáo
        </a-button>
        <a-button type="primary" @click="generateReport">
          <template #icon><ReloadOutlined /></template>
          Tạo báo cáo
        </a-button>
      </a-space>
    </div>

    <a-row :gutter="24">
      <a-col :span="6">
        <a-card>
          <a-statistic title="Tổng người dùng" :value="stats.totalUsers" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="Tổng giao dịch" :value="stats.totalTransactions" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="Tổng doanh thu" :value="stats.totalRevenue" prefix="₫" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="Tổng lợi nhuận" :value="stats.totalProfit" prefix="₫" />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="24" style="margin-top: 24px;">
      <a-col :span="12">
        <a-card title="Báo cáo theo thời gian">
          <a-form layout="vertical">
            <a-form-item label="Loại báo cáo">
              <a-select v-model:value="reportType" style="width: 100%">
                <a-select-option value="daily">Hàng ngày</a-select-option>
                <a-select-option value="weekly">Hàng tuần</a-select-option>
                <a-select-option value="monthly">Hàng tháng</a-select-option>
                <a-select-option value="yearly">Hàng năm</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Khoảng thời gian">
              <a-range-picker
                v-model:value="dateRange"
                @change="handleDateRangeChange"
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="generateReport" block>
                Tạo báo cáo
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card title="Báo cáo theo loại">
          <a-form layout="vertical">
            <a-form-item label="Loại giao dịch">
              <a-select v-model:value="transactionType" style="width: 100%">
                <a-select-option value="all">Tất cả</a-select-option>
                <a-select-option value="deposits">Nạp tiền</a-select-option>
                <a-select-option value="withdrawals">Rút tiền</a-select-option>
                <a-select-option value="trades">Giao dịch</a-select-option>
                <a-select-option value="options">Options</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Trạng thái">
              <a-select v-model:value="status" style="width: 100%">
                <a-select-option value="all">Tất cả</a-select-option>
                <a-select-option value="completed">Hoàn thành</a-select-option>
                <a-select-option value="pending">Chờ xử lý</a-select-option>
                <a-select-option value="failed">Thất bại</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="generateReport" block>
                Tạo báo cáo
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <a-card title="Kết quả báo cáo" style="margin-top: 24px;">
      <a-table
        :columns="reportColumns"
        :data-source="reportData"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'amount'">
            <span class="amount">{{ formatCurrency(record.amount) }}</span>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-card title="Biểu đồ thống kê" style="margin-top: 24px;">
      <div class="chart-container">
        <div class="chart-placeholder">
          <a-icon type="bar-chart" style="font-size: 48px; color: #ccc;" />
          <p>Biểu đồ thống kê sẽ được hiển thị ở đây</p>
          <p>Tính năng đang được phát triển</p>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'

// Data
const loading = ref(false)
const reportType = ref('daily')
const dateRange = ref([])
const transactionType = ref('all')
const status = ref('all')

// Statistics
const stats = reactive({
  totalUsers: 1250,
  totalTransactions: 5678,
  totalRevenue: 15000000000,
  totalProfit: 3000000000
})

// Report data
const reportData = ref([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true
})

// Report table columns
const reportColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: 'Ngày',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: 'Loại',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'Số lượng',
    dataIndex: 'count',
    key: 'count'
  },
  {
    title: 'Số tiền',
    key: 'amount',
    dataIndex: 'amount'
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status'
  }
]

// Methods
const generateReport = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await reportApi.generateReport({
    //   type: reportType.value,
    //   dateRange: dateRange.value,
    //   transactionType: transactionType.value,
    //   status: status.value
    // })

    // Mock data for now
    reportData.value = [
      {
        id: 1,
        date: '2024-01-15',
        type: 'Nạp tiền',
        count: 25,
        amount: 50000000,
        status: 'completed'
      },
      {
        id: 2,
        date: '2024-01-15',
        type: 'Rút tiền',
        count: 15,
        amount: 30000000,
        status: 'completed'
      },
      {
        id: 3,
        date: '2024-01-15',
        type: 'Giao dịch',
        count: 150,
        amount: 100000000,
        status: 'completed'
      }
    ]
    pagination.total = reportData.value.length

    message.success('Đã tạo báo cáo thành công')
  } catch (error) {
    message.error('Không thể tạo báo cáo')
  } finally {
    loading.value = false
  }
}

const exportReport = () => {
  // TODO: Implement export functionality
  message.info('Tính năng xuất báo cáo đang được phát triển')
}

const handleDateRangeChange = () => {
  // Handle date range change
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  // TODO: Fetch report data with pagination
}

const getStatusColor = (status: string) => {
  const colors = {
    completed: 'green',
    pending: 'orange',
    failed: 'red'
  }
  return colors[status] || 'default'
}

const getStatusText = (status: string) => {
  const texts = {
    completed: 'Hoàn thành',
    pending: 'Chờ xử lý',
    failed: 'Thất bại'
  }
  return texts[status] || status
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Lifecycle
onMounted(() => {
  // Initialize with default data
  generateReport()
})
</script>

<style scoped>
.reports {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.amount {
  font-weight: 600;
  color: #52c41a;
}

.chart-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: #666;
}

.chart-placeholder p {
  margin: 8px 0;
}

.ant-card {
  margin-bottom: 24px;
}
</style>
