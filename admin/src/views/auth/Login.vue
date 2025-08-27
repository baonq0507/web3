<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Crypto Trading Admin</h1>
        <p>{{ $t('auth.login') }}</p>
      </div>

      <a-form
        :model="formData"
        :rules="rules"
        @finish="handleLogin"
        layout="vertical"
        class="login-form"
      >
        <a-form-item
          name="email"
          :label="$t('auth.email')"
        >
          <a-input
            v-model:value="formData.email"
            size="large"
            :placeholder="$t('auth.email')"
            prefix="📧"
          />
        </a-form-item>

        <a-form-item
          name="password"
          :label="$t('auth.password')"
        >
          <a-input-password
            v-model:value="formData.password"
            size="large"
            :placeholder="$t('auth.password')"
            prefix="🔒"
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox
            v-model:checked="formData.rememberMe"
          >
            {{ $t('auth.rememberMe') }}
          </a-checkbox>
        </a-form-item>

        <a-form-item
          v-if="requiresTwoFactor"
          name="twoFactorCode"
          :label="$t('auth.twoFactorCode')"
        >
          <a-input
            v-model:value="formData.twoFactorCode"
            size="large"
            :placeholder="$t('auth.twoFactorCode')"
            prefix="🔐"
            maxlength="6"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="isLoading"
            block
          >
            {{ requiresTwoFactor ? $t('common.submit') : $t('auth.login') }}
          </a-button>
        </a-form-item>
      </a-form>

      <div v-if="error" class="error-message">
        <a-alert
          :message="error"
          type="error"
          show-icon
        />
      </div>

      <div class="login-footer">
        <p>Demo Accounts:</p>
        <div class="demo-accounts">
          <div class="demo-account">
            <strong>Super Admin:</strong> superadmin@cryptotrading.com / SuperAdmin123!
          </div>
          <div class="demo-account">
            <strong>Admin:</strong> admin@cryptotrading.com / Admin123!
          </div>
          <div class="demo-account">
            <strong>Support:</strong> support@cryptotrading.com / Support123!
          </div>
          <div class="demo-account">
            <strong>Auditor:</strong> auditor@cryptotrading.com / Auditor123!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { message } from 'ant-design-vue'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()

// State
const formData = reactive({
  email: '',
  password: '',
  twoFactorCode: '',
  rememberMe: false,
})

const error = ref('')
const isLoading = computed(() => authStore.isLoading)
const requiresTwoFactor = computed(() => authStore.requiresTwoFactor)

// Form validation rules
const rules = {
  email: [
    { required: true, message: t('auth.email') + ' is required' },
    { type: 'email', message: 'Please enter a valid email' },
  ],
  password: [
    { required: true, message: t('auth.password') + ' is required' },
    { min: 8, message: 'Password must be at least 8 characters' },
  ],
  twoFactorCode: [
    { required: true, message: t('auth.twoFactorCode') + ' is required' },
    { len: 6, message: '2FA code must be 6 digits' },
  ],
}

// Methods
const handleLogin = async () => {
  try {
    error.value = ''
    
    if (requiresTwoFactor.value) {
      // Handle 2FA verification
      const result = await authStore.verifyTwoFactor(formData.twoFactorCode)
      if (result.success) {
        message.success(t('auth.loginSuccess'))
        // Redirect to intended destination or dashboard
        const redirectPath = localStorage.getItem('redirectAfterLogin')
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin')
          router.push(redirectPath)
        } else {
          router.push('/')
        }
      } else {
        error.value = result.error
      }
    } else {
      // Handle initial login
      const result = await authStore.login(formData.email, formData.password, undefined, formData.rememberMe)
      if (result.requiresTwoFactor) {
        // 2FA required, form will show 2FA input
        message.info(t('auth.twoFactorRequired'))
        return
      } else if (result.success) {
        message.success(t('auth.loginSuccess'))
        // Redirect to intended destination or dashboard
        const redirectPath = localStorage.getItem('redirectAfterLogin')
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin')
          router.push(redirectPath)
        } else {
          router.push('/')
        }
      } else {
        error.value = result.error
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Login failed'
  }
}

// Clear 2FA requirement when email/password changes
const clearTwoFactor = () => {
  if (requiresTwoFactor.value) {
    authStore.clearTwoFactorRequirement()
    formData.twoFactorCode = ''
  }
}

// Watch for email/password changes to clear 2FA
watch(
  () => [formData.email, formData.password],
  () => clearTwoFactor()
)
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  color: #1890ff;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: bold;
}

.login-header p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.login-form {
  margin-bottom: 24px;
}

.error-message {
  margin-bottom: 24px;
}

.login-footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
  text-align: center;
}

.login-footer p {
  margin-bottom: 16px;
  color: #666;
  font-weight: 500;
}

.demo-accounts {
  text-align: left;
}

.demo-account {
  margin-bottom: 8px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
}

.demo-account strong {
  color: #1890ff;
}
</style>
