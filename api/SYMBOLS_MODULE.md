# Symbols Module

Module quản lý symbols (cặp tiền) trong hệ thống giao dịch crypto.

## Tính năng

- **CRUD Operations**: Tạo, đọc, cập nhật, xóa symbols
- **Validation**: Kiểm tra dữ liệu đầu vào
- **Authorization**: Chỉ admin mới có quyền thay đổi
- **Search & Filter**: Tìm kiếm và lọc symbols
- **Pagination**: Phân trang kết quả
- **Sorting**: Sắp xếp theo nhiều tiêu chí

## Cấu trúc

```
src/symbols/
├── dto/
│   ├── create-symbol.dto.ts
│   └── update-symbol.dto.ts
├── schemas/
│   └── symbol.schema.ts
├── symbols.controller.ts
├── symbols.service.ts
└── symbols.module.ts
```

## Schema

```typescript
interface Symbol {
  _id: string;
  name: string;        // Tên symbol (ví dụ: Bitcoin)
  image: string;       // URL ảnh logo
  code: string;        // Mã symbol (ví dụ: BTC)
  isActive: boolean;   // Trạng thái hoạt động
  sortOrder: number;   // Thứ tự hiển thị
  createdAt: string;   // Ngày tạo
  updatedAt: string;   // Ngày cập nhật
}
```

## API Endpoints

### GET /symbols
Lấy danh sách symbols với phân trang và tìm kiếm

**Query Parameters:**
- `page`: Số trang (mặc định: 1)
- `limit`: Số lượng mỗi trang (mặc định: 10)
- `search`: Tìm kiếm theo tên hoặc code
- `isActive`: Lọc theo trạng thái (true/false)
- `sortBy`: Sắp xếp theo trường (name, code, sortOrder, createdAt)
- `sortOrder`: Thứ tự sắp xếp (asc/desc)

**Response:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### GET /symbols/active
Lấy danh sách symbols đang hoạt động

### GET /symbols/:id
Lấy thông tin symbol theo ID

### POST /symbols
Tạo symbol mới (Chỉ Admin)

**Body:**
```json
{
  "name": "Bitcoin",
  "image": "https://example.com/btc.png",
  "code": "BTC",
  "isActive": true,
  "sortOrder": 1
}
```

### PATCH /symbols/:id
Cập nhật symbol (Chỉ Admin)

### DELETE /symbols/:id
Xóa symbol (Chỉ Admin)

## Validation Rules

- **name**: Bắt buộc, tối thiểu 2 ký tự
- **code**: Bắt buộc, tối thiểu 2 ký tự, chỉ chữ hoa và số
- **image**: Bắt buộc, phải là URL hợp lệ
- **isActive**: Tùy chọn, mặc định true
- **sortOrder**: Tùy chọn, mặc định 0

## Authorization

- **Read**: Tất cả user đã đăng nhập
- **Create/Update/Delete**: Chỉ Admin và SuperAdmin

## Seeding Data

Chạy script để tạo dữ liệu mẫu:

```bash
# Từ thư mục api
npm run seed:symbols

# Hoặc chạy trực tiếp
npx ts-node src/scripts/seed-symbols.ts
```

## Sử dụng trong Frontend

### Admin Panel
```typescript
import { symbolsApi } from '@/api/symbols';

// Lấy danh sách symbols
const symbols = await symbolsApi.getSymbols({
  page: 1,
  limit: 10,
  search: 'BTC'
});

// Tạo symbol mới
const newSymbol = await symbolsApi.createSymbol({
  name: 'Bitcoin',
  code: 'BTC',
  image: 'https://example.com/btc.png'
});
```

### Client App
```typescript
import { symbolsApi } from '@/api/symbols';

// Lấy symbols đang hoạt động
const activeSymbols = await symbolsApi.getActiveSymbols();
```

## Error Handling

Module xử lý các lỗi phổ biến:

- **400 Bad Request**: Dữ liệu đầu vào không hợp lệ
- **401 Unauthorized**: Chưa đăng nhập
- **403 Forbidden**: Không có quyền truy cập
- **404 Not Found**: Symbol không tồn tại
- **409 Conflict**: Tên hoặc code đã tồn tại

## Testing

```bash
# Chạy test
npm run test:e2e

# Test API endpoints
curl -X GET http://localhost:3000/symbols
curl -X GET http://localhost:3000/symbols/active
```

## Notes

- Symbols được sử dụng trong trading, options và các module khác
- Code phải là duy nhất trong hệ thống
- Ảnh nên được lưu trữ trên CDN để tối ưu hiệu suất
- Có thể mở rộng thêm các trường như: market cap, volume, price history
