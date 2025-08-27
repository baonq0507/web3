<template>
  <div class="wallets-container">
    <div class="wallets-header">
      <h1>My Wallets</h1>
      <a-button type="primary">Create New Wallet</a-button>
    </div>
    
    <div class="wallets-content">
      <div class="wallet-card">
        <div class="wallet-header">
          <div class="wallet-icon">₿</div>
          <div class="wallet-info">
            <h3>Bitcoin Wallet</h3>
            <p>BTC Address: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
          </div>
        </div>
        
        <div class="wallet-balance">
          <div class="balance-amount">0.00000000 BTC</div>
          <div class="balance-usd">≈ $0.00 USD</div>
        </div>
        
        <div class="wallet-actions">
          <a-button>Deposit</a-button>
          <a-button>Withdraw</a-button>
          <a-button>Transfer</a-button>
        </div>
      </div>
      
      <div class="wallet-card">
        <div class="wallet-header">
          <div class="wallet-icon">Ξ</div>
          <div class="wallet-info">
            <h3>Ethereum Wallet</h3>
            <p>ETH Address: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6</p>
          </div>
        </div>
        
        <div class="wallet-balance">
          <div class="balance-amount">0.00000000 ETH</div>
          <div class="balance-usd">≈ $0.00 USD</div>
        </div>
        
        <div class="wallet-actions">
          <a-button>Deposit</a-button>
          <a-button>Withdraw</a-button>
          <a-button>Transfer</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Wallets component logic
</script>

<style scoped>
.wallets-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.wallets-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.wallets-header h1 {
  color: #00ffff;
  font-size: 2.5rem;
}

.wallets-content {
  display: grid;
  gap: 2rem;
}

.wallet-card {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
}

.wallet-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.wallet-icon {
  font-size: 3rem;
  color: #00ffff;
}

.wallet-info h3 {
  color: #00ffff;
  margin-bottom: 0.5rem;
}

.wallet-info p {
  opacity: 0.7;
  font-size: 0.9rem;
}

.wallet-balance {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.balance-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ffff;
  margin-bottom: 0.5rem;
}

.balance-usd {
  opacity: 0.7;
}

.wallet-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
