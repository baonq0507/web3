# Hệ Thống Audit Log

Hệ thống audit log được thiết kế để ghi lại tất cả hoạt động của người dùng và admin trong ứng dụng. Mỗi hoạt động sẽ được ghi lại với thông tin chi tiết bao gồm người thực hiện, hành động, tài nguyên bị ảnh hưởng, thời gian thực hiện, IP address, user agent và các metadata khác.

## Tính Năng Chính

- **Tự động ghi log**: Sử dụng interceptor để tự động ghi log cho tất cả API endpoints
- **Thông tin chi tiết**: Ghi lại IP address, user agent, thời gian thực hiện, request/response body
- **Phân loại hành động**: Hỗ trợ các loại hành động như CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, APPROVE, REJECT
- **Phân loại tài nguyên**: Theo dõi các tài nguyên như USER, WALLET, KYC, DEPOSIT, WITHDRAWAL, SYSTEM
- **Bảo mật**: Chỉ admin và auditor mới có thể xem audit logs
- **Tìm kiếm và lọc**: Hỗ trợ tìm kiếm theo user, hành động, tài nguyên, khoảng thời gian

## Cách Sử Dụng

### 1. Sử Dụng Decorator

```typescript
import { AuditCreate, AuditRead, AuditUpdate, AuditDelete } from '../audit/decorators/audit.decorator';
import { AuditResource } from '../audit/schemas/audit-log.schema';

@Controller('users')
@UseInterceptors(AuditInterceptor)
export class UsersController {
  
  @Post()
  @AuditCreate(AuditResource.USER, 'Create new user')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @AuditRead(AuditResource.USER, 'List all users')
  async findAll() {
    return this.usersService.findAll();
  }

  @Put(':id')
  @AuditUpdate(AuditResource.USER, 'Update user information')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @AuditDelete(AuditResource.USER, 'Delete user')
  async remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
```

### 2. Các Decorator Có Sẵn

- `@AuditCreate(resource, details?)` - Ghi log khi tạo mới
- `@AuditRead(resource, details?)` - Ghi log khi đọc/xem
- `@AuditUpdate(resource, details?)` - Ghi log khi cập nhật
- `@AuditDelete(resource, details?)` - Ghi log khi xóa
- `@AuditLogin(details?)` - Ghi log khi đăng nhập
- `@AuditLogout(details?)` - Ghi log khi đăng xuất
- `@AuditApprove(resource, details?)` - Ghi log khi phê duyệt
- `@AuditReject(resource, details?)` - Ghi log khi từ chối
- `@AuditTransfer(details?)` - Ghi log khi chuyển tiền
- `@AuditWithdraw(details?)` - Ghi log khi rút tiền
- `@AuditDeposit(details?)` - Ghi log khi nạp tiền

### 3. Các Loại Tài Nguyên

- `AuditResource.USER` - Người dùng
- `AuditResource.WALLET` - Ví tiền
- `AuditResource.KYC` - Xác minh danh tính
- `AuditResource.DEPOSIT` - Nạp tiền
- `AuditResource.WITHDRAWAL` - Rút tiền
- `AuditResource.TRADE` - Giao dịch
- `AuditResource.SYSTEM` - Hệ thống

### 4. Các Loại Hành Động

- `AuditAction.CREATE` - Tạo mới
- `AuditAction.READ` - Đọc/xem
- `AuditAction.UPDATE` - Cập nhật
- `AuditAction.DELETE` - Xóa
- `AuditAction.LOGIN` - Đăng nhập
- `AuditAction.LOGOUT` - Đăng xuất
- `AuditAction.APPROVE` - Phê duyệt
- `AuditAction.REJECT` - Từ chối
- `AuditAction.TRANSFER` - Chuyển tiền
- `AuditAction.WITHDRAW` - Rút tiền
- `AuditAction.DEPOSIT` - Nạp tiền

## API Endpoints

### Xem Tất Cả Audit Logs
```
GET /audit?userId=123&action=create&resource=user&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=50
```

### Xem Thống Kê
```
GET /audit/stats
```

### Xem Logs Của Bản Thân
```
GET /audit/my?limit=100
```

### Xem Chi Tiết Log
```
GET /audit/:id
```

## Cấu Trúc Dữ Liệu

```typescript
interface AuditLog {
  userId?: ObjectId;           // ID của người thực hiện
  action: AuditAction;         // Loại hành động
  resource: AuditResource;     // Loại tài nguyên
  resourceId?: string;         // ID của tài nguyên bị ảnh hưởng
  details?: string;            // Mô tả chi tiết
  ipAddress?: string;          // IP address
  userAgent?: string;          // User agent
  oldValues?: any;             // Giá trị cũ (khi update)
  newValues?: any;             // Giá trị mới (khi update)
  success: boolean;            // Thành công hay thất bại
  errorMessage?: string;       // Thông báo lỗi nếu có
  metadata?: any;              // Thông tin bổ sung
  createdAt: Date;            // Thời gian tạo
  updatedAt: Date;            // Thời gian cập nhật
}
```

## Bảo Mật

- Chỉ admin và auditor mới có thể xem tất cả audit logs
- Người dùng chỉ có thể xem logs của chính mình
- Tất cả logs đều được ghi lại, kể cả khi có lỗi xảy ra
- IP address và user agent được ghi lại để theo dõi bảo mật

## Dọn Dẹp Logs

Hệ thống hỗ trợ tự động dọn dẹp logs cũ:

```typescript
// Xóa logs cũ hơn 90 ngày
await this.auditService.cleanupOldLogs(90);
```

## Monitoring và Alerting

Có thể tích hợp với hệ thống monitoring để:
- Theo dõi số lượng logs theo thời gian
- Phát hiện hoạt động bất thường
- Alert khi có quá nhiều lỗi xảy ra
- Báo cáo hoạt động của admin và user

## Ví Dụ Sử Dụng

### Ghi Log Cho KYC Review
```typescript
@Patch(':id/review')
@AuditApprove(AuditResource.KYC, 'Review KYC application')
async review(@Param('id') id: string, @Body() reviewDto: ReviewKycDto) {
  return this.kycService.review(id, reviewDto);
}
```

### Ghi Log Cho Wallet Balance Update
```typescript
@Patch(':id/balance')
@AuditUpdate(AuditResource.WALLET, 'Update wallet balance')
async updateBalance(@Param('id') id: string, @Body() body: { amount: number }) {
  return this.walletsService.updateBalance(id, body.amount);
}
```

### Ghi Log Cho User Status Change
```typescript
@Put(':id/status')
@AuditUpdate(AuditResource.USER, 'Update user status')
async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
  return this.usersService.updateStatus(id, body.status);
}
```

## Lưu Ý

1. **Performance**: Audit interceptor có thể ảnh hưởng đến performance nếu có quá nhiều requests
2. **Storage**: Cần đủ dung lượng database để lưu trữ logs
3. **Privacy**: Cẩn thận với việc ghi log thông tin nhạy cảm
4. **Compliance**: Tuân thủ các quy định về bảo mật và quyền riêng tư
