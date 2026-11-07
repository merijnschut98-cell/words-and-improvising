// Dev tool, not shipped. Builds the standalone figure for the topic
// "Lijnontwerp" (module Lijnen en automatisering): the lessons
// eng.lines.linebasics (level 1), layout (level 2), buffers (level 3) and
// simulation (level 4).
//
//   node figures/eng.lines.buffer/build.mjs            build the page
//   node figures/eng.lines.buffer/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.lines.buffer.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark, ?lang=nl|en and ?level=1..4 from its URL (defaults:
// prefers-color-scheme, Dutch, level 2).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKILL =
  process.env.ANATOMY_SKILL ??
  "/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy";
const k = await import(pathToFileURL(join(SKILL, "kit/iso-kit.mjs")).href);
const G = await import(pathToFileURL(join(SKILL, "kit/lathe.mjs")).href);
const A = await import(pathToFileURL(join(SKILL, "kit/audit.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.lines.buffer.html");

// ---------------------------------------------------------------- the model
// Four stations on one belt, with a buffer (a short queue of places on the
// belt) between each pair. One discrete simulation in steps of 0.5 s drives
// the animation and every number on the page:
//   a station takes a part from the buffer before it (station 1 always has
//   one), works its cycle time, and puts it in the buffer after it if there is
//   a free place; otherwise it is BLOCKED. With nothing to take it is STARVED.
//   During a stop (storing) it does nothing.
// Each level loads the scenario of its lesson:
//   1 linebasics: pumps, cycles 50 / 55 / 65 / 45 s, takt 7 × 3600 / 420 = 60 s.
//     The slowest station sets the output: 25 200 / 65 = 387 per shift.
//   2 layout: four stations of about 40 s, the press-fit unit (station 3, 36 s)
//     jams for 4 min. Places needed: 240 / 40 = 6 before and after it.
//     Lost per jam with b places on each side: 6 − b products.
//   3 buffers: press B 30 s stops 3 min every 20 (or 10) min; leak tester C,
//     36 s, is the bottleneck. Size 180 / 36 = 5; refill 120 − 100 = 20 per
//     hour, so 5 places take 15 min, inside the 17 min B runs between stops.
//   4 simulation: four stations of 30–32 s and b places per buffer, with stops
//     of 2.5 % of the time on every station: fixed (3 min per 2 h) or spread
//     (30 s to 20 min). Little's law: WIP = output × lead time.
const DT = 0.5;
const MAXCAP = 6;
const SHIFT = 7 * 3600;
const L1 = { cyc: [50, 55, 65, 45], cap: [3, 3, 3], demand: 420, steps: [65, 60, 55, 50] };
const L2 = { cyc: [40, 40, 36, 40], first: 2, jam: 240, at: 2, start: 1, every: 3600 };
const L3 = { cyc: [28, 30, 36, 32], side: 2, stop: 180, at: 1, start: 5, every: [20, 10] };
const L4 = { cyc: [30, 32, 30, 31], start: 4, fixed: { dur: 180, every: 7200 }, durMin: [0.5, 0.5, 0.5, 1, 1, 2, 3, 20], share: 0.025 };

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function periodic(start, every, dur, until) {
  const a = [];
  for (let t = start; t < until; t += every) a.push([t, t + dur]);
  return a;
}
// stops: per station a sorted list of [start, end] in s
function lineSim(cyc, cap, stops) {
  const n = cyc.length;
  const L = {
    t: 0, out: 0, next: 1, cyc, cap, stops, ptr: cyc.map(() => 0), jam: cyc.map(() => 0), born: {}, lead: 0, wipInt: 0, wip: 0, outs: [],
    st: cyc.map(() => ({ part: 0, left: 0, done: false, state: "starved", phase: 0, blocked: 0, starved: 0, down: 0 })),
    buf: cap.map(() => []),
  };
  L.isDown = (i) => {
    if (L.t < L.jam[i]) return true;
    const s = L.stops[i];
    if (!s) return false;
    while (L.ptr[i] < s.length && s[L.ptr[i]][1] <= L.t) L.ptr[i]++;
    const q = s[L.ptr[i]];
    return !!q && q[0] <= L.t;
  };
  L.step = (dt) => {
    for (let i = n - 1; i >= 0; i--) {
      const st = L.st[i];
      if (L.isDown(i)) { st.state = "fault"; st.down += dt; continue; }
      if (st.part && st.done) {
        if (i === n - 1) { L.out++; L.lead += L.t - L.born[st.part]; delete L.born[st.part]; L.wip--; L.outs.push(st.part); st.part = 0; }
        else if (L.buf[i].length < L.cap[i]) { L.buf[i].push(st.part); st.part = 0; }
      }
      if (!st.part) {
        let id = 0;
        if (i === 0) { id = L.next++; L.born[id] = L.t; L.wip++; }
        else if (L.buf[i - 1].length) id = L.buf[i - 1].shift();
        else if (L.cap[i - 1] === 0 && L.st[i - 1].part && L.st[i - 1].done && !L.isDown(i - 1)) { id = L.st[i - 1].part; L.st[i - 1].part = 0; }
        if (id) { st.part = id; st.left = L.cyc[i]; st.done = false; }
      }
      if (st.part && !st.done) { st.state = "run"; st.left -= dt; if (st.left <= 1e-9) st.done = true; st.phase = 1 - Math.max(0, st.left) / L.cyc[i]; }
      else if (st.part) { st.state = "blocked"; st.blocked += dt; }
      else { st.state = "starved"; st.starved += dt; }
    }
    L.t += dt;
    L.wipInt += L.wip * dt;
  };
  return L;
}
const runTo = (L, t) => { while (L.t < t - 1e-9) L.step(DT); };
function longRun(cyc, cap, stops, warm, span) {
  const L = lineSim(cyc, cap, stops);
  runTo(L, warm);
  const o = L.out, l = L.lead, w = L.wipInt;
  runTo(L, warm + span);
  const out = L.out - o;
  return { out: (out / span) * 3600, wip: (L.wipInt - w) / span, lead: (L.lead - l) / out / 60 };
}
const r1 = (v) => Math.round(v * 10) / 10;

// level 2: one 4-minute jam of station 3 from the state earlier jams leave
// (the queue moved behind it), counted over the next two hours
const capsL2 = (b) => [L2.first, b, b];
function warmL2(b) {
  const L = lineSim(L2.cyc, capsL2(b), []);
  L.jam[L2.at] = 300 + L2.jam;
  runTo(L, 3600);
  return L;
}
const TABLE2 = [];
for (let b = 0; b <= MAXCAP; b++) {
  const L = warmL2(b);
  const o = L.out, t0 = L.t, bl = L.st[1].blocked, sv = L.st[3].starved;
  L.jam[L2.at] = t0 + L2.jam;
  runTo(L, t0 + 7200);
  TABLE2.push({ blocked: L.st[1].blocked - bl, starved: L.st[3].starved - sv, lost: Math.round((7200 / L2.cyc[0]) - (L.out - o)) });
}

// level 3: output of the line (the leak tester C) per hour, long runs
const capsL3 = (b) => [L3.side, b, L3.side];
const stopsL3 = (every, until) => [[], periodic(600, every * 60, L3.stop, until), [], []];
const TABLE3 = {};
for (const every of L3.every) TABLE3[every] = Array.from({ length: MAXCAP + 1 }, (_, b) => r1(longRun(L3.cyc, capsL3(b), stopsL3(every, 3600 * 60), 3600, 3600 * 48).out));
// refill after a stop of B, measured: 5 places, stops every 20 min
let REFILL3 = 0;
{
  const L = lineSim(L3.cyc, capsL3(5), stopsL3(20, 3600 * 4));
  runTo(L, 600 + 1200 + L3.stop); // end of the second stop
  // the rate is what counts: time from one waiting part to five, per place
  const t0 = L.t;
  while (L.buf[1].length < 1 && L.t < t0 + 3600) L.step(DT);
  const t1 = L.t;
  while (L.buf[1].length < 5 && L.t < t0 + 3600) L.step(DT);
  REFILL3 = ((L.t - t1) / 60) * (5 / 4);
}

// level 4: stops of the same share, fixed or spread
const DUR4 = L4.durMin.map((m) => m * 60);
const MEAN4 = DUR4.reduce((a, b) => a + b) / DUR4.length;
const GAP4 = MEAN4 / L4.share - MEAN4;
const DAYS4 = 20;
const END4 = 3600 * 24 * DAYS4 + 7200;
function spreadStops(until) {
  return [0, 1, 2, 3].map((i) => {
    const r = rng(9001 + 77 * i);
    const a = [];
    let t = 300 + r() * GAP4;
    while (t < until) { const d = DUR4[Math.floor(r() * DUR4.length)]; a.push([t, t + d]); t += d - Math.log(1 - r()) * GAP4; }
    return a;
  });
}
const fixedStops = (until) => [0, 1, 2, 3].map((i) => periodic(1800 * i + 900, L4.fixed.every, L4.fixed.dur, until));
const SPREAD = spreadStops(END4);
const FIXED = fixedStops(END4);
const TABLE4 = { fixed: [], spread: [] };
for (let b = 0; b <= MAXCAP; b++) {
  for (const [mode, stops] of [["fixed", FIXED], ["spread", SPREAD]]) {
    const r = longRun(L4.cyc, [b, b, b], stops, 7200, 3600 * 24 * DAYS4);
    TABLE4[mode].push({ out: r1(r.out), wip: r1(r.wip), lead: r1(r.lead) });
  }
}
const SHARE4 = SPREAD.map((a) => a.reduce((s, q) => s + Math.min(q[1], END4) - q[0], 0) / END4);

// level 1: the slowest station sets the pace
const TABLE1 = L1.steps.map((c) => {
  const cyc = [L1.cyc[0], L1.cyc[1], c, L1.cyc[3]];
  return r1(longRun(cyc, L1.cap, [], 3600, 3600 * 20).out);
});

// ---------------------------------------------------------------- the lessons' numbers, checked
{
  const fail = (msg) => { throw new Error(`model check: ${msg}`); };
  const near = (a, b, tol, msg) => { if (Math.abs(a - b) > tol) fail(`${msg}: ${a} vs ${b}`); };
  // level 1: takt 25 200 / 420 = 60 s; the cover station at 65 s makes 387 a shift, 33 short
  if (SHIFT / L1.demand !== 60) fail("takt");
  if (Math.floor(SHIFT / 65) !== 387 || L1.demand - Math.floor(SHIFT / 65) !== 33) fail("387 per shift");
  L1.steps.forEach((c, i) => near(TABLE1[i], 3600 / Math.max(L1.cyc[0], L1.cyc[1], c, L1.cyc[3]), 0.2, `L1 sim at ${c} s`));
  if (Math.floor(SHIFT / 60) !== 420) fail("420 at 60 s");
  // level 2: 240 / 40 = 6 places; each missing place costs one product a jam
  if (L2.jam / L2.cyc[0] !== 6) fail("240/40");
  TABLE2.forEach((r, b) => { if (r.lost !== 6 - b) fail(`L2 lost at ${b}: ${r.lost}`); });
  if (TABLE2[6].blocked > 1 || TABLE2[6].starved > 1) fail("6 places do not bridge 4 min");
  near(TABLE2[0].blocked, 240, 5, "L2 no buffer blocked");
  // level 3: 180 / 36 = 5; refill 20 an hour, 5 places in 15 min, 2 min to spare
  if (L3.stop / L3.cyc[2] !== 5) fail("180/36");
  if (3600 / L3.cyc[1] !== 120 || 3600 / L3.cyc[2] !== 100) fail("120 and 100 per hour");
  if ((5 / (120 - 100)) * 60 !== 15) fail("15 min");
  near(REFILL3, 15, 1, "L3 refill in the simulation");
  if (TABLE3[20][5] < 99.5) fail(`L3 5 places at 20 min: ${TABLE3[20][5]}`);
  for (let b = 1; b <= 5; b++) if (!(TABLE3[20][b] > TABLE3[20][b - 1])) fail("L3 output must grow with places up to 5");
  near(TABLE3[10][6], 84, 0.5, "L3 every 10 min: B gives 120 × 7/10");
  if (TABLE3[10][6] - TABLE3[10][3] > 1) fail("L3 every 10 min: a bigger buffer should help little");
  // level 4: Little's law holds; fixed stops flatter the buffers; first places pay most
  for (const mode of ["fixed", "spread"]) TABLE4[mode].forEach((r, b) => near(r.wip, (r.out * r.lead) / 60, 0.25, `Little ${mode} ${b}`));
  if (TABLE4.fixed[4].out - TABLE4.spread[4].out < 2) fail("fixed stops should look better than spread ones");
  if (!(TABLE4.spread[1].out - TABLE4.spread[0].out > TABLE4.spread[6].out - TABLE4.spread[5].out)) fail("diminishing returns");
  SHARE4.forEach((s) => { if (s < 0.02 || s > 0.032) fail(`spread stop share ${s}`); });
  near(3600 / 32, 112.5, 0, "bottleneck 32 s");
}

// ---------------------------------------------------------------- the world
// World units of about 2.5 cm, z up, x along the line (flow to +x), +y toward
// the viewer. The floor is z = 0.
const WIDTH = 600;
const ST = [-108, -36, 36, 108];
const SLOT0 = 14.5;
const PITCH = 7.5;
const slotX = (j, q) => ST[j + 1] - SLOT0 - PITCH * q;
const BT = 24; // belt top
const PART = 6.6;
const PART_H = 6;
const PLATE = { x: -146, y: -40, w: 298, d: 66, r: 4 };
const BED = { x: -130, y: -9, w: 260, d: 18, r: 1.2 };
const BELT = { x: -128, y: -7.4, w: 256, d: 14.8, r: 1 };
const RAIL_Z = 18;
const COL = 13; // station columns at y = ±COL
const BEAM_Z = [46, 51];
const RAM = { half: 4, z0: 38, z1: 42, rod: 1.2, rodLen: 14 };
const STROKE = RAM.z0 - (BT + PART_H + 0.4);
const TOTE = { x: 137, y: -8, w: 12, d: 16, r: 1.5 };
const TOTE_H = 13;

const FIT = [...k.boxCorners(PLATE, -5, 0), [ST[0], -11, 64], [ST[3], -11, 64], [ST[0] + 6, -11, 64]];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 62);
const ELEVATION = Number(process.env.EL ?? 32);
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const plan = (cx, cy, w, d, r) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });
const quad = (pts) => k.pathOf(pts.map(at), true);

// ---------------------------------------------------------------- recorder
const R = A.recorder(P, {});
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "", layer = "back" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, attrs, layer });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
function box(name, p, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(p, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = S(k.slabOf(p, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [p.x + p.w / 2, p.y + p.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", owner, ground, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner, ground }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}

// ---------------------------------------------------------------- floor plate
const halo = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLATE, -2), -5, 2, P)}"/>`;
{
  const anchors = k.corners(PLATE, 6);
  // a walkway line along the front, and a label plate with three rule lines
  const walk = k.lineOnTop([PLATE.x + 3.5, 21], [PLATE.x + PLATE.w - 3.5, 21], 0, P);
  const lp = { x: -140, y: 13, w: 18, d: 6, r: 0.6 };
  const rules = [14.6, 16, 17.4].map((y) => k.lineOnTop([lp.x + 2, y], [lp.x + (y > 17 ? 10 : 15), y], 0, P)).join("");
  const extra =
    L(k.planOutline(k.insetPlan(PLATE, 3.5), 0, P, 3), { tone: "faint" }) +
    L(walk, { tone: "faint" }) +
    `<path class="la-card" d="${k.planOutline(lp, 0, P, 2)}"/>` +
    L(rules, { tone: "lo", free: true }) +
    L(anchors.map(([x, y]) => k.ring(x, y, 1.8, 0, P, 14)).join(""), { tone: "lo" }) +
    Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box("stand.floor", PLATE, -5, 0, { tone: "lo" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(PLATE, -2.2, P, 3), { tone: "faint" }), extra });
}

// ---------------------------------------------------------------- conveyor
for (const x of [-122, -72, 0, 72, 122]) {
  for (const y of [-6, 6]) {
    post("conv.leg", x, y, 1.3, 0, RAIL_Z, { tone: "mid", crease: "none" }, { steps: 14, layer: y > 0 ? "front" : "back", extra: L(k.ring(x, y, 2.2, 0, P, 14), { tone: "lo" }) });
  }
}
box("conv.bed", BED, RAIL_Z, BT - 2, { tone: "mid" }, { steps: 3, bevel: 0.3, inner: L(k.sideSeam(BED, RAIL_Z + 1.5, P, 3), { tone: "faint" }) });
{
  const slats = [];
  for (let x = BELT.x + 3; x <= BELT.x + BELT.w - 2; x += 5) slats.push(k.lineOnTop([x, BELT.y], [x, BELT.y + BELT.d], BT, P));
  box("conv.belt", BELT, BT - 2, BT, { tone: "lo", crease: "none" }, { steps: 3, inner: L(slats.join(""), { tone: "faint" }) });
}
// side guides on the bed: the back one behind the parts, the front one before
// them. The front one carries a pad for every buffer place; the page lights
// the places a buffer has.
for (const [y0, layer] of [[-9, "back"], [7.6, "front"]]) {
  const rail = { x: BED.x + 2, y: y0, w: BED.w - 4, d: 1.4, r: 0.4 };
  let extra = "";
  if (layer === "front") {
    const pads = [];
    for (let j = 0; j < 3; j++) for (let q = 0; q < MAXCAP; q++) {
      const x = slotX(j, q);
      pads.push(`<path class="la-pad" data-pad="${j}-${q}" d="${k.planOutline({ x: x - 2.4, y: y0 + 0.3, w: 4.8, d: 0.8, r: 0.3 }, BT + 3, P, 2)}"/>`);
    }
    extra = pads.join("");
  }
  box("conv.guide", rail, BT - 2, BT + 3, { tone: "mid" }, { steps: 2, layer, extra });
}
// head and tail drums
for (const x of [BED.x - 3.2, BED.x + BED.w + 3.2]) {
  discAt("conv.drum", frameY([x, -8, BT - 3.2]), 0, 16, 3.2, { tone: "mid" }, { owner: "conv" });
}
// drive at the tail, on the near side: gearbox and motor
{
  const gx = BED.x + BED.w - 3;
  box("conv.gearbox", { x: gx - 4, y: 9, w: 8, d: 5, r: 0.6 }, BT - 9, BT - 1, { tone: "mid" }, { steps: 2, bevel: 0.3, layer: "front", extra: Dt([[gx - 2.6, 14, BT - 2.2], [gx + 2.6, 14, BT - 2.2]].map(at), { size: 0.4 }) });
  const FM = frameX([gx + 4, 12.6, BT - 5]);
  const fins = G.ribsOf(FM, 0.6, 13.4, 3.4, 14, P, { fade: [0.05, 0.45], seams: true });
  discAt("conv.motor", FM, 0, 14, 3.4, { tone: "hi", crease: "lo" }, { owner: "conv", layer: "front", inner: k.fadedSvg(fins, { tone: "lo" }) });
}

// ---------------------------------------------------------------- out tote
{
  const mouth = k.insetPlan(TOTE, 1.2);
  const extra = `<path class="iso-shade la-void" data-shade="0" d="${k.planOutline(mouth, TOTE_H, P, 3)}"/>` + L(k.planOutline(mouth, TOTE_H, P, 3), { tone: "lo" });
  box("tote", TOTE, 0, TOTE_H, { tone: "mid" }, { steps: 3, bevel: 0.4, layer: "front", inner: L(k.sideSeam(TOTE, TOTE_H - 2.4, P, 3), { tone: "faint" }), extra });
}

// ---------------------------------------------------------------- supply pallet behind station 1
{
  const pal = { x: ST[0] - 18, y: -36, w: 20, d: 13, r: 0.5 };
  for (const dx of [0.5, 8.5, 16.5]) box("pallet.runner", { x: pal.x + dx, y: pal.y, w: 3, d: pal.d, r: 0.2 }, 0, 2.4, { tone: "lo" }, { steps: 1 });
  const deck = [];
  for (let u = pal.x + 2.5; u < pal.x + pal.w - 1; u += 4) deck.push(k.lineOnTop([u, pal.y + 0.3], [u, pal.y + pal.d - 0.3], 3.6, P));
  box("pallet.deck", pal, 2.4, 3.6, { tone: "mid" }, { steps: 1, extra: L(deck.join(""), { tone: "lo" }) });
  for (const [dx, dy, lv] of [[-6, -3, 0], [1, -3, 0], [-6, 3.4, 0], [1, 3.4, 0], [-6, -3, 1], [1, -3, 1]]) {
    const blk = plan(ST[0] + dx - 6, pal.y + pal.d / 2 + dy, PART, PART, 0.5);
    box("pallet.block", blk, 3.6 + lv * PART_H, 3.6 + (lv + 1) * PART_H, { tone: "hi", crease: "lo" }, { steps: 2, bevel: 0.3 });
  }
}

// ---------------------------------------------------------------- stations
// Each station is a portal over the belt: two foot rails, four columns, a
// beam carrying a pneumatic cylinder whose ram works the part below, and a
// stack light (run / waiting / fault) on the beam.
function station(i, sx) {
  for (const dx of [-7, 7]) {
    const rail = { x: sx + dx - 1.8, y: -17, w: 3.6, d: 34, r: 0.5 };
    box(`st${i}.rail`, rail, 0, 1.4, { tone: "lo" }, { steps: 2, bevel: 0.3, extra: Dt([[sx + dx, -15.6, 1.4], [sx + dx, 15.6, 1.4]].map(at), { size: 0.4 }) });
  }
  for (const dx of [-7, 7]) for (const y of [-COL, COL]) {
    box(`st${i}.col`, plan(sx + dx, y, 2.4, 2.4, 0.3), 1.4, BEAM_Z[0], { tone: "mid" }, { steps: 1, layer: y > 0 ? "front" : "back" });
  }
  const beam = { x: sx - 9.5, y: -15, w: 19, d: 30, r: 0.8 };
  const fy = beam.y + beam.d;
  const label = quad([[sx - 6, fy, 47.2], [sx + 2, fy, 47.2], [sx + 2, fy, 49.8], [sx - 6, fy, 49.8]]);
  const rules = [48.1, 48.9].map((z) => k.segment([sx - 5, fy, z], [sx + (z > 48.5 ? -1 : 1), fy, z], P)).join("");
  const screws = k.corners(beam, 1.6).map(([x, y]) => at([x, y, BEAM_Z[1]]));
  box(`st${i}.beam`, beam, BEAM_Z[0], BEAM_Z[1], { tone: "mid" }, {
    steps: 2, bevel: 0.4, layer: "front",
    inner: `<path class="la-card" d="${label}"/>` + L(rules, { tone: "lo", free: true }),
    extra: Dt(screws, { size: 0.4 }),
  });
  // the cylinder on the beam, with its port fittings
  const cz = [BEAM_Z[1], BEAM_Z[1] + 9];
  post(`st${i}.cyl`, sx, 0, 3.6, cz[0], cz[1], { tone: "hi", crease: "lo" }, {
    steps: 28, layer: "front",
    inner: L(k.sideArc(sx, 0, 3.6, cz[0] + 1.6, P, 24) + k.sideArc(sx, 0, 3.6, cz[1] - 1.6, P, 24), { tone: "lo" }),
    extra: Dt(Array.from({ length: 4 }, (_, q) => at([sx + 2.6 * Math.cos(q * Math.PI / 2 + 0.6), 2.6 * Math.sin(q * Math.PI / 2 + 0.6), cz[1]])), { size: 0.35 }),
  });
  // stack light at the back corner of the beam
  const lx = sx + 6, ly = -11;
  post(`st${i}.stack-base`, lx, ly, 1.9, BEAM_Z[1], BEAM_Z[1] + 1.6, { tone: "mid" }, { steps: 18, layer: "front" });
  ["run", "wait", "fault"].forEach((name, q) => {
    const z0 = BEAM_Z[1] + 1.6 + q * 2.8;
    post(`st${i}.stack-${name}`, lx, ly, 1.6, z0, z0 + 2.8, { tone: "mid", crease: "lo" }, {
      steps: 18, layer: "front", attrs: ` data-stack="${i}-${name}"`,
      extra: q === 2 ? Dt([at([lx, ly, z0 + 2.8])], { size: 0.4, tone: "hi" }) : "",
    });
  });
}
ST.forEach((sx, i) => station(i, sx));

// ---------------------------------------------------------------- live parts
// Rams: built at rest (up) and moved down along z by the page.
function ramSvg(i) {
  const sx = ST[i];
  const head = plan(sx, 0, RAM.half * 2, RAM.half * 2, 0.6);
  const rod = k.solidSvg(k.cylinder(sx, 0, RAM.rod, RAM.z1, RAM.rodLen, P, 14), { tone: "hi", crease: "none" });
  const block = k.solidSvg(k.slabOf(head, RAM.z0, RAM.z1 - RAM.z0, P, 2, 0.3), { tone: "mid", crease: "lo", inner: L(k.sideSeam(head, RAM.z0 + 1.3, P, 2), { tone: "faint" }) });
  const tool = k.solidSvg(k.cylinder(sx, 0, 1.6, RAM.z0 - 1.2, 1.2, P, 16), { tone: "lo", crease: "none" });
  return `<g class="la-ram" data-ram="${i}">${rod}${block}${tool}</g>`;
}
const POOL = 34;
function partSvg(slot) {
  const p = plan(0, 0, PART, PART, 0.5);
  const top = BT + PART_H;
  const block = k.solidSvg(k.slabOf(p, BT, PART_H, P, 2, 0.3), { tone: "hi", crease: "lo", inner: L(k.sideSeam(p, BT + 1.8, P, 2), { tone: "faint" }) });
  const mark = `<g class="la-mark">${Dt([at([0, 0, top])], { size: 0.6, tone: "lo" })}</g>`;
  return `<g class="la-part" data-slot="${slot}" style="display:none">${block}${mark}</g>`;
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
const layerOf = (name) => R.items.filter((item) => item.layer === name).sort((a, b) => a.key - b.key).map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const body = [
  halo,
  ...layerOf("back"),
  `<g data-layer="parts">${Array.from({ length: POOL }, (_, slot) => partSvg(slot)).join("")}</g>`,
  `<g data-layer="rams">${ST.map((_, i) => ramSvg(i)).join("")}</g>`,
  ...layerOf("front"),
  `<g data-layer="mark"><circle class="la-ring" r="0" cx="0" cy="0"/><circle class="la-ring-dot" r="0" cx="0" cy="0"/></g>`,
];

const LABEL_NL =
  "Een assemblagelijn met vier stations boven één transportband. Elk station is een portaal met vier kolommen en een balk met een pneumatische cilinder; de stempel drukt op het product eronder. Op de balk staat een signaalzuil: draaien, wachten, storing. Tussen de stations ligt een buffer: plekken op de band waar producten wachten, aangegeven met blokjes op de geleiding. Achter station 1 staat een pallet met ruwe onderdelen, aan het eind vallen de producten in een bak. De aandrijfmotor zit aan het eind van de band.";
const LABEL_EN =
  "An assembly line with four stations over one belt conveyor. Each station is a portal with four columns and a beam carrying a pneumatic cylinder; its ram presses the part below. A stack light on the beam shows run, waiting and fault. Between the stations lies a buffer: places on the belt where parts wait, marked by pads on the side guide. A pallet of raw parts stands behind station 1, and at the end the parts drop into a tote. The drive motor sits at the end of the belt.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (level 1)
const PARTS = [
  { key: "station", at: [ST[1], 0, 40] },
  { key: "station", at: [ST[2], 0, 40] },
  { key: "buffer", at: [slotX(1, 1), 0, BT + 3] },
  { key: "buffer", at: [slotX(2, 1), 0, BT + 3] },
  { key: "buffer", at: [slotX(0, 1), 0, BT + 3] },
  { key: "belt", at: [-80, 8, BT - 4] },
  { key: "belt", at: [80, 8, BT - 4] },
  { key: "stack", at: [ST[0] + 6, -11, BEAM_Z[1] + 6] },
  { key: "stack", at: [ST[3] + 6, -11, BEAM_Z[1] + 6] },
  { key: "ram", at: [ST[0], 0, BEAM_Z[1] + 5] },
  { key: "ram", at: [ST[3], 0, BEAM_Z[1] + 5] },
  { key: "pallet", at: [ST[0] - 8, -30, 8] },
  { key: "tote", at: [TOTE.x + 6, 0, TOTE_H / 2] },
  { key: "drive", at: [BED.x + BED.w - 12, 12, BT - 5] },
  { key: "bottleneck", at: [ST[2], 12, 20] },
];

// ---------------------------------------------------------------- page CSS (Vantage palette)
const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#1D4A55;--anatomy-lit-shade:#173D47;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --la-hair:rgba(240,233,218,.12);--la-accent:#5C9FAE;--la-void:#081A1E;--la-wait:#9FB3A6;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --la-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --la-hair:rgba(11,41,27,.14);--la-accent:#276F81;--la-void:#C9C0AA;--la-wait:#5A6B60;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--la-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--rows:1;--lines:5;--bottom:calc(var(--rows) * 48px + var(--lines) * 14px + 40px);height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--la-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="2"] .iso-plate{--lines:4}
html[data-level="4"] .iso-plate{--lines:4}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--la-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 4px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 22px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.la-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.la-acc{color:var(--la-accent);font-weight:600}
.la-strong{color:var(--anatomy-strong);font-weight:600}
.la-mute{color:var(--anatomy-muted)}
.la-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.la-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.la-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.la-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.la-row{display:flex;gap:6px;height:44px;align-items:center}
.la-row[hidden]{display:none}
.la-group{flex:1 1 0;min-width:0;display:flex;align-items:center;gap:4px}
.la-group-label{flex:0 1 auto;min-width:0;font:400 10px/1.15 var(--la-sans);color:var(--anatomy-muted);overflow:hidden;max-height:24px}
.la-btn{flex:0 0 44px;width:44px;height:44px;padding:0;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 18px/1 var(--la-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--la-hair);display:inline-flex;align-items:center;justify-content:center}
.la-btn:focus-visible,.la-opt:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.la-btn:disabled{opacity:.35;cursor:default}
.la-val{flex:0 0 auto;min-width:34px;text-align:center;font:600 13px/1 var(--anatomy-mono);color:var(--la-accent);white-space:nowrap}
.la-opts{flex:1 1 0;min-width:0;display:flex;gap:4px}
.la-opt{flex:1 1 0;min-width:44px;height:44px;padding:0 4px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1.1 var(--la-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--la-hair);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.la-opt[aria-checked="true"],.la-opt[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--la-accent);color:var(--la-accent);font-weight:600}
.la-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.la-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.iso-shade[data-shade="0"].la-void{fill:var(--la-void)}
.la-pad{fill:var(--anatomy-faint);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round;transition:fill .25s}
.la-pad[data-on]{fill:var(--la-accent);stroke:var(--la-accent)}
.la-ring{fill:none;stroke:var(--la-accent);stroke-width:1.4px}
.la-ring-dot{fill:var(--la-accent);stroke:none}
[data-stack] .iso-top,[data-stack] .iso-shade,[data-stack] .iso-fill{transition:fill .2s}
[data-stack$="-run"][data-on] .iso-top,[data-stack$="-run"][data-on] .iso-shade,[data-stack$="-run"][data-on] .iso-fill{fill:var(--la-accent)}
[data-stack$="-wait"][data-on] .iso-top,[data-stack$="-wait"][data-on] .iso-shade,[data-stack$="-wait"][data-on] .iso-fill{fill:var(--la-wait)}
[data-stack$="-fault"][data-on] .iso-top,[data-stack$="-fault"][data-on] .iso-shade,[data-stack$="-fault"][data-on] .iso-fill{fill:var(--anatomy-hi)}
@media (prefers-reduced-motion:reduce){[data-stack] .iso-top,[data-stack] .iso-shade,[data-stack] .iso-fill,.la-pad{transition:none}}
`;

// ---------------------------------------------------------------- live script
const SPREAD_PAGE = SPREAD.map((a) => a.filter((q) => q[0] < 3600 * 72));
const live = `
const P = ${JSON.stringify(P)};
const DT = ${DT}, MAXCAP = ${MAXCAP}, SHIFT = ${SHIFT};
const L1 = ${JSON.stringify(L1)}, L2 = ${JSON.stringify(L2)}, L3 = ${JSON.stringify(L3)}, L4 = ${JSON.stringify(L4)};
const TABLE1 = ${JSON.stringify(TABLE1)}, TABLE2 = ${JSON.stringify(TABLE2)}, TABLE3 = ${JSON.stringify(TABLE3)}, TABLE4 = ${JSON.stringify(TABLE4)};
const SPREAD = ${JSON.stringify(SPREAD_PAGE)};
const ST = ${JSON.stringify(ST)}, SLOT0 = ${SLOT0}, PITCH = ${PITCH}, BT = ${BT}, PART_H = ${PART_H}, STROKE = ${STROKE};
const BELT_END = ${BED.x + BED.w}, TOTE_X = ${TOTE.x + TOTE.w / 2}, TOTE_H = ${TOTE_H};
const PARTS = ${JSON.stringify(PARTS)};
const slotX = (j, q) => ST[j + 1] - SLOT0 - PITCH * q;
${periodic.toString()}
${lineSim.toString()}
const at = (point) => iso(point, P);

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", run: "run", blocked: "blocked", starved: "starved", fault: "down", per: "/h", st: "st.",
      names1: ["housing", "impeller", "cover", "test"], names: ["1", "2", "3", "4"], names3: ["A", "B", "C", "D"],
      cyc: "cycle", takt: "takt", bn: "bottleneck", shift: "per shift (7 h)", short: "short", meets: "meets demand",
      tap: "tap a part to name it",
      jamNeed: "jam st. 3: 240 s / 40 s = 6 places", now: "now", places: "places", blk: "st. 2 blocked", stv: "st. 4 starved", per1: "per jam", lost: "lost", products: "products", none: "none",
      size3: "buffer B→C: 180 / 36 = 5 places", refill: "refill 120 − 100 = 20/h", inMin: "min", runs: "B runs", between: "min between stops", spare: "spare", late: "does not refill in time", outC: "output C (bottleneck)", of: "of",
      out4: "output", wip: "WIP", lead: "lead time", little: "(Little)", fixed: "fixed stops", spread: "spread stops", same: "same stop time ~2.5 %",
      jamNow: "Station 3 down: 4 min", back: "Running again", stopB: "B down: 3 min",
      parts: { station: ["Station", "a workplace doing one fixed part of the work"], buffer: ["Buffer", "places on the belt where parts wait"], belt: ["Belt conveyor", "carries parts from station to station"], stack: ["Stack light", "bottom run · middle waiting · top fault"], ram: ["Press cylinder", "its ram does the station's work on the part"], pallet: ["Supply pallet", "raw parts for station 1"], tote: ["Tote", "finished products"], drive: ["Drive", "motor and gearbox that run the belt"], bottleneck: ["Bottleneck", "the slowest station, sets the output"] } }
  : { dec: ",", run: "werkt", blocked: "blocked", starved: "starved", fault: "storing", per: "/u", st: "st.",
      names1: ["huis", "waaier", "deksel", "test"], names: ["1", "2", "3", "4"], names3: ["A", "B", "C", "D"],
      cyc: "cyclus", takt: "takt", bn: "bottleneck", shift: "per dienst (7 u)", short: "te weinig", meets: "haalt de klantvraag",
      tap: "tik een onderdeel voor de naam",
      jamNeed: "storing st. 3: 240 s / 40 s = 6 plekken", now: "nu", places: "plekken", blk: "st. 2 blocked", stv: "st. 4 starved", per1: "per storing", lost: "verlies", products: "producten", none: "geen",
      size3: "buffer B→C: 180 / 36 = 5 plekken", refill: "bijvullen 120 − 100 = 20/u", inMin: "min", runs: "B draait", between: "min tussen stops", spare: "over", late: "loopt niet op tijd vol", outC: "output C (bottleneck)", of: "van",
      out4: "output", wip: "onderhanden werk", lead: "doorlooptijd", little: "(Little)", fixed: "vaste stops", spread: "gespreide stops", same: "zelfde stoptijd ~2,5 %",
      jamNow: "Station 3 storing: 4 min", back: "Draait weer", stopB: "B storing: 3 min",
      parts: { station: ["Station", "een werkplek met één vast deel van het werk"], buffer: ["Buffer", "wachtplekken op de band tussen twee stations"], belt: ["Transportband", "brengt de producten van station naar station"], stack: ["Signaalzuil", "onder draait · midden wacht · boven storing"], ram: ["Perscilinder", "de stempel doet het werk van het station"], pallet: ["Aanvoerpallet", "ruwe onderdelen voor station 1"], tote: ["Bak", "afgewerkte producten"], drive: ["Aandrijving", "motor en tandwielkast van de band"], bottleneck: ["Bottleneck", "het langzaamste station, bepaalt de output"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const mmss = (s) => { const r = Math.round(s); return Math.floor(r / 60) + ":" + String(r % 60).padStart(2, "0"); };

const stage = document.querySelector(".la-stage");
const svg = stage.querySelector("svg");
const partsLayer = svg.querySelector('[data-layer="parts"]');
const pool = [...partsLayer.querySelectorAll(".la-part")];
const rams = [...svg.querySelectorAll("[data-ram]")];
const stacks = ST.map((_, i) => ["run", "wait", "fault"].map((n) => svg.querySelector('[data-stack="' + i + "-" + n + '"]')));
const pads = [...svg.querySelectorAll("[data-pad]")];
const markRing = svg.querySelector(".la-ring"), ringDot = svg.querySelector(".la-ring-dot");
const lines = [...document.querySelectorAll("[data-readout] .la-line")];
const announcer = document.querySelector(".la-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
document.querySelectorAll("[data-levels]").forEach((row) => { row.hidden = !row.dataset.levels.split(",").includes(String(LVL)); });

// ------------------------------------------------ the scenario of this level
const cfg = { l1: L1.steps[0], b2: L2.start, b3: L3.start, every: L3.every[0], b4: L4.start, mode: "fixed" };
const TS = [0, 20, 40, 40, 60][LVL];
let L;
function capsNow() {
  if (LVL === 1) return L1.cap.slice();
  if (LVL === 2) return [L2.first, cfg.b2, cfg.b2];
  if (LVL === 3) return [L3.side, cfg.b3, L3.side];
  return [cfg.b4, cfg.b4, cfg.b4];
}
function fresh() {
  if (LVL === 1) { L = lineSim([L1.cyc[0], L1.cyc[1], cfg.l1, L1.cyc[3]], capsNow(), []); L.jam = [0, 0, 0, 0]; while (L.t < 900) L.step(DT); }
  else if (LVL === 2) {
    // earlier jams moved the queue behind station 3; the next comes on its own after a few seconds, then every hour
    L = lineSim(L2.cyc, capsNow(), [[], [], periodic(3600 + 100, L2.every, L2.jam, 3600 * 200), []]);
    L.jam[L2.at] = 300 + L2.jam;
    while (L.t < 3600) L.step(DT);
  } else if (LVL === 3) { L = lineSim(L3.cyc, capsNow(), [[], periodic(600, cfg.every * 60, L3.stop, 3600 * 200), [], []]); while (L.t < 3600 - 120) L.step(DT); }
  else { L = lineSim(L4.cyc, capsNow(), cfg.mode === "fixed" ? [0, 1, 2, 3].map((i) => periodic(1800 * i + 900, L4.fixed.every, L4.fixed.dur, 3600 * 200)) : SPREAD.map((a) => a.slice()), [0, 0, 0, 0]); L.jam = [0, 0, 0, 0]; while (L.t < 1800) L.step(DT); }
  L.outs.length = 0;
  for (const [id, v] of views) { v.el.style.display = "none"; v.el.removeAttribute("transform"); free.push(v.el); views.delete(id); }
  pads.forEach((pad) => { const [j, q] = pad.dataset.pad.split("-").map(Number); if (q < capsNow()[j]) pad.setAttribute("data-on", ""); else pad.removeAttribute("data-on"); });
}

// ------------------------------------------------ parts on the belt
const views = new Map();
const free = pool.slice();
function targetOf(id) {
  for (let i = 0; i < ST.length; i++) {
    if (L.st[i].part === id) return { x: ST[i] };
    if (i < 3) { const j = L.buf[i].indexOf(id); if (j >= 0) return { x: slotX(i, j) }; }
  }
  return { x: TOTE_X, out: true };
}
function syncParts(dt, calm) {
  const ids = new Set();
  L.st.forEach((st) => st.part && ids.add(st.part));
  L.buf.forEach((b) => b.forEach((id) => ids.add(id)));
  while (L.outs.length > 3) L.outs.shift();
  L.outs.forEach((id) => ids.add(id));
  const follow = calm ? 1 : 1 - Math.exp(-dt / 0.12);
  for (const id of ids) {
    const want = targetOf(id);
    let v = views.get(id);
    if (!v) {
      const el = free.pop(); if (!el) continue;
      el.style.display = "";
      v = { el, x: want.x, z: 0, a: calm ? 1 : 0, born: true };
      views.set(id, v);
    }
    v.x += (want.x - v.x) * follow; if (Math.abs(want.x - v.x) < 0.02) v.x = want.x;
    if (v.born) { v.a = Math.min(1, v.a + (calm ? 1 : dt / 0.25)); if (v.a >= 1) v.born = false; }
    const fall = smooth(BELT_END - 2, TOTE_X, v.x);
    v.z = -(BT - TOTE_H + PART_H + 2) * fall * fall;
    if (want.out) v.a = 1 - smooth(0.55, 1, fall);
  }
  for (const [id, v] of views) {
    if (!ids.has(id) || (v.a <= 0.01 && !v.born)) {
      v.el.style.display = "none"; v.el.removeAttribute("transform"); free.push(v.el); views.delete(id);
      const q = L.outs.indexOf(id); if (q >= 0) L.outs.splice(q, 1);
    }
  }
  const order = [...views.values()].sort((a, b) => a.x - b.x);
  order.forEach((v) => {
    v.el.setAttribute("transform", translateAlong(P, [v.x, 0, v.z]));
    v.el.style.opacity = v.a < 1 ? v.a.toFixed(3) : "";
  });
  const frag = document.createDocumentFragment(); order.forEach((v) => frag.appendChild(v.el)); partsLayer.appendChild(frag);
}

// ------------------------------------------------ rams and lamps
const ramZ = ST.map(() => 0);
function drawStations(dt, calm) {
  const blink = calm || Math.sin(performance.now() / 170) > -0.2;
  L.st.forEach((st, i) => {
    let want = ramZ[i];
    if (st.state === "run") want = -STROKE * smooth(0.12, 0.38, st.phase) * (1 - smooth(0.62, 0.88, st.phase));
    else if (st.state !== "fault") want = 0;
    ramZ[i] = calm || st.state === "run" ? want : ramZ[i] + (want - ramZ[i]) * (1 - Math.exp(-dt / 0.12));
    rams[i].setAttribute("transform", translateAlong(P, [0, 0, ramZ[i]]));
    const on = [st.state === "run", st.state === "blocked" || st.state === "starved", st.state === "fault" && blink];
    stacks[i].forEach((el, q) => { if (on[q]) el.setAttribute("data-on", ""); else el.removeAttribute("data-on"); });
  });
}

// ------------------------------------------------ readout
let marked = -1;
function namesNow() { return LVL === 1 ? T.names1 : LVL === 3 ? T.names3 : T.names.map((n) => T.st + n); }
function statesLine() {
  const nm = namesNow();
  return L.st.map((st, i) => nm[i] + " " + (st.state === "run" ? T.run : st.state === "fault" ? "<span class='la-strong'>" + T.fault + "</span>" : "<span class='la-mute'>" + T[st.state] + "</span>")).join(" · ");
}
let lastStates = "";
function readout() {
  const out = [statesLine()];
  if (LVL === 1) {
    const cyc = [L1.cyc[0], L1.cyc[1], cfg.l1, L1.cyc[3]];
    const slow = cyc.indexOf(Math.max(...cyc));
    const shift = Math.floor(SHIFT / cyc[slow]);
    out.push(T.cyc + " " + cyc.join(" · ") + " s");
    out.push(T.takt + " 60 s · " + T.bn + " <span class='la-strong'>" + T.names1[slow] + " " + cyc[slow] + " s</span>");
    out.push("<span class='la-acc'>" + shift + "</span> " + T.shift + " · " + (shift < L1.demand ? (L1.demand - shift) + " " + T.short : T.meets));
    if (marked >= 0) { const p = T.parts[PARTS[marked].key]; out.push("<span class='la-strong'>" + p[0] + "</span>: " + p[1]); }
    else out.push("<span class='la-mute'>" + T.tap + "</span>");
  } else if (LVL === 2) {
    const r = TABLE2[cfg.b2];
    out.push(T.jamNeed + " · " + T.now + " <span class='la-acc'>" + cfg.b2 + "</span>");
    out.push(T.blk + " " + mmss(r.blocked) + " · " + T.stv + " " + mmss(r.starved) + " " + T.per1);
    out.push(T.lost + " <span class='" + (r.lost ? "la-strong" : "la-acc") + "'>" + (r.lost ? r.lost + " " + T.products : T.none) + "</span> " + T.per1);
  } else if (LVL === 3) {
    const n = cfg.b3, fill = n * 3, run = cfg.every - 3;
    out.push(T.size3 + " · " + T.now + " <span class='la-acc'>" + n + "</span>");
    out.push(T.refill + ": " + n + " → " + fill + " " + T.inMin);
    out.push(T.runs + " " + run + " " + T.between + " · " + (fill <= run ? (run - fill) + " " + T.inMin + " " + T.spare : "<span class='la-strong'>" + T.late + "</span>"));
    out.push(T.outC + " <span class='la-acc'>" + fmt(TABLE3[cfg.every][n], 1) + T.per + "</span> " + T.of + " 100");
  } else {
    const r = TABLE4[cfg.mode][cfg.b4], o = TABLE4[cfg.mode === "fixed" ? "spread" : "fixed"][cfg.b4];
    out.push(T.out4 + " <span class='la-acc'>" + fmt(r.out, 1) + T.per + "</span> · " + T.wip + " <span class='la-acc'>" + fmt(r.wip, 1) + "</span>");
    out.push(T.lead + " " + fmt(r.wip, 1) + " / " + fmt(r.out, 1) + " = <span class='la-strong'>" + fmt(r.wip / r.out * 60, 1) + " min</span> " + T.little);
    out.push(T.same + " · " + (cfg.mode === "fixed" ? T.spread : T.fixed) + " " + fmt(o.out, 1) + T.per);
  }
  out.forEach((h, i) => { if (lines[i] && lines[i].innerHTML !== h) lines[i].innerHTML = h; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
function syncControls() {
  document.querySelectorAll("[data-ctl]").forEach((group) => {
    const key = group.dataset.ctl;
    const list = key === "l1" ? L1.steps : [0, 1, 2, 3, 4, 5, 6];
    const v = cfg[key];
    group.querySelector(".la-val").textContent = key === "l1" ? v + " s" : String(v);
    const i = list.indexOf(v);
    group.querySelector('[data-d="-1"]').disabled = i <= 0;
    group.querySelector('[data-d="1"]').disabled = i >= list.length - 1;
  });
  document.querySelectorAll("[data-set]").forEach((b) => {
    const [key, val] = b.dataset.set.split(":");
    const on = String(cfg[key]) === val;
    b.setAttribute("aria-checked", on ? "true" : "false");
    b.tabIndex = on ? 0 : -1;
  });
}

// ------------------------------------------------ frame
let wasDown = false;
function draw(dt, calm) {
  syncParts(dt, calm);
  drawStations(dt, calm);
  readout();
  if (marked >= 0) {
    const [x, y] = at(PARTS[marked].at);
    markRing.setAttribute("cx", x.toFixed(1)); markRing.setAttribute("cy", y.toFixed(1)); markRing.setAttribute("r", "9");
    ringDot.setAttribute("cx", x.toFixed(1)); ringDot.setAttribute("cy", y.toFixed(1)); ringDot.setAttribute("r", "1.6");
  } else { markRing.setAttribute("r", "0"); ringDot.setAttribute("r", "0"); }
  const watch = LVL === 3 ? 1 : 2;
  const down = L.st[watch].state === "fault";
  if (LVL >= 2 && down !== wasDown) { wasDown = down; announcer.textContent = down ? (LVL === 3 ? T.stopB : T.jamNow) + "." : T.back + "."; }
}

// ------------------------------------------------ time
let frame = 0, last = 0, visible = false, acc = 0;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (!calm) {
    acc += dt * TS;
    while (acc >= DT) { L.step(DT); acc -= DT; }
    if (L.t > 3600 * 70) fresh();
  }
  draw(dt, calm);
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };

function setValue(key, dir) {
  const list = key === "l1" ? L1.steps : [0, 1, 2, 3, 4, 5, 6];
  const i = clamp(list.indexOf(cfg[key]) + dir, 0, list.length - 1);
  if (list[i] === cfg[key]) return;
  cfg[key] = list[i];
  if (key === "l1") L.cyc[2] = cfg.l1; else fresh();
  syncControls(); draw(1, true); kick();
}
function setOpt(key, val) {
  const v = key === "every" ? Number(val) : val;
  if (cfg[key] === v) return;
  cfg[key] = v; fresh(); syncControls(); draw(1, true); kick();
}
function jam() {
  if (LVL === 2) L.jam[L2.at] = Math.max(L.jam[L2.at], L.t + L2.jam);
  else if (LVL === 3) L.jam[L3.at] = Math.max(L.jam[L3.at], L.t + L3.stop);
  else return;
  if (still.matches) { const end = L.t + 30; while (L.t < end) L.step(DT); }
  kick();
}
document.querySelectorAll("[data-ctl]").forEach((group) => {
  group.querySelectorAll(".la-btn").forEach((b) => b.addEventListener("click", () => setValue(group.dataset.ctl, Number(b.dataset.d))));
});
document.querySelectorAll("[data-set]").forEach((b) => b.addEventListener("click", () => { const [key, val] = b.dataset.set.split(":"); setOpt(key, val); }));
document.querySelectorAll("[data-radios]").forEach((g) => g.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
  event.preventDefault(); event.stopPropagation();
  const items = [...g.querySelectorAll("[data-set]")];
  const cur = items.findIndex((b) => b.getAttribute("aria-checked") === "true");
  const next = items[(cur + (event.key === "ArrowLeft" || event.key === "ArrowUp" ? items.length - 1 : 1)) % items.length];
  next.click(); next.focus();
}));
document.querySelectorAll("[data-jam]").forEach((b) => b.addEventListener("click", jam));
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [p.x, p.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 60;
  PARTS.forEach((part, i) => { const [px, py] = at(part.at); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL === 1) { marked = nearestPart(toView(event)); draw(1, true); announcer.textContent = marked >= 0 ? T.parts[PARTS[marked].key].join(": ") : ""; kick(); }
  else jam();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  const ctl = { 1: "l1", 2: "b2", 3: "b3", 4: "b4" }[LVL];
  if (LVL === 1 && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
    marked = (marked + (event.key === "ArrowRight" ? 1 : PARTS.length - 1 + (marked < 0 ? 1 : 0))) % PARTS.length;
    draw(1, true); announcer.textContent = T.parts[PARTS[marked].key].join(": ");
  } else if (event.key === "ArrowUp") setValue(ctl, 1);
  else if (event.key === "ArrowDown") setValue(ctl, -1);
  else if (event.key === " " || event.key === "Enter") jam();
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
fresh();
syncControls();
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) kick();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { cancelAnimationFrame(frame); frame = 0; kick(); });
draw(1, true);
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Buffers in een lijn",
    hint1: "Tik een onderdeel · maak het deksel sneller",
    hint2: "Kies de buffer · geef een storing",
    hint3: "Kies de buffer en hoe vaak B stopt",
    hint4: "Kies de buffers en de soort stops",
    time1: "1 s = 20 s",
    l1: "cyclustijd deksel",
    b2: "plekken voor en na st. 3",
    jam: "Storing 4 min",
    b3: "buffer B → C",
    every20: "elke 20 min",
    every10: "elke 10 min",
    b4: "plekken per buffer",
    fixed: "Vast",
    spread: "Gespreid",
    stops: "Soort stops",
    stopsB: "Hoe vaak B stopt",
    less: "minder",
    more: "meer",
    label: LABEL_NL,
    aria: "Assemblagelijn met vier stations en buffers. Pijl omhoog en omlaag veranderen de instelling. Niveau 1: pijl links en rechts kiezen een onderdeel. Niveau 2 en 3: spatie of Enter geeft een storing.",
  },
  en: {
    title: "Buffers in a line",
    hint1: "Tap a part · make the cover faster",
    hint2: "Pick the buffer · cause a jam",
    hint3: "Pick the buffer and how often B stops",
    hint4: "Pick the buffers and the kind of stops",
    time1: "1 s = 20 s",
    l1: "cover cycle time",
    b2: "places before and after st. 3",
    jam: "Jam 4 min",
    b3: "buffer B → C",
    every20: "every 20 min",
    every10: "every 10 min",
    b4: "places per buffer",
    fixed: "Fixed",
    spread: "Spread",
    stops: "Kind of stops",
    stopsB: "How often B stops",
    less: "less",
    more: "more",
    label: LABEL_EN,
    aria: "Assembly line with four stations and buffers. Up and down arrows change the setting. Level 1: left and right arrows pick a part. Levels 2 and 3: Space or Enter causes a jam.",
  },
};
const sN = STRINGS.nl;
const stepper = (key) =>
  `<div class="la-group" data-ctl="${key}"><span class="la-group-label" data-t="${key}">${sN[key]}</span><button type="button" class="la-btn" data-d="-1" data-t-aria="${key}:less" aria-label="${sN[key]} ${sN.less}">&#8722;</button><span class="la-val" aria-live="polite"></span><button type="button" class="la-btn" data-d="1" data-t-aria="${key}:more" aria-label="${sN[key]} ${sN.more}">+</button></div>`;
const radio = (set, key) => `<button type="button" class="la-opt" role="radio" data-set="${set}" data-t="${key}" aria-checked="false" tabindex="-1">${sN[key]}</button>`;
const controls = [
  `<div class="la-controls">`,
  `<div class="la-row" data-levels="1">${stepper("l1")}</div>`,
  `<div class="la-row" data-levels="2">${stepper("b2")}<div class="la-opts" style="flex:0 0 auto"><button type="button" class="la-opt" data-jam="" data-t="jam" style="padding:0 10px">${sN.jam}</button></div></div>`,
  `<div class="la-row" data-levels="3">${stepper("b3")}<div class="la-opts" role="radiogroup" data-radios="" aria-label="${sN.stopsB}" data-t-label="stopsB">${radio("every:20", "every20")}${radio("every:10", "every10")}</div></div>`,
  `<div class="la-row" data-levels="4">${stepper("b4")}<div class="la-opts" role="radiogroup" data-radios="" aria-label="${sN.stops}" data-t-label="stops">${radio("mode:fixed", "fixed")}${radio("mode:spread", "spread")}</div></div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="la-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="la-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="la-line"></span>'.repeat(5)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
var l=Number(q.get("level"));d.setAttribute("data-level",String(l>=1&&l<=4?l:2));
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";var s=en?${JSON.stringify(STRINGS.en)}:${JSON.stringify({ ...STRINGS.nl, label: undefined })};
var lv=document.documentElement.getAttribute("data-level");document.querySelector("[data-hint]").textContent=s["hint"+lv]||s.hint2;
if(!en)return;
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
document.querySelectorAll("[data-t]").forEach(function(n){n.textContent=s[n.getAttribute("data-t")];});
document.querySelectorAll("[data-t-aria]").forEach(function(n){var p=n.getAttribute("data-t-aria").split(":");n.setAttribute("aria-label",s[p[0]]+" "+s[p[1]]);});
document.querySelectorAll("[data-t-label]").forEach(function(n){n.setAttribute("aria-label",s[n.getAttribute("data-t-label")]);});
var st=document.querySelector(".la-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`L1 output /h by cover cycle ${L1.steps.join("/")}: ${TABLE1.join(" ")}`);
console.log(`L2 per 4-min jam, places 0..6: lost ${TABLE2.map((r) => r.lost).join(" ")} · st.2 blocked s ${TABLE2.map((r) => r.blocked).join(" ")}`);
console.log(`L3 output /h, places 0..6: every 20 min ${TABLE3[20].join(" ")} | every 10 min ${TABLE3[10].join(" ")} · refill 5 places ${REFILL3.toFixed(1)} min`);
console.log(`L4 places 0..6: fixed ${TABLE4.fixed.map((r) => `${r.out}/${r.wip}/${r.lead}`).join(" ")}`);
console.log(`              spread ${TABLE4.spread.map((r) => `${r.out}/${r.wip}/${r.lead}`).join(" ")} · stop share ${SHARE4.map((s) => (s * 100).toFixed(1)).join(" ")} %`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P);
