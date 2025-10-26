// Nom du cache
const CACHE_NAME = 'abenabbes-v1';

// Fichiers à mettre en cache (à adapter selon ton site)
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style-site.css',
  '/site.webmanifest',
  '/favicon/web-app-manifest-192x192.png',
  '/favicon/web-app-manifest-512x512.png'
];

// Installation du service worker et mise en cache des fichiers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Mise en cache des fichiers...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activation du service worker et nettoyage de l’ancien cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Retourne la ressource du cache ou la télécharge
      return response || fetch(event.request);
    })
  );
});
