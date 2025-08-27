import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Home from '@/views/Home.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/kyc',
      name: 'KYC',
      component: () => import('@/views/KYC.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/wallets',
      name: 'Wallets',
      component: () => import('@/views/Wallets.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/deposits',
      name: 'Deposits',
      component: () => import('@/views/Deposits.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/withdrawals',
      name: 'Withdrawals',
      component: () => import('@/views/Withdrawals.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue')
    }
  ]
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Check if route requires authentication
  if (to.meta.requiresAuth !== false) {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      // Store the intended destination for redirect after login
      if (to.path !== '/login') {
        localStorage.setItem('redirectAfterLogin', to.fullPath);
      }
      next('/login');
      return;
    }
  }
  
  // If user is authenticated and trying to access login/register page, redirect to home
  if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    // Check if there's a stored redirect path
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin');
      next(redirectPath);
    } else {
      next('/');
    }
    return;
  }
  
  next();
});

export default router;