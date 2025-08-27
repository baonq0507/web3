<template>
  <div class="kyc-list">
    <div class="page-header">
      <h1>Quản lý xác thực KYC</h1>
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
          placeholder="Tìm kiếm theo tên, email..."
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
          <a-select-option value="REJECTED">Từ chối</a-select-option>
          <a-select-option value="EXPIRED">Hết hạn</a-select-option>
        </a-select>
        <a-select
          v-model:value="typeFilter"
          placeholder="Lọc theo loại KYC"
          style="width: 200px"
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả loại</a-select-option>
          <a-select-option value="INDIVIDUAL">Cá nhân</a-select-option>
          <a-select-option value="BUSINESS">Doanh nghiệp</a-select-option>
        </a-select>
      </div>

      <a-table
        :columns="columns"
        :data-source="filteredKYC"
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
          <template v-else-if="column.key === 'priority'">
            <a-tag :color="getPriorityColor(record.priority)">
              {{ getPriorityText(record.priority) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" @click="viewKYC(record)">
                <template #icon><EyeOutlined /></template>
                Xem
              </a-button>
              <a-button 
                v-if="record.status === 'PENDING'"
                type="link" 
                @click="approveKYC(record.id)"
              >
                <template #icon><CheckOutlined /></template>
                Duyệt
              </a-button>
              <a-button 
                v-if="record.status === 'PENDING'"
                type="link" 
                danger
                @click="rejectKYC(record.id)"
              >
                <template #icon><CloseOutlined /></template>
                Từ chối
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Reject KYC Modal -->
    <a-modal
      v-model:open="showRejectModal"
      title="Từ chối KYC"
      @ok="confirmRejectKYC"
      @cancel="showRejectModal = false"
      okText="Từ chối"
      okType="danger"
    >
      <a-form layout="vertical">
        <a-form-item label="Lý do từ chối" required>
          <a-textarea
            v-model:value="rejectReason"
            :rows="4"
            placeholder="Nhập lý do từ chối..."
          />
        </a-form-item>
      </a-form>
    </a-modal>
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
const kycList = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const showRejectModal = ref(false)
const rejectReason = ref('')
const selectedKYCId = ref(null)

// Table columns
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: 'Họ và tên',
    dataIndex: 'fullName',
    key: 'fullName'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Loại KYC',
    key: 'type',
    dataIndex: 'type'
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status'
  },
  {
    title: 'Độ ưu tiên',
    key: 'priority',
    dataIndex: 'priority'
  },
  {
    title: 'Ngày nộp',
    dataIndex: 'submittedAt',
    key: 'submittedAt',
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
const filteredKYC = computed(() => {
  let filtered = kycList.value

  if (searchQuery.value) {
    filtered = filtered.filter(kyc =>
      kyc.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      kyc.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(kyc => kyc.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(kyc => kyc.type === typeFilter.value)
  }

  return filtered
})

// Methods
const fetchKYCList = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await kycApi.getKYCList(pagination)
    // kycList.value = response.data.kycList
    // pagination.total = response.data.total

    // Mock data for now
    kycList.value = [
      {
        id: 1,
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        type: 'INDIVIDUAL',
        status: 'PENDING',
        priority: 'HIGH',
        submittedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        fullName: 'Trần Thị B',
        email: 'tranthib@example.com',
        type: 'BUSINESS',
        status: 'APPROVED',
        priority: 'MEDIUM',
        submittedAt: '2024-01-14T15:45:00Z'
      },
      {
        id: 3,
        fullName: 'Lê Văn C',
        email: 'levanc@example.com',
        type: 'INDIVIDUAL',
        status: 'REJECTED',
        priority: 'LOW',
        submittedAt: '2024-01-13T09:20:00Z'
      }
    ]
    pagination.total = kycList.value.length
  } catch (error) {
    message.error('Không thể tải danh sách KYC')
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
  fetchKYCList()
}

const viewKYC = (kyc: any) => {
  router.push(`/kyc/${kyc.id}`)
}

const approveKYC = async (kycId: number) => {
  try {
    // TODO: Replace with actual API call
    // await kycApi.approveKYC(kycId)
    message.success('Đã duyệt KYC thành công')
    fetchKYCList()
  } catch (error) {
    message.error('Không thể duyệt KYC')
  }
}

const rejectKYC = (kycId: number) => {
  selectedKYCId.value = kycId
  rejectReason.value = ''
  showRejectModal.value = true
}

const confirmRejectKYC = async () => {
  if (!rejectReason.value.trim()) {
    message.error('Vui lòng nhập lý do từ chối')
    return
  }

  try {
    // TODO: Replace with actual API call
    // await kycApi.rejectKYC(selectedKYCId.value, { reason: rejectReason.value })
    message.success('Đã từ chối KYC')
    showRejectModal.value = false
    fetchKYCList()
  } catch (error) {
    message.error('Không thể từ chối KYC')
  }
}

const exportData = () => {
  // TODO: Implement export functionality
  message.info('Tính năng xuất dữ liệu đang được phát triển')
}

const refreshData = () => {
  fetchKYCList()
}

const getStatusColor = (status: string) => {
  const colors = {
    PENDING: 'orange',
    APPROVED: 'green',
    REJECTED: 'red',
    EXPIRED: 'gray'
  }
  return colors[status] || 'default'
}

const getStatusText = (status: string) => {
  const texts = {
    PENDING: 'Chờ xử lý',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
    EXPIRED: 'Hết hạn'
  }
  return texts[status] || status
}

const getTypeColor = (type: string) => {
  const colors = {
    INDIVIDUAL: 'blue',
    BUSINESS: 'purple'
  }
  return colors[type] || 'default'
}

const getTypeText = (type: string) => {
  const texts = {
    INDIVIDUAL: 'Cá nhân',
    BUSINESS: 'Doanh nghiệp'
  }
  return texts[type] || type
}

const getPriorityColor = (priority: string) => {
  const colors = {
    HIGH: 'red',
    MEDIUM: 'orange',
    LOW: 'green'
  }
  return colors[priority] || 'default'
}

const getPriorityText = (priority: string) => {
  const texts = {
    HIGH: 'Cao',
    MEDIUM: 'Trung bình',
    LOW: 'Thấp'
  }
  return texts[priority] || priority
}

// Lifecycle
onMounted(() => {
  fetchKYCList()
})
</script>

<style scoped>
.kyc-list {
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

.ant-card {
  margin-bottom: 24px;
}
</style>
