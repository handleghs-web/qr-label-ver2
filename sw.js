// 업데이트 시 VERSION 숫자만 올리면 기기에서 새 파일로 교체됩니다.
const VERSION = "label-v3";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./jsQR.js", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 캐시 우선, 없으면 네트워크. 오프라인에서도 앱이 열립니다.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request))
  );
});
