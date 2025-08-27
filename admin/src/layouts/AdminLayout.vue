<template>
  <a-layout class="admin-layout">
    <!-- Sidebar -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="admin-sider"
    >
      <div class="logo">
        <h2 v-if="!collapsed">Crypto Admin</h2>
        <h2 v-else>CA</h2>
      </div>
      
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        theme="dark"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <template #icon>
            <DashboardOutlined />
          </template>
          {{ $t('navigation.dashboard') }}
        </a-menu-item>
        
        <a-menu-item key="users" v-if="canAccess(['superadmin', 'admin', 'support'])">
          <template #icon>
            <UserOutlined />
          </template>
          {{ $t('navigation.users') }}
        </a-menu-item>
        
        <a-menu-item key="kyc" v-if="canAccess(['superadmin', 'admin', 'support'])">
          <template #icon>
            <IdcardOutlined />
          </template>
          {{ $t('navigation.kyc') }}
        </a-menu-item>
        
        <a-menu-item key="wallets" v-if="canAccess(['superadmin', 'admin'])">
          <template #icon>
            <WalletOutlined />
          </template>
          {{ $t('navigation.wallets') }}
        </a-menu-item>
        
        <a-menu-item key="deposits" v-if="canAccess(['superadmin', 'admin', 'support'])">
          <template #icon>
            <ArrowUpOutlined />
          </template>
          {{ $t('navigation.deposits') }}
        </a-menu-item>
        
        <a-menu-item key="withdrawals" v-if="canAccess(['superadmin', 'admin', 'support'])">
          <template #icon>
            <ArrowDownOutlined />
          </template>
          {{ $t('navigation.withdrawals') }}
        </a-menu-item>
        
        <a-menu-item key="trading" v-if="canAccess(['superadmin', 'admin'])">
          <template #icon>
            <!-- <TradingViewOutlined /> -->
          </template>
          {{ $t('navigation.trading') }}
        </a-menu-item>
        
        <a-menu-item key="options" v-if="canAccess(['superadmin', 'admin'])">
          <template #icon>
            <SettingOutlined />
          </template>
          {{ $t('navigation.options') }}
        </a-menu-item>
        
        <a-menu-item key="symbols" v-if="canAccess(['superadmin', 'admin'])">
          <template #icon>
            <TagOutlined />
          </template>
          {{ $t('navigation.symbols') }}
        </a-menu-item>
        
        <a-menu-item key="reports" v-if="canAccess(['superadmin', 'admin', 'auditor'])">
          <template #icon>
            <BarChartOutlined />
          </template>
          {{ $t('navigation.reports') }}
        </a-menu-item>
        
        <a-menu-item key="audit" v-if="canAccess(['superadmin', 'admin', 'auditor'])">
          <template #icon>
            <AuditOutlined />
          </template>
          {{ $t('navigation.audit') }}
        </a-menu-item>
        
        <a-menu-item key="settings" v-if="canAccess(['superadmin', 'admin'])">
          <template #icon>
            <SettingOutlined />
          </template>
          {{ $t('navigation.settings') }}
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- Main content -->
    <a-layout>
      <!-- Header -->
      <a-layout-header class="admin-header">
        <div class="header-left">
          <a-button
            type="text"
            @click="collapsed = !collapsed"
            class="trigger"
          >
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
          </a-button>
          
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item>{{ currentPageTitle }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        
        <div class="header-right">
          <!-- Language selector -->
          <a-dropdown>
            <a-button type="text" class="lang-selector">
              <GlobalOutlined />
              {{ currentLanguage }}
            </a-button>
            <template #overlay>
              <a-menu @click="changeLanguage">
                <a-menu-item key="vi">Tiếng Việt</a-menu-item>
                <a-menu-item key="en">English</a-menu-item>
                <a-menu-item key="fr">Français</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          
          <!-- User menu -->
          <a-dropdown>
            <a-button type="text" class="user-menu">
              <UserOutlined />
              {{ authStore.user?.fullName }}
            </a-button>
            <template #overlay>
              <a-menu @click="handleUserMenuClick">
                <a-menu-item key="profile">
                  <UserOutlined />
                  {{ $t('common.profile') }}
                </a-menu-item>
                <a-menu-item key="logout">
                  <LogoutOutlined />
                  {{ $t('auth.logout') }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- Content -->
      <a-layout-content class="admin-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import {
  DashboardOutlined,
  UserOutlined,
  IdcardOutlined,
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  // TradingViewOutlined,
  SettingOutlined,
  BarChartOutlined,
  AuditOutlined,
  TagOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GlobalOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const authStore = useAuthStore()

// State
const collapsed = ref(false)
const selectedKeys = ref<string[]>([])

// Computed
const currentPageTitle = computed(() => {
  return route.meta.title ? t(route.meta.title as string) : ''
})

const currentLanguage = computed(() => {
  const langMap: Record<string, string> = {
    vi: 'VI',
    en: 'EN',
    fr: 'FR'
  }
  return langMap[locale.value] || 'VI'
})

const canAccess = computed(() => (roles: string[]) => {
  return authStore.canAccess(roles)
})

// Methods
const handleMenuClick = ({ key }: { key: string }) => {
  router.push(`/${key === 'dashboard' ? '' : key}`)
}

const handleUserMenuClick = ({ key }: { key: string }) => {
  if (key === 'logout') {
    authStore.logout()
    router.push('/login')
  } else if (key === 'profile') {
    // Handle profile navigation
    router.push('/users/profile')
  }
}

const changeLanguage = ({ key }: { key: string }) => {
  locale.value = key
  localStorage.setItem('locale', key)
}

// Watch route changes to update selected menu item
watch(
  () => route.path,
  (path) => {
    const key = path === '/' ? 'dashboard' : path.split('/')[1]
    selectedKeys.value = [key]
  },
  { immediate: true }
)

// Initialize auth on mount
onMounted(async () => {
  await authStore.initializeAuth()
})
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.admin-sider {
  background: #001529;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border-bottom: 1px solid #303030;
}

.admin-header {
  background: white;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.trigger {
  font-size: 18px;
  padding: 0 12px;
}

.breadcrumb {
  margin-left: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.lang-selector,
.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-content {
  margin: 24px;
  padding: 24px;
  background: white;
  border-radius: 6px;
  min-height: calc(100vh - 112px);
}
</style>
