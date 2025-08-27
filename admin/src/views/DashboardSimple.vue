<template>
  <div class="dashboard-simple">
    <div class="dashboard-header">
      <h1>{{ $t('navigation.dashboard') }}</h1>
      <p>Chào mừng trở lại, {{ authStore.user?.fullName || authStore.user?.email || 'User' }}!</p>
      <p>Vai trò: {{ authStore.user?.role || 'Unknown' }} | Trạng thái: {{ authStore.user?.status || 'Unknown' }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <a-card class="stat-card">
        <Statistic
          title="Total Users"
          :value="stats.totalUsers"
          :value-style="{ color: '#3f8600' }"
        >
          <template #prefix>
            <UserOutlined />
          </template>
        </Statistic>
      </a-card>

      <a-card class="stat-card">
        <Statistic
          title="Pending KYC"
          :value="stats.pendingKYC"
          :value-style="{ color: '#cf1322' }"
        >
          <template #prefix>
            <IdcardOutlined />
          </template>
        </Statistic>
      </a-card>

      <a-card class="stat-card">
        <Statistic
          title="Total Deposits"
          :value="stats.totalDeposits"
          :value-style="{ color: '#1890ff' }"
          prefix="$"
        >
          <template #prefix>
            <ArrowUpOutlined />
          </template>
        </Statistic>
      </a-card>

      <a-card class="stat-card">
        <Statistic
          title="Total Withdrawals"
          :value="stats.totalWithdrawals"
          :value-style="{ color: '#722ed1' }"
          prefix="$"
        >
          <template #prefix>
            <ArrowDownOutlined />
          </template>
        </Statistic>
      </a-card>
    </div>

    <!-- Recent Activity -->
    <div class="dashboard-content">
      <div class="content-row">
        <!-- Recent Users -->
        <a-card title="Recent Users" class="content-card">
          <a-list
            :data-source="recentUsers"
            :loading="loading"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item v-if="item">
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar>{{ item.username?.charAt(0) || 'U' }}</a-avatar>
                  </template>
                  <template #title>
                    <router-link :to="`/users/${item.id}`">
                      {{ item.username || 'Unknown User' }}
                    </router-link>
                  </template>
                  <template #description>
                    {{ item.email || 'No email' }} • {{ item.role || 'No role' }}
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <a-tag :color="getStatusColor(item.status || 'unknown')">
                    {{ item.status || 'unknown' }}
                  </a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>

        <!-- Recent KYC Submissions -->
        <a-card title="Recent KYC Submissions" class="content-card">
          <a-list
            :data-source="recentKYC"
            :loading="loading"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item v-if="item && item.user">
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar>{{ item.user.firstName?.charAt(0) || 'U' }}</a-avatar>
                  </template>
                  <template #title>
                    <router-link :to="`/kyc/${item.id}`">
                      {{ item.user.fullName || 'Unknown User' }}
                    </router-link>
                  </template>
                  <template #description>
                    Submitted {{ formatDate(item.submittedAt) }}
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <a-tag :color="getKYCStatusColor(item.status || 'unknown')">
                    {{ item.status || 'unknown' }}
                  </a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </div>

      <!-- System Status -->
      <a-card title="System Status" class="content-card">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-statistic
              title="API Status"
              :value="systemStatus.api"
              :value-style="{ color: systemStatus.api === 'Healthy' ? '#3f8600' : '#cf1322' }"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
              title="Database"
              :value="systemStatus.database"
              :value-style="{ color: systemStatus.database === 'Connected' ? '#3f8600' : '#cf1322' }"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
              title="Redis"
              :value="systemStatus.redis"
              :value-style="{ color: systemStatus.redis === 'Connected' ? '#3f8600' : '#cf1322' }"
            />
          </a-col>
        </a-row>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Statistic } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { reportsApi, usersApi } from '@/api'
import {
  UserOutlined,
  IdcardOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons-vue'

const { t } = useI18n()
const authStore = useAuthStore()

// State
const loading = ref(false)
const stats = ref({
  totalUsers: 0,
  pendingKYC: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
})

const recentUsers = ref<any[]>([])
const recentKYC = ref<any[]>([])
const systemStatus = ref({
  api: 'Healthy',
  database: 'Connected',
  redis: 'Connected',
})

// Methods
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    active: 'green',
    suspended: 'orange',
    locked: 'red',
    pending_kyc: 'blue',
    unknown: 'default',
  }
  return colorMap[status] || 'default'
}

const getKYCStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
    not_submitted: 'default',
    unknown: 'default',
  }
  return colorMap[status] || 'default'
}

const formatDate = (date: string): string => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString()
  } catch (error) {
    return 'Invalid Date'
  }
}

const loadDashboardData = async () => {
  loading.value = true
  try {
    // Load dashboard stats from API
    const response = await reportsApi.getDashboardStats()
    const dashboardStats = response?.data
    
    // Check if the response has the expected structure
    if (dashboardStats && dashboardStats.users && dashboardStats.kyc && dashboardStats.transactions) {
      stats.value = {
        totalUsers: dashboardStats.users.total || 0,
        pendingKYC: dashboardStats.kyc.pending || 0,
        totalDeposits: dashboardStats.transactions.deposits?.total || 0,
        totalWithdrawals: dashboardStats.transactions.withdrawals?.total || 0,
      }
    } else {
      console.warn('Dashboard stats response structure is not as expected:', dashboardStats)
      // Fallback to default values if structure is unexpected
      stats.value = {
        totalUsers: 0,
        pendingKYC: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
      }
    }

    // Load recent users
    try {
      const recentUsersResponse = await usersApi.getUsers({ 
        page: 1, 
        limit: 5 
      })
      recentUsers.value = recentUsersResponse?.users || []
    } catch (error) {
      console.error('Error loading recent users:', error)
      recentUsers.value = []
    }
    
    // For now, using empty array for KYC
    recentKYC.value = []
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    // Fallback to default values
    stats.value = {
      totalUsers: 0,
      pendingKYC: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard-simple {
  padding: 0;
}

.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-header h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.dashboard-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.content-card {
  height: fit-content;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .content-row {
    grid-template-columns: 1fr;
  }
}
</style>
