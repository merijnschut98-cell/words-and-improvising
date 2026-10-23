// App-shell cache. Bump CACHE when shipping changes so clients pick them up.
const CACHE = 'spraakwater-v2';
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
  // cache: 'reload' bypasses the HTTP cache so a new version never stores old files.
  const requests = SHELL.map((u) => new Request(u, { cache: 'reload' }));
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(requests)).then(() => self.skipWaiting()));
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
  const refresh = fetch(e.request, { cache: 'no-cache' }).then(async (res) => {
    // Redirected responses can't be served for navigations; never cache them.
    if (res.ok && !res.redirected) await (await caches.open(CACHE)).put(e.request, res.clone());
    return res;
  });
  e.waitUntil(refresh.catch(() => {}));
  e.respondWith(caches.match(e.request, { ignoreSearch: true })
    .then((cached) => cached || refresh)
    .catch(() => refresh));
});
