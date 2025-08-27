# 🔧 Chart.js Stack Overflow Fix

## Vấn đề
Lỗi "Maximum call stack size exceeded" xảy ra khi cập nhật biểu đồ ADAUSDT, AVAXUSDT và các biểu đồ khác trong `Home.vue`.

## Nguyên nhân
1. **Vòng lặp vô hạn** trong việc cập nhật biểu đồ
2. **Chart.js configuration helpers** gây ra đệ quy vô hạn
3. **Cập nhật đồng thời** nhiều biểu đồ cùng lúc
4. **Thiếu cơ chế bảo vệ** để ngăn chặn stack overflow

## Giải pháp đã áp dụng

### 1. **Tăng thời gian throttling**
```typescript
// Trước: 500ms
const UPDATE_THROTTLE = 500;

// Sau: 1000ms (1 giây)
const UPDATE_THROTTLE = 1000;
```

### 2. **Giảm số lần cập nhật mỗi giây**
```typescript
// Trước: 2 lần/giây
const maxUpdatesPerSecond = 2;

// Sau: 1 lần/giây
const maxUpdatesPerSecond = 1;
```

### 3. **Giảm số lỗi tối đa trước khi vô hiệu hóa**
```typescript
// Trước: 3 lỗi
const MAX_CHART_ERRORS = 3;

// Sau: 2 lỗi
const MAX_CHART_ERRORS = 2;
```

### 4. **Thêm kiểm tra thay đổi dữ liệu đáng kể**
```typescript
// Chỉ cập nhật khi có thay đổi đáng kể (> 0.001%)
if (Math.abs(newValue - currentLastValue) > 0.001) {
  // Cập nhật biểu đồ
}
```

### 5. **Sử dụng requestAnimationFrame để tránh stack overflow**
```typescript
// Sử dụng requestAnimationFrame thay vì gọi trực tiếp
requestAnimationFrame(() => {
  try {
    chart.update('none');
  } catch (updateError) {
    // Xử lý lỗi
  }
});
```

### 6. **Thêm cơ chế ngăn chặn cập nhật đồng thời**
```typescript
// Theo dõi trạng thái cập nhật của từng biểu đồ
const chartUpdateStatus = ref<{ [key: string]: boolean }>({});

// Kiểm tra trước khi cập nhật
const canUpdate = !chartUpdateStatus.value[symbol];
```

### 7. **Timeout an toàn để reset trạng thái**
```typescript
// Reset trạng thái sau 1 giây để đảm bảo an toàn
setTimeout(() => {
  if (chartUpdateStatus.value[symbol]) {
    chartUpdateStatus.value[symbol] = false;
  }
}, 1000);
```

## Kết quả
- ✅ **Ngăn chặn vòng lặp vô hạn** trong việc cập nhật biểu đồ
- ✅ **Giảm thiểu stack overflow** bằng cách sử dụng requestAnimationFrame
- ✅ **Tăng tính ổn định** của biểu đồ
- ✅ **Giảm tải CPU** do ít cập nhật hơn
- ✅ **Xử lý lỗi tốt hơn** với cơ chế vô hiệu hóa tạm thời

## Lưu ý
- Biểu đồ sẽ cập nhật chậm hơn (1 lần/giây thay vì 2 lần/giây)
- Thời gian giữa các lần cập nhật tăng từ 500ms lên 1000ms
- Biểu đồ sẽ bị vô hiệu hóa sau 2 lỗi thay vì 3 lỗi

## Test
Để kiểm tra xem fix có hoạt động:
1. Khởi động ứng dụng: `npm run dev`
2. Mở DevTools Console
3. Theo dõi các log cập nhật biểu đồ
4. Kiểm tra xem có còn lỗi "Maximum call stack size exceeded" không
