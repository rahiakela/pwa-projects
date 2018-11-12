const VERSION = 'v4';

self.addEventListener('install', event => event.waitUntil(installServiceWorker()));

async function installServiceWorker() {
  log('Service Worker installation started ');

  const cache = await caches.open(getCacheName());

  return cache.addAll([
    '/',
    'carousel.css',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/holder/2.9.6/holder.min.js',
  ]);
}

self.addEventListener('activate', () => activateSW());

async function activateSW() {
  log('Service Worker activated');

  const cacheKeys = await caches.keys();

  cacheKeys.forEach(cacheKey => {
    if (cacheKey !== getCacheName()) {
      caches.delete(cacheKey);
    }
  });
}

self.addEventListener('fetch', event => event.respondWith(cacheThenNetwork(event)));

async function cacheThenNetwork(event) {
  const cache = await caches.open(getCacheName());

  const cachedResponse = await cache.match(event.request);

  if (cachedResponse) {
    log('Serving From Cache: ' + event.request.url);
    return cachedResponse;
  }

  const networkResponse = await fetch(event.request);

  log('Calling network: ' + event.request.url);

  return networkResponse;
}

function getCacheName() {
  return 'app-cache-' + VERSION;
}

function log(message, ...data) {
  if (data.length > 0) {
    console.log(VERSION, message, data);
  } else {
    console.log(VERSION, message);
  }
}
