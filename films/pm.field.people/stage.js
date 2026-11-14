// The stage of the field film "Mensen en invloed / People and influence": a pure function of (scene, u). Inlined
// into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H and MAPZ (the centres
// of the five stations on the shared map). The story is drawn in hall B at the left, as in the pilot and in field
// film 1: the floor and outline of line 3, line 4 that stays, the power cabinet and its cable, the switchboard on
// the wall and a cast that changes per station. The panel at the right draws each station as a small schema
// ("what is it for"), then its two tools as two chips, then a dashed card with what goes wrong without it.
// Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows
// or hides the room's moving parts. The closing scene (the shared Projects map with the five stations lit, the
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
  // s1 brings all five in at its second beat (the people of the film), then each station its own two or three.
  const FROM = {
    sponsor: [[0, 1], [5, 2]],
    lead: [[0, 1], [1, 0], [2, 0], [5, 0]],
    buyer: [[0, 1], [2, 0]],
    installer: [[0, 1], [3, 0], [4, 0]],
    crew: [[0, 1], [4, 0], [5, 1]],
  };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }
  // the things that change: the cable is connected once the installer has a date (from Projects outside your
  // field on); line 3 stands in its outline and the switchboard hangs on the wall for the last station
  function things(si) {
    const moved = si >= 5 ? 1 : 0;
    show(E.line3S, moved);
    show(E.swS, moved);
    show(E.swG, 1 - moved);
    const wired = si >= 4 ? 1 : 0;
    show(E.cabOn, wired);
    show(E.cabOff, 1 - wired);
  }

  // ---- the road. s1 beat 3: one row per station, each a numbered stop on a dashed road with the station's title
  // (wrapped into at most two lines of ROW units). s2 on: a strip of numbered squares under the heading.
  const N = TITLES.length;
  const rowY = (i) => 66 + i * 62;
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
  // the strip: five small numbered squares under the heading, the scene's own station filled
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
  // a small person glyph (head and shoulders), for the five people of the opening
  const glyph = (cx, cy, cls) => `<circle class="${cls}" cx="${cx}" cy="${cy - 10}" r="9"/><path class="${cls}" d="M${cx - 15} ${cy + 22}v-6a15 12 0 0 1 30 0v6z"/>`;

  // ---- s1: the opening. Beat 1 the goal card with three lamps (materials and plan fine, the people stuck), beat 2
  // five people, beat 3 the road.
  function lamps(a, redOn) {
    const row = (y, cls, l) => `<circle class="${cls}" cx="352" cy="${y}" r="13"/>` + txt(380, y + 8, l, 22, 'start', 'pm-txt');
    let s = rect(334, 56, 284, 48, 'pm-card', 8) + txt(346, 88, tr('Lijn 3 naar hal B', 'Line 3 to hall B', 262), 22, 'start', 'pm-big');
    s += row(146, 'pm-rag-g', tr('Materiaal', 'Materials', 220)) + row(190, 'pm-rag-g', tr('Plan', 'Plan', 220));
    s += row(234, redOn ? 'pm-rag-r' : 'pm-rag', tr('Mensen', 'People', 220));
    return op(a, s);
  }
  function people5(a) {
    let s = '';
    for (let i = 0; i < 5; i++) s += glyph(358 + i * 56, 150, 'pm-tile');
    s += rect(334, 206, 284, 44, 'pm-badge', 6) + txt(346, 236, tr('Vijf stations', 'Five stations', 262), 22, 'start', 'pm-txt');
    return op(a, s);
  }

  // ---- the five stations: a schema of what it is for (y 110 to 206)
  const FOR = [
    // s2 When you're stuck: a road with a barrier before the goal
    () => txt(334, 134, tr('Alles staat stil', 'Everything stops', 284), 22, 'start', 'pm-big')
      + `<path class="pm-road" d="M342 178H492"/>` + rect(498, 152, 16, 52, 'pm-crit', 3)
      + rect(536, 152, 82, 52, 'pm-tile', 6) + txt(577, 186, tr('Doel', 'Goal', 70), 22, 'middle', 'pm-txt'),
    // s3 Leading people: you, and three people who do not report to you (dashed)
    () => `<circle class="pm-crit" cx="372" cy="158" r="28"/>` + txt(372, 166, tr('Jij', 'You', 50), 22, 'middle', 'pm-on')
      + [[110, tr('Inkoper', 'Buyer', 136)], [146, tr('Teamleider', 'Team lead', 136)], [182, tr('Operators', 'Operators', 136)]].map(([y, l]) => `<path class="pm-road" d="M404 158L476 ${y + 14}"/>` + rect(480, y, 138, 30, 'pm-tile', 6) + txt(490, y + 23, l, 22, 'start', 'pm-txt')).join(''),
    // s4 Negotiating: the installer cannot make the date, you need the power first
    () => rect(334, 110, 284, 38, 'pm-tile', 6) + txt(346, 137, tr('Installateur: later', 'Installer: later', 262), 22, 'start', 'pm-txt')
      + arrow(476, 152, 476, 162) + rect(334, 166, 284, 38, 'pm-crit', 6) + txt(346, 193, tr('Jij: stroom eerst', 'You: power first', 262), 22, 'start', 'pm-on'),
    // s5 Outside your field: two experts disagree, you structure the decision
    () => rect(334, 110, 138, 52, 'pm-tile', 6) + txt(344, 132, 'Expert A', 22, 'start', 'pm-big') + txt(344, 154, tr('genoeg', 'enough', 120), 22, 'start', 'pm-mute')
      + rect(480, 110, 138, 52, 'pm-tile', 6) + txt(490, 132, 'Expert B', 22, 'start', 'pm-big') + txt(490, 154, tr('te klein', 'too small', 120), 22, 'start', 'pm-mute')
      + rect(334, 170, 284, 36, 'pm-crit', 6) + txt(346, 195, tr('Jij kiest criteria', 'You set criteria', 262), 22, 'start', 'pm-on'),
    // s6 Performance management: a small tree, one number split into the numbers that move it
    () => rect(414, 108, 124, 32, 'pm-crit', 6) + txt(476, 132, tr('Output', 'Output', 110), 22, 'middle', 'pm-on')
      + '<path class="pm-link" d="M476 140V152M379 152H573M379 152V164M476 152V164M573 152V164"/>'
      + [[334, tr('Uren', 'Hours', 90)], [431, tr('Tempo', 'Speed', 90)], [528, tr('Goed', 'Good', 90)]].map(([x, l]) => rect(x, 164, 90, 36, 'pm-card', 6) + txt(x + 45, 190, l, 22, 'middle', 'pm-txt')).join(''),
  ];
  const TOOLS = [
    [tr('Onduidelijk doel', 'Unclear goal', 256), tr('Mensenprobleem', 'People problem', 256)],
    [tr('Deskundigheidsmacht', 'Expert power', 256), 'SBI'],
    ['BATNA', tr('Belangen', 'Interests', 256)],
    [tr('Vragenset', 'Question set', 256), tr('Second opinion', 'Second opinion', 256)],
    [tr('KPI-boom', 'KPI tree', 256), tr('Prestatiebord', 'Performance board', 256)],
  ];
  const WITHOUT = [
    tr('verkeerd probleem', 'the wrong problem', 240),
    tr('macht slijt', 'power wears out', 240),
    tr('zwak aan tafel', 'weak at the table', 240),
    tr('hardste stem wint', 'loudest voice wins', 240),
    tr('muur vol cijfers', 'a wall of numbers', 240),
  ];
  function station(si, b, p) {
    const k = si - 1;
    return {
      forB: op(b === 0 ? span(p, 0.1, 0.45) : 1, FOR[k]()),
      t1B: chip(224, TOOLS[k][0], b >= 1 ? (b === 1 ? span(p, 0, 0.3) : 1) : 0),
      t2B: chip(270, TOOLS[k][1], b >= 1 ? (b === 1 ? span(p, 0.2, 0.5) : 1) : 0),
      withoutB: without(WITHOUT[k], b >= 2 ? span(p, 0, 0.4) : 0),
    };
  }

  // ---- s7: the closing scene. ONE function. The shared Projects map (the kit's mapScene, the very drawing of the
  // app) with the five stations lit: first the whole map, then the zoom moves place by place (at 1.5 a lit
  // place's label is 22 units), and at the end back out to the whole map.
  // A view is { s, x, y }: the map scaled by s, its origin at (x, y) of the stage. At 1.5 the view is clamped
  // to the map's edges, so the zoom never shows the empty stage beside the map.
  const WHOLE = { s: 0.77, x: 73.6, y: 0 };
  const ROADV = { s: 1, x: 0, y: 200 - 171.5 };
  const zoom = (cx) => ({ s: 1.5, x: clamp(320 - cx * 1.5, 640 - 640 * 1.5, 0), y: 200 - MAPZ[0][1] * 1.5 });
  const VIEWS = [ROADV, ...MAPZ.map((m) => zoom(m[0])), WHOLE];
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
    things(si);
    const o = Object.fromEntries(PANEL.map((k2) => [k2, '']));
    const rd = TITLES.map(() => '');
    let head = '';
    const isMap = si === 6;
    show(E.world, isMap ? 0 : 1);
    show(E.mapG, isMap ? 1 : 0);
    show(E.hud, isMap ? 0 : 1);
    if (si === 0) {
      const t = [tr('Lijn 3', 'Line 3'), tr('Mensen', 'People'), tr('De weg', 'The road')][b];
      const lab = b === 0 ? tr('voorbeeld', 'example') : tr('schema', 'diagram');
      head = txt(334, 38, t, 22, 'start', 'pm-big') + txt(618, 38, lab, 22, 'end', 'pm-mute');
      if (b === 0) o.goalB = lamps(span(p, 0.05, 0.4), p > 0.55);
      else if (b === 1) o.peopleB = people5(span(p, 0.05, 0.4));
      else {
        const r = roadRows(TITLES.map((tt, i) => span(p, 0.05 + i * 0.12, 0.3 + i * 0.12)));
        r.rows.forEach((x, i) => { rd[i] = x; });
        o.roadB = r.line;
      }
    } else if (si <= 5) {
      const lines = wrapUnits(TITLES[si - 1], HEAD, CW);
      head = lines.map((ln, j) => txt(334, 34 + j * 26, ln, 22, 'start', 'pm-big')).join('') + txt(618, 92, si === 5 ? tr('schema', 'diagram') : tr('voorbeeld', 'example'), 22, 'end', 'pm-mute');
      strip(si - 1).forEach((x, i) => { rd[i] = x; });
      Object.assign(o, station(si, b, p));
    } else closing(b, p);
    set(E.pHead, isMap ? '' : head);
    rd.forEach((x, i) => set(E[`rd${i}`], x));
    for (const k2 of PANEL) set(E[k2], o[k2]);
  }

  return { render };
})();
