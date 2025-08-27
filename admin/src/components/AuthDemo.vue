<template>
  <div class="auth-demo">
    <a-card title="Authentication Demo" class="demo-card">
      <a-space direction="vertical" size="large" style="width: 100%">
        
        <!-- Trạng thái hiện tại -->
        <a-card title="Trạng thái hiện tại" size="small">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="Đã đăng nhập">
              <a-tag :color="authStore.isAuthenticated ? 'green' : 'red'">
                {{ authStore.isAuthenticated ? 'Có' : 'Không' }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Đã khởi tạo">
              <a-tag :color="authStore.isInitialized ? 'green' : 'orange'">
                {{ authStore.isInitialized ? 'Có' : 'Chưa' }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Vai trò">
              <a-tag v-if="authStore.userRole" color="blue">
                {{ authStore.userRole }}
              </a-tag>
              <span v-else>-</span>
            </a-descriptions-item>
            <a-descriptions-item label="Remember Me">
              <a-tag :color="authStore.rememberMe ? 'purple' : 'default'">
                {{ authStore.rememberMe ? 'Có' : 'Không' }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Token hết hạn">
              <span v-if="authStore.tokenExpiryTime">
                {{ formatTime(authStore.tokenExpiryTime) }}
              </span>
              <span v-else>-</span>
            </a-descriptions-item>
            <a-descriptions-item label="2FA yêu cầu">
              <a-tag :color="authStore.requiresTwoFactor ? 'orange' : 'default'">
                {{ authStore.requiresTwoFactor ? 'Có' : 'Không' }}
              </a-tag>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- Thông tin User -->
        <a-card v-if="authStore.user" title="Thông tin người dùng" size="small">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="ID">{{ authStore.user.id }}</a-descriptions-item>
            <a-descriptions-item label="Email">{{ authStore.user.email }}</a-descriptions-item>
            <a-descriptions-item label="Họ tên">{{ authStore.user.fullName }}</a-descriptions-item>
            <a-descriptions-item label="Vai trò">{{ authStore.user.role }}</a-descriptions-item>
            <a-descriptions-item label="Trạng thái">{{ authStore.user.status }}</a-descriptions-item>
            <a-descriptions-item label="KYC">{{ authStore.user.kycStatus }}</a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- Storage Info -->
        <a-card title="Thông tin Storage" size="small">
          <a-tabs>
            <a-tab-pane key="localStorage" tab="localStorage">
              <a-list size="small">
                <a-list-item v-for="(value, key) in localStorageInfo" :key="key">
                  <a-list-item-meta>
                    <template #title>{{ key }}</template>
                    <template #description>
                      <a-tag v-if="key === 'rememberMe'" :color="value === 'true' ? 'green' : 'red'">
                        {{ value === 'true' ? 'Có' : 'Không' }}
                      </a-tag>
                      <span v-else>{{ value || '-' }}</span>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="sessionStorage" tab="sessionStorage">
              <a-list size="small">
                <a-list-item v-for="(value, key) in sessionStorageInfo" :key="key">
                  <a-list-item-meta>
                    <template #title>{{ key }}</template>
                    <template #description>{{ value || '-' }}</template>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-tab-pane>
          </a-tabs>
        </a-card>

        <!-- Actions -->
        <a-card title="Hành động" size="small">
          <a-space>
            <a-button 
              type="primary" 
              @click="refreshProfile"
              :loading="authStore.isLoading"
            >
              Làm mới Profile
            </a-button>
            <a-button 
              @click="refreshToken"
              :loading="authStore.isLoading"
            >
              Làm mới Token
            </a-button>
            <a-button 
              danger 
              @click="handleLogout"
              :loading="authStore.isLoading"
            >
              Đăng xuất
            </a-button>
          </a-space>
        </a-card>

        <!-- Debug Info -->
        <a-card title="Debug Info" size="small">
          <a-button @click="showDebugInfo" size="small">
            Hiển thị Debug Info
          </a-button>
          <pre v-if="debugInfo" class="debug-info">{{ debugInfo }}</pre>
        </a-card>

      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { message } from 'ant-design-vue'

const authStore = useAuthStore()
const debugInfo = ref('')

// Computed properties for storage info
const localStorageInfo = computed(() => ({
  accessToken: localStorage.getItem('accessToken')?.substring(0, 20) + '...',
  refreshToken: localStorage.getItem('refreshToken')?.substring(0, 20) + '...',
  userData: localStorage.getItem('userData') ? 'Có dữ liệu' : 'Không có',
  tokenExpiry: localStorage.getItem('tokenExpiry') ? new Date(parseInt(localStorage.getItem('tokenExpiry')!)).toLocaleString() : 'Không có',
  rememberMe: localStorage.getItem('rememberMe'),
}))

const sessionStorageInfo = computed(() => ({
  accessToken: sessionStorage.getItem('accessToken')?.substring(0, 20) + '...',
  refreshToken: sessionStorage.getItem('refreshToken')?.substring(0, 20) + '...',
  userData: sessionStorage.getItem('userData') ? 'Có dữ liệu' : 'Không có',
  tokenExpiry: sessionStorage.getItem('tokenExpiry') ? new Date(parseInt(sessionStorage.getItem('tokenExpiry')!)).toLocaleString() : 'Không có',
}))

// Methods
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('vi-VN')
}

const refreshProfile = async () => {
  try {
    await authStore.getProfile()
    message.success('Làm mới profile thành công')
  } catch (error) {
    message.error('Làm mới profile thất bại')
  }
}

const refreshToken = async () => {
  try {
    const success = await authStore.refreshAccessToken()
    if (success) {
      message.success('Làm mới token thành công')
    } else {
      message.error('Làm mới token thất bại')
    }
  } catch (error) {
    message.error('Làm mới token thất bại')
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    message.success('Đăng xuất thành công')
  } catch (error) {
    message.error('Đăng xuất thất bại')
  }
}

const showDebugInfo = () => {
  const info = {
    authStore: {
      isAuthenticated: authStore.isAuthenticated,
      isInitialized: authStore.isInitialized,
      user: authStore.user,
      accessToken: authStore.accessToken?.substring(0, 20) + '...',
      refreshToken: authStore.refreshToken?.substring(0, 20) + '...',
      tokenExpiryTime: authStore.tokenExpiryTime,
      rememberMe: authStore.rememberMe,
      requiresTwoFactor: authStore.requiresTwoFactor,
    },
    localStorage: {
      accessToken: localStorage.getItem('accessToken')?.substring(0, 20) + '...',
      refreshToken: localStorage.getItem('refreshToken')?.substring(0, 20) + '...',
      userData: localStorage.getItem('userData') ? 'Có dữ liệu' : 'Không có',
      tokenExpiry: localStorage.getItem('tokenExpiry'),
      rememberMe: localStorage.getItem('rememberMe'),
    },
    sessionStorage: {
      accessToken: sessionStorage.getItem('accessToken')?.substring(0, 20) + '...',
      refreshToken: sessionStorage.getItem('refreshToken')?.substring(0, 20) + '...',
      userData: sessionStorage.getItem('userData') ? 'Có dữ liệu' : 'Không có',
      tokenExpiry: sessionStorage.getItem('tokenExpiry'),
    }
  }
  
  debugInfo.value = JSON.stringify(info, null, 2)
}

onMounted(() => {
  // Auto-refresh debug info every 5 seconds
  setInterval(() => {
    if (debugInfo.value) {
      showDebugInfo()
    }
  }, 5000)
})
</script>

<style scoped>
.auth-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-card {
  margin-bottom: 20px;
}

.debug-info {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
