// The stage of the film "Invoering en datamigratie / Rollout and data
// migration": a pure function of (scene, u). Inlined into the page after the
// anatomy kit and a preamble from build.mjs that defines C (the panel's blocks,
// the strip's parts and geometry, the board's note grid), CAM (one camera move
// per scene), W and H. Moves are placed per Dutch caption beat (beatStarts), so
// the video's narration timing (films/_kit/beatwarp.js) keeps them in step. The
// panel at the top right gets one card per scene, each block in its own cue
// group (o[key] goes into data-k "p_<key>"), all text at 22 units (a video
// film); a card that needs more room turns a page within its scene. The strip
// along the bottom: the systems and SAP Activate's phases, the go-live line,
// three plants as lanes switching to the new system, the months of the year,
// then what moves (master data, open items, history), extract, transform and
// load, the mock migrations, the reconciliation and the 12,480 articles. The
// board in the room gets its notes: the plants' volume (A 4, B 7, C 9 notes,
// old or live), then records: master data, open items, history, rejected.
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
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = 340;
  const X1 = 620;
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
  // s1: the ERP; the MES; SAP Activate's phases; other names, the same order
  function s1(b, p) {
    const o = { head: ['ERP en MES', DIA] };
    if (!NL) o.head[0] = 'ERP and MES';
    const A = page(b, p, 0, 2);
    o.erp = op(A, box(54, tr('ERP, zoals SAP', 'ERP, such as SAP'), [tr('orders, inkoop,', 'orders, purchasing,'), tr('voorraad, kosten', 'stock, costs')], b === 0));
    if (b >= 1) o.mes = op(A * at(b, p, 1), box(162, tr('MES, op de vloer', 'MES, on the floor'), [tr('orders per lijn,', 'orders per line,'), [tr('gemaakt, verbruikt,', 'made, used,'), 'pm-mute'], [tr('afgekeurd', 'scrapped'), 'pm-mute']], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.phases = op(B, box(50, 'SAP Activate', [tr('1 voorbereiden', '1 get ready'), tr('2 standaard ↔ proces', '2 standard vs. process'), tr('3 bouwen en testen', '3 build and test'), tr('4 omschakelen', '4 switch over'), tr('5 draaiend houden', '5 keep it running')], b === 2));
    if (b >= 3) o.names = op(B * at(b, p, 3), lines(250, [[tr('andere namen,', 'other names,'), 'pm-big'], [tr('zelfde volgorde', 'the same order'), 'pm-on']]));
    return o;
  }
  // s2: go-live; the legacy system; big bang; its upside and downside
  function s2(b, p) {
    const o = { head: ['go-live', DIA] };
    const A = page(b, p, 0, 2);
    o.golive = op(A, box(54, 'go-live', [tr('nieuw systeem officieel', 'new system is official'), [tr('nieuw werk alleen daar', 'new work only there'), 'pm-on']], b === 0));
    if (b >= 1) o.legacy = op(A * at(b, p, 1), lines(182, [[tr('legacysysteem: het oude,', 'legacy system, the old'), 'pm-big'], [tr('niet voor nieuw werk', 'one: not for new work'), ''], [tr('→ kies de datum', '→ choose the date'), 'pm-on'], [tr('   zorgvuldig', '   carefully'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.bang = op(B, box(54, 'big bang', [tr('alle vestigingen en', 'all sites and'), tr('afdelingen, één dag', 'departments, one day')], b === 2));
    if (b >= 3) o.bangpm = op(B * at(b, p, 3), lines(180, [[tr('+ één omschakeling', '+ one switchover'), 'pm-big'], [tr('+ geen tijdelijke koppeling', '+ no temporary links'), 'pm-big'], [tr('− alles tegelijk op het spel', '− all at risk at once'), 'pm-on']]));
    return o;
  }
  // s3: phased rollout; the pilot; MES per line, ERP per site; the price
  function s3(b, p) {
    const o = { head: [tr('gefaseerd', 'phased'), DIA] };
    const A = page(b, p, 0, 2);
    o.phased = op(A, box(54, tr('gefaseerde invoering', 'phased rollout'), [tr('per vestiging, per lijn', 'per site, per line'), tr('of per module', 'or per module')], b === 0));
    if (b >= 1) o.pilot = op(A * at(b, p, 1), box(166, 'pilot', [tr('één vestiging of lijn', 'one site or line'), tr('gaat voor: je leert', 'goes first: you learn'), tr('voordat de rest volgt', 'before the rest follows')], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.meserp = op(B, lines(70, [['MES', 'pm-big'], [tr('per lijn of per fabriek', 'per line or per plant'), ''], ['ERP', 'pm-big'], [tr('financiën en voorraad:', 'finance and stock:'), ''], [tr('hele vestiging tegelijk', 'a whole site at once'), '']]));
    if (b >= 3) o.price = op(B * at(b, p, 3), box(196, tr('de prijs', 'the price'), [tr('tijdelijke koppelingen', 'temporary interfaces'), tr('en een langer project', 'and a longer project')], b === 3));
    return o;
  }
  // s4: Hershey in 1999; CIO's figure; never in the peak; the question
  function s4(b, p) {
    const o = { head: ['timing', DIA] };
    const A = page(b, p, 0, 2);
    o.hershey = op(A, box(54, 'Hershey, 1999', [tr('nieuw ERP live, net toen', 'new ERP live just as'), tr('de Halloweenorders', 'the Halloween orders'), tr('binnenkwamen', 'came in')], b === 0));
    if (b >= 1) o.cio = op(A * at(b, p, 1), lines(194, [[tr('volgens het blad CIO:', 'CIO magazine says:'), 'pm-mute'], [tr('zo’n $ 100 miljoen aan', 'about $100 million of'), 'pm-big'], [tr('orders niet geleverd', 'orders not delivered'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.peak = op(B, box(54, tr('nooit live in je', 'never go live in'), [[tr('piekseizoen', 'your peak season'), 'pm-on']], b === 2));
    if (b >= 2) o.askt = op(B * at(b, p, 2, 0.35, 0.55), lines(160, [[tr('vraag:', 'ask:'), 'pm-mute'], [tr('wat is onze rustigste', 'what is our quietest'), 'pm-big'], [tr('maand, en staat de', 'month, and is go-live'), 'pm-big'], [tr('go-live daar gepland?', 'planned there?'), 'pm-big']]));
    return o;
  }
  // s5: the dairy group: three plants; option 1; option 2; the choice; C in September
  function s5(b, p) {
    const o = { head: [tr('drie fabrieken', 'three plants'), EX] };
    const A = page(b, p, 0, 2);
    o.dairy = op(A, lines(70, [[tr('zuivelgroep, nieuw MES', 'dairy group, new MES'), b === 0 ? 'pm-on' : 'pm-big'], ['A 20%   B 35%   C 45%', ''], [tr('piek: december,', 'peak: December,'), 'pm-mute'], [tr('de kerstdesserts', 'the Christmas desserts'), 'pm-mute']]));
    if (b >= 1) o.opt1 = op(A * at(b, p, 1), box(166, tr('optie 1: big bang', 'option 1: big bang'), [tr('één weekend in oktober', 'one weekend in October'), [tr('100% op het spel,', '100% at risk,'), 'pm-on'], [tr('twee maanden voor piek', 'two months before peak'), 'pm-mute']], b === 1));
    const B = page(b, p, 2, 3);
    if (b >= 2) o.opt2 = op(B, box(54, tr('optie 2: gefaseerd', 'option 2: phased'), [tr('A maart (pilot)', 'A March (pilot)'), tr('B juni, C september', 'B June, C September'), tr('koppeling: € 40.000', 'interface: €40,000'), tr('zes maanden langer', 'six months longer')], b === 2));
    const Cp = page(b, p, 3, -1);
    if (b >= 3) o.chosen = op(Cp, box(54, tr('gekozen: optie 2', 'chosen: option 2'), [[tr('pilot mis: 20% op spel,', 'pilot fails: 20% at risk,'), 'pm-on'], tr('niet 100%', 'not 100%'), [tr('lessen uit A → B en C', 'lessons from A → B and C'), 'pm-mute']], b === 3));
    if (b >= 4) o.settle = op(Cp * at(b, p, 4), lines(214, [[tr('C, de grootste: september', 'C, the biggest: September'), 'pm-big'], [tr('3 maanden tot december', '3 months to December'), 'pm-on']]));
    return o;
  }
  // s6: data migration; master data; open items; history
  function s6(b, p) {
    const o = { head: [tr('datamigratie', 'data migration'), DIA] };
    const A = page(b, p, 0, 3);
    o.dm = op(A, lines(66, [[tr('oud → nieuw systeem', 'old → new system'), b === 0 ? 'pm-on' : 'pm-big']]));
    if (b >= 1) o.master = op(A * at(b, p, 1), box(84, tr('stamdata', 'master data'), [tr('artikelen, stuklijsten,', 'articles, bills of materials,'), tr('routings, klanten,', 'routings, customers,'), tr('leveranciers', 'suppliers')], b === 1));
    if (b >= 2) o.open = op(A * at(b, p, 2), lines(220, [[tr('open posten op de go-live:', 'open items at go-live:'), 'pm-big'], [tr('open orders, voorraad,', 'open orders, stock,'), ''], [tr('onbetaalde facturen', 'unpaid invoices'), '']]));
    if (b >= 3) o.hist = op(page(b, p, 3, -1), box(54, tr('historie', 'history'), [tr('orders van vorige jaren', 'orders from past years'), tr('gaat meestal niet mee:', 'usually not migrated:'), [tr('leesbaar in oud of archief', 'readable in old or archive'), 'pm-on']], b === 3));
    return o;
  }
  // s7: data cleansing; the business owns it; extract, transform, load; the mock migration
  function s7(b, p) {
    const o = { head: [tr('opschonen', 'cleansing'), DIA] };
    o.clean = op(page(b, p, 0, 1), box(54, tr('data opschonen', 'data cleansing'), [tr('dubbelingen, ongebruikt,', 'duplicates, unused,'), tr('foute eenheden,', 'wrong units,'), tr('lege velden', 'empty fields'), [tr('rommel blijft rommel', 'rubbish in, rubbish out'), 'pm-mute']], b === 0));
    const B = page(b, p, 1, 2);
    if (b >= 1) o.biz = op(B, box(54, tr('werk voor de business', 'work for the business'), [tr('inkoop: leveranciers,', 'purchasing: suppliers,'), tr('engineering: stuklijsten', 'engineering: bills')], b === 1));
    if (b >= 1) o.biz2 = op(B * at(b, p, 1, 0.4, 0.6), lines(196, [[tr('IT ziet wat er mis is,', 'IT shows what is wrong,'), 'pm-mute'], [tr('niet welk artikel echt is', 'not which article is real'), 'pm-mute']]));
    if (b >= 2) o.etl = op(page(b, p, 2, 3), box(54, tr('drie stappen', 'three steps'), [tr('extract: uit oud halen', 'extract from the old'), tr('transform: omzetten', 'transform to the new'), tr('load: in nieuw laden', 'load into the new')], b === 2));
    if (b >= 3) o.mock = op(page(b, p, 3, -1), box(54, tr('proefmigratie', 'mock migration'), [tr('proefrun naar een', 'a trial run into a'), tr('testomgeving', 'test environment'), tr('steeds schoner, sneller', 'cleaner, faster each time'), [tr('laatste getimed:', 'the last one timed:'), 'pm-mute'], [tr('→ draaiboek go-live', '→ the go-live plan'), 'pm-on']], b === 3));
    return o;
  }
  // s8: reconciliation; the business signs; what goes wrong; the question
  function s8(b, p) {
    const o = { head: [tr('afstemming', 'reconciliation'), DIA] };
    o.recon = op(page(b, p, 0, 1), box(54, tr('afstemming', 'reconciliation'), [tr('oud en nieuw vergelijken,', 'compare old and new,'), tr('elk verschil verklaren', 'explain every difference'), [tr('uit? in? geweigerd?', 'out? in? rejected?'), 'pm-mute'], [tr('en waarom?', 'and why?'), 'pm-mute']], b === 0));
    if (b >= 1) o.sign = op(page(b, p, 1, 2), box(54, tr('wie tekent?', 'who signs off?'), [[tr('de business, niet IT', 'the business, not IT'), 'pm-on'], tr('controller: de €', 'controller: stock value'), tr('planner: open orders', 'planner: open orders')], b === 1)
      + lines(204, [[tr('klopt de voorraad in €?', 'stock value in €?'), 'pm-mute'], [tr('en per magazijn?', 'and per warehouse?'), 'pm-mute']]));
    const B = page(b, p, 2, 3);
    if (b >= 2) o.wrong = op(B, box(54, tr('wat vaak misgaat', 'often goes wrong'), [tr('migratie begint laat', 'migration starts late'), tr('opschonen pas bij proef 3', 'cleaning only at trial 3'), [tr('vuile data gaat live,', 'dirty data goes live,'), 'pm-on'], [tr('“om later op te lossen”', '“to be fixed later”'), 'pm-mute']], b === 2));
    if (b >= 3) o.askm = op(page(b, p, 3, -1), lines(80, [[tr('vraag, in elk overleg:', 'ask, at every meeting:'), 'pm-mute'], [tr('hoeveel records mislukten', 'how many records failed'), 'pm-big'], [tr('bij de laatste proef?', 'in the last trial?'), 'pm-big'], ['', ''], [tr('en wie is eigenaar', 'and who owns'), 'pm-on'], [tr('van het oplossen?', 'fixing them?'), 'pm-on']]));
    return o;
  }
  // s9: the metal parts maker: the 12,480; the load and the 79; the stock value; the action and target
  function s9(b, p) {
    const o = { head: [tr('proefmigratie 2', 'mock migration 2'), EX] };
    const A = page(b, p, 0, 2);
    o.metal = op(A, lines(70, [[tr('metaal, nieuw ERP', 'metal parts, new ERP'), b === 0 ? 'pm-on' : 'pm-big'], [tr('12.480 artikelen', '12,480 articles'), ''], [tr('2.530: vijf jaar niet', '2,530 unused for five'), 'pm-mute'], [tr('gebruikt → archief', 'years → the archive'), 'pm-mute'], [tr('mee: 9.950', 'to move: 9,950'), 'pm-big']]));
    if (b >= 1) o.load = op(A * at(b, p, 1), lines(206, [[tr('9.950 − 9.871 = 79', '9,950 − 9,871 = 79'), b === 1 ? 'pm-on' : 'pm-big'], [tr('52 zonder eenheid', '52 with no unit'), ''], [tr('27 tekeningnr. dubbel', '27 drawing no. exists'), '']]));
    const B = page(b, p, 2, 3);
    if (b >= 2) o.value = op(B, box(54, tr('voorraadwaarde', 'stock value'), [tr('oud    € 4.212.000', 'old    €4,212,000'), tr('nieuw  € 4.198.500', 'new    €4,198,500'), [tr('€ 13.500 = 0,32%', '€13,500 = 0.32%'), 'pm-on'], [tr('= voorraad van de 79', '= stock of the 79'), 'pm-mute']], b === 2));
    if (b >= 3) o.action = op(page(b, p, 3, -1), box(54, tr('actie', 'action'), [tr('engineering: 27 dubbel', 'engineering: 27 duplicates'), tr('inkoop: 52 eenheden', 'purchasing: 52 units'), [tr('datum: vóór proef 3', 'dated: before trial 3'), 'pm-mute'], [tr('doel: 0 geweigerd, € 0', 'target: 0 rejected, €0'), 'pm-on'], [tr('getekend: de controller', 'signed: the controller'), 'pm-on']], b === 3));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the strip
  const S = C.STRIP;
  // a row of labels laid out by their length (about 13 units a lower-case character at 22 units, bold; 16 a
  // capital), centred in the strip; sep: arrows between them, boxed: each in a box
  const wOf = (t) => [...t].reduce((a, ch) => a + (/[A-Z]/.test(ch) ? 16 : 13), 0);
  const row = (y, items, sep, boxed, cls = 'pm-blk') => {
    const gap = sep ? 46 : 14;
    const ws = items.map((t) => wOf(t) + (boxed ? 22 : 0));
    let x = 320 - (ws.reduce((a, v) => a + v, 0) + gap * (items.length - 1)) / 2;
    return items.map((t, i) => {
      const w = ws[i];
      let out = '';
      if (i > 0 && sep) out += path(`M${f1(x - 32)} ${y + 18}l18 0M${f1(x - 19)} ${y + 13}l5 5l-5 5`, 'pm-line');
      out += (boxed ? rect(x, y, w, 36, cls, 4) : '') + txt(x + w / 2, y + 26, t, 'pm-big', 'middle');
      x += w + gap;
      return out;
    }).join('');
  };
  const RA = S.ya;
  const RB = S.yb;
  // the three plants as lanes: the old system up to its go-live x, the new system after it
  const LANES = [['A', 0], ['B', 1], ['C', 2]];
  const lane = (i, gx, name, extra = '') => {
    const y = S.lane0 + i * S.laneH;
    return txt(30, y + 21, name, 'pm-big', 'middle') + rect(S.bar0, y, gx - S.bar0, S.laneH - 5, 'pm-blk', 3)
      + rect(gx, y, S.bar1 - gx, S.laneH - 5, 'pm-barpass', 3) + extra;
  };
  // the months: twelve cells, x of month m (0..11)
  const MON = 'JFMAMJJASOND';
  const mx = (m) => S.m0 + m * S.mw;
  const cell = (m) => rect(mx(m), RA, S.mw - 4, 34, 'pm-blk', 4) + txt(mx(m) + (S.mw - 4) / 2, RA + 25, MON[m], 'pm-big', 'middle');
  const months = () => [...MON].map((ch, m) => cell(m)).join('');
  // the peak: a dashed frame behind month m, the cell drawn again on top, so a lit frame never hides its letter
  const peak = (m) => rect(mx(m) - 3, RA - 4, S.mw + 2, 42, 'pm-over', 5) + cell(m);
  const mark = (m, label, cls = 'pm-on', anchor = 'middle') => path(`M${f1(mx(m) + (S.mw - 4) / 2)} ${RA + 38}l0 8`, 'pm-mark') + txt(mx(m) + (anchor === 'end' ? S.mw - 4 : (S.mw - 4) / 2), RB + 32, label, cls, anchor);
  function strip(si, b, p) {
    const L = {};
    if (si === 0) {
      // the order runs down from the ERP to the MES to the line; the MES from beat 1
      L.sSys = b < 1 ? row(RA, ['ERP'], false, true) : row(RA, ['ERP', 'MES', tr('lijn', 'line')], true, true);
      if (b >= 2) L.sPhase = op(at(b, p, 2, 0.1, 0.35), ['prepare', 'explore', 'realize', 'deploy', 'run'].map((t, i) => rect(16 + i * 122, RB - 4, 114, 40, 'pm-blk', 4) + txt(16 + i * 122 + 57, RB + 23, t, 'pm-big', 'middle')).join(''));
    }
    if (si === 1) {
      const goA = b < 2 ? 1 : b === 2 ? 1 - span(p, 0, 0.25) : 0;
      L.sGo = op(goA, rect(16, RA, 280, 36, 'pm-blk', 4) + txt(156, RA + 26, tr('legacysysteem', 'legacy system'), 'pm-big', 'middle')
        + path(`M320 ${RA - 2}l14 20l-14 20l-14 -20Z`, 'pm-over') + rect(344, RA, 272, 36, 'pm-barpass', 4) + txt(480, RA + 26, tr('nieuw systeem', 'new system'), 'pm-big', 'middle')
        + txt(320, RB + 30, 'go-live', 'pm-on', 'middle'));
      if (b >= 2) {
        const gx = 330;
        L.sLanes = op(at(b, p, 2, 0.2, 0.45), LANES.map(([n, i]) => lane(i, gx, n)).join('') + path(`M${gx} ${S.lane0 - 4}V${S.lane0 + 3 * S.laneH}`, 'pm-mark'));
      }
    }
    if (si === 2) {
      const gx = [190, 350, 510];
      L.sLanes = LANES.map(([n, i]) => lane(i, gx[i], n)).join('');
      if (b >= 1) L.sPilot = op(at(b, p, 1, 0.1, 0.35), path(`M${gx[0]} ${S.lane0 - 4}v${S.laneH}`, 'pm-mark') + txt(gx[0] + 10, S.lane0 + 21, 'pilot', 'pm-on'));
      if (b >= 3) L.sLink = op(at(b, p, 3, 0.1, 0.4), rect(gx[0], S.lane0 + S.laneH - 2, gx[2] - gx[0], 2 * S.laneH - 3, 'pm-over', 3));
    }
    if (si === 3) {
      L.sMonths = months();
      L.sPeak = op(at(b, p, 0, 0.3, 0.55), peak(9) + mark(9, tr('go-live bij Halloween', 'go-live at Halloween'), 'pm-on', 'end'));
    }
    if (si === 4) {
      L.sMonths = months();
      L.sPeak = peak(11) + txt(mx(11) + (S.mw - 4) / 2, RB + 32, tr('piek', 'peak'), 'pm-big', 'middle');
      const o1 = b < 1 ? 0 : b === 2 ? 1 - span(p, 0.02, 0.2) : b > 2 ? 0 : at(b, p, 1, 0.1, 0.35);
      L.sOpt1 = op(o1, mark(9, 'A+B+C'));
      if (b >= 2) L.sOpt2 = op(at(b, p, 2, 0.1, 0.35), mark(2, 'A') + mark(5, 'B') + mark(8, 'C', b === 4 ? 'pm-on' : 'pm-big'));
    }
    if (si === 5) {
      // the old system's box gives way to master data (beat 1) and open items (beat 2)
      const old = b === 0 ? 1 : b === 1 ? 1 - span(p, 0, 0.3) : 0;
      L.sKinds = op(old, rect(16, RA, 300, 36, 'pm-blk', 4) + txt(166, RA + 26, tr('oud systeem', 'old system'), 'pm-big', 'middle'))
        + path(`M440 ${RA + 18}l22 0M457 ${RA + 13}l5 5l-5 5`, 'pm-line') + rect(476, RA, 140, 36, 'pm-barpass', 4) + txt(546, RA + 26, tr('nieuw', 'new'), 'pm-big', 'middle')
        + (b >= 1 ? op(at(b, p, 1, 0.15, 0.4), rect(16, RA, 200, 36, 'pm-blk', 4) + txt(116, RA + 26, tr('stamdata', 'master data'), 'pm-big', 'middle')) : '');
      if (b >= 2) L.sOpen = op(at(b, p, 2, 0.1, 0.35), rect(226, RA, 200, 36, 'pm-blk', 4) + txt(326, RA + 26, tr('open posten', 'open items'), 'pm-big', 'middle'));
      if (b >= 3) L.sHist = op(at(b, p, 3, 0.1, 0.35), rect(16, RB, 200, 36, 'pm-grey', 4) + txt(116, RB + 26, tr('historie', 'history'), 'pm-big', 'middle')
        + path(`M232 ${RB + 18}l22 0M249 ${RB + 13}l5 5l-5 5`, 'pm-line') + rect(268, RB, 170, 36, 'pm-blk', 4) + txt(353, RB + 26, tr('archief', 'archive'), 'pm-big', 'middle'));
    }
    if (si === 6) {
      if (b <= 3) L.sClean = op(b < 3 ? 1 : 1 - span(p, 0, 0.25), row(RA, [tr('oud', 'old'), tr('opschonen', 'cleanse'), tr('nieuw', 'new')], true, true));
      if (b >= 2) L.sEtl = op(at(b, p, 2, 0.1, 0.35), row(RB, ['extract', 'transform', 'load'], true, true));
      if (b >= 3) {
        const ws = [180, 140, 100];
        let x = 16;
        let body = '';
        ws.forEach((w, i) => { body += rect(x, RA, w, 36, i === 2 ? 'pm-barpass' : 'pm-blk', 4) + txt(x + w / 2, RA + 26, tr(`proef ${i + 1}`, `mock ${i + 1}`), 'pm-big', 'middle'); x += w + 12; });
        body += txt(x + 6, RA + 26, tr('→ getimed', '→ timed'), 'pm-on');
        L.sMock = op(at(b, p, 3, 0.2, 0.45), body);
      }
    }
    if (si === 7) {
      if (b <= 2) L.sRecon = op(b < 2 ? 1 : 1 - span(p, 0, 0.25), row(RA, [tr('uit', 'out'), '=', tr('in', 'in'), '+', tr('geweigerd', 'rejected')], false, false));
      if (b === 1 || b === 2) L.sSign = op(b === 1 ? at(b, p, 1, 0.2, 0.45) : 1 - span(p, 0, 0.25), row(RB, [tr('controller: €', 'controller: €'), tr('planner: orders', 'planner: orders')], false, true));
      if (b >= 2) {
        const xs = [16, 166, 316, 466];
        let body = rect(xs[2] - 5, RB - 5, 144, 46, 'pm-over', 6);
        [tr('proef 1', 'mock 1'), tr('proef 2', 'mock 2'), tr('proef 3', 'mock 3'), 'go-live'].forEach((t, i) => { body += rect(xs[i], RB, 134, 36, i === 3 ? 'pm-barpass' : 'pm-blk', 4) + txt(xs[i] + 67, RB + 26, t, 'pm-big', 'middle'); });
        body += txt(xs[2] + 67, RA + 26, tr('pas nu opschonen', 'cleaning only now'), 'pm-on', 'middle');
        L.sLate = op(at(b, p, 2, 0.25, 0.5), body);
      }
    }
    if (si === 8) {
      const total = 12480;
      const bw = 600;
      const xa = 16 + (2530 / total) * bw;
      const split = at(b, p, 0, 0.35, 0.6);
      L.sCount = rect(16, RA, bw, 36, 'pm-blk', 4) + op(split, rect(16, RA, xa - 16, 36, 'pm-grey', 4) + txt(xa - 8, RA + 26, '2.530'.replace('.', NL ? '.' : ','), 'pm-big', 'end'))
        + op(1 - split, txt(316, RA + 26, tr('12.480 artikelen', '12,480 articles'), 'pm-big', 'middle')) + op(split, txt(xa + 12, RA + 26, tr('9.950 mee', '9,950 to move'), 'pm-big'));
      if (b === 1) {
        const xl = xa + (9871 / total) * bw;
        L.sLoaded = op(at(b, p, 1, 0.1, 0.35), rect(xa, RB, xl - xa, 36, 'pm-barpass', 4) + txt(xa + 12, RB + 26, tr('9.871 aangekomen', '9,871 arrived'), 'pm-big')
          + path(`M${f1(xl + 1.5)} ${RB - 4}v44`, 'pm-mark') + txt(xl - 8, RB + 26, tr('79 geweigerd', '79 rejected'), 'pm-on', 'end'));
      }
      if (b >= 2) L.sValue = op(at(b, p, 2, 0.1, 0.35), txt(320, RB + 26, tr('€ 4.212.000 − € 4.198.500 = € 13.500', '€4,212,000 − €4,198,500 = €13,500'), b === 2 ? 'pm-on' : 'pm-big', 'middle'));
    }
    return L;
  }

  // ---------------------------------------------------------------- the board's notes
  // C.NOTES: the grid on the board's face (u = x, v = -z): column c, row r
  const N = C.NOTES;
  const note = (c, r, cls) => { const u = N.u0 + c * N.du; const v = N.v0 + r * N.dv; return `<rect class="${cls}" x="${f1(u)}" y="${f1(v)}" width="${N.w}" height="${N.h}" rx=".6"/>`; };
  const col = (c, n, cls, from = 0) => { let s = ''; for (let r = from; r < n; r++) s += note(c, r, typeof cls === 'function' ? cls(r) : cls); return s; };
  // the plants: A 4, B 7, C 9 notes (20, 35, 45 % of the volume); live: which have switched
  const plants = (live, hot = [false, false, false]) => [4, 7, 9].map((n, c) => col(c, n, hot[c] ? 'pm-hotnote' : live[c] ? 'pm-pass' : 'pm-note')).join('');
  function notes(si, b, p) {
    if (si === 0 || si === 3) return '';
    if (si === 1) {
      if (b < 2) return '';
      const sw = b === 2 ? span(p, 0.5, 0.8) > 0.5 : true;
      return op(at(b, p, 2, 0.1, 0.4), plants([sw, sw, sw]));
    }
    if (si === 2) {
      const a = b >= 1 && (b > 1 || p > 0.4);
      const bc = b >= 2 && (b > 2 || p > 0.5);
      return plants([a, bc, bc]);
    }
    if (si === 4) {
      if (b === 1) return plants([false, false, false], [true, true, true]);
      if (b === 3) return plants([false, false, false], [true, false, false]);
      if (b === 4) return plants([true, true, p > 0.4]);
      return plants([false, false, false]);
    }
    // records: master data (columns 0, 1), open items (2), history (3)
    if (si === 5) {
      let s = op(at(b, p, 1, 0.1, 0.4), col(0, 7, 'pm-note') + col(1, 6, 'pm-note'));
      if (b >= 2) s += op(at(b, p, 2, 0.1, 0.4), col(2, 5, 'pm-def'));
      if (b >= 3) s += op(1 - span(p, 0.4, 0.8), col(3, 8, 'pm-grey'));
      else s += op(at(b, p, 0, 0.1, 0.4), col(3, 8, 'pm-grey'));
      return s;
    }
    if (si === 6) {
      // the duplicates and unused records (grey) go in beat 0
      const gone = b === 0 ? span(p, 0.4, 0.8) : 1;
      const live = b >= 2 && (b > 2 || p > 0.6);
      const base = (c, n) => col(c, n, live ? 'pm-pass' : 'pm-note');
      return base(0, 6) + base(1, 5) + col(2, 5, live ? 'pm-pass' : 'pm-def') + op(1 - gone, note(0, 6, 'pm-grey') + note(1, 5, 'pm-grey') + note(1, 6, 'pm-grey') + note(2, 5, 'pm-grey'));
    }
    if (si === 7) {
      const rej = (c) => (r) => ((c === 1 && r === 4) || (c === 2 && r === 2) ? 'pm-hotnote' : 'pm-pass');
      return col(0, 6, 'pm-pass') + col(1, 5, rej(1)) + col(2, 5, rej(2));
    }
    // s9: the rejected records hot until the action
    const fixed = b === 3 && p > 0.5;
    const rej = (c) => (r) => (!fixed && ((c === 0 && r === 5) || (c === 1 && r === 4) || (c === 3 && r === 1)) ? 'pm-hotnote' : 'pm-pass');
    return col(0, 6, rej(0)) + col(1, 5, rej(1)) + col(2, 5, 'pm-pass') + col(3, 3, rej(3)) + op(b === 0 ? 1 - span(p, 0.4, 0.8) : 0, col(3, 8, 'pm-grey', 3));
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    for (const c of C.CUES) set(E[`p_${c}`], o[c] || '');
    const L = strip(si, b, p);
    for (const k of C.SPARTS) set(E[k], L[k] || '');
    set(E.notesIn, notes(si, b, p));
  }

  return { render };
})();
