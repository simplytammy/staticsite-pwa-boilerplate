//check to see if there is  an active service worker
if (navigator.serviceWorker.controller) {
  console.log('[PWA] There is an active service worker registered!')
} else {
  //Register the ServiceWorker
  navigator.serviceWorker.register('my-service-worker.js', {
    scope: './'
  }).then(function (reg) {
    console.log('Service worker registration was successful')
  }).catch(function (err) {
    console.log("Service worker Failed to register")
  });
}
