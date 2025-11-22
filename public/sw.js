const CACHE_NAME = 'trn-v2';
const STATIC_CACHE = 'trn-static-v2';
const DYNAMIC_CACHE = 'trn-dynamic-v2';
const API_CACHE = 'trn-api-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html',
];

const MAX_AGE = {
  static: 365 * 24 * 60 * 60 * 1000, // 1 year
  dynamic: 7 * 24 * 60 * 60 * 1000, // 1 week
  api: 5 * 60 * 1000, // 5 minutes
};

// Install service worker and precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => 
              name !== STATIC_CACHE && 
              name !== DYNAMIC_CACHE && 
              name !== API_CACHE
            )
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Sophisticated fetch strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Strategy 1: Cache-first for static assets (JS, CSS, images, fonts)
  if (
    request.url.includes('/assets/') ||
    request.url.match(/\.(js|css|woff2?|ttf|eot)$/) ||
    request.url.includes('.png') ||
    request.url.includes('.jpg') ||
    request.url.includes('.webp') ||
    request.url.includes('.svg')
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          if (cached) {
            // Return cached version and update in background
            const fetchPromise = fetch(request)
              .then((fetchResponse) => {
                if (fetchResponse && fetchResponse.ok) {
                  cache.put(request, fetchResponse.clone());
                }
                return fetchResponse;
              })
              .catch(() => cached);
            
            return cached;
          }
          
          // Not in cache, fetch and cache
          return fetch(request).then((fetchResponse) => {
            if (fetchResponse && fetchResponse.ok) {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      }).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Strategy 2: Stale-while-revalidate for API calls
  if (
    request.url.includes('/api/') ||
    request.url.includes('dexscreener') ||
    request.url.includes('supabase')
  ) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((fetchResponse) => {
            if (fetchResponse && fetchResponse.ok) {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          });
          
          // Return cached if available, otherwise wait for fetch
          return cached || fetchPromise;
        });
      }).catch(() => {
        // Fallback to cache on network error
        return caches.match(request);
      })
    );
    return;
  }

  // Strategy 3: Network-first for HTML pages
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((fetchResponse) => {
          const responseClone = fetchResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return fetchResponse;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // Default: Network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((fetchResponse) => {
        if (fetchResponse && fetchResponse.ok) {
          const responseClone = fetchResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return fetchResponse;
      })
      .catch(() => caches.match(request))
  );
});
