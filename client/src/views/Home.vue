<template>
  <div class="home-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">Web3</div>
        <div class="header-actions">
          <Button type="text" class="header-btn">
            <SearchOutlined />
          </Button>
          <Button type="text" class="header-btn">
            <UserOutlined />
          </Button>
          <Button type="text" class="header-btn">
            <MenuOutlined />
          </Button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <video
          autoplay
          muted
          loop
          playsinline
          class="hero-video-bg"
        >
          <source src="@/assets/video/home-banner.mp4" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">
          More than <span class="highlight">36 million users</span> joined Web3
        </h1>
        <p class="hero-subtitle">Safe, Fast, Easy Transactions</p>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-value">$75,31100 million</div>
            <div class="stat-label">Trading Volume</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">100+</div>
            <div class="stat-label">Countries</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">20 million</div>
            <div class="stat-label">Users</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Market Data Bar -->
    <section class="market-data">
      <div v-if="isLoading" class="loading-state">
        <Spin size="large" />
        <p>Loading market data...</p>
      </div>
      <div v-else-if="loadingError" class="error-state">
        <Alert 
          message="Error loading data" 
          :description="loadingError"
          type="error" 
          show-icon
        />
      </div>
      <div v-else class="market-scroll">
        <div class="market-item" v-for="crypto in topCryptoData" :key="crypto.symbol">
          <span class="pair">{{ formatSymbol(crypto.symbol) }}</span>
          <span class="price">{{ formatPrice(crypto.price) }}</span>
          <span class="change" :class="crypto.change >= 0 ? 'positive' : 'negative'">
            {{ crypto.change >= 0 ? '+' : '' }}{{ crypto.change.toFixed(2) }}%
          </span>
        </div>
      </div>
    </section>

    <!-- Promotional Cards -->
    <section class="promo-cards">
      <div class="promo-card promo-card-1"></div>
      <div class="promo-card promo-card-2"></div>
      <div class="promo-card promo-card-3"></div>
    </section>

    <!-- For Everyone Section -->
    <section class="for-everyone">
      <h2 class="section-title">
        A cryptocurrency exchange for <span class="highlight">Everyone</span>
      </h2>
      <div class="metrics">
        <div class="metric-item">
          <div class="metric-icon">🌙</div>
          <div class="metric-value">9M+</div>
          <div class="metric-label">Clients</div>
        </div>
        <div class="metric-item">
          <div class="metric-icon">🌍</div>
          <div class="metric-value">190+</div>
          <div class="metric-label">Countries Supported</div>
        </div>
        <div class="metric-item">
          <div class="metric-icon">💰</div>
          <div class="metric-value">$207B+</div>
          <div class="metric-label">Quarterly Trading Volume</div>
        </div>
      </div>
    </section>

    <!-- Web3 Journey Section -->
    <section class="web3-journey">
      <h2 class="section-title">
        Web3 journey starts from <span class="highlight">here!</span>
      </h2>
      
      <!-- Connection Status -->
      <div class="connection-status" :class="{ connected: isConnected }">
        <div class="status-indicator"></div>
        <span class="status-text">{{ connectionStatus }}</span>
      </div>

      <!-- Crypto Price Table -->
      <div class="crypto-table-container">
        <div v-if="isLoading" class="loading-state">
          <Spin size="large" />
          <p>Loading crypto data...</p>
        </div>
        <div v-else-if="loadingError" class="error-state">
          <Alert 
            message="Error loading crypto data" 
            :description="loadingError"
            type="error" 
            show-icon
          />
        </div>
        <div v-else>
          <div class="table-header">
            <div class="header-item">Crypto</div>
            <div class="header-item">Price</div>
            <div class="header-item">24h Change</div>
            <div class="header-item">24h Volume</div>
            <div class="header-item">Market Cap</div>
            <div class="header-item">Chart</div>
          </div>
          
          <div class="crypto-table">
            <div class="crypto-row" v-for="crypto in cryptoData" :key="crypto.symbol">
              <div class="crypto-info">
                <div class="crypto-icon">{{ crypto.icon }}</div>
                <div class="crypto-details">
                  <div class="crypto-name">{{ crypto.name }}</div>
                  <div class="crypto-symbol">{{ formatSymbol(crypto.symbol) }}</div>
                </div>
              </div>
              <div class="crypto-price">${{ formatPrice(crypto.price) }}</div>
              <div class="crypto-change" :class="crypto.change >= 0 ? 'positive' : 'negative'">
                {{ crypto.change >= 0 ? '+' : '' }}{{ crypto.change.toFixed(2) }}%
              </div>
              <div class="crypto-volume">${{ formatVolume(crypto.volume) }}</div>
              <div class="crypto-marketcap">${{ formatMarketCap(crypto.marketCap) }}</div>
              <div class="crypto-chart">
                <canvas :id="'chart-' + crypto.symbol" width="100" height="40"></canvas>
                <div v-if="!charts[crypto.symbol]" class="chart-loading">Loading...</div>
                <div v-if="charts[crypto.symbol]" class="chart-loaded">✓</div>
              </div>
            </div>
          </div>
          
          <div class="show-more-btn">
            <Button type="primary" size="large">
              Show more →
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Trend Analysis Section -->
    <section class="trend-analysis">
      <div class="trend-header">
        <h2 class="section-title">Trend Analysis</h2>
        <div class="trend-controls">
          <Button type="primary" ghost>1H</Button>
          <Button type="primary" ghost>4H</Button>
          <Button type="primary" ghost>1D</Button>
          <Button type="primary" ghost>1W</Button>
        </div>
      </div>
      
      <div class="selected-assets">
        <div class="asset-item active">
          <span class="asset-icon">₿</span>
          <span class="asset-name">BTC</span>
        </div>
        <div class="asset-item">
          <span class="asset-icon">Ξ</span>
          <span class="asset-name">ETH</span>
        </div>
        <div class="asset-item">
          <span class="asset-icon">🟡</span>
          <span class="asset-name">BNB</span>
        </div>
        <div class="asset-item">
          <span class="asset-icon">🔵</span>
          <span class="asset-name">ADA</span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2024 Web3. All rights reserved.</p>
    </footer>

    <!-- Floating Chat -->
    <div class="floating-chat">
      <MessageOutlined />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchOutlined, UserOutlined, MenuOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { Spin, Alert, Button } from 'ant-design-vue';
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { Chart } from 'chart.js/auto';
import { getCryptoPrices, subscribeToPriceUpdates, type CryptoData } from '../api/crypto';

// Debug Chart.js import
console.log('Chart.js imported:', typeof Chart);
console.log('Chart.js version:', Chart?.version);
console.log('Chart.js available at module level:', Chart);

// List of crypto symbols to track
const cryptoSymbols = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT',
  'XRPUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'MATICUSDT',
  'LINKUSDT', 'UNIUSDT', 'LTCUSDT', 'BCHUSDT', 'ATOMUSDT',
  'ETCUSDT', 'FILUSDT', 'NEARUSDT', 'ALGOUSDT', 'ICPUSDT'
];

// Reactive data - Will be populated from API
const cryptoData = ref<CryptoData[]>([]);
const isLoading = ref(true);
const loadingError = ref<string | null>(null);

// WebSocket connection
let ws: WebSocket | null = null;
const charts = ref<{ [key: string]: Chart | null }>({});
const isConnected = ref(false);
const connectionStatus = ref('Disconnected');
const chartsInitialized = ref(false);
const lastUpdateTime = ref<{ [key: string]: number }>({});
const UPDATE_THROTTLE = 1000; // 1000ms between updates to prevent stack overflow
const maxUpdatesPerSecond = 1; // 1 update per second per chart
const updateCounts = ref<{ [key: string]: number }>({});
const updateCountResetTime = ref<{ [key: string]: number }>({});
const chartErrorCount = ref<{ [key: string]: number }>({}); // Track chart errors
const chartUpdateStatus = ref<{ [key: string]: boolean }>({}); // Track chart update status
const MAX_CHART_ERRORS = 3; // Allow 3 errors before disabling chart updates
const chartUpdateQueue = ref<{ [key: string]: number[] }>({}); // Queue for chart updates

// Computed properties
const topCryptoData = computed(() => {
  return cryptoData.value.slice(0, 3); // Show top 3 crypto in market bar
});

// Formatting functions
const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
};

const formatVolume = (volume: number): string => {
  if (volume >= 1000) {
    return (volume / 1000).toFixed(1) + 'B';
  }
  return volume.toFixed(1) + 'M';
};

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1000) {
    return (marketCap / 1000).toFixed(1) + 'T';
  }
  return marketCap.toFixed(1) + 'B';
};

const formatSymbol = (symbol: string): string => {
  // Remove USDT suffix and format nicely
  return symbol.replace('USDT', '/USDT');
};

// Load crypto data from API
const loadCryptoData = async () => {
  try {
    isLoading.value = true;
    loadingError.value = null;
    
    console.log('Loading crypto data from Binance API...');
    const data = await getCryptoPrices(cryptoSymbols);
    
    if (data && data.length > 0) {
      cryptoData.value = data;
      console.log(`Loaded ${data.length} crypto pairs from API:`, data);
      
      // Initialize charts after data is loaded
      nextTick(() => {
        // Add a longer delay to ensure DOM is fully ready
        setTimeout(() => {
          console.log('About to initialize charts after data load...');
          initCharts();
          // Connect WebSocket after charts are initialized
          connectWebSocket();
        }, 500);
      });
    } else {
      throw new Error('No data received from API');
    }
  } catch (error) {
    console.error('Error loading crypto data:', error);
    loadingError.value = error instanceof Error ? error.message : 'Failed to load crypto data';
    
    // Initialize charts with fallback data
    cryptoData.value = cryptoSymbols.map(symbol => ({
      symbol,
      name: symbol.replace('USDT', ''),
      icon: '🪙',
      price: 0,
      change: 0,
      volume: 0,
      marketCap: 0,
      chartData: Array(20).fill(100)
    }));
    
    console.log('Using fallback data:', cryptoData.value);
    
    nextTick(() => {
      console.log('About to initialize charts with fallback data...');
      initCharts();
    });
  } finally {
    isLoading.value = false;
  }
};

// Initialize charts
const initCharts = () => {
  console.log('Initializing charts...');
  console.log('cryptoData:', cryptoData.value);
  
  // Clear existing charts first
  Object.values(charts.value).forEach(chart => {
    try {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    } catch (error) {
      console.error('Error destroying existing chart:', error);
    }
  });
  charts.value = {};
  
      // Wait a bit more to ensure DOM is fully ready
    setTimeout(() => {
      console.log('Starting chart initialization...');
      console.log('Available cryptoData:', cryptoData.value);
      console.log('DOM ready state:', document.readyState);
      console.log('Available canvas elements:', document.querySelectorAll('canvas'));
      
      // Clear all canvas elements to ensure they're ready for new charts
      cryptoData.value.forEach(crypto => {
        const canvas = document.getElementById(`chart-${crypto.symbol}`) as HTMLCanvasElement;
        if (canvas) {
          console.log(`Found canvas for ${crypto.symbol}:`, canvas);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        } else {
          console.warn(`Canvas not found for ${crypto.symbol}`);
        }
      });
    
    // Disable Chart.js plugins globally to prevent errors
    if (typeof Chart !== 'undefined' && Chart.defaults) {
      try {
        Chart.defaults.plugins.tooltip.enabled = false;
        Chart.defaults.plugins.legend.display = false;
        Chart.defaults.events = [];
        console.log('Chart.js plugins disabled successfully');
      } catch (error) {
        console.warn('Could not disable Chart.js plugins globally:', error);
      }
    } else {
      console.warn('Chart.js not available or defaults not accessible');
    }

    // Initialize all charts at once to prevent flickering
    const chartPromises = cryptoData.value.map(async (crypto) => {
      const canvas = document.getElementById(`chart-${crypto.symbol}`) as HTMLCanvasElement;
      if (canvas) {
        console.log(`Creating chart for ${crypto.symbol} with data:`, crypto.chartData);
        // Clear any existing content on the canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Clear the canvas completely
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          try {
            // Ensure chartData is valid
            const validChartData = crypto.chartData && crypto.chartData.length > 0 
              ? crypto.chartData 
              : Array(20).fill(100);
            
            console.log(`Creating chart for ${crypto.symbol} with valid data:`, validChartData);
            
            console.log(`About to create Chart.js instance for ${crypto.symbol}`);
            const chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: Array.from({ length: validChartData.length }, (_, i) => i),
                datasets: [{
                  data: validChartData,
                  borderColor: '#00ffff',
                  backgroundColor: 'rgba(0, 255, 255, 0.1)',
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 0
                }]
              },
              options: {
                responsive: false, // Disable responsive to prevent fullSize issues
                maintainAspectRatio: false,
                animation: false, // Disable animations to prevent stack overflow
                events: [], // Disable all events to prevent plugin errors
                plugins: {
                  legend: { 
                    display: false 
                  },
                  tooltip: { 
                    enabled: false 
                  }
                },
                scales: {
                  x: { 
                    display: false,
                    grid: {
                      display: false
                    }
                  },
                  y: { 
                    display: false,
                    grid: {
                      display: false
                    }
                  }
                },
                interaction: { 
                  intersect: false,
                  mode: 'nearest' // Use safe interaction mode
                },
                elements: {
                  point: {
                    radius: 0
                  }
                },
                // Chart.js v4 specific options to prevent fullSize errors
                layout: {
                  padding: 0
                },
                devicePixelRatio: 1,
                // Additional options to prevent responsive issues
                resizeDelay: 0,
                // Prevent fullSize errors in Chart.js v4
                // These options are handled internally by Chart.js
                // Force manual sizing to prevent fullSize errors
                // These will be set on the canvas element directly
              }
            });
            
            // Store chart reference
            charts.value[crypto.symbol] = chart;
            
            // Force canvas dimensions to prevent fullSize errors
            if (chart.canvas) {
              chart.canvas.width = 100;
              chart.canvas.height = 40;
              chart.canvas.style.width = '100px';
              chart.canvas.style.height = '40px';
            }
            
            console.log(`Chart created successfully for ${crypto.symbol}:`, chart);
            console.log(`Chart data:`, chart.data);
            console.log(`Chart options:`, chart.options);
            
            // Small delay to prevent overwhelming the browser
            await new Promise(resolve => setTimeout(resolve, 50));
            
          } catch (error) {
            console.error(`Error creating chart for ${crypto.symbol}:`, error);
            if (error instanceof Error) {
              console.error(`Error details:`, error.message, error.stack);
            }
            charts.value[crypto.symbol] = null;
          }
        } else {
          console.error(`Could not get 2D context for ${crypto.symbol}`);
        }
      } else {
        console.error(`Canvas not found for ${crypto.symbol}`);
        console.error(`Available canvas elements:`, document.querySelectorAll('canvas'));
      }
    });

    // Wait for all charts to be initialized
    Promise.all(chartPromises).then(() => {
      chartsInitialized.value = true;
      console.log('All charts initialized successfully. Charts object:', charts.value);
      console.log('Charts count:', Object.keys(charts.value).length);
    }).catch((error) => {
      console.error('Error initializing charts:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      chartsInitialized.value = false;
    });
  }, 200); // Wait 200ms to ensure DOM is ready
};

// WebSocket functions for Binance
const connectWebSocket = () => {
  try {
    // Use the new API service for WebSocket connection
    if (cryptoData.value.length === 0) {
      console.warn('No crypto data available, skipping WebSocket connection');
      return;
    }
    
    const symbols = cryptoData.value.map(crypto => crypto.symbol);
    console.log('Connecting to Binance WebSocket for symbols:', symbols);
    connectionStatus.value = 'Connecting...';
    
    ws = subscribeToPriceUpdates(symbols, (updateData) => {
      // Update crypto data with real-time prices
      const cryptoIndex = cryptoData.value.findIndex(crypto => crypto.symbol === updateData.symbol);
      if (cryptoIndex !== -1) {
        const oldPrice = cryptoData.value[cryptoIndex].price;
        const newPrice = updateData.price;
        
        // Update price and change
        cryptoData.value[cryptoIndex].price = newPrice;
        cryptoData.value[cryptoIndex].change = updateData.change;
        
        // Update chart data with new price point
        updateChartData(updateData.symbol, newPrice, oldPrice);
        
        console.log(`Updated ${updateData.symbol}: Price: $${newPrice}, Change: ${updateData.change}%`);
      }
    });
    
    ws.onopen = () => {
      console.log('Connected to Binance WebSocket');
      isConnected.value = true;
      connectionStatus.value = 'Connected to Binance';
    };
    
    // WebSocket message handling is now handled by the API service
    // The subscribeToPriceUpdates function will call the callback with price updates
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      connectionStatus.value = 'Connection Error';
      isConnected.value = false;
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      connectionStatus.value = 'Disconnected';
      isConnected.value = false;
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (!isConnected.value) {
          connectWebSocket();
        }
      }, 5000);
    };
    
  } catch (error) {
    console.error('Error connecting to WebSocket:', error);
    connectionStatus.value = 'Connection Failed';
  }
};

// Function to update chart data with new price
const updateChartData = (symbol: string, newPrice: number, oldPrice: number) => {
  try {
    const chart = charts.value[symbol];
    // if (!chart) {
    //   console.warn(`Chart not found for ${symbol}`);
    //   return;
    // }
    
    // Check if chart updates are disabled due to errors
    if (chartUpdateStatus.value[symbol] === false) {
      return; // Skip update if chart is disabled
    }
    
    // Initialize chart status if not set
    if (chartUpdateStatus.value[symbol] === undefined) {
      chartUpdateStatus.value[symbol] = true;
    }
    
    // Check throttle to prevent too many updates
    const now = Date.now();
    const lastUpdate = lastUpdateTime.value[symbol] || 0;
    if (now - lastUpdate < UPDATE_THROTTLE) {
      return; // Skip update if too soon
    }
    
    // Validate chart data before updating
    if (!chart.data || !chart.data.datasets || !chart.data.datasets[0]) {
      console.warn(`Invalid chart data for ${symbol}, skipping update`);
      return;
    }
    
    // Additional chart state validation to prevent fullSize errors
    if (!chart.canvas || !chart.ctx || chart.canvas.width === 0 || chart.canvas.height === 0) {
      console.warn(`Invalid chart canvas for ${symbol}, skipping update`);
      return;
    }
    
    // Check if chart is in a valid state for updates
    if (chart.options && chart.options.responsive === false && chart.options.maintainAspectRatio === false) {
      // Chart is configured for manual sizing, this should prevent fullSize errors
    } else {
      console.warn(`Chart ${symbol} has responsive options that may cause fullSize errors`);
    }
    
    // Get current chart data safely
    const currentData = chart.data.datasets[0].data as number[];
    if (!Array.isArray(currentData)) {
      console.warn(`Invalid chart data format for ${symbol}, skipping update`);
      return;
    }
    
    // Add new price point to the end
    const newData = [...currentData, newPrice];
    
    // Keep only last 20 data points to maintain chart size
    if (newData.length > 20) {
      newData.splice(0, newData.length - 20);
    }
    
    // Update chart data safely
    try {
      chart.data.datasets[0].data = newData;
      chart.data.labels = Array.from({ length: newData.length }, (_, i) => i);
      
      // Update chart colors based on price movement
      if (newPrice > oldPrice) {
        chart.data.datasets[0].borderColor = '#52c41a'; // Green for price increase
        chart.data.datasets[0].backgroundColor = 'rgba(82, 196, 26, 0.1)';
      } else if (newPrice < oldPrice) {
        chart.data.datasets[0].borderColor = '#ff4d4f'; // Red for price decrease
        chart.data.datasets[0].backgroundColor = 'rgba(255, 77, 79, 0.1)';
      } else {
        chart.data.datasets[0].borderColor = '#00ffff'; // Cyan for no change
        chart.data.datasets[0].backgroundColor = 'rgba(0, 255, 255, 0.1)';
      }
    } catch (dataError) {
      console.warn(`Error updating chart data for ${symbol}:`, dataError);
      return;
    }
    
    // Update the chart safely for Chart.js v4
    try {
      // Use a more robust approach to avoid fullSize errors
      if (chart && typeof chart.update === 'function') {
        // Force chart to recalculate dimensions before update
        if (chart.resize) {
          chart.resize();
        }
        
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          try {
            if (chart && typeof chart.update === 'function') {
              // Additional safety check
              if (chart.canvas && chart.canvas.width > 0 && chart.canvas.height > 0) {
                // Try update first, fallback to render if it fails
                // try {
                //   chart.update('none');
                // } catch (updateError) {
                //   console.warn(`Chart update failed, trying render for ${symbol}:`, updateError);
                //   // Fallback to render method which is safer
                //   if (typeof chart.render === 'function') {
                //     chart.render();
                //   }
                // }
              }
            }
          } catch (innerError) {
            console.warn(`Inner chart update failed for ${symbol}:`, innerError);
          }
        }, 0);
      }
    } catch (updateError) {
      console.warn(`Chart update failed for ${symbol}, will retry next time:`, updateError);
      // Don't throw error, just log warning
    }
    
    // Update timestamp
    lastUpdateTime.value[symbol] = now;
    
    console.log(`Chart updated for ${symbol}: New data points: ${newData.length}, Price: $${newPrice}`);
    
  } catch (error) {
    console.error(`Error updating chart for ${symbol}:`, error);
    chartErrorCount.value[symbol] = (chartErrorCount.value[symbol] || 0) + 1;
    
    // Disable chart updates if too many errors
    if (chartErrorCount.value[symbol] >= MAX_CHART_ERRORS) {
      console.warn(`Chart updates disabled for ${symbol} due to too many errors`);
      chartUpdateStatus.value[symbol] = false;
    }
  }
};

// Lifecycle hooks
onMounted(() => {
  console.log('Component mounted, Chart.js available:', typeof Chart);
  console.log('Chart.js version:', Chart?.version);
  console.log('Chart.js defaults:', Chart?.defaults);
  console.log('DOM ready state:', document.readyState);
  
  // Wait for DOM to be ready, then load data from API
  nextTick(() => {
    try {
          // Add a small delay to ensure DOM is fully ready
    setTimeout(() => {
      console.log('DOM delay completed, loading crypto data...');
      // Load crypto data first, then initialize charts and WebSocket
      loadCryptoData();
    }, 100);
    } catch (error) {
      console.error('Error in onMounted:', error);
    }
  });
});

onUnmounted(() => {
  // Close WebSocket connection
  if (ws) {
    ws.close();
    ws = null;
  }
  
  // Destroy charts safely
  Object.values(charts.value).forEach(chart => {
    try {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    } catch (error) {
      console.error('Error destroying chart:', error);
    }
  });
  charts.value = {};
  
  // Reset all status variables
  chartUpdateStatus.value = {};
  chartErrorCount.value = {};
  updateCounts.value = {};
  lastUpdateTime.value = {};
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.header-btn {
  color: #ffffff !important;
  border: none !important;
  background: transparent !important;
  padding: 0.5rem !important;
  border-radius: 8px !important;
  transition: all 0.3s ease;
}

.header-btn:hover {
  background: rgba(0, 255, 255, 0.1) !important;
  transform: translateY(-2px);
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 2rem;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.hero-video-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
}

.hero-content {
  max-width: 800px;
  z-index: 1;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.highlight {
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.8;
  font-weight: 300;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 3rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #00ffff;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Market Data Bar */
.market-data {
  background: rgba(0, 255, 255, 0.05);
  border-top: 1px solid rgba(0, 255, 255, 0.1);
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
  padding: 1rem 0;
  overflow: hidden;
}

.market-scroll {
  display: flex;
  gap: 2rem;
  animation: scroll-left 30s linear infinite;
  white-space: nowrap;
}

.market-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
}

.pair {
  font-size: 0.9rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.price {
  font-size: 1.2rem;
  font-weight: 600;
  color: #00ffff;
}

.change {
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.change.positive {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.change.negative {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

@keyframes scroll-left {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

/* Promotional Cards */
.promo-cards {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.promo-card {
  height: 200px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
  border: 1px solid rgba(0, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.promo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 255, 255, 0.2);
}

/* For Everyone Section */
.for-everyone {
  text-align: center;
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 4rem;
  line-height: 1.2;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
}

.metric-item {
  text-align: center;
}

.metric-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #00ffff;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 1.1rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Web3 Journey Section */
.web3-journey {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  padding: 1rem 2rem;
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid rgba(255, 77, 79, 0.3);
  border-radius: 8px;
  color: #ff4d4f;
  max-width: 300px;
}

.connection-status.connected {
  background: rgba(82, 196, 26, 0.1);
  border-color: rgba(82, 196, 26, 0.3);
  color: #52c41a;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-weight: 500;
}

/* Crypto Table */
.crypto-table-container {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(0, 255, 255, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #00ffff;
}

.header-item {
  text-align: center;
}

.crypto-table {
  margin-bottom: 2rem;
}

.crypto-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;
}

.crypto-row:hover {
  background: rgba(0, 255, 255, 0.05);
}

.crypto-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.crypto-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 50%;
}

.crypto-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.crypto-symbol {
  font-size: 0.9rem;
  opacity: 0.7;
  text-transform: uppercase;
}

.crypto-price,
.crypto-change,
.crypto-volume,
.crypto-marketcap {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.crypto-change.positive {
  color: #52c41a;
}

.crypto-change.negative {
  color: #ff4d4f;
}

.crypto-chart {
  display: flex;
  align-items: center;
  justify-content: center;
}

.show-more-btn {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 255, 255, 0.1);
  opacity: 0.7;
}

/* Trend Analysis Section */
.trend-analysis {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.trend-controls {
  display: flex;
  gap: 0.5rem;
}

.selected-assets {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.asset-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.asset-item:hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: rgba(0, 255, 255, 0.3);
}

.asset-item.active {
  background: rgba(0, 255, 255, 0.2);
  border-color: #00ffff;
}

.asset-icon {
  font-size: 1.2rem;
}

.asset-name {
  font-weight: 600;
}

/* Footer */
.footer {
  text-align: center;
  padding: 2rem;
  border-top: 1px solid rgba(0, 255, 255, 0.1);
  opacity: 0.7;
}

.floating-chat {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: #00ffff;
  color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  transition: transform 0.3s;
}

.floating-chat:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-cta {
    flex-direction: column;
    align-items: center;
  }
  
  .email-input {
    min-width: 250px;
  }
  
  .hero-stats {
    gap: 2rem;
  }
  
  .promo-cards {
    grid-template-columns: 1fr;
  }
  
  .trend-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .selected-assets {
    flex-direction: column;
    gap: 1rem;
  }
  
  .crypto-table-container {
    padding: 0 1rem;
  }
  
  .table-header,
  .crypto-row {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }
  
  .crypto-volume,
  .crypto-marketcap,
  .crypto-chart {
    display: none;
  }
}

.promo-card-1 {
  background-image: url('@/assets/images/promo1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 200px;
}

.promo-card-2 {
  background-image: url('@/assets/images/promo2.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 200px;
}

.promo-card-3 {
  background-image: url('@/assets/images/promo3.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 200px;
}

/* Loading and Error States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  color: #00ffff;
}

.loading-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
  opacity: 0.8;
}

.error-state {
  padding: 2rem;
  text-align: center;
}

.error-state .ant-alert {
  max-width: 500px;
  margin: 0 auto;
}

.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  color: #00ffff;
  opacity: 0.7;
}

.chart-loaded {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  color: #52c41a;
  opacity: 0.8;
}

.crypto-chart {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
