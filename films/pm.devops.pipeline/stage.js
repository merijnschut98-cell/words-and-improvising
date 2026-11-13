// The stage of the film "Een commit door de pipeline / A commit through the
// pipeline": a pure function of (scene, u). Inlined into the page after the
// anatomy kit and a preamble from build.mjs that defines C (the panel's blocks,
// the board's drawing area, the belt's stations, the parcel's screen step per
// centimetre, the example's minutes), CAM (one camera move per scene), W and H.
// Moves are placed per Dutch caption beat (beatStarts), so the video's
// narration timing (films/_kit/beatwarp.js) keeps them in step.
//
// The room holds the pipeline as a conveyor on a long table: a parcel (the
// commit) rides from the developer at the left past five stations (build,
// tests, artefact store, test environment, production), each with a lamp on
// top that idles, runs (accent), passes (green) or fails (red). The parcel is
// one static solid moved along the belt by a translation (the projection is
// affine, so a step along x is a fixed screen vector). The whiteboard carries
// shapes only, each layer its own cue group: the two camps and the wall (s1),
// the version line with its commits (s2 to s5), one big batch against small
// ones (s4, s8), the example's minutes (s5), four dials for the DORA metrics
// and eight deployments (s6 to s9). The panel at the right gets one card per
// scene, each block in its own cue group (o[key] goes into data-k "p_<key>"),
// all text at 22 units (a video film); a card that needs more room turns a
// page within its scene.
/* global C, CAM, W, H, span, beatStarts */
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
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, t) => { if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const attr = (e, k, v) => { if (e.getAttribute(k) !== v) e.setAttribute(k, v); };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const txt = (x, y, t, cls = 'pm-txt', anchor = 'start') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="22" text-anchor="${anchor}">${esc(t)}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = 334;
  const X1 = 618;
  const CW = X1 - X0;
  const card = (y, h, cls = 'pm-card') => rect(X0 - 6, y, CW + 12, h, cls, 8);
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pm-txt') : '')).join('');
  // a card from y with a first line in bold (accent when hot) and more lines below
  const box = (y, head, rest, hot = false) => {
    const more = rest.map((t) => (Array.isArray(t) ? t : [t])).filter(([t]) => t);
    return card(y, 20 + 26 * (more.length + 1), hot ? 'pm-hot' : 'pm-card') + lines(y + 28, [[head, hot ? 'pm-on' : 'pm-big'], ...more], X0 + 4);
  };
  // b at or after beat k: 1; before: 0; in beat k: the eased progress from a to c
  const at = (b, p, k, a = 0.05, c = 0.3) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
  // a page of the card that shows from beat k0 and gives way at beat k1 (-1: never)
  const page = (b, p, k0, k1) => (b < k0 ? 0 : b === k0 && k0 > 0 ? span(p, 0.02, 0.2) : b < k1 || k1 < 0 ? 1 : b === k1 ? 1 - span(p, 0, 0.12) : 0);
  const DIA = tr('schema', 'diagram');
  const EX = tr('voorbeeld', 'example');

  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1) };
  }
  function camera(si, u) {
    const c = CAM[si];
    const kk = span(u, 0, 1);
    const cx = lerp(c.from[0], c.to[0], kk);
    const cy = lerp(c.from[1], c.to[1], kk);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(cx)} ${f1(cy)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`);
  }

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  // s1: two camps and the wall; DevOps; the word's origin
  function s1(b, p) {
    const o = { head: [tr('twee kampen', 'two camps'), DIA] };
    const A = page(b, p, 0, 2);
    o.camps = op(A, box(54, tr('twee kampen', 'two camps'), [tr('ontwikkelaars bouwen', 'developers build'), ['development', 'pm-mute'], tr('beheerders draaien', 'operators run'), ['operations', 'pm-mute']], b === 0));
    if (b >= 1) o.wall = op(A * at(b, p, 1), box(222, tr('de muur', 'the wall'), [tr('verandering of rust', 'change or calm'), tr('code over de muur', 'code over the wall')], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.devops = op(B, box(54, 'DevOps', [tr('één team: bouwen', 'one team: builds'), tr('én draaien', 'and runs'), tr('automatiseert wat', 'automates what'), tr('vaak terugkomt', 'recurs')], b === 2));
    if (b >= 3) o.origin = op(B * at(b, p, 3), box(222, tr('rond 2009', 'around 2009'), ['Patrick Debois:', tr('eerste DevOpsDays', 'first DevOpsDays'), [tr('in Gent', 'in Ghent, Belgium'), 'pm-mute']], b === 3));
    return o;
  }

  // s2: the pipeline, version control, a commit
  function s2(b, p) {
    const o = { head: ['pipeline', DIA] };
    const A = page(b, p, 0, 2);
    o.pipe = op(A, box(54, 'pipeline', [tr('automatische', 'an automated'), tr('lopende band', 'conveyor'), [tr('ontwikkelaar', 'developer'), 'pm-mute'], [tr('→ gebruiker', '→ user'), 'pm-mute']], b === 0));
    if (b >= 1) o.vc = op(A * at(b, p, 1), box(222, tr('versiebeheer', 'version control'), [tr('meestal Git:', 'usually Git:'), tr('elke versie bewaard,', 'every version kept,'), tr('wie wat veranderde', 'who changed what')], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.commit = op(B, box(54, 'commit', [tr('een pakketje', 'a small package'), tr('veranderingen', 'of changes'), tr('+ een korte uitleg', '+ a short note')], true)
      + lines(212, [[tr('opgeslagen in', 'saved in'), 'pm-mute'], [tr('versiebeheer', 'version control'), 'pm-mute']]));
    return o;
  }

  // s3: the four steps and the red test
  function s3(b, p) {
    const o = { head: [tr('vier stappen', 'four steps'), DIA] };
    const step = (y, k, head, sub) => lines(y, [[`${k}  ${head}`, b === k - 1 ? 'pm-on' : 'pm-big'], [`    ${sub}`, 'pm-mute']]);
    o.build = op(at(b, p, 0), step(80, 1, 'build', tr('code → draaibaar', 'code → runnable')));
    if (b >= 1) o.tests = op(at(b, p, 1), step(140, 2, tr('automatische tests', 'automated tests'), tr('werkt alles nog?', 'all still working?')));
    if (b >= 2) o.art = op(at(b, p, 2), step(200, 3, tr('artefact', 'artefact'), tr('vast pakket', 'a fixed package')));
    if (b >= 3) o.install = op(at(b, p, 3), step(260, 4, tr('testomgeving', 'test environment'), tr('later: echte systemen', 'later: real systems')));
    if (b >= 4) o.red = op(at(b, p, 4), card(300, 76, 'pm-hot') + lines(328, [[tr('rode test: band stopt', 'red test: belt stops'), 'pm-badt'], [tr('team krijgt melding', 'the team is told'), 'pm-on']], X0 + 4));
    return o;
  }

  // s4: the Lean view (standard work, jidoka, small batches), CI/CD; the factory
  function s4(b, p) {
    const o = { head: [tr('Lean en fabriek', 'Lean and factory'), DIA] };
    const A = page(b, p, 0, 3);
    o.std = op(A, box(54, tr('standaardwerk', 'standard work'), [tr('elke wijziging zelfde', 'every change, same'), tr('route: voorspelbaar', 'route: predictable')], b === 0));
    if (b >= 1) o.jidoka = op(A * at(b, p, 1), box(164, 'jidoka', [tr('stop bij een fout,', 'stop at a fault,'), tr('geef niets door', 'pass nothing on')], b === 1));
    if (b >= 2) o.batch = op(A * at(b, p, 2), box(274, tr('kleine series', 'small batches'), [tr('kleine commits:', 'small commits:'), tr('minder voorraad', 'less work between')], b === 2));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.cicd = op(B, box(54, 'CI/CD', [tr('continuous', 'continuous'), tr('  integration', '  integration'), tr('continuous delivery', 'continuous delivery'), [tr('volgende lessen', 'later lessons'), 'pm-mute']], b === 3));
    if (b >= 4) o.notsw = op(at(b, p, 4), box(204, tr('“geen softwarebedrijf”', '“not a software firm”'), [tr('maar MES, etiketten', 'but MES, labels'), tr('en ERP-koppelingen', 'and ERP links'), tr('veranderen steeds', 'keep changing')], b === 4));
    if (b >= 5) o.ask = op(at(b, p, 5), lines(334, [[tr('vraag: welke stappen', 'ask: which steps'), 'pm-on'], [tr('gaan met de hand?', 'are done by hand?'), 'pm-on']]));
    return o;
  }

  // s5: the dairy label: commit to test environment in 15 minutes
  function s5(b, p) {
    const o = { head: [tr('etiket', 'label'), EX] };
    o.dairy = box(54, tr('zuivelfabriek', 'dairy plant'), [tr('houdbaarheidsdatum', 'best-before date on'), tr('groter op etiket', 'the label: larger')], b === 0);
    const row = (y, t, what, hot) => txt(X0, y, t, hot ? 'pm-on' : 'pm-big') + txt(X0 + 82, y, what, 'pm-txt');
    if (b >= 1) o.t1 = op(at(b, p, 1), row(186, '09:00', 'commit', false) + op(at(b, p, 1, 0.35, 0.55), row(212, '09:01', tr('build: 3 min', 'build: 3 min'), b === 1)));
    if (b >= 2) o.t2 = op(at(b, p, 2), row(238, '09:04', tr('tests: 8 min', 'tests: 8 min'), b === 2));
    if (b >= 3) o.t3 = op(at(b, p, 3), row(264, '09:12', tr('artefact 4.7.1', 'artefact 4.7.1'), false) + op(at(b, p, 3, 0.4, 0.6), row(290, '09:15', tr('testomgeving', 'test env.'), b === 3)));
    if (b >= 4) o.t4 = op(at(b, p, 4), card(306, 72, 'pm-hot') + lines(334, [[tr('totaal: 15 minuten', 'total: 15 minutes'), 'pm-on'], [tr('geen handwerk', 'no manual step'), 'pm-big']], X0 + 4));
    return o;
  }

  // s6: DORA, its source; deployment frequency, production, change lead time
  function s6(b, p) {
    const o = { head: ['DORA', DIA] };
    const A = page(b, p, 0, 2);
    o.dora = op(A, box(54, 'DORA', ['DevOps Research', 'and Assessment', [tr('sinds 2014 elk jaar', 'since 2014, a yearly'), 'pm-mute'], [tr('enquête onder', 'survey of thousands'), 'pm-mute'], [tr('duizenden IT’ers', 'of IT professionals'), 'pm-mute']], b === 0));
    if (b >= 1) o.book = op(A * at(b, p, 1), lines(254, [[tr('Accelerate, 2018:', 'Accelerate, 2018:'), 'pm-big'], ['Forsgren, Humble, Kim', ''], [tr('eind 2018: Google Cloud', 'late 2018: Google Cloud'), 'pm-mute'], [tr('State of DevOps-rapport', 'State of DevOps report'), 'pm-mute']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.freq = op(B, box(54, tr('snelheid', 'speed'), [[tr('deployfrequentie', 'deployment frequency'), 'pm-big'], tr('hoe vaak in productie', 'how often to production'), [tr('bv. 3× per dag', 'e.g. 3× a day'), 'pm-mute'], [tr('of 1× per maand', 'or once a month'), 'pm-mute']], b === 2));
    if (b >= 3) o.prodterm = op(at(b, p, 3), lines(232, [[tr('productie:', 'production:'), b === 3 ? 'pm-on' : 'pm-big'], [tr('de echte systemen', 'the real systems'), '']]));
    if (b >= 4) o.lead = op(at(b, p, 4), box(272, tr('doorlooptijd', 'change lead time'), [tr('commit → productie', 'commit → production'), [tr('in handen van het team', 'in the team’s own hands'), 'pm-mute']], b === 4));
    return o;
  }

  // s7: change fail rate, rolling back; recovery time and MTTR; the four keys
  function s7(b, p) {
    const o = { head: [tr('stabiliteit', 'stability'), DIA] };
    const A = page(b, p, 0, 2);
    o.fail = op(A, box(54, tr('stabiliteit', 'stability'), [[tr('faalpercentage', 'change fail rate'), 'pm-big'], tr('deploys die direct', 'deployments that need'), tr('ingrijpen vragen', 'immediate action')], b === 0));
    if (b >= 1) o.roll = op(A * at(b, p, 1), lines(212, [[tr('← terugdraaien', '← roll back'), 'pm-on'], [tr('of een spoedreparatie', 'or an urgent fix'), '']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.rec = op(B, box(54, tr('hersteltijd', 'recovery time'), [tr('na een mislukte deploy', 'after a failed deploy')], b === 2));
    if (b >= 3) o.mttr = op(at(b, p, 3), lines(160, [[tr('tot 2023: MTTR', 'until 2023: MTTR'), 'pm-big'], ['mean time to restore', 'pm-mute'], [tr('nu: alleen door een', 'now: only failures'), ''], [tr('eigen wijziging', 'from your own change'), '']]));
    if (b >= 4) o.keys = op(at(b, p, 4), box(270, tr('vier sleutels', 'the four keys'), [tr('top: alle vier goed', 'best: all four good'), [tr('snel én stabiel', 'fast and stable'), 'pm-on']], b === 4));
    return o;
  }

  // s8: the Lean view of two metrics; "once a quarter"; the sharp question
  function s8(b, p) {
    const o = { head: [tr('in de praktijk', 'in practice'), DIA] };
    const A = page(b, p, 0, 1);
    o.leanv = op(A, box(54, tr('Lean-blik', 'Lean view'), [tr('doorlooptijd: als in', 'lead time: as in a'), tr('een waardestroom', 'value stream'), tr('faalpercentage: als', 'fail rate: like first'), tr('first pass yield,', 'pass yield,'), [tr('maar omgekeerd', 'but reversed'), 'pm-mute']], true));
    const B = page(b, p, 1, -1);
    if (b >= 1) o.quarter = op(B, box(54, tr('“1× per kwartaal”', '“once a quarter”'), [tr('DORA: vaak andersom', 'DORA: often reversed'), tr('grote deploys gaan', 'big, rare ones fail'), tr('vaker mis, herstel', 'more and take longer'), tr('duurt langer', 'to recover')], b === 1));
    if (b >= 2) o.ask2 = op(at(b, p, 2), lines(236, [[tr('vraag:', 'ask:'), 'pm-mute'], [tr('hoe vaak in productie?', 'how often deployed?'), ''], [tr('hoe vaak ingrijpen?', 'how often step in?'), ''], [tr('niemand weet het?', 'nobody knows?'), 'pm-big'], [tr('→ nog niet gemeten', '→ not measured yet'), 'pm-on']]));
    return o;
  }

  // s9: the confectionery plant's four numbers over four weeks
  function s9(b, p) {
    const o = { head: [tr('snoepfabriek', 'confectionery'), EX] };
    const A = page(b, p, 0, 3);
    const two = (y, name, val, hot) => lines(y, [[name, hot ? 'pm-on' : 'pm-big'], [val, '']]);
    o.candy = op(A, lines(80, [[tr('ERP–MES-koppelingen', 'ERP–MES links'), b === 0 ? 'pm-on' : 'pm-big'], [tr('cijfers over 4 weken', 'numbers for 4 weeks'), 'pm-mute']]));
    if (b >= 1) o.e1 = op(A * at(b, p, 1), two(150, tr('deployfrequentie', 'deployment frequency'), tr('8 / 4 = 2 per week', '8 / 4 = 2 a week'), b === 1));
    if (b >= 2) o.e2 = op(A * at(b, p, 2), two(220, tr('doorlooptijd', 'change lead time'), tr('6 werkdagen', '6 working days'), b === 2) + txt(X0, 272, tr('wacht op testmoment', 'waits for a test slot'), 'pm-mute'));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.e3 = op(B, two(80, tr('faalpercentage', 'change fail rate'), tr('2 / 8 = 25%', '2 / 8 = 25%'), b === 3)
      + op(at(b, p, 3, 0.45, 0.65), two(150, tr('hersteltijd', 'recovery time'), tr('1 uur en 3 uur', '1 hour and 3 hours'), b === 3)));
    if (b >= 4) o.e4 = op(at(b, p, 4), card(212, 98, 'pm-hot') + lines(240, [[tr('1 op de 4 gaat mis', '1 in 4 goes wrong'), 'pm-badt'], [tr('daar ligt de eerste', 'that is the first'), 'pm-on'], [tr('verbetering', 'improvement'), 'pm-on']], X0 + 4));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the belt
  // Lamp states: 0 idle, 1 running, 2 passed, 3 failed. The parcel's x in world
  // cm along the belt; bad: it failed (red).
  const ST = C.STX;
  const LAMP = ['pm-lamp', 'pm-run', 'pm-ok', 'pm-bad'];
  // travel through stations i0..i1 within progress window [a, c] of p; returns
  // { x, lamps } with the stations passed green and the current one running
  function ride(p, i0, i1, a = 0.05, c = 0.9, from = C.PX0) {
    const q = span(p, a, c) * (i1 - i0 + 1);
    const seg = Math.min(i1 - i0, Math.floor(q));
    const f = q - Math.floor(q);
    const lamps = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) if (i < i0 + seg || (q >= i1 - i0 + 1 && i <= i1)) lamps[i] = 2; else if (i === i0 + seg && i <= i1) lamps[i] = 1;
    for (let i = 0; i < i0; i++) lamps[i] = 2;
    const start = i0 + seg === i0 ? (i0 === 0 ? from : ST[i0 - 1]) : ST[i0 + seg - 1];
    const x = q >= i1 - i0 + 1 ? ST[i1] : lerp(start, ST[i0 + seg], span(f, 0, 0.55));
    return { x, lamps };
  }
  const allOk = [2, 2, 2, 2, 2];
  function belt(si, b, p) {
    let s = { x: C.PX0, lamps: [0, 0, 0, 0, 0], show: 1, bad: false };
    if (si === 0) s.show = 0;
    else if (si === 1) {
      if (b === 0) s = { ...ride(p, 0, 4, 0.1, 0.9), show: 1, bad: false };
      else if (b === 1) s.show = 0;
      else s.show = span(p, 0.05, 0.3);
    } else if (si === 2) {
      if (b < 4) {
        const r = ride(p, b === 3 ? 3 : b, b === 3 ? 4 : b, 0.1, 0.8);
        s = { ...r, show: 1, bad: false };
      } else {
        const lamps = [2, 3, 0, 0, 0];
        s = { x: ST[1], lamps, show: span(p, 0, 0.15), bad: true };
      }
    } else if (si === 3) {
      if (b === 0 || b === 3) s = { ...ride(p, 0, 4, 0.08, 0.9), show: 1, bad: false };
      else if (b === 1) s = { x: lerp(C.PX0, ST[1], span(p, 0.05, 0.35)), lamps: [2, p > 0.35 ? 3 : 1, 0, 0, 0], show: 1, bad: p > 0.35 };
      else if (b === 2) s = { x: C.PX0, lamps: [0, 0, 0, 0, 0], show: 1, bad: false };
      else s = { x: ST[4], lamps: allOk, show: 1, bad: false };
    } else if (si === 4) {
      if (b === 0) s = { x: C.PX0, lamps: [0, 0, 0, 0, 0], show: 0, bad: false };
      else if (b === 1) s = { x: lerp(C.PX0, ST[0], span(p, 0.3, 0.55)), lamps: [p > 0.5 ? 1 : 0, 0, 0, 0, 0], show: span(p, 0, 0.2), bad: false };
      else if (b === 2) s = { x: lerp(ST[0], ST[1], span(p, 0.05, 0.3)), lamps: [2, 1, 0, 0, 0], show: 1, bad: false };
      else if (b === 3) s = { x: p < 0.45 ? lerp(ST[1], ST[2], span(p, 0.05, 0.25)) : lerp(ST[2], ST[3], span(p, 0.45, 0.65)), lamps: [2, 2, p < 0.45 ? 1 : 2, p < 0.45 ? 0 : 2, 0], show: 1, bad: false };
      else s = { x: ST[3], lamps: [2, 2, 2, 2, 0], show: 1, bad: false };
    } else if (si === 5) {
      if (b === 2) {
        // deployments: two parcels' worth of trips to production in one beat
        const q = (span(p, 0.05, 0.95) * 2) % 1;
        s = { x: lerp(C.PX0, ST[4], q), lamps: allOk, show: 1, bad: false };
      } else if (b === 4) s = { ...ride(p, 0, 4, 0.08, 0.9), show: 1, bad: false };
      else s = { x: ST[4], lamps: allOk, show: 1, bad: false };
    } else if (si === 6) {
      if (b === 0) s = { x: lerp(ST[3], ST[4], span(p, 0.05, 0.3)), lamps: [2, 2, 2, 2, p > 0.35 ? 3 : 1], show: 1, bad: p > 0.35 };
      else if (b === 1) s = { x: lerp(ST[4], ST[2], span(p, 0.15, 0.6)), lamps: [2, 2, 2, 2, p > 0.6 ? 2 : 3], show: 1, bad: p < 0.6 };
      else if (b === 2) s = { x: ST[4], lamps: [2, 2, 2, 2, p < 0.5 ? 3 : 2], show: 1, bad: p < 0.5 };
      else s = { x: ST[4], lamps: allOk, show: 1, bad: false };
    } else s = { x: ST[4], lamps: allOk, show: 1, bad: false };
    return s;
  }

  // ---------------------------------------------------------------- the board
  // Face units (u to the right, v down); A: C.AREA.
  const A = C.AREA;
  const UC = (A.u0 + A.u1) / 2;
  const VM = (A.v0 + A.v1) / 2;
  const dial = (i, val, hot, show = 1) => {
    const cx = A.u0 + 18 + i * 36;
    const cy = A.v0 + 26;
    const r = 13;
    const ang = Math.PI * (1 - clamp(val, 0, 1));
    const arc = `M${f1(cx - r)} ${f1(cy)}A${r} ${r} 0 0 1 ${f1(cx + r)} ${f1(cy)}`;
    return op(show, path(arc, 'pm-loop') + path(`M${f1(cx - r)} ${f1(cy)}H${f1(cx + r)}`, 'pm-bdash')
      + path(`M${f1(cx)} ${f1(cy)}l${f1(Math.cos(ang) * (r - 2))} ${f1(-Math.sin(ang) * (r - 2))}`, hot ? 'pm-redp' : 'pm-needle')
      + `<circle class="pm-blk" cx="${f1(cx)}" cy="${f1(cy)}" r="1.6"/>`);
  };
  function board(si, b, p) {
    const L = {};
    // s1: the two camps, the wall and the parcel over it; then one loop
    if (si === 0) {
      const wallA = b < 2 ? 1 : b === 2 ? 1 - span(p, 0.05, 0.35) : 0;
      const loopA = b < 2 ? 0 : b === 2 ? span(p, 0.3, 0.6) : 1;
      let s = rect(A.u0 + 4, VM - 14, 34, 28, 'pm-note', 1) + path(`M${f1(A.u0 + 12)} ${f1(VM - 4)}l-4 4l4 4M${f1(A.u0 + 30)} ${f1(VM - 4)}l4 4l-4 4M${f1(A.u0 + 23)} ${f1(VM - 6)}l-4 12`, 'pm-loop');
      s += rect(A.u1 - 38, VM - 18, 34, 36, 'pm-note', 1) + [0, 1, 2].map((i) => path(`M${f1(A.u1 - 33)} ${f1(VM - 10 + i * 10)}h24`, 'pm-loop')).join('');
      s += op(wallA, rect(UC - 4, A.v0 + 4, 8, A.v1 - A.v0 - 8, 'pm-note2', 0.6));
      if (b === 1) {
        const t = span(p, 0.1, 0.8);
        const x = lerp(A.u0 + 24, A.u1 - 22, t);
        const y = VM - 18 - Math.sin(Math.PI * t) * 20;
        s += path(`M${f1(A.u0 + 24)} ${f1(VM - 18)}Q${f1(UC)} ${f1(VM - 58)} ${f1(A.u1 - 22)} ${f1(VM - 18)}`, 'pm-bdash') + rect(x - 3, y - 3, 6, 6, 'pm-note2', 0.5);
      }
      s += op(loopA, path(`M${f1(UC)} ${f1(VM)}c-8 -12 -24 -12 -24 0s16 12 24 0s24 -12 24 0s-16 12 -24 0`, 'pm-loop'));
      L.bWall = s;
    } else L.bWall = '';
    // s2 to s5: the version line, one dot per saved version; s2's commit adds one
    if (si >= 1 && si <= 4) {
      const n = si === 1 && b < 2 ? 6 : 7;
      const newA = si === 1 ? (b < 2 ? 0 : span(p, 0.05, 0.3)) : 1;
      const vy = A.v0 + 12;
      let s = path(`M${f1(A.u0 + 4)} ${f1(vy)}H${f1(A.u0 + 4 + 6 * 18)}`, 'pm-loop');
      for (let i = 0; i < 6; i++) s += `<circle class="pm-ring" cx="${f1(A.u0 + 4 + i * 18)}" cy="${f1(vy)}" r="3"/>`;
      if (n === 7 || newA > 0) s += op(newA, `<circle class="pm-blk" cx="${f1(A.u0 + 4 + 6 * 18)}" cy="${f1(vy)}" r="4"/>`);
      L.bGit = si === 1 ? op(b >= 1 ? 1 : span(p, 0.6, 0.9), s) : s;
    } else L.bGit = '';
    // s4 b3 and s8 b2: one big batch against small ones
    const batchA = si === 3 ? at(b, p, 2) * (b <= 2 ? 1 : 0.5) : si === 7 ? at(b, p, 1) : 0;
    if (batchA > 0) {
      const y1 = A.v0 + 30;
      const y2 = A.v0 + 50;
      let s = rect(A.u0 + 4, y1, 96, 12, si === 7 && b >= 1 ? 'pm-red' : 'pm-note', 1);
      for (let i = 0; i < 8; i++) s += rect(A.u0 + 4 + i * 12, y2, 9, 12, 'pm-note', 0.8);
      L.bBatch = op(batchA, s);
    } else L.bBatch = '';
    // s5: the minutes from commit to test environment, 0 to 15
    if (si === 4) {
      const u = (m) => A.u0 + 4 + (m / 15) * (A.u1 - A.u0 - 8);
      const vy = A.v0 + 44;
      let s = path(`M${f1(u(0))} ${f1(vy + 12)}H${f1(u(15))}`, 'pm-bdash');
      for (let m = 0; m <= 15; m += 5) s += path(`M${f1(u(m))} ${f1(vy + 10)}v4`, 'pm-loop');
      const segs = [[C.MIN.start, C.MIN.build, 1, 'pm-note'], [C.MIN.build, C.MIN.tests, 2, 'pm-note2'], [C.MIN.tests, C.MIN.env, 3, 'pm-note']];
      s += op(at(b, p, 1), `<circle class="pm-blk" cx="${f1(u(0))}" cy="${f1(vy + 4)}" r="2.6"/>`);
      for (const [a, z, k, cls] of segs) s += op(at(b, p, k, 0.2, 0.5), rect(u(a), vy, u(z) - u(a) - 0.6, 8, cls, 0.6));
      s += op(at(b, p, 4), path(`M${f1(u(0))} ${f1(vy - 6)}V${f1(vy - 10)}H${f1(u(15))}V${f1(vy - 6)}`, 'pm-loop'));
      L.bTime = s;
    } else L.bTime = '';
    // s6 to s9: four dials (deployment frequency, lead time, fail rate, recovery)
    // and, in s9, the eight deployments with the two that were rolled back
    const M = { mFreq: '', mLead: '', mFail: '', mRec: '' };
    if (si >= 5) {
      let v = [0.5, 0.5, 0.5, 0.5];
      let show = [1, 1, 1, 1];
      const hot = [false, false, false, false];
      if (si === 5) {
        show = [b >= 2 ? 1 : 0.35, b >= 2 ? 1 : 0.35, 0.35, 0.35];
        v = [b === 2 ? lerp(0.2, 0.8, span(p, 0.1, 0.8)) : b > 2 ? 0.8 : 0.5, b === 4 ? lerp(0.3, 0.7, span(p, 0.1, 0.8)) : 0.5, 0.5, 0.5];
        if (b >= 4) show[1] = 1;
      } else if (si === 6) {
        show = [1, 1, 1, b >= 2 ? 1 : 0.6];
        v = [0.8, 0.7, b === 0 ? lerp(0.6, 0.3, span(p, 0.2, 0.6)) : b < 4 ? 0.3 : lerp(0.3, 0.85, span(p, 0.1, 0.6)), b === 2 ? lerp(0.3, 0.75, span(p, 0.2, 0.7)) : b > 2 ? 0.75 : 0.5];
        if (b === 4) v = [lerp(0.8, 0.9, span(p, 0.1, 0.6)), lerp(0.7, 0.88, span(p, 0.1, 0.6)), v[2], lerp(0.75, 0.9, span(p, 0.1, 0.6))];
      } else if (si === 7) v = [0.85, 0.8, 0.8, 0.8];
      else {
        v = [b >= 1 ? 0.6 : 0.5, b >= 2 ? 0.3 : 0.5, b >= 3 ? 0.25 : 0.5, b >= 3 ? 0.6 : 0.5];
        hot[2] = b >= 3;
      }
      ['mFreq', 'mLead', 'mFail', 'mRec'].forEach((k, i) => { M[k] = dial(i, v[i], hot[i], show[i]); });
    }
    Object.assign(L, M);
    if (si === 8) {
      const red = [2, 6];
      let s = '';
      for (let i = 0; i < 8; i++) s += op(at(b, p, 1, 0.05 + i * 0.06, 0.12 + i * 0.06), rect(A.u0 + 4 + i * 17, A.v1 - 18, 12, 12, b >= 3 && red.includes(i) ? 'pm-red' : 'pm-note', 1));
      L.bDeploys = s;
    } else L.bDeploys = '';
    return L;
  }
  const LAYERS = ['bWall', 'bGit', 'bBatch', 'bTime', 'mFreq', 'mLead', 'mFail', 'mRec', 'bDeploys'];

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    for (const c of C.CUES) set(E[`p_${c}`], o[c] || '');
    const L = board(si, b, p);
    for (const k of LAYERS) set(E[k], L[k] || '');
    const s = belt(si, b, p);
    move(E.parcel, `translate(${f1((s.x - C.PX0) * C.PV[0])} ${f1((s.x - C.PX0) * C.PV[1])})`);
    attr(E.parcel, 'style', s.show >= 0.999 ? '' : `opacity:${s.show.toFixed(2)}`);
    if (s.bad) attr(E.parcel, 'data-bad', '1'); else E.parcel.removeAttribute('data-bad');
    s.lamps.forEach((st, i) => set(E[`lamp${i}`], `<path class="${LAMP[st]}" d="${C.LAMPS[i]}"/>`));
  }

  return { render };
})();
