// Service Worker for caching SVG images
const CACHE_NAME = 'orisuun-images-v1';
const SVG_IMAGES = [
  '/what we offer/optimized/toolsLayer1.svg',
  '/what we offer/optimized/toolsLayer2.svg',
  '/what we offer/optimized/toolsLayer3.svg',
  '/what we offer/optimized/toolsLayer4.svg',
  '/what we offer/optimized/toolsLayer5.svg',
  '/what we offer/optimized/toolsLayer6.svg',
  '/what we offer/optimized/toolsLayer7.svg',
  '/what we offer/optimized/toolsLayer8.svg',
  '/what we offer/optimized/toolsLayer9.svg',
  '/what we offer/optimized/toolsLayer10.svg',
  '/what we offer/optimized/toolsLayer11.svg',
  '/what we offer/optimized/toolsLayer12.svg',
];

// Install event - cache the SVG images
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        
        return cache.addAll(SVG_IMAGES);
      })
      .then(() => {
        
        self.skipWaiting();
      })
      .catch((error) => {
        
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', (event) => {
  // Only handle SVG image requests
  if (event.request.url.includes('/what we offer/') && event.request.url.endsWith('.svg')) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            
            return cachedResponse;
          }
          
          // If not in cache, fetch from network and cache it
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
        })
        .catch((error) => {
          console.error('Error fetching SVG:', error);
          // Return a fallback or empty response
          return new Response('', { status: 200 });
        })
    );
  }
});
