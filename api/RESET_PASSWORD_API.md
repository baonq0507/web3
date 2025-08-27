# Reset Password API Documentation

## Overview
API endpoint để admin có thể đặt lại mật khẩu cho người dùng. Mật khẩu mới sẽ được tạo ngẫu nhiên và trả về để admin có thể copy.

## Endpoint
```
POST /users/:id/reset-password
```

## Parameters
- `id` (path parameter): ID của người dùng cần đặt lại mật khẩu

## Request Body
```json
{
  "newPassword": "ignored", // Sẽ bị bỏ qua, backend tự tạo mật khẩu
  "reason": "Lý do đặt lại mật khẩu (optional)"
}
```

## Response
```json
{
  "newPassword": "Ax7#mK9$pL2", // Mật khẩu mới được tạo
  "user": {
    // Thông tin người dùng đã được cập nhật
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "forcePasswordReset": true,
    "adminNotes": "...",
    // ... các trường khác
  }
}
```

## Features
1. **Tự động tạo mật khẩu**: Backend sẽ tạo mật khẩu ngẫu nhiên 12 ký tự
2. **Hash mật khẩu**: Mật khẩu mới sẽ được hash bằng bcrypt với salt rounds = 12
3. **Force reset flag**: Đặt `forcePasswordReset = true` để bắt buộc người dùng đổi mật khẩu
4. **Admin notes**: Ghi lại lịch sử thay đổi mật khẩu
5. **Bảo mật**: Không trả về mật khẩu cũ, chỉ trả về mật khẩu mới

## Security Considerations
- Chỉ admin mới có thể gọi API này
- Mật khẩu cũ sẽ bị xóa hoàn toàn
- Tất cả session hiện tại sẽ bị vô hiệu hóa
- Người dùng sẽ bị bắt buộc đổi mật khẩu khi đăng nhập lần sau

## Usage Example

### Frontend (Vue.js)
```typescript
const resetPassword = async (userId: string) => {
  try {
    const response = await usersApi.resetPassword(userId, 'User requested password reset');
    const newPassword = response.newPassword;
    
    // Hiển thị mật khẩu mới để admin copy
    console.log('New password:', newPassword);
    
    // Có thể gửi mật khẩu qua email hoặc SMS cho người dùng
  } catch (error) {
    console.error('Failed to reset password:', error);
  }
};
```

### Backend Test
```bash
# Sử dụng curl
curl -X POST http://localhost:3000/users/507f1f77bcf86cd799439011/reset-password \
  -H "Content-Type: application/json" \
  -d '{"newPassword": "ignored", "reason": "Test reset"}'

# Hoặc sử dụng script test
node test-reset-password.js
```

## Error Handling
- `400 Bad Request`: ID người dùng không hợp lệ
- `404 Not Found`: Không tìm thấy người dùng
- `500 Internal Server Error`: Lỗi server khi tạo mật khẩu mới

## Database Changes
Khi gọi API này, các trường sau sẽ được cập nhật:
- `password`: Mật khẩu mới đã hash
- `forcePasswordReset`: `true`
- `adminNotes`: Ghi lại lịch sử thay đổi
- `updatedAt`: Thời gian cập nhật
