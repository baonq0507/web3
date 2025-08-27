import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { UserRole } from '../types/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/auth/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('../layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/Dashboard.vue'),
          meta: { title: 'Dashboard' }
        },
        {
          path: 'users',
          name: 'Users',
          component: () => import('../views/users/UserList.vue'),
          meta: { 
            title: 'User Management',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT]
          }
        },
        {
          path: 'users/:id',
          name: 'UserDetail',
          component: () => import('../views/users/UserDetail.vue'),
          meta: { 
            title: 'User Profile',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT]
          }
        },
        {
          path: 'kyc',
          name: 'KYC',
          component: () => import('../views/kyc/KYCList.vue'),
          meta: { 
            title: 'KYC Verification',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT]
          }
        },
        {
          path: 'kyc/:id',
          name: 'KYCDetail',
          component: () => import('../views/kyc/KYCDetail.vue'),
          meta: { 
            title: 'KYC Review',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT]
          }
        },
        {
          path: 'wallets',
          name: 'Wallets',
          component: () => import('../views/wallets/WalletList.vue'),
          meta: { 
            title: 'Wallet Management',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
          }
        },
        {
          path: 'wallets/:id',
          name: 'WalletDetail',
          component: () => import('../views/wallets/WalletDetail.vue'),
          meta: { 
            title: 'Wallet Details',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
          }
        },
        {
          path: 'deposits',
          name: 'Deposits',
          component: () => import('../views/deposits/DepositList.vue'),
          meta: { 
            title: 'Deposit Management',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT]
          }
        },
        {
          path: 'withdrawals',
          name: 'Withdrawals',
          component: () => import('../views/withdrawals/WithdrawalList.vue'),
          meta: { 
            title: 'Withdrawal Management',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT]
          }
        },
        {
          path: 'trading',
          name: 'Trading',
          component: () => import('../views/trading/TradingConfig.vue'),
          meta: { 
            title: 'Trading Configuration',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
          }
        },
        {
          path: 'options',
          name: 'Options',
          component: () => import('../views/options/OptionsConfig.vue'),
          meta: { 
            title: 'Options Configuration',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
          }
        },
        {
          path: 'reports',
          name: 'Reports',
          component: () => import('../views/reports/Reports.vue'),
          meta: { 
            title: 'Reports',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.AUDITOR]
          }
        },
        {
          path: 'audit',
          name: 'Audit',
          component: () => import('../views/audit/AuditLogs.vue'),
          meta: { 
            title: 'Audit Logs',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.AUDITOR]
          }
        },
        {
          path: 'symbols',
          name: 'Symbols',
          component: () => import('../views/symbols/SymbolsList.vue'),
          meta: { 
            title: 'Symbol Management',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
          }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('../views/settings/Settings.vue'),
          meta: { 
            title: 'System Settings',
            roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
          }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth !== false) {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      // Store the intended destination for redirect after login
      if (to.path !== '/login') {
        localStorage.setItem('redirectAfterLogin', to.fullPath)
      }
      next('/login')
      return
    }
    
    // Check role-based access
    if (to.meta.roles) {
      const userRole = authStore.user?.role
      if (!userRole || !(to.meta.roles as UserRole[]).includes(userRole)) {
        next('/')
        return
      }
    }
  }
  
  // If user is authenticated and trying to access login page, redirect to dashboard
  if (to.path === '/login' && authStore.isAuthenticated) {
    // Check if there's a stored redirect path
    const redirectPath = localStorage.getItem('redirectAfterLogin')
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin')
      next(redirectPath)
    } else {
      next('/')
    }
    return
  }
  
  next()
})

export default router