<template>
  <div class="wallet-detail">
    <div class="page-header">
      <a-button @click="goBack" style="margin-right: 16px">
        <template #icon><ArrowLeftOutlined /></template>
        Quay lại
      </a-button>
      <h1>Chi tiết ví</h1>
      <a-space>
        <a-button @click="exportTransactions">
          <template #icon><DownloadOutlined /></template>
          Xuất giao dịch
        </a-button>
        <a-button type="primary" @click="refreshData">
          <template #icon><ReloadOutlined /></template>
          Làm mới
        </a-button>
      </a-space>
    </div>

    <a-row :gutter="24">
      <a-col :span="16">
        <a-card title="Thông tin ví" style="margin-bottom: 24px">
          <a-descriptions :column="2">
            <a-descriptions-item label="ID ví">
              {{ walletInfo.id }}
            </a-descriptions-item>
            <a-descriptions-item label="Trạng thái">
              <a-tag :color="getStatusColor(walletInfo.status)">
                {{ getStatusText(walletInfo.status) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Loại ví">
              <a-tag :color="getTypeColor(walletInfo.type)">
                {{ getTypeText(walletInfo.type) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Ngày tạo">
              {{ formatDate(walletInfo.createdAt) }}
            </a-descriptions-item>
            <a-descriptions-item label="Địa chỉ ví" :span="2">
              <a-input :value="walletInfo.address" readonly>
                <template #addonAfter>
                  <a-button type="link" @click="copyAddress">
                    <template #icon><CopyOutlined /></template>
                  </a-button>
                </template>
              </a-input>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card title="Số dư" style="margin-bottom: 24px">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-statistic title="Số dư hiện tại" :value="walletInfo.balance" prefix="₫" />
            </a-col>
            <a-col :span="8">
              <a-statistic title="Tổng nạp" :value="walletInfo.totalDeposits" prefix="₫" />
            </a-col>
            <a-col :span="8">
              <a-statistic title="Tổng rút" :value="walletInfo.totalWithdrawals" prefix="₫" />
            </a-col>
          </a-row>
        </a-card>

        <a-card title="Lịch sử giao dịch">
          <a-table
            :columns="transactionColumns"
            :data-source="transactions"
            :loading="loading"
            :pagination="transactionPagination"
            @change="handleTransactionChange"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'type'">
                <a-tag :color="getTransactionTypeColor(record.type)">
                  {{ getTransactionTypeText(record.type) }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag :color="getTransactionStatusColor(record.status)">
                  {{ getTransactionStatusText(record.status) }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'amount'">
                <span :class="record.type === 'DEPOSIT' ? 'positive' : 'negative'">
                  {{ record.type === 'DEPOSIT' ? '+' : '-' }}{{ formatCurrency(record.amount) }}
                </span>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card title="Thông tin người dùng" style="margin-bottom: 24px">
          <a-descriptions :column="1">
            <a-descriptions-item label="Họ và tên">
              {{ walletInfo.userName }}
            </a-descriptions-item>
            <a-descriptions-item label="Email">
              {{ walletInfo.userEmail }}
            </a-descriptions-item>
            <a-descriptions-item label="Số điện thoại">
              {{ walletInfo.userPhone }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card title="Hành động nhanh">
          <a-space direction="vertical" style="width: 100%">
            <a-button block @click="freezeWallet">
              <template #icon><LockOutlined /></template>
              {{ walletInfo.status === 'FROZEN' ? 'Mở khóa ví' : 'Đóng băng ví' }}
            </a-button>
            <a-button block @click="viewUser">
              <template #icon><UserOutlined /></template>
              Xem người dùng
            </a-button>
            <a-button block @click="generateReport">
              <template #icon><FileTextOutlined /></template>
              Tạo báo cáo
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  ReloadOutlined,
  CopyOutlined,
  LockOutlined,
  UserOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

// Data
const loading = ref(false)
const walletInfo = reactive({
  id: 0,
  address: '',
  type: 'HOT',
  status: 'ACTIVE',
  createdAt: '',
  balance: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  userName: '',
  userEmail: '',
  userPhone: ''
})

const transactions = ref([])
const transactionPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true
})

// Transaction table columns
const transactionColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: 'Loại',
    key: 'type',
    dataIndex: 'type'
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
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
  }
]

// Methods
const fetchWalletInfo = async () => {
  loading.value = true
  try {
    const walletId = route.params.id
    // Mock data for now
    Object.assign(walletInfo, {
      id: walletId,
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      type: 'HOT',
      status: 'ACTIVE',
      createdAt: '2024-01-01T00:00:00Z',
      balance: 1000000000,
      totalDeposits: 2000000000,
      totalWithdrawals: 1000000000,
      userName: 'Nguyễn Văn A',
      userEmail: 'nguyenvana@example.com',
      userPhone: '0123456789'
    })

    // Mock transactions
    transactions.value = [
      {
        id: 1,
        type: 'DEPOSIT',
        amount: 1000000000,
        status: 'COMPLETED',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        type: 'WITHDRAWAL',
        amount: 500000000,
        status: 'COMPLETED',
        createdAt: '2024-01-14T15:45:00Z'
      }
    ]
    transactionPagination.total = transactions.value.length
  } catch (error) {
    message.error('Không thể tải thông tin ví')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/wallets')
}

const copyAddress = () => {
  navigator.clipboard.writeText(walletInfo.address)
  message.success('Đã sao chép địa chỉ ví')
}

const freezeWallet = async () => {
  try {
    const newStatus = walletInfo.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN'
    // TODO: Replace with actual API call
    walletInfo.status = newStatus
    message.success(`Đã ${newStatus === 'FROZEN' ? 'đóng băng' : 'mở khóa'} ví`)
  } catch (error) {
    message.error('Không thể thay đổi trạng thái ví')
  }
}

const viewUser = () => {
  // TODO: Navigate to user detail page
  message.info('Tính năng đang được phát triển')
}

const generateReport = () => {
  // TODO: Implement report generation
  message.info('Tính năng đang được phát triển')
}

const exportTransactions = () => {
  // TODO: Implement export functionality
  message.info('Tính năng đang được phát triển')
}

const refreshData = () => {
  fetchWalletInfo()
}

const handleTransactionChange = (pag: any) => {
  transactionPagination.current = pag.current
  transactionPagination.pageSize = pag.pageSize
  // TODO: Fetch transactions with pagination
}

const getStatusColor = (status: string) => {
  const colors = {
    ACTIVE: 'green',
    INACTIVE: 'orange',
    FROZEN: 'red'
  }
  return colors[status] || 'default'
}

const getStatusText = (status: string) => {
  const texts = {
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Không hoạt động',
    FROZEN: 'Đóng băng'
  }
  return texts[status] || status
}

const getTypeColor = (type: string) => {
  const colors = {
    HOT: 'orange',
    COLD: 'blue'
  }
  return colors[type] || 'default'
}

const getTypeText = (type: string) => {
  const texts = {
    HOT: 'Ví nóng',
    COLD: 'Ví lạnh'
  }
  return texts[type] || type
}

const getTransactionTypeColor = (type: string) => {
  const colors = {
    DEPOSIT: 'green',
    WITHDRAWAL: 'red',
    TRANSFER: 'blue'
  }
  return colors[type] || 'default'
}

const getTransactionTypeText = (type: string) => {
  const texts = {
    DEPOSIT: 'Nạp tiền',
    WITHDRAWAL: 'Rút tiền',
    TRANSFER: 'Chuyển khoản'
  }
  return texts[type] || type
}

const getTransactionStatusColor = (status: string) => {
  const colors = {
    PENDING: 'orange',
    COMPLETED: 'green',
    FAILED: 'red'
  }
  return colors[status] || 'default'
}

const getTransactionStatusText = (status: string) => {
  const texts = {
    PENDING: 'Chờ xử lý',
    COMPLETED: 'Hoàn thành',
    FAILED: 'Thất bại'
  }
  return texts[status] || status
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Lifecycle
onMounted(() => {
  fetchWalletInfo()
})
</script>

<style scoped>
.wallet-detail {
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  flex: 1;
}

.positive {
  color: #52c41a;
  font-weight: 600;
}

.negative {
  color: #ff4d4f;
  font-weight: 600;
}

.ant-card {
  margin-bottom: 24px;
}
</style>
