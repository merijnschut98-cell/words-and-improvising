// Live script of the drilling figure (inlined by build.mjs after the kit, the
// lathe module and the constants).
const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LV = Number(document.documentElement.getAttribute("data-level")) || 2;
const T = EN ? STRINGS.en : STRINGS.nl;
const DEC = EN ? "." : ",", GRP = EN ? "," : ".";
const fmt = (value, digits) => value.toFixed(digits).replace(".", DEC);
const grouped = (value) => String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, GRP);
const num = (value) => fmt(value, Number.isInteger(Math.round(value * 100) / 100) ? 0 : Math.round(value * 10) / 10 === value ? 1 : 2);
const fill = (text, map) => text.replace(/\{(\w+)\}/g, (_, key) => map[key]);

// ------------------------------------------------ words on the card
const corner = (name) => document.querySelector('.iso-plate-corner[data-corner="' + name + '"]');
document.title = T.titles[LV];
document.documentElement.setAttribute("lang", EN ? "en" : "nl");
corner("title").textContent = T.titles[LV];
const hintEl = corner("hint").querySelector("[data-hint]");
hintEl.textContent = T.hints[LV];
corner("hint").querySelector("[data-knobs]").textContent = T.knobs;
document.querySelector("[data-model]").textContent = T.models[LV];

const stage = document.querySelector(".lc-stage");
const svg = stage.querySelector("svg");
svg.setAttribute("aria-label", T.label);
stage.setAttribute("aria-label", T.aria);
const units = [...svg.querySelectorAll("[data-unit]")];
const toolEl = svg.querySelector("[data-tool]");
const secBack = svg.querySelector('[data-sec="back"]');
const secFront = svg.querySelector('[data-sec="front"]');
const fxEl = svg.querySelector("[data-fx]");
const screenEl = svg.querySelector("[data-screen]");
const knobEls = KNOBS.map((_, i) => svg.querySelector('[data-knob="' + i + '"]'));
const sels = KNOBS.map((_, i) => svg.querySelector('[data-sel="' + i + '"]'));
const lines = [...document.querySelectorAll("[data-readout] .lc-line")];
const announcer = document.querySelector(".lc-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ------------------------------------------------ knobs: D (index into DS), Vc, f, L, selector
const SELN = SEL[LV];
const RANGES = [[0, DS.length - 1], VC, FEED, DEPTH, SELN ? [0, SELN - 1] : HOURS];
const START = {
  1: { d: DS.indexOf(8), vc: HSS_VC, f: 0.15, l: 20, s: 0 },
  2: { d: DS.indexOf(10), vc: HSS_VC, f: 0.15, l: 20, s: 1 },
  3: { d: DS.indexOf(6), vc: HSS_VC, f: 0.075, l: 90, s: 0 },
  4: { d: DS.indexOf(8), vc: HSS_VC, f: 0.15, l: 20, s: 4 },
}[LV];
const knob = KNOB_KEYS_OF().map((key) => ({ x: START[key], target: START[key] }));
function KNOB_KEYS_OF() { return ["d", "vc", "f", "l", "s"]; }
const STEP = [1, 5, 0.005, 5, SELN ? 1 : 0.5];
const BIG = [2, 25, 0.05, 20, SELN ? 1 : 2];
const DRAG = [0.06, 1, 0.0015, 0.5, SELN ? 0.03 : 0.06];
function snap(i, v) {
  const [lo, hi] = RANGES[i];
  if (i === 0) {
    let d = clamp(Math.round(v), lo, hi);
    if (LV === 2 && snapS(knob[4].target) === 2 && DS[d] < 3) d = DS.indexOf(3);
    return d;
  }
  if (i === 1) return clamp(Math.round(v / 5) * 5, lo, hi);
  if (i === 2) return clamp(Math.round(v / 0.005) * 0.005, lo, hi);
  if (i === 3) return clamp(Math.round(v / 5) * 5, lo, hi);
  return snapS(v);
}
function snapS(v) { return SELN ? clamp(Math.round(v), 0, SELN - 1) : clamp(Math.round(v * 2) / 2, HOURS[0], HOURS[1]); }
const now = (i) => snap(i, knob[i].x);
const goal = (i) => snap(i, knob[i].target);
function pointerAngle(i, value) {
  if (i === 4 && SELN) return selAngle(clamp(value, 0, SELN - 1), SELN);
  return knobAngle(value, RANGES[i]);
}
function knobPointer(i, value) {
  const a = pointerAngle(i, value);
  const [x, y] = KNOBS[i].at;
  const r = i === 4 ? KNOB_R - 1.4 : KNOB_R - 0.1;
  return lineOnTop([x, y], [x + Math.sin(a) * r, y - Math.cos(a) * r], KNOB_TOP, P);
}

// ------------------------------------------------ the plan of one hole, from the knobs
function planOf(get) {
  const D = DS[get(0)], vc = get(1), f = get(2), L = get(3), s = get(4);
  const op = LV === 2 ? ["drill", "ream", "tap"][s] : "drill";
  const through = LV === 3 && s === 1;
  const tap = TAPS[D] || TAPS[3];
  const dDrill = op === "ream" ? Math.round((D - REAM) * 10) / 10 : op === "tap" ? tap[1] : D;
  const n = rpmOf(dDrill, vc), vf = vfOf(dDrill, vc, f);
  const cut = (L / vf) * 60;
  const LD = L / dDrill;
  const peck = !through && LD > PECK_LD;
  const pecks = peck ? pecksOf(L, dDrill) : 0;
  return { D, vc, f, L, s, op, through, dDrill, n, vf, cut, LD, peck, pecks, total: cut + pecks * PECK_S, pitch: op === "tap" ? tap[0] : 0, hours: LV === 4 ? s : 0 };
}
const planNow = () => planOf(now);
const planGoal = () => planOf(goal);
// the other choice of level 3, for the comparison on the screen
const otherPlan = (p) => planOf((i) => (i === 4 ? 1 - p.s : i === 1 ? (p.s ? HSS_VC : HM_VC) : goal(i)));

// ------------------------------------------------ the cycle
// approach → cut (with pecks) → retract → [swap → approach → second tool → out] → hold → reset
const RAPID = { approach: 0.35, retract: 0.45, swap: 0.45, hold: 0.9, reset: 0.6, dwell: 0.15, op2: 1.6 };
const cyc = { phase: "approach", t: 0, tip: TIP_REST, stage: 0, peckDone: 0, from: TIP_REST, hole: { tip: BX0, r: 0, thread: 0, pitch: 0 }, alpha: 1, fresh: 0, simT: 0 };
let plan = planGoal();
let theta = 0.4, spin = 0, restart = false;
const keyOf = (p) => [p.D, LV === 4 ? 0 : p.s, p.L].join("|");
let planKey = keyOf(plan);
const tlOf = (r) => r * 0.6009;
function toolNow() {
  if (cyc.stage === 0) return { kind: "drill", r: plan.dDrill / 2, pitch: 0 };
  return plan.op === "ream" ? { kind: "reamer", r: plan.D / 2, pitch: 0 } : { kind: "tap", r: plan.D / 2, pitch: plan.pitch };
}
function finalTip() { const t = toolNow(); return BX0 + plan.L + (t.kind === "drill" ? tlOf(t.r) : 0.6); }
function begin() {
  plan = planGoal();
  planKey = keyOf(plan);
  cyc.stage = 0; cyc.phase = "approach"; cyc.t = 0; cyc.from = cyc.tip; cyc.peckDone = 0; cyc.simT = 0;
  cyc.hole = { tip: BX0, r: plan.dDrill / 2, thread: 0, pitch: 0 };
  restart = false;
}
function to(phase) { cyc.phase = phase; cyc.t = 0; cyc.from = cyc.tip; }
function stepCycle(dt) {
  const p = planNow();
  cyc.t += dt;
  const fin = finalTip();
  if (cyc.phase === "approach") {
    cyc.tip = cyc.from + (BX0 - 0.5 - cyc.from) * smooth(0, RAPID.approach, cyc.t);
    if (cyc.t >= RAPID.approach) to(cyc.stage === 0 ? "cut" : "op2");
  } else if (cyc.phase === "cut") {
    const v = (p.vf / 60) * TS; // mm per real second
    let target = fin;
    if (plan.peck) target = Math.min(fin, BX0 + (cyc.peckDone + 1) * plan.dDrill);
    cyc.tip = Math.min(target, Math.max(cyc.tip, BX0) + v * dt);
    cyc.simT += dt * TS;
    cyc.hole.tip = Math.max(cyc.hole.tip, cyc.tip);
    if (cyc.tip >= fin - 1e-6) to("dwell");
    else if (cyc.tip >= target - 1e-6) { cyc.peckDone++; cyc.depthAt = cyc.tip; to("peckOut"); }
  } else if (cyc.phase === "peckOut" || cyc.phase === "peckIn") {
    const half = PECK_S / TS / 2;
    const out = BX0 - 1;
    cyc.simT += dt * TS;
    if (cyc.phase === "peckOut") { cyc.tip = cyc.depthAt + (out - cyc.depthAt) * smooth(0, half, cyc.t); if (cyc.t >= half) to("peckIn"); }
    else { cyc.tip = out + (cyc.depthAt - 0.4 - out) * smooth(0, half, cyc.t); if (cyc.t >= half) to("cut"); }
  } else if (cyc.phase === "dwell") {
    if (cyc.t >= RAPID.dwell) to("retract");
  } else if (cyc.phase === "op2") {
    const sp = (plan.L + 2) / RAPID.op2;
    cyc.tip = Math.min(fin, cyc.tip + sp * dt);
    if (plan.op === "ream") cyc.hole.r = plan.D / 2;
    if (plan.op === "tap") { cyc.hole.thread = Math.max(cyc.hole.thread, cyc.tip - 2.5 * plan.pitch); cyc.hole.pitch = plan.pitch; }
    if (cyc.tip >= fin - 1e-6) to(plan.op === "tap" ? "back" : "retract");
  } else if (cyc.phase === "back") {
    const sp = (plan.L + 2) / RAPID.op2;
    cyc.tip = Math.max(BX0 - 0.5, cyc.tip - sp * dt);
    if (cyc.tip <= BX0 - 0.5 + 1e-6) to("retract");
  } else if (cyc.phase === "retract") {
    cyc.tip = cyc.from + (TIP_REST - cyc.from) * smooth(0, RAPID.retract, cyc.t);
    if (cyc.t >= RAPID.retract) {
      if (restart) { to("reset"); }
      else if (cyc.stage === 0 && plan.op !== "drill") to("swapOut");
      else to("hold");
    }
  } else if (cyc.phase === "swapOut") {
    cyc.alpha = 1 - smooth(0, RAPID.swap, cyc.t);
    if (cyc.t >= RAPID.swap) { cyc.stage = 1; to("swapIn"); }
  } else if (cyc.phase === "swapIn") {
    cyc.alpha = smooth(0, RAPID.swap, cyc.t);
    if (cyc.t >= RAPID.swap) { cyc.alpha = 1; to("approach"); }
  } else if (cyc.phase === "hold") {
    if (cyc.t >= RAPID.hold) to("reset");
  } else if (cyc.phase === "reset") {
    // the finished block is swapped for a fresh one; a second tool goes back for the drill
    cyc.fresh = smooth(0, RAPID.reset, cyc.t);
    if (cyc.stage === 1) cyc.alpha = 1 - smooth(0, RAPID.reset / 2, cyc.t) + smooth(RAPID.reset / 2, RAPID.reset, cyc.t);
    if (cyc.t >= RAPID.reset / 2 && cyc.stage === 1) cyc.stage = 0;
    if (cyc.t >= RAPID.reset) { cyc.fresh = 0; cyc.alpha = 1; begin(); }
  }
  if (restart && (cyc.phase === "approach" || cyc.phase === "cut" || cyc.phase === "op2" || cyc.phase === "peckIn" || cyc.phase === "peckOut" || cyc.phase === "back" || cyc.phase === "dwell")) to("retract");
  const cutting = cyc.phase === "cut" || cyc.phase === "op2" || cyc.phase === "back";
  const goalSpin = cyc.phase === "back" ? -0.5 : cyc.stage === 1 && plan.op === "tap" ? 0.5 : cyc.stage === 1 ? 0.6 : (p.n / 3600) * (cyc.phase === "hold" || cyc.phase === "reset" ? 0.3 : 1);
  spin += (goalSpin - spin) * (1 - Math.exp(-dt / 0.25));
  theta += dt * spin * 2 * Math.PI;
  stepFx(dt, cutting);
}

// ------------------------------------------------ chips and coolant
const chips = [], drops = [];
let chipClock = 0, dropClock = 0;
function stepFx(dt, cutting) {
  const running = cyc.phase !== "hold" && cyc.phase !== "reset" && cyc.phase !== "swapOut" && cyc.phase !== "swapIn";
  const through = plan.through;
  chipClock += dt; dropClock += dt;
  if (cutting && cyc.stage === 0 && chipClock > (through ? 0.12 : 0.28)) { chipClock = 0; spawnChip(through); }
  if (running && dropClock > 0.035) {
    dropClock = 0;
    if (!through) {
      const d = Math.hypot(...[0, 1, 2].map((i) => NOZZLE.tip[i] - [BX0 - 1, 0, ZC + 1.5][i]));
      drops.push({ p: NOZZLE.tip.slice(), v: NOZZLE.aim.map((c) => c * 150), age: 0, life: d / 150, g: 0, a: 1 });
    } else if (cutting && cyc.tip > BX0 + 2) {
      const r = plan.dDrill / 2;
      drops.push({ p: [BX0 - 0.5, (Math.random() * 2 - 1) * r, ZC + (Math.random() * 2 - 1) * r * 0.6], v: [-55 - Math.random() * 40, (Math.random() * 2 - 1) * 30, 25 + Math.random() * 30], age: 0, life: 1.4, g: 260, a: 1 });
    }
  }
  for (const c of drops) {
    c.age += dt;
    c.v[2] -= c.g * dt;
    for (let i = 0; i < 3; i++) c.p[i] += c.v[i] * dt;
    if (!c.g && c.age >= c.life) { c.g = 260; c.v = [-40 + Math.random() * 20, (Math.random() * 2 - 1) * 25, 10]; c.life = c.age + 1.2; }
    c.a = smooth(0, 0.05, c.age) * (1 - smooth(PLATE_TOP + 10, PLATE_TOP, c.p[2]));
  }
  for (let i = drops.length - 1; i >= 0; i--) if (drops[i].p[2] < PLATE_TOP || drops[i].age > drops[i].life + 0.01 && drops[i].g) drops.splice(i, 1);
  for (const c of chips) {
    c.age += dt;
    const t = c.age;
    c.p = [c.p0[0] + c.v[0] * t, c.p0[1] + c.v[1] * t, c.p0[2] + c.v[2] * t - 150 * t * t];
    c.turn = c.turn0 + c.spinRate * t;
    c.a = smooth(0, 0.1, t) * (1 - smooth(PLATE_TOP + 12, PLATE_TOP, c.p[2]));
  }
  for (let i = chips.length - 1; i >= 0; i--) if (chips[i].p[2] <= PLATE_TOP + 0.2) chips.splice(i, 1);
}
function spawnChip(fast) {
  if (chips.length > 8) return;
  const r = plan.dDrill / 2;
  chips.push({ p0: [BX0 - 1, (Math.random() * 2 - 1) * r * 0.6, ZC + r * 0.4], p: [0, 0, 0], v: [-(fast ? 70 : 32) - Math.random() * 14, 8 + Math.random() * 18, 18 + Math.random() * 14], age: 0, a: 0, size: Math.max(1.6, Math.min(3.6, plan.dDrill * 0.3)), turn0: Math.random() * 6.28, turn: 0, spinRate: 3 + Math.random() * 2 });
}

// ------------------------------------------------ drawing
function place() {
  const tr = translateAlong(P, [cyc.tip - TIP_REST, 0, 0]);
  units.forEach((el) => el.setAttribute("transform", tr));
}
let lastSec = "";
function drawSection() {
  const h = cyc.hole;
  const key = [h.tip.toFixed(2), h.r, h.thread.toFixed(1), cyc.fresh.toFixed(3)].join("|");
  if (key === lastSec) return;
  lastSec = key;
  const s = sectionSvg(K, P, { block: BLOCKSPEC, r: h.r || plan.dDrill / 2, tip: h.tip, thread: h.thread, pitch: h.pitch });
  secBack.innerHTML = s.back;
  let front = s.front;
  if (cyc.fresh > 0.001) {
    const clean = sectionSvg(K, P, { block: BLOCKSPEC, r: plan.dDrill / 2, tip: BX0, thread: 0, pitch: 0 });
    front += '<g style="opacity:' + cyc.fresh.toFixed(3) + '">' + clean.back + clean.front + "</g>";
  }
  secFront.innerHTML = front;
}
function drawTool() {
  const t = toolNow();
  toolEl.innerHTML = toolSvg(K, G, P, { kind: t.kind, r: t.r, pitch: t.pitch, len: STICK, xNose: cyc.tip - STICK, zc: ZC, theta, alpha: cyc.alpha });
}
function drawFx() {
  let html = "";
  for (const c of chips) {
    const [sx, sy] = iso(c.p, P);
    html += '<path class="lc-chip" style="opacity:' + c.a.toFixed(2) + '" d="' + chipPath(sx, sy, c.size * KS, c.turn) + '"/>';
  }
  for (const c of drops) {
    const [sx, sy] = iso(c.p, P);
    html += '<circle class="dr-drop" style="opacity:' + (0.85 * c.a).toFixed(2) + '" cx="' + sx.toFixed(1) + '" cy="' + sy.toFixed(1) + '" r="' + (0.75 * KS).toFixed(2) + '"/>';
  }
  fxEl.innerHTML = html;
}
// the screen: the tip's depth against time (levels 1–3), or the hole positions (level 4)
function profileOf(p) {
  const pts = [[0, 0]];
  let t = 0, d = 0;
  const step = p.peck ? p.dDrill : p.L;
  while (d < p.L - 1e-9) {
    const nd = Math.min(p.L, d + step);
    t += ((nd - d) / p.vf) * 60;
    d = nd;
    pts.push([t, d]);
    if (p.peck) { pts.push([t + PECK_S / 2, 0]); t += PECK_S; pts.push([t, d]); }
  }
  return { pts, total: t };
}
function drawScreen() {
  const S0 = SCREEN, z = SCREEN_Z;
  const box = (u, v) => [S0.x + 2 + (S0.w - 4) * u, S0.y + 2 + (S0.d - 4) * v];
  let html = "";
  if (LV === 4) {
    const cx = S0.x + S0.w / 2, cy = S0.y + S0.d / 2;
    const rho = (Math.min(S0.w, S0.d) / 2 - 2) / 1.18;
    const k = rho / (TOL / 2);
    html += '<path class="dr-axis" d="' + onTop([[S0.x + 1, cy], [S0.x + S0.w - 1, cy]], z, P) + onTop([[cx, S0.y + 1], [cx, S0.y + S0.d - 1]], z, P) + '"/>';
    html += '<path class="dr-zone" d="' + onTop(Array.from({ length: 41 }, (_, i) => [cx + rho * Math.cos((i / 40) * 2 * Math.PI), cy + rho * Math.sin((i / 40) * 2 * Math.PI)]), z, P, true) + '"/>';
    const hours = snapS(knob[4].x);
    for (let hh = 0; hh <= hours + 1e-9; hh += 0.5) {
      const s = driftOf(hh);
      const [x, y] = iso([cx + 0.6 * s * k, cy - 0.8 * s * k, z], P);
      const last = Math.abs(hh - hours) < 1e-9;
      html += '<circle class="' + (last ? "dr-hit" : "dr-old") + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + ((last ? 1.1 : 0.55) * KS).toFixed(2) + '"/>';
    }
  } else {
    const p = plan;
    const mine = profileOf(p);
    const alt = LV === 3 ? profileOf(otherPlan(p)) : null;
    const tMax = Math.max(mine.total, alt ? alt.total : 0) * 1.04;
    const dMax = p.L;
    const path = (prof) => onTop(prof.pts.map(([t, d]) => box(t / tMax, d / dMax)), z, P);
    html += '<path class="dr-axis" d="' + onTop([box(0, 0), box(1, 0)], z, P) + onTop([box(0, 1), box(1, 1)], z, P) + '"/>';
    if (alt) html += '<path class="dr-zone" d="' + path(alt) + '"/>';
    html += '<path class="dr-trace" d="' + path(mine) + '"/>';
    if (cyc.stage === 0 && (cyc.phase === "cut" || cyc.phase === "peckOut" || cyc.phase === "peckIn")) {
      const [x, y] = iso([...box(Math.min(1, cyc.simT / tMax), clamp((cyc.tip - BX0) / dMax, 0, 1)), z], P);
      html += '<circle class="dr-hit" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (1 * KS).toFixed(2) + '"/>';
    }
  }
  screenEl.innerHTML = html;
}
function readout() {
  const p = planNow();
  const L1 = [];
  const time = (t) => fmt(t, t < 20 ? 1 : 0) + " " + T.s;
  const ld = "L/D " + fmt(p.LD, p.LD < 10 ? 1 : 0);
  const dd = (d) => fmt(d, Number.isInteger(d) ? 0 : 1);
  if (LV === 1) {
    L1.push("Ø" + dd(p.D) + " · Vc " + p.vc + " m/min · " + T.sel[1][p.s]);
    L1.push("n = " + grouped(p.vc * 1000) + " ÷ (π × " + dd(p.D) + ") = " + grouped(p.n) + " " + T.rpm);
    L1.push("vf = " + fmt(p.f, p.f * 100 % 1 ? 3 : 2) + " × " + grouped(p.n) + " = " + grouped(p.vf) + " mm/min");
    L1.push(p.L + " ÷ " + grouped(p.vf) + (p.peck ? " + " + p.pecks + " × 2 s" : "") + ' = <span class="lc-acc">' + time(p.total) + " " + T.perHole + "</span>");
    L1.push(ld + " · " + (p.peck ? T.peckNeed : T.once));
  } else if (LV === 2) {
    const tol = h7Of(p.D);
    const lo = fmt(p.D, 3), hi = fmt(p.D + tol, 3);
    if (p.op === "drill") {
      L1.push(T.sel[2][0] + " Ø" + dd(p.D) + " · n " + grouped(p.n) + " " + T.rpm);
      L1.push("vf " + grouped(p.vf) + " mm/min · " + time(p.total) + " " + T.perHole);
      L1.push(T.drillOver);
      L1.push(fill(T.forH7, { lo, hi }));
    } else if (p.op === "ream") {
      L1.push('<span class="lc-acc">Ø' + dd(p.D) + " H7 = " + lo + " – " + hi + " mm</span>");
      L1.push(fill(T.pre, { d: fmt(p.dDrill, 1), a: fmt(REAM, 1) }));
      L1.push(fill(T.drillWith, { d: fmt(p.dDrill, 1) }) + ": n " + grouped(p.n) + " · vf " + grouped(p.vf) + " mm/min");
      L1.push(fill(T.gauge, { d: dd(p.D) }));
    } else {
      const pt = fmt(p.pitch, p.pitch * 10 % 1 ? 2 : 1);
      L1.push("M" + p.D + " · " + T.pitch + " " + pt + " mm");
      L1.push('<span class="lc-acc">' + fill(T.core, { d: p.D, p: pt, c: fmt(p.D - p.pitch, (p.D - p.pitch) * 10 % 1 ? 2 : 1), b: fmt(p.dDrill, 1) }) + "</span>");
      L1.push(fill(T.drillWith, { d: fmt(p.dDrill, 1) }) + ": n " + grouped(p.n) + " · vf " + grouped(p.vf) + " mm/min");
      L1.push(fill(T.tapFeed, { p: pt }));
    }
    L1.push(ld + " · " + (p.peck ? T.peckNeed : T.once));
  } else if (LV === 3) {
    L1.push("Ø" + dd(p.dDrill) + " × " + p.L + " mm → " + ld + " · " + T.sel[3][p.s]);
    L1.push("n " + grouped(p.n) + " · vf " + grouped(p.vf) + " mm/min");
    L1.push(T.cut + " " + p.L + " ÷ " + grouped(p.vf) + " = " + time(p.cut));
    if (p.through) L1.push(p.LD > DEEP_LD ? T.gun : T.noPeck);
    else L1.push(p.peck ? "+ " + p.pecks + " × " + T.pecks + " = " + fmt(p.pecks * PECK_S, 0) + " " + T.s : ld + " ≤ 3 · " + T.once);
    const o = otherPlan(p);
    L1.push('<span class="lc-acc">' + time(p.total) + " " + T.perHole + '</span> <span class="lc-mute">(' + T.sel[3][o.s] + " " + time(o.total) + ")</span>");
  } else {
    const hrs = p.hours, s = Math.round(driftOf(hrs) * 1000) / 1000, dx = Math.round(600 * s) / 1000, dy = Math.round(800 * s) / 1000, pos = 2 * s; // shown as rounded on a report
    const pct = Math.round((pos / TOL) * 100);
    L1.push(fill(T.after, { h: fmt(hrs, 1) }) + ": dx " + fmt(dx, 3) + " · dy " + fmt(dy, 3) + " mm");
    L1.push(T.dist + " = " + fmt(s, 3) + " mm");
    L1.push('<span class="lc-acc">' + T.pos + " " + fmt(s, 3) + " = Ø" + fmt(pos, 3) + "</span>");
    L1.push(pct + " % " + T.ofTol + " · " + (pos <= TOL + 1e-9 ? T.ok : T.nok));
    L1.push("Ø" + dd(p.D) + " · " + grouped(p.n) + " " + T.rpm + " · " + time(p.total) + " " + T.perHole);
  }
  L1.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
}
function draw() {
  KNOBS.forEach((_, i) => { knobEls[i].setAttribute("d", knobPointer(i, i === 4 && !SELN ? knob[i].x : knob[i].x)); sels[i].toggleAttribute("data-on", i === selected); });
  place();
  drawSection();
  drawTool();
  drawFx();
  drawScreen();
  readout();
}
let selected = LV === 1 ? 0 : 4;
function valueText(i) {
  const v = goal(i);
  if (i === 0) return "Ø" + DS[v] + " mm";
  if (i === 1) return v + " m/min";
  if (i === 2) return fmt(v, 3) + " mm";
  if (i === 3) return v + " mm";
  return SELN ? T.sel[LV][v] : fmt(v, 1) + (EN ? " h" : " u");
}
function describe() {
  stage.setAttribute("aria-valuenow", String(goal(selected)));
  stage.setAttribute("aria-valuemin", String(RANGES[selected][0]));
  stage.setAttribute("aria-valuemax", String(RANGES[selected][1]));
  stage.setAttribute("aria-valuetext", T.names[selected] + " " + valueText(selected) + "; " + lines.map((l) => l.textContent).join("; "));
}
let quietTimer = 0;
function announce(text) {
  clearTimeout(quietTimer);
  quietTimer = setTimeout(() => { announcer.textContent = text || T.names[selected] + " " + valueText(selected) + ". " + lines.map((l) => l.textContent).join(". "); }, text ? 0 : 700);
}

// ------------------------------------------------ still pose: the hole 60 % deep (second tool at level 2)
function stillPose() {
  plan = planGoal(); planKey = keyOf(plan);
  chips.length = 0; drops.length = 0;
  cyc.fresh = 0; cyc.alpha = 1; cyc.phase = "cut";
  if (plan.op !== "drill") {
    cyc.stage = 1;
    const t = toolNow();
    cyc.hole = { tip: BX0 + plan.L + tlOf(plan.dDrill / 2), r: plan.op === "ream" ? plan.D / 2 : plan.dDrill / 2, thread: 0, pitch: plan.pitch };
    cyc.tip = BX0 + 0.6 * plan.L;
    if (plan.op === "tap") cyc.hole.thread = cyc.tip - 2.5 * plan.pitch;
    cyc.phase = "op2";
    void t;
  } else {
    cyc.stage = 0;
    cyc.tip = BX0 + 0.6 * plan.L + tlOf(plan.dDrill / 2);
    cyc.hole = { tip: cyc.tip, r: plan.dDrill / 2, thread: 0, pitch: 0 };
    cyc.simT = 0.6 * profileOf(plan).total;
  }
}

// ------------------------------------------------ idle tour per level
const TOURS = {
  1: [[0, { d: 8, s: 0 }], [7, { s: 1 }], [12, { s: 0 }], [16, { d: 4 }], [22, { d: 16 }], [28, { d: 8, l: 40 }], [40, { l: 20 }]],
  2: [[0, { s: 1, d: 10 }], [12, { s: 2, d: 8 }], [24, { s: 2, d: 12 }], [36, { s: 0, d: 10 }], [44, { s: 1, d: 10 }]],
  3: [[0, { s: 0 }], [23, { s: 1 }], [33, { s: 1, l: 60 }], [40, { s: 0, l: 90 }]],
  4: [[0, { s: 1 }], [5, { s: 2 }], [10, { s: 4 }], [17, { s: 6 }], [23, { s: 8 }], [29, { s: 4 }]],
};
const TOUR_LEN = { 1: 46, 2: 52, 3: 64, 4: 36 }[LV];
const tour = TOURS[LV];
function applyTour(values) {
  const idx = { d: 0, vc: 1, f: 2, l: 3, s: 4 };
  for (const [key, value] of Object.entries(values)) {
    const i = idx[key];
    const v = key === "d" ? DS.indexOf(value) : value;
    if (knob[i].target !== v) { knob[i].target = v; selected = i; if (i === 4) selectorSideEffects(); }
  }
  describe();
}
function selectorSideEffects() {
  if (LV === 1 || LV === 3) knob[1].target = goal(4) === 1 ? HM_VC : HSS_VC;
  if (LV === 2 && goal(4) === 2 && DS[goal(0)] < 3) knob[0].target = DS.indexOf(3);
}
let tourStep = -1;

let frame = 0, last = 0, visible = false, touring = !still.matches, tourClock = 0, idleTimer = 0;
function tick(nowMs) {
  const dt = last ? Math.min((nowMs - last) / 1000, 1 / 30) : 1 / 60;
  last = nowMs;
  const calm = still.matches;
  if (touring && !calm) {
    tourClock += dt;
    const t = tourClock % TOUR_LEN;
    let at = 0;
    tour.forEach((step, i) => { if (t >= step[0]) at = i; });
    if (at !== tourStep) { tourStep = at; applyTour(tour[at][1]); }
  }
  knob.forEach((kn) => {
    if (calm) kn.x = kn.target;
    else { kn.x += (kn.target - kn.x) * (1 - Math.exp(-dt / 0.16)); if (Math.abs(kn.target - kn.x) < 1e-3) kn.x = kn.target; }
  });
  if (calm) stillPose();
  else {
    const key = keyOf(planGoal());
    if (key !== planKey) restart = true;
    stepCycle(dt);
  }
  draw();
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };
function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourClock = 0; tourStep = -1; run(); } }, 40000);
}
function setKnob(i, value) {
  steer();
  selected = i;
  knob[i].target = snap(i, value);
  if (i === 4) selectorSideEffects();
  if (still.matches) knob.forEach((kn) => { kn.x = kn.target; });
  describe();
  announce();
  kick();
}
const base = (i) => (touring ? snap(i, knob[i].x) : knob[i].target);

// ------------------------------------------------ pointer: tap a knob to step, drag sideways to set; tap a part for its name
const knobScreen = KNOBS.map((kn) => iso([kn.at[0], kn.at[1], KNOB_TOP], P));
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearest([x, y]) {
  let best = 0, bestD = Infinity;
  knobScreen.forEach(([kx, ky], i) => { const d = Math.hypot(x - kx, y - ky); if (d < bestD) { bestD = d; best = i; } });
  return [best, bestD];
}
let nameTimer = 0;
function showName(el) {
  const part = el && el.closest && el.closest("[data-part]");
  if (!part) return false;
  const key = part.getAttribute("data-part");
  const name = key === "tool" ? T.tools[toolNow().kind] : T.parts[key];
  if (!name) return false;
  hintEl.innerHTML = '<span data-part-name="">' + name + "</span>";
  announce(name);
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => { hintEl.textContent = T.hints[LV]; }, 5000);
  return true;
}
let press = null;
stage.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const p = toView(event);
  const [i, d] = nearest(p);
  if (d > HIT_R) { press = { part: event.target, id: event.pointerId }; return; }
  press = { i, x0: p[0], start: base(i), dragging: false, id: event.pointerId };
  selected = i;
  steer();
  describe();
  kick();
});
stage.addEventListener("pointermove", (event) => {
  if (!press || event.pointerId !== press.id || press.part) return;
  const dx = toView(event)[0] - press.x0;
  if (!press.dragging && Math.abs(dx) > 6) { press.dragging = true; try { stage.setPointerCapture(event.pointerId); } catch {} }
  if (press.dragging) setKnob(press.i, press.start + dx * DRAG[press.i]);
});
const release = (event) => {
  if (!press || event.pointerId !== press.id) return;
  if (press.part) { if (event.type === "pointerup") showName(press.part); press = null; return; }
  if (!press.dragging && event.type === "pointerup") {
    const r = RANGES[press.i];
    const next = press.start + BIG[press.i];
    setKnob(press.i, next > r[1] + 1e-9 ? r[0] : next);
  }
  try { stage.releasePointerCapture(event.pointerId); } catch {}
  press = null;
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);

// ------------------------------------------------ keyboard
stage.addEventListener("keydown", (event) => {
  const i = selected;
  const step = event.shiftKey ? BIG[i] : STEP[i];
  let handled = true;
  if (event.key === "ArrowUp") setKnob(i, base(i) + step);
  else if (event.key === "ArrowDown") setKnob(i, base(i) - step);
  else if (event.key === "PageUp") setKnob(i, base(i) + BIG[i]);
  else if (event.key === "PageDown") setKnob(i, base(i) - BIG[i]);
  else if (event.key === "Home") setKnob(i, RANGES[i][0]);
  else if (event.key === "End") setKnob(i, RANGES[i][1]);
  else if (event.key === "ArrowLeft") { steer(); selected = (selected + 4) % 5; describe(); announce(); kick(); }
  else if (event.key === "ArrowRight") { steer(); selected = (selected + 1) % 5; describe(); announce(); kick(); }
  else if (/^[1-5]$/.test(event.key)) { steer(); selected = Number(event.key) - 1; describe(); announce(); kick(); }
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); announce(); kick(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => {
  touring = !still.matches;
  if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); }
  else { begin(); cyc.tip = TIP_REST; cyc.from = TIP_REST; run(); }
});
if (still.matches) stillPose();
else begin();
draw();
describe();
