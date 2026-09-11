// Minimal service worker — required for Chrome/Android to consider the site
// installable. Doesn't do aggressive offline caching (nothing here is a full
// offline app), just satisfies the technical requirement and caches the basics
// so the icon/shell loads a little faster on repeat visits.

const CACHE_NAME = 'shopbrain-shell-v1';
const SHELL_FILES = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first, falling back to cache — keeps the site always fresh when online,
  // still resolves something reasonable if a request fails.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
