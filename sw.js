// App-shell cache. Bump CACHE when shipping changes so clients pick them up.
// The meta cache keeps its old name on purpose (it only holds reminder data).
// Classic (non-module) worker on purpose: switching an installed worker to a
// module does not upgrade reliably. Reminder texts are precomputed by the page.

const META = 'spraakwater-meta';
const CACHE = 'vantage-point-v181';
// Films (v14b): MP4s from the public Supabase bucket, put here by the page after
// a first full view (src/ui/film.js, cacheFilm). Never precached; kept across
// shell versions.
const FILMS = 'vantage-films';
importScripts('src/core/filmrange.js');
const SHELL = [
  './', 'index.html', 'styles.css', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png',
  'brand/tokens.css', 'brand/mark.svg', 'brand/mark-on-dark.svg',
  'fonts/Fraunces-Variable.woff2', 'fonts/Fraunces-Italic-Variable.woff2', 'fonts/Inter-Variable.woff2', 'fonts/Inter-Italic-Variable.woff2',
  'fonts/JetBrainsMono-Variable.woff2', 'fonts/JetBrainsMono-Italic-Variable.woff2',
  'src/app.js', 'src/i18n.js',
  'src/core/bests.js', 'src/core/boss.js', 'src/core/calibration.js', 'src/core/share.js', 'src/core/sound.js', 'src/core/spaced.js', 'src/core/followup.js', 'src/core/friend.js', 'src/core/realweek.js', 'src/core/pressure.js', 'src/core/shadow.js', 'src/core/words.js', 'src/core/mastery.js', 'src/core/today.js', 'src/core/layout.js', 'src/core/programme.js', 'src/core/coursereview.js', 'src/core/course.js', 'src/core/hint.js', 'src/core/coursecoach.js', 'src/core/pushback.js', 'src/core/sync.js', 'src/core/cloud.js', 'src/core/syncer.js', 'src/core/weekly.js', 'src/core/milestones.js', 'src/core/xp.js', 'src/core/flair.js', 'src/core/modulecheck.js', 'src/core/claude.js', 'src/core/compare.js', 'src/core/coach.js', 'src/core/partner.js', 'src/core/voice.js', 'src/core/filmrange.js', 'src/core/lesson.js', 'src/core/metrics.js', 'src/core/modifiers.js', 'src/core/progress.js', 'src/core/quests.js',
  'src/core/pauses.js', 'src/core/recorder.js', 'src/core/reminder.js', 'src/core/review.js', 'src/core/round.js', 'src/core/speech.js', 'src/core/storage.js', 'src/core/tailor.js', 'src/core/loudness.js', 'src/core/recordings.js',
  'src/content/prompts.en.js', 'src/content/prompts.nl.js', 'src/content/tips.js',
  'src/content/courses/index.js', 'src/content/courses/films/manifest.json', 'src/content/courses/films/eng.machining.turning.nl.vtt', 'src/content/courses/films/eng.machining.turning.en.vtt', 'src/content/courses/films/eng.machining.turning.jpg', 'src/content/courses/films/eng.joining.arc.nl.vtt', 'src/content/courses/films/eng.joining.arc.en.vtt', 'src/content/courses/films/eng.joining.arc.jpg', 'src/content/courses/films/eng.moulding.setting.nl.vtt', 'src/content/courses/films/eng.moulding.setting.en.vtt', 'src/content/courses/films/eng.moulding.setting.jpg', 'src/content/courses/films/eng.moulding.cycle.nl.vtt', 'src/content/courses/films/eng.moulding.cycle.en.vtt', 'src/content/courses/films/eng.moulding.cycle.jpg', 'src/content/courses/validate.js', 'src/content/courses/figures/eng.flow.line.html', 'src/content/courses/figures/eng.transformers.load.html', 'src/content/courses/figures/eng.switchgear.selectivity.html', 'src/content/courses/figures/eng.quality.capability.html', 'src/content/courses/figures/eng.machining.lathe.html', 'src/content/courses/figures/eng.gridbasics.levels.html', 'src/content/courses/figures/eng.maintenance.pf.html', 'src/content/courses/figures/eng.drawings.loop.html', 'src/content/courses/figures/eng.joining.bolt.html', 'src/content/courses/figures/eng.moulding.cycle.html', 'src/content/courses/figures/eng.improve.doe.html', 'src/content/courses/figures/eng.lines.auto.html', 'src/content/courses/figures/eng.reliability.weibull.html', 'src/content/courses/figures/eng.industry40.vision.html', 'src/content/courses/figures/eng.gridops.switching.html', 'src/content/courses/figures/eng.gridplanning.n1.html', 'src/content/courses/figures/eng.machining.mill.html', 'src/content/courses/figures/eng.joining.cell.html', 'src/content/courses/figures/eng.joining.haz.html', 'src/content/courses/figures/eng.machining.fiveaxis.html', 'src/content/courses/figures/eng.joining.rivet.html', 'src/content/courses/figures/eng.moulding.dryer.html', 'src/content/courses/figures/eng.machining.fixture.html', 'src/content/courses/figures/eng.machining.cmm.html', 'src/content/courses/figures/eng.lines.plc.html', 'src/content/courses/figures/eng.lines.case.html', 'src/content/courses/figures/eng.lines.mixed.html', 'src/content/courses/figures/eng.lines.buffer.html', 'src/content/courses/figures/eng.lines.pokayoke.html', 'src/content/courses/figures/eng.moulding.mould.html', 'src/content/courses/figures/eng.lines.robotcell.html', 'src/content/courses/figures/eng.moulding.window.html', 'src/content/courses/figures/eng.joining.ndt.html', 'src/content/courses/figures/eng.moulding.part.html', 'src/content/courses/figures/eng.joining.spot.html', 'src/content/courses/figures/eng.machining.insert.html', 'src/content/courses/figures/eng.moulding.screw.html', 'src/content/courses/figures/eng.joining.mig.html', 'src/content/courses/figures/eng.machining.gcode.html', 'src/content/courses/figures/eng.machining.drill.html', 'src/content/courses/films/eng.machining.turning.html', 'src/content/courses/films/eng.machining.drilling.html', 'src/content/courses/films/eng.machining.cnc.html', 'src/content/courses/films/eng.moulding.setting.html', 'src/content/courses/films/eng.machining.milling.html', 'src/content/courses/films/eng.joining.arc.html', 'src/content/courses/films/eng.machining.overview.html', 'src/content/courses/films/eng.moulding.cycle.html', 'src/content/courses/films/eng.machining.overview.nl.vtt', 'src/content/courses/films/eng.machining.overview.en.vtt', 'src/content/courses/films/eng.machining.overview.jpg', 'src/content/courses/films/eng.machining.milling.nl.vtt', 'src/content/courses/films/eng.machining.milling.en.vtt', 'src/content/courses/films/eng.machining.milling.jpg', 'src/content/courses/films/eng.machining.drilling.nl.vtt', 'src/content/courses/films/eng.machining.drilling.en.vtt', 'src/content/courses/films/eng.machining.drilling.jpg', 'src/content/courses/films/eng.machining.cnc.nl.vtt', 'src/content/courses/films/eng.machining.cnc.en.vtt', 'src/content/courses/films/eng.machining.cnc.jpg', 'src/content/courses/films/eng.machining.tooling.html', 'src/content/courses/films/eng.machining.tooling.nl.vtt', 'src/content/courses/films/eng.machining.tooling.en.vtt', 'src/content/courses/films/eng.machining.tooling.jpg', 'src/content/courses/films/eng.joining.spot.html', 'src/content/courses/films/eng.joining.spot.nl.vtt', 'src/content/courses/films/eng.joining.spot.en.vtt', 'src/content/courses/films/eng.joining.spot.jpg', 'src/content/courses/films/eng.joining.defects.html', 'src/content/courses/films/eng.joining.bolting.html', 'src/content/courses/films/eng.joining.bonding.html', 'src/content/courses/films/eng.moulding.machine.html', 'src/content/courses/films/eng.joining.production.html', 'src/content/courses/films/eng.moulding.materials.html', 'src/content/courses/films/eng.machining.workholding.html', 'src/content/courses/films/eng.moulding.defects.html', 'src/content/courses/films/eng.moulding.moulds.html', 'src/content/courses/films/eng.machining.measuring.html', 'src/content/courses/films/eng.lines.errorproof.html', 'src/content/courses/films/eng.lines.design.html', 'src/content/courses/films/eng.lines.robots.html', 'src/content/courses/films/eng.lines.variants.html', 'src/content/courses/films/eng.lines.control.html', 'src/content/courses/films/eng.quality.spc.html', 'src/content/courses/films/eng.safety.loto.html', 'src/content/courses/films/eng.maintenance.failure.html', 'src/content/courses/films/eng.power.motor.html', 'src/content/courses/films/eng.quality.tolerance.html', 'src/content/courses/films/eng.mechanics.tensile.html', 'src/content/courses/films/eng.maintenance.tpm.html', 'src/content/courses/films/eng.drawings.reading.html', 'src/content/courses/films/eng.joining.defects.nl.vtt', 'src/content/courses/films/eng.joining.defects.en.vtt', 'src/content/courses/films/eng.joining.defects.jpg', 'src/content/courses/films/eng.joining.bolting.nl.vtt', 'src/content/courses/films/eng.joining.bolting.en.vtt', 'src/content/courses/films/eng.joining.bolting.jpg', 'src/content/courses/films/eng.joining.bonding.nl.vtt', 'src/content/courses/films/eng.joining.bonding.en.vtt', 'src/content/courses/films/eng.joining.bonding.jpg', 'src/content/courses/films/eng.moulding.machine.nl.vtt', 'src/content/courses/films/eng.moulding.machine.en.vtt', 'src/content/courses/films/eng.moulding.machine.jpg', 'src/content/courses/films/eng.power.hydraulics.html', 'src/content/courses/films/eng.safety.permit.html', 'src/content/courses/films/eng.power.drives.html', 'src/content/courses/films/eng.mechanics.fatigue.html', 'src/content/courses/films/eng.mechanics.heattreat.html', 'src/content/courses/films/eng.gridbasics.load.html', 'src/content/courses/films/eng.lines.design.nl.vtt', 'src/content/courses/films/eng.lines.design.en.vtt', 'src/content/courses/films/eng.lines.design.jpg', 'src/content/courses/films/eng.lines.errorproof.nl.vtt', 'src/content/courses/films/eng.lines.errorproof.en.vtt', 'src/content/courses/films/eng.lines.errorproof.jpg', 'src/content/courses/films/eng.lines.robots.nl.vtt', 'src/content/courses/films/eng.lines.robots.en.vtt', 'src/content/courses/films/eng.lines.robots.jpg', 'src/content/courses/films/eng.lines.variants.nl.vtt', 'src/content/courses/films/eng.lines.variants.en.vtt', 'src/content/courses/films/eng.lines.variants.jpg', 'src/content/courses/films/eng.lines.control.nl.vtt', 'src/content/courses/films/eng.lines.control.en.vtt', 'src/content/courses/films/eng.lines.control.jpg', 'src/content/courses/films/eng.moulding.defects.nl.vtt', 'src/content/courses/films/eng.moulding.defects.en.vtt', 'src/content/courses/films/eng.moulding.defects.jpg', 'src/content/courses/films/eng.moulding.moulds.nl.vtt', 'src/content/courses/films/eng.moulding.moulds.en.vtt', 'src/content/courses/films/eng.moulding.moulds.jpg', 'src/content/courses/films/eng.machining.measuring.nl.vtt', 'src/content/courses/films/eng.machining.measuring.en.vtt', 'src/content/courses/films/eng.machining.measuring.jpg', 'src/content/courses/films/eng.switchgear.devices.html', 'src/content/courses/films/eng.process.plant.html', 'src/content/courses/films/eng.process.measure.html', 'src/content/courses/films/eng.ot.isa95.html', 'src/content/courses/films/eng.gridbasics.congestion.html', 'src/content/courses/films/eng.ot.orderflow.html', 'src/content/courses/films/eng.switchgear.automation.html', 'src/content/courses/films/eng.gridops.outage.html', 'src/content/courses/films/eng.quality.spc.nl.vtt', 'src/content/courses/films/eng.quality.spc.en.vtt', 'src/content/courses/films/eng.quality.spc.jpg', 'src/content/courses/films/eng.quality.tolerance.nl.vtt', 'src/content/courses/films/eng.quality.tolerance.en.vtt', 'src/content/courses/films/eng.quality.tolerance.jpg', 'src/content/courses/films/eng.safety.loto.nl.vtt', 'src/content/courses/films/eng.safety.loto.en.vtt', 'src/content/courses/films/eng.safety.loto.jpg', 'src/content/courses/films/eng.safety.permit.nl.vtt', 'src/content/courses/films/eng.safety.permit.en.vtt', 'src/content/courses/films/eng.safety.permit.jpg', 'src/content/courses/films/eng.maintenance.failure.nl.vtt', 'src/content/courses/films/eng.maintenance.failure.en.vtt', 'src/content/courses/films/eng.maintenance.failure.jpg', 'src/content/courses/films/eng.maintenance.tpm.nl.vtt', 'src/content/courses/films/eng.maintenance.tpm.en.vtt', 'src/content/courses/films/eng.maintenance.tpm.jpg', 'src/content/courses/films/eng.mechanics.tensile.nl.vtt', 'src/content/courses/films/eng.mechanics.tensile.en.vtt', 'src/content/courses/films/eng.mechanics.tensile.jpg', 'src/content/courses/films/eng.mechanics.fatigue.nl.vtt', 'src/content/courses/films/eng.mechanics.fatigue.en.vtt', 'src/content/courses/films/eng.mechanics.fatigue.jpg', 'src/content/courses/films/eng.power.motor.nl.vtt', 'src/content/courses/films/eng.power.motor.en.vtt', 'src/content/courses/films/eng.power.motor.jpg',
  'src/content/courses/eng/flow.en.js', 'src/content/courses/eng/flow.nl.js', 'src/content/courses/pm/intake.en.js', 'src/content/courses/pm/intake.nl.js',
  'src/content/courses/eng/industry40.en.js', 'src/content/courses/eng/industry40.nl.js',
  'src/content/courses/eng/itbasics.en.js', 'src/content/courses/eng/itbasics.nl.js',
  'src/content/courses/eng/ot.en.js', 'src/content/courses/eng/ot.nl.js',
  'src/content/courses/eng/cyber.en.js', 'src/content/courses/eng/cyber.nl.js',
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
  'src/content/courses/pm/outside.en.js', 'src/content/courses/pm/outside.nl.js', 'src/content/courses/pm/agile.en.js', 'src/content/courses/pm/agile.nl.js',
  'src/content/courses/pm/devops.en.js', 'src/content/courses/pm/devops.nl.js', 'src/content/courses/pm/scaled.en.js', 'src/content/courses/pm/scaled.nl.js',
  'src/content/courses/eng/joining.en.js', 'src/content/courses/eng/joining.nl.js',
  'src/content/courses/eng/switchgear.en.js', 'src/content/courses/eng/switchgear.nl.js', 'src/content/courses/pm/close.en.js', 'src/content/courses/pm/close.nl.js',
  'src/content/courses/eng/drawings.en.js', 'src/content/courses/eng/drawings.nl.js', 'src/content/courses/eng/gridbasics.en.js', 'src/content/courses/eng/gridbasics.nl.js', 'src/content/courses/eng/gridops.en.js', 'src/content/courses/eng/gridops.nl.js', 'src/content/courses/eng/lines.en.js', 'src/content/courses/eng/lines.nl.js', 'src/content/courses/eng/machining.en.js', 'src/content/courses/eng/machining.nl.js', 'src/content/courses/eng/maintenance.en.js', 'src/content/courses/eng/maintenance.nl.js', 'src/content/courses/eng/moulding.en.js', 'src/content/courses/eng/moulding.nl.js', 'src/content/courses/eng/quality.en.js', 'src/content/courses/eng/quality.nl.js', 'src/content/courses/eng/transformers.en.js', 'src/content/courses/eng/transformers.nl.js', 'src/content/courses/pm/land.en.js', 'src/content/courses/pm/land.nl.js', 'src/content/courses/pm/plan.en.js', 'src/content/courses/pm/plan.nl.js', 'src/content/courses/pm/run.en.js', 'src/content/courses/pm/run.nl.js',
  'src/ui/dom.js', 'src/ui/icons.js', 'src/ui/home.js', 'src/ui/round.js', 'src/ui/feedback.js', 'src/ui/done.js', 'src/ui/conversation.js',
  'src/ui/progress.js', 'src/ui/settings.js', 'src/ui/plan.js', 'src/ui/welcome.js', 'src/ui/realweek.js', 'src/ui/weekly.js', 'src/ui/friendrate.js',
  'src/ui/subjectbar.js', 'src/ui/coursehome.js', 'src/ui/quiz.js', 'src/ui/guide.js', 'src/ui/pathmap.js', 'src/ui/flairui.js', 'src/ui/modulecheck.js', 'src/ui/figure.js', 'src/ui/film.js', 'src/ui/sync.js', 'src/ui/lesson.js', 'src/ui/due.js', 'src/ui/situation.js', 'src/ui/glossary.js', 'src/ui/apply.js', 'src/ui/listenback.js',
];

self.addEventListener('install', (e) => {
  // cache: 'reload' bypasses the HTTP cache so a new version never stores old files.
  const requests = SHELL.map((u) => new Request(u, { cache: 'reload' }));
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(requests)).then(() => self.skipWaiting()));
});

// Deletes every other cache, including the old spraakwater-v* shells.
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== META && k !== FILMS).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Same-origin: cache first, refresh in the background. Everything else: network.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // A film: from the films cache when it is there, cut to the asked byte range
  // (a <video> always asks for ranges); else straight from the network.
  if (e.request.method === 'GET' && isFilmUrl(e.request.url)) {
    e.respondWith(caches.open(FILMS)
      .then((c) => c.match(e.request.url))
      .then((cached) => (cached ? rangeResponse(e.request, cached) : fetch(e.request)))
      .catch(() => fetch(e.request)));
    return;
  }
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
