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

## Mở cái gì?

| Muốn làm gì | Mở cái gì |
|---|---|
| **Dùng app thật hằng ngày** (dữ liệu thật) | Trang web **https://hanthuandinh.github.io/lop-hoc/**, hoặc biểu tượng Sổ Lớp đã cài trên máy |
| **Xem thử bản vừa sửa** trước khi đưa lên GitHub | File `xem-truoc.html` trong thư mục dự án (bấm đúp để mở) |

Không cần mở trực tiếp file nào khác. Bấm đúp `index.html` sẽ chạy thiếu tính năng (vd. đồng bộ Drive), dễ tưởng là lỗi.
`xem-truoc.html` chỉ nằm trên máy (đã cài để không đưa lên GitHub) và không đụng tới dữ liệu thật.

## Các file

| File / thư mục | Vai trò |
|---|---|
| `index.html` | Toàn bộ app (giao diện + code). Mọi chỉnh sửa nằm ở đây |
| `sw.js` | Service worker: cho app chạy khi mất mạng và tự nhận bản mới |
| `qr.js` | Bộ tạo mã QR chuyển khoản (chạy trên máy) |
| `manifest.webmanifest` | Thông tin để cài app ra màn hình chính |
| `privacy.html` | Chính sách quyền riêng tư (Google yêu cầu khi bật đồng bộ Drive) |
| `logo.png`, `mark.png`, `icon-*.png`, `favicon.png`, `apple-touch-icon.png` | Logo và biểu tượng Đ-LAB |
| `CLAUDE.md` | Sổ tay hướng dẫn cho Claude Code: cấu trúc app, các quyết định đã chốt |
| `README.md` | File này |
| `tools/xem-truoc.py` | Công cụ tạo file xem trước `xem-truoc.html` |
| `.claude/`, `.git/`, `.gitignore`, `.gitattributes` | File của hệ thống (Claude Code, Git), thường bị ẩn, không cần đụng |

Các file ảnh và file app nằm cùng một chỗ là có chủ ý: đổi chỗ sẽ làm lỗi ảnh/lỗi cài app trên máy người dùng đã cài.

Biểu tượng giao diện dựa trên Feather Icons (MIT). © Đ-LAB · Nơi ý tưởng được tạo nên.
