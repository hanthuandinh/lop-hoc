# Sổ Lớp · by Đ-LAB — hướng dẫn cho Claude Code

App web quản lý lớp dạy thêm cho giáo viên Việt Nam: điểm danh, học phí (theo tháng), mã QR VietQR,
nhắc phụ huynh qua Zalo, thông báo chung, báo cáo, xuất Excel, đồng bộ Google Drive (tùy chọn).
Chạy trên điện thoại và máy tính (PWA). **Không có máy chủ, không có bước build.**

- Trang thật: https://hanthuandinh.github.io/lop-hoc/ (GitHub Pages, nhánh `main`, thư mục gốc)
- Phiên bản hiện tại: xem `const VERSION` trong `index.html`

## Về người dùng (chủ dự án)
- Thầy Định, giáo viên Tin học tiểu học. **Luôn trả lời bằng tiếng Việt đơn giản**, giải thích thuật ngữ
  tiếng Anh khi dùng (kèm ví dụ). Xưng "tôi", gọi người dùng là "thầy".
- Thầy đưa code lên GitHub bằng **GitHub Desktop** (Commit to main → Push origin). Không tự `git push`
  trừ khi thầy yêu cầu rõ.

## Quy trình làm việc BẮT BUỘC
1. Sửa code.
2. **Tăng phiên bản ở cả 2 chỗ** (nếu không, điện thoại sẽ giữ bản cũ trong bộ nhớ đệm):
   - `index.html`: `const VERSION='X.Y.Z'`
   - `sw.js`: `const CACHE = 'so-lop-vX.Y.Z'`
   (Thêm file mới cần chạy offline → thêm vào mảng `FILES` trong `sw.js`.)
3. Tự kiểm tra: mở bằng server cục bộ (`python -m http.server 8765` rồi vào http://localhost:8765),
   thử ở cỡ điện thoại (~390px) và máy tính (≥900px), xem Console không có lỗi.
4. **Tạo file xem trước gửi thầy duyệt** trước khi thầy commit: chạy `python tools/xem-truoc.py`
   → tạo `xem-truoc.html` (một file duy nhất, đã nhúng qr.js và ảnh). Có thể kèm ảnh chụp màn hình.
5. Báo thầy ngắn gọn đã sửa gì, rồi nhắc thầy commit + push.

## Cấu trúc file
| File | Vai trò |
|---|---|
| `index.html` | Toàn bộ CSS + HTML + JS của app (một file, JS thuần, không framework) |
| `qr.js` | Bộ tạo mã QR tự viết (byte mode, mức M, phiên bản 1–10), xuất `window.QR.encode/svg` |
| `sw.js` | Service worker: cache file để chạy offline; trang chính ưu tiên tải bản mới từ mạng |
| `manifest.webmanifest` | Thông tin cài app (tên "Sổ Lớp", màu, icon) |
| `privacy.html` | Chính sách quyền riêng tư (Google yêu cầu, link trong màn hình đồng ý OAuth) |
| `logo.png`, `mark.png`, `icon-*.png`, `favicon.png`, `apple-touch-icon.png` | Logo Đ-LAB |

### Bản đồ `index.html` (tìm theo các dòng chú thích `/* ---------- ... ---------- */`)
Biểu tượng (IC, Feather) · Ngân hàng (BANKS, vietqr, crc16) · Dữ liệu (S, load/save, IndexedDB) ·
Tra cứu (feeAt, feeState, enrolled…) · Giao diện chung (sheet, toast, arm) · Trang chủ (vHome, tile,
QUOTES, PLANE) · Lớp · Học sinh · Điểm danh · Thông báo chung · Học phí · Báo cáo & Thêm · Xuất Excel ·
Mã hóa (Web Crypto) · Lưu file · Khóa PIN · Màn hình chào mừng (onboard) · Vẽ trang (render, NAV) ·
Xử lý nút bấm (đối tượng `A`, dùng `data-a="tên"` trên nút) · ĐỒNG BỘ GOOGLE DRIVE · Khởi động.

Kiểu viết: chuỗi template → `innerHTML`; mọi dữ liệu người dùng phải qua `esc()`.
Sự kiện dùng ủy quyền: `document.addEventListener('click', ...)` gọi `A[data-a](nút)`.

## Mô hình dữ liệu (`S`, lưu ở IndexedDB `lop-hoc`/`kv`/`state` + localStorage `lop-hoc-v2`)
- `set`: `{title, xung, name, bin, bank, acc, holder, ob}` — `xung` = Thầy/Cô/…; `title` = tên trung tâm
  (mặc định 'Sổ Lớp'); `ob` = đã qua màn hình chào mừng.
- `classes[]`: `{id, name, days[0-6], start, end, place, fees:[{from:'YYYY-MM', fee}]}`
- `students[]`: `{id, name, classId, pr, pn, pp, note, fees[], from:'YYYY-MM', d?, left?, ch?}`
  — `d` ngày đóng phí 2–28 (không có = ngày 1, theo tháng dương lịch), lấy từ "Ngày vào học".
  — `ch:[{from:'YYYY-MM', cid}]` lịch sử chuyển lớp (tháng cũ tính học phí theo lớp cũ, xem `clsAt()`).
- `att{ 'YYYY-MM-DD|classId': {m:{sid:'c'|'p'|'k'}, n:{sid:'lý do'}, t?, cm?, off?} }` — c có mặt, p có phép,
  k không phép; `t` nội dung buổi học, `cm:{sid:'nhận xét'}` (đưa vào báo cáo tháng), `off:1` buổi nghỉ không dạy.
- `pays[]`: `{id, sid, month:'YYYY-MM', amount, date, how, w?}` — `w:1` = miễn giảm (tính là đã đủ, không tính doanh thu).
- `del{}`: "bia mộ" bản ghi đã xóa (cho đồng bộ); mỗi bản ghi có thể có `u` (thời điểm sửa) do `stamp()` gắn.
- `pin`, `lastBackup`, `seen`, `savedAt`: riêng từng máy, **không đồng bộ**.

**Không được làm hỏng dữ liệu cũ của người dùng.** Đổi cấu trúc → viết chuyển đổi trong `normalize()`.
Trường mới phải được giữ lại/làm sạch trong `clean()` (mọi dữ liệu nạp vào đều đi qua đây).
Học phí có lịch sử (`fees[]` theo tháng) để đổi học phí không làm sai các tháng trước.

## Những điều KHÔNG được thay đổi tùy tiện
- **Địa chỉ trang / tên kho lưu** (`LS`, `DBN`): đổi là người dùng mất dữ liệu trên máy.
- **CSP** trong `<meta http-equiv="Content-Security-Policy">`: chỉ cho phép chính app + Google
  (accounts.google.com, www.googleapis.com). Không thêm CDN/thư viện ngoài; muốn dùng thư viện thì
  chép file vào repo.
- **Đồng bộ Google Drive**: `GOOGLE_CLIENT_ID` (công khai, không phải bí mật), quyền `drive.file`,
  file `so-lop-dong-bo.json`, mã hóa AES-GCM bằng mật khẩu đồng bộ (PBKDF2 250.000 vòng).
  Google Cloud: dự án "So Lop" (ID `so-lop-511604`), origin cho phép: `https://hanthuandinh.github.io`.
  Đổi domain → phải thêm origin mới trong Google Cloud Console.
- Không lưu Client Secret, mật khẩu, token vào code hay repo (repo công khai).
- **Ủng hộ (donate)**: hằng `DONATE` (VietinBank 0776228879, HAN THUAN DINH, nội dung `UNG HO SO LOP`) là tài khoản
  của thầy, để công khai có chủ ý (thầy đã đồng ý). Không tự đổi; không làm bảng ủng hộ tự bật lên.

## Nhập số tiền
Ô tiền dùng `class="money" type="text"`, đọc bằng `parseMoney()` (bỏ mọi ký tự không phải số).
**Không dùng `type="number"` cho tiền** — "800.000" sẽ bị hiểu thành 800.

## Quyết định sản phẩm đã chốt
- Thu học phí **theo tháng**, không theo buổi.
- Nghỉ dạy / dạy bù: chỉ cần mẫu tin "Thông báo chung", không làm tính năng riêng.
- Phụ huynh không cài app; mọi thứ gửi qua Zalo (sao chép tin, mở zalo.me/SĐT).
- Thầy hay ghi lớp ở trường sau tên học sinh (vd "Đoàn Nguyên Đức 4.7"); `initial()` bỏ qua phần số.
  **Không làm ô riêng "Lớp ở trường"** (thầy đã quyết định không cần).
- Kỳ học phí theo ngày vào học: kỳ của tháng m = ngày d tháng m → ngày d-1 tháng sau, **đóng đầu kỳ**
  (hạn = ngày d tháng m). Chưa tới hạn → trạng thái `wait` "Chưa đến hạn", không tính nợ. Xem `feeState()`, `kLabel()`.
- Nợ học phí dồn: tính từ tháng em vào học (`from`), tối đa 60 tháng, xem `owe()`/`debtors()`.

## Ý tưởng chưa làm
- Nhập danh sách học sinh từ file Excel.
