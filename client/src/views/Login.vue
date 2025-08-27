<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Đăng nhập</h1>
      <a-form
        :model="formData"
        @finish="handleLogin"
        layout="vertical"
        class="login-form"
      >
        <a-form-item
          label="Email"
          name="email"
          :rules="[{ required: true, message: 'Vui lòng nhập email!' }]"
        >
          <a-input
            v-model:value="formData.email"
            placeholder="Nhập email của bạn"
            size="large"
          />
        </a-form-item>

        <a-form-item
          label="Mật khẩu"
          name="password"
          :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]"
        >
          <a-input-password
            v-model:value="formData.password"
            placeholder="Nhập mật khẩu của bạn"
            size="large"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            block
          >
            Đăng nhập
          </a-button>
        </a-form-item>

        <div class="form-footer">
          <span>Chưa có tài khoản? </span>
          <router-link to="/register">Đăng ký ngay</router-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const formData = ref({
  email: '',
  password: '',
});

const handleLogin = async () => {
  loading.value = true;
  try {
    await authStore.login(formData.value.email, formData.value.password);
    message.success('Đăng nhập thành công!');
    router.push('/');
  } catch (error: any) {
    message.error(error.message || 'Đăng nhập thất bại!');
  } finally {
    loading.value = false;
  }
};
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
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.login-form {
  width: 100%;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.form-footer a {
  color: #1890ff;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>
