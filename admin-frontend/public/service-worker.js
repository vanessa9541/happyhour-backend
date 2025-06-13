self.addEventListener("install", event => {
  console.log("Le service worker est installé.");
});

// Implementer un cas d'utilisation cache
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});