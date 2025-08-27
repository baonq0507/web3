<template>
  <div class="audit-logs">
    <div class="page-header">
      <h1>Nhật ký kiểm toán</h1>
      <a-space>
        <a-button @click="exportLogs">
          <template #icon><DownloadOutlined /></template>
          Xuất nhật ký
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
          placeholder="Tìm kiếm theo người dùng, hành động..."
          style="width: 300px"
          @search="handleSearch"
        />
        <a-select
          v-model:value="actionFilter"
          placeholder="Lọc theo hành động"
          style="width: 200px"
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả hành động</a-select-option>
          <a-select-option value="CREATE">Tạo mới</a-select-option>
          <a-select-option value="UPDATE">Cập nhật</a-select-option>
          <a-select-option value="DELETE">Xóa</a-select-option>
          <a-select-option value="LOGIN">Đăng nhập</a-select-option>
          <a-select-option value="LOGOUT">Đăng xuất</a-select-option>
        </a-select>
        <a-select
          v-model:value="moduleFilter"
          placeholder="Lọc theo module"
          style="width: 200px"
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả module</a-select-option>
          <a-select-option value="USERS">Người dùng</a-select-option>
          <a-select-option value="KYC">KYC</a-select-option>
          <a-select-option value="WALLETS">Ví</a-select-option>
          <a-select-option value="TRADING">Giao dịch</a-select-option>
          <a-select-option value="SYSTEM">Hệ thống</a-select-option>
        </a-select>
        <a-range-picker
          v-model:value="dateRange"
          @change="handleDateRangeChange"
          style="width: 250px"
        />
      </div>

      <a-table
        :columns="columns"
        :data-source="filteredLogs"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-tag :color="getActionColor(record.action)">
              {{ getActionText(record.action) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'module'">
            <a-tag :color="getModuleColor(record.module)">
              {{ getModuleText(record.module) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'severity'">
            <a-tag :color="getSeverityColor(record.severity)">
              {{ getSeverityText(record.severity) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" @click="viewLog(record)">
                <template #icon><EyeOutlined /></template>
                Xem
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Log Detail Modal -->
    <a-modal
      v-model:open="showLogModal"
      :title="`Chi tiết nhật ký #${selectedLog?.id}`"
      @cancel="showLogModal = false"
      width="800px"
      :footer="null"
    >
      <div v-if="selectedLog" class="log-detail">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="ID">
            {{ selectedLog.id }}
          </a-descriptions-item>
          <a-descriptions-item label="Thời gian">
            {{ formatDate(selectedLog.timestamp) }}
          </a-descriptions-item>
          <a-descriptions-item label="Người dùng">
            {{ selectedLog.userName }}
          </a-descriptions-item>
          <a-descriptions-item label="IP">
            {{ selectedLog.ipAddress }}
          </a-descriptions-item>
          <a-descriptions-item label="Hành động">
            <a-tag :color="getActionColor(selectedLog.action)">
              {{ getActionText(selectedLog.action) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Module">
            <a-tag :color="getModuleColor(selectedLog.module)">
              {{ getModuleText(selectedLog.module) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Mức độ">
            <a-tag :color="getSeverityColor(selectedLog.severity)">
              {{ getSeverityText(selectedLog.severity) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Trạng thái">
            {{ selectedLog.success ? 'Thành công' : 'Thất bại' }}
          </a-descriptions-item>
          <a-descriptions-item label="Mô tả" :span="2">
            {{ selectedLog.description }}
          </a-descriptions-item>
          <a-descriptions-item label="Dữ liệu cũ" :span="2">
            <pre>{{ JSON.stringify(selectedLog.oldData, null, 2) }}</pre>
          </a-descriptions-item>
          <a-descriptions-item label="Dữ liệu mới" :span="2">
            <pre>{{ JSON.stringify(selectedLog.newData, null, 2) }}</pre>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  DownloadOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'

// Data
const loading = ref(false)
const auditLogs = ref<any[]>([])
const searchQuery = ref('')
const actionFilter = ref('')
const moduleFilter = ref('')
const dateRange = ref<any[]>([])
const showLogModal = ref(false)
const selectedLog = ref<any>(null)

// Table columns
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: 'Thời gian',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
  },
  {
    title: 'Người dùng',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: 'IP',
    dataIndex: 'ipAddress',
    key: 'ipAddress'
  },
  {
    title: 'Hành động',
    key: 'action',
    dataIndex: 'action'
  },
  {
    title: 'Module',
    key: 'module',
    dataIndex: 'module'
  },
  {
    title: 'Mức độ',
    key: 'severity',
    dataIndex: 'severity'
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 100
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
const filteredLogs = computed(() => {
  let filtered = auditLogs.value

  if (searchQuery.value) {
    filtered = filtered.filter(log =>
      log.userName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (actionFilter.value) {
    filtered = filtered.filter(log => log.action === actionFilter.value)
  }

  if (moduleFilter.value) {
    filtered = filtered.filter(log => log.module === moduleFilter.value)
  }

  return filtered
})

// Methods
const fetchAuditLogs = async () => {
  loading.value = true
  try {
    // Mock data for now
    auditLogs.value = [
      {
        id: 1,
        timestamp: '2024-01-15T10:30:00Z',
        userName: 'Admin User',
        ipAddress: '192.168.1.1',
        action: 'CREATE',
        module: 'USERS',
        severity: 'INFO',
        success: true,
        description: 'Tạo người dùng mới',
        oldData: null,
        newData: { name: 'Nguyễn Văn A', email: 'nguyenvana@example.com' }
      },
      {
        id: 2,
        timestamp: '2024-01-15T10:25:00Z',
        userName: 'Admin User',
        ipAddress: '192.168.1.1',
        action: 'UPDATE',
        module: 'KYC',
        severity: 'INFO',
        success: true,
        description: 'Cập nhật trạng thái KYC',
        oldData: { status: 'PENDING' },
        newData: { status: 'APPROVED' }
      },
      {
        id: 3,
        timestamp: '2024-01-15T10:20:00Z',
        userName: 'User A',
        ipAddress: '192.168.1.2',
        action: 'LOGIN',
        module: 'SYSTEM',
        severity: 'INFO',
        success: true,
        description: 'Đăng nhập thành công',
        oldData: null,
        newData: null
      }
    ]
    pagination.total = auditLogs.value.length
  } catch (error) {
    message.error('Không thể tải nhật ký kiểm toán')
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
  fetchAuditLogs()
}

const viewLog = (log: any) => {
  selectedLog.value = log
  showLogModal.value = true
}

const exportLogs = () => {
  // TODO: Implement export functionality
  message.info('Tính năng xuất nhật ký đang được phát triển')
}

const refreshData = () => {
  fetchAuditLogs()
}

const getActionColor = (action: string) => {
  const colors: Record<string, string> = {
    CREATE: 'green',
    UPDATE: 'blue',
    DELETE: 'red',
    LOGIN: 'purple',
    LOGOUT: 'orange'
  }
  return colors[action] || 'default'
}

const getActionText = (action: string) => {
  const texts: Record<string, string> = {
    CREATE: 'Tạo mới',
    UPDATE: 'Cập nhật',
    DELETE: 'Xóa',
    LOGIN: 'Đăng nhập',
    LOGOUT: 'Đăng xuất'
  }
  return texts[action] || action
}

const getModuleColor = (module: string) => {
  const colors: Record<string, string> = {
    USERS: 'blue',
    KYC: 'purple',
    WALLETS: 'green',
    TRADING: 'orange',
    SYSTEM: 'red'
  }
  return colors[module] || 'default'
}

const getModuleText = (module: string) => {
  const texts: Record<string, string> = {
    USERS: 'Người dùng',
    KYC: 'KYC',
    WALLETS: 'Ví',
    TRADING: 'Giao dịch',
    SYSTEM: 'Hệ thống'
  }
  return texts[module] || module
}

const getSeverityColor = (severity: string) => {
  const colors: Record<string, string> = {
    INFO: 'blue',
    WARNING: 'orange',
    ERROR: 'red',
    CRITICAL: 'red'
  }
  return colors[severity] || 'default'
}

const getSeverityText = (severity: string) => {
  const texts: Record<string, string> = {
    INFO: 'Thông tin',
    WARNING: 'Cảnh báo',
    ERROR: 'Lỗi',
    CRITICAL: 'Nghiêm trọng'
  }
  return texts[severity] || severity
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  fetchAuditLogs()
})
</script>

<style scoped>
.audit-logs {
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

.log-detail pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.ant-card {
  margin-bottom: 24px;
}
</style>
