//<========== Name cache ===========>
const myCache = 'start'; 
//<========= Choose files to cache ========>
let filesToCache = [
	'./',
	'./index.html',
	'./js/script.js',
	'./css/style.css',
	'./mdbootstrap/css/bootstrap.min.css',
	'./mdbootstrap/css/mdb.min.css',
	'./mdbootstrap/js/jquery-3.3.1.min.js',
	'./mdbootstrap/js/popper.min.js',
	'./mdbootstrap/js/bootstrap.min.js',
	'./mdbootstrap/js/mdb.min.js'

];
//<======  Install service worker =======>

self.addEventListener('install', function(event) {
    console.log('[my PWA] Installed');
    event.waitUntil(
	    caches.open(myCache).then(function(cache) {console.log('[my PWA] Caching filesToCache');
			return cache.addAll(filesToCache);
	    })
	); 
});

//<====== Activate service worker and check to delete similar caches ========>

self.addEventListener('activate', function(event) {
    console.log('[my PWA] Activated');
    event.waitUntil(caches.keys().then(function(myCaches) {
			return Promise.all(myCaches.map(function(newCache) {
				if (newCache !== myCache) {
					console.log('[my PWA] Removing Cached Files from Cache - ', newCache);
					return caches.delete(newCache);
				}
			}));
		})
	);
});

//<========== Fetch Cache data when offline =======>
self.addEventListener('fetch', function(event) {
	console.log('[my PWA] Fetch', event.request.url);
	event.respondWith(
		caches.match(event.request)
			.then(function(response) {
				if ( response ) {
					console.log("[my PWA] Found in Cache", event.request.url, response);
					return response;
				}
				let myRequest = event.request.clone();
				return fetch(myRequest)
					.then(function(response) {

						if ( !response ) {
							console.log("[my PWA] No response from fetch ")
							return response;
						}
						let myResponse = response.clone();
						caches.open(myCache).then(function(cache) {
							cache.put(event.request, myResponse);
							console.log('[my PWA] New Data Cached', event.request.url);
							return response;			
				        }); 
					})
					.catch(function(err) {
						console.log('[my PWA] Error Fetching & Caching New Data', err);
					});
			}) 
	); 
});
