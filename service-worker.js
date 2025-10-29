// 🔹 Nom du cache (avec date pour forcer la mise à jour automatiquement)
const CACHE_NAME = `webkreativ-cache-${new Date().toISOString().slice(0, 10)}`;
const ROOT_PATH = '/webkreativ/';

// 🔹 Liste des fichiers à mettre en cache
const ASSETS_TO_CACHE = [
  `${ROOT_PATH}`,
  `${ROOT_PATH}index.html`,
  `${ROOT_PATH}css/style-site.css`,
  `${ROOT_PATH}js/main.js`,
  `${ROOT_PATH}js/email.js`,
  `${ROOT_PATH}site.webmanifest`,
  `${ROOT_PATH}favicon/web-app-manifest-192x192.png`,
  `${ROOT_PATH}favicon/web-app-manifest-512x512.png`,
  `${ROOT_PATH}offline.html`
];

// -----------------------------
// INSTALLATION
// -----------------------------
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
  self.skipWaiting(); // activation immédiate
});

// -----------------------------
// ACTIVATION
// -----------------------------
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
  console.log(`🆕 Service Worker actif – Cache utilisé : ${CACHE_NAME}`);
});

// -----------------------------
// FETCH (interception des requêtes)
// -----------------------------
self.addEventListener('fetch', event => {
  const req = event.request;

  // Ignorer les requêtes non HTTP/HTTPS (chrome-extension://, blob:, etc.)
  if (!req.url.startsWith('http')) return;

  // Ignorer les requêtes POST (formulaires, EmailJS, etc.)
  if (req.method !== 'GET') return;

  // 📄 Stratégie Network First pour les pages HTML
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            try {
              cache.put(req, clone);
            } catch (err) {
              console.warn('⚠️ Impossible de mettre en cache :', req.url, err);
            }
          });
          return response;
        })
        .catch(() => 
          caches.match(req).then(cached => cached || caches.match(`${ROOT_PATH}offline.html`))
        )
    );
    return;
  }

  // 🧩 Stratégie Cache First pour CSS, JS, images, etc.
  event.respondWith(
    caches.match(req).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(req)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            try {
              cache.put(req, clone);
            } catch (err) {
              console.warn('⚠️ Impossible de mettre en cache :', req.url, err);
            }
          });
          return response;
        })
        .catch(() => {
          // fallback offline uniquement pour les requêtes HTML
          if (req.headers.get('accept')?.includes('text/html')) {
            return caches.match(`${ROOT_PATH}offline.html`);
          }
        });
    })
  );
});

// -----------------------------
// MESSAGE (mise à jour instantanée)
// -----------------------------
self.addEventListener('message', event => {
  if (event.data?.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
