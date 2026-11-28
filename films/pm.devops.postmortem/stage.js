// The stage of the film "De post-mortem / The post-mortem": a pure function of
// (scene, u). Inlined into the page after the anatomy kit and a preamble from
// build.mjs that defines C (the panel's blocks, the board's drawing area, the
// lamps' outlines and keys, the example's minutes), CAM (one camera move per
// scene), W and H. Moves are placed per Dutch caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step.
//
// The room is the incident film's IT side of a plant: the MES rack at the
// back, the link on the floor to the line (two scanners over the belt) at the
// front, the service desk at the left. Three lamps (rack, two scanners) idle
// green, run (accent), or fail (red); the link turns red and dashed while it
// is down. The whiteboard carries shapes only, each layer its own cue group:
// the post-mortem document (s1), a row of buttons (s2), a timeline (s3, and the
// example's morning in s6), the chain of whys (s3, s6, s7), the workaround's
// detour and the known error's pinned card (s4), outage bars with a threshold
// (s5) and the list of actions (s5, s7). The panel at the right gets one card
// per scene, each block in its own cue group (o[key] goes into data-k
// "p_<key>"), all text at 22 units (a video film); a card that needs more room
// turns a page within its scene.
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
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const txt = (x, y, t, cls = 'pm-txt', anchor = 'start') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="22" text-anchor="${anchor}">${esc(t)}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const circ = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
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
  // a time in bold and what happened beside it
  const row = (y, t, what, cls = 'pm-txt') => txt(X0, y, t, 'pm-big') + txt(X0 + 76, y, what, cls);
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
  // s1: the post-mortem and its document; Google's book
  function s1(b, p) {
    const o = { head: ['post-mortem', DIA] };
    const A = page(b, p, 0, 2);
    o.pm = op(A, box(54, 'post-mortem', [tr('bespreking na een', 'a discussion after'), tr('grote storing', 'a major outage'), [tr('ook: incidentreview', 'also: incident review'), 'pm-mute'],
      [tr('wat, waarom, en wat', 'what, why, and what'), 'pm-on'], [tr('verandert er?', 'changes?'), 'pm-on']], b === 0));
    if (b >= 1) o.doc = op(A * at(b, p, 1), box(240, tr('kort document', 'a short document'), [tr('tijdlijn', 'timeline'), tr('oorzaken', 'causes'), tr('acties met eigenaar', 'actions with owner')], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.sre = op(B, box(54, 'Google', ['Site Reliability', 'Engineering', [tr('boek uit 2016', 'book from 2016'), 'pm-mute'], [tr('hoofdstuk over', 'a chapter on'), 'pm-mute'], [tr('postmortemcultuur', 'postmortem culture'), 'pm-mute']], true));
    return o;
  }

  // s2: blameless and the wrong button; accountability and the slip
  function s2(b, p) {
    const o = { head: [tr('schuldvrij', 'blameless'), DIA] };
    const A = page(b, p, 0, 2);
    o.blame = op(A, box(54, tr('schuldvrij', 'blameless'), [tr('wat in het systeem', 'what in the system'), tr('maakte het mogelijk?', 'made it possible?'), [tr('niet: wie?', 'not: who?'), 'pm-badt']], b === 0));
    if (b >= 1) o.button = op(A * at(b, p, 1), box(190, tr('de verkeerde knop', 'the wrong button'), [tr('de knop zat daar', 'it was there'), tr('procedure onduidelijk', 'procedure unclear'), tr('het was druk', 'it was busy')], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.acct = op(B, box(54, tr('wel verantwoordelijk', 'still accountable'), [tr('bewust regels', 'deliberately'), tr('overtreden?', 'breaking rules?'), [tr('daarop aangesproken', 'held to account'), 'pm-badt']], b === 2));
    if (b >= 3) o.slip = op(at(b, p, 3), box(206, tr('gewone vergissing', 'an ordinary slip'), [[tr('is informatie', 'is information'), 'pm-on'], [tr('geen schuld', 'not guilt'), 'pm-mute']], true));
    return o;
  }

  // s3: the timeline; the 5 whys, Ohno, several causes
  function s3(b, p) {
    const o = { head: [tr('oorzaken', 'causes'), DIA] };
    const A = page(b, p, 0, 1);
    o.tl = op(A, box(54, tr('tijdlijn', 'timeline'), [[tr('de ruggengraat', 'the backbone'), 'pm-mute'], tr('minuut voor minuut:', 'minute by minute:'), tr('wat er gebeurde', 'what happened'), tr('wat men zag', 'what people saw'), tr('wat men deed', 'what they did')], b === 0));
    const B = page(b, p, 1, -1);
    if (b >= 1) o.why = op(B, box(54, tr('5 keer waarom', 'the 5 Whys'), [tr('steeds: waarom?', 'asking: why? again'), tr('tot je iets kunt', 'until you reach'), tr('veranderen', 'something to change')], b === 1));
    if (b >= 2) o.ohno = op(at(b, p, 2), lines(206, [['Taiichi Ohno', 'pm-big'], [tr('maakte het bekend', 'made it known'), 'pm-mute'], [tr('bij Toyota', 'at Toyota'), 'pm-mute']]));
    if (b >= 3) o.many = op(at(b, p, 3), box(280, tr('pas op', 'careful'), [tr('meerdere oorzaken,', 'several causes,'), [tr('niet één wortel', 'not one root'), 'pm-badt']], true));
    return o;
  }

  // s4: the workaround and its example; the known error, recorded
  function s4(b, p) {
    const o = { head: [tr('ITIL-woorden', 'ITIL words'), DIA] };
    const A = page(b, p, 0, 2);
    o.wa = op(A, box(54, 'workaround', [tr('tijdelijk verder', 'keep working for'), tr('werken, oorzaak nog', 'now, the cause not'), tr('niet opgelost', 'yet solved')], b === 0));
    if (b >= 1) o.waEx = op(A * at(b, p, 1), box(196, tr('bijvoorbeeld', 'for example'), [tr('koppeling elke', 'restart the link'), tr('ochtend handmatig', 'by hand every'), tr('herstarten', 'morning')], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.ke = op(B, box(54, tr('bekende fout', 'known error'), NL ? ['oorzaak bekend,', 'nog niet opgelost', ['known error', 'pm-mute']] : ['cause known,', 'not yet solved'], b === 2));
    if (b >= 3) o.keRec = op(at(b, p, 3), box(204, tr('vastleggen', 'record it'), [tr('met de workaround', 'with the workaround'), tr('servicedesk weet', 'the service desk'), tr('meteen wat te doen', 'knows what to do')], true));
    return o;
  }

  // s5: how many, the threshold; the follow-up and the sharp question
  function s5(b, p) {
    const o = { head: [tr('opvolging', 'follow-up'), DIA] };
    const A = page(b, p, 0, 2);
    o.debate = op(A, box(54, tr('hoeveel?', 'how many?'), [[tr('na elke storing:', 'every outage:'), 'pm-mute'], tr('te veel tijd', 'too much time'), [tr('alleen de grootste:', 'only the biggest:'), 'pm-mute'], tr('patronen gemist', 'patterns missed')], b === 0));
    if (b >= 1) o.thr = op(A * at(b, p, 1), box(216, tr('drempel', 'threshold'), [tr('prioriteit 1, of', 'priority 1, or'), tr('lijn langer dan', 'a line stopped'), tr('een uur stil', 'over an hour')], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.weak = op(B, box(54, tr('zwakste punt', 'weakest point'), [tr('de opvolging:', 'the follow-up:'), [tr('acties zonder', 'actions without'), 'pm-badt'], [tr('eigenaar en datum', 'owner and date'), 'pm-badt']], b === 2));
    if (b >= 3) o.ask = op(at(b, p, 3), lines(214, [[tr('scherpe vraag:', 'sharp question:'), 'pm-mute'], [tr('welke acties uit de', 'which actions from'), ''], [tr('vorige post-mortem', 'the last post-mortem'), ''], [tr('zijn af?', 'are done?'), 'pm-on']]));
    return o;
  }

  // s6: the soft-drinks maker's morning, two whys, the question
  function s6(b, p) {
    const o = { head: [tr('certificaat', 'certificate'), EX] };
    const A = page(b, p, 0, 3);
    o.ex = op(A, lines(80, [[tr('frisdrankfabrikant', 'soft-drinks maker'), b === 0 ? 'pm-on' : 'pm-big'], [tr('MES 3 uur stil,', 'MES down 3 hours,'), 'pm-mute'], [tr('zaterdagochtend', 'Saturday morning'), 'pm-mute']]));
    if (b >= 1) {
      o.t1 = op(A * at(b, p, 1), row(170, '05:50', tr('update', 'renewal')) + txt(X0, 196, tr('servercertificaat', 'server certificate'), 'pm-mute')
        + op(at(b, p, 1, 0.5, 0.7), row(232, '06:00', tr('geen login', 'no log-in'), 'pm-badt') + txt(X0, 258, tr('ochtendploeg', 'morning shift'), 'pm-mute')));
    }
    if (b >= 2) {
      o.t2 = op(A * at(b, p, 2), row(298, '06:20', tr('storingsdienst', 'on-call phoned'))
        + op(at(b, p, 2, 0.3, 0.45), row(324, '07:40', tr('oorzaak gevonden', 'cause found'))) + op(at(b, p, 2, 0.6, 0.75), row(350, '09:00', tr('werkt weer', 'works again'), 'pm-on')));
    }
    const B = page(b, p, 3, 5);
    if (b >= 3) o.w1 = op(B, box(54, tr('waarom 1', 'why 1'), [tr('waarom geen login?', 'why no log-in?'), [tr('scanners herkennen', 'the scanners reject'), 'pm-on'], [tr('nieuw certificaat niet', 'the new certificate'), 'pm-on']], b === 3));
    if (b >= 4) o.w2 = op(B * at(b, p, 4), box(196, tr('waarom 2', 'why 2'), [tr('waarom niet herkend?', 'why not recognised?'), [tr('oude lijst van', 'an old list of'), 'pm-on'], [tr('vertrouwde', 'trusted'), 'pm-on'], [tr('certificaten', 'certificates'), 'pm-on']], b === 4));
    const Q = page(b, p, 5, -1);
    if (b >= 5) o.q = op(Q, box(54, tr('jouw beurt', 'your turn'), [tr('waarom 3 en 4', 'why 3 and 4'), tr('een workaround', 'a workaround'), tr('twee acties', 'two actions'), tr('met een eigenaar', 'with an owner')], true)
      + lines(236, [[tr('denk even na', 'think for a moment'), 'pm-mute']]));
    return o;
  }

  // s7: the answer: two more whys, the workaround, two actions, no culprit
  function s7(b, p) {
    const o = { head: [tr('het antwoord', 'the answer'), EX] };
    const A = page(b, p, 0, 2);
    o.w3 = op(A, box(54, tr('waarom 3', 'why 3'), [tr('waarom lijst oud?', 'why an old list?'), [tr('scanners vallen', 'the scanners fall'), 'pm-on'], [tr('onder OT, nooit in', 'under OT, never in'), 'pm-on'], [tr('de IT-updates', 'the IT updates'), 'pm-on']], b === 0));
    if (b >= 1) o.w4 = op(A * at(b, p, 1), box(222, tr('waarom 4', 'why 4'), [tr('geen overzicht van', 'no overview of'), tr('afhankelijkheden;', 'dependencies;'), [tr('IT, OT plannen apart', 'IT, OT plan apart'), 'pm-on']], b === 1));
    const B = page(b, p, 2, 4);
    if (b >= 2) o.wa2 = op(B, box(54, 'workaround', [tr('certificaat wisselen?', 'changing the cert?'), tr('eerst de lijst op de', 'first update the'), tr('scanners bijwerken', 'list on the scanners')], b === 2));
    if (b >= 3) o.act = op(B * at(b, p, 3), box(196, tr('twee acties', 'two actions'), [[tr('OT-beheerder:', 'OT administrator:'), 'pm-on'], tr('overzicht, 1 maand', 'overview, 1 month'), [tr('IT-manager: OT in', 'IT manager: OT in'), 'pm-on'], tr('wijzigingsoverleg', 'the change meeting')], b === 3));
    const N = page(b, p, 4, -1);
    if (b >= 4) o.nob = op(N, box(54, tr('geen schuldige', 'no culprit'), [tr('de beheerder van', 'the administrator'), tr('05:50 volgde de', 'at 05:50 followed'), tr('procedure', 'the procedure')], true));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7];

  // ---------------------------------------------------------------- the room
  // Lamp states: 0 idle, 1 running (accent), 2 working (green), 3 down (red);
  // in the order of C.LAMPK: rack (MES), scanner 1, scanner 2.
  const LAMP = ['pm-lamp', 'pm-run', 'pm-ok', 'pm-bad'];
  function room(si, b, p) {
    const s = { lamps: [2, 2, 2], linkBad: false };
    const L = s.lamps;
    const scan = (st) => { L[1] = st; L[2] = st; };
    if (si === 1) {
      if (b === 1 && p > 0.3 && p < 0.75) L[0] = 3;
    } else if (si === 3) {
      if (b === 1) { if (p < 0.45) { scan(3); s.linkBad = true; } else if (p < 0.6) L[0] = 1; }
    } else if (si === 5) {
      if (b === 1) { if (p > 0.1 && p < 0.5) L[0] = 1; if (p > 0.55) { scan(3); s.linkBad = true; } } else if (b === 2) { if (p < 0.65) { scan(3); s.linkBad = true; } } else if (b === 3 && p > 0.3 && p < 0.8) scan(3);
    } else if (si === 6) {
      if (b === 2) { if (p > 0.15 && p < 0.45) scan(1); }
    }
    return s;
  }

  // ---------------------------------------------------------------- the board
  // Face units (u to the right, v down); A: C.AREA.
  const A = C.AREA;
  const AW = A.u1 - A.u0;
  const AH = A.v1 - A.v0;
  const TOP = A.v0 + 2;
  // the chain of whys: n boxes in a staircase, the last one the cause you can change
  const whyBox = (i, n) => {
    const bw = 22;
    const step = (AW - 40 - bw) / Math.max(1, n - 1);
    return { u: A.u0 + 6 + i * step, v: TOP + 4 + i * ((AH - 34) / Math.max(1, n - 1)), w: bw, h: 10 };
  };
  const chain = (n, shown, last) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = clamp(shown - i, 0, 1);
      if (a <= 0) continue;
      const q = whyBox(i, n);
      let part = rect(q.u, q.v, q.w, q.h, i === n - 1 && last ? 'pm-note2' : 'pm-note', 1.5);
      if (i > 0) { const r = whyBox(i - 1, n); part += path(`M${f1(r.u + r.w / 2)} ${f1(r.v + r.h)}V${f1(q.v + q.h / 2)}H${f1(q.u)}`, 'pm-loop'); }
      s += op(a, part);
    }
    return s;
  };
  // the example's morning: 05:30 at the left to 09:30 at the right
  const tU = (min) => A.u0 + 6 + ((min - 330) / 240) * (AW - 12);
  function board(si, b, p) {
    const L = {};
    const mid = (A.u0 + A.u1) / 2;
    // s1: the post-mortem document (timeline, causes, actions with an owner) and Google's book
    if (si === 0) {
      const u0 = mid - 18;
      let s = op(at(b, p, 0, 0.1, 0.4), rect(u0, TOP, 52, AH - 4, 'pm-note', 2));
      const f = b < 1 ? 0 : at(b, p, 1, 0.1, 0.8) * 3;
      s += op(clamp(f, 0, 1), path(`M${f1(u0 + 6)} ${f1(TOP + 12)}h40`, 'pm-loop') + [0, 1, 2, 3].map((i) => circ(u0 + 8 + i * 12, TOP + 12, 1.8, 'pm-blk')).join(''));
      s += op(clamp(f - 1, 0, 1), [0, 1, 2].map((i) => rect(u0 + 6 + i * 14, TOP + 24, 11, 9, 'pm-loop', 1)).join(''));
      s += op(clamp(f - 2, 0, 1), [0, 1].map((i) => path(`M${f1(u0 + 6)} ${f1(TOP + 46 + i * 12)}h28`, 'pm-loop') + circ(u0 + 42, TOP + 46 + i * 12, 3, 'pm-blk')).join(''));
      s += op(at(b, p, 2, 0.1, 0.4), rect(A.u0 + 4, TOP + 6, 26, AH - 16, 'pm-note', 1.5) + path(`M${f1(A.u0 + 9)} ${f1(TOP + 6)}V${f1(A.v1 - 10)}`, 'pm-loop')
        + rect(A.u0 + 12, TOP + 16, 14, 4, 'pm-note2', 1));
      L.bDoc = s;
    }
    // s2: a row of three buttons; the middle one pressed by mistake, then a ring: information
    if (si === 1) {
      const v = TOP + 26;
      let s = rect(mid - 52, v - 16, 104, 34, 'pm-note', 3);
      [-30, 0, 30].forEach((d, i) => { s += circ(mid + d, v, 8, i === 1 && b >= 1 && at(b, p, 1, 0.25, 0.3) > 0.5 ? 'pm-red' : 'pm-blk'); });
      if (b === 1) s += op(span(p, 0.05, 0.25), path(`M${f1(mid + 8)} ${f1(v + 44)}l-6 -26m0 0l-5 7m5 -7l7 5`, 'pm-loop'));
      if (b >= 3) s += op(at(b, p, 3, 0.2, 0.5), circ(mid, v, 13, 'pm-acc'));
      L.bKnob = s;
    }
    // s3 b1: a timeline, events appearing minute by minute
    if (si === 2 && b === 0) {
      const v = (A.v0 + A.v1) / 2;
      let s = path(`M${f1(A.u0 + 4)} ${f1(v)}H${f1(A.u1 - 4)}`, 'pm-loop');
      const n = Math.round(6 * span(p, 0.1, 0.8));
      for (let i = 0; i < n; i++) { const u = A.u0 + 14 + i * ((AW - 28) / 5); s += path(`M${f1(u)} ${f1(v)}V${f1(v - 14 - (i % 2) * 10)}`, 'pm-loop') + circ(u, v - 14 - (i % 2) * 10, 3, 'pm-blk'); }
      L.bTl = s;
    }
    // s3 b2 to b4: five whys in a staircase; then two more causes beside it
    if (si === 2 && b >= 1) {
      let s = chain(5, b === 1 ? span(p, 0.1, 0.8) * 5 : 5, true);
      if (b >= 3) {
        // two more contributing causes, branching from the second why to the top right
        const q = whyBox(1, 5);
        const y = q.v + q.h / 2;
        const ux = A.u1 - 40;
        s += op(at(b, p, 3, 0.2, 0.6), path(`M${f1(q.u + q.w)} ${f1(y)}H${f1(ux)}M${f1(ux)} ${f1(TOP + 9)}V${f1(y + 5)}M${f1(ux)} ${f1(TOP + 9)}H${f1(ux + 6)}M${f1(ux)} ${f1(y + 5)}H${f1(ux + 6)}`, 'pm-loop')
          + rect(ux + 6, TOP + 4, 22, 10, 'pm-note2', 1.5) + rect(ux + 6, y, 22, 10, 'pm-note2', 1.5));
      }
      L.bWhy = s;
    }
    // s4: a path blocked by the cause, the workaround's detour around it, done every morning
    if (si === 3) {
      const v = TOP + 30;
      let s = op(b < 2 ? 1 : b === 2 ? 1 - span(p, 0, 0.15) : 0, path(`M${f1(A.u0 + 6)} ${f1(v)}H${f1(A.u1 - 8)}m-6 -5l6 5l-6 5`, 'pm-loop') + rect(mid - 9, v - 9, 18, 18, 'pm-red', 2)
        + op(at(b, p, 0, 0.3, 0.7), path(`M${f1(mid - 30)} ${f1(v)}C${f1(mid - 26)} ${f1(v - 30)} ${f1(mid + 26)} ${f1(v - 30)} ${f1(mid + 30)} ${f1(v)}`, 'pm-acc')));
      if (b === 1) s += op(span(p, 0.2, 0.5), path(`M${f1(mid + 9)} ${f1(v + 30)}a9 9 0 1 1 -3 -6.7m3 6.7l1 -6m-1 6l-6 -1`, 'pm-loop'));
      L.bWa = s;
      // the known error: a card pinned to the board, the detour drawn on it
      if (b >= 2) {
        const u0 = mid - 25;
        let k2 = op(at(b, p, 2, 0.1, 0.4), rect(u0, TOP + 4, 50, AH - 12, 'pm-note', 2) + circ(u0 + 25, TOP + 6, 2.6, 'pm-red')
          + [0, 1, 2].map((i) => path(`M${f1(u0 + 8)} ${f1(TOP + 18 + i * 10)}h34`, 'pm-loop')).join(''));
        k2 += op(at(b, p, 3, 0.1, 0.4), path(`M${f1(u0 + 8)} ${f1(TOP + 60)}C${f1(u0 + 12)} ${f1(TOP + 46)} ${f1(u0 + 38)} ${f1(TOP + 46)} ${f1(u0 + 42)} ${f1(TOP + 60)}`, 'pm-acc')
          + path(`M${f1(u0 - 4)} ${f1(TOP + 40)}H${f1(A.u0 + 10)}m6 -5l-6 5l6 5`, 'pm-loop'));
        L.bKe = k2;
      }
    }
    // s5: outages as bars of their length; a threshold line, the ones above it in accent; then the actions
    if (si === 4 && b <= 1) {
      const hs = [10, 28, 8, 46, 14, 20, 60, 12, 34];
      const base = A.v1 - 4;
      const thr = 30;
      const n = Math.round(hs.length * span(b === 0 ? p : 1, 0.05, 0.6));
      let s = path(`M${f1(A.u0 + 4)} ${f1(base)}H${f1(A.u1 - 4)}`, 'pm-loop');
      for (let i = 0; i < n; i++) s += rect(A.u0 + 10 + i * ((AW - 24) / hs.length), base - hs[i], 9, hs[i], b === 1 && hs[i] > thr && span(p, 0.35, 0.4) > 0 ? 'pm-note2' : 'pm-note', 1);
      if (b === 1) s += op(span(p, 0.05, 0.3), path(`M${f1(A.u0 + 4)} ${f1(base - thr)}H${f1(A.u1 - 4)}`, 'pm-bdash'));
      L.bBars = s;
    }
    // the actions: rows of a task, an owner and a date; in s5 without owner or date,
    // in s7 the two actions with both
    if ((si === 4 && b >= 2) || (si === 6 && b >= 3)) {
      const done = si === 6;
      let s = '';
      const rows = done ? 2 : 3;
      for (let i = 0; i < rows; i++) {
        const v = TOP + 12 + i * 22;
        const a = done ? at(b, p, 3, 0.15 + i * 0.3, 0.35 + i * 0.3) : at(b, p, 2, 0.1 + i * 0.15, 0.3 + i * 0.15);
        s += op(a, path(`M${f1(A.u0 + 10)} ${f1(v)}h70`, 'pm-loop')
          + (done ? circ(A.u0 + 96, v, 5, 'pm-note2') + rect(A.u0 + 110, v - 6, 16, 12, 'pm-note2', 1.5) : circ(A.u0 + 96, v, 5, 'pm-redp') + rect(A.u0 + 110, v - 6, 16, 12, 'pm-redp', 1.5)));
      }
      L.bActs = s;
    }
    // s6: the example's morning; then the first two whys
    if (si === 5) {
      const T = C.T;
      const v = TOP + 16;
      if (b <= 2) {
        let s = path(`M${f1(A.u0 + 4)} ${f1(v)}H${f1(A.u1 - 4)}`, 'pm-loop');
        for (let h = 6; h <= 9; h++) s += path(`M${f1(tU(h * 60))} ${f1(v - 3)}v6`, 'pm-loop');
        const ev = (min, a, cls = 'pm-blk') => op(a, circ(tU(min), v, 3.2, cls));
        s += ev(T.cert, at(b, p, 1, 0.05, 0.2), 'pm-note2');
        const down = b < 1 ? 0 : b === 1 ? span(p, 0.55, 0.7) * 0.2 : lerp(0.2, 1, span(p, 0.05, 0.75));
        s += op(b >= 1 ? at(b, p, 1, 0.55, 0.6) : 0, rect(tU(T.down), v + 8, (tU(T.up) - tU(T.down)) * down, 8, 'pm-red', 1.5));
        s += ev(T.down, at(b, p, 1, 0.55, 0.7), 'pm-red') + ev(T.call, at(b, p, 2, 0.05, 0.2)) + ev(T.found, at(b, p, 2, 0.3, 0.45)) + ev(T.up, at(b, p, 2, 0.6, 0.75), 'pm-grn');
        L.bTl = s;
      } else {
        L.bWhy = chain(4, b === 3 ? span(p, 0.1, 0.4) : b === 4 ? 1 + span(p, 0.1, 0.4) : 2, false);
      }
    }
    // s7: why 3 and 4 complete the chain, the last one a cause you can change
    if (si === 6 && b <= 1) L.bWhy = chain(4, b === 0 ? 2 + span(p, 0.1, 0.4) : 3 + span(p, 0.1, 0.4), b === 1 && span(p, 0.1, 0.4) >= 1);
    // s7, the workaround beat: the workaround on the scanners: the detour around the cause, done at every certificate change
    if (si === 6 && b === 2) {
      const v = TOP + 30;
      L.bWa = path(`M${f1(A.u0 + 6)} ${f1(v)}H${f1(A.u1 - 8)}m-6 -5l6 5l-6 5`, 'pm-loop') + rect(mid - 9, v - 9, 18, 18, 'pm-red', 2)
        + op(span(p, 0.15, 0.5), path(`M${f1(mid - 30)} ${f1(v)}C${f1(mid - 26)} ${f1(v - 30)} ${f1(mid + 26)} ${f1(v - 30)} ${f1(mid + 30)} ${f1(v)}`, 'pm-acc'));
    }
    return L;
  }
  const LAYERS = ['bDoc', 'bKnob', 'bTl', 'bWhy', 'bWa', 'bKe', 'bBars', 'bActs'];

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    for (const c of C.CUES) set(E[`p_${c}`], o[c] || '');
    const L = board(si, b, p);
    for (const k of LAYERS) set(E[k], L[k] || '');
    const s = room(si, b, p);
    s.lamps.forEach((st, i) => set(E[C.LAMPK[i]], `<path class="${LAMP[st]}" d="${C.LAMPS[i]}"/>`));
    if (s.linkBad) E.linkp.setAttribute('data-bad', '1'); else E.linkp.removeAttribute('data-bad');
  }

  return { render };
})();
