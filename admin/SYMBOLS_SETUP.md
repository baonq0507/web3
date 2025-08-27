# Hướng dẫn sử dụng Symbols trong Admin

## Setup

### 1. Khởi động API
```bash
cd api
npm run start:dev
```

### 2. Seeding dữ liệu symbols
```bash
cd api
npm run seed:symbols
```

### 3. Khởi động Admin
```bash
cd admin
npm run dev
```

## Sử dụng

### Truy cập
- Vào `/symbols` trong admin panel
- Chỉ Admin và SuperAdmin mới có quyền truy cập

### Tính năng
- ✅ Xem danh sách symbols
- ✅ Tìm kiếm theo tên hoặc code
- ✅ Lọc theo trạng thái hoạt động
- ✅ Sắp xếp theo nhiều tiêu chí
- ✅ Thêm symbol mới
- ✅ Chỉnh sửa symbol
- ✅ Xóa symbol
- ✅ Preview ảnh

### Validation
- Tên: Bắt buộc, tối thiểu 2 ký tự
- Code: Bắt buộc, chỉ chữ hoa và số
- Ảnh: URL hợp lệ
- Trạng thái: Tùy chọn
- Thứ tự: Tùy chọn

## API Endpoints

- `GET /symbols` - Danh sách với phân trang
- `GET /symbols/active` - Symbols đang hoạt động
- `POST /symbols` - Tạo mới (Admin only)
- `PATCH /symbols/:id` - Cập nhật (Admin only)
- `DELETE /symbols/:id` - Xóa (Admin only)

## Troubleshooting

### Lỗi import
Nếu gặp lỗi import, kiểm tra:
- File `admin/src/api/symbols.ts` có tồn tại
- Import path đúng: `import { apiClient } from './client'`

### Lỗi icons
Admin sử dụng Ant Design icons, không cần FontAwesome

### Lỗi API
Kiểm tra:
- API đang chạy
- Database connection
- Authentication token
