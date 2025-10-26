// Nom du cache (incrémente à chaque mise à jour du site)
const CACHE_NAME = 'abenabbes-v3';

// Liste des fichiers à mettre en cache
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style-site.css', 
  './site.webmanifest',
  './favicon/web-app-manifest-192x192.png',
  './favicon/web-app-manifest-512x512.png'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log('📦 Mise en cache des fichiers...');
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
          console.log(`✅ Ajouté au cache : ${asset}`);
        } catch (err) {
          console.warn(`⚠️ Échec du cache pour : ${asset}`, err);
        }
      }
    })
  );
});

// Activation : suppression des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  console.log('🔄 Service Worker activé');
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
