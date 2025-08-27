<template>
  <div class="auth-loading">
    <div class="loading-content">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <h2>Đang khởi tạo hệ thống...</h2>
      <p>Vui lòng chờ trong giây lát</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component này hiển thị loading state trong khi khởi tạo authentication
</script>

<style scoped>
.auth-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-spinner {
  margin-bottom: 24px;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
}

p {
  margin: 0;
  font-size: 16px;
  opacity: 0.8;
}
</style>
