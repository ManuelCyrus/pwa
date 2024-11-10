const CACHE_NAME = "meu-app-cache-v1";
const urlsToCache = [
  "/pwa/",
  "/pwa/index.html",
  "/pwa/styles.css",
  "/pwa/app.js",
  "/pwa/icons/budget.png"
];

// Instala o Service Worker e adiciona recursos ao cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativa o Service Worker e remove caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Intercepta requisições de rede e responde com o cache, se disponível
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => {
            return new Response(
              "Conteúdo não disponível offline",
              { status: 408, statusText: "Recurso indisponível" }
            );
          })
      );
    })
  );
});
