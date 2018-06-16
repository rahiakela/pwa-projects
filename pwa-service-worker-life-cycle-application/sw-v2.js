const expectedCaches = ['static-v2'];

self.addEventListener('install', event => {
    console.log('V2 installing…');

    // cache a horse SVG into a new cache, static-v2
    event.waitUntil(
        caches.open('static-v2').then(cache => cache.add('/horse.svg'))
    );
});

self.addEventListener('activate', event => {
    // delete any caches that aren't in expectedCaches
    // which will get rid of static-v1
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.map(key => {
                    if (!expectedCaches.includes(key)) {
                        return caches.delete(key);
                    }
                })
            ))
            .then(() => console.log('V2 now ready to handle fetches!'))
    );
});

