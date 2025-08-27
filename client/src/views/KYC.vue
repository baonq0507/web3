<template>
  <div class="kyc-container">
    <div class="kyc-header">
      <h1>KYC Verification</h1>
      <p>Complete your identity verification to unlock all features</p>
    </div>
    
    <div class="kyc-content">
      <div class="kyc-card">
        <h2>Personal Information</h2>
        <a-form layout="vertical">
          <a-form-item label="Full Name">
            <a-input placeholder="Enter your full name" />
          </a-form-item>
          
          <a-form-item label="Date of Birth">
            <a-date-picker style="width: 100%" />
          </a-form-item>
          
          <a-form-item label="Nationality">
            <a-select placeholder="Select your nationality">
              <a-select-option value="us">United States</a-select-option>
              <a-select-option value="vn">Vietnam</a-select-option>
              <a-select-option value="uk">United Kingdom</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="ID Number">
            <a-input placeholder="Enter your ID number" />
          </a-form-item>
          
          <a-form-item label="Address">
            <a-textarea placeholder="Enter your full address" rows="3" />
          </a-form-item>
        </a-form>
        
        <div class="kyc-actions">
          <a-button type="primary" size="large">Submit KYC</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// KYC component logic
</script>

<style scoped>
.kyc-container {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.kyc-header {
  text-align: center;
  margin-bottom: 2rem;
}

.kyc-header h1 {
  color: #00ffff;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.kyc-header p {
  opacity: 0.7;
  font-size: 1.1rem;
}

.kyc-card {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
}

.kyc-card h2 {
  color: #00ffff;
  margin-bottom: 2rem;
  text-align: center;
}

.kyc-actions {
  text-align: center;
  margin-top: 2rem;
}
</style>
