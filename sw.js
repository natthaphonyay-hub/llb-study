// ห้องอ่านสอบ: เก็บทุกไฟล์ไว้ในเครื่องตอนติดตั้ง เปิดอ่านได้แม้ไม่มีเน็ต
const V = 'cc73cb5f2cf2';
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "data/m.bin", "u/10151-01.bin", "u/10151-02.bin", "u/10151-03.bin", "u/10151-04.bin", "u/10151-05.bin", "u/10151-06.bin", "u/10151-07.bin", "u/10151-08.bin", "u/10151-09.bin", "u/10151-10.bin", "u/10151-11.bin", "u/10151-12.bin", "u/10151-13.bin", "u/10151-14.bin", "u/10151-15.bin", "u/10151-c-01.bin", "u/10151-c-02.bin", "u/10151-c-03.bin", "u/10151-c-04.bin", "u/10151-c-05.bin", "u/10151-c-06.bin", "u/10151-c-07.bin", "u/10151-c-08.bin", "u/10151-c-09.bin", "u/10151-c-10.bin", "u/10151-c-11.bin", "u/40101-01.bin", "u/40101-02.bin", "u/40101-03.bin", "u/40101-04.bin", "u/40101-05.bin", "u/40101-06.bin", "u/40101-07.bin", "u/40101-08.bin", "u/40101-09.bin", "u/40101-10.bin", "u/40101-11.bin", "u/40101-12.bin", "u/40101-13.bin", "u/40101-14.bin", "u/40101-15.bin", "u/40101-x-cram.bin", "u/40101-x-exam.bin", "u/40101-x-intro.bin", "u/41216-01.bin", "u/41216-02.bin", "u/41216-03.bin", "u/41216-04.bin", "u/41216-05-one.bin", "u/41216-05.bin", "u/41216-06.bin", "u/41216-07.bin", "u/41216-08.bin", "u/41216-09.bin", "u/41216-10.bin", "u/41216-11.bin", "u/41216-12.bin", "u/41216-13.bin", "u/41216-14.bin", "u/41216-15.bin", "u/41216-x-real.bin", "u/41216-x-tutor.bin"];
const CACHE = 'llb-' + V;
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k.startsWith('llb-') && k !== CACHE && k !== 'llb-fonts').map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.origin === self.location.origin) {
    if (u.pathname.endsWith('/data/m.bin')) {
      // รายการหน่วย: ลองเน็ตก่อน ไม่มีเน็ตค่อยใช้ของในเครื่อง
      e.respondWith(fetch(req).then((res) => {
        if (res.ok) { const cl = res.clone(); caches.open(CACHE).then((c) => c.put(req, cl)); }
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true })));
      return;
    }
    e.respondWith(caches.match(req, { ignoreSearch: true })
      .then((r) => r || (req.mode === 'navigate' ? caches.match('index.html') : null))
      .then((r) => r || fetch(req)));
  } else if (u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open('llb-fonts').then((c) => c.match(req).then((r) => r || fetch(req).then((res) => {
      c.put(req, res.clone());
      return res;
    }))));
  }
});
