// Dev tool, not shipped. Builds the standalone figure for the lesson
// "N-1 and redundancy" (module Grid planning, grid track).
//
//   node figures/eng.gridplanning.n1/build.mjs            build the page
//   node figures/eng.gridplanning.n1/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.gridplanning.n1.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark and ?lang=nl|en from its URL (defaults: prefers-color-scheme,
// Dutch).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { finishFigure } from "../_kit/phone.mjs";

const SKILL =
  process.env.ANATOMY_SKILL ??
  "/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy";
const k = await import(pathToFileURL(join(SKILL, "kit/iso-kit.mjs")).href);
const G = await import(pathToFileURL(join(SKILL, "kit/lathe.mjs")).href);
const A = await import(pathToFileURL(join(SKILL, "kit/audit.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.gridplanning.n1.html");

// ---------------------------------------------------------------- the model
// The lesson's station: an HS/MS substation with two 40 MVA power transformers
// feeding one MS rail (bus coupler closed). Under N-1 the worst single outage is
// one transformer: the other must then carry the whole load, so the firm
// capacity is 40 MVA, not 80.
// Load per transformer in normal operation = net / 2; after a trip = net.
// Net load = peak − what a battery on the MS rail delivers at the peak (it
// discharges into the peak; counted 1:1 against the station load).
// Limit: 100 % of the rating. The lesson says transformers can be overloaded
// for some hours in cold weather but gives no figure, so no overload margin is
// counted here.
const RATING = 40; // MVA per transformer
const UNITS = 2;
const FIRM = (UNITS - 1) * RATING;
const LOAD = { min: 20, max: 60, step: 2, start: 46 }; // MVA peak
const BATT = { min: 0, max: 12, step: 2, start: 0 }; // MVA
const net = (peak, batt) => Math.max(0, peak - batt);
const perUnit = (peak, batt, tripped) => net(peak, batt) / (tripped ? UNITS - 1 : UNITS);
const pctOf = (mva) => (100 * mva) / RATING;
const shortOf = (peak, batt) => Math.max(0, net(peak, batt) - FIRM);
{
  // the lesson's numbers (EN and NL) and its worked answer
  const en = (await import(pathToFileURL(join(ROOT, "src/content/courses/eng/gridplanning.en.js")).href)).default;
  const nl = (await import(pathToFileURL(join(ROOT, "src/content/courses/eng/gridplanning.nl.js")).href)).default;
  const lesson = (m) => m.lessons.find((l) => l.id === "eng.gridplanning.redundancy");
  const e = lesson(en);
  const n = lesson(nl);
  if (!e || !n) throw new Error("lesson eng.gridplanning.redundancy not found");
  const want = [
    [e.example.text, "two 40 MVA transformers"],
    [e.example.text, "Peak load is 46 MVA"],
    [e.example.text, "4 MVA battery"],
    [e.example.reveal, "Firm capacity is about 40 MVA"],
    [e.example.reveal, "6 MVA over N-1"],
    [e.example.reveal, "the other carries 46 MVA, 115%"],
    [e.example.reveal, "80 − 46 = 34 MVA"],
    [e.example.reveal, "peak is 52 MVA"],
    [n.example.text, "twee trafo’s van 40 MVA"],
    [n.example.text, "piekbelasting is 46 MVA"],
    [n.example.text, "batterij van 4 MVA"],
    [n.example.reveal, "6 MVA boven N-1"],
    [n.example.reveal, "de andere 46 MVA, 115%"],
  ];
  for (const [text, s] of want) if (!text.includes(s)) throw new Error(`lesson text changed: ${s}`);
  if (FIRM !== 40) throw new Error("firm capacity must be 40 MVA");
  if (Math.round(pctOf(perUnit(46, 0, true))) !== 115) throw new Error("46 MVA on one transformer must be 115 %");
  if (shortOf(46, 0) !== 6) throw new Error("46 MVA must be 6 MVA over N-1");
  if (UNITS * RATING - 46 !== 34) throw new Error("idle reserve at 46 MVA must be 34 MVA");
  if (shortOf(52, 0) !== 12) throw new Error("52 MVA must be 12 MVA over N-1");
  const three = e.recall.find((r) => r.number !== undefined);
  if (three.number !== (3 - 1) * 25) throw new Error("recall: three 25 MVA units give 50 MVA firm");
  for (const v of [46, 52, 40]) if ((v - LOAD.min) % LOAD.step) throw new Error(`load steps must reach ${v}`);
  if ((4 - BATT.min) % BATT.step || (6 - BATT.min) % BATT.step) throw new Error("battery steps must reach 4 and 6");
}

// ---------------------------------------------------------------- the world
// World units are decimetres, z up, +x to the right, +y toward the viewer.
// Back row: two transformers in oil bunds with a fire wall between them.
// Front row: the MS switchgear (feeders, two incomers, the bus coupler and a
// battery feeder) with the MS rail on top. Right: a battery container.
const WIDTH = 600;
const YARD = { x: -66, y: -62, w: 178, d: 102, r: 2 };
const YARD_Z = -4;
const TX = [-35, 35];
const TY = -38;
const TANK_Z = [5, 41];
const COVER_Z = [41, 43];
const SW = { x: -56, y: 6, w: 112, d: 14 };
const FACE = SW.y + SW.d; // 20, the switchgear front
const CUB_W = 14;
const CUB_Z = [2, 32];
const HOOD_Z = [32, 34];
const RAIL_Z = [36, 37.6];
const CUBS = ["f1", "in1", "f2", "bc", "f3", "f4", "in2", "bat"];
const cubX = (i) => SW.x + i * CUB_W;
const cubC = (name) => cubX(CUBS.indexOf(name)) + CUB_W / 2;
const CONT = { x: 72, y: 0, w: 34, d: 22, r: 0.6 };
const CONT_Z = [2, 27];
// bar meters on the incomer doors and the battery door (face-plane units)
const METER = { w: 4.4, z0: 14, z1: 28, max: 150 };
const BMETER = { w: 4.4, z0: 8, z1: 20 };

const FIT = [
  ...k.boxCorners(YARD, YARD_Z, 0),
  ...TX.map((x) => [x, TY - 3, 64]),
  ...k.boxCorners(SW, 0, RAIL_Z[1]),
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 50);
const ELEVATION = Number(process.env.EL ?? 36);
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
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 4) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);

// ---------------------------------------------------------------- recorder
const R = A.recorder(P, {});
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, attrs });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", owner, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
const onFace = (y, inner) => `<g transform="${planeOf(y)}">${inner}</g>`;

// ---------------------------------------------------------------- the yard
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(YARD, -2), YARD_Z, 2, P)}"/>`];
{
  const corners = k.corners(YARD, 5);
  const extra =
    L(k.planOutline(k.insetPlan(YARD, 3), 0, P, 3), { tone: "faint" }) +
    Dt(corners.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box("stand.yard", YARD, YARD_Z, 0, { tone: "lo" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(YARD, -1.6, P, 3), { tone: "faint" }), extra });
}

// ---------------------------------------------------------------- the transformers
function transformer(index) {
  const cx = TX[index];
  const tag = `t${index + 1}`;
  // oil bund: a low concrete tub with a gravel bed, the tank on two skids
  const bund = { x: cx - 25, y: TY - 20, w: 50, d: 39, r: 1 };
  box(`${tag}.bund`, bund, 0, 3, { tone: "lo" }, {
    steps: 2,
    bevel: 0.4,
    extra: L(k.planOutline(k.insetPlan(bund, 2), 3, P, 2), { tone: "faint" }) + Dt(k.corners(bund, 1.2).map(([x, y]) => at([x, y, 3])), { size: 0.4 }),
  });
  for (const dy of [-6, 6]) box(`${tag}.skid`, { x: cx - 17, y: TY + dy - 2, w: 34, d: 4, r: 0.4 }, 3, TANK_Z[0], { tone: "mid" }, { steps: 2 });
  const tank = { x: cx - 18, y: TY - 11, w: 36, d: 22, r: 1.6 };
  const seams = k.sideSeam(tank, 9, P, 3) + k.sideSeam(tank, TANK_Z[1] - 3, P, 3);
  // the nameplate on the front face
  const npY = tank.y + tank.d;
  const np = [
    onFace(npY, `<path class="tl-card" d="${flatRect(cx - 15, 13, cx - 7, 18.4, 0.3, 2)}"/>` + `<path class="iso-line" data-tone="lo" data-free="" d="M${cx - 13.8} ${-17}H${cx - 8.4}M${cx - 13.8} ${-15.6}H${cx - 9.8}M${cx - 13.8} ${-14.2}H${cx - 9}"/>`),
    k.faceTextSvg(k.sideMatrix([cx - 15, npY], 29.5, P, "left"), tag.toUpperCase(), { size: 4.2, tone: "hi" }),
    // the overload band: a petrol stripe round the tank top that shows above 100 %
    onFace(npY, `<path class="tl-band" data-band="${index}" d="${flatRect(cx - 17.2, 35.2, cx + 17.2, 37.4, 0.2, 2)}"/>`),
  ].join("");
  box(`${tag}.tank`, tank, TANK_Z[0], TANK_Z[1], { tone: "hi", crease: "lo" }, { steps: 3, bevel: 0.5, inner: L(seams, { tone: "faint" }), extra: np });
  // radiator fins on the front face, standing on a header bar
  for (const dx of [0, 5, 10, 15]) {
    box(`${tag}.fin`, { x: cx + dx - 0.6, y: npY, w: 1.2, d: 7, r: 0.4 }, 10, 34, { tone: "hi", crease: "lo" }, { steps: 2 });
  }
  const cover = k.insetPlan(tank, -1);
  const bolts = [];
  for (let x = cover.x + 3; x <= cover.x + cover.w - 2.5; x += 6) bolts.push([x, cover.y + 1], [x, cover.y + cover.d - 1]);
  box(`${tag}.cover`, cover, COVER_Z[0], COVER_Z[1], { tone: "hi" }, {
    steps: 3,
    bevel: 0.4,
    extra:
      `<path class="tl-heat" data-heat="${index}" d="${k.planOutline(k.insetPlan(cover, 0.3), COVER_Z[1], P, 3)}"/>` +
      L(k.planOutline(k.insetPlan(cover, 2.4), COVER_Z[1], P, 3), { tone: "faint" }) +
      Dt(bolts.map(([x, y]) => at([x, y, COVER_Z[1]])), { size: 0.38, tone: "mid" }),
  });
  // HS bushings at the back of the cover: a flange, a porcelain body with sheds, a terminal
  for (const dx of [-9, 0, 9]) {
    const x = cx + dx;
    const y = TY - 5;
    const z0 = COVER_Z[1];
    const sheds = [4, 7, 10, 13].map((h) => k.sideArc(x, y, 2.2, z0 + h, P, 14)).join("");
    post(`${tag}.hs`, x, y, 2.2, z0, z0 + 16, { tone: "hi", crease: "none" }, { owner: tag, steps: 20, inner: L(sheds, { tone: "lo" }) });
    post(`${tag}.hs-cap`, x, y, 1.1, z0 + 16, z0 + 18.4, { tone: "mid" }, { owner: tag, steps: 14, extra: Dt([at([x, y, z0 + 18.4])], { size: 0.5, tone: "hi" }) });
  }
  // MS bushings at the front of the cover
  for (const dx of [-7, 0, 7]) {
    const x = cx + dx;
    const y = TY + 6;
    post(`${tag}.ms`, x, y, 1.5, COVER_Z[1], COVER_Z[1] + 6, { tone: "hi", crease: "none" }, { owner: tag, steps: 16, inner: L(k.sideArc(x, y, 1.5, COVER_Z[1] + 3, P, 12), { tone: "lo" }), extra: Dt([at([x, y, COVER_Z[1] + 6])], { size: 0.45, tone: "hi" }) });
  }
  // conservator on two stands at the back corner
  const cy = TY - 9;
  for (const dx of [-15, -9]) post(`${tag}.stand`, cx + dx, cy, 0.8, COVER_Z[1], COVER_Z[1] + 4.2, { tone: "mid" }, { owner: tag, steps: 12 });
  const FC = frameX([cx - 17, cy, COVER_Z[1] + 7.6]);
  discAt(`${tag}.conservator`, FC, 0, 10, 3.4, { tone: "hi", crease: "lo" }, { owner: tag, inner: L(G.arcOf(FC, 1.2, 3.4, P) + G.arcOf(FC, 8.8, 3.4, P), { tone: "faint" }) });
}
transformer(0);
transformer(1);

// the fire wall between the two bunds
{
  const wall = { x: -3, y: TY - 20, w: 6, d: 34, r: 0.4 };
  const seams = [12, 24, 36, 48].map((z) => k.sideSeam(wall, z, P, 2)).join("");
  box("wall", wall, 0, 56, { tone: "mid" }, { steps: 2, bevel: 0.5, inner: L(seams, { tone: "faint" }) });
}

// ---------------------------------------------------------------- cable trenches
// Concrete trench covers on the yard: transformer to incomer, feeders out to the
// street, and the battery cable. The live flow line runs along the cover's top.
function trench(name, plan, axis, flow = "") {
  const out = [];
  const joints = [];
  if (axis === "y") for (let y = plan.y + 6; y < plan.y + plan.d - 2; y += 6) joints.push(k.lineOnTop([plan.x, y], [plan.x + plan.w, y], 1.2, P));
  else for (let x = plan.x + 6; x < plan.x + plan.w - 2; x += 6) joints.push(k.lineOnTop([x, plan.y], [x, plan.y + plan.d], 1.2, P));
  out.push(L(joints.join(""), { tone: "faint" }));
  if (flow) {
    const a = axis === "y" ? [plan.x + plan.w / 2, plan.y] : [plan.x, plan.y + plan.d / 2];
    const b = axis === "y" ? [plan.x + plan.w / 2, plan.y + plan.d] : [plan.x + plan.w, plan.y + plan.d / 2];
    out.push(`<path class="tl-flow" data-flow="${flow}" d="${k.lineOnTop(a, b, 1.2, P)}"/>`);
  }
  box(name, plan, 0, 1.2, { tone: "lo" }, { steps: 2, extra: out.join("") });
}
for (const [i, x] of TX.entries()) trench(`trench.t${i + 1}`, { x: x - 3, y: TY + 19, w: 6, d: SW.y - 1 - (TY + 19), r: 0.2 }, "y", `t${i + 1}`);
for (const f of ["f1", "f2", "f3", "f4"]) trench(`trench.${f}`, { x: cubC(f) - 2.5, y: FACE + 1, w: 5, d: YARD.y + YARD.d - 5 - FACE, r: 0.2 }, "y", "out");
trench("trench.bat", { x: SW.x + SW.w + 1, y: 10, w: CONT.x - (SW.x + SW.w + 1), d: 6, r: 0.2 }, "x", "bat");

// ---------------------------------------------------------------- the MS switchgear
{
  const plinth = { x: SW.x - 1, y: SW.y - 1, w: SW.w + 2, d: SW.d + 2, r: 0.4 };
  box("sw.plinth", plinth, 0, CUB_Z[0], { tone: "lo" }, { steps: 2 });
}
function meterSvg(cx, key) {
  // a vertical bar meter in a window: 0–150 % with a long tick at 100 %
  const x0 = cx - METER.w / 2;
  const x1 = cx + METER.w / 2;
  const zAt = (pct) => METER.z0 + ((METER.z1 - METER.z0) * pct) / METER.max;
  const ticks = [0, 50, 100, 150].map((p) => `M${x1} ${(-zAt(p)).toFixed(2)}h${p === 100 ? 2.4 : 1.2}`).join("");
  return [
    `<path class="tl-glass" d="${flatRect(x0, METER.z0, x1, METER.z1, 0.3, 2)}"/>`,
    `<rect class="tl-bar" data-bar="${key}" x="${x0 + 0.5}" width="${METER.w - 1}" y="${-METER.z0}" height="0"/>`,
    `<rect class="tl-over" data-over="${key}" x="${x0 + 0.5}" width="${METER.w - 1}" y="${-zAt(100)}" height="0"/>`,
    `<path class="iso-line" data-tone="mid" d="M${x0} ${(-zAt(100)).toFixed(2)}H${x1 + 2.4}"/>`,
    `<path class="iso-line" data-tone="lo" d="${ticks}"/>`,
    `<path class="iso-line" data-tone="lo" d="${flatRect(x0, METER.z0, x1, METER.z1, 0.3, 2)}"/>`,
  ].join("");
}
function mimicSvg(cx, key) {
  // a one-line mimic: busbar stub, breaker blade (closed or open), cable stub
  return [
    `<path class="iso-line" data-tone="lo" d="M${cx} ${-12.6}V${-11}M${cx} ${-8}V${-6.4}"/>`,
    `<path class="iso-line" data-tone="hi" data-blade="${key}" data-cx="${cx}" data-free="end" d="M${cx} ${-8}L${cx} ${-11}"/>`,
    `<circle class="tl-pin" cx="${cx}" cy="-12.6" r="0.45"/><circle class="tl-pin" cx="${cx}" cy="-11" r="0.45"/><circle class="tl-pin" cx="${cx}" cy="-8" r="0.45"/><circle class="tl-pin" cx="${cx}" cy="-6.4" r="0.45"/>`,
  ].join("");
}
CUBS.forEach((name, i) => {
  const x0 = cubX(i);
  const cx = x0 + CUB_W / 2;
  const plan = { x: x0 + 0.15, y: SW.y, w: CUB_W - 0.3, d: SW.d, r: 0.3 };
  const door = flatRect(x0 + 1.2, 4, x0 + CUB_W - 1.2, 30.6, 0.6, 3);
  const bits = [`<path class="iso-line" data-tone="lo" d="${door}"/>`];
  if (name.startsWith("in")) {
    bits.push(meterSvg(cx - 1.4, name === "in1" ? "0" : "1"));
    bits.push(mimicSvg(cx + 3.2, name === "in1" ? "0" : "1"));
  } else if (name === "bc") {
    bits.push(`<path class="iso-line" data-tone="lo" d="M${cx - 3} ${-9.5}H${cx - 0.9}M${cx + 0.9} ${-9.5}H${cx + 3}"/>`, `<path class="iso-line" data-tone="hi" d="M${cx - 0.9} ${-9.5}H${cx + 0.9}"/>`);
    bits.push(`<circle class="tl-pin" cx="${cx - 3}" cy="-9.5" r="0.45"/><circle class="tl-pin" cx="${cx - 0.9}" cy="-9.5" r="0.45"/><circle class="tl-pin" cx="${cx + 0.9}" cy="-9.5" r="0.45"/><circle class="tl-pin" cx="${cx + 3}" cy="-9.5" r="0.45"/>`);
    bits.push(`<path class="tl-card" d="${flatRect(cx - 3.5, 20, cx + 3.5, 26, 0.3, 2)}"/>`, `<path class="iso-line" data-tone="lo" data-free="" d="M${cx - 2.4} ${-24.4}H${cx + 2.2}M${cx - 2.4} ${-22.9}H${cx + 1}M${cx - 2.4} ${-21.4}H${cx + 1.8}"/>`);
  } else {
    // feeder: a small viewing window, a label card and the cable test sockets
    if (name !== "bat") bits.push(`<path class="tl-glass" d="${flatRect(cx - 3, 21, cx + 3, 28, 0.4, 2)}"/>`, `<path class="iso-line" data-tone="lo" d="${flatRect(cx - 3, 21, cx + 3, 28, 0.4, 2)}"/>`);
    bits.push(`<path class="tl-card" d="${flatRect(cx - 3, 15, cx + 3, 19.5, 0.3, 2)}"/>`, `<path class="iso-line" data-tone="lo" data-free="" d="M${cx - 2} ${-18.3}H${cx + 2}M${cx - 2} ${-16.9}H${cx + 0.8}"/>`);
  }
  const handle = Dt([at([x0 + CUB_W - 2.6, FACE, 17])], { size: 0.55, tone: "hi" });
  const screws = Dt([[x0 + 1.9, 5], [x0 + CUB_W - 1.9, 5], [x0 + 1.9, 29.6], [x0 + CUB_W - 1.9, 29.6]].map(([x, z]) => at([x, FACE, z])), { size: 0.36 });
  box(`sw.${name}`, plan, CUB_Z[0], CUB_Z[1], { tone: "mid" }, { steps: 2, bevel: 0.3, extra: onFace(FACE, bits.join("")) + handle + screws });
});
// lamps: overload lamp on each incomer, running lamp on the battery feeder
const LAMPS = [["in1", "0"], ["in2", "1"], ["bat", "b"]];
for (const [name, key] of LAMPS) {
  const cx = cubC(name) + (name === "bat" ? 0 : 3.2);
  const FL = frameY([cx, FACE, name === "bat" ? 24.5 : 27.4]);
  discAt(`sw.lamp-ring`, FL, 0, 0.5, 1.6, { tone: "mid" }, {});
  discAt(`sw.lamp`, FL, 0.5, 1.1, 1.1, { tone: "hi", crease: "none" }, { attrs: ` data-lamp="${key}"` });
}
{
  const hood = { x: SW.x - 1, y: SW.y - 1, w: SW.w + 2, d: SW.d + 2.4, r: 0.5 };
  box("sw.hood", hood, HOOD_Z[0], HOOD_Z[1], { tone: "mid" }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(hood, HOOD_Z[0] + 0.8, P, 2), { tone: "faint" }) });
  // the MS rail on post insulators along the hood: the one lit part
  const railY = SW.y + 6;
  for (const x of [-48, -16, 16, 48]) post("sw.insulator", x, railY + 0.8, 0.9, HOOD_Z[1], RAIL_Z[0], { tone: "hi", crease: "none" }, { steps: 14 });
  box("sw.rail", { x: SW.x + 2, y: railY, w: SW.w - 4, d: 1.6, r: 0.3 }, RAIL_Z[0], RAIL_Z[1], { tone: "hi" }, { steps: 2, attrs: ' data-rail=""' });
}

// ---------------------------------------------------------------- the battery container
{
  for (const dx of [3, CONT.w - 7]) box("bat.sleeper", { x: CONT.x + dx, y: CONT.y - 1, w: 4, d: CONT.d + 2, r: 0.3 }, 0, CONT_Z[0], { tone: "lo" }, { steps: 2 });
  const fy = CONT.y + CONT.d;
  const ribs = [];
  for (let x = CONT.x + 14; x <= CONT.x + CONT.w - 2; x += 2) ribs.push(`M${x} ${-(CONT_Z[0] + 1.2)}V${-(CONT_Z[1] - 1.2)}`);
  const bits = [
    // the double door at the left end of the long side
    `<path class="iso-line" data-tone="lo" d="${flatRect(CONT.x + 1.6, CONT_Z[0] + 0.6, CONT.x + 12.4, CONT_Z[1] - 0.6, 0.3, 2)}M${CONT.x + 7} ${-(CONT_Z[0] + 0.6)}V${-(CONT_Z[1] - 0.6)}"/>`,
    `<path class="iso-line" data-tone="faint" d="${ribs.join("")}"/>`,
    `<path class="tl-card" d="${flatRect(CONT.x + 15, 18, CONT.x + 25, 23, 0.3, 2)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M${CONT.x + 16.2} ${-21.6}H${CONT.x + 23.6}M${CONT.x + 16.2} ${-20.2}H${CONT.x + 21.2}M${CONT.x + 16.2} ${-18.8}H${CONT.x + 22.6}"/>`,
    // the discharge meter on the door: 0–12 MVA
    `<path class="tl-glass" d="${flatRect(CONT.x + 9.4 - BMETER.w / 2, BMETER.z0, CONT.x + 9.4 + BMETER.w / 2, BMETER.z1, 0.3, 2)}"/>`,
    `<rect class="tl-bar" data-bar="b" x="${CONT.x + 9.4 - BMETER.w / 2 + 0.5}" width="${BMETER.w - 1}" y="${-BMETER.z0}" height="0"/>`,
    `<path class="iso-line" data-tone="lo" d="${flatRect(CONT.x + 9.4 - BMETER.w / 2, BMETER.z0, CONT.x + 9.4 + BMETER.w / 2, BMETER.z1, 0.3, 2)}"/>`,
  ].join("");
  const handles = Dt([at([CONT.x + 5.8, fy, 14]), at([CONT.x + 8.2, fy, 14])], { size: 0.5, tone: "hi" });
  box("bat.box", CONT, CONT_Z[0], CONT_Z[1], { tone: "mid" }, { steps: 2, bevel: 0.4, extra: onFace(fy, bits) + handles, inner: L(k.sideSeam(CONT, CONT_Z[0] + 1.2, P, 2) + k.sideSeam(CONT, CONT_Z[1] - 1.2, P, 2), { tone: "faint" }) });
  const roof = k.insetPlan(CONT, -0.5);
  box("bat.roof", roof, CONT_Z[1], CONT_Z[1] + 1, { tone: "mid" }, { steps: 2, bevel: 0.3 });
  // two air-conditioning units on the roof, each with a fan ring
  for (const x of [CONT.x + 7, CONT.x + 22]) {
    const unit = { x, y: CONT.y + 5, w: 10, d: 10, r: 0.5 };
    box("bat.hvac", unit, CONT_Z[1] + 1, CONT_Z[1] + 4.6, { tone: "mid" }, {
      steps: 2,
      bevel: 0.3,
      extra: L(k.ring(x + 5, CONT.y + 10, 3.4, CONT_Z[1] + 4.6, P, 28) + k.ring(x + 5, CONT.y + 10, 1, CONT_Z[1] + 4.6, P, 12), { tone: "lo" }) + `<path class="iso-line" data-tone="mid" data-fan="${x}" d=""/>`,
    });
  }
}
const FANS = [CONT.x + 7, CONT.x + 22].map((x) => [x + 5, CONT.y + 10, CONT_Z[1] + 4.6]);
function fanPath(c, phase) {
  const out = [];
  for (let i = 0; i < 3; i++) {
    const t = phase + (i / 3) * Math.PI * 2;
    out.push(k.pathOf([at([c[0] + Math.cos(t), c[1] + Math.sin(t), c[2]]), at([c[0] + 3.4 * Math.cos(t + 0.5), c[1] + 3.4 * Math.sin(t + 0.5), c[2]])]));
  }
  return out.join("");
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
// hit areas over the two transformers (tap to trip or restore)
const hits = TX.map((x, i) => {
  const c = at([x, TY, 26]);
  return `<circle class="tl-hit" data-hit="${i}" cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${(30 * KS).toFixed(1)}"/>`;
});
const body = [...halo, ...groups, ...hits];
// draw the fans once at rest so the static page is complete
const svgBody = body.join("").replace(/data-fan="([\d.]+)" d=""/g, (m, x) => `data-fan="${x}" d="${fanPath(FANS[Number(x) === CONT.x + 7 ? 0 : 1], 0.3)}"`);

const LABEL_NL =
  "Een HS/MS-onderstation van boven gezien. Achter staan twee vermogenstransformatoren van 40 MVA, T1 en T2, elk in een olieopvangbak met koelribben, hoogspanningsdoorvoeringen, middenspanningsdoorvoeringen en een conservator, met een brandmuur ertussen. Kabelgoten lopen naar de MS-installatie ervoor: twee inkomende velden met een belastingsmeter tot 150 procent, een koppelveld, vier uitgaande velden en een batterijveld, met de MS-rail op isolatoren erboven. Rechts staat een batterijcontainer. Onder N-1 moet één trafo de hele piek kunnen dragen: de vaste capaciteit is 40 MVA, geen 80.";
const LABEL_EN =
  "An HS/MS substation seen from above. At the back stand two 40 MVA power transformers, T1 and T2, each in an oil bund with radiator fins, HV bushings, MV bushings and a conservator, with a fire wall between them. Cable trenches run to the MV switchgear in front: two incomers with a load meter up to 150 percent, a bus coupler, four outgoing feeders and a battery feeder, with the MV rail on insulators above. On the right stands a battery container. Under N-1 one transformer must be able to carry the whole peak: the firm capacity is 40 MVA, not 80.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body: svgBody });

// ---------------------------------------------------------------- page CSS (Vantage palette)
const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#1D4A55;--anatomy-lit-shade:#173D47;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --nk-hair:rgba(240,233,218,.12);--nk-accent:#5C9FAE;--nk-glass:#0A1E23;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --nk-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --nk-hair:rgba(11,41,27,.14);--nk-accent:#276F81;--nk-glass:#E2ECEA;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--nk-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 196px);min-height:320px;padding:26px 4px 166px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--nk-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--nk-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:86px!important;max-width:36%;white-space:normal;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{bottom:86px!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.nk-line{display:block;white-space:nowrap}
.nk-acc{color:var(--nk-accent);font-weight:600}
.nk-strong{color:var(--anatomy-strong);font-weight:600}
.nk-mute{color:var(--anatomy-muted)}
.nk-model{position:absolute;left:14px;right:14px;bottom:70px;font-family:var(--nk-sans);font-size:9.5px;line-height:1.3;color:var(--anatomy-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nk-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;border-radius:8px}
.nk-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.nk-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.nk-controls{position:absolute;left:10px;right:10px;bottom:8px;display:flex;gap:6px;align-items:flex-end}
.nk-group{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:2px}
.nk-group-label{font:400 10px/1.2 var(--nk-sans);color:var(--anatomy-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:2px}
.nk-step{display:flex;align-items:center;gap:2px}
.nk-btn{flex:0 0 44px;width:44px;height:44px;padding:0;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 18px/1 var(--nk-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--nk-hair);display:inline-flex;align-items:center;justify-content:center}
.nk-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.nk-btn:disabled{opacity:.35;cursor:default}
.nk-val{flex:1 1 auto;min-width:0;text-align:center;font:600 13px/1 var(--anatomy-mono);color:var(--nk-accent);white-space:nowrap}
.nk-trip{flex:0 0 auto;width:auto;min-width:64px;padding:0 10px;font:500 12px/1 var(--nk-sans)}
.nk-trip[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--nk-accent);color:var(--nk-accent);font-weight:600}
.nk-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.tl-glass{fill:var(--nk-glass);stroke:none}
.tl-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.tl-pin{fill:var(--anatomy-mid);stroke:none}
.tl-bar{fill:var(--anatomy-mid);stroke:none}
.tl-over{fill:var(--nk-accent);stroke:none}
.tl-heat,.tl-band{fill:var(--nk-accent);stroke:none;opacity:0}
.tl-flow{fill:none;stroke:var(--nk-accent);stroke-width:1.1px;stroke-linecap:round;stroke-dasharray:2.2 4.4;opacity:0}
.tl-hit{fill:transparent;stroke:none;cursor:pointer}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .4s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--nk-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const RATING = ${RATING}, UNITS = ${UNITS}, FIRM = ${FIRM};
const LOAD = ${JSON.stringify(LOAD)}, BATT = ${JSON.stringify(BATT)};
const METER = ${JSON.stringify(METER)}, BMETER = ${JSON.stringify(BMETER)};
const FANS = ${JSON.stringify(FANS)};
const net = ${net.toString()};
const pctOf = ${pctOf.toString()};
function at(point) { return iso(point, P); }
${fanPath.toString().replace(/\bk\./g, "")}

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { normal: "normal", after: "on trip", out: "out", peak: "peak", batt: "battery", holds: "N-1 holds", shaved: "peak shaved", fails: "N-1 fails", over: "overloaded", short: "short", on: "on", dec: "." }
  : { normal: "normaal", after: "bij uitval", out: "uit", peak: "piek", batt: "batterij", holds: "N-1 houdt", shaved: "piek geschoren", fails: "N-1 faalt", over: "overbelast", short: "tekort", on: "aan", dec: "," };
const f1 = (v) => v.toFixed(1).replace(".", T.dec);

const stage = document.querySelector(".nk-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  bars: [q('[data-bar="0"]'), q('[data-bar="1"]')], overs: [q('[data-over="0"]'), q('[data-over="1"]')], bbar: q('[data-bar="b"]'),
  blades: [q('[data-blade="0"]'), q('[data-blade="1"]')], lamps: [q('[data-lamp="0"]'), q('[data-lamp="1"]')], blamp: q('[data-lamp="b"]'),
  heat: [q('[data-heat="0"]'), q('[data-heat="1"]')], bands: [q('[data-band="0"]'), q('[data-band="1"]')], flows: [...svg.querySelectorAll("[data-flow]")], fans: [...svg.querySelectorAll("[data-fan]")],
};
const lines = [...document.querySelectorAll("[data-readout] .nk-line")];
const loadVal = document.querySelector('[data-ctl="load"] .nk-val');
const battVal = document.querySelector('[data-ctl="batt"] .nk-val');
const tripBtn = document.querySelector(".nk-trip");
const announcer = document.querySelector(".nk-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ------------------------------------------------ state: targets and eased values
const state = { peak: LOAD.start, batt: BATT.start, trip: -1 };
const shown = { u: [0, 0], b: 0, phase: 0, dash: 0 };
const target = () => {
  const n = net(state.peak, state.batt);
  const u = [0, 1].map((i) => (state.trip === i ? 0 : state.trip >= 0 ? n : n / UNITS));
  return { n, u };
};
{ const t = target(); shown.u = t.u.slice(); shown.b = state.batt; }

function verdict() {
  const n = net(state.peak, state.batt);
  const short = n - FIRM;
  if (short > 0) return '<span class="nk-strong">' + (state.trip >= 0 ? T.over : T.fails) + ": " + f1(short) + " MVA " + T.short + "</span>";
  if (state.batt > 0 && state.peak > FIRM) return '<span class="nk-acc">' + T.shaved + "</span> · " + T.holds;
  return '<span class="nk-acc">' + T.holds + "</span>";
}
function plain(html) { return html.replace(/<[^>]+>/g, ""); }
function readout() {
  const n = net(state.peak, state.batt);
  const half = n / UNITS;
  const l1 = T.normal + " 2 × " + f1(half) + " MVA · " + Math.round(pctOf(half)) + " %";
  const l2 = (state.trip >= 0 ? "T" + (state.trip + 1) + " " + T.out + ": T" + (2 - state.trip) : T.after + " 1 ×") + " " + f1(n) + " MVA · " + Math.round(pctOf(n)) + " %";
  const l3 = state.batt > 0 ? T.peak + " " + state.peak + " − " + T.batt + " " + state.batt + " = " + n + " MVA" : T.peak + " " + state.peak + " MVA · " + T.batt + " 0";
  const l4 = verdict();
  const h1 = state.trip >= 0 ? '<span class="nk-mute">' + l1 + "</span>" : l1;
  const h2 = state.trip >= 0 ? l2 : '<span class="nk-mute">' + l2 + "</span>";
  if (lines[0].innerHTML !== h1) lines[0].innerHTML = h1;
  if (lines[1].innerHTML !== h2) lines[1].innerHTML = h2;
  if (lines[2].textContent !== l3) lines[2].textContent = l3;
  if (lines[3].innerHTML !== l4) lines[3].innerHTML = l4;
}
function describe() {
  loadVal.textContent = String(state.peak);
  battVal.textContent = String(state.batt);
  document.querySelector('[data-ctl="load"] [data-d="-1"]').disabled = state.peak <= LOAD.min;
  document.querySelector('[data-ctl="load"] [data-d="1"]').disabled = state.peak >= LOAD.max;
  document.querySelector('[data-ctl="batt"] [data-d="-1"]').disabled = state.batt <= BATT.min;
  document.querySelector('[data-ctl="batt"] [data-d="1"]').disabled = state.batt >= BATT.max;
  tripBtn.setAttribute("aria-pressed", String(state.trip >= 0));
  tripBtn.textContent = "T" + (state.trip === 0 ? 1 : 2) + " " + (state.trip >= 0 ? T.out : T.on);
}
let quiet = 0;
function announce() {
  clearTimeout(quiet);
  quiet = setTimeout(() => { announcer.textContent = lines.map((l) => plain(l.innerHTML)).join(". ") + "."; }, 700);
}

function meter(rect, over, pct) {
  const span = METER.z1 - METER.z0;
  const p = clamp(pct, 0, METER.max);
  const base = Math.min(p, 100);
  rect.setAttribute("y", (-(METER.z0 + span * base / METER.max)).toFixed(2));
  rect.setAttribute("height", (span * base / METER.max).toFixed(2));
  const extra = Math.max(0, p - 100);
  over.setAttribute("y", (-(METER.z0 + span * p / METER.max)).toFixed(2));
  over.setAttribute("height", (span * extra / METER.max).toFixed(2));
}
function draw(calm) {
  for (const i of [0, 1]) {
    const pct = pctOf(shown.u[i]);
    meter(el.bars[i], el.overs[i], pct);
    const tripped = state.trip === i;
    const bx = el.blades[i].dataset.cx;
    el.blades[i].setAttribute("d", tripped ? "M" + bx + " -8L" + (bx - 2.2) + " -10.4" : "M" + bx + " -8L" + bx + " -11");
    const overload = pctOf(shown.u[i]) > 100.05;
    if (overload) el.lamps[i].setAttribute("data-on", ""); else el.lamps[i].removeAttribute("data-on");
    el.heat[i].style.opacity = (0.6 * clamp((pct - 60) / 60, 0, 1)).toFixed(3);
    el.bands[i].style.opacity = clamp((pct - 100) / 6, 0, 1).toFixed(3);
  }
  const bs = BMETER.z1 - BMETER.z0;
  const bh = bs * clamp(shown.b / BATT.max, 0, 1);
  el.bbar.setAttribute("y", (-(BMETER.z0 + bh)).toFixed(2));
  el.bbar.setAttribute("height", bh.toFixed(2));
  if (state.batt > 0) el.blamp.setAttribute("data-on", ""); else el.blamp.removeAttribute("data-on");
  // flow along the trench covers: opacity and speed follow the load
  for (const f of el.flows) {
    const key = f.dataset.flow;
    const mva = key === "t1" ? shown.u[0] : key === "t2" ? shown.u[1] : key === "bat" ? shown.b : net(state.peak, state.batt) / 4;
    f.style.opacity = mva > 0.2 ? "0.9" : "0";
    f.style.strokeDashoffset = calm ? "0" : (-(shown.dash * mva / 10) % 66).toFixed(2);
  }
  el.fans.forEach((p, i) => p.setAttribute("d", fanPath(FANS[i], shown.phase + i)));
  readout();
}

// ------------------------------------------------ idle tour
// The lesson's station at 46 MVA: normal (2 × 58 %), T2 trips (T1 at 115 %,
// 6 MVA short), a 6 MVA battery shaves the peak to 40, then back.
const TOUR = [[0, { peak: 46, batt: 0, trip: -1 }], [3.5, { peak: 46, batt: 0, trip: 1 }], [8, { peak: 46, batt: 6, trip: 1 }], [12.5, { peak: 46, batt: 0, trip: -1 }], [15, { peak: 36, batt: 0, trip: 1 }]];
const TOUR_LEN = 19;
let touring = !still.matches, tourClock = 0, tourStep = -1, idleTimer = 0;
function tourAt(clock) {
  const t = clock % TOUR_LEN;
  let index = 0;
  TOUR.forEach(([at], i) => { if (t >= at) index = i; });
  return index;
}

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring && !calm) {
    tourClock += dt;
    const i = tourAt(tourClock);
    if (i !== tourStep) { tourStep = i; Object.assign(state, TOUR[i][1]); describe(); }
  }
  const t = target();
  let moving = false;
  for (const i of [0, 1]) {
    if (calm) shown.u[i] = t.u[i];
    else { shown.u[i] += (t.u[i] - shown.u[i]) * (1 - Math.exp(-dt / 0.35)); if (Math.abs(t.u[i] - shown.u[i]) < 0.02) shown.u[i] = t.u[i]; else moving = true; }
  }
  if (calm) shown.b = state.batt;
  else { shown.b += (state.batt - shown.b) * (1 - Math.exp(-dt / 0.35)); if (Math.abs(state.batt - shown.b) < 0.02) shown.b = state.batt; else moving = true; }
  if (!calm) { shown.dash += dt * 30; shown.phase = (shown.phase + dt * (state.batt > 0 ? 7 : 2.2)) % (Math.PI * 2); }
  draw(calm);
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };

function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourClock = 0; tourStep = -1; run(); } }, 40000);
}
function set(next) {
  steer();
  Object.assign(state, next);
  state.peak = clamp(state.peak, LOAD.min, LOAD.max);
  state.batt = clamp(state.batt, BATT.min, BATT.max);
  describe();
  readout();
  announce();
  kick();
}
const trip = (i) => set({ trip: state.trip === i ? -1 : i });

// ------------------------------------------------ controls
document.querySelectorAll(".nk-group").forEach((group) => {
  group.querySelectorAll(".nk-btn").forEach((b) => b.addEventListener("click", () => {
    const d = Number(b.dataset.d);
    if (group.dataset.ctl === "load") set({ peak: state.peak + d * LOAD.step });
    else set({ batt: state.batt + d * BATT.step });
  }));
});
tripBtn.addEventListener("click", () => set({ trip: state.trip >= 0 ? -1 : 1 }));
svg.querySelectorAll("[data-hit]").forEach((h) => h.addEventListener("click", () => trip(Number(h.dataset.hit))));
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (event.key === "ArrowUp") set({ peak: state.peak + LOAD.step });
  else if (event.key === "ArrowDown") set({ peak: state.peak - LOAD.step });
  else if (event.key === "ArrowRight") set({ batt: state.batt + BATT.step });
  else if (event.key === "ArrowLeft") set({ batt: state.batt - BATT.step });
  else if (event.key === "1") trip(0);
  else if (event.key === "2") trip(1);
  else if (event.key === "0" || event.key === "Home") set({ trip: -1 });
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => kick());

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => {
  if (still.matches) { touring = false; cancelAnimationFrame(frame); frame = 0; tick(performance.now()); }
  else { touring = true; tourClock = 0; tourStep = -1; run(); }
});
describe();
draw(true);
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "N-1 in een onderstation",
    hint: "Tik een trafo:",
    hint2: "uitval of terug",
    model: "2 × 40 MVA · grens 100 % van één trafo · batterij ontlaadt in de piek",
    load: "piek (MVA)",
    batt: "batterij (MVA)",
    tripLabel: "uitval",
    less: "minder",
    more: "meer",
    label: LABEL_NL,
    aria: "Onderstation met twee trafo’s van 40 MVA. Pijl omhoog en omlaag verandert de piekbelasting, pijl links en rechts de batterij, de toetsen 1 en 2 laten T1 of T2 uitvallen, 0 zet beide weer in bedrijf.",
  },
  en: {
    title: "N-1 in a substation",
    hint: "Tap a transformer:",
    hint2: "trip or restore",
    model: "2 × 40 MVA · limit 100 % of one unit · battery discharges at peak",
    load: "peak (MVA)",
    batt: "battery (MVA)",
    tripLabel: "outage",
    less: "less",
    more: "more",
    label: LABEL_EN,
    aria: "Substation with two 40 MVA transformers. Up and down arrows change the peak load, left and right arrows the battery, keys 1 and 2 trip T1 or T2, 0 puts both back in service.",
  },
};

const group = (key, label) =>
  `<div class="nk-group" data-ctl="${key}"><span class="nk-group-label" data-l="${key}">${label}</span><div class="nk-step"><button type="button" class="nk-btn" data-d="-1" aria-label="${label} ${STRINGS.nl.less}">&#8722;</button><span class="nk-val" aria-hidden="true"></span><button type="button" class="nk-btn" data-d="1" aria-label="${label} ${STRINGS.nl.more}">+</button></div></div>`;
const controls = `<div class="nk-controls"><div class="nk-group" style="flex:0 0 auto" data-ctl="trip"><span class="nk-group-label" data-l="trip">${STRINGS.nl.tripLabel}</span><button type="button" class="nk-btn nk-trip" aria-pressed="false">T2 aan</button></div>${group("load", STRINGS.nl.load)}${group("batt", STRINGS.nl.batt)}</div>`;

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="nk-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div><span class="nk-model" data-model>${STRINGS.nl.model}</span>${controls}<div class="nk-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="nk-line"></span>'.repeat(4)}</span>`)
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><br><span data-hint2>${STRINGS.nl.hint2}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;var h=c("hint");h.querySelector("[data-hint]").textContent=s.hint;h.querySelector("[data-hint2]").textContent=s.hint2;
document.querySelector("[data-model]").textContent=s.model;
document.querySelector('[data-l="load"]').textContent=s.load;document.querySelector('[data-l="batt"]').textContent=s.batt;document.querySelector('[data-l="trip"]').textContent=s.tripLabel;
document.querySelectorAll('[data-ctl="load"] .nk-btn').forEach(function(b){b.setAttribute("aria-label",s.load+" "+(b.dataset.d==="1"?s.more:s.less));});
document.querySelectorAll('[data-ctl="batt"] .nk-btn').forEach(function(b){b.setAttribute("aria-label",s.batt+" "+(b.dataset.d==="1"?s.more:s.less));});
var st=document.querySelector(".nk-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, finishFigure(page));
console.log(`model: firm ${FIRM} MVA · 46 MVA after trip ${pctOf(perUnit(46, 0, true)).toFixed(1)} % · short ${shortOf(46, 0)} MVA`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, {});
