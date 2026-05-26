// Ledger service worker — minimal app-shell cache.
//
// Strategy:
//  • Own-origin GET (the HTML bundles, manifest, icon): cache-first, fall back
//    to network. On a successful network fetch, refresh the cache so the next
//    visit gets the latest bundle.
//  • Cross-origin GET (esm.sh ESM modules, googleapis fonts, firebase SDK,
//    unpkg babel): network-only, no caching — these resources are large and
//    GitHub Pages already cdn-caches our HTML bundle.
//  • Non-GET requests: passthrough.
//
// Bump CACHE_VERSION when you ship a new bundle to force everyone's clients
// to evict the old shell.
const CACHE_VERSION = "ledger-shell-v1";
const SHELL_URLS = [
  "/ledger/",
  "/ledger/index.html",
  "/ledger/v1/",
  "/ledger/v1/index.html",
  "/ledger/manifest.webmanifest",
  "/ledger/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL_URLS).catch(() => {}))
  );
  // Take over from any older SW immediately on next page load.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Only handle our own origin — let CDNs handle their own caching.
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchAndUpdate = fetch(req).then((resp) => {
        // Refresh the cache in the background so next visit gets the latest.
        if (resp && resp.ok && resp.type === "basic") {
          const clone = resp.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone)).catch(() => {});
        }
        return resp;
      }).catch(() => cached);
      return cached || fetchAndUpdate;
    })
  );
});
