# Sổ Lớp · by Đ-LAB

Ứng dụng quản lý lớp dạy thêm cho thầy cô: điểm danh, học phí, mã QR chuyển khoản, nhắc phụ huynh qua Zalo, thông báo chung, báo cáo và xuất Excel. Dùng được trên điện thoại và máy tính.

## Dữ liệu có an toàn không?

- Mã nguồn công khai, nhưng **dữ liệu học sinh và phụ huynh không có ở đây**.
- Dữ liệu chỉ lưu trong trình duyệt trên máy người dùng (IndexedDB). App không có máy chủ.
- Chính sách bảo mật nội dung (CSP) chặn mọi kết nối tới máy chủ khác. Mã QR được tạo ngay trên máy (`qr.js`).
- Sao lưu ra file mã hóa AES-256 bằng mật khẩu. Có mã PIN khóa màn hình.

## Cài lên máy

- iPhone: mở link bằng Safari → Chia sẻ → "Thêm vào MH chính". Luôn mở app từ biểu tượng này.
- Android: Chrome → menu ⋮ → "Cài đặt ứng dụng".
- Máy tính: Chrome/Edge → biểu tượng cài đặt ở cuối thanh địa chỉ.

## Các file

| File | Vai trò |
|---|---|
| `index.html` | Giao diện và code chính |
| `qr.js` | Bộ tạo mã QR (chạy trên máy) |
| `sw.js` | Service worker: cho app chạy khi mất mạng |
| `manifest.webmanifest` | Thông tin cài app vào màn hình chính |
| `logo.png`, `mark.png`, `icon-*.png`, `favicon.png` | Logo và biểu tượng Đ-LAB |

Biểu tượng giao diện dựa trên Feather Icons (MIT). © Đ-LAB · Nơi ý tưởng được tạo nên.
