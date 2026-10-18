Chuẩn bị phát hành phiên bản mới của Sổ Lớp: $ARGUMENTS

1. Đọc `const VERSION` trong index.html. Tăng phiên bản (sửa nhỏ: tăng số cuối; tính năng mới: tăng số giữa),
   cập nhật đồng thời `CACHE` trong sw.js cho khớp.
2. Kiểm tra: không còn `type="number"` cho ô tiền; mọi dữ liệu người dùng in ra HTML đều qua `esc()`;
   file mới (nếu có) đã thêm vào `FILES` trong sw.js.
3. Chạy `python tools/xem-truoc.py` để tạo xem-truoc.html cho thầy duyệt.
4. Tóm tắt bằng tiếng Việt đơn giản: đã thay đổi gì, gợi ý dòng Summary để thầy commit trong GitHub Desktop.
