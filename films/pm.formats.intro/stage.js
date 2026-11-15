// The stage of the module intro film "Het plan ligt er: nu de mensen / The plan is ready: now the people" (Werkvormen en
// overleggen): a pure function of (scene, u). Inlined into the page after the anatomy kit and a preamble from build.mjs that
// defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps
// as the kit's label check measures). The story is drawn in hall B at the left, as in the field film and the other Projects
// intros: the new floor with the dashed outline of line 3, line 4 that stays, the power cabinet, the dashed place of the
// switchboard and the calendar of the shutdown. This module is the station between the plan and the run: the people of the
// project come together. The back wall carries a brown paper in s3 and a shared board in s4, the desk carries the pre-read
// (s2) and the interview guide (s5); the cast of the field film (jij, the sponsor, the team lead, the planner) stands in the
// room. The panel at the right draws each step as a schema, labelled "voorbeeld" (the line's move) or "schema" (the
// module's map). Every part a sentence lights is a static data-cue group (build.mjs); this script fills the panel and shows
// or hides the room's moving parts. Nothing is drawn with a label before the narration names it. The closing scene (the
// shared Projects map, then the module's four topics with their levels) is ONE function, closing; the map itself is the
// kit's mapScene. Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower
// than the panel (the kit checks that they fit).
/* global CAM, W, H, LV, MAPZ, GRID, CW, wrapUnits, span, beatStarts */
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
  // a moving part of the room or the map: shown with an opacity, hidden when it is 0
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
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const TOP = D.topics.map((t) => tr(t.title.nl, t.title.en));
  const ORDER = ['meetings', 'workshop', 'ideas', 'floor'];
  const TITLE = ORDER.map((id) => TOP[D.topics.findIndex((t) => t.id === id)]);
  const LW = NL ? LV.nl : LV.en;

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
    const ox = lerp(c.from[0], c.to[0], kk);
    const oy = lerp(c.from[1], c.to[1], kk);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(160 - s * ox)} ${f1(200 - s * oy)}) scale(${s.toFixed(4)})`);
  }

  // ---- what is written on the back wall, in the plane of the wall (u = x, v = -z). A note is a path from its left
  // edge and top (x, z), w wide and h high.
  const nd = (x, z, w, h) => `M${f1(x)} ${f1(-z)}h${f1(w)}v${f1(h)}h${f1(-w)}Z`;
  const note = (x, z, w, h, a = 1) => op(a, `<path class="pm-note" d="${nd(x, z, w, h)}"/><path class="pm-ink" d="${nd(x + 3, z - 4.5, w - 9, 1.5)}"/>`);
  // the brown paper (s3): three lanes of notes from left to right, each lane starting where the one above handed over
  const LANE_TOP = [197, 168, 139];
  const PAPER_NOTES = [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2], [4, 2], [5, 2]];
  function paperNotes(si, b, p) {
    if (si !== 2 || b < 3) return '';
    let out = `<path class="pm-rule" d="M64 -169.2H202M64 -140.2H202"/>`;
    PAPER_NOTES.forEach(([c, l], i) => {
      const a = b > 3 ? 1 : span(p, i * 0.09, i * 0.09 + 0.25);
      out += note(64 + c * 23, LANE_TOP[l] - 3, 21, 17, a);
    });
    return out;
  }
  // the shared board (s4): twelve notes written alone, then moved into three groups, then three dots on the best
  const SCATTER = [[72, 193], [100, 187], [132, 194], [160, 188], [78, 168], [110, 172], [146, 170], [166, 162], [70, 144], [96, 148], [128, 143], [152, 146]];
  const GROUP_X = [74, 114, 154];
  const clusterAt = (i) => { const g = i % 3; const s = Math.floor(i / 3); return [GROUP_X[g] + (s % 2) * 26, 192 - Math.floor(s / 2) * 19]; };
  function boardNotes(si, b, p) {
    if (si !== 3 || b < 2) return '';
    const t = b < 3 ? 0 : b === 3 ? span(p, 0.1, 0.85) : 1;
    let out = '';
    GROUP_X.forEach((gx) => { out += op(t, `<path class="pm-grp" d="${nd(gx - 4, 195.5, 58, 41)}"/>`); });
    SCATTER.forEach(([sx, sz], i) => {
      const a = b > 2 ? 1 : span(p, i * 0.06, i * 0.06 + 0.2);
      const [cx, cz] = clusterAt(i);
      out += note(lerp(sx, cx, t), lerp(sz, cz, t), 24, 16, a);
    });
    if (b >= 4) {
      const a = b === 4 ? span(p, 0.1, 0.6) : 1;
      let dots = '';
      [0, 1, 2, 3, 4, 5].forEach((i) => { const [cx, cz] = clusterAt(i); dots += `<circle class="pm-dot" cx="${f1(cx + 21)}" cy="${f1(-cz + 2.5)}" r="2.6"/>`; });
      out += op(a, dots);
    }
    return out;
  }

  // ---- the cast of hall B: who stands there when. [scene, first beat]: present from that beat to the scene's end.
  // A person who stood there at the end of the scene before is there from the first frame (no blink at a cut).
  const ALL = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]];
  const FROM = { jij: ALL, sponsor: ALL, lead: ALL, planner: [[1, 0], [2, 0], [3, 0], [4, 0]] };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      const carried = FROM[who].some(([sc]) => sc === si - 1);
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from && !carried ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
    // the pre-read lies on the desk from the sentence that names it (s2, fifth beat) on; the interview guide from s5's fourth
    show(E['pp-preread'], si === 1 ? (b >= 4 ? (b === 4 ? span(p, 0, 0.45) : 1) : 0) : si > 1 ? 1 : 0);
    show(E['pp-guide'], si === 4 ? (b >= 3 ? (b === 3 ? span(p, 0, 0.45) : 1) : 0) : 0);
    show(E['pp-paper'], si === 2 ? 1 : 0);
    show(E['pp-screen'], si === 3 ? 1 : 0);
    set(E.pnotes, paperNotes(si, b, p));
    set(E.snotes, boardNotes(si, b, p));
  }

  // ---- the four topic tiles
  // the route (s1): four rows, each with its title and number. The rows are 284 units wide, so a long title wraps by the
  // film's own tile width, D.tileUnits, into at most three lines
  const routeY = (i) => 52 + i * 82;
  function routeTiles(show4) {
    return TITLE.map((t, i) => {
      const a = show4[i];
      if (a <= 0.01) return '';
      const y = routeY(i);
      const lines = wrap(t, D.tileUnits).slice(0, 3);
      let s = rect(334, y, 284, 76, 'pm-tile', 8) + txt(610, y + 30, String(i + 1), 22, 'end', 'pm-on');
      lines.forEach((l, j) => { s += txt(344, y + 46 + (j - (lines.length - 1) / 2) * 24, l, 22, 'start', 'pm-txt'); });
      return op(a, s);
    });
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }

  // ---- the tool chip of a topic scene: one short sentence names it, it is not explained. Shown in the beat of the
  // sentence (b === at) and after it
  function tool(b, p, at, y, label) {
    return { tool1B: b >= at ? op(b === at ? span(p, 0, 0.4) : 1, rect(334, y, 284, 36, 'pm-badge', 6) + txt(346, y + 26, label, 22, 'start', 'pm-txt')) : '' };
  }
  const chip = (x, y, w, label, cls = 'pm-tile') => rect(x, y, w, 34, cls, 6) + txt(x + 12, y + 25, label, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');
  const ask = (a, l1, l2) => op(a, rect(334, 98, 284, l2 ? 76 : 50, 'pm-card', 8) + txt(346, l2 ? 130 : 130, l1, 22, 'start', 'pm-big') + (l2 ? txt(346, 158, l2, 22, 'start', 'pm-big') : ''));

  // ---- s1: the plan is ready, where this module sits, the four topics
  function planCard(a, stopOn) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Het plan voor lijn 3', 'The plan for line 3', 272), 22, 'start', 'pm-mute');
    s += txt(346, 126, tr('Het ligt er', 'It is ready', 272), 22, 'start', 'pm-big');
    let cells = '';
    for (let i = 0; i < 12; i++) cells += rect(334 + i * 23.7, 162, 22, 26, i >= 9 ? (stopOn ? 'pm-crit' : 'pm-badge') : 'pm-tile', 3);
    s += cells + txt(618, 206, tr('zomerstop', 'summer shutdown'), 22, 'end', 'pm-mute');
    return op(a, s);
  }
  // the module between the plan and the run: three boxes and two arrows
  function pathBox(a) {
    let s = rect(334, 232, 284, 34, 'pm-tile', 6) + txt(342, 257, tr('Plannen', 'Plan', 270), 22, 'start', 'pm-txt');
    s += arrow(476, 268, 476, 282);
    s += rect(334, 284, 284, 34, 'pm-crit', 6) + txt(342, 309, tr('Overleggen en sessies', 'Meetings and sessions', 270), 22, 'start', 'pm-on');
    s += arrow(476, 320, 476, 334);
    s += rect(334, 336, 284, 34, 'pm-card', 6) + txt(346, 361, tr('Uitvoeren', 'Run', 262), 22, 'start', 'pm-txt');
    return op(a, s);
  }

  // ---- s2: which meeting when. Every format has a purpose, participants, a duration and an output; a meeting shares or
  // decides, a workshop makes something together; the kick-off; the pre-read goes out beforehand.
  function meetParts(b, p) {
    const rows = [tr('doel', 'purpose', 262), tr('deelnemers', 'participants', 262), tr('duur', 'duration', 262), tr('opbrengst', 'output', 262)];
    let format = '';
    rows.forEach((r, i) => { format += op(b === 1 ? span(p, i * 0.14, i * 0.14 + 0.3) : 1, chip(334, 98 + i * 38, 284, r)); });
    const two = rect(334, 98, 284, 60, 'pm-tile', 8) + txt(346, 126, tr('Overleg', 'Meeting', 262), 22, 'start', 'pm-big') + txt(346, 150, tr('delen of besluiten', 'share or decide', 262), 22, 'start', 'pm-mute')
      + rect(334, 164, 284, 60, 'pm-tile', 8) + txt(346, 192, tr('Werksessie', 'Workshop', 262), 22, 'start', 'pm-big') + txt(346, 216, tr('samen iets maken', 'make it together', 262), 22, 'start', 'pm-mute');
    const kick = rect(334, 236, 284, 88, 'pm-card', 8) + txt(346, 262, tr('Kick-off', 'Kick-off', 262), 22, 'start', 'pm-big')
      + [tr('doel', 'goal', 78), tr('rollen', 'roles', 78), tr('acties', 'actions', 84)].map((l, i) => rect(340 + i * 92, 274, 86, 40, 'pm-badge', 6) + txt(383 + i * 92, 301, l, 22, 'middle', 'pm-txt')).join('');
    return {
      askB: b === 0 ? ask(span(p, 0.1, 0.5), tr('Welk overleg wanneer?', 'Which meeting when?', 262)) : '',
      formatB: b === 1 ? format : '',
      mvwB: b >= 2 ? op(b === 2 ? span(p, 0, 0.4) : 1, two) : '',
      kickB: b >= 3 ? op(b === 3 ? span(p, 0, 0.4) : 1, kick) : '',
      ...tool(b, p, 4, 336, tr('Voorleesstuk', 'Pre-read', 262)),
    };
  }

  // ---- s3: designing and leading a workshop. One purpose and a visible output; the facilitator leads the process; the
  // group draws the process of line 3 on a brown paper, first how it really goes.
  function workParts(b, p) {
    const doel = rect(334, 98, 284, 40, 'pm-tile', 6) + txt(346, 126, tr('Doel', 'Purpose', 262), 22, 'start', 'pm-txt') + arrow(476, 140, 476, 162)
      + rect(334, 166, 284, 62, 'pm-crit', 8) + txt(346, 194, tr('Uitkomst', 'Output', 262), 22, 'start', 'pm-on') + txt(346, 218, tr('te fotograferen', 'to photograph', 262), 22, 'start', 'pm-on');
    const lanes = [0, 1, 2].map((l) => rect(334, 98 + l * 44, 284, 40, 'pm-tile', 6)
      + PAPER_NOTES.filter(([, ln]) => ln === l).map(([c]) => rect(340 + c * 45, 104 + l * 44, 38, 28, 'pm-badge', 4)).join('')).join('');
    return {
      askB: b === 0 ? ask(span(p, 0.1, 0.5), tr('Samen één uitkomst', 'One group, one output', 262)) : '',
      goalB: b === 1 || b === 2 ? op(b === 1 ? span(p, 0.05, 0.55) : 1, doel) : '',
      facilB: b === 2 ? op(span(p, 0, 0.4), chip(334, 244, 284, tr('Facilitator: proces', 'Facilitator: process', 262), 'pm-crit')) : '',
      lanesB: b >= 3 ? op(b === 3 ? span(p, 0.1, 0.6) : 1, lanes) : '',
      asisB: b >= 4 ? op(span(p, 0, 0.4), chip(334, 244, 284, tr('Hoe het nu echt gaat', 'How it really goes', 262), 'pm-crit')) : '',
      ...tool(b, p, 3, 336, tr('Brown paper', 'Brown paper', 262)),
    };
  }

  // ---- s4: ideas and decisions in a group. Many ideas first, then choose; the shared board; writing alone; grouping;
  // the group picks with dots and the top three get an owner and a date.
  function ideaParts(b, p) {
    return {
      askB: b <= 1 ? ask(b === 0 ? span(p, 0.1, 0.5) : 1, tr('Hoe krijgen we', 'How do we get the', 262), tr('de schakelkast op tijd?', 'switchboard in time?', 262)) : '',
      ph1B: b >= 2 ? op(b === 2 ? span(p, 0, 0.4) : 1, chip(334, 98, 284, tr('Veel ideeën', 'Many ideas', 262), 'pm-card')) : '',
      silentB: b >= 2 ? op(b === 2 ? span(p, 0.15, 0.55) : 1, chip(334, 142, 284, tr('Stil schrijven', 'Silent writing', 262))) : '',
      clusB: b >= 3 ? op(b === 3 ? span(p, 0, 0.4) : 1, chip(334, 186, 284, tr('Clusteren', 'Affinity grouping', 262))) : '',
      chooseB: b >= 4 ? op(span(p, 0, 0.4), chip(334, 238, 284, tr('Kiezen met stippen', 'Choose with dots', 262), 'pm-crit') + chip(334, 282, 138, tr('eigenaar', 'owner', 112)) + chip(480, 282, 138, tr('datum', 'date', 112))) : '',
      ...tool(b, p, 1, 336, tr('Digitaal whiteboard', 'Online whiteboard', 262)),
    };
  }

  // ---- s5: formats on the floor. What people say and what happens; the four formats; an interview round across levels;
  // the same guide in every conversation.
  function floorParts(b, p) {
    const say = rect(334, 98, 284, 44, 'pm-tile', 6) + txt(346, 127, tr('Wat mensen zeggen', 'What people say', 262), 22, 'start', 'pm-txt')
      + rect(334, 152, 284, 44, 'pm-crit', 6) + txt(346, 181, tr('Wat er gebeurt', 'What happens', 262), 22, 'start', 'pm-on');
    const fm = [tr('Gembawalk', 'Gemba walk', 262), tr('Interviewronde', 'Interview round', 262), tr('Demo', 'Demo', 262), tr('Kaizen-event', 'Kaizen event', 262)];
    let fmts = '';
    fm.forEach((f, i) => { fmts += op(b === 1 ? span(p, i * 0.14, i * 0.14 + 0.3) : 1, chip(334, 98 + i * 40, 284, f)); });
    const lay = [tr('sponsor', 'sponsor', 262), tr('planner', 'planner', 262), tr('teamleider', 'team lead', 262), tr('uitvoerder', 'operator', 262)];
    let layers = chip(334, 98, 284, tr('Interviewronde', 'Interview round', 262), 'pm-crit');
    lay.forEach((l, i) => { layers += op(span(p, 0.1 + i * 0.12, 0.4 + i * 0.12), chip(350, 142 + i * 38, 268, l)); });
    let guide = '';
    for (let i = 0; i < 5; i++) guide += rect(346, 112 + i * 40, 28, 28, 'pm-badge', 5) + txt(360, 133 + i * 40, String(i + 1), 22, 'middle', 'pm-txt') + rect(386, 120 + i * 40, 150 - (i % 3) * 22, 12, 'pm-bar', 3);
    return {
      askB: b === 0 ? op(span(p, 0.1, 0.5), say) : '',
      fmtsB: b === 1 ? fmts : '',
      layersB: b === 2 ? layers : '',
      guideB: b >= 3 ? op(span(p, 0.05, 0.5), rect(334, 98, 284, 220, 'pm-card', 8) + guide) : '',
      ...tool(b, p, 3, 336, tr('Interviewleidraad', 'Interview guide', 262)),
    };
  }

  // ---- s6: the closing scene. ONE function. First the shared Projects map (the kit's mapScene, the very drawing
  // of the app) with Werkvormen en overleggen lit, then zoomed to it; then the module's four topics, each with its four
  // levels as columns (the words the app uses for the levels), the start marker on the first level of the first
  // topic. The place lies in the middle of the map: the view is centred on it at 1.5 and clamped to the map's edges.
  const MAP0 = { s: 0.77, x: 73.6, y: 0 };
  const MAP1 = { s: 1.5, x: Math.max(640 - 640 * 1.5, Math.min(0, 320 - MAPZ[0] * 1.5)), y: Math.max(400 - 520 * 1.5, Math.min(0, 200 - MAPZ[1] * 1.5)) };
  function mapPlace(b, p) {
    const z = b === 0 ? span(p, 0.35, 1) : 1;
    const s = lerp(MAP0.s, MAP1.s, z);
    move(E.mapG, `translate(${f1(lerp(MAP0.x, MAP1.x, z))} ${f1(lerp(MAP0.y, MAP1.y, z))}) scale(${s.toFixed(4)})`);
    // the map fades out once, in the second beat, and stays hidden after it (it must not come back at the start of
    // every later beat, behind the grid)
    return b === 0 ? 1 : b === 1 ? 1 - span(p, 0, 0.45) : 0;
  }
  // the columns (GRID from build.mjs, which checks the level words fit): a tile column of GRID.tile units, four
  // level columns of GRID.col from GRID.x with boxes of GRID.box. The level words stand on one line each,
  // staggered over two rows (the first and third high, the second and fourth low), so neighbours never meet.
  const GX = GRID.x;
  const GW = GRID.col;
  const GB = GRID.box;
  const gridY = (i) => 70 + i * 82;
  function grid(b, p) {
    const out = { r: ['', '', '', ''], l1: '', l2: '', l3: '', l4: '', st: '' };
    const lv = ['l1', 'l2', 'l3', 'l4'];
    LW.forEach((w, j) => { out[lv[j]] += txt(GX + j * GW + GB / 2, 30 + (j % 2) * 24, w, 22, 'middle', 'pm-mute'); });
    TITLE.forEach((t, i) => {
      const y = gridY(i);
      let s = rect(20, y, GRID.tile, 78, 'pm-tile', 8);
      const gl = wrap(t, D.tileUnits).slice(0, 3);
      gl.forEach((l, j) => { s += txt(26, y + 46 + (j - (gl.length - 1) / 2) * 24, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.12, i * 0.12 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 12, GB, 54, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.st = rect(GX - 5, gridY(0) + 7, GB + 10, 64, 'pm-out', 10);
    return out;
  }

  const KEYS = ['planB', 'pathB', 'askB', 'formatB', 'mvwB', 'kickB', 'goalB', 'facilB', 'lanesB', 'asisB', 'ph1B', 'silentB', 'clusB', 'chooseB', 'fmtsB', 'layersB', 'guideB', 'tool1B', 'l1', 'l2', 'l3', 'l4', 'st'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    const o = { r: ['', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 5;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = b >= 2 ? tr('Onderwerpen', 'Topics') : tr('Plan', 'Plan');
      o.planB = b >= 2 ? '' : planCard(b === 0 ? span(p, 0.05, 0.4) : 1, b === 0 && p > 0.5 || b > 0);
      if (b === 1) { o.pathB = pathBox(span(p, 0.1, 0.5)); lab = tr('schema', 'diagram'); }
      if (b >= 2) { o.r = routeTiles([0, 1, 2, 3].map((i) => (b > 2 ? 1 : span(p, i * 0.18, i * 0.18 + 0.3)))); lab = tr('schema', 'diagram'); }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Overleggen', 'Meetings'), tr('Werksessie', 'Workshop'), tr('Ideeën', 'Ideas'), tr('Vloer', 'Floor')][si - 1];
      o.r = strip(si - 1);
      lab = si === 1 && b < 3 ? tr('schema', 'diagram') : tr('voorbeeld', 'example');
    }
    if (si === 1) Object.assign(o, meetParts(b, p));
    if (si === 2) Object.assign(o, workParts(b, p));
    if (si === 3) Object.assign(o, ideaParts(b, p));
    if (si === 4) Object.assign(o, floorParts(b, p));
    let pbg = 'x="322" y="12" width="308" height="376"';
    if (closing) {
      title = tr('De kaart', 'The map');
      lab = tr('schema', 'diagram');
      mapA = mapPlace(b, p);
      if (b === 0) hudA = 0;
      else {
        hudA = span(p, 0.2, 0.6);
        if (b > 1) hudA = 1;
        pbg = 'x="8" y="6" width="624" height="388"';
        const m = grid(b, p);
        o.r = m.r; o.l1 = m.l1; o.l2 = m.l2; o.l3 = m.l3; o.l4 = m.l4; o.st = b >= 2 ? m.st : '';
        title = '';
        lab = '';
      }
    }
    show(E.mapG, mapA);
    show(E.hud, hudA);
    if (E.pbg.__v !== pbg) { for (const kv of pbg.split(' ')) { const [k, v] = kv.split('='); E.pbg.setAttribute(k, v.replace(/"/g, '')); } E.pbg.__v = pbg; }
    const head = closing && b > 0 ? '' : txt(334, 38, title, 22, 'start', 'pm-big') + txt(618, 38, lab, 22, 'end', 'pm-mute');
    set(E.pHead, head);
    ['r0', 'r1', 'r2', 'r3'].forEach((k2, i) => set(E[k2], o.r[i]));
    for (const k2 of KEYS) set(E[k2], o[k2]);
  }

  return { render };
})();
