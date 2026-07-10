# Hướng dẫn sử dụng: Danh mục đầu tư (Portfolio)

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Phía Admin — Tạo & quản lý danh mục](#2-phía-admin--tạo--quản-lý-danh-mục)
3. [Phía User — Xem danh mục](#3-phía-user--xem-danh-mục)
4. [Luồng dữ liệu API](#4-luồng-dữ-liệu-api)
5. [Cấu trúc hiển thị theo từng gói](#5-cấu-trúc-hiển-thị-theo-từng-gói)

---

## 1. Tổng quan

Hệ thống danh mục đầu tư cho phép Admin tạo danh mục cổ phiếu cho từng gói (Titan, Gold, Premium). Mỗi user khi truy cập trang Portfolio sẽ tự động thấy danh mục tương ứng với gói họ đang sử dụng.

**Các gói hiện có:**

| Gói | Mô tả | Plan ID |
|-----|--------|---------|
| Community (Free) | Ý tưởng mở, ai cũng xem được | 1 |
| Titan | Chiến lược phòng thủ, ổn định | 2 |
| Gold | Tăng trưởng cân bằng, rủi ro vừa | 3 |
| Premium | High conviction, yêu cầu cao nhất | 4 |

---

## 2. Phía Admin — Tạo & quản lý danh mục

### 2.1. Truy cập

Vào trang: **Admin → Danh mục đầu tư** (`/admin/portfolio`)

### 2.2. Chọn gói cần tạo/chỉnh sửa

Ở phần đầu trang, bấm nút chọn gói:
- **Danh mục Titan**
- **Danh mục Gold**
- **Danh mục Premium**

Mỗi gói có form riêng biệt. Khi chuyển tab, dữ liệu form của gói trước vẫn được giữ lại.

### 2.3. Thiết lập thông tin cơ bản

| Trường | Mô tả |
|--------|--------|
| **Ngày công bố** | Ngày danh mục được công bố (format: YYYY-MM-DD) |
| **Tổng giá trị thị trường** | Tự động tính từ `marketPrice × quantity` của tất cả cổ phiếu |

### 2.4. Bật/tắt block hiển thị

Admin chọn những block nào user sẽ thấy cho gói này:

| Block | Mô tả | Ví dụ cấu hình |
|-------|--------|-----------------|
| **Biểu đồ hiệu suất** | Chart so sánh danh mục vs VNINDEX | Premium: ✅, Gold: ❌, Titan: ❌ |
| **Bảng danh mục** | Bảng chi tiết cổ phiếu | Premium: ✅, Gold: ❌, Titan: ❌ |
| **Lý do hỗ trợ** | Card phân tích lý do mua/bán | Premium: ✅, Gold: ✅, Titan: ✅ |
| **Tín hiệu giao dịch** | Block tín hiệu BUY/SELL | Premium: ✅, Gold: ✅, Titan: ❌ |

> **Quan trọng:** Nếu block không được bật, dữ liệu tương ứng sẽ **không được gửi trong payload** dù admin đã nhập.

### 2.5. Nhập dữ liệu Biểu đồ hiệu suất

Bấm **"Thêm mốc"** để thêm điểm dữ liệu cho chart:

| Trường | Ví dụ | Mô tả |
|--------|-------|--------|
| Mốc thời gian | T1, T2, T3 | Label hiển thị trên trục X |
| VNINDEX (%) | 5.0 | Lợi nhuận VNINDEX tại mốc đó |
| Khuyến nghị (%) | 6.2 | Lợi nhuận danh mục khuyến nghị |

### 2.6. Nhập dữ liệu Bảng cổ phiếu

Bấm **"Thêm cổ phiếu"** để thêm mã:

| Trường | Ví dụ | Mô tả |
|--------|-------|--------|
| Mã | PVT | Mã cổ phiếu (tự động uppercase) |
| Ngành | Năng lượng | Ngành của cổ phiếu |
| Ngày mua | 2025-12-03 | Ngày mua vào |
| Số lượng | 1100 | Số cổ phiếu |
| Giá vốn | 18.75 | Giá mua trung bình |
| Giá thị trường | 20.0 | Giá hiện tại |
| Ghi chú nội bộ | Giữ nền tốt... | Ghi chú cho admin, không hiển thị cho user |

> **Lưu ý:** Khi xóa cổ phiếu, tất cả lý do và tín hiệu liên quan đến mã đó cũng bị xóa.

### 2.7. Nhập Lý do hỗ trợ

Bấm **"Thêm lý do"**:

| Trường | Ví dụ | Mô tả |
|--------|-------|--------|
| Loại | buy / sell | Loại phân tích |
| Mã cổ phiếu | PVT | Mã liên kết |
| Nội dung | MA/Trend: MA200 hỗ trợ... | Nội dung phân tích |

### 2.8. Nhập Tín hiệu giao dịch

Bấm **"Thêm tín hiệu"**:

| Trường | Ví dụ | Mô tả |
|--------|-------|--------|
| Mã | PVT | Mã cổ phiếu |
| Loại tín hiệu | BUY / SELL / breakout | Loại tín hiệu |
| Mô tả | Ưu tiên nắm giữ... | Mô tả chi tiết |
| Target price | 21.55 | Giá mục tiêu (không bắt buộc) |
| Stop loss | 17.8 | Giá dừng lỗ (không bắt buộc) |

### 2.9. Kiểm tra & Lưu

1. **Payload preview:** Cuộn xuống cuối trang để xem JSON payload trước khi lưu
2. **Lưu danh mục:** Bấm nút **"Lưu danh mục"**
3. Hệ thống gọi `POST /portfolios` với payload bao gồm:
   ```json
   {
     "planId": 3,
     "publishedAt": "2026-06-09T00:00:00.000Z",
     "stocks": [...],
     "information": [...],
     "reasons": [...],
     "signals": [...]
   }
   ```

### 2.10. Quy trình tạo danh mục mới

```
1. Chọn gói (Titan / Gold / Premium)
2. Nhập ngày công bố
3. Bật/tắt các block hiển thị phù hợp với gói
4. Thêm cổ phiếu vào bảng danh mục
5. Thêm lý do hỗ trợ cho từng mã
6. Thêm tín hiệu giao dịch (nếu gói có bật)
7. Thêm dữ liệu hiệu suất (nếu gói có bật)
8. Kiểm tra Payload preview
9. Bấm "Lưu danh mục"
```

---

## 3. Phía User — Xem danh mục

### 3.1. Trang tổng quan (`/portfolio`)

Khi user truy cập trang `/portfolio`:

1. **Tab tự động chọn theo gói của user:**
   - User Free → tab Community (hiển thị prompt nâng cấp)
   - User Titan → tab Titan
   - User Gold → tab Gold
   - User Premium → tab Premium

2. **Tabs hiển thị:**
   - Các tab mà user KHÔNG có quyền truy cập sẽ có biểu tượng 🔒 và bị disabled
   - User có thể chuyển sang tab khác (nếu có quyền)

3. **Nút "Xem chi tiết":** Dẫn tới trang chi tiết của gói tương ứng

### 3.2. Quyền truy cập theo gói

| User thuộc gói | Tabs có thể xem |
|---------------|-----------------|
| Community (Free) | Community |
| Titan | Community, Titan |
| Gold | Community, Titan, Gold |
| Premium | Community, Titan, Gold, Premium |

### 3.3. Trang tổng quan — Nội dung hiển thị

Trên trang `/portfolio`, nội dung hiển thị phụ thuộc vào:
- **Visibility settings** của plan (cấu hình từ admin Plans)
- **Dữ liệu thực** từ API (admin đã tạo portfolio cho gói đó chưa)

Các section có thể xuất hiện:

| Section | Điều kiện hiển thị |
|---------|-------------------|
| Biểu đồ hiệu suất | Có key `information` trong response portfolio |
| Lý do hỗ trợ | Có key `reasons` trong response portfolio |
| Tín hiệu giao dịch | Có key `signals` trong response portfolio |
| Bảng danh mục | Có key `stocks` trong response portfolio |

### 3.4. Trang chi tiết theo gói

Mỗi gói có trang chi tiết riêng:

#### `/portfolio/titan` — Trang Titan
- Lý do mua/bán (SupportReasons)

#### `/portfolio/gold` — Trang Gold
- Lý do mua/bán (SupportReasons)
- Tín hiệu mua/bán (Signals)

#### `/portfolio/premium` — Trang Premium (đầy đủ nhất)
- Biểu đồ hiệu suất vs VNINDEX (PerformanceChart)
- Tỷ trọng danh mục (WeightPieChart)
- Giá mục tiêu vs Giá dừng lỗ (StopLossTargetChart)
- Thông tin cơ bản danh mục — Sharpe, Beta, Alpha... (BasicsChart)
- Lý do hỗ trợ (SupportReasons)
- Bảng danh mục chi tiết (PortfolioTable)

#### `/portfolio/free` — Trang Community
- Placeholder "Sẽ cập nhật sau"

### 3.5. Trạng thái hiển thị

| Trạng thái | Hiển thị |
|-----------|----------|
| Đang tải | Skeleton loading animation |
| Lỗi | Thông báo lỗi với nút thử lại |
| Không có quyền | Thông báo "Cần nâng cấp gói" |
| Không có dữ liệu | Thông báo "Chưa có dữ liệu danh mục" |
| Có dữ liệu | Hiển thị các section tương ứng |

---

## 4. Luồng dữ liệu API

### 4.1. Admin tạo danh mục

```
Admin Form → buildPayload() → POST /portfolios → Backend tạo Portfolio + stocks/information/reasons/signals → Lưu DB → Xóa cache Redis
```

### 4.2. User xem danh mục

```
User vào /portfolio → usePortfolioQuery("Gold") → GET /portfolios?plan=gold → Backend:
  1. Tìm plan theo slug "gold"
  2. Kiểm tra user planLevel >= plan.level
  3. Check Redis cache
  4. Query DB: Portfolio mới nhất cho planId đó
  5. Trả về portfolio + stocks/information/reasons/signals
→ usePortfolioData() transform data → Render UI
```

### 4.3. Endpoints liên quan

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|--------|-------|
| `GET /portfolios?plan=<slug>` | Lấy danh mục mới nhất theo gói | Public (JWT optional, kiểm tra plan level) |
| `GET /portfolios/all` | Lấy tất cả danh mục | Admin/Editor |
| `POST /portfolios` | Tạo danh mục mới | Admin/Editor |
| `PATCH /portfolios/:id` | Cập nhật danh mục | Admin/Editor |
| `DELETE /portfolios/:id` | Xóa danh mục | Admin only |

---

## 5. Cấu trúc hiển thị theo từng gói

### Bảng tóm tắt nội dung hiển thị

```
┌─────────────────────────┬───────────┬──────┬──────┬─────────┐
│ Nội dung                │ Community │ Titan│ Gold │ Premium │
├─────────────────────────┼───────────┼──────┼──────┼─────────┤
│ Biểu đồ hiệu suất      │     ❌    │  ❌  │  ❌  │   ✅    │
│ Tỷ trọng danh mục       │     ❌    │  ❌  │  ❌  │   ✅    │
│ Stop Loss / Target chart │     ❌    │  ❌  │  ❌  │   ✅    │
│ Thông tin cơ bản (Sharpe)│     ❌    │  ❌  │  ❌  │   ✅    │
│ Lý do hỗ trợ            │     ❌    │  ✅  │  ✅  │   ✅    │
│ Tín hiệu giao dịch      │     ❌    │  ❌  │  ✅  │   ✅    │
│ Bảng danh mục            │     ❌    │  ❌  │  ❌  │   ✅    │
└─────────────────────────┴───────────┴──────┴──────┴─────────┘
```

### Sơ đồ Admin → User

```
ADMIN                                    USER
┌──────────────────────┐                ┌──────────────────────┐
│ Chọn gói: Premium    │                │ /portfolio           │
│ Bật: performance ✅  │   POST /api    │ Tab: [Premium] active│
│ Bật: table ✅        │ ──────────►    │                      │
│ Bật: reasons ✅      │                │ ┌──────────────────┐ │
│ Bật: signals ✅      │   GET /api     │ │ Hiệu suất chart  │ │
│                      │ ◄──────────    │ ├──────────────────┤ │
│ Stocks:              │                │ │ Lý do hỗ trợ     │ │
│  - PVT (1100 cp)     │                │ ├──────────────────┤ │
│  - DBC (900 cp)      │                │ │ Tín hiệu giao dịch│ │
│                      │                │ ├──────────────────┤ │
│ Reasons:             │                │ │ Bảng danh mục    │ │
│  - PVT: MA hỗ trợ.. │                │ └──────────────────┘ │
│  - DBC: MACD cắt..  │                │                      │
│                      │                │ [Xem chi tiết →]     │
│ Signals:             │                │     ↓                │
│  - PVT: BUY 21.55   │                │ /portfolio/premium   │
│  - DBC: BUY 31.60   │                │ (full dashboard)     │
└──────────────────────┘                └──────────────────────┘
```

---

## Lưu ý quan trọng

1. **Mỗi gói chỉ lưu 1 danh mục mới nhất.** Backend trả về portfolio có `publishedAt` mới nhất cho mỗi plan.

2. **Dữ liệu sẽ được cache 1 giờ** trong Redis. Sau khi admin tạo/cập nhật/xóa danh mục, cache sẽ tự động bị xóa.

3. **Block hiển thị phụ thuộc 2 lớp:**
   - **Lớp 1 (Admin Portfolio):** Admin bật/tắt block nào thì dữ liệu block đó mới được gửi trong payload
   - **Lớp 2 (Portfolio data):** Backend chỉ trả những block còn data; frontend render theo key có trong response

4. **User không có quyền** sẽ nhận lỗi 403 từ backend. Frontend hiển thị thông báo "Cần nâng cấp gói."

5. **Community/Free** không có danh mục thực tế — chỉ hiển thị placeholder hướng dẫn nâng cấp.
