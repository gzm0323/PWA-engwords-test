/* eslint-disable */
const CACHE_NAME = "engwords-pwa-v29";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./EtoC.html",
  "./CtoE.html",
  "./sentence.html",
  "./needle.html",
  "./accumulate.html",
  "./roots.html",
  "./nim.html",
  "./manifest.webmanifest",
  "./app-icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./pwa.js",
  "./words_f.js",
  "./styles/basic.css",
  "./styles/layout.css",
  "./styles/typography.css",
  "./styles/color.css",
  "./scripts/jquery-1.11.3.js",
  "./scripts/analytics.js",
  "./scripts/word_policy.js",
  "./scripts/quiz_storage.js",
  "./scripts/home.js",
  "./scripts/status.js",
  "./scripts/sentence.js",
  "./scripts/hard_words.js",
  "./scripts/needle.js",
  "./scripts/word_roots.js",
  "./scripts/word_stories.js",
  "./scripts/nim.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

function isCacheable(res) {
  return res && res.status === 200 && res.type === "basic";
}

// Network-first: always try the network so a deploy is picked up immediately,
// fall back to cache (then index.html) when offline. Used for navigations/HTML.
function networkFirst(req) {
  return fetch(req)
    .then((res) => {
      if (isCacheable(res)) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
      }
      return res;
    })
    .catch(() =>
      caches.match(req).then((cached) => {
        if (cached) return cached;
        if (req.mode === "navigate") return caches.match("./index.html");
        return new Response("", { status: 503, statusText: "Offline" });
      })
    );
}

// Stale-while-revalidate: serve cache instantly (fast, offline-friendly) and
// refresh it in the background. Used for static assets (CSS/JS/data/icons).
function staleWhileRevalidate(req) {
  return caches.open(CACHE_NAME).then((cache) =>
    cache.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (isCacheable(res)) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin GET requests.
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // HTML/navigations must stay fresh; everything else can be served fast.
  const isHTML =
    req.mode === "navigate" ||
    (req.headers.get("accept") || "").includes("text/html");

  event.respondWith(isHTML ? networkFirst(req) : staleWhileRevalidate(req));
});
