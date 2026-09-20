const CACHE_NAME = "bitsun-preview-v1";
const STATIC_ASSETS = [
  "/",
  "/Trade",
  "/Deposit",
  "/Withdraw",
  "/Coins",
  "/Markets",
  "/public/bit3un-exchange-pro.html",
  "/public/manifest.webmanifest",
  "/public/assets/bitsun-logo.jpg",
  "/public/assets/tokens/btc.svg",
  "/public/assets/tokens/eth.svg",
  "/public/assets/tokens/usdt.svg",
  "/public/assets/tokens/bnb.svg",
  "/public/assets/tokens/sol.svg",
  "/public/assets/tokens/xrp.svg",
  "/public/assets/banks/banks.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/debug-api/") || url.pathname.startsWith("/api/")) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/")))
  );
});
