// Installation
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

// Réception d'un push depuis le serveur
self.addEventListener("push", event => {
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification("Restaurant", {
      body: data.message,
      icon: "/img/icon.png"
      // le son sera géré par le navigateur automatiquement
    })
  );
});

// Clic sur la notification
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
