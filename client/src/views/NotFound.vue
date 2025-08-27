<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-icon">🚀</div>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      
      <div class="not-found-actions">
        <a-button type="primary" @click="$router.push('/')">
          Go Home
        </a-button>
        <a-button @click="$router.go(-1)">
          Go Back
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// NotFound component logic
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: white;
  text-align: center;
  padding: 2rem;
}

.not-found-content {
  max-width: 500px;
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.not-found-content h1 {
  font-size: 6rem;
  color: #00ffff;
  margin: 0;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
}

.not-found-content h2 {
  font-size: 2rem;
  margin: 1rem 0;
  color: #00ffff;
}

.not-found-content p {
  font-size: 1.1rem;
  opacity: 0.8;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.not-found-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
