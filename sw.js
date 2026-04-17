const CACHE_NAME = 'tesla-charge-timer-v1';
const URLS_TO_CACHE = [
  '/tesla-charge-timer/',
  '/tesla-charge-timer/index.html',
  '/tesla-charge-timer/style.css',
  '/tesla-charge-timer/script.js',
  '/tesla-charge-timer/logo-tesla.png',
  '/tesla-charge-timer/site.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
