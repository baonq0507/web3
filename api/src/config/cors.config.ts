export const corsConfig = {
  // Development origins
  development: [
    'http://localhost:3001',  // Admin frontend
    'http://localhost:3002',  // Client frontend
    'http://localhost:3003',  // Mobile app
    'http://localhost:8080',  // Alternative dev port
    'http://localhost:8081',  // Alternative dev port
    'http://127.0.0.1:3001', // Local IP
    'http://127.0.0.1:3002', // Local IP
    'http://127.0.0.1:3003', // Local IP
    'http://127.0.0.1:8080', // Local IP
    'http://127.0.0.1:8081', // Local IP
    'http://192.168.1.*',    // Local network
    'http://10.0.0.*',       // Local network
    'http://172.16.*',       // Local network
  ],
  
  // Production origins (example)
  production: [
    'https://yourdomain.com',
    'https://admin.yourdomain.com',
    'https://app.yourdomain.com',
    'https://mobile.yourdomain.com',
  ],
  
  // Test origins
  test: [
    'http://localhost:3001',
    'http://localhost:3002',
  ],
  
  // Allowed methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  
  // Allowed headers
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
    'X-Client-Version',
    'X-Platform',
    'X-Request-ID',
    'X-Correlation-ID',
  ],
  
  // Exposed headers
  exposedHeaders: [
    'Content-Length',
    'X-Total-Count',
    'X-API-Version',
    'X-Request-ID',
    'X-Correlation-ID',
  ],
  
  // Credentials
  credentials: true,
  
  // Preflight continue
  preflightContinue: false,
  
  // Options success status
  optionsSuccessStatus: 204,
  
  // Max age
  maxAge: 86400, // 24 hours
};
