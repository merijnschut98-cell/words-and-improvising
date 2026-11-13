// The stage of the film "Een sprint van twee weken / A two-week sprint": a
// pure function of (scene, u). Inlined into the page after the anatomy kit and
// a preamble from build.mjs that defines C (the panel's blocks, the calendar
// cells, the board's columns), CAM (one camera move per scene), W and H. Moves
// are placed per Dutch caption beat (beatStarts), so the video's narration
// timing (films/_kit/beatwarp.js) keeps them in step. The panel at the right
// gets one card per scene, each block in its own cue group (o[key] goes into
// data-k "p_<key>"), all text at 22 units (a video film); a card that needs
// more room turns a page within its scene. The Scrum board on the back wall
// carries six cards that move between to do, doing and done (pulled in at the
// planning, moving at the daily, two sent back in the weighing example) and a
// seventh in the accent colour, the retrospective's one improvement; the
// calendar strip on the side wall shows the ten working days of a sprint and
// its events (planning on day 1, a daily dot each day, review and
// retrospective on day 10).
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
  const X0 = 334;
  const X1 = 618;
  const CW = X1 - X0;
  const card = (y, h, cls = 'pm-card') => rect(X0 - 6, y, CW + 12, h, cls, 8);
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pm-txt') : '')).join('');
  // a card from y with a first line in bold (accent when hot) and more lines below
  const box = (y, head, rest, hot = false, cls) => {
    const more = rest.map((t) => (Array.isArray(t) ? t : [t])).filter(([t]) => t);
    return card(y, 20 + 26 * (more.length + 1), cls || (hot ? 'pm-hot' : 'pm-card')) + lines(y + 28, [[head, hot ? 'pm-on' : 'pm-big'], ...more], X0 + 4);
  };
  const tick = (x, y) => path(`M${f1(x - 8)} ${f1(y)}l6 6l12 -13`, 'pm-line');
  const cross = (x, y) => path(`M${f1(x - 7)} ${f1(y - 7)}l14 14M${f1(x + 7)} ${f1(y - 7)}l-14 14`, 'pm-strike');
  // a numbered step: a ring with the digit, a bold name and one more line
  const step = (y, n, name, more, hot) => `<circle class="pm-ring" cx="${X0 + 12}" cy="${f1(y - 7)}" r="14"/>` + txt(X0 + 12, y + 1, String(n), 'pm-big', 'middle')
    + txt(X0 + 36, y, name, hot ? 'pm-on' : 'pm-big') + (more ? txt(X0 + 36, y + 26, more, 'pm-txt') : '');
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
  // s1: the framework, the Guide, little prescribed; then sprints back to back,
  // something usable at the end of each, and the risk of a long one
  function s1(b, p) {
    const o = { head: ['Scrum', DIA] };
    const A = page(b, p, 0, 3);
    o.scrum = op(A, lines(80, [[tr('een raamwerk', 'a framework'), 'pm-big'], [tr('klein team, complexe', 'small team, complex')], [tr('producten', 'products')], [tr('bekendste agile vorm', 'best-known agile way'), 'pm-mute']]));
    if (b >= 1) o.guide = op(A * at(b, p, 1), box(176, 'Scrum Guide', ['Schwaber, Sutherland', [tr('nov. 2020 · ±13 blz.', 'Nov 2020 · ~13 pages'), 'pm-mute']], b === 1));
    if (b >= 2) o.little = op(A * at(b, p, 2), box(286, tr('vast: rollen,', 'fixed: roles,'), [tr('momenten en lijsten', 'events and lists'), [tr('de rest: het team', 'the rest: the team'), 'pm-on']], b === 2, 'pm-dash'));
    const B = page(b, p, 3, -1);
    if (b >= 3) {
      const bw = (CW - 8) / 3;
      let row = '';
      for (let i = 0; i < 3; i++) {
        const a = at(b, p, 3, 0.1 + i * 0.15, 0.25 + i * 0.15);
        row += op(a, rect(X0 + i * (bw + 4), 100, bw, 40, i === 0 ? 'pm-hot' : 'pm-card', 4) + txt(X0 + i * (bw + 4) + bw / 2, 128, `${tr('sprint', 'sprint')} ${i + 1}`, i === 0 ? 'pm-on' : 'pm-txt', 'middle'));
      }
      o.sprint = op(B, txt(X0, 80, tr('≤ 1 maand, vaak 2 weken', '≤ 1 month, often 2 weeks'), 'pm-big') + row + op(at(b, p, 3, 0.6, 0.8), txt(X0, 180, tr('direct na elkaar', 'back to back'), 'pm-mute')));
    }
    if (b >= 4) {
      const bw = (CW - 8) / 3;
      o.usable = op(B * at(b, p, 4), [0, 1, 2].map((i) => tick(X0 + i * (bw + 4) + bw / 2, 154)).join('')
        + lines(212, [[tr('elk: iets bruikbaars af', 'each: something usable'), 'pm-big'], [tr('ritme: plannen, tonen,', 'rhythm: plan, show,')], [tr('terugkijken', 'look back')]]));
    }
    if (b >= 5) o.risk = op(B * at(b, p, 5), box(290, tr('te lang: riskant', 'too long: risky'), [tr('doel veroudert,', 'the goal goes stale,'), tr('problemen verborgen', 'problems stay hidden')], true));
    return o;
  }

  // s2: the team; three accountabilities; the three roles; the Lean view
  function s2(b, p) {
    const o = { head: ['Scrum Team', DIA] };
    const A = page(b, p, 0, 2);
    o.team = op(A, lines(80, [[tr('≤ 10 mensen', '≤ 10 people'), 'pm-big'], [tr('geen hiërarchie,', 'no hierarchy,')], [tr('geen subteams', 'no sub-teams')]]));
    if (b >= 1) o.acc = op(A * at(b, p, 1), box(156, tr('3 verantwoordelijk-', '3 accountabilities'), [tr('heden: accountabilities', 'since 2020:'), [tr('sinds 2020, geen functies', 'not job titles'), 'pm-on']], b === 1));
    const B = page(b, p, 2, 5);
    if (b >= 2) o.cpo = op(B, box(54, 'Product Owner', [tr('één persoon: waarde,', 'one person: value,'), tr('wat eerst en waarom', 'what first and why')], b === 2));
    if (b >= 3) o.csm = op(B * at(b, p, 3), box(158, 'Scrum Master', [tr('helpt team en organisatie,', 'helps team, organisation;'), tr('ruimt obstakels op', 'removes impediments'), [tr('geen baas', 'not the boss'), 'pm-mute']], b === 3));
    if (b >= 4) o.cdev = op(B * at(b, p, 4), box(288, 'Developers', [tr('programmeur, tester,', 'programmer, tester,'), tr('analist: wie bouwt', 'analyst: who builds')], b === 4));
    const Cp = page(b, p, 5, -1);
    if (b >= 5) {
      o.lean = op(Cp, lines(80, [[tr('in Lean-taal', 'in Lean terms'), 'pm-mute'], ['Product Owner', 'pm-big'], [tr('= klantstem in de', '= voice of the')], [tr('waardestroom', 'customer'), 'pm-on'], ['', ''], ['Scrum Master', 'pm-big'], [tr('= coach die het', '= a coach who')], [tr('systeem verbetert', 'improves the system'), 'pm-on'], [tr('geen takenverdeler', 'no task-giver'), 'pm-mute']]));
    }
    return o;
  }

  // s3: Scrum in the plant, the mistake and the question; then the pipe maker
  function s3(b, p) {
    const o = { head: [tr('in de fabriek', 'in the plant'), b >= 3 ? EX : DIA] };
    const A = page(b, p, 0, 3);
    o.plant = op(A, lines(80, [[tr('IT-teams voor:', 'IT teams for:'), 'pm-big'], [tr('MES: orders en', 'MES: orders and')], [tr('productie op de vloer', 'production on the floor')], [tr('ERP, data, software', 'ERP, data, machine'), 'pm-mute'], [tr('voor machines', 'software'), 'pm-mute']]));
    if (b >= 1) o.mistake = op(A * at(b, p, 1), box(204, tr('fout: IT-manager is', 'mistake: IT manager is'), [tr('PO én Scrum Master:', 'PO and Scrum Master:'), tr('beslist én bewaakt', 'decides and guards'), [tr('geen spiegel', 'no mirror'), 'pm-on']], b === 1) + cross(X1 - 14, 226));
    if (b >= 2) o.ask = op(A * at(b, p, 2), lines(352, [[tr('wie beslist wat eerst?', 'who decides what first?'), 'pm-on'], [tr('wie bewaakt het hoe?', 'who guards how we work?'), 'pm-on']]));
    const B = page(b, p, 3, 5);
    if (b >= 3) o.pipes = op(B, box(54, tr('buizen, MES-team 7', 'pipes, MES team of 7'), [tr('PO: productieleider,', 'PO: production manager,'), tr('2 dagen per week,', '2 days a week,'), tr('kent de vloer', 'knows the floor')], b === 3));
    if (b >= 4) o.roles = op(B * at(b, p, 4), box(196, tr('SM: uit het Lean-team', 'SM: from the Lean team'), [tr('Developers:', 'Developers:'), tr('3 programmeurs,', '3 programmers,'), tr('1 tester, 1 data-analist', '1 tester, 1 data analyst')], b === 4));
    const Cp = page(b, p, 5, -1);
    if (b >= 5) o.goal5 = op(Cp, box(54, tr('sprint 5, 2 weken', 'sprint 5, 2 weeks'), [[tr('vanaf maandag', 'from Monday'), 'pm-mute'], tr('extrusielijn 2: afkeur', 'extrusion line 2: scrap'), tr('per oorzaak op het', 'by cause on the'), tr('scherm, niet op papier', 'screen, not on paper')], b === 5, 'pm-dash'));
    if (b >= 6) o.shifts = op(at(b, p, 6), box(246, tr('na 2 weken:', 'after 2 weeks:'), [tr('scherm op lijn 2,', 'screen on line 2,'), tr('alle 3 ploegen ✓', 'all 3 shifts ✓'), [tr('maandag: sprint 6', 'Monday: sprint 6'), 'pm-on']], true));
    return o;
  }

  // s4: five events and the timeboxes; then the planning's three questions
  function s4(b, p) {
    const o = { head: ['events', DIA] };
    const A = page(b, p, 0, 2);
    const chips = [tr('planning', 'planning'), 'daily', 'review', 'retro'];
    let ch = '';
    chips.forEach((t, i) => {
      const x = X0 + (i % 2) * (CW / 2 + 2);
      const y = 132 + Math.floor(i / 2) * 40;
      ch += op(at(b, p, 0, 0.2 + i * 0.1, 0.35 + i * 0.1), rect(x, y, CW / 2 - 2, 32, 'pm-card', 4) + txt(x + 8, y + 24, t, 'pm-txt'));
    });
    o.five = op(A, txt(X0, 80, tr('5 events', '5 events'), 'pm-big') + rect(X0 - 6, 92, CW + 12, 120, 'pm-dash', 8) + txt(X0, 120, tr('de sprint, met daarin:', 'the sprint, holding:'), 'pm-mute') + ch);
    if (b >= 1) {
      o.tbox = op(A * at(b, p, 1), lines(240, [[tr('timebox, bij 1 maand:', 'timebox, for 1 month:'), b === 1 ? 'pm-on' : 'pm-big'], [tr('planning ≤ 8 uur', 'planning ≤ 8 hours')], [tr('daily 15 minuten', 'daily 15 minutes')], [tr('review ≤ 4 · retro ≤ 3', 'review ≤ 4 · retro ≤ 3')], [tr('kortere sprint: korter', 'shorter sprint: shorter'), 'pm-mute']]));
    }
    const B = page(b, p, 2, -1);
    if (b >= 2) o.why = op(B, txt(X0, 72, 'Sprint Planning', 'pm-big') + step(118, 1, tr('waarom waardevol?', 'why valuable?'), tr('→ het sprintdoel', '→ the sprint goal'), b === 2));
    if (b >= 3) o.what = op(B * at(b, p, 3), step(186, 2, tr('wat kan er af?', 'what can be done?'), tr('Developers kiezen', 'Developers pick'), b === 3));
    if (b >= 4) o.how = op(B * at(b, p, 4), step(254, 3, tr('hoe?', 'how?'), tr('stukken ≤ 1 dag', 'pieces ≤ 1 day'), b === 4));
    if (b >= 5) o.much = op(B * at(b, p, 5), lines(318, [[tr('hoeveel: Developers', 'how much: Developers'), 'pm-on'], [tr('wat eerst: Product', 'what first: Product'), 'pm-mute'], [tr('Owner', 'Owner'), 'pm-mute']]));
    return o;
  }

  // s5: the daily; the review and its gate; the retro and refinement
  function s5(b, p) {
    const o = { head: [tr('drie events', 'three events'), DIA] };
    const A = page(b, p, 0, 2);
    o.daily = op(A, box(54, 'Daily Scrum', [tr('15 min, elke werkdag,', '15 min, every work day,'), tr('zelfde tijd en plek', 'same time and place'), [tr('→ naar het sprintdoel', '→ toward the sprint goal'), 'pm-mute']], b === 0));
    if (b >= 1) o.status = op(A * at(b, p, 1), lines(208, [[tr('geen statusoverleg', 'no status meeting'), 'pm-big'], [tr('voor een manager', 'for a manager')], [tr('3 vaste vragen: oud', '3 fixed questions: old'), 'pm-mute'], [tr('sinds 2020: eigen vorm', 'since 2020: own format'), 'pm-on']]) + cross(X1 - 12, 202));
    const B = page(b, p, 2, 4);
    if (b >= 2) o.review = op(B, box(54, 'Sprint Review', [tr('belanghebbenden zien', 'stakeholders see'), tr('wat af is; werksessie,', 'what’s done; working'), tr('geen slides', 'session, no slides')], b === 2));
    if (b >= 3) o.gate = op(B * at(b, p, 3), box(196, tr('nooit een poort', 'never a gate'), [tr('wat af is, mag eerder', 'what’s done may go'), tr('in gebruik', 'into use earlier')], b === 3, 'pm-dash'));
    const Cp = page(b, p, 4, -1);
    if (b >= 4) o.retro = op(Cp, box(54, 'Sprint Retrospective', [tr('goed? beter? kies', 'well? better? pick'), tr('verbeteringen, direct', 'improvements, straight'), tr('in de volgende sprint', 'into the next sprint'), [tr('één concrete actie;', 'one concrete action;'), 'pm-on'], [tr('anders: kaizenbord', 'else: a kaizen board'), 'pm-mute'], [tr('zonder eigenaar', 'without an owner'), 'pm-mute']], b === 4));
    if (b >= 5) o.refine = op(Cp * at(b, p, 5), box(262, 'refinement', [tr('geen event:', 'not an event:'), tr('loopt door', 'runs all the time')], b === 5, 'pm-dash'));
    return o;
  }

  // s6: the beverage maker's two weeks, the timeboxes halved
  function s6(b, p) {
    const o = { head: [tr('drankfabriek', 'beverage maker'), EX] };
    o.drinks = lines(80, [[tr('10 werkdagen', '10 working days'), 'pm-big'], [tr('timeboxes gehalveerd', 'timeboxes halved'), 'pm-mute']]);
    const row = (y, day, what, hot) => txt(X0, y, day, hot ? 'pm-on' : 'pm-big') + txt(X0 + 124, y, what, hot ? 'pm-on' : 'pm-txt');
    if (b >= 1) o.plan4 = op(at(b, p, 1), row(150, tr('ma wk 1', 'Mon wk 1'), tr('planning ≤ 4 u', 'planning ≤ 4 h'), b === 1));
    if (b >= 2) o.day9 = op(at(b, p, 2), row(190, tr('dag 9:00', 'daily 9:00'), tr('15 min, bord', '15 min, board'), b === 2));
    if (b >= 3) o.fri = op(at(b, p, 3), row(230, tr('vr wk 2', 'Fri wk 2'), tr('review ≤ 2 u', 'review ≤ 2 h'), b === 3) + txt(X0 + 124, 256, tr('ploegleiders', 'shift leaders'), 'pm-mute') + txt(X0 + 124, 282, tr('retro ≤ 1,5 u', 'retro ≤ 1.5 h'), b === 3 ? 'pm-on' : 'pm-txt'));
    if (b >= 4) o.sum = op(at(b, p, 4), box(300, tr('10 × 15 = 150 min', '10 × 15 = 150 min'), [[tr('2,5 uur per persoon', '2.5 hours per person'), 'pm-on']], true));
    return o;
  }

  // s7: the artefacts; the Product Backlog and its goal; then the Sprint
  // Backlog, its goal and a scope change
  function s7(b, p) {
    const o = { head: [tr('artefacten', 'artefacts'), DIA] };
    const A = page(b, p, 0, 3);
    o.arte = op(A, lines(80, [[tr('3 artefacten', '3 artefacts'), 'pm-big'], [tr('maken werk zichtbaar', 'make work visible')], [tr('elk: doel of afspraak', 'each: goal or agreement'), 'pm-mute']]));
    if (b >= 1) o.pb = op(A * at(b, p, 1), box(150, 'Product Backlog', [tr('geordende lijst,', 'ordered list,'), tr('Product Owner ordent', 'Product Owner orders')], b === 1));
    if (b >= 2) o.pg = op(A * at(b, p, 2), txt(X0 + 4, 272, tr('↓ toezegging', '↓ commitment'), 'pm-mute') + box(282, 'Product Goal', [tr('doel op lange termijn', 'longer-term objective'), tr('sprint na sprint', 'sprint after sprint')], b === 2, 'pm-dash'));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.sb = op(B, box(54, 'Sprint Backlog', [tr('plan van Developers:', 'the Developers’ plan:'), tr('werk + hoe; verandert', 'work + how; changes')], b === 3));
    if (b >= 4) o.sg = op(B * at(b, p, 4), txt(X0 + 4, 176, tr('↓ toezegging', '↓ commitment'), 'pm-mute') + box(186, 'Sprint Goal', [tr('het ene doel: focus', 'single objective:'), tr('en ruimte', 'focus and room')], b === 4, 'pm-dash'));
    if (b >= 5) o.scope = op(B * at(b, p, 5), lines(298, [[tr('item te groot?', 'item too big?'), 'pm-big'], [tr('inhoud bijstellen met', 'renegotiate scope with')], [tr('de Product Owner;', 'the Product Owner;')], [tr('het doel blijft', 'the goal stands'), 'pm-on']]));
    return o;
  }

  // s8: the Increment and the Definition of Done; the quality gate and the
  // cancel; then the mistakes and the questions
  function s8(b, p) {
    const o = { head: ['Increment, Done', DIA] };
    const A = page(b, p, 0, 3);
    o.inc = op(A, box(54, 'Increment', [tr('werkend, af, draagt bij', 'working, done, adds to'), tr('aan het Product Goal;', 'the Product Goal;'), [tr('meerdere; mag eerder', 'several, used earlier'), 'pm-mute']], b === 0));
    if (b >= 1) o.dod = op(A * at(b, p, 1), txt(X0 + 4, 196, tr('↓ toezegging', '↓ commitment'), 'pm-mute') + box(206, 'Definition of Done', [tr('getest, gedocumenteerd,', 'tested, documented,'), tr('op de testomgeving', 'on the test environment')], b === 1, 'pm-dash'));
    if (b >= 2) o.back = op(A * at(b, p, 2), lines(330, [[tr('voldoet niet? terug', 'fails it? back to the'), 'pm-big'], [tr('naar de Product Backlog', 'Product Backlog'), 'pm-on'], [tr('niet opleveren, tonen', 'not released or shown'), 'pm-mute']]));
    const B = page(b, p, 3, 5);
    if (b >= 3) {
      // a gate: two posts and a bar; one block passes, a half one stops
      const gate = path(`M${X1 - 70} 150V96H${X1 - 10}V150`, 'pm-line') + rect(X1 - 120, 139, 22, 11, 'pm-dash', 2) + rect(X1 - 52, 128, 22, 22, 'pm-blk', 3);
      o.qgate = op(B, box(54, tr('kwaliteitspoort', 'quality gate'), [tr('eind van de lijn:', 'end of the line:'), tr('half werk telt niet;', 'half work doesn’t count;'), tr('verstoppen kan niet', 'no hiding it')], b === 3) + op(at(b, p, 3, 0.3, 0.6), gate.replace(/<path/, '<path transform="translate(0 110)"').replace(/<rect class="pm-(blk|dash)"/g, '<rect transform="translate(0 110)" class="pm-$1"')));
    }
    if (b >= 4) o.cancel = op(B * at(b, p, 4), box(268, tr('Sprint Goal zinloos?', 'Sprint Goal obsolete?'), [[tr('bv. project gestopt', 'e.g. project stopped'), 'pm-mute'], tr('alleen de PO breekt af;', 'only the PO cancels;'), [tr('zelden', 'rarely'), 'pm-mute']], b === 4));
    const Cp = page(b, p, 5, -1);
    if (b >= 5) {
      o.errs = op(Cp, lines(80, [[tr('fouten', 'mistakes'), 'pm-big'], [tr('400 items, geen overzicht', '400 items, no overview')], [tr('takenlijst van de baas', 'the manager’s task list')], [tr('Done: “code geschreven”', 'Done: “code written”')], [tr('(testen schuift op)', '(testing slides)'), 'pm-mute']]));
    }
    if (b >= 6) o.qs = op(at(b, p, 6), lines(240, [[tr('vraag:', 'ask:'), 'pm-big'], [tr('Product Goal in 1 zin?', 'Product Goal in 1 line?'), 'pm-on'], [tr('doel van deze sprint?', 'this sprint’s goal?'), 'pm-on'], [tr('mag ik jullie Definition', 'may I see your Definition'), 'pm-on'], [tr('of Done zien? Gebruikt?', 'of Done? Is it used?'), 'pm-on']]));
    return o;
  }

  // s9: the weighing scales: goals and Done; five items, three done; then
  // what is shown, what goes back, and whether the goal is met
  function s9(b, p) {
    const o = { head: [tr('weegschaal', 'the scale'), EX] };
    const A = page(b, p, 0, 3);
    o.scales = op(A, lines(80, [[tr('vleesfabriek → MES', 'meat plant → MES'), 'pm-big'], [tr('Product Goal: elke partij', 'Product Goal: every batch')], [tr('automatisch juist gewicht', 'the right weight, by itself')], [tr('sprint 4: lijn 1 stuurt', 'sprint 4: line 1 sends'), 'pm-on']]));
    if (b >= 1) o.dodx = op(A * at(b, p, 1), box(172, 'Done =', [tr('getest, echte weegdata,', 'tested, real weighing data,'), tr('kwaliteit gecontroleerd,', 'checked by quality,'), tr('acceptatie: kopie van', 'acceptance: a copy of'), tr('het echte systeem', 'the real system')], b === 1, 'pm-dash'));
    if (b >= 2) {
      let row = '';
      for (let i = 0; i < 5; i++) {
        const x = X0 + i * 58;
        const a = at(b, p, 2, 0.05 + i * 0.08, 0.2 + i * 0.08);
        row += op(a, rect(x, 336, 48, 40, i < 3 ? 'pm-hot' : i === 3 ? 'pm-dash' : 'pm-card', 4) + txt(x + 12, 364, String(i + 1), 'pm-big', 'start')
          + (i < 3 ? tick(x + 34, 358) : i === 3 ? txt(x + 40, 364, '½', 'pm-mute', 'middle') : ''));
      }
      o.items = op(A, row);
    }
    const B = page(b, p, 3, -1);
    if (b >= 3) o.show = op(B, box(54, tr('in de review:', 'at the review:'), [[tr('alleen 1, 2 en 3', 'only 1, 2 and 3'), 'pm-on']], b === 3));
    if (b >= 4) o.retour = op(B * at(b, p, 4), box(142, tr('4 en 5: terug naar', '4 and 5: back to the'), [tr('de Product Backlog;', 'Product Backlog;'), tr('PO bepaalt volgorde', 'PO decides the order')], b === 4));
    if (b >= 5) o.met = op(B * at(b, p, 5), box(258, tr('doel gehaald?', 'goal met?'), [tr('lijn 1 → MES: ja,', 'line 1 → MES: yes,'), tr('ook zonder al het werk', 'though not all work went'), [tr('sterker dan takenlijst', 'beats a task list'), 'pm-on']], b === 5));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the Scrum board
  // Per scene and beat the column of each card: 0 to do, 1 doing, 2 done, -1
  // hidden, -2 sent back (slides off to the left). Card 6 is the improvement.
  const H_ = [-1, -1, -1, -1, -1, -1, -1];
  const BOARD = [
    [H_], [H_], [H_],
    [H_, H_, H_, [0, 0, 0, -1, -1, -1, -1], [0, 0, 0, 0, 0, 0, -1], [0, 0, 0, 0, 0, 0, -1]],
    [[2, 1, 1, 0, 0, 0, -1], [2, 1, 1, 0, 0, 0, -1], [2, 2, 2, 1, 0, 0, -1], [2, 2, 2, 1, 0, 0, -1], [2, 2, 2, 1, 0, 0, 0], [2, 2, 2, 1, 0, 0, 0]],
    [[2, 2, 1, 1, 0, 0, -1], [2, 2, 1, 1, 0, 0, -1], [2, 2, 2, 1, 1, 0, -1], [2, 2, 2, 1, 1, 0, -1], [2, 2, 2, 1, 1, 0, -1]],
    [H_, H_, H_, [0, 0, 0, 0, 0, -1, -1], [0, 0, 0, 0, 0, -1, -1], [0, 0, 0, 0, 0, -1, -1]],
    [[2, 2, 2, 1, 0, -1, -1], [2, 2, 2, 1, 0, -1, -1], [2, 2, 2, -2, -2, -1, -1], [2, 2, 2, -1, -1, -1, -1]],
    [[0, 0, 0, 0, 0, -1, -1], [0, 0, 0, 0, 0, -1, -1], [2, 2, 2, 1, 0, -1, -1], [2, 2, 2, 1, 0, -1, -1], [2, 2, 2, -2, -2, -1, -1]],
  ];
  const boardAt = (si, b) => { const s = BOARD[si]; return s[Math.min(b, s.length - 1)]; };
  // where card i sits in a state: its column and its place among the cards there
  function spot(state, i) {
    const c = state[i];
    if (c < 0) return null;
    let j = 0;
    for (let n = 0; n < i; n++) if (state[n] === c) j++;
    const col = C.COLS[c];
    return [col.x0 + 4 + (j % 2) * 23, -C.BA.z1 + 19 + Math.floor(j / 2) * 19];
  }
  function board(si, b, p) {
    const now = boardAt(si, b);
    const was = b > 0 ? boardAt(si, b - 1) : now;
    const t = span(p, 0.15, 0.6);
    let s = '';
    for (let i = 0; i < 7; i++) {
      const a = spot(was, i);
      const z = spot(now, i);
      let pos = null;
      let alpha = 1;
      if (now[i] === -2) {
        const from = a || spot([...was.slice(0, i), 1, ...was.slice(i + 1)], i);
        if (was[i] === -2) continue;
        pos = [lerp(from[0], C.BA.x0 - 30, t), from[1]];
        alpha = 1 - t;
      } else if (z && a) pos = [lerp(a[0], z[0], t), lerp(a[1], z[1], t)];
      else if (z) { pos = z; alpha = b === 0 && si > 0 && boardAt(si - 1, 99)[i] === now[i] ? 1 : t; } else continue;
      if (alpha <= 0.01) continue;
      s += op(alpha, rect(pos[0], pos[1], 19, 14, i === 6 ? 'pm-note2' : 'pm-note', 1));
    }
    return s;
  }

  // ---------------------------------------------------------------- the calendar strip
  // fill: days lit as time passing; plan: day 1; dots: dailies on the first n
  // days; end: review and retrospective on day 10
  function calState(si, b, p) {
    const S = { fill: 0, plan: 0, dots: 0, end: 0 };
    if (si === 0 && b >= 3) S.fill = b === 3 ? 10 * span(p, 0.1, 0.8) : 10;
    if (si === 2 && b >= 5) S.fill = b === 5 ? 10 * span(p, 0.1, 0.9) : 10;
    if (si === 3) { const k = b === 0 ? span(p, 0.2, 0.9) : 1; S.plan = k; S.dots = 10 * k; S.end = k; }
    if (si === 4) { S.plan = 1; S.dots = b === 0 ? 10 * span(p, 0.1, 0.9) : 10; S.end = b >= 2 ? (b === 2 ? span(p, 0.1, 0.4) : 1) : 0; }
    if (si === 5) {
      S.fill = b === 0 ? 10 * span(p, 0.1, 0.8) : 10;
      S.plan = at(b, p, 1, 0.1, 0.4);
      S.dots = b < 2 ? 0 : b === 2 ? 10 * span(p, 0.1, 0.9) : 10;
      S.end = at(b, p, 3, 0.1, 0.4);
    }
    return S;
  }
  function calendar(si, b, p) {
    const S = calState(si, b, p);
    let s = '';
    for (let i = 0; i < C.CELLS.length; i++) {
      const [x0, y0, x1, y1] = C.CELLS[i];
      const w = x1 - x0;
      const h = y1 - y0;
      const fa = clamp(S.fill - i, 0, 1);
      if (fa > 0.01) s += op(fa * 0.45, rect(x0, y0, w, h, 'pm-blk2', 1));
      const da = clamp(S.dots - i, 0, 1);
      if (da > 0.01) s += op(da, `<circle class="pm-blk" cx="${f1(x0 + w / 2)}" cy="${f1(y0 + h * 0.62)}" r="${f1(w * 0.18)}"/>`);
    }
    const [a0, b0, a1] = C.CELLS[0];
    const [c0, d0, c1] = C.CELLS[C.CELLS.length - 1];
    if (S.plan > 0.01) s += op(S.plan, rect(a0 + 1, b0 + 1, a1 - a0 - 2, 10, 'pm-blk', 1));
    if (S.end > 0.01) s += op(S.end, rect(c0 + 1, d0 + 1, c1 - c0 - 2, 10, 'pm-note2', 1) + rect(c0 + 1, d0 + 13, c1 - c0 - 2, 6, 'pm-blk', 1));
    return s;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    for (const c of C.CUES) set(E[`p_${c}`], o[c] || '');
    set(E.bCards, board(si, b, p));
    set(E.cMarks, calendar(si, b, p));
  }

  return { render };
})();
