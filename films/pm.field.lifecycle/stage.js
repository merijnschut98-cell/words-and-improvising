// The stage of the field film "Een project van begin tot eind / A project from
// start to finish": a pure function of (scene, u). Inlined into the page after the
// anatomy kit and a preamble from build.mjs that defines CAM, W, H and MAPZ (the
// centres of the five stations on the shared map). The story is drawn in hall B
// at the left, as in the pilot: the floor and outline of line 3, line 4 that
// stays, the power cabinet and its cable, the switchboard on the wall and a cast
// that changes per station (the sponsor, the outside installer, the buyer, the
// operators, the team lead). The panel at the right draws the road and each
// station as a schema, labelled "voorbeeld" (the line's move) or "schema" (the
// road). Every part a sentence lights is a static data-cue group (build.mjs); this
// script only fills the panel and shows or hides the room's moving parts.
// The closing scene (the shared Projects map with the five stations lit: the
// whole road, then the zoom from station to station, and back out) is ONE
// function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third
// argument where it is narrower than the panel (the kit checks that they fit).
// Station titles come from the page data (the index's module titles; the kit
// checks they fit a row of the road).
/* global CAM, W, H, MAPZ, span, beatStarts */
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

  // ---- the cast of hall B: who stands there when. [scene, first beat]: present from that beat to the scene's end
  const FROM = { sponsor: [[1, 0], [3, 2], [5, 1]], installer: [[2, 2]], buyer: [[3, 1]], crew: [[4, 1], [5, 2]], lead: [[4, 2], [5, 0]] };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }
  // the things that change: the cable is connected once the plan is done; line 3 stands in its outline and the
  // switchboard hangs on the wall from Land on (the move happens in the shutdown, while the project runs)
  function things(si) {
    const moved = si >= 4 ? 1 : 0;
    show(E.line3S, moved);
    show(E.swS, moved);
    show(E.swG, 1 - moved);
    const wired = si >= 3 ? 1 : 0;
    show(E.cabOn, wired);
    show(E.cabOff, 1 - wired);
  }

  // ---- the road. s1: five rows, each a numbered stop on a dashed road with the station's title.
  // s2 to s6: a strip of five numbered squares under the heading, the scene's own station filled.
  const rowY = (i) => 66 + i * 62;
  function roadRows(a4) {
    const rows = TITLES.map((t, i) => {
      const y = rowY(i);
      return op(a4[i], `<circle class="pm-dot" cx="352" cy="${y + 20}" r="16"/>` + txt(352, y + 28, String(i + 1), 22, 'middle', 'pm-on') + txt(380, y + 28, t, 22, 'start', 'pm-big'));
    });
    const line = `<path class="pm-road" d="M352 ${rowY(0) + 38}V${rowY(4) + 2}"/>`;
    return { rows, line: op(a4[0], line) };
  }
  function strip(cur) {
    return [0, 1, 2, 3, 4].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }
  // the dashed card at the foot of each station: what goes wrong without it
  function without(text, a) {
    const cross = '<path class="pm-cross" d="M346 346l16 16M362 346l-16 16"/>';
    return op(a, rect(334, 334, 284, 40, 'pm-out', 6) + cross + txt(374, 362, text, 22, 'start', 'pm-txt'));
  }

  // ---- s1: the goal (as the pilot's first card)
  function goalCard(a, stopOn) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Lijn 3 naar hal B', 'Line 3 to hall B', 272), 22, 'start', 'pm-big');
    s += txt(346, 122, tr('weer draaien na de stop', 'running after the stop', 272), 22, 'start', 'pm-txt');
    let cells = '';
    for (let i = 0; i < 12; i++) cells += rect(334 + i * 23.7, 162, 22, 26, i >= 9 ? (stopOn ? 'pm-crit' : 'pm-badge') : 'pm-tile', 3);
    s += cells + txt(618, 206, tr('zomerstop', 'summer shutdown'), 22, 'end', 'pm-mute');
    return op(a, s);
  }

  // ---- s2: intake. The request, the two questions behind it, the goal with its sponsor.
  function intake(b, p) {
    const ask = rect(334, 98, 284, 40, 'pm-card', 6) + txt(346, 125, tr('Vraag: verhuis lijn 3', 'Ask: move line 3', 270), 22, 'start', 'pm-txt')
      + arrow(400, 142, 400, 156) + arrow(552, 142, 552, 156)
      + rect(334, 158, 138, 38, 'pm-badge', 6) + txt(403, 184, tr('Waarom?', 'Why?', 126), 22, 'middle', 'pm-txt')
      + rect(480, 158, 138, 38, 'pm-badge', 6) + txt(549, 184, tr('Wanneer?', 'When?', 126), 22, 'middle', 'pm-txt');
    const goal = arrow(476, 200, 476, 216) + rect(334, 218, 284, 96, 'pm-crit', 8)
      + txt(346, 246, tr('Doel', 'Goal', 140), 22, 'start', 'pm-mute') + txt(606, 246, tr('sponsor', 'sponsor', 130), 22, 'end', 'pm-on')
      + txt(346, 276, tr('lijn 3 draait in hal B', 'line 3 runs in hall B', 260), 22, 'start', 'pm-big')
      + txt(346, 302, tr('na de zomerstop', 'after the shutdown', 260), 22, 'start', 'pm-txt');
    return {
      askB: op(b === 0 ? span(p, 0.05, 0.4) : 1, ask),
      goalB: op(b >= 1 ? (b === 1 ? span(p, 0, 0.4) : 1) : 0, goal),
      withoutB: without(tr('verkeerd probleem', 'the wrong problem', 240), b >= 2 ? span(p, 0, 0.4) : 0),
    };
  }

  // ---- s3: plan. The pilot's four topics as four tiles (the work, the time, the duration, the risk) and the
  // pointer to the Planning intro.
  function plan(b, p) {
    const T = [tr('Werk', 'Work', 128), tr('Tijd', 'Time', 128), tr('Duur', 'Duration', 128), tr('Risico', 'Risk', 128)];
    let s = '';
    T.forEach((l, i) => {
      const x = 334 + (i % 2) * 148;
      const y = 98 + Math.floor(i / 2) * 96;
      let one = rect(x, y, 136, 86, 'pm-card', 8) + txt(x + 8, y + 26, l, 22, 'start', 'pm-big');
      if (i === 0) one += `<path class="pm-link" d="M${x + 68} ${y + 44}V${y + 52}M${x + 22} ${y + 52}H${x + 114}M${x + 22} ${y + 52}V${y + 64}M${x + 68} ${y + 52}V${y + 64}M${x + 114} ${y + 52}V${y + 64}"/>` + rect(x + 50, y + 36, 36, 10, 'pm-crit', 2);
      if (i === 1) one += rect(x + 12, y + 42, 66, 9, 'pm-crit', 2) + rect(x + 40, y + 56, 76, 9, 'pm-crit', 2) + rect(x + 92, y + 70, 30, 9, 'pm-bar', 2);
      if (i === 2) one += rect(x + 12, y + 44, 60, 12, 'pm-range', 3) + rect(x + 12, y + 64, 88, 12, 'pm-buf', 3);
      if (i === 3) one += `<path class="pm-link" d="M${x + 12} ${y + 46}H${x + 118}M${x + 12} ${y + 60}H${x + 98}M${x + 12} ${y + 74}H${x + 110}"/>`;
      s += op(b === 0 ? span(p, 0.1 + i * 0.12, 0.4 + i * 0.12) : 1, one);
    });
    const more = rect(334, 290, 284, 36, 'pm-badge', 6) + txt(346, 315, tr('Intro van Plannen', 'Intro of Plan', 230), 22, 'start', 'pm-txt') + arrow(586, 308, 606, 308);
    return {
      plan4B: s,
      moreB: op(b >= 1 ? (b === 1 ? span(p, 0.3, 0.7) : 1) : 0, more),
      withoutB: without(tr('stroom te laat klaar', 'power ready too late', 240), b >= 2 ? span(p, 0, 0.4) : 0),
    };
  }

  // ---- s4: run. An honest status with three lights (amber from beat 2), a change request for line 4.
  function run(b, p) {
    const amber = b >= 1 ? (b === 1 ? span(p, 0.3, 0.6) : 1) : 0;
    const lamp = (x, cls, on) => `<circle class="${on ? cls : 'pm-rag'}" cx="${x}" cy="120" r="11"/>`;
    const status = rect(334, 98, 284, 76, 'pm-card', 8) + txt(346, 128, tr('Status', 'Status', 150), 22, 'start', 'pm-mute')
      + lamp(536, 'pm-rag-g', amber < 0.5) + lamp(566, 'pm-rag-a', amber >= 0.5) + lamp(596, 'pm-rag-r', false)
      + txt(346, 160, tr('Schakelkast komt later', 'Switchboard is late', 260), 22, 'start', 'pm-txt');
    const change = rect(334, 186, 284, 128, 'pm-card', 8) + txt(346, 216, tr('Lijn 4 ook meteen?', 'Line 4 as well?', 260), 22, 'start', 'pm-big')
      + txt(346, 248, tr('Wijzigingsverzoek', 'Change request', 260), 22, 'start', 'pm-txt')
      + txt(346, 274, tr('tijd en geld erbij', 'more time and money', 260), 22, 'start', 'pm-mute')
      + txt(346, 302, tr('de sponsor kiest', 'the sponsor chooses', 260), 22, 'start', 'pm-on');
    return {
      statusB: op(b === 0 ? span(p, 0.1, 0.45) : 1, status),
      changeB: op(b === 0 ? span(p, 0.3, 0.65) * 0.45 : b === 1 ? 0.45 : 1, change),
      withoutB: without(tr('te laat rood', 'red too late', 240), b >= 3 ? span(p, 0, 0.4) : 0),
    };
  }

  // ---- s5: land. The work instruction (one sheet: steps and a photo) and training; the handover to the line.
  function land(b, p) {
    let sheet = rect(334, 98, 112, 150, 'pm-card', 4) + rect(346, 110, 40, 32, 'pm-range', 3);
    for (let i = 0; i < 4; i++) sheet += `<path class="pm-link" d="M346 ${160 + i * 20}H${434 - (i % 2) * 22}"/>`;
    const instr = sheet + txt(460, 128, tr('Instructie', 'Instruction', 158), 22, 'start', 'pm-big')
      + txt(460, 162, tr('één A4', 'one page', 158), 22, 'start', 'pm-mute') + txt(460, 204, tr('Training', 'Training', 158), 22, 'start', 'pm-big')
      + txt(460, 236, tr('op de vloer', 'on the floor', 158), 22, 'start', 'pm-mute');
    const hand = rect(334, 264, 118, 44, 'pm-tile', 6) + txt(393, 293, tr('Project', 'Project', 106), 22, 'middle', 'pm-txt')
      + arrow(458, 286, 494, 286) + rect(500, 264, 118, 44, 'pm-crit', 6) + txt(559, 293, tr('Lijn', 'Line', 106), 22, 'middle', 'pm-on');
    return {
      instrB: op(b >= 1 ? (b === 1 ? span(p, 0, 0.4) : 1) : 0, instr),
      handB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.4) : 1) : 0, hand),
      withoutB: without(tr('terug naar oud', 'back to the old way', 240), b >= 3 ? span(p, 0, 0.4) : 0),
    };
  }

  // ---- s6: close. The baseline and the measurement after the shutdown, the sponsor's signature, a retrospective.
  function close(b, p) {
    const grow = b === 1 ? span(p, 0.1, 0.6) : 1;
    const proof = txt(334, 118, tr('Nulmeting, voor de stop', 'Baseline, before', 284), 22, 'start', 'pm-mute') + rect(334, 128, 230, 18, 'pm-bar', 3)
      + txt(334, 172, tr('Na de verhuizing', 'After the move', 284), 22, 'start', 'pm-mute') + rect(334, 182, 230 * grow, 18, 'pm-crit', 3);
    const sign = txt(334, 236, tr('De sponsor tekent', 'The sponsor signs', 204), 22, 'start', 'pm-txt')
      + `<path class="pm-link" d="M552 236c6-16 11-16 10 0s8-14 13-3 8 5 15-3M548 242H612"/>`;
    const retro = rect(334, 252, 284, 66, 'pm-card', 8) + txt(346, 279, tr('Terugblik', 'Retrospective', 260), 22, 'start', 'pm-big')
      + txt(346, 306, tr('herhalen of veranderen', 'repeat or change', 260), 22, 'start', 'pm-mute');
    return {
      proofB: op(b >= 1 ? (b === 1 ? span(p, 0, 0.3) : 1) : 0, proof),
      signB: op(b >= 1 ? (b === 1 ? span(p, 0.55, 0.85) : 1) : 0, sign),
      retroB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.4) : 1) : 0, retro),
      withoutB: without(tr('niemand weet het', 'nobody knows', 240), b >= 3 ? span(p, 0, 0.4) : 0),
    };
  }

  // ---- s7: the closing scene. ONE function. The shared Projects map (the kit's mapScene, the very drawing of the
  // app) with the five stations lit: first the whole map, then the whole road, then the zoom moves along the
  // road (at 1.5 a lit place's label is 22 units), and at the end back out to the whole map.
  // A view is { s, x, y }: the map scaled by s, its origin at (x, y) of the stage. At 1.5 the view is clamped
  // to the map's edges, so the zoom never shows the empty stage beside the map.
  const WHOLE = { s: 0.77, x: 73.6, y: 0 };
  const ROADV = { s: 1, x: 0, y: 200 - 171.5 };
  const zoom = (cx) => ({ s: 1.5, x: clamp(320 - cx * 1.5, 640 - 640 * 1.5, 0), y: 200 - MAPZ[0][1] * 1.5 });
  const mid = (i, j) => (MAPZ[i][0] + MAPZ[j][0]) / 2;
  const VIEWS = [ROADV, zoom(mid(0, 1)), zoom(mid(2, 3)), zoom(MAPZ[4][0]), WHOLE];
  function closing(b, p) {
    const from = b === 0 ? WHOLE : VIEWS[b - 1];
    const to = VIEWS[b];
    const z = b === 0 ? span(p, 0.45, 0.95) : span(p, 0, 0.45);
    const v = { s: lerp(from.s, to.s, z), x: lerp(from.x, to.x, z), y: lerp(from.y, to.y, z) };
    move(E.mapG, `translate(${f1(v.x)} ${f1(v.y)}) scale(${v.s.toFixed(4)})`);
  }

  const PANEL = ['askB', 'goalB', 'plan4B', 'moreB', 'statusB', 'changeB', 'instrB', 'handB', 'proofB', 'signB', 'retroB', 'withoutB', 'roadB'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    things(si);
    const o = Object.fromEntries(PANEL.map((k2) => [k2, '']));
    const rd = ['', '', '', '', ''];
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const isMap = si === 6;
    show(E.world, isMap ? 0 : 1);
    show(E.mapG, isMap ? 1 : 0);
    show(E.hud, isMap ? 0 : 1);
    if (si === 0) {
      if (b === 0) {
        title = tr('Lijn 3', 'Line 3');
        o.goalB = goalCard(span(p, 0.05, 0.4), p > 0.5);
      } else {
        title = tr('De weg', 'The road');
        lab = tr('schema', 'diagram');
        const r = roadRows([0, 1, 2, 3, 4].map((i) => (b > 1 ? 1 : span(p, 0.05 + i * 0.12, 0.3 + i * 0.12))));
        r.rows.forEach((x, i) => { rd[i] = x; });
        o.roadB = r.line;
      }
    } else if (si <= 5) {
      title = TITLES[si - 1];
      // the plan's four tiles are the module's map, not the line's move
      if (si === 2) lab = tr('schema', 'diagram');
      strip(si - 1).forEach((x, i) => { rd[i] = x; });
      Object.assign(o, [intake, plan, run, land, close][si - 1](b, p));
    } else closing(b, p);
    const head = isMap ? '' : txt(334, 38, title, 22, 'start', 'pm-big') + txt(618, 38, lab, 22, 'end', 'pm-mute');
    set(E.pHead, head);
    rd.forEach((x, i) => set(E[`rd${i}`], x));
    for (const k2 of PANEL) set(E[k2], o[k2]);
  }

  return { render };
})();
