<template>
  <div class="wallet-list">
    <div class="page-header">
      <h1>Quản lý ví</h1>
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
          placeholder="Tìm kiếm theo địa chỉ ví, người dùng..."
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
          <a-select-option value="ACTIVE">Hoạt động</a-select-option>
          <a-select-option value="INACTIVE">Không hoạt động</a-select-option>
          <a-select-option value="FROZEN">Đóng băng</a-select-option>
        </a-select>
        <a-select
          v-model:value="typeFilter"
          placeholder="Lọc theo loại ví"
          style="width: 200px"
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả loại</a-select-option>
          <a-select-option value="HOT">Ví nóng</a-select-option>
          <a-select-option value="COLD">Ví lạnh</a-select-option>
        </a-select>
      </div>

      <a-table
        :columns="columns"
        :data-source="filteredWallets"
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
          <template v-else-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">
              {{ getTypeText(record.type) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'balance'">
            <span class="balance-amount">{{ formatCurrency(record.balance) }}</span>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" @click="viewWallet(record)">
                <template #icon><EyeOutlined /></template>
                Xem
              </a-button>
              <a-button type="link" @click="freezeWallet(record.id)">
                <template #icon><LockOutlined /></template>
                Đóng băng
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
  LockOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// Data
const loading = ref(false)
const walletList = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')

// Table columns
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: 'Địa chỉ ví',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true
  },
  {
    title: 'Người dùng',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: 'Loại ví',
    key: 'type',
    dataIndex: 'type'
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status'
  },
  {
    title: 'Số dư',
    key: 'balance',
    dataIndex: 'balance'
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
const filteredWallets = computed(() => {
  let filtered = walletList.value

  if (searchQuery.value) {
    filtered = filtered.filter(wallet =>
      wallet.address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      wallet.userName.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(wallet => wallet.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(wallet => wallet.type === typeFilter.value)
  }

  return filtered
})

// Methods
const fetchWalletList = async () => {
  loading.value = true
  try {
    // Mock data for now
    walletList.value = [
      {
        id: 1,
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        userName: 'Nguyễn Văn A',
        type: 'HOT',
        status: 'ACTIVE',
        balance: 1000000000,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        address: '0x8ba1f109551bD432803012645Hac136c772c3c7c',
        userName: 'Trần Thị B',
        type: 'COLD',
        status: 'ACTIVE',
        balance: 5000000000,
        createdAt: '2024-01-02T00:00:00Z'
      }
    ]
    pagination.total = walletList.value.length
  } catch (error) {
    message.error('Không thể tải danh sách ví')
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

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchWalletList()
}

const viewWallet = (wallet: any) => {
  router.push(`/wallets/${wallet.id}`)
}

const freezeWallet = async (walletId: number) => {
  try {
    // TODO: Replace with actual API call
    message.success('Đã đóng băng ví')
    fetchWalletList()
  } catch (error) {
    message.error('Không thể đóng băng ví')
  }
}

const exportData = () => {
  message.info('Tính năng xuất dữ liệu đang được phát triển')
}

const refreshData = () => {
  fetchWalletList()
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Lifecycle
onMounted(() => {
  fetchWalletList()
})
</script>

<style scoped>
.wallet-list {
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

.balance-amount {
  font-weight: 600;
  color: #52c41a;
}

.ant-card {
  margin-bottom: 24px;
}
</style>
