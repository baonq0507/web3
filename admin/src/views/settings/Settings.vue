<template>
  <div class="settings">
    <div class="page-header">
      <h1>Cài đặt hệ thống</h1>
      <a-space>
        <a-button @click="saveAllSettings">
          <template #icon><SaveOutlined /></template>
          Lưu tất cả
        </a-button>
        <a-button type="primary" @click="refreshData">
          <template #icon><ReloadOutlined /></template>
          Làm mới
        </a-button>
      </a-space>
    </div>

    <a-row :gutter="24">
      <a-col :span="12">
        <a-card title="Cài đặt chung" style="margin-bottom: 24px">
          <a-form layout="vertical">
            <a-form-item label="Tên hệ thống">
              <a-input v-model:value="generalSettings.systemName" />
            </a-form-item>
            <a-form-item label="Mô tả hệ thống">
              <a-textarea v-model:value="generalSettings.systemDescription" :rows="3" />
            </a-form-item>
            <a-form-item label="Logo URL">
              <a-input v-model:value="generalSettings.logoUrl" />
            </a-form-item>
            <a-form-item label="Favicon URL">
              <a-input v-model:value="generalSettings.faviconUrl" />
            </a-form-item>
            <a-form-item label="Múi giờ">
              <a-select v-model:value="generalSettings.timezone" style="width: 100%">
                <a-select-option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</a-select-option>
                <a-select-option value="UTC">UTC (GMT+0)</a-select-option>
                <a-select-option value="America/New_York">America/New_York (GMT-5)</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Ngôn ngữ mặc định">
              <a-select v-model:value="generalSettings.defaultLanguage" style="width: 100%">
                <a-select-option value="vi">Tiếng Việt</a-select-option>
                <a-select-option value="en">English</a-select-option>
                <a-select-option value="fr">Français</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-card>

        <a-card title="Cài đặt bảo mật" style="margin-bottom: 24px">
          <a-form layout="vertical">
            <a-form-item label="Độ dài mật khẩu tối thiểu">
              <a-input-number
                v-model:value="securitySettings.minPasswordLength"
                style="width: 100%"
                :min="6"
                :max="20"
              />
            </a-form-item>
            <a-form-item label="Yêu cầu mật khẩu phức tạp">
              <a-switch v-model:checked="securitySettings.requireComplexPassword" />
            </a-form-item>
            <a-form-item label="Thời gian hết hạn phiên đăng nhập (phút)">
              <a-input-number
                v-model:value="securitySettings.sessionTimeout"
                style="width: 100%"
                :min="15"
                :max="1440"
              />
            </a-form-item>
            <a-form-item label="Giới hạn đăng nhập sai (lần)">
              <a-input-number
                v-model:value="securitySettings.maxLoginAttempts"
                style="width: 100%"
                :min="3"
                :max="10"
              />
            </a-form-item>
            <a-form-item label="Thời gian khóa tài khoản (phút)">
              <a-input-number
                v-model:value="securitySettings.accountLockoutDuration"
                style="width: 100%"
                :min="5"
                :max="1440"
              />
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card title="Cài đặt email" style="margin-bottom: 24px">
          <a-form layout="vertical">
            <a-form-item label="SMTP Server">
              <a-input v-model:value="emailSettings.smtpServer" />
            </a-form-item>
            <a-form-item label="SMTP Port">
              <a-input-number v-model:value="emailSettings.smtpPort" style="width: 100%" />
            </a-form-item>
            <a-form-item label="Email gửi">
              <a-input v-model:value="emailSettings.fromEmail" />
            </a-form-item>
            <a-form-item label="Tên người gửi">
              <a-input v-model:value="emailSettings.fromName" />
            </a-form-item>
            <a-form-item label="Bảo mật SSL/TLS">
              <a-switch v-model:checked="emailSettings.useSSL" />
            </a-form-item>
            <a-form-item label="Tài khoản SMTP">
              <a-input v-model:value="emailSettings.smtpUsername" />
            </a-form-item>
            <a-form-item label="Mật khẩu SMTP">
              <a-input-password v-model:value="emailSettings.smtpPassword" />
            </a-form-item>
          </a-form>
        </a-card>

        <a-card title="Cài đặt thông báo">
          <a-form layout="vertical">
            <a-form-item label="Thông báo qua email">
              <a-switch v-model:checked="notificationSettings.emailEnabled" />
            </a-form-item>
            <a-form-item label="Thông báo qua SMS">
              <a-switch v-model:checked="notificationSettings.smsEnabled" />
            </a-form-item>
            <a-form-item label="Thông báo qua push notification">
              <a-switch v-model:checked="notificationSettings.pushEnabled" />
            </a-form-item>
            <a-form-item label="Thông báo cho admin">
              <a-switch v-model:checked="notificationSettings.adminNotifications" />
            </a-form-item>
            <a-form-item label="Email quản trị">
              <a-input v-model:value="notificationSettings.adminEmail" />
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <a-card title="Lịch sử thay đổi">
      <a-timeline>
        <a-timeline-item v-for="change in settingsHistory" :key="change.id">
          <template #dot>
            <a-avatar :size="24" :src="change.userAvatar" />
          </template>
          <div class="change-item">
            <div class="change-title">{{ change.title }}</div>
            <div class="change-time">{{ formatDate(change.timestamp) }}</div>
            <div class="change-user">Bởi: {{ change.userName }}</div>
            <div class="change-description">{{ change.description }}</div>
          </div>
        </a-timeline-item>
      </a-timeline>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'

// Data
const loading = ref(false)

// Settings objects
const generalSettings = reactive({
  systemName: 'Crypto Trading Admin',
  systemDescription: 'Hệ thống quản lý giao dịch tiền điện tử',
  logoUrl: 'https://example.com/logo.png',
  faviconUrl: 'https://example.com/favicon.ico',
  timezone: 'Asia/Ho_Chi_Minh',
  defaultLanguage: 'vi'
})

const securitySettings = reactive({
  minPasswordLength: 8,
  requireComplexPassword: true,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  accountLockoutDuration: 15
})

const emailSettings = reactive({
  smtpServer: 'smtp.gmail.com',
  smtpPort: 587,
  fromEmail: 'noreply@example.com',
  fromName: 'Crypto Trading Admin',
  useSSL: true,
  smtpUsername: '',
  smtpPassword: ''
})

const notificationSettings = reactive({
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true,
  adminNotifications: true,
  adminEmail: 'admin@example.com'
})

// Settings history
const settingsHistory = ref([
  {
    id: 1,
    title: 'Cập nhật cài đặt bảo mật',
    description: 'Thay đổi độ dài mật khẩu tối thiểu từ 6 lên 8 ký tự',
    timestamp: '2024-01-15T10:30:00Z',
    userName: 'Admin User',
    userAvatar: ''
  },
  {
    id: 2,
    title: 'Cập nhật cài đặt email',
    description: 'Thay đổi SMTP server từ smtp.yahoo.com sang smtp.gmail.com',
    timestamp: '2024-01-14T15:45:00Z',
    userName: 'Admin User',
    userAvatar: ''
  }
])

// Methods
const fetchSettings = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await settingsApi.getSettings()
    // Object.assign(generalSettings, response.data.general)
    // Object.assign(securitySettings, response.data.security)
    // Object.assign(emailSettings, response.data.email)
    // Object.assign(notificationSettings, response.data.notification)

    // Mock data for now
    Object.assign(generalSettings, {
      systemName: 'Crypto Trading Admin',
      systemDescription: 'Hệ thống quản lý giao dịch tiền điện tử',
      logoUrl: 'https://example.com/logo.png',
      faviconUrl: 'https://example.com/favicon.ico',
      timezone: 'Asia/Ho_Chi_Minh',
      defaultLanguage: 'vi'
    })

    Object.assign(securitySettings, {
      minPasswordLength: 8,
      requireComplexPassword: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      accountLockoutDuration: 15
    })

    Object.assign(emailSettings, {
      smtpServer: 'smtp.gmail.com',
      smtpPort: 587,
      fromEmail: 'noreply@example.com',
      fromName: 'Crypto Trading Admin',
      useSSL: true,
      smtpUsername: '',
      smtpPassword: ''
    })

    Object.assign(notificationSettings, {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      adminNotifications: true,
      adminEmail: 'admin@example.com'
    })
  } catch (error) {
    message.error('Không thể tải cài đặt')
  } finally {
    loading.value = false
  }
}

const saveAllSettings = async () => {
  try {
    // TODO: Replace with actual API call
    // await settingsApi.updateSettings({
    //   general: generalSettings,
    //   security: securitySettings,
    //   email: emailSettings,
    //   notification: notificationSettings
    // })

    message.success('Đã lưu cài đặt thành công')
    
    // Add to history
    settingsHistory.value.unshift({
      id: Date.now(),
      title: 'Cập nhật cài đặt',
      description: 'Cập nhật tất cả cài đặt hệ thống',
      timestamp: new Date().toISOString(),
      userName: 'Admin User',
      userAvatar: ''
    })
  } catch (error) {
    message.error('Không thể lưu cài đặt')
  }
}

const refreshData = () => {
  fetchSettings()
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
  fetchSettings()
})
</script>

<style scoped>
.settings {
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

.change-item {
  margin-left: 16px;
}

.change-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.change-time {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.change-user {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.change-description {
  color: #666;
}

.ant-card {
  margin-bottom: 24px;
}
</style>
