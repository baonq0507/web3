<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Đăng ký</h1>
      <a-form
        :model="formData"
        @finish="handleRegister"
        layout="vertical"
        class="register-form"
      >
        <a-form-item
          label="Họ và tên"
          name="fullName"
          :rules="[{ required: true, message: 'Vui lòng nhập họ và tên!' }]"
        >
          <a-input
            v-model:value="formData.fullName"
            placeholder="Nhập họ và tên của bạn"
            size="large"
          />
        </a-form-item>

        <a-form-item
          label="Email"
          name="email"
          :rules="[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]"
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
          :rules="[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
          ]"
        >
          <a-input-password
            v-model:value="formData.password"
            placeholder="Nhập mật khẩu của bạn"
            size="large"
          />
        </a-form-item>

        <a-form-item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          :rules="[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            { validator: validateConfirmPassword }
          ]"
        >
          <a-input-password
            v-model:value="formData.confirmPassword"
            placeholder="Xác nhận mật khẩu của bạn"
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
            Đăng ký
          </a-button>
        </a-form-item>

        <div class="form-footer">
          <span>Đã có tài khoản? </span>
          <router-link to="/login">Đăng nhập ngay</router-link>
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
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const validateConfirmPassword = async (_rule: any, value: string) => {
  if (value !== formData.value.password) {
    throw new Error('Mật khẩu xác nhận không khớp!');
  }
};

const handleRegister = async () => {
  loading.value = true;
  try {
    await authStore.register(formData.value);
    message.success('Đăng ký thành công! Vui lòng đăng nhập.');
    router.push('/login');
  } catch (error: any) {
    message.error(error.message || 'Đăng ký thất bại!');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-card h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.register-form {
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
