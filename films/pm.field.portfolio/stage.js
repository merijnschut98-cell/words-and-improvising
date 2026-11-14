// The stage of the field film "Portfolio en advies / Portfolio and consulting": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H and MAPZ (the
// centres of the two stations on the shared map). The story is drawn in hall B at the left, as in the pilot and in
// field films 1 and 2: line 3 stands on its floor now (the project is done), the switchboard hangs, the cable is
// connected, and a cast that changes per scene: the team lead and the operators at line 3, the plant manager who
// pays for the advice. The panel at the right draws each station as a small schema ("what is it for", twice),
// then its two tools as two chips, then a dashed card with what goes wrong without it.
// Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows
// or hides the room's moving parts. The closing scene (the shared Projects map with the two stations lit, the
// zoom place by place) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than
// the panel (the kit checks that they fit). Station titles come from the page data (the index's module titles):
// the road wraps them with the kit's own wrapUnits (ROW, CW), the panel heading with the panel's width (HEAD).
/* global CAM, W, H, MAPZ, ROW, HEAD, CW, wrapUnits, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const NL = document.documentElement.getAttribute('lang') !== 'en';
  const tr = (nl, en) => (NL ? nl : en);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const set = (e, html) => { if (e && e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, t) => { if (e && e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const show = (e, a) => {
    if (!e) return;
    const v = a <= 0.01 ? 0 : a >= 0.999 ? 1 : Math.round(a * 100) / 100;
    if (e.__a === v) return;
    e.__a = v;
    e.style.display = v === 0 ? 'none' : '';
    e.style.opacity = v === 1 ? '' : String(v);
  };
  const txt = (x, y, t, size = 22, anchor = 'start', cls = 'pm-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const arrow = (x0, y0, x1, y1) => {
    const up = y1 < y0 ? -1 : 1;
    const horiz = Math.abs(y1 - y0) < 1;
    const head = horiz ? `M${f1(x1 - 6)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * up)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * up)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  const TITLES = D.stations.map((s) => tr(s.title.nl, s.title.en));

  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1) };
  }
  // the camera: CAM[si] = { from: [ox, oy, s], to: [ox, oy, s] }, the point (ox, oy) of the hall brought to the
  // middle of the hall's half of the stage (160, 200), at scale s
  function camera(si, u) {
    const c = CAM[si];
    const kk = span(u, 0, 1);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(160 - s * lerp(c.from[0], c.to[0], kk))} ${f1(200 - s * lerp(c.from[1], c.to[1], kk))}) scale(${s.toFixed(4)})`);
  }

  // ---- the cast of hall B: who stands there when. [scene, first beat]: present from that beat to the scene's end.
  const FROM = {
    sponsor: [[0, 1], [1, 0], [2, 0]],
    lead: [[0, 0], [1, 0]],
    crew: [[0, 0]],
  };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }

  // ---- the road. s1 beat 3: one row per station, each a numbered stop on a dashed road with the station's title
  // (wrapped into at most two lines of ROW units). s2 and s3: a strip of numbered squares under the heading.
  const N = TITLES.length;
  const rowY = (i) => 100 + i * 116;
  function roadRows(a4) {
    const rows = TITLES.map((t, i) => {
      const y = rowY(i);
      const lines = wrapUnits(t, ROW, CW);
      const label = lines.map((ln, j) => txt(380, y + (lines.length > 1 ? 16 + j * 26 : 28), ln, 22, 'start', 'pm-big')).join('');
      return op(a4[i], `<circle class="pm-dot" cx="352" cy="${y + 20}" r="16"/>` + txt(352, y + 28, String(i + 1), 22, 'middle', 'pm-on') + label);
    });
    const line = `<path class="pm-road" d="M352 ${rowY(0) + 38}V${rowY(N - 1) + 2}"/>`;
    return { rows, line: op(a4[0], line) };
  }
  // the strip: two small numbered squares under the heading, the scene's own station filled
  function strip(cur) {
    return TITLES.map((t, i) => rect(334 + i * 30, 72, 26, 26, i === cur ? 'pm-crit' : 'pm-tile', 5) + txt(334 + i * 30 + 13, 92, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }
  // the dashed card at the foot of each station: what goes wrong without it
  function without(text, a) {
    const cross = '<path class="pm-cross" d="M346 346l16 16M362 346l-16 16"/>';
    return op(a, rect(334, 334, 284, 40, 'pm-out', 6) + cross + txt(374, 362, text, 22, 'start', 'pm-txt'));
  }
  // the two tools of a station as two chips (names only, nothing explained)
  function chip(y, label, a) {
    return op(a, rect(334, y, 284, 38, 'pm-badge', 6) + `<circle class="pm-dot" cx="354" cy="${y + 19}" r="6"/>` + txt(370, y + 28, label, 22, 'start', 'pm-txt'));
  }
  // a small person glyph (head and shoulders), for you and the plant manager
  const glyph = (cx, cy, cls) => `<circle class="${cls}" cx="${cx}" cy="${cy - 10}" r="9"/><path class="${cls}" d="M${cx - 15} ${cy + 22}v-6a15 12 0 0 1 30 0v6z"/>`;
  // a row of a schema: a tile with its label
  const row = (y, label, cls = 'pm-tile', tcls = 'pm-txt', h = 30) => rect(334, y, 284, h, cls, 6) + txt(346, y + h - 8, label, 22, 'start', tcls);

  // ---- s1: the opening. Beat 1 the four projects of this year (line 3 is done), beat 2 you and the plant manager,
  // beat 3 the road with two stations.
  function projects(a) {
    return op(a, row(56, tr('Lijn 3 verhuisd', 'Line 3 moved', 262), 'pm-crit', 'pm-on', 34)
      + row(98, tr('Gereedheidscheck', 'Readiness check', 262), 'pm-card', 'pm-txt', 34)
      + row(140, tr('Planningstool', 'Planning tool', 262), 'pm-card', 'pm-txt', 34)
      + row(182, tr('Materiaalproces', 'Materials process', 262), 'pm-card', 'pm-txt', 34));
  }
  function pair(a) {
    return op(a, rect(334, 60, 284, 56, 'pm-crit', 8) + glyph(364, 88, 'pm-on') + txt(394, 96, tr('Jij: adviseert', 'You: advise', 216), 22, 'start', 'pm-on')
      + arrow(476, 120, 476, 144)
      + rect(334, 150, 284, 56, 'pm-card', 8) + glyph(364, 178, 'pm-tile') + txt(394, 186, tr('Plantmanager', 'Plant manager', 216), 22, 'start', 'pm-txt'));
  }

  // ---- the schemas of the two stations (y 108 to 214), two each: what the station is for
  const FOR = [
    [ // s2 Programmes and governance: the ranked projects with the capacity line, then who decides what (three levels)
      () => row(108, tr('Gereedheidscheck', 'Readiness check', 262), 'pm-card') + row(142, tr('Planningstool', 'Planning tool', 262), 'pm-card')
        + rect(334, 175, 284, 5, 'pm-crit', 2) + row(184, tr('Materiaalproces', 'Materials process', 262), 'pm-out', 'pm-mute', 28),
      () => row(108, tr('Directie', 'Board', 262), 'pm-card') + arrow(476, 146, 476, 140) + row(146, tr('Stuurgroep', 'Steering group', 262), 'pm-card')
        + arrow(476, 184, 476, 178) + row(184, tr('Projectleider', 'Project lead', 262), 'pm-crit', 'pm-on'),
    ],
    [ // s3 The consulting craft: the proposal that starts with the client's problem, then trust, independence and growth
      () => row(108, tr('Probleem', 'Problem', 262), 'pm-crit', 'pm-on') + row(146, tr('Uitkomst', 'Outcome', 262), 'pm-card') + row(184, tr('Aanpak', 'Approach', 262), 'pm-card'),
      () => row(108, tr('Vertrouwen', 'Trust', 262), 'pm-card') + row(146, tr('Onafhankelijk', 'Independence', 262), 'pm-card') + row(184, tr('Groei', 'Growth', 262), 'pm-card'),
    ],
  ];
  const TOOLS = [
    [tr('Capaciteitsstreep', 'Capacity line', 256), tr('Besluitenlijst', 'Decision log', 256)],
    [tr('Diagnosefase', 'Diagnostic phase', 256), tr('Vertrouwensformule', 'Trust equation', 256)],
  ];
  const WITHOUT = [
    tr('alles tegelijk', 'everything at once', 240),
    tr('advies over jezelf', 'advice about yourself', 240),
  ];
  function station(si, b, p) {
    const k = si - 1;
    // beat 3 names the two tools: the schema of the first tool (the ranked list with its capacity line, the proposal)
    // dissolves in at the start and gives way to the schema of the second (who decides what, trust, independence and
    // growth) halfway, as the voice names the second tool
    const a1 = span(p, 0.05, 0.2);
    const a2 = span(p, 0.5, 0.65);
    const w = b === 0 ? [1, 0] : b === 2 ? [a1 - a2, 1 - a1 + a2] : [0, 1];
    const fade = b <= 1 ? span(p, 0.1, 0.45) : 1;
    return {
      forB: op(fade, op(w[0], FOR[k][0]()) + op(w[1], FOR[k][1]())),
      t1B: chip(224, TOOLS[k][0], b >= 2 ? (b === 2 ? span(p, 0, 0.3) : 1) : 0),
      t2B: chip(270, TOOLS[k][1], b >= 2 ? (b === 2 ? span(p, 0.2, 0.5) : 1) : 0),
      withoutB: without(WITHOUT[k], b >= 3 ? span(p, 0, 0.4) : 0),
    };
  }

  // ---- s4: the closing scene. ONE function. The shared Projects map (the kit's mapScene, the very drawing of the
  // app) with the two stations lit: first the two places together, then the zoom moves place by place (at 1.5 a
  // lit place's label is 22 units), and at the end back out to the whole map.
  // A view is { s, x, y }: the map scaled by s, its origin at (x, y) of the stage. At 1.5 the view is clamped
  // to the map's edges, so the zoom never shows the empty stage beside the map.
  const WHOLE = { s: 0.77, x: 73.6, y: 0 };
  const PAIR = { s: 1, x: 0, y: 200 - MAPZ[0][1] };
  const zoom = (cx) => ({ s: 1.5, x: clamp(320 - cx * 1.5, 640 - 640 * 1.5, 0), y: 200 - MAPZ[0][1] * 1.5 });
  const VIEWS = [PAIR, ...MAPZ.map((m) => zoom(m[0])), WHOLE];
  function closing(b, p) {
    const from = b === 0 ? WHOLE : VIEWS[b - 1];
    const to = VIEWS[b];
    const z = b === 0 ? span(p, 0.45, 0.95) : span(p, 0, 0.45);
    const v = { s: lerp(from.s, to.s, z), x: lerp(from.x, to.x, z), y: lerp(from.y, to.y, z) };
    move(E.mapG, `translate(${f1(v.x)} ${f1(v.y)}) scale(${v.s.toFixed(4)})`);
  }

  const PANEL = ['goalB', 'peopleB', 'forB', 't1B', 't2B', 'withoutB', 'roadB'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    const o = Object.fromEntries(PANEL.map((k2) => [k2, '']));
    const rd = TITLES.map(() => '');
    let head = '';
    const isMap = si === 3;
    show(E.world, isMap ? 0 : 1);
    show(E.mapG, isMap ? 1 : 0);
    show(E.hud, isMap ? 0 : 1);
    if (si === 0) {
      const t = [tr('Dit jaar', 'This year'), tr('Wie adviseert wie', 'Who advises whom'), tr('De weg', 'The road')][b];
      head = txt(334, 38, t, 22, 'start', 'pm-big') + txt(618, 38, b === 0 ? tr('voorbeeld', 'example') : tr('schema', 'diagram'), 22, 'end', 'pm-mute');
      if (b === 0) o.goalB = projects(span(p, 0.05, 0.4));
      else if (b === 1) o.peopleB = pair(span(p, 0.05, 0.4));
      else {
        const r = roadRows(TITLES.map((tt, i) => span(p, 0.05 + i * 0.2, 0.35 + i * 0.2)));
        r.rows.forEach((x, i) => { rd[i] = x; });
        o.roadB = r.line;
      }
    } else if (si <= 2) {
      const lines = wrapUnits(TITLES[si - 1], HEAD, CW);
      head = lines.map((ln, j) => txt(334, 34 + j * 26, ln, 22, 'start', 'pm-big')).join('') + txt(618, 92, tr('voorbeeld', 'example'), 22, 'end', 'pm-mute');
      strip(si - 1).forEach((x, i) => { rd[i] = x; });
      Object.assign(o, station(si, b, p));
    } else closing(b, p);
    set(E.pHead, isMap ? '' : head);
    rd.forEach((x, i) => set(E[`rd${i}`], x));
    for (const k2 of PANEL) set(E[k2], o[k2]);
  }

  return { render };
})();
