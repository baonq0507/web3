<template>
  <div class="deposits-container">
    <div class="deposits-header">
      <h1>Deposits</h1>
      <a-button type="primary">New Deposit</a-button>
    </div>
    
    <div class="deposits-content">
      <div class="deposit-form">
        <h2>Create New Deposit</h2>
        <a-form layout="vertical">
          <a-form-item label="Select Asset">
            <a-select placeholder="Choose cryptocurrency">
              <a-select-option value="btc">Bitcoin (BTC)</a-select-option>
              <a-select-option value="eth">Ethereum (ETH)</a-select-option>
              <a-select-option value="usdt">Tether (USDT)</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="Network">
            <a-select placeholder="Select network">
              <a-select-option value="mainnet">Mainnet</a-select-option>
              <a-select-option value="testnet">Testnet</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="Amount">
            <a-input-number 
              placeholder="Enter amount" 
              style="width: 100%"
              :min="0"
            />
          </a-form-item>
          
          <a-form-item>
            <a-button type="primary" size="large" block>
              Generate Deposit Address
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      
      <div class="deposit-history">
        <h2>Deposit History</h2>
        <div class="history-item">
          <div class="history-icon">₿</div>
          <div class="history-details">
            <div class="history-amount">0.001 BTC</div>
            <div class="history-status pending">Pending</div>
            <div class="history-date">2024-01-15 14:30</div>
          </div>
        </div>
        
        <div class="history-item">
          <div class="history-icon">Ξ</div>
          <div class="history-details">
            <div class="history-amount">0.05 ETH</div>
            <div class="history-status completed">Completed</div>
            <div class="history-date">2024-01-14 09:15</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Deposits component logic
</script>

<style scoped>
.deposits-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.deposits-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.deposits-header h1 {
  color: #00ffff;
  font-size: 2.5rem;
}

.deposits-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.deposit-form, .deposit-history {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
}

.deposit-form h2, .deposit-history h2 {
  color: #00ffff;
  margin-bottom: 2rem;
  text-align: center;
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

.history-status.pending {
  color: #faad14;
}

.history-status.completed {
  color: #52c41a;
}

.history-date {
  font-size: 0.8rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .deposits-content {
    grid-template-columns: 1fr;
  }
}
</style>
