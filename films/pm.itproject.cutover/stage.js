// The stage of the film "Het cutover-weekend / The cutover weekend": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines C (the panel's blocks, the strip's parts
// and geometry, the board's tick rows, the weekend's hours), CAM (one camera
// move per scene), W and H. Moves are placed per Dutch caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js) keeps
// them in step. The panel at the top right gets one card per scene, each block
// in its own cue group (o[key] goes into data-k "p_<key>"), all text at 22 units
// (a video film); a card that needs more room turns a page within its scene.
// The strip along the bottom is the weekend hour by hour (h = 0 is Friday
// 18:00, h = 60 Monday 06:00), each part its own cue group, with the clock
// times the beat names; the board in the room gets its ticks and crosses.
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
  // s1: the cutover in three steps, when; the plan, its lines
  function s1(b, p) {
    const o = { head: ['cutover', DIA] };
    const A = page(b, p, 0, 2);
    o.cut = op(A, box(54, 'cutover', [tr('1  oude stoppen', '1  stop the old'), tr('2  laatste data over', '2  move the last data'), tr('3  nieuwe starten', '3  start the new')], b === 0));
    if (b >= 1) o.when = op(A * at(b, p, 1), lines(208, [[tr('wanneer?', 'when?'), 'pm-mute'], [tr('in een weekend, of', 'over a weekend, or'), 'pm-big'], [tr('een geplande stop', 'a planned shutdown'), 'pm-big']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.cplan = op(B, box(54, tr('cutoverdraaiboek', 'cutover plan'), [tr('uur voor uur; per taak:', 'hour by hour; per task:'), tr('eigenaar, starttijd,', 'owner, start time,'), tr('duur en controle', 'duration and check')], b === 2));
    if (b >= 3) o.lines = op(B * at(b, p, 3), lines(212, [[tr('200 tot 400 regels', '200 to 400 lines'), 'pm-big'], [tr('niets geïmproviseerd', 'nothing improvised'), 'pm-on']]));
    return o;
  }
  // s2: the freeze, the last movements and the count; weekend production on
  // paper; the settings freeze weeks before
  function s2(b, p) {
    const o = { head: ['freeze', DIA] };
    const A = page(b, p, 0, 2);
    o.freeze = op(A, box(54, 'freeze', [tr('vrijdag 18:00: niets', 'Friday 18:00: nothing'), tr('nieuws meer in het', 'new goes into the'), tr('oude systeem', 'old system')], b === 0));
    if (b >= 1) o.last = op(A * at(b, p, 1), lines(210, [[tr('laatste orders en', 'last orders and'), ''], [tr('goederenbewegingen', 'goods movements'), ''], [tr('dan: voorraadtelling', 'then: a stock count'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.paperc = op(B, box(54, tr('weekendproductie', 'weekend production'), [tr('eerst op papier,', 'on paper first,'), tr('daarna in het nieuwe', 'then into the new'), tr('systeem', 'system')], b === 2));
    if (b >= 3) o.settings = op(B * at(b, p, 3), box(184, tr('weken eerder', 'weeks before'), [tr('freeze op instellingen:', 'a freeze on settings:'), [tr('geen late configuratie', 'no late config changes'), 'pm-mute']], b === 3));
    return o;
  }
  // s3: the go/no-go; its criteria in two parts; who decides
  function s3(b, p) {
    const o = { head: ['go/no-go', DIA] };
    const A = page(b, p, 0, 1);
    o.gng = op(A, box(54, 'go/no-go', [tr('doorgaan of stoppen,', 'go ahead or stop,'), tr('tegen criteria die', 'against criteria'), tr('vooraf vastliggen', 'agreed in advance')], b === 0));
    const B = page(b, p, 1, 3);
    if (b >= 1) o.crit1 = op(B, lines(80, [[tr('criteria, bijvoorbeeld:', 'criteria, for example:'), 'pm-mute'], [tr('✓ afstemming binnen', '✓ reconciliation'), b === 1 ? 'pm-big' : ''], [tr('   de tolerantie', '   within tolerance'), b === 1 ? 'pm-big' : ''], [tr('✓ koppelingen werken', '✓ key interfaces work'), b === 1 ? 'pm-big' : '']]));
    if (b >= 2) o.crit2 = op(B * at(b, p, 2), lines(186, [[tr('✓ geen blokkerende', '✓ no open blocking'), b === 2 ? 'pm-big' : ''], [tr('   bevindingen open', '   defects'), b === 2 ? 'pm-big' : ''], [tr('✓ key users klaar', '✓ key users ready'), b === 2 ? 'pm-big' : '']]));
    if (b >= 3) {
      o.who = op(page(b, p, 3, -1), box(54, tr('wie beslist?', 'who decides?'), [tr('een benoemd persoon:', 'a named person:'), tr('de sponsor of de', 'the sponsor or the'), tr('plantmanager', 'plant manager'), [tr('niet de partner: die', 'not the partner: it'), 'pm-mute'], [tr('wil graag door', 'wants to go on'), 'pm-mute']], true));
    }
    return o;
  }
  // s4: the point of no return / rollback point; before and after; where to
  // place it; the dress rehearsal
  function s4(b, p) {
    const o = { head: [tr('terug of door', 'back or forward'), DIA] };
    const A = page(b, p, 0, 2);
    o.ponr = op(A, box(54, tr('point of no return', 'rollback point'), [tr('laatste kans om terug', 'the last chance to go'), tr('te gaan zonder', 'back without losing'), tr('werkverlies', 'work')], b === 0));
    if (b >= 1) o.back = op(A * at(b, p, 1), lines(200, [[tr('ervoor:', 'before it:'), 'pm-mute'], [tr('terugdraaiplan klaar', 'rollback plan ready'), ''], [tr('erna:', 'after it:'), 'pm-mute'], [tr('oplossen in het nieuwe', 'fix in the new system'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.place = op(B, box(54, tr('waar leg je het?', 'where to place it?'), [tr('terugzetten moet ruim', 'a restore must finish'), tr('voor de eerste ploeg', 'well before the'), tr('klaar zijn', 'first shift')], b === 2));
    if (b >= 3) o.dress = op(B * at(b, p, 3), box(184, tr('generale repetitie', 'dress rehearsal'), [tr('het hele weekend één', 'the whole weekend'), tr('keer, met stopwatch', 'once, with a stopwatch')], b === 3));
    return o;
  }
  // s5: Monday 06:00 and working back; the 14-hour load; too far to stop; the question
  function s5(b, p) {
    const o = { head: [tr('maandag 06:00', 'Monday 06:00'), DIA] };
    const A = page(b, p, 0, 1);
    o.monday = op(A, box(54, tr('eerste ploeg, 06:00', 'first shift, 06:00'), [tr('✓ orders', '✓ orders'), tr('✓ etiketten', '✓ labels'), tr('✓ weegschalen', '✓ the scales')], true)
      + lines(212, [[tr('reken vanaf die tijd', 'work back from'), 'pm-on'], [tr('terug', 'that time'), 'pm-on']]));
    const B = page(b, p, 1, 3);
    if (b >= 1) o.wrong = op(B, box(54, tr('wat vaak misgaat', 'often goes wrong'), [tr('geen generale', 'no dress rehearsal,'), tr('repetitie, dus laden:', 'so the load takes'), [tr('14 uur in plaats van 9', '14 hours, not 9'), 'pm-on']], b === 1));
    if (b >= 2) o.toofar = op(B * at(b, p, 2), lines(206, [[tr('de go/no-go wordt:', 'the go/no-go becomes:'), 'pm-mute'], [`“${tr('te ver om te stoppen', 'too far in to stop')}”`, 'pm-big']]));
    if (b >= 3) {
      o.askc = op(page(b, p, 3, -1), lines(80, [[tr('vraag:', 'ask:'), 'pm-mute'], [tr('als de go/no-go op', 'if the go/no-go on'), 'pm-big'], [tr('zaterdag nee zegt,', 'Saturday says no,'), 'pm-big'], ['', ''], [tr('wat doen de lijnen', 'what do the lines'), 'pm-on'], [tr('dan op maandag?', 'do on Monday?'), 'pm-on']]));
    }
    return o;
  }
  // s6: the snack maker's plan, row by row
  const row = (y, t, task, hot, cls) => txt(X0, y, t, hot ? 'pm-on' : 'pm-big') + txt(X0 + 122, y, task, cls || 'pm-txt');
  function s6(b, p) {
    const o = { head: ['ERP + MES', EX] };
    const A = page(b, p, 0, 3);
    o.snack = op(A, lines(80, [[tr('nieuw ERP en MES', 'new ERP and MES'), b === 0 ? 'pm-on' : 'pm-big'], [tr('in één weekend,', 'in one weekend,'), 'pm-mute'], [tr('getimed in de repetitie', 'timed in the rehearsal'), 'pm-mute']]));
    if (b >= 1) o.t1 = op(A * at(b, p, 1), row(166, tr('vr 18:00', 'Fri 18:00'), 'freeze', b === 1) + row(192, '18–21', tr('telling', 'stock count'), b === 1) + row(218, '21–06', tr('laden: 9 u', 'load: 9 h'), b === 1));
    if (b >= 2) o.t2 = op(A * at(b, p, 2), lines(252, [[tr('7,5 u + 20% = 9 uur', '7.5 h + 20% = 9 hours'), 'pm-on']]));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.t3 = op(B, row(58, tr('za 06–12', 'Sat 06–12'), tr('afstemming', 'reconcile'), b === 3) + row(84, tr('za 12:00', 'Sat 12:00'), 'go/no-go 1', b === 3) + row(110, '12–20', tr('koppelingen', 'interfaces'), b === 3)
      + txt(X0 + 122, 136, tr('testorders', 'test orders'), 'pm-mute'));
    if (b >= 4) o.t4 = op(at(b, p, 4), row(168, '20–08', 'key users', b === 4) + row(194, tr('zo 08:00', 'Sun 08:00'), 'go/no-go 2', b === 4)
      + txt(X0, 220, tr('point of no return:', 'rollback point:'), 'pm-mute') + txt(X0, 246, tr('terugzetten 10 uur', 'restore: 10 hours'), 'pm-mute'));
    if (b >= 5) o.t5 = op(at(b, p, 5), row(276, tr('ma 06:00', 'Mon 06:00'), tr('eerste ploeg', 'first shift'), true));
    return o;
  }
  // s7: Saturday 11:30: the stock within tolerance, the checkweigher fails; go
  // with a condition, the window to Sunday 08:00
  function s7(b, p) {
    const o = { head: [tr('za 11:30', 'Sat 11:30'), EX] };
    const A = page(b, p, 0, 2);
    o.diff = op(A, box(54, tr('voorraadverschil', 'stock difference'), [[tr('✓ 0,2%: binnen de', '✓ 0.2%: within the'), 'pm-on'], tr('tolerantie van 0,5%', '0.5% tolerance')], b === 0));
    if (b >= 1) o.fail = op(A * at(b, p, 1), lines(184, [[tr('maar:', 'but:'), 'pm-mute'], [tr('✗ koppeling met de', '✗ the checkweigher'), 'pm-big'], [tr('controleweegschalen', 'interface fails'), 'pm-big']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.go = op(B, box(54, 'go/no-go 1', [[tr('go, met een', 'go, with a'), 'pm-on'], [tr('voorwaarde', 'condition'), 'pm-on']], b === 2));
    if (b >= 3) o.window = op(B * at(b, p, 3), lines(184, [[tr('weegschalen pas nodig:', 'the scales are needed'), ''], [tr('maandag 06:00', 'Monday 06:00'), 'pm-big'], [tr('repareren tot', 'fix it by'), ''], [tr('zondag 08:00', 'Sunday 08:00'), 'pm-on']]));
    return o;
  }
  // s8: Sunday 08:00: the condition, the manual workaround; no-go and the
  // restore by 18:00; the log
  function s8(b, p) {
    const o = { head: [tr('zo 08:00', 'Sun 08:00'), EX] };
    const A = page(b, p, 0, 2);
    o.cond = op(A, box(54, tr('om 08:00 moet:', 'by 08:00:'), [tr('de koppeling werken,', 'the interface works,'), tr('of een omweg getest', 'or a workaround tested')], b === 0));
    if (b >= 1) o.manual = op(A * at(b, p, 1), lines(184, [[tr('omweg:', 'workaround:'), 'pm-mute'], [tr('gewichten met de', 'weights entered by'), ''], [tr('hand, een tweede', 'hand, checked by a'), ''], [tr('persoon controleert', 'second person'), '']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.nogo = op(B, box(54, tr('geen van beide?', 'neither?'), [[tr('no-go: terugzetten', 'no-go: restore'), 'pm-on'], tr('oud systeem zondag', 'old system back by'), tr('rond 18:00 terug', 'about 18:00 Sunday'), [tr('ruim voor maandag', 'well before Monday'), 'pm-mute']], b === 2));
    if (b >= 3) o.log = op(B * at(b, p, 3), lines(236, [[tr('besluit + reden in het', 'decision + reason in'), ''], [tr('cutoverlogboek', 'the cutover log'), 'pm-on']]));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8];

  // ---------------------------------------------------------------- the weekend strip
  const S = C.STRIP;
  const T = C.T;
  const hx = (h) => S.x0 + h * S.ph;
  const clock = (h) => `${String(Math.floor((18 + h) % 24)).padStart(2, '0')}:${String(Math.round(((18 + h) % 1) * 60)).padStart(2, '0')}`;
  const LY = 324; // the lane: 324..350
  const LH = 26;
  const RY = 356; // the restore lane: 356..366
  const dia = (x, y, r, cls = 'pm-dia') => path(`M${f1(x)} ${f1(y - r)}l${f1(r)} ${f1(r)}l${f1(-r)} ${f1(r)}l${f1(-r)} ${f1(-r)}Z`, cls);
  const block = (a, z, cls = 'pm-blk') => rect(hx(a) + 0.8, LY, hx(z) - hx(a) - 1.6, LH, cls, 3);
  const tick = (x, y, s = 7) => path(`M${f1(x - s)} ${f1(y)}l${f1(s * 0.7)} ${f1(s * 0.7)}l${f1(s * 1.3)} ${f1(-s * 1.4)}`, 'pm-tick');
  const cross = (x, y, s = 6) => path(`M${f1(x - s)} ${f1(y - s)}l${f1(2 * s)} ${f1(2 * s)}M${f1(x + s)} ${f1(y - s)}l${f1(-2 * s)} ${f1(2 * s)}`, 'pm-cross');
  // the clock times each beat names: [h, text?]
  const TIMES = [
    [[], [0, 60], [0, 60], [0, 60]],
    [[0], [0], [], []],
    [[18, 38], [18, 38], [18, 38], [18, 38]],
    [[38], [38, 48], [48, 60], []],
    [[60], [3, 17], [18], [18]],
    [[0, 60], [0, 12], [3, 12], [18, 26], [26, 38], [38, 60]],
    [[[17.5, '11:30']], [[17.5, '11:30']], [18], [18, 38, 60]],
    [[38], [38], [38, 48, 60], [38]],
  ];
  function strip(si, b, p) {
    const L = {};
    // the axis: day names, midnights, the hour ticks every six hours
    const days = [[3, tr('vr', 'Fri')], [18, tr('za', 'Sat')], [42, tr('zo', 'Sun')], [57, tr('ma', 'Mon')]];
    let ax = days.map(([h, t]) => txt(hx(h), 316, t, 'pm-big', 'middle')).join('');
    ax += [6, 30, 54].map((h) => path(`M${f1(hx(h))} 300V370`, 'pm-thin')).join('');
    for (let h = 0; h <= 60; h += 6) ax += path(`M${f1(hx(h))} 370v5`, 'pm-line');
    ax += path(`M${f1(hx(0))} 372.5H${f1(hx(60))}`, 'pm-thin');
    L.sAxis = ax;
    // the plan's blocks: from s1 b2, staggered in
    const BL = [['sCount', T.count], ['sLoad', T.load], ['sRecon', T.recon], ['sIf', T.ifc], ['sKu', T.ku]];
    BL.forEach(([key, [a, z]], i) => {
      let shown = si > 0 ? 1 : at(b, p, 2, 0.05 + i * 0.08, 0.2 + i * 0.08);
      if (si === 5) shown = [at(b, p, 1), at(b, p, 1, 0.4, 0.6), at(b, p, 3), at(b, p, 3, 0.5, 0.7), at(b, p, 4)][i];
      L[key] = op(shown, block(a, z));
    });
    // the 14-hour load (s5 b1, b2): the overrun past 06:00 to 11:00
    if (si === 4 && (b === 1 || b === 2)) {
      const grow = b === 1 ? span(p, 0.15, 0.6) : 1;
      L.sLoad += op(grow, rect(hx(T.load[1]) + 0.8, LY + 4, (5 * S.ph) * grow - 1.6, LH - 8, 'pm-over', 2));
    }
    // s7: the stock tick on the reconciliation, the cross on the interfaces
    if (si === 6) {
      L.sRecon += op(at(b, p, 0, 0.3, 0.5), tick(hx(15), LY + 13));
      L.sIf += op(at(b, p, 1, 0.2, 0.4), cross(hx(22), LY + 13));
    }
    if (si === 7) L.sIf += cross(hx(22), LY + 13);
    // the freeze: from s2 b0
    const fr = si < 1 ? 0 : si === 1 ? at(b, p, 0, 0.1, 0.4) : si === 5 ? at(b, p, 1) : 1;
    L.sFreeze = op(fr, path(`M${f1(hx(0))} 300V372`, 'pm-line') + rect(hx(0), 300, 14, 9, 'pm-flag', 1));
    // the go/no-go diamonds: from s3 b0
    const gn = si < 2 ? 0 : si === 2 ? at(b, p, 0, 0.1, 0.4) : 1;
    const g1 = si === 5 ? at(b, p, 3, 0.4, 0.6) : gn;
    const g2 = si === 5 ? at(b, p, 4, 0.4, 0.6) : gn;
    L.sGng1 = op(g1, dia(hx(T.gng1), LY + 13, 11) + (si === 6 && b >= 2 ? op(at(b, p, 2, 0.3, 0.5), tick(hx(T.gng1) + 1, LY + 13, 5)) : ''));
    L.sGng2 = op(g2, dia(hx(T.gng2), LY + 13, 11));
    // the point of no return flag on go/no-go 2: from s4 b0
    const pf = si < 3 ? 0 : si === 3 ? at(b, p, 0, 0.1, 0.4) : si === 5 ? at(b, p, 4, 0.5, 0.7) : 1;
    L.sPonr = op(pf, path(`M${f1(hx(T.gng2))} 300V${LY + 2}`, 'pm-line') + path(`M${f1(hx(T.gng2))} 300l18 5l-18 5Z`, 'pm-flag'));
    // the restore: dashed, 10 hours from go/no-go 2 (s4 b1 on); solid in s8 b2
    const rs = si < 3 ? 0 : si === 3 ? at(b, p, 1, 0.2, 0.5) : si === 5 ? at(b, p, 4, 0.6, 0.8) : 1;
    const hot = si === 7 && b >= 2;
    L.sRestore = op(rs, hot ? rect(hx(T.restore[0]), RY, (T.restore[1] - T.restore[0]) * S.ph * at(b, p, 2, 0.1, 0.5), 10, 'pm-over', 2)
      : path(`M${f1(hx(T.restore[0]))} ${RY + 5}H${f1(hx(T.restore[1]))}`, 'pm-dash'));
    // the Monday shift: from s1 b1
    const sh = si === 0 ? at(b, p, 1, 0.1, 0.4) : si === 5 ? at(b, p, 5) : 1;
    L.sShift = op(sh, path(`M${f1(hx(T.shift))} 300V372`, 'pm-line') + path(`M${f1(hx(T.shift))} 300l-16 5l16 5Z`, 'pm-flag'));
    // s7 b3: the window from go/no-go 1 to go/no-go 2, a bracket over the lane
    L.sWindow = si === 6 && b >= 3 ? op(at(b, p, 3), path(`M${f1(hx(T.gng1))} 351v5H${f1(hx(T.gng2))}v-5`, 'pm-line')) : '';
    // the clock times
    const tl = (TIMES[si] && TIMES[si][b]) || [];
    L.sTimes = tl.map((x) => { const [h, t] = Array.isArray(x) ? x : [x, clock(x)]; const anchor = h <= 2 ? 'start' : h >= 58 ? 'end' : 'middle'; return txt(h <= 2 ? hx(h) - 4 : h >= 58 ? hx(h) + 4 : hx(h), 392, t, 'pm-big', anchor); }).join('');
    return L;
  }

  // ---------------------------------------------------------------- the board's ticks
  // the four criteria rows: ticks (and in the example a cross, then a tick)
  function ticks(si, b, p) {
    const marks = [];
    const tk = (i) => { const { u, v } = C.ROWS[i]; return path(`M${f1(u + 1.2)} ${f1(v)}l2.4 2.6l5 -6`, 'pm-btick'); };
    const cx = (i) => { const { u, v } = C.ROWS[i]; return path(`M${f1(u + 1)} ${f1(v - 3)}l6 6M${f1(u + 7)} ${f1(v - 3)}l-6 6`, 'pm-bcross'); };
    if (si === 2) {
      if (b >= 1) marks.push(op(at(b, p, 1, 0.3, 0.45), tk(0)), op(at(b, p, 1, 0.6, 0.75), tk(1)));
      if (b >= 2) marks.push(op(at(b, p, 2, 0.3, 0.45), tk(2)), op(at(b, p, 2, 0.6, 0.75), tk(3)));
    } else if (si === 6) {
      marks.push(op(at(b, p, 0, 0.3, 0.5), tk(0)));
      if (b >= 1) marks.push(op(at(b, p, 1, 0.2, 0.4), cx(1)));
    } else if (si === 7) {
      marks.push(tk(0), cx(1));
    }
    return marks.join('');
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    for (const c of C.CUES) set(E[`p_${c}`], o[c] || '');
    const L = strip(si, b, p);
    for (const k of [...C.SPARTS, 'sTimes']) set(E[k], L[k] || '');
    set(E.ticks, ticks(si, b, p));
  }

  return { render };
})();
