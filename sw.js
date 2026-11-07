// App-shell cache. Bump CACHE when shipping changes so clients pick them up.
// The meta cache keeps its old name on purpose (it only holds reminder data).
// Classic (non-module) worker on purpose: switching an installed worker to a
// module does not upgrade reliably. Reminder texts are precomputed by the page.

const META = 'spraakwater-meta';
const CACHE = 'vantage-point-v71';
const SHELL = [
  './', 'index.html', 'styles.css', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png',
  'brand/tokens.css', 'brand/mark.svg', 'brand/mark-on-dark.svg',
  'fonts/Fraunces-Variable.woff2', 'fonts/Fraunces-Italic-Variable.woff2', 'fonts/Inter-Variable.woff2', 'fonts/Inter-Italic-Variable.woff2',
  'fonts/JetBrainsMono-Variable.woff2', 'fonts/JetBrainsMono-Italic-Variable.woff2',
  'src/app.js', 'src/i18n.js',
  'src/core/bests.js', 'src/core/boss.js', 'src/core/calibration.js', 'src/core/share.js', 'src/core/sound.js', 'src/core/spaced.js', 'src/core/followup.js', 'src/core/friend.js', 'src/core/realweek.js', 'src/core/pressure.js', 'src/core/shadow.js', 'src/core/words.js', 'src/core/mastery.js', 'src/core/today.js', 'src/core/programme.js', 'src/core/coursereview.js', 'src/core/course.js', 'src/core/coursecoach.js', 'src/core/pushback.js', 'src/core/sync.js', 'src/core/cloud.js', 'src/core/syncer.js', 'src/core/weekly.js', 'src/core/milestones.js', 'src/core/claude.js', 'src/core/compare.js', 'src/core/coach.js', 'src/core/partner.js', 'src/core/voice.js', 'src/core/lesson.js', 'src/core/metrics.js', 'src/core/modifiers.js', 'src/core/progress.js', 'src/core/quests.js',
  'src/core/pauses.js', 'src/core/recorder.js', 'src/core/reminder.js', 'src/core/review.js', 'src/core/round.js', 'src/core/speech.js', 'src/core/storage.js', 'src/core/tailor.js', 'src/core/loudness.js',
  'src/content/prompts.en.js', 'src/content/prompts.nl.js', 'src/content/tips.js',
  'src/content/courses/index.js', 'src/content/courses/validate.js', 'src/content/courses/figures/eng.flow.line.html', 'src/content/courses/figures/eng.transformers.load.html', 'src/content/courses/figures/eng.switchgear.selectivity.html', 'src/content/courses/figures/eng.quality.capability.html', 'src/content/courses/figures/eng.machining.lathe.html', 'src/content/courses/figures/eng.gridbasics.levels.html', 'src/content/courses/figures/eng.maintenance.pf.html', 'src/content/courses/figures/eng.drawings.loop.html', 'src/content/courses/figures/eng.joining.bolt.html', 'src/content/courses/figures/eng.moulding.cycle.html', 'src/content/courses/figures/eng.improve.doe.html', 'src/content/courses/figures/eng.lines.auto.html', 'src/content/courses/figures/eng.reliability.weibull.html', 'src/content/courses/figures/eng.industry40.vision.html', 'src/content/courses/figures/eng.gridops.switching.html', 'src/content/courses/figures/eng.gridplanning.n1.html', 'src/content/courses/figures/eng.machining.mill.html', 'src/content/courses/figures/eng.joining.cell.html', 'src/content/courses/figures/eng.joining.haz.html', 'src/content/courses/figures/eng.machining.fiveaxis.html', 'src/content/courses/figures/eng.joining.rivet.html', 'src/content/courses/figures/eng.moulding.dryer.html', 'src/content/courses/figures/eng.machining.fixture.html', 'src/content/courses/figures/eng.machining.cmm.html', 'src/content/courses/figures/eng.lines.plc.html', 'src/content/courses/figures/eng.lines.case.html', 'src/content/courses/figures/eng.lines.mixed.html', 'src/content/courses/figures/eng.lines.buffer.html', 'src/content/courses/figures/eng.lines.pokayoke.html', 'src/content/courses/figures/eng.moulding.mould.html', 'src/content/courses/figures/eng.lines.robotcell.html', 'src/content/courses/figures/eng.moulding.window.html', 'src/content/courses/figures/eng.joining.ndt.html', 'src/content/courses/figures/eng.moulding.part.html', 'src/content/courses/figures/eng.joining.spot.html', 'src/content/courses/figures/eng.machining.insert.html', 'src/content/courses/figures/eng.moulding.screw.html', 'src/content/courses/figures/eng.joining.mig.html', 'src/content/courses/figures/eng.machining.gcode.html', 'src/content/courses/figures/eng.machining.drill.html', 'src/content/courses/films/eng.machining.turning.html', 'src/content/courses/films/eng.machining.drilling.html',
  'src/content/courses/eng/flow.en.js', 'src/content/courses/eng/flow.nl.js', 'src/content/courses/pm/intake.en.js', 'src/content/courses/pm/intake.nl.js',
  'src/content/courses/eng/industry40.en.js', 'src/content/courses/eng/industry40.nl.js',
  'src/content/courses/pm/lead.en.js', 'src/content/courses/pm/lead.nl.js',
  'src/content/courses/pm/perform.en.js', 'src/content/courses/pm/perform.nl.js', 'src/content/courses/pm/negotiate.en.js', 'src/content/courses/pm/negotiate.nl.js', 'src/content/courses/eng/safety.en.js', 'src/content/courses/eng/safety.nl.js',
  'src/content/courses/eng/gridplanning.en.js', 'src/content/courses/eng/gridplanning.nl.js', 'src/content/courses/eng/reliability.en.js', 'src/content/courses/eng/reliability.nl.js', 'src/content/courses/pm/consult.en.js', 'src/content/courses/pm/consult.nl.js', 'src/content/courses/pm/portfolio.en.js', 'src/content/courses/pm/portfolio.nl.js',
  'src/content/courses/eng/improve.en.js', 'src/content/courses/eng/improve.nl.js',
  'src/content/courses/eng/process.en.js', 'src/content/courses/eng/process.nl.js',
  'src/content/courses/eng/power.en.js', 'src/content/courses/eng/power.nl.js',
  'src/content/courses/eng/mechanics.en.js', 'src/content/courses/eng/mechanics.nl.js',
  'src/content/courses/eng/cost.en.js', 'src/content/courses/eng/cost.nl.js',
  'src/content/courses/eng/spc.en.js', 'src/content/courses/eng/spc.nl.js',
  'src/content/courses/eng/fluids.en.js', 'src/content/courses/eng/fluids.nl.js',
  'src/content/courses/pm/stuck.en.js', 'src/content/courses/pm/stuck.nl.js',
  'src/content/courses/eng/joining.en.js', 'src/content/courses/eng/joining.nl.js',
  'src/content/courses/eng/switchgear.en.js', 'src/content/courses/eng/switchgear.nl.js', 'src/content/courses/pm/close.en.js', 'src/content/courses/pm/close.nl.js',
  'src/content/courses/eng/drawings.en.js', 'src/content/courses/eng/drawings.nl.js', 'src/content/courses/eng/gridbasics.en.js', 'src/content/courses/eng/gridbasics.nl.js', 'src/content/courses/eng/gridops.en.js', 'src/content/courses/eng/gridops.nl.js', 'src/content/courses/eng/lines.en.js', 'src/content/courses/eng/lines.nl.js', 'src/content/courses/eng/machining.en.js', 'src/content/courses/eng/machining.nl.js', 'src/content/courses/eng/maintenance.en.js', 'src/content/courses/eng/maintenance.nl.js', 'src/content/courses/eng/moulding.en.js', 'src/content/courses/eng/moulding.nl.js', 'src/content/courses/eng/quality.en.js', 'src/content/courses/eng/quality.nl.js', 'src/content/courses/eng/transformers.en.js', 'src/content/courses/eng/transformers.nl.js', 'src/content/courses/pm/land.en.js', 'src/content/courses/pm/land.nl.js', 'src/content/courses/pm/plan.en.js', 'src/content/courses/pm/plan.nl.js', 'src/content/courses/pm/run.en.js', 'src/content/courses/pm/run.nl.js',
  'src/ui/dom.js', 'src/ui/icons.js', 'src/ui/home.js', 'src/ui/round.js', 'src/ui/feedback.js', 'src/ui/done.js', 'src/ui/conversation.js',
  'src/ui/progress.js', 'src/ui/settings.js', 'src/ui/plan.js', 'src/ui/welcome.js', 'src/ui/realweek.js', 'src/ui/weekly.js', 'src/ui/friendrate.js',
  'src/ui/subjectbar.js', 'src/ui/coursehome.js', 'src/ui/quiz.js', 'src/ui/figure.js', 'src/ui/film.js', 'src/ui/sync.js', 'src/ui/lesson.js', 'src/ui/due.js', 'src/ui/situation.js', 'src/ui/glossary.js', 'src/ui/apply.js',
];

self.addEventListener('install', (e) => {
  // cache: 'reload' bypasses the HTTP cache so a new version never stores old files.
  const requests = SHELL.map((u) => new Request(u, { cache: 'reload' }));
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(requests)).then(() => self.skipWaiting()));
});

// Deletes every other cache, including the old spraakwater-v* shells.
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== META).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Same-origin: cache first, refresh in the background. Everything else: network.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // HEAD (does this figure page exist?): answer from the cache, so it works offline.
  if (e.request.method === 'HEAD') {
    e.respondWith(caches.match(e.request, { ignoreSearch: true, ignoreMethod: true })
      .then((cached) => (cached ? new Response(null, { status: cached.status, headers: cached.headers }) : fetch(e.request)))
      .catch(() => fetch(e.request)));
    return;
  }
  if (e.request.method !== 'GET') return;
  const refresh = fetch(e.request, { cache: 'no-cache' }).then(async (res) => {
    // Redirected responses can't be served for navigations; never cache them.
    // One entry per path: ?retry=N and ?theme=... variants share it (matching ignores the search).
    if (res.ok && !res.redirected) await (await caches.open(CACHE)).put(url.origin + url.pathname, res.clone());
    return res;
  });
  e.waitUntil(refresh.catch(() => {}));
  e.respondWith(caches.match(e.request, { ignoreSearch: true })
    .then((cached) => cached || refresh)
    .catch(() => refresh));
});

// Daily reminder (best effort): Chrome fires periodicsync roughly daily for
// installed apps. The page stores reminderMeta() in the META cache.
const pad = (n) => String(n).padStart(2, '0');
const localDay = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

self.addEventListener('periodicsync', (e) => {
  if (e.tag !== 'daily-practice') return;
  e.waitUntil((async () => {
    const res = await (await caches.open(META)).match('./__meta');
    if (!res) return;
    const meta = await res.json();
    const now = new Date();
    const today = localDay(now);
    if (!meta.remind || meta.lastDay === today) return;
    // Same rule as shouldFireReminder() in src/core/reminder.js.
    if (meta.hour != null) {
      const h = now.getHours() + now.getMinutes() / 60;
      const d = Math.abs(h - meta.hour);
      if (Math.min(d, 24 - d) > 3) return;
    }
    const yesterday = localDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
    const msg = meta.lastDay === yesterday && meta.atRisk ? meta.atRisk : meta.nudge;
    if (msg) await self.registration.showNotification(msg.title, { body: msg.body, icon: 'icons/icon-192.png', tag: 'daily-practice' });
  })());
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then((wins) => (wins[0] ? wins[0].focus() : self.clients.openWindow('./'))));
});
