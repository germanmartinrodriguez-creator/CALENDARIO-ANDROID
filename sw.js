const CACHE_NAME = 'calendario-barcelona-final-definitiva-v2';
const ASSETS = [
  '/CALENDARIO-ANDROID/',
  '/CALENDARIO-ANDROID/index.html',
  '/CALENDARIO-ANDROID/manifest.json',
  '/CALENDARIO-ANDROID/icons/icon-192.png',
  '/CALENDARIO-ANDROID/icons/icon-512.png',
  '/CALENDARIO-ANDROID/icono.png'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(()=>{}));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k === CACHE_NAME ? null : caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(res => {
      caches.open(CACHE_NAME).then(cache => cache.put('/CALENDARIO-ANDROID/index.html', res.clone())).catch(()=>{});
      return res;
    }).catch(() => caches.match('/CALENDARIO-ANDROID/index.html')));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone())).catch(()=>{});
    return res;
  }).catch(()=>cached)));
});
