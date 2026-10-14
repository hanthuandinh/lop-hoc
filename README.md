# Lớp của thầy Định

App quản lý lớp dạy thêm chạy trên điện thoại: điểm danh, học phí, nhắc phụ huynh qua Zalo, báo cáo, xuất Excel.

## Dữ liệu có an toàn không?

- Mã nguồn app này công khai, nhưng **dữ liệu học sinh và phụ huynh không có ở đây**.
- Dữ liệu chỉ lưu trong trình duyệt trên máy của người dùng (IndexedDB). App không có máy chủ và không gửi dữ liệu đi đâu.
- App đặt chính sách bảo mật nội dung (Content-Security-Policy) để chặn mọi kết nối tới máy chủ khác.
- Có sao lưu ra file mã hóa AES-256 bằng mật khẩu, và mã PIN để khóa màn hình.

## Cài lên điện thoại

- iPhone: mở link bằng Safari → nút Chia sẻ → "Thêm vào MH chính".
- Android: mở link bằng Chrome → menu ⋮ → "Cài đặt ứng dụng".

## Các file

| File | Vai trò |
|---|---|
| `index.html` | Toàn bộ giao diện và code của app |
| `sw.js` | Service worker: lưu sẵn app để mở được khi không có mạng |
| `manifest.webmanifest` | Thông tin để cài app vào màn hình chính |
| `icon-*.png` | Biểu tượng app |
