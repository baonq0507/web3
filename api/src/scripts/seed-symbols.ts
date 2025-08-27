import mongoose, { connect, disconnect } from 'mongoose';
import { Symbol, SymbolSchema, SymbolType } from '../symbols/schemas/symbol.schema';

const symbolsData = [
  // CRYPTO SYMBOLS
  {
    name: 'Bitcoin',
    code: 'BTC',
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'Ethereum',
    code: 'ETH',
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Binance Coin',
    code: 'BNB',
    image: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 3
  },
  {
    name: 'Cardano',
    code: 'ADA',
    image: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 4
  },
  {
    name: 'Solana',
    code: 'SOL',
    image: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 5
  },
  {
    name: 'Polkadot',
    code: 'DOT',
    image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 6
  },
  {
    name: 'Ripple',
    code: 'XRP',
    image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 7
  },
  {
    name: 'Dogecoin',
    code: 'DOGE',
    image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 8
  },
  {
    name: 'Avalanche',
    code: 'AVAX',
    image: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 9
  },
  {
    name: 'Polygon',
    code: 'MATIC',
    image: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 10
  },
  {
    name: 'Chainlink',
    code: 'LINK',
    image: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 11
  },
  {
    name: 'Uniswap',
    code: 'UNI',
    image: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 12
  },
  {
    name: 'Litecoin',
    code: 'LTC',
    image: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 13
  },
  {
    name: 'Bitcoin Cash',
    code: 'BCH',
    image: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 14
  },
  {
    name: 'Stellar',
    code: 'XLM',
    image: 'https://cryptologos.cc/logos/stellar-xlm-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 15
  },
  {
    name: 'VeChain',
    code: 'VET',
    image: 'https://cryptologos.cc/logos/vechain-vet-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 16
  },
  {
    name: 'Filecoin',
    code: 'FIL',
    image: 'https://cryptologos.cc/logos/filecoin-fil-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 17
  },
  {
    name: 'Cosmos',
    code: 'ATOM',
    image: 'https://cryptologos.cc/logos/cosmos-atom-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 18
  },
  {
    name: 'Algorand',
    code: 'ALGO',
    image: 'https://cryptologos.cc/logos/algorand-algo-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 19
  },
  {
    name: 'Tezos',
    code: 'XTZ',
    image: 'https://cryptologos.cc/logos/tezos-xtz-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 20
  },
  {
    name: 'Monero',
    code: 'XMR',
    image: 'https://cryptologos.cc/logos/monero-xmr-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 21
  },
  {
    name: 'Dash',
    code: 'DASH',
    image: 'https://cryptologos.cc/logos/dash-dash-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 22
  },
  {
    name: 'Zcash',
    code: 'ZEC',
    image: 'https://cryptologos.cc/logos/zcash-zec-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 23
  },
  {
    name: 'EOS',
    code: 'EOS',
    image: 'https://cryptologos.cc/logos/eos-eos-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 24
  },
  {
    name: 'Tron',
    code: 'TRX',
    image: 'https://cryptologos.cc/logos/tron-trx-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 25
  },
  {
    name: 'IOTA',
    code: 'MIOTA',
    image: 'https://cryptologos.cc/logos/iota-miota-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 26
  },
  {
    name: 'NEO',
    code: 'NEO',
    image: 'https://cryptologos.cc/logos/neo-neo-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 27
  },
  {
    name: 'Waves',
    code: 'WAVES',
    image: 'https://cryptologos.cc/logos/waves-waves-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 28
  },
  {
    name: 'Qtum',
    code: 'QTUM',
    image: 'https://cryptologos.cc/logos/qtum-qtum-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 29
  },
  {
    name: 'ICON',
    code: 'ICX',
    image: 'https://cryptologos.cc/logos/icon-icx-logo.png',
    type: SymbolType.CRYPTO,
    isActive: true,
    sortOrder: 30
  },

  // FOREX SYMBOLS
  {
    name: 'Euro / US Dollar',
    code: 'EUR/USD',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 101
  },
  {
    name: 'US Dollar / Japanese Yen',
    code: 'USD/JPY',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 102
  },
  {
    name: 'British Pound / US Dollar',
    code: 'GBP/USD',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 103
  },
  {
    name: 'US Dollar / Swiss Franc',
    code: 'USD/CHF',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 104
  },
  {
    name: 'Australian Dollar / US Dollar',
    code: 'AUD/USD',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 105
  },
  {
    name: 'US Dollar / Canadian Dollar',
    code: 'USD/CAD',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 106
  },
  {
    name: 'New Zealand Dollar / US Dollar',
    code: 'NZD/USD',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 107
  },
  {
    name: 'Euro / British Pound',
    code: 'EUR/GBP',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 108
  },
  {
    name: 'Euro / Japanese Yen',
    code: 'EUR/JPY',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 109
  },
  {
    name: 'British Pound / Japanese Yen',
    code: 'GBP/JPY',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 110
  },
  {
    name: 'Euro / Swiss Franc',
    code: 'EUR/CHF',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 111
  },
  {
    name: 'British Pound / Swiss Franc',
    code: 'GBP/CHF',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 112
  },
  {
    name: 'Australian Dollar / Japanese Yen',
    code: 'AUD/JPY',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 113
  },
  {
    name: 'Canadian Dollar / Japanese Yen',
    code: 'CAD/JPY',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 114
  },
  {
    name: 'Swiss Franc / Japanese Yen',
    code: 'CHF/JPY',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 115
  },
  {
    name: 'Euro / Australian Dollar',
    code: 'EUR/AUD',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 116
  },
  {
    name: 'Euro / Canadian Dollar',
    code: 'EUR/CAD',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 117
  },
  {
    name: 'British Pound / Australian Dollar',
    code: 'GBP/AUD',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 118
  },
  {
    name: 'British Pound / Canadian Dollar',
    code: 'GBP/CAD',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 119
  },
  {
    name: 'Australian Dollar / Canadian Dollar',
    code: 'AUD/CAD',
    image: 'https://cdn-icons-png.flaticon.com/512/330/330426.png',
    type: SymbolType.FOREX,
    isActive: true,
    sortOrder: 120
  }
];

async function seedSymbols() {
  try {
    // Kết nối MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://web3:web3@103.252.122.71:27017/web3';
    await connect(mongoUri);
    console.log('Connected to MongoDB');

    // Xóa dữ liệu cũ
    const SymbolModel = mongoose.model('Symbol', SymbolSchema);
    await SymbolModel.deleteMany({});
    console.log('Cleared existing symbols');

    // Tạo symbols mới
    const createdSymbols = await SymbolModel.insertMany(symbolsData);
    console.log(`Created ${createdSymbols.length} symbols`);

    // Hiển thị danh sách symbols đã tạo theo loại
    const cryptoSymbols = createdSymbols.filter(s => s.type === SymbolType.CRYPTO);
    const forexSymbols = createdSymbols.filter(s => s.type === SymbolType.FOREX);
    
    console.log('\n=== CRYPTO SYMBOLS ===');
    cryptoSymbols.forEach(symbol => {
      console.log(`- ${symbol.name} (${symbol.code})`);
    });
    
    console.log('\n=== FOREX SYMBOLS ===');
    forexSymbols.forEach(symbol => {
      console.log(`- ${symbol.name} (${symbol.code})`);
    });

    console.log(`\nTotal: ${cryptoSymbols.length} crypto + ${forexSymbols.length} forex = ${createdSymbols.length} symbols`);
    console.log('Symbols seeding completed successfully');
  } catch (error) {
    console.error('Error seeding symbols:', error);
  } finally {
    await disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  seedSymbols();
}

export { seedSymbols };
