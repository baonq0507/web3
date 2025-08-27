import mongoose, { connect, disconnect } from 'mongoose';
import { Symbol, SymbolSchema } from '../symbols/schemas/symbol.schema';

const symbolsData = [
  {
    name: 'Bitcoin',
    code: 'BTC',
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'Ethereum',
    code: 'ETH',
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Binance Coin',
    code: 'BNB',
    image: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    isActive: true,
    sortOrder: 3
  },
  {
    name: 'Cardano',
    code: 'ADA',
    image: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    isActive: true,
    sortOrder: 4
  },
  {
    name: 'Solana',
    code: 'SOL',
    image: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    isActive: true,
    sortOrder: 5
  },
  {
    name: 'Polkadot',
    code: 'DOT',
    image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
    isActive: true,
    sortOrder: 6
  },
  {
    name: 'Ripple',
    code: 'XRP',
    image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    isActive: true,
    sortOrder: 7
  },
  {
    name: 'Dogecoin',
    code: 'DOGE',
    image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
    isActive: true,
    sortOrder: 8
  },
  {
    name: 'Avalanche',
    code: 'AVAX',
    image: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    isActive: true,
    sortOrder: 9
  },
  {
    name: 'Polygon',
    code: 'MATIC',
    image: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    isActive: true,
    sortOrder: 10
  }
];

async function seedSymbols() {
  try {
    // Kết nối MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-trading';
    await connect(mongoUri);
    console.log('Connected to MongoDB');

    // Xóa dữ liệu cũ
    const SymbolModel = mongoose.model('Symbol', SymbolSchema);
    await SymbolModel.deleteMany({});
    console.log('Cleared existing symbols');

    // Tạo symbols mới
    const createdSymbols = await SymbolModel.insertMany(symbolsData);
    console.log(`Created ${createdSymbols.length} symbols`);

    // Hiển thị danh sách symbols đã tạo
    createdSymbols.forEach(symbol => {
      console.log(`- ${symbol.name} (${symbol.code})`);
    });

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
