<template>
  <div class="audit-logs-simple">
    <div class="page-header">
      <h1>Nhật ký kiểm toán</h1>
      <a-button type="primary" @click="refreshData">
        <template #icon><ReloadOutlined /></template>
        Làm mới
      </a-button>
    </div>

    <a-card>
      <a-table
        :columns="columns"
        :data-source="auditLogs"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-tag :color="getActionColor(record.action)">
              {{ getActionText(record.action) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'resource'">
            <a-tag :color="getResourceColor(record.resource)">
              {{ getResourceText(record.resource) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'success'">
            <a-tag :color="record.success ? 'green' : 'red'">
              {{ record.success ? 'Thành công' : 'Thất bại' }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { ReloadOutlined } from '@ant-design/icons-vue'

interface AuditLog {
  id: string
  userId?: string
  action: string
  resource: string
  resourceId?: string
  details?: string
  ipAddress?: string
  userAgent?: string
  success: boolean
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

// Data
const loading = ref(false)
const auditLogs = ref<AuditLog[]>([])

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
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
  },
  {
    title: 'Người dùng',
    dataIndex: 'userId',
    key: 'userId'
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
    title: 'Tài nguyên',
    key: 'resource',
    dataIndex: 'resource'
  },
  {
    title: 'Trạng thái',
    key: 'success',
    dataIndex: 'success'
  },
  {
    title: 'Mô tả',
    dataIndex: 'details',
    key: 'details'
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

// Methods
const fetchAuditLogs = async () => {
  loading.value = true
  try {
    // Mock data for now - replace with actual API call
    const mockData: AuditLog[] = [
      {
        id: '1',
        userId: 'admin123',
        action: 'CREATE',
        resource: 'USER',
        details: 'Tạo người dùng mới',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        success: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        userId: 'admin123',
        action: 'UPDATE',
        resource: 'KYC',
        details: 'Cập nhật trạng thái KYC',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        success: true,
        createdAt: '2024-01-15T10:25:00Z',
        updatedAt: '2024-01-15T10:25:00Z'
      },
      {
        id: '3',
        userId: 'user456',
        action: 'LOGIN',
        resource: 'USER',
        details: 'Đăng nhập thành công',
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0...',
        success: true,
        createdAt: '2024-01-15T10:20:00Z',
        updatedAt: '2024-01-15T10:20:00Z'
      }
    ]
    
    auditLogs.value = mockData
    pagination.total = mockData.length
  } catch (error) {
    message.error('Không thể tải nhật ký kiểm toán')
    console.error('Error fetching audit logs:', error)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchAuditLogs()
}

const getActionColor = (action: string): string => {
  const colors: Record<string, string> = {
    CREATE: 'green',
    READ: 'blue',
    UPDATE: 'orange',
    DELETE: 'red',
    LOGIN: 'purple',
    LOGOUT: 'gray',
    APPROVE: 'green',
    REJECT: 'red',
    TRANSFER: 'cyan',
    WITHDRAW: 'orange',
    DEPOSIT: 'green'
  }
  return colors[action] || 'default'
}

const getActionText = (action: string): string => {
  const texts: Record<string, string> = {
    CREATE: 'Tạo mới',
    READ: 'Đọc',
    UPDATE: 'Cập nhật',
    DELETE: 'Xóa',
    LOGIN: 'Đăng nhập',
    LOGOUT: 'Đăng xuất',
    APPROVE: 'Phê duyệt',
    REJECT: 'Từ chối',
    TRANSFER: 'Chuyển tiền',
    WITHDRAW: 'Rút tiền',
    DEPOSIT: 'Nạp tiền'
  }
  return texts[action] || action
}

const getResourceColor = (resource: string): string => {
  const colors: Record<string, string> = {
    USER: 'blue',
    WALLET: 'green',
    KYC: 'purple',
    DEPOSIT: 'cyan',
    WITHDRAWAL: 'orange',
    TRADE: 'red',
    SYSTEM: 'gray'
  }
  return colors[resource] || 'default'
}

const getResourceText = (resource: string): string => {
  const texts: Record<string, string> = {
    USER: 'Người dùng',
    WALLET: 'Ví tiền',
    KYC: 'KYC',
    DEPOSIT: 'Nạp tiền',
    WITHDRAWAL: 'Rút tiền',
    TRADE: 'Giao dịch',
    SYSTEM: 'Hệ thống'
  }
  return texts[resource] || resource
}

// Lifecycle
onMounted(() => {
  fetchAuditLogs()
})
</script>

<style scoped>
.audit-logs-simple {
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

.ant-card {
  margin-bottom: 24px;
}
</style>
