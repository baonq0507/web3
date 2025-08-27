# DTO Transformation Fix Test

## Vấn đề đã xác định

### **Root Cause**: Thiếu transformation trong DTO
- Frontend gửi query parameters dưới dạng **string**
- DTO mong đợi `page` và `limit` là **number**
- ValidationPipe có `transform: true` nhưng DTO thiếu `@Type(() => Number)`

### **Trước (gây lỗi):**
```typescript
export class UserQueryDto {
  @IsOptional()
  @IsNumber()        // ❌ Mong đợi number, nhận được string
  page?: number;

  @IsOptional()
  @IsNumber()        // ❌ Mong đợi number, nhận được string
  limit?: number;
}
```

### **Sau (đã sửa):**
```typescript
export class UserQueryDto {
  @IsOptional()
  @Type(() => Number)    // ✅ Chuyển đổi string → number
  @IsNumber()            // ✅ Validate là number
  @Min(1)                // ✅ Đảm bảo ≥ 1
  page?: number;

  @IsOptional()
  @Type(() => Number)    // ✅ Chuyển đổi string → number
  @IsNumber()            // ✅ Validate là number
  @Min(1)                // ✅ Đảm bảo ≥ 1
  limit?: number;
}
```

## Các thay đổi đã thực hiện

### 1. **Import thêm:**
```typescript
import { Transform, Type } from 'class-transformer';
import { Min } from 'class-validator';
```

### 2. **Transformation:**
```typescript
@Type(() => Number)  // Chuyển đổi string → number
@IsNumber()          // Validate là number
@Min(1)              // Đảm bảo ≥ 1
```

### 3. **Validation Pipe:**
```typescript
// main.ts đã có
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,  // ✅ Enable transformation
  }),
);
```

## Test ngay bây giờ

### 1. **Restart Backend**
```bash
cd api
npm run start:dev
```

### 2. **Test Frontend**
```bash
cd admin
npm run dev
```

### 3. **Truy cập Users Page**
- Mở browser: `http://localhost:5173/users`
- Mở DevTools > Network tab
- Xem API call `/users`

### 4. **Kiểm tra Backend Logs**
```typescript
// users.controller.ts
@Get()
async findAll(@Query() query: UserQueryDto) {
  console.log('query', query);  // Xem type của page/limit
  return this.usersService.findAll(query);
}
```

## Expected Results

### Success (DTO transformation hoạt động):
```typescript
// Backend logs
query {
  page: 1,        // ✅ number, không phải "1"
  limit: 10,      // ✅ number, không phải "10"
  search: undefined,
  role: undefined
}
```

### Success Response:
```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "pages": 1
  }
}
```

## Nếu vẫn lỗi

### 1. **Kiểm tra Backend Logs**
```bash
# Xem console output
cd api
npm run start:dev
```

### 2. **Kiểm tra DTO Import**
```typescript
// Đảm bảo import đúng
import { Type } from 'class-transformer';
import { Min } from 'class-validator';
```

### 3. **Kiểm tra ValidationPipe**
```typescript
// main.ts phải có
transform: true
```

### 4. **Test với Postman**
```
GET http://localhost:3000/api/admin/v1/users?page=1&limit=10
```

## Debug Steps

### 1. **Backend Console**
- Xem `console.log('query', query)` output
- Xem type của `page` và `limit`

### 2. **Frontend Console**
- Xem `console.log('params', params)` output
- Xem request URL

### 3. **Network Tab**
- Xem request URL
- Xem response status và body

## Common Issues

### 1. **Type vẫn là string**
```typescript
query { page: "1", limit: "10" }  // ❌ Vẫn là string
```
**Giải pháp**: Kiểm tra `@Type(() => Number)` và `transform: true`

### 2. **Validation Error khác**
```json
{
  "message": "Different validation error",
  "error": "Bad Request"
}
```
**Giải pháp**: Kiểm tra các validation rules khác

### 3. **CORS Error**
```
Access to fetch at '...' has been blocked by CORS policy
```
**Giải pháp**: Kiểm tra CORS configuration

## Next Steps

1. **Restart Backend**: Để áp dụng DTO changes
2. **Test Frontend**: Kiểm tra API calls
3. **Check Backend Logs**: Xem transformation có hoạt động không
4. **Compare Results**: So sánh với trước khi sửa

## Expected Fix

Sau khi sửa DTO:
- `page` và `limit` sẽ được chuyển đổi từ string → number
- Validation sẽ pass vì type đúng
- API sẽ trả về danh sách users thành công
