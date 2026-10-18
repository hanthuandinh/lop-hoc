// Service worker: lưu sẵn các file của app để mở được khi không có mạng.
// Không đụng tới dữ liệu học sinh (dữ liệu nằm trong IndexedDB của trình duyệt).
const CACHE = 'so-lop-v1.5.0';
const FILES = ['./', './index.html', './manifest.webmanifest', './qr.js', './privacy.html', './logo.png', './mark.png', './favicon.png', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  // Trang chính: ưu tiên bản mới trên mạng, mất mạng thì dùng bản đã lưu
  // Chỉ lưu đè trang app (thư mục gốc hoặc index.html) và chỉ khi tải thành công. Trang khác (privacy.html…)
  // hay trang lỗi không được ghi vào chỗ của app, nếu không mất mạng mở app sẽ ra nhầm trang.
  if (r.mode === 'navigate') {
    const path = new URL(r.url).pathname, isApp = path.endsWith('/') || path.endsWith('/index.html');
    e.respondWith(fetch(r).then(res => {
      if (isApp && res.ok && !res.redirected) { const cp = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); }
      return res;
    }).catch(() => (isApp ? caches.match('./index.html') : caches.match(r)).then(hit => hit || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r)));
});
