<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>User Profile</h1>
    </div>
    
    <div class="profile-content">
      <div class="profile-card">
        <div class="avatar-section">
          <div class="avatar">👤</div>
          <h2>User Name</h2>
          <p>user@email.com</p>
        </div>
        
        <div class="profile-info">
          <div class="info-item">
            <label>Full Name:</label>
            <span>John Doe</span>
          </div>
          <div class="info-item">
            <label>Phone:</label>
            <span>+1234567890</span>
          </div>
          <div class="info-item">
            <label>Country:</label>
            <span>United States</span>
          </div>
          <div class="info-item">
            <label>KYC Status:</label>
            <span class="status verified">Verified</span>
          </div>
        </div>
        
        <div class="profile-actions">
          <a-button type="primary">Edit Profile</a-button>
          <a-button>Change Password</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Profile component logic
</script>

<style scoped>
.profile-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-header h1 {
  color: #00ffff;
  font-size: 2.5rem;
}

.profile-card {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
}

.avatar-section {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.avatar-section h2 {
  color: #00ffff;
  margin-bottom: 0.5rem;
}

.avatar-section p {
  opacity: 0.7;
}

.profile-info {
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
}

.info-item label {
  font-weight: bold;
  color: #00ffff;
}

.status.verified {
  color: #52c41a;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
