<template>
  <div class="withdrawals-container">
    <div class="withdrawals-header">
      <h1>Withdrawals</h1>
      <a-button type="primary">New Withdrawal</a-button>
    </div>
    
    <div class="withdrawals-content">
      <div class="withdrawal-form">
        <h2>Create New Withdrawal</h2>
        <a-form layout="vertical">
          <a-form-item label="Select Asset">
            <a-select placeholder="Choose cryptocurrency">
              <a-select-option value="btc">Bitcoin (BTC)</a-select-option>
              <a-select-option value="eth">Ethereum (ETH)</a-select-option>
              <a-select-option value="usdt">Tether (USDT)</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="Withdrawal Address">
            <a-input placeholder="Enter wallet address" />
          </a-form-item>
          
          <a-form-item label="Amount">
            <a-input-number 
              placeholder="Enter amount" 
              style="width: 100%"
              :min="0"
            />
          </a-form-item>
          
          <a-form-item label="Network Fee">
            <span class="fee-info">0.0001 BTC</span>
          </a-form-item>
          
          <a-form-item>
            <a-button type="primary" size="large" block>
              Submit Withdrawal
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      
      <div class="withdrawal-history">
        <h2>Withdrawal History</h2>
        <div class="history-item">
          <div class="history-icon">₿</div>
          <div class="history-details">
            <div class="history-amount">0.002 BTC</div>
            <div class="history-status processing">Processing</div>
            <div class="history-date">2024-01-15 16:45</div>
          </div>
        </div>
        
        <div class="history-item">
          <div class="history-icon">Ξ</div>
          <div class="history-details">
            <div class="history-amount">0.1 ETH</div>
            <div class="history-status completed">Completed</div>
            <div class="history-date">2024-01-14 11:20</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Withdrawals component logic
</script>

<style scoped>
.withdrawals-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.withdrawals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.withdrawals-header h1 {
  color: #00ffff;
  font-size: 2.5rem;
}

.withdrawals-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.withdrawal-form, .withdrawal-history {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
}

.withdrawal-form h2, .withdrawal-history h2 {
  color: #00ffff;
  margin-bottom: 2rem;
  text-align: center;
}

.fee-info {
  color: #faad14;
  font-weight: bold;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
  margin-bottom: 1rem;
}

.history-icon {
  font-size: 2rem;
  color: #00ffff;
}

.history-details {
  flex: 1;
}

.history-amount {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.history-status {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.history-status.processing {
  color: #1890ff;
}

.history-status.completed {
  color: #52c41a;
}

.history-date {
  font-size: 0.8rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .withdrawals-content {
    grid-template-columns: 1fr;
  }
}
</style>
