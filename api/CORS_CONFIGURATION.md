# CORS Configuration Guide

## 🌐 Tổng quan

API này được cấu hình để hỗ trợ nhiều origin khác nhau thông qua cấu hình CORS linh hoạt. Hệ thống sẽ tự động xử lý CORS dựa trên môi trường và cấu hình tùy chỉnh.

## 🚀 Cấu hình mặc định

### Development Environment
- **Ports được hỗ trợ**: 3001, 3002, 3003, 8080, 8081
- **Local IPs**: 127.0.0.1, 192.168.1.*, 10.0.0.*, 172.16.*
- **Wildcard**: Cho phép tất cả origin trong development

### Production Environment
- **Domains mẫu**: yourdomain.com, admin.yourdomain.com, app.yourdomain.com
- **Bảo mật**: Chỉ cho phép các domain đã được cấu hình

### Test Environment
- **Ports**: 3001, 3002
- **Giới hạn**: Chỉ cho phép các origin cần thiết cho testing

## ⚙️ Cấu hình tùy chỉnh

### 1. Thông qua Environment Variables

Tạo file `.env` trong thư mục `api/`:

```bash
# CORS Configuration
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com,https://mobile.yourdomain.com

# Environment
NODE_ENV=development
```

### 2. Cấu hình trong code

Chỉnh sửa file `src/config/cors.config.ts`:

```typescript
export const corsConfig = {
  development: [
    'http://localhost:3001',
    'http://localhost:3002',
    'http://your-custom-domain.com',
  ],
  
  production: [
    'https://yourdomain.com',
    'https://admin.yourdomain.com',
  ],
  
  // ... other configurations
};
```

## 🔧 Các tùy chọn CORS

### Methods được hỗ trợ
- GET, POST, PUT, DELETE, PATCH, OPTIONS

### Headers được hỗ trợ
- Origin, X-Requested-With, Content-Type, Accept
- Authorization, X-API-Key, X-Client-Version, X-Platform
- X-Request-ID, X-Correlation-ID

### Headers được expose
- Content-Length, X-Total-Count, X-API-Version
- X-Request-ID, X-Correlation-ID

### Credentials
- `credentials: true` - Hỗ trợ cookies và authentication headers

## 📱 Ví dụ sử dụng

### 1. Frontend Application
```javascript
// Vue.js, React, Angular, etc.
const response = await fetch('http://localhost:3000/api/admin/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.0.0',
    'X-Platform': 'web',
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123'
  })
});
```

### 2. Mobile Application
```javascript
// React Native, Flutter, etc.
const response = await fetch('http://localhost:3000/api/admin/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.0.0',
    'X-Platform': 'mobile',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123'
  })
});
```

### 3. Postman/Insomnia
```
Headers:
- X-Client-Version: 1.0.0
- X-Platform: postman

Body (raw JSON):
{
  "email": "admin@example.com",
  "password": "password123"
}
```

## 🛡️ Bảo mật

### Development Mode
- Cho phép tất cả origin (`*`)
- Phù hợp cho development và testing

### Production Mode
- Chỉ cho phép các domain đã được cấu hình
- Không cho phép wildcard origin
- Bảo mật cao hơn

### Rate Limiting
- Giới hạn 100 requests mỗi phút
- Bảo vệ khỏi DDoS attacks

## 🚨 Xử lý sự cố

### CORS Error: "No 'Access-Control-Allow-Origin' header"
1. Kiểm tra origin của request có trong danh sách được phép không
2. Kiểm tra cấu hình `CORS_ORIGINS` trong file `.env`
3. Đảm bảo `NODE_ENV` được set đúng

### Preflight Request Fails
1. Kiểm tra method có được hỗ trợ không
2. Kiểm tra headers có được cho phép không
3. Kiểm tra cấu hình `optionsSuccessStatus`

### Credentials Not Working
1. Đảm bảo `credentials: true` trong cấu hình
2. Kiểm tra `Access-Control-Allow-Credentials` header
3. Không sử dụng `origin: *` khi có credentials

## 📋 Checklist

- [ ] Cấu hình `CORS_ORIGINS` trong file `.env`
- [ ] Set `NODE_ENV` phù hợp
- [ ] Kiểm tra origin của frontend application
- [ ] Test với Postman/Insomnia
- [ ] Verify preflight requests
- [ ] Test credentials nếu cần

## 🔗 Tài liệu tham khảo

- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [NestJS CORS](https://docs.nestjs.com/techniques/security#cors)
- [Express CORS](https://expressjs.com/en/resources/middleware/cors.html)
