// service-worker.js
// WebKreativ - Service Worker automatique (pré-cache + runtime + update automatique)

// Incrémente pour forcer refresh des caches (changer si update)
const SW_VERSION = 'v1.3';
const CACHE_NAME = `webkreativ-cache-${SW_VERSION}`;
const RUNTIME = `webkreativ-runtime-${SW_VERSION}`;
const ROOT_PATH = '/webkreativ/';

// Assets same-origin à pré-cacher (ajoute/supprime si besoin)
const ASSETS_TO_CACHE = [
  `${ROOT_PATH}`,
  `${ROOT_PATH}index.html`,
  `${ROOT_PATH}merci.html`,
  `${ROOT_PATH}offline.html`,
  `${ROOT_PATH}css/style-site.css`,
  `${ROOT_PATH}css/offline.css`,
  `${ROOT_PATH}js/main.js`,
  `${ROOT_PATH}js/email.js`,
  `${ROOT_PATH}site.webmanifest`,
  `${ROOT_PATH}favicon/web-app-manifest-192x192.png`,
  `${ROOT_PATH}favicon/web-app-manifest-512x512.png`
];

// Helper : detect cross-origin
function isCrossOrigin(requestUrl) {
  try {
    const req = new URL(requestUrl);
    return req.origin !== self.location.origin;
  } catch (e) {
    return false;
  }
}

// INSTALL : pré-cache
self.addEventListener('install', event => {
  self.skipWaiting(); // Passe à l'activation sans attendre
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .catch(err => console.warn('[SW] pré-cache failed:', err))
  );
});

// ACTIVATE : nettoyer anciennes caches, claim et notifier clients
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => k !== CACHE_NAME && k !== RUNTIME)
      .map(k => caches.delete(k))
    );
    await self.clients.claim(); // prend le contrôle immédiatement
    // Notifier tous les clients pour qu'ils se rechargent automatiquement
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      try {
        client.postMessage({ action: 'sw-activated', version: SW_VERSION });
      } catch (e) {
        // ignore
      }
    }
  })());
});

// FETCH : stratégie prudente
self.addEventListener('fetch', event => {
  const req = event.request;

  // Ignore non-http(s) or non-GET or skip if navigation for external scheme
  if (!req.url.startsWith('http') || req.method !== 'GET') return;

  // Cross-origin handling
  if (isCrossOrigin(req.url)) {
    try {
      const urlObj = new URL(req.url);
      const host = urlObj.hostname;
      // EmailJS CDN / API -> network-first (do not cache)
      if (host.includes('emailjs.com') || host.includes('api.emailjs.com')) {
        event.respondWith(
          fetch(req).catch(() => new Response('Service indisponible', { status: 503, statusText: 'Service Unavailable' }))
        );
        return;
      }
      // For other cross-origin requests (fonts, CDNs), do not intercept — let browser handle
      return;
    } catch (e) {
      return;
    }
  }

  // Navigation HTML : network-first, fallback cache -> offline.html
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(response => {
          // update runtime cache for navigations
          const clone = response.clone();
          caches.open(RUNTIME).then(cache => {
            if (response && response.status === 200) cache.put(req, clone).catch(()=>{});
          });
          return response;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match(`${ROOT_PATH}offline.html`)))
    );
    return;
  }

  // Assets same-origin: cache-first, otherwise fetch & cache
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return caches.open(RUNTIME).then(cache =>
        fetch(req).then(response => {
          if (response && response.status === 200 && req.method === 'GET') {
            try { cache.put(req, response.clone()); } catch (e) { /* noop */ }
          }
          return response;
        }).catch(() => cached) // return cached if available, else undefined
      );
    })
  );
});

// MESSAGE : support skipWaiting / autres commandes
self.addEventListener('message', event => {
  const data = event.data || {};
  if (data && data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
