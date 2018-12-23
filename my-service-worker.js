self.addEventListener('install', function (e) {
    let index = new Request('index.html');
    e.waitUntil(
        fetch(index).then(function (response) {
            return caches.open('offline-version').then(function (cache) {
                console.log('[PWA] Page cached during install' + response.url);
                return cache.put(index, response);
            });
        }));
});

self.addEventListener('fetch', function (e) {
    let newCache = function (request) {
        return caches.open('offline-version').then(function (cache) {
            return fetch(request).then(function (response) {
                console.log('[PWA] add page to offline' + response.url)
                return cache.put(request, response);
            });
        });
    };

    e.waitUntil(newCache(e.request));
    e.respondWith(
        fetch(e.request).catch(function (err) {
            console.log('[PWA] Network request Failed. Serving content from cache');
            return caches.open('offline-version').then(function (cache) {
                return cache.match(e.request).then(function (matching) {
                    let report = !matching || matching.status == 404 ? Promise.reject('No match found') : matching;
                    return report
                });
            });
        })
    );
});
