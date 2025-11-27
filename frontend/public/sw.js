const CACHE_NAME = 'rosalisca-v1';
const STATIC_ASSETS = [
  '/',
  '/logo2.png',
  '/robots.txt',
  '/images/placeholder.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  // Cache first for static assets
  if (event.request.url.includes('/images/') || event.request.url.includes('/logo')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
    return;
  }

  // Network first for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Default: network first
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
