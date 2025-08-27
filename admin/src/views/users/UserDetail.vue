<template>
  <div class="user-detail">
    <div class="page-header">
      <a-button @click="goBack" style="margin-right: 16px">
        <template #icon><ArrowLeftOutlined /></template>
        Quay lại
      </a-button>
      <h1>Thông tin người dùng</h1>
      <a-space>
        <a-button @click="editMode = true" v-if="!editMode">
          <template #icon><EditOutlined /></template>
          Chỉnh sửa
        </a-button>
        <a-button type="primary" @click="saveChanges" v-if="editMode">
          <template #icon><SaveOutlined /></template>
          Lưu thay đổi
        </a-button>
        <a-button @click="cancelEdit" v-if="editMode">
          Hủy
        </a-button>
      </a-space>
    </div>

    <a-row :gutter="24">
      <a-col :span="16">
        <a-card title="Thông tin cơ bản" style="margin-bottom: 24px">
          <a-form
            :model="userForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            :disabled="!editMode"
          >
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="Email">
                  <a-input v-model:value="userForm.email" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Vai trò">
                  <a-select v-model:value="userForm.role">
                    <a-select-option value="USER">Người dùng</a-select-option>
                    <a-select-option value="ADMIN">Quản trị viên</a-select-option>
                    <a-select-option value="SUPERADMIN">Siêu quản trị</a-select-option>
                    <a-select-option value="SUPPORT">Hỗ trợ</a-select-option>
                    <a-select-option value="AUDITOR">Kiểm toán</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Trạng thái">
                  <a-select v-model:value="userForm.status">
                    <a-select-option value="ACTIVE">Hoạt động</a-select-option>
                    <a-select-option value="INACTIVE">Không hoạt động</a-select-option>
                    <a-select-option value="SUSPENDED">Tạm khóa</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>

        <a-card title="Thông tin tài khoản" style="margin-bottom: 24px">
          <a-descriptions :column="2">
            <a-descriptions-item label="ID người dùng">
              {{ userInfo.id }}
            </a-descriptions-item>
            <a-descriptions-item label="Ngày tạo">
              {{ formatDate(userInfo.createdAt) }}
            </a-descriptions-item>
            <a-descriptions-item label="Lần đăng nhập cuối">
              {{ formatDate(userInfo.updatedAt) }}
            </a-descriptions-item>
            <a-descriptions-item label="Trạng thái xác thực">
              <a-tag :color="userInfo.status === 'ACTIVE' ? 'green' : 'red'">
                {{ userInfo.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động' }}
              </a-tag>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card title="Lịch sử hoạt động">
          <a-timeline>
            <a-timeline-item v-for="activity in userActivities" :key="activity.id">
              <template #dot>
                <a-avatar :size="24" :src="activity.icon" />
              </template>
              <div class="activity-item">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ formatDate(activity.timestamp) }}</div>
                <div class="activity-description">{{ activity.description }}</div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card title="Thống kê" style="margin-bottom: 24px">
          <a-statistic title="Số giao dịch" :value="userStats.transactionCount" />
          <a-divider />
          <a-statistic title="Tổng tiền giao dịch" :value="userStats.totalAmount" prefix="₫" />
          <a-divider />
          <a-statistic title="Số ví" :value="userStats.walletCount" />
        </a-card>

        <a-card title="Hành động nhanh">
          <a-space direction="vertical" style="width: 100%">
            <a-button block @click="resetPassword">
              <template #icon><KeyOutlined /></template>
              Đặt lại mật khẩu
            </a-button>
            <a-button block @click="toggleUserStatus">
              <template #icon><PoweroffOutlined /></template>
              {{ userInfo.status === 'ACTIVE' ? 'Tạm khóa' : 'Kích hoạt' }}
            </a-button>
            <a-button block danger @click="deleteUser">
              <template #icon><DeleteOutlined /></template>
              Xóa người dùng
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>

    <!-- Reset Password Modal -->
    <a-modal
      v-model:open="showResetPasswordModal"
      title="Đặt lại mật khẩu"
      @cancel="showResetPasswordModal = false"
      :footer="null"
    >
      <div v-if="!generatedPassword">
        <p>Nhập mật khẩu mới cho người dùng này:</p>
        <a-form layout="vertical">
          <a-form-item label="Mật khẩu mới" required>
            <a-input-password
              v-model:value="newPassword"
              placeholder="Nhập mật khẩu mới"
              size="large"
              :minlength="8"
            />
          </a-form-item>
          <a-form-item label="Xác nhận mật khẩu" required>
            <a-input-password
              v-model:value="confirmPassword"
              placeholder="Nhập lại mật khẩu mới"
              size="large"
              :minlength="8"
            />
          </a-form-item>
        </a-form>
        <div style="text-align: center; margin-top: 24px;">
          <a-button 
            type="primary" 
            @click="confirmResetPassword" 
            :loading="resettingPassword"
            :disabled="!newPassword || !confirmPassword || newPassword !== confirmPassword"
          >
            <template #icon><KeyOutlined /></template>
            Đặt lại mật khẩu
          </a-button>
        </div>
        <div v-if="newPassword && confirmPassword && newPassword !== confirmPassword" style="color: #ff4d4f; text-align: center; margin-top: 8px;">
          Mật khẩu xác nhận không khớp
        </div>
      </div>
      
      <div v-else>
        <a-result
          status="success"
          title="Mật khẩu đã được đặt lại thành công"
          sub-title="Mật khẩu mới đã được áp dụng cho người dùng"
        >
          <template #extra>
            <a-space>
              <a-button @click="showResetPasswordModal = false">
                Đóng
              </a-button>
              <a-button type="primary" @click="resetPassword">
                Đặt lại mật khẩu khác
              </a-button>
            </a-space>
          </template>
        </a-result>
      </div>
    </a-modal>

    <!-- Delete User Modal -->
    <a-modal
      v-model:open="showDeleteModal"
      title="Xóa người dùng"
      @ok="confirmDeleteUser"
      @cancel="showDeleteModal = false"
      okText="Xóa"
      okType="danger"
    >
      <p>Bạn có chắc muốn xóa người dùng này?</p>
      <p>Hành động này không thể hoàn tác!</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import usersApi from '@/api/users'
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  KeyOutlined,
  PoweroffOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

// Data
const loading = ref(false)
const editMode = ref(false)
const showResetPasswordModal = ref(false)
const showDeleteModal = ref(false)
const resettingPassword = ref(false)
const generatedPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// User information
const userInfo = reactive({
  id: '',
  email: '',
  role: 'USER',
  status: 'ACTIVE',
  createdAt: '',
  updatedAt: ''
})

// Form data
const userForm = reactive({
  email: '',
  role: 'USER',
  status: 'ACTIVE'
})

// User statistics
const userStats = reactive({
  transactionCount: 0,
  totalAmount: 0,
  walletCount: 0
})

// User activities
const userActivities = ref([
  {
    id: 1,
    title: 'Đăng nhập thành công',
    description: 'Đăng nhập từ IP 192.168.1.1',
    timestamp: '2024-01-15T10:30:00Z',
    icon: ''
  },
  {
    id: 2,
    title: 'Thực hiện giao dịch',
    description: 'Nạp tiền 1,000,000 VND',
    timestamp: '2024-01-14T15:45:00Z',
    icon: ''
  },
  {
    id: 3,
    title: 'Cập nhật thông tin',
    description: 'Thay đổi vai trò',
    timestamp: '2024-01-13T09:20:00Z',
    icon: ''
  }
])

// Methods
const fetchUserInfo = async () => {
  loading.value = true
  try {
    const userId = route.params.id as string
    const response = await usersApi.getUserById(userId)
    Object.assign(userInfo, response)
    Object.assign(userForm, response)

    // Mock stats
    Object.assign(userStats, {
      transactionCount: 25,
      totalAmount: 50000000,
      walletCount: 3
    })
  } catch (error) {
    message.error('Không thể tải thông tin người dùng')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/users')
}

const saveChanges = async () => {
  try {
    const response = await usersApi.updateUser(userInfo.id, userForm)
    Object.assign(userInfo, response)
    message.success('Cập nhật thông tin thành công')
    editMode.value = false
  } catch (error) {
    message.error('Không thể cập nhật thông tin')
  }
}

const cancelEdit = () => {
  Object.assign(userForm, {
    email: userInfo.email,
    role: userInfo.role,
    status: userInfo.status
  })
  editMode.value = false
}

const resetPassword = () => {
  generatedPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  showResetPasswordModal.value = true
}

const confirmResetPassword = async () => {
  try {
    if (newPassword.value !== confirmPassword.value) {
      message.error('Mật khẩu xác nhận không khớp')
      return
    }
    
    resettingPassword.value = true
    // Call the real API to reset password with the new password
    await usersApi.resetPassword(userInfo.id, newPassword.value, 'Đặt lại mật khẩu bởi admin')
    message.success('Mật khẩu đã được đặt lại thành công')
    generatedPassword.value = 'success' // Use this to show success state
    showResetPasswordModal.value = false
  } catch (error) {
    message.error('Không thể đặt lại mật khẩu')
  } finally {
    resettingPassword.value = false
  }
}

// Function copyPassword is no longer needed since we're not generating passwords

const toggleUserStatus = async () => {
  try {
    const newStatus = userInfo.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    const response = await usersApi.changeUserStatus(userInfo.id, newStatus)
    Object.assign(userInfo, response)
    userForm.status = newStatus
    message.success(`Đã ${newStatus === 'ACTIVE' ? 'kích hoạt' : 'tạm khóa'} người dùng`)
  } catch (error) {
    message.error('Không thể thay đổi trạng thái người dùng')
  }
}

const deleteUser = () => {
  showDeleteModal.value = true
}

const confirmDeleteUser = async () => {
  try {
    await usersApi.deleteUser(userInfo.id)
    message.success('Đã xóa người dùng')
    router.push('/users')
  } catch (error) {
    message.error('Không thể xóa người dùng')
  }
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
  fetchUserInfo()
})
</script>

<style scoped>
.user-detail {
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

.activity-item {
  margin-left: 16px;
}

.activity-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.activity-description {
  color: #666;
}

.ant-card {
  margin-bottom: 24px;
}
</style>
