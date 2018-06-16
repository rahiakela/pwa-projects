let cacheName = 'latestNews-v1';

// Cache our known resources during install
self.addEventListener('install', event => {
    event.waitUntil(
        // Open the cache and store an array of resources to cache during install time.
        caches.open(cacheName)
            .then(cache => cache.addAll([
                './js/main.js',
                './js/article.js',
                './images/newspaper.svg',
                './css/site.css',
                './data/latest.json',
                './data/data-1.json',
                './article.html',
                './index.html'
            ]))
    );
});

// Cache any new resources as they are fetched
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true}) // Ignore any querystring parameters so you don’t get any cache misses.
            .then(response => {
                if (response) {
                    return response; // If you found a successful match, return it at this point and go no further.
                }

                let requestToCache = event.request.clone();
                // If you didn’t find anything in cache, make the request
                return fetch(requestToCache).then(response => {
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    let responseToCache = response.clone();
                    caches.open(cacheName).then(cache => {
                        // Store it in cache so we won’t need to make that request again
                        cache.put(requestToCache, responseToCache);
                    });

                    return response;
                });
            })
    );
});

