/**
 * Sri Sri ❤️ HealthCare - Production Service Worker
 * Multi-device Offline Shell Caching & Standalone PWA Support
 */

const CACHE_NAME = 'srisri-healthcare-pwa-v3.1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png'
];

// Install Event: Cache Core App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean old caches & take immediate control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-first for dynamic API, Cache-first for static assets, Fallback to index.html offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // For API endpoints, always prioritize Network
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ offline: true, message: 'Offline mode active' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // For static assets and navigation, serve with cache fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (Stale-While-Revalidate)
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // If HTML navigation fails offline, serve root index.html
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});
