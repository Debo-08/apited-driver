// Service Worker de ApiTed Driver
const CACHE = "apited-v4";
const ASSETS = [
  "/scan",
  "/static/scan.html",
  "/static/manifest.webmanifest",
  "/static/qr-scanner.min.js",
  "/static/icon-192.png",
  "/static/icon-512.png"
];

// Instalar y cachear assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activar y tomar control inmediato
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Interceptar requests
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname === "/scan" || url.pathname.startsWith("/static/")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((networkResponse) => {
            const clone = networkResponse.clone();
            caches.open(CACHE).then((cache) => {
              cache.put(event.request, clone);
            });
            return networkResponse;
          })
          .catch(() => caches.match("/static/scan.html"));
      })
    );
  }
});
