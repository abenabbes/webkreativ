// 🔹 Nom du cache (avec date pour forcer la mise à jour automatiquement)
const CACHE_NAME = `webkreativ-cache-${new Date().toISOString().slice(0,10)}`;

// 🔹 Liste des fichiers à mettre en cache
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style-site.css',
  './js/main.js',
  './js/email.js',
  './site.webmanifest',
  './favicon/web-app-manifest-192x192.png',
  './favicon/web-app-manifest-512x512.png',
  './offline.html'
];

// 🔹 Installation du Service Worker
self.addEventListener('install', event => {
  console.log('📦 Installation du Service Worker et mise en cache des ressources...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
          console.log(`✅ Fichier mis en cache : ${asset}`);
        } catch (err) {
          console.warn(`⚠️ Erreur lors de la mise en cache : ${asset}`, err);
        }
      }
    })
  );
  self.skipWaiting(); // activation immédiate du nouveau SW
});

// 🔹 Activation : nettoyage des anciens caches
self.addEventListener('activate', event => {
  console.log('🧹 Nettoyage des anciens caches...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log(`🗑️ Suppression du cache obsolète : ${key}`);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim(); // prend le contrôle sans rechargement
});

// 🔹 Interception des requêtes : stratégie "network first" avec fallback cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return; // on ignore les requêtes POST (formulaire, EmailJS…)

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si on reçoit une réponse du réseau, on la met en cache
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() =>
        // Si hors ligne → on sert depuis le cache ou offline.html
        caches.match(event.request).then(cachedResponse => cachedResponse || caches.match('./offline.html'))
      )
  );
});
