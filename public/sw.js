/* Notematica service worker: caches core assets for offline loads. */
const CACHE_NAME = "notematica-v7";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/welcome.html",
  "/welcome.js",
  "/welcome-real-classroom.jpg",
  "/welcome-real-study-group.jpg",
  "/welcome-real-learning-hall.jpg",
  "/welcome-real-exam-prep.jpg",
  "/login.html",
  "/login.js",
  "/privacy.html",
  "/terms.html",
  "/share.html",
  "/offline.html",
  "/logo-mark-notematica.svg",
  "/logo-mark-notematica.svg.png",
  "/logo-notematica.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k)))))
      .then(() => self.clients.claim())
  );
});

function isNavigationRequest(request) {
  return request.mode === "navigate" || (request.headers.get("accept") || "").includes("text/html");
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Don't cache API calls.
  if (url.pathname.startsWith("/api/")) return;

  if (req.method !== "GET") return;

  if (isNavigationRequest(req)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(req);
          return cached || (await cache.match("/offline.html")) || Response.error();
        })
    );
    return;
  }

  const isHotAsset =
    url.pathname === "/styles.css" ||
    url.pathname === "/app.js" ||
    url.pathname === "/welcome.js" ||
    url.pathname === "/login.js" ||
    url.pathname === "/welcome.html" ||
    url.pathname === "/index.html" ||
    url.pathname === "/login.html";

  // Hot assets: network-first so deploys show up quickly, with cache fallback offline.
  if (isHotAsset) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(req);
          return cached || Response.error();
        })
    );
    return;
  }

  // Static assets: cache-first.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => cached || Response.error());
    })
  );
});
