# Tính năng Authentication nâng cao

## Tổng quan

Hệ thống admin đã được cải thiện với các tính năng authentication nâng cao để cải thiện trải nghiệm người dùng và bảo mật.

## Các tính năng chính

### 1. Lưu trạng thái đăng nhập (Remember Me)

- **Checkbox "Remember Me"**: Người dùng có thể chọn lưu đăng nhập lâu dài
- **Lưu trữ thông minh**: 
  - Nếu chọn "Remember Me": Lưu vào `localStorage` (dữ liệu được giữ lại sau khi đóng trình duyệt)
  - Nếu không chọn: Lưu vào `sessionStorage` (dữ liệu chỉ giữ trong phiên hiện tại)

### 2. Auto-refresh Token

- **Tự động làm mới**: Token được tự động refresh 5 phút trước khi hết hạn
- **Xử lý lỗi**: Nếu refresh thất bại, người dùng sẽ được đăng xuất tự động
- **Không gián đoạn**: Người dùng không cần đăng nhập lại khi token hết hạn

### 3. Khởi tạo Authentication thông minh

- **Kiểm tra token**: Tự động kiểm tra token có hợp lệ khi load trang
- **Khôi phục session**: Tự động khôi phục phiên đăng nhập nếu token còn hợp lệ
- **Loading state**: Hiển thị loading trong khi khởi tạo authentication

### 4. Quản lý Storage tập trung

- **AuthStorage utility**: Class tiện ích để quản lý việc lưu trữ authentication
- **Xử lý lỗi**: Xử lý các trường hợp lỗi một cách nhất quán
- **Dọn dẹp**: Tự động dọn dẹp dữ liệu khi đăng xuất

## Cách sử dụng

### Đăng nhập với Remember Me

```typescript
// Trong component Login.vue
const handleLogin = async () => {
  const result = await authStore.login(
    formData.email, 
    formData.password, 
    undefined, 
    formData.rememberMe // true để lưu lâu dài, false để chỉ lưu trong phiên
  )
}
```

### Kiểm tra trạng thái đăng nhập

```typescript
// Trong component bất kỳ
const authStore = useAuthStore()

// Kiểm tra đã đăng nhập chưa
if (authStore.isAuthenticated) {
  // Người dùng đã đăng nhập
}

// Kiểm tra vai trò
if (authStore.canAccess(['ADMIN', 'SUPERADMIN'])) {
  // Người dùng có quyền truy cập
}
```

### Khởi tạo Authentication

```typescript
// Trong App.vue hoặc main.ts
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initializeAuth()
})
```

## Cấu trúc dữ liệu

### StoredAuthData

```typescript
interface StoredAuthData {
  accessToken: string      // JWT access token
  refreshToken: string     // JWT refresh token
  userData: any           // Thông tin người dùng
  tokenExpiry: number     // Thời gian hết hạn (timestamp)
  rememberMe: boolean     // Có lưu lâu dài không
}
```

### Storage Keys

- `accessToken`: Access token JWT
- `refreshToken`: Refresh token JWT
- `userData`: Thông tin người dùng (JSON string)
- `tokenExpiry`: Thời gian hết hạn token
- `rememberMe`: Cờ lưu lâu dài

## Bảo mật

### Token Management

- **Access Token**: Ngắn hạn (thường 15-60 phút)
- **Refresh Token**: Dài hạn (thường 7-30 ngày)
- **Auto-refresh**: Tự động làm mới trước khi hết hạn

### Storage Security

- **localStorage**: Lưu lâu dài (Remember Me)
- **sessionStorage**: Chỉ lưu trong phiên hiện tại
- **Tự động dọn dẹp**: Xóa dữ liệu khi đăng xuất

### Error Handling

- **Network errors**: Xử lý lỗi mạng một cách graceful
- **Token expired**: Tự động refresh hoặc đăng xuất
- **Invalid tokens**: Dọn dẹp dữ liệu không hợp lệ

## Troubleshooting

### Vấn đề thường gặp

1. **Token không được lưu**
   - Kiểm tra quyền truy cập localStorage/sessionStorage
   - Kiểm tra console errors

2. **Auto-refresh không hoạt động**
   - Kiểm tra token expiry time
   - Kiểm tra refresh timer

3. **Session bị mất**
   - Kiểm tra Remember Me setting
   - Kiểm tra storage type (localStorage vs sessionStorage)

### Debug

```typescript
// Kiểm tra trạng thái authentication
console.log('Auth Store:', {
  isAuthenticated: authStore.isAuthenticated,
  isInitialized: authStore.isInitialized,
  user: authStore.user,
  tokenExpiry: authStore.tokenExpiryTime
})

// Kiểm tra storage
console.log('localStorage:', {
  accessToken: localStorage.getItem('accessToken'),
  rememberMe: localStorage.getItem('rememberMe')
})

console.log('sessionStorage:', {
  accessToken: sessionStorage.getItem('accessToken')
})
```

## Tương lai

### Tính năng có thể thêm

- **Multi-tab support**: Đồng bộ authentication giữa các tab
- **Offline support**: Cache dữ liệu để hoạt động offline
- **Biometric auth**: Hỗ trợ vân tay, face ID
- **Device management**: Quản lý thiết bị đăng nhập
- **Audit logging**: Ghi log các hoạt động authentication
