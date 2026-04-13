/* eslint-disable */
const CACHE_NAME = "engwords-pwa-v10";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./EtoC.html",
  "./CtoE.html",
  "./sentence.html",
  "./accumulate.html",
  "./roots.html",
  "./nim.html",
  "./manifest.webmanifest",
  "./app-icon.svg",
  "./pwa.js",
  "./words_f.txt",
  "./styles/basic.css",
  "./styles/layout.css",
  "./styles/typography.css",
  "./styles/color.css",
  "./scripts/jquery-1.11.3.js",
  "./scripts/word_policy.js",
  "./scripts/status.js",
  "./scripts/sentence.js",
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

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin GET requests
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // Network-first: online users get latest HTML/JS; offline falls back to cache.
  // (Cache-first was causing desktop to keep old precached pages after deploy.)
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
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
      )
  );
});

