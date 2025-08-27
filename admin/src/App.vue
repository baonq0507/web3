<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import AuthLoading from './components/AuthLoading.vue'

const authStore = useAuthStore()

const isLoading = computed(() => !authStore.isInitialized)

onMounted(async () => {
  // Initialize authentication state
  await authStore.initializeAuth()
})
</script>

<template>
  <div id="app">
    <AuthLoading v-if="isLoading" />
    <router-view v-else />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
