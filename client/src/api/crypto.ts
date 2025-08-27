import apiClient from './client';

// Binance API endpoints
const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

// Crypto data structure
export interface CryptoData {
  symbol: string;
  name: string;
  icon: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  chartData: number[];
}

// Binance ticker response
interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  askPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

// Binance kline/candlestick response
interface BinanceKline {
  0: number; // Open time
  1: string; // Open price
  2: string; // High price
  3: string; // Low price
  4: string; // Close price
  5: string; // Volume
  6: number; // Close time
  7: string; // Quote asset volume
  8: number; // Number of trades
  9: string; // Taker buy base asset volume
  10: string; // Taker buy quote asset volume
  11: string; // Ignore
}

// Get current prices for multiple symbols
export const getCryptoPrices = async (symbols: string[]): Promise<CryptoData[]> => {
  try {
    // Get 24hr ticker for all symbols
    const tickerResponse = await fetch(`${BINANCE_API_BASE}/ticker/24hr`);
    const tickers: BinanceTicker[] = await tickerResponse.json();
    
    // Filter only USDT pairs
    const usdtTickers = tickers.filter(ticker => 
      symbols.includes(ticker.symbol) && ticker.symbol.endsWith('USDT')
    );

    // Get historical data for charts
    const cryptoDataPromises = usdtTickers.map(async (ticker) => {
      try {
        // Get last 20 klines (1 hour intervals)
        const klineResponse = await fetch(
          `${BINANCE_API_BASE}/klines?symbol=${ticker.symbol}&interval=1h&limit=20`
        );
        const klines: BinanceKline[] = await klineResponse.json();
        
        // Extract close prices for chart data
        const chartData = klines.map(kline => parseFloat(kline[4])); // Close price
        
        // Calculate price change
        const currentPrice = parseFloat(ticker.lastPrice);
        const openPrice = parseFloat(ticker.openPrice);
        const priceChange = currentPrice - openPrice;
        const priceChangePercent = (priceChange / openPrice) * 100;
        
        // Get crypto name and icon
        const symbolInfo = getSymbolInfo(ticker.symbol);
        
        return {
          symbol: ticker.symbol,
          name: symbolInfo.name,
          icon: symbolInfo.icon,
          price: currentPrice,
          change: priceChangePercent,
          volume: parseFloat(ticker.volume),
          marketCap: 0, // Binance doesn't provide market cap in ticker
          chartData: chartData
        };
      } catch (error) {
        console.error(`Error fetching data for ${ticker.symbol}:`, error);
        // Return fallback data
        return getFallbackData(ticker.symbol);
      }
    });

    const cryptoData = await Promise.all(cryptoDataPromises);
    return cryptoData.filter(data => data !== null);
    
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    // Return fallback data if API fails
    return symbols.map(symbol => getFallbackData(symbol));
  }
};

// Get symbol information
const getSymbolInfo = (symbol: string): { name: string; icon: string } => {
  const symbolMap: { [key: string]: { name: string; icon: string } } = {
    'BTCUSDT': { name: 'Bitcoin', icon: '₿' },
    'ETHUSDT': { name: 'Ethereum', icon: 'Ξ' },
    'BNBUSDT': { name: 'BNB', icon: '🟡' },
    'ADAUSDT': { name: 'Ada', icon: '🔵' },
    'SOLUSDT': { name: 'Sol', icon: '🟣' },
    'XRPUSDT': { name: 'XRP', icon: '❌' },
    'DOTUSDT': { name: 'Pol', icon: '🔴' },
    'DOGEUSDT': { name: 'Doge', icon: '🐕' },
    'AVAXUSDT': { name: 'Avax', icon: '🟠' },
    'MATICUSDT': { name: 'Matic', icon: '🟣' },
    'LINKUSDT': { name: 'Chainlink', icon: '🔗' },
    'UNIUSDT': { name: 'Uniswap', icon: '🦄' },
    'LTCUSDT': { name: 'Litecoin', icon: 'Ł' },
    'BCHUSDT': { name: 'Bitcoin Cash', icon: '₿' },
    'ATOMUSDT': { name: 'Cosmos', icon: '⚛️' },
    'ETCUSDT': { name: 'Ethereum Classic', icon: 'Ξ' },
    'FILUSDT': { name: 'Filecoin', icon: '📁' },
    'NEARUSDT': { name: 'NEAR', icon: '🌐' },
    'ALGOUSDT': { name: 'Algorand', icon: '🔷' },
    'ICPUSDT': { name: 'Internet Computer', icon: '🌐' }
  };
  
  return symbolMap[symbol] || { name: symbol.replace('USDT', ''), icon: '🪙' };
};

// Get fallback data when API fails
const getFallbackData = (symbol: string): CryptoData => {
  const symbolInfo = getSymbolInfo(symbol);
  return {
    symbol,
    name: symbolInfo.name,
    icon: symbolInfo.icon,
    price: 0,
    change: 0,
    volume: 0,
    marketCap: 0,
    chartData: Array(20).fill(100)
  };
};

// Get real-time price updates via WebSocket
export const subscribeToPriceUpdates = (
  symbols: string[], 
  onUpdate: (data: { symbol: string; price: number; change: number }) => void
) => {
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbols.map(s => s.toLowerCase() + '@ticker').join('/')}`);
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.s && data.c && data.P) {
        onUpdate({
          symbol: data.s,
          price: parseFloat(data.c),
          change: parseFloat(data.P)
        });
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return ws;
};
