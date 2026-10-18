"""Tạo file xem trước một-file (xem-truoc.html) để gửi thầy duyệt.
Nhúng sẵn qr.js và ảnh PNG vào index.html, bỏ manifest. Chạy: python tools/xem-truoc.py"""
import base64, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
s = (root / 'index.html').read_text(encoding='utf-8')
s = s.replace('<script src="qr.js"></script>', '<script>' + (root / 'qr.js').read_text(encoding='utf-8') + '</script>')
for f in ['mark.png', 'logo.png', 'favicon.png', 'apple-touch-icon.png']:
    d = 'data:image/png;base64,' + base64.b64encode((root / f).read_bytes()).decode()
    s = s.replace(f'src="{f}"', f'src="{d}"').replace(f'href="{f}"', f'href="{d}"')
s = s.replace('<link rel="manifest" href="manifest.webmanifest">', '')
out = root / 'xem-truoc.html'
out.write_text(s, encoding='utf-8')
print('Da tao file xem truoc:', out)
