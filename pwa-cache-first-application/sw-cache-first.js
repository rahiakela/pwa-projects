const cacheName = 'cache-first-demo';

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(fetchResponse => {
                    if (!fetchResponse || fetchResponse.status !== 200) {
                        return fetchResponse;
                    }

                    const responseToCache = fetchResponse.clone();

                    caches.open(cacheName).then(cache => cache.put(event.request, responseToCache));

                    return fetchResponse;
                });
            })
    );
});