# Quick API Test

## Vấn đề đã sửa
- Đã thay đổi `page` và `limit` từ number sang string
- Đã cập nhật interface `UserQueryParams` để chấp nhận cả `number | string`

## Test ngay bây giờ

### 1. Chạy Admin Panel
```bash
cd admin
npm run dev
```

### 2. Truy cập Users Page
- Mở browser: `http://localhost:5173/users`
- Mở DevTools > Network tab
- Xem API call `/users`

### 3. Kiểm tra Request URL
```
Expected: GET /users?page=1&limit=10
```

### 4. Kiểm tra Response
- Nếu thành công: Sẽ thấy danh sách users
- Nếu vẫn lỗi: Sẽ thấy error message mới

## Nếu vẫn lỗi

### Kiểm tra Backend
```bash
# Kiểm tra backend có đang chạy không
curl http://localhost:3000/api/admin/v1/users?page=1&limit=10
```

### Kiểm tra CORS
- Backend có cho phép frontend gọi API không?
- CORS configuration có đúng không?

### Kiểm tra Authentication
- JWT token có hợp lệ không?
- Backend có nhận được token không?

## Debug Commands

### 1. Test API trực tiếp
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:3000/api/admin/v1/users?page=1&limit=10"
```

### 2. Test với Postman
```
GET http://localhost:3000/api/admin/v1/users?page=1&limit=10
Headers:
Authorization: Bearer YOUR_TOKEN
```

## Expected Results

### Success
```json
{
  "users": [...],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

### Still Error
```json
{
  "message": "Different error message",
  "error": "Different error type",
  "statusCode": 400
}
```

## Next Steps

1. **Test ngay**: Chạy admin panel và kiểm tra
2. **Check Network**: Xem API call và response
3. **Compare Errors**: So sánh error message mới với cũ
4. **Backend Debug**: Kiểm tra backend logs nếu cần
