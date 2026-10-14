/* Bộ tạo mã QR nhỏ gọn (byte mode, mức sửa lỗi M, phiên bản 1–10).
   Chạy hoàn toàn trên máy, không gửi dữ liệu đi đâu. Tác giả: Sổ Lớp · Đ-LAB. */
(function (g) {
  'use strict';
  // [số mã sửa lỗi mỗi khối, số khối nhóm 1, dữ liệu/khối nhóm 1, số khối nhóm 2, dữ liệu/khối nhóm 2]
  var EC = {1:[10,1,16,0,0],2:[16,1,28,0,0],3:[26,1,44,0,0],4:[18,2,32,0,0],5:[24,2,43,0,0],6:[16,4,27,0,0],7:[18,4,31,0,0],8:[22,2,38,2,39],9:[22,3,36,2,37],10:[26,4,43,1,44]};
  var AL = {1:[],2:[6,18],3:[6,22],4:[6,26],5:[6,30],6:[6,34],7:[6,22,38],8:[6,24,42],9:[6,26,46],10:[6,28,50]};
  var EXP = new Array(512), LOG = new Array(256), x = 1, i;
  for (i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
  for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  function mul(a, b) { return a && b ? EXP[LOG[a] + LOG[b]] : 0; }
  function rsRem(data, n) {
    var gp = [1], j, k;
    for (k = 0; k < n; k++) { var ng = new Array(gp.length + 1).fill(0); for (j = 0; j < gp.length; j++) { ng[j] ^= gp[j]; ng[j + 1] ^= mul(gp[j], EXP[k]); } gp = ng; }
    var r = data.concat(new Array(n).fill(0));
    for (k = 0; k < data.length; k++) { var c = r[k]; if (c) for (j = 0; j < gp.length; j++) r[k + j] ^= mul(gp[j], c); }
    return r.slice(data.length);
  }
  var MASK = [
    function (r, c) { return (r + c) % 2 === 0; }, function (r) { return r % 2 === 0; },
    function (r, c) { return c % 3 === 0; }, function (r, c) { return (r + c) % 3 === 0; },
    function (r, c) { return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0; },
    function (r, c) { return (r * c) % 2 + (r * c) % 3 === 0; },
    function (r, c) { return ((r * c) % 2 + (r * c) % 3) % 2 === 0; },
    function (r, c) { return ((r + c) % 2 + (r * c) % 3) % 2 === 0; }];
  function penalty(M, n) {
    var p = 0, r, c, run, k;
    for (r = 0; r < n; r++) { run = 1; for (c = 1; c < n; c++) { if (M[r][c] === M[r][c - 1]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
    for (c = 0; c < n; c++) { run = 1; for (r = 1; r < n; r++) { if (M[r][c] === M[r - 1][c]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
    for (r = 0; r < n - 1; r++) for (c = 0; c < n - 1; c++) { var v = M[r][c]; if (v === M[r][c + 1] && v === M[r + 1][c] && v === M[r + 1][c + 1]) p += 3; }
    var P1 = [1,0,1,1,1,0,1,0,0,0,0], P2 = [0,0,0,0,1,0,1,1,1,0,1];
    for (r = 0; r < n; r++) for (c = 0; c <= n - 11; c++) {
      var a = 1, b = 1, a2 = 1, b2 = 1;
      for (k = 0; k < 11; k++) { if (M[r][c + k] !== P1[k]) a = 0; if (M[r][c + k] !== P2[k]) b = 0; if (M[c + k][r] !== P1[k]) a2 = 0; if (M[c + k][r] !== P2[k]) b2 = 0; }
      p += 40 * (a + b + a2 + b2);
    }
    var dark = 0; for (r = 0; r < n; r++) for (c = 0; c < n; c++) dark += M[r][c];
    p += Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
    return p;
  }
  function encode(text) {
    var bytes = Array.from(new TextEncoder().encode(text)), v, e, cap;
    for (v = 1; v <= 10; v++) { e = EC[v]; cap = e[1] * e[2] + e[3] * e[4]; if (4 + (v < 10 ? 8 : 16) + bytes.length * 8 <= cap * 8) break; }
    if (v > 10) throw new Error('Nội dung quá dài để tạo mã QR');
    var bits = [];
    function put(val, n) { for (var q = n - 1; q >= 0; q--) bits.push((val >>> q) & 1); }
    put(4, 4); put(bytes.length, v < 10 ? 8 : 16); bytes.forEach(function (b) { put(b, 8); });
    for (i = 0; i < 4 && bits.length < cap * 8; i++) bits.push(0);
    while (bits.length % 8) bits.push(0);
    var data = [];
    for (i = 0; i < bits.length; i += 8) { var by = 0; for (var j = 0; j < 8; j++) by = (by << 1) | bits[i + j]; data.push(by); }
    for (var pd = 0; data.length < cap; pd++) data.push(pd % 2 ? 0x11 : 0xEC);
    var blocks = [], k = 0, gi, bi;
    for (gi = 0; gi < 2; gi++) for (bi = 0; bi < e[1 + gi * 2]; bi++) { var d = data.slice(k, k + e[2 + gi * 2]); k += d.length; blocks.push({ d: d, ec: rsRem(d, e[0]) }); }
    var out = [], maxD = Math.max.apply(null, blocks.map(function (b) { return b.d.length; }));
    for (i = 0; i < maxD; i++) blocks.forEach(function (b) { if (i < b.d.length) out.push(b.d[i]); });
    for (i = 0; i < e[0]; i++) blocks.forEach(function (b) { out.push(b.ec[i]); });

    var n = v * 4 + 17, M = [], F = [], r, c;
    for (r = 0; r < n; r++) { M.push(new Array(n).fill(0)); F.push(new Array(n).fill(false)); }
    function set(rr, cc, val) { M[rr][cc] = val; F[rr][cc] = true; }
    function finder(r0, c0) {
      for (var a = -1; a <= 7; a++) for (var b = -1; b <= 7; b++) {
        var rr = r0 + a, cc = c0 + b; if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
        var on = a >= 0 && a <= 6 && b >= 0 && b <= 6 && (a === 0 || a === 6 || b === 0 || b === 6 || (a >= 2 && a <= 4 && b >= 2 && b <= 4));
        set(rr, cc, on ? 1 : 0);
      }
    }
    finder(0, 0); finder(0, n - 7); finder(n - 7, 0);
    for (i = 8; i < n - 8; i++) { set(6, i, i % 2 ? 0 : 1); set(i, 6, i % 2 ? 0 : 1); }
    var al = AL[v], last = al[al.length - 1];
    al.forEach(function (ar) { al.forEach(function (ac) {
      if ((ar === 6 && ac === 6) || (ar === 6 && ac === last) || (ar === last && ac === 6)) return;
      for (var a = -2; a <= 2; a++) for (var b = -2; b <= 2; b++) set(ar + a, ac + b, Math.max(Math.abs(a), Math.abs(b)) !== 1 ? 1 : 0);
    }); });
    for (i = 0; i < 9; i++) { if (!F[8][i]) set(8, i, 0); if (!F[i][8]) set(i, 8, 0); }
    for (i = 0; i < 8; i++) { set(8, n - 1 - i, 0); set(n - 1 - i, 8, 0); }
    set(n - 8, 8, 1);
    if (v >= 7) {
      var rem = v; for (i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
      var vb = (v << 12) | rem;
      for (i = 0; i < 18; i++) { var bit = (vb >>> i) & 1, a1 = n - 11 + (i % 3), b1 = Math.floor(i / 3); set(b1, a1, bit); set(a1, b1, bit); }
    }
    var stream = []; out.forEach(function (b) { for (var q = 7; q >= 0; q--) stream.push((b >> q) & 1); });
    var si = 0, up = true;
    for (c = n - 1; c > 0; c -= 2) {
      if (c === 6) c--;
      for (var t = 0; t < n; t++) { r = up ? n - 1 - t : t; for (var dd = 0; dd < 2; dd++) { var cc2 = c - dd; if (F[r][cc2]) continue; M[r][cc2] = si < stream.length ? stream[si] : 0; si++; } }
      up = !up;
    }
    function fmt(T, mk) {
      var data2 = (0 << 3) | mk, rm = data2; // mức M = 00
      for (var q = 0; q < 10; q++) rm = (rm << 1) ^ ((rm >>> 9) * 0x537);
      var fb = ((data2 << 10) | rm) ^ 0x5412, gb = function (q) { return (fb >>> q) & 1; };
      for (q = 0; q <= 5; q++) T[q][8] = gb(q);
      T[7][8] = gb(6); T[8][8] = gb(7); T[8][7] = gb(8);
      for (q = 9; q < 15; q++) T[8][14 - q] = gb(q);
      for (q = 0; q < 8; q++) T[8][n - 1 - q] = gb(q);
      for (q = 8; q < 15; q++) T[n - 15 + q][8] = gb(q);
      T[n - 8][8] = 1;
    }
    var best = null, bp = Infinity;
    for (var mk = 0; mk < 8; mk++) {
      var T = M.map(function (row) { return row.slice(); });
      for (r = 0; r < n; r++) for (c = 0; c < n; c++) if (!F[r][c] && MASK[mk](r, c)) T[r][c] ^= 1;
      fmt(T, mk);
      var pp = penalty(T, n); if (pp < bp) { bp = pp; best = T; }
    }
    return best;
  }
  function svg(text, px) {
    var m = encode(text), n = m.length, q = 4, d = '';
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (m[r][c]) d += 'M' + (c + q) + ' ' + (r + q) + 'h1v1h-1z';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (n + 2 * q) + ' ' + (n + 2 * q) + '" width="' + (px || 220) + '" height="' + (px || 220) + '" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
  }
  g.QR = { encode: encode, svg: svg };
})(typeof window !== 'undefined' ? window : globalThis);
