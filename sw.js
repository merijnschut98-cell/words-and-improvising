// App-shell cache. Bump CACHE when shipping changes so clients pick them up.
const CACHE = 'spraakwater-v1';
const SHELL = [
  './', 'index.html', 'styles.css', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png',
  'src/app.js', 'src/i18n.js',
  'src/core/coach.js', 'src/core/lesson.js', 'src/core/metrics.js', 'src/core/progress.js',
  'src/core/recorder.js', 'src/core/round.js', 'src/core/speech.js', 'src/core/storage.js',
  'src/content/prompts.en.js', 'src/content/prompts.nl.js',
  'src/ui/dom.js', 'src/ui/home.js', 'src/ui/round.js', 'src/ui/feedback.js', 'src/ui/done.js',
  'src/ui/progress.js', 'src/ui/settings.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Same-origin: cache first, refresh in the background. Everything else: network.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async (cache) => {
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const network = fetch(e.request).then((res) => {
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    }).catch(() => cached);
    return cached || network;
  }));
});
