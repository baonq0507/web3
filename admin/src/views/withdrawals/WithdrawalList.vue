<template>
  <div class="withdrawal-list">
    <div class="page-header">
      <h1>Quản lý rút tiền</h1>
      <a-space>
        <a-button @click="exportData">
          <template #icon><DownloadOutlined /></template>
          Xuất dữ liệu
        </a-button>
        <a-button type="primary" @click="refreshData">
          <template #icon><ReloadOutlined /></template>
          Làm mới
        </a-button>
      </a-space>
    </div>

    <a-card>
      <div class="search-bar">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm theo ID, người dùng..."
          style="width: 300px"
          @search="handleSearch"
        />
        <a-select
          v-model:value="statusFilter"
          placeholder="Lọc theo trạng thái"
          style="width: 200px"
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả trạng thái</a-select-option>
          <a-select-option value="PENDING">Chờ xử lý</a-select-option>
          <a-select-option value="APPROVED">Đã duyệt</a-select-option>
          <a-select-option value="PROCESSING">Đang xử lý</a-select-option>
          <a-select-option value="COMPLETED">Hoàn thành</a-select-option>
          <a-select-option value="REJECTED">Từ chối</a-select-option>
        </a-select>
        <a-range-picker
          v-model:value="dateRange"
          @change="handleDateRangeChange"
          style="width: 250px"
        />
      </div>

      <a-table
        :columns="columns"
        :data-source="filteredWithdrawals"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'amount'">
            <span class="amount">{{ formatCurrency(record.amount) }}</span>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" @click="viewWithdrawal(record)">
                <template #icon><EyeOutlined /></template>
                Xem
              </a-button>
              <a-button 
                v-if="record.status === 'PENDING'"
                type="link" 
                @click="approveWithdrawal(record.id)"
              >
                <template #icon><CheckOutlined /></template>
                Duyệt
              </a-button>
              <a-button 
                v-if="record.status === 'PENDING'"
                type="link" 
                danger
                @click="rejectWithdrawal(record.id)"
              >
                <template #icon><CloseOutlined /></template>
                Từ chối
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  DownloadOutlined,
  ReloadOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// Data
const loading = ref(false)
const withdrawalList = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref([])

// Table columns
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: 'Người dùng',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: 'Số tiền',
    key: 'amount',
    dataIndex: 'amount'
  },
  {
    title: 'Phương thức',
    dataIndex: 'method',
    key: 'method'
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status'
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 200
  }
]

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true
})

// Computed
const filteredWithdrawals = computed(() => {
  let filtered = withdrawalList.value

  if (searchQuery.value) {
    filtered = filtered.filter(withdrawal =>
      withdrawal.id.toString().includes(searchQuery.value) ||
      withdrawal.userName.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(withdrawal => withdrawal.status === statusFilter.value)
  }

  return filtered
})

// Methods
const fetchWithdrawalList = async () => {
  loading.value = true
  try {
    // Mock data for now
    withdrawalList.value = [
      {
        id: 1,
        userName: 'Nguyễn Văn A',
        amount: 1000000,
        method: 'Bank Transfer',
        status: 'PENDING',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        userName: 'Trần Thị B',
        amount: 5000000,
        method: 'Credit Card',
        status: 'APPROVED',
        createdAt: '2024-01-14T15:45:00Z'
      }
    ]
    pagination.total = withdrawalList.value.length
  } catch (error) {
    message.error('Không thể tải danh sách rút tiền')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
}

const handleFilter = () => {
  pagination.current = 1
}

const handleDateRangeChange = () => {
  pagination.current = 1
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchWithdrawalList()
}

const viewWithdrawal = (withdrawal: any) => {
  // TODO: Navigate to withdrawal detail page
  message.info('Tính năng đang được phát triển')
}

const approveWithdrawal = async (withdrawalId: number) => {
  try {
    // TODO: Replace with actual API call
    message.success('Đã duyệt rút tiền')
    fetchWithdrawalList()
  } catch (error) {
    message.error('Không thể duyệt rút tiền')
  }
}

const rejectWithdrawal = async (withdrawalId: number) => {
  try {
    // TODO: Replace with actual API call
    message.success('Đã từ chối rút tiền')
    fetchWithdrawalList()
  } catch (error) {
    message.error('Không thể từ chối rút tiền')
  }
}

const exportData = () => {
  message.info('Tính năng xuất dữ liệu đang được phát triển')
}

const refreshData = () => {
  fetchWithdrawalList()
}

const getStatusColor = (status: string) => {
  const colors = {
    PENDING: 'orange',
    APPROVED: 'blue',
    PROCESSING: 'purple',
    COMPLETED: 'green',
    REJECTED: 'red'
  }
  return colors[status] || 'default'
}

const getStatusText = (status: string) => {
  const texts = {
    PENDING: 'Chờ xử lý',
    APPROVED: 'Đã duyệt',
    PROCESSING: 'Đang xử lý',
    COMPLETED: 'Hoàn thành',
    REJECTED: 'Từ chối'
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
  fetchWithdrawalList()
})
</script>

<style scoped>
.withdrawal-list {
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

.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.amount {
  font-weight: 600;
  color: #ff4d4f;
}

.ant-card {
  margin-bottom: 24px;
}
</style>
