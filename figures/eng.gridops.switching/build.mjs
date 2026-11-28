// Dev tool, not shipped. Builds the standalone figure for the lesson
// "Handling an outage" (eng.gridops.outage, module Grid operations, grid track):
// isolating a cable fault in a medium-voltage ring and restoring supply by
// switching.
//
//   node figures/eng.gridops.switching/build.mjs            build the page
//   node figures/eng.gridops.switching/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.gridops.switching.html: one offline
// page with the anatomy kit and the live script inlined. The page reads
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
const OUT = join(ROOT, "src/content/courses/figures/eng.gridops.switching.html");

// ---------------------------------------------------------------- the model
// An MS ring leaves the HS/MS substation (OS) on two feeder bays, A and B, runs
// through four compact stations and comes back. Each station has a ring-main
// unit with two load-break switches (one per cable direction) and a
// transformer field. The ring runs open at a normally open point (NO): the
// switch in station 3 toward station 4. Feeder A feeds 1, 2 and 3; B feeds 4.
//
// The chain, from bay A round to bay B:
//   A brA c0 s1L [1] s1R c1 s2L [2] s2R c2 s3L [3] s3R c3 s4L [4] s4R c4 brB B
// A cable fault in c1 (between stations 1 and 2) makes bay A trip. Fault
// current passed station 1, not station 2, so only station 1's fault passage
// indicator (kortsluitverklikker) shows. The lesson's procedure: open the
// switches on both sides of the faulty section, the control room recloses the
// feeder, then the normally open point is closed (after checking the other
// feeder can carry the load).
//
// Timing, from the lesson's worked example: the feeder trips at 07:40 and the
// outage technician is on site at 08:15 (35 min). Each switching action in a
// station then takes 10 min (drive, switch, report to the control room); the
// control room switches a bay remotely in 2 min. 150 customers per station on
// average, as in the example (1,800 customers over 12 stations).
const CHAIN = ["A", "brA", "c0", "s1L", "b1", "s1R", "c1", "s2L", "b2", "s2R", "c2", "s3L", "b3", "s3R", "c3", "s4L", "b4", "s4R", "c4", "brB", "B"];
const DEVICES = ["brA", "s1L", "s1R", "s2L", "s2R", "s3L", "s3R", "s4L", "s4R", "brB"];
const BUSES = ["b1", "b2", "b3", "b4"];
const CUST = [120, 180, 160, 140]; // customers behind stations 1-4
const FAULT = "c1";
const ADJ = ["s1R", "s2L"]; // the switches either side of the faulty section
const NORMAL = { brA: true, s1L: true, s1R: true, s2L: true, s2R: true, s3L: true, s3R: false, s4L: true, s4R: true, brB: true };
const START = 7 * 60 + 40; // 07:40, the trip
const ARRIVE = 35; // min until the technician is on site (08:15)
const STEP_STATION = 10;
const STEP_REMOTE = 2;

// Which source feeds each element: "A", "B", "AB" (ring closed) or none.
function feedOf(sw) {
  const by = {};
  for (let i = 0; i < CHAIN.length; i++) {
    const e = CHAIN[i];
    if (e in sw && !sw[e]) break;
    by[e] = "A";
  }
  for (let i = CHAIN.length - 1; i >= 0; i--) {
    const e = CHAIN[i];
    if (e in sw && !sw[e]) break;
    by[e] = by[e] ? "AB" : "B";
  }
  return by;
}
function offOf(sw) {
  const by = feedOf(sw);
  return BUSES.reduce((sum, b, i) => sum + (by[b] ? 0 : CUST[i]), 0);
}
// Is toggling `dev` allowed? "ok", or the reason it is refused.
function checkOf(sw, dev) {
  const next = { ...sw, [dev]: !sw[dev] };
  const now = feedOf(sw);
  const then = feedOf(next);
  if (then[FAULT]) return then[FAULT] === "B" ? "faultB" : "fault";
  if (Object.values(then).includes("AB")) return "loop";
  if (BUSES.some((b) => now[b] && !then[b])) return "healthy";
  if (sw[dev] && !ADJ.includes(dev)) return "notThis";
  return "ok";
}
const costOf = (dev) => (dev.startsWith("br") ? STEP_REMOTE : STEP_STATION);
// Run a list of actions from the tripped state; returns minutes, customer-minutes and refusals.
function simulate(actions) {
  let sw = { ...NORMAL, brA: false };
  let t = ARRIVE;
  let cml = offOf(sw) * ARRIVE;
  const refused = [];
  for (const dev of actions) {
    const verdict = checkOf(sw, dev);
    if (verdict !== "ok") { refused.push([dev, verdict]); continue; }
    const dt = costOf(dev);
    cml += offOf(sw) * dt;
    t += dt;
    sw = { ...sw, [dev]: !sw[dev] };
  }
  return { t, cml, off: offOf(sw), refused, sw };
}

// The lesson's numbers, asserted.
const assert = (ok, what) => { if (!ok) throw new Error("model: " + what); };
assert(1800 / 12 === 150, "1,800 customers over 12 stations is 150 each");
assert(CUST.reduce((a, b) => a + b, 0) / CUST.length === 150, "150 customers per station on average");
assert(START + ARRIVE === 8 * 60 + 15, "trip 07:40, technician on site 08:15");
assert(1800 * 50 === 90000, "1,800 customers for 50 min is 90,000 customer minutes");
assert(feedOf(NORMAL).b4 === "B" && feedOf(NORMAL).b3 === "A" && !Object.values(feedOf(NORMAL)).includes("AB"), "ring runs open at the NO point in station 3");
const tripped = { ...NORMAL, brA: false };
assert(offOf(tripped) === 460, "the trip takes out stations 1 to 3");
const IDEAL = simulate(["s1R", "s2L", "brA", "s3R"]);
assert(IDEAL.off === 0 && IDEAL.refused.length === 0 && IDEAL.t === 67, "lesson order restores everyone at +67 min");
assert(IDEAL.cml === 120 * 57 + 340 * 67, "customer minutes of the lesson order");
const NO_FIRST = simulate(["s1R", "s2L", "s3R", "brA"]);
assert(NO_FIRST.cml > IDEAL.cml, "reclosing the feeder first saves customer minutes");
assert(checkOf(tripped, "brA") === "fault", "reclosing before isolating switches onto the fault");
assert(checkOf(tripped, "s3R") === "faultB", "closing the NO point before isolating feeds the fault");
assert(checkOf(tripped, "brB") === "healthy", "opening bay B drops station 4");
assert(checkOf(tripped, "s2R") === "notThis", "only the switches either side of the fault are opened");

// ---------------------------------------------------------------- the world
// A model of the network on a base plate. World units are roughly metres/2;
// x to the right, y toward the viewer, z up. The OS stands in the back left
// corner; the ring runs clockwise round the plate: 1 at the back, 2 on the
// right, 3 at the front, 4 on the left.
const WIDTH = 600;
const PLATE = { x: -96, y: -66, w: 188, d: 128, r: 8 };
const PLATE_H = 7;
const FOOT_H = 4;
const ST = [
  null,
  { cx: 20, cy: -40, run: "x", dir: 1 }, // 1: L toward OS (-x), R toward 2 (+x)
  { cx: 66, cy: 0, run: "y", dir: 1 }, // 2: L toward 1 (-y), R toward 3 (+y)
  { cx: 10, cy: 40, run: "x", dir: -1 }, // 3: L toward 2 (+x), R toward 4 (-x)
  { cx: -76, cy: 6, run: "y", dir: -1 }, // 4: L toward 3 (+y), R toward OS (-y)
];
const KI = { len: 28, wide: 17, plinth: 1.6, h: 17, roof: 1.8 };
const BUILDING = { x: -91, y: -61, w: 24, d: 20, r: 0.8 };
const BUILDING_H = 18;
const CAB = {
  A: { x: -64, y: -47, w: 11, d: 14, r: 0.8, h: 11, along: "x" },
  B: { x: -83, y: -38, w: 14, d: 11, r: 0.8, h: 11, along: "y" },
};
const TRAFO = { x: -50, y: -62, w: 15, d: 10, r: 0.6 };
const POST_H = 6;
const BLADE_L = 9;
const OPEN_DEG = 58;
const HOUSE = { w: 11, d: 8, h: 7, roof: 4.5 };
const HOUSES = [
  null,
  [[6, -20], [27, -20]],
  [[46, -8], [46, 9]],
  [[-2, 22], [19, 22]],
  [[-56, -2], [-56, 15]],
];
const CORNER_R = 7;
const ROUTES = {
  c0: [[-53, -40], [6, -40]],
  c1: [[34, -40], [66, -40], [66, -14]],
  c2: [[66, 14], [66, 40], [24, 40]],
  c3: [[-4, 40], [-76, 40], [-76, 20]],
  c4: [[-76, -8], [-76, -27]],
};
const FAULT_AT = [51, -40];

const kioskPlan = (i, grow = 0) => {
  const s = ST[i];
  const [w, d] = s.run === "x" ? [KI.len, KI.wide] : [KI.wide, KI.len];
  return { x: s.cx - w / 2 - grow, y: s.cy - d / 2 - grow, w: w + 2 * grow, d: d + 2 * grow, r: 0.8 + Math.max(0, grow) * 0.3 };
};
const bladeTop = (c) => c.h + 1.2 + POST_H + 1.2;

const FIT = [
  ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
  ...k.boxCorners(BUILDING, 0, BUILDING_H + 2),
  [CAB.A.x + 1, CAB.A.y + 7, bladeTop(CAB.A) + BLADE_L * Math.sin((OPEN_DEG * Math.PI) / 180) + 2],
];
const PAD = 6;
const AZIMUTH = Number(process.env.AZ ?? 48);
const ELEVATION = Number(process.env.EL ?? 36);
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 2);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const poly = (points) => "M" + points.map((p) => at(p).map((v) => v.toFixed(2)).join(" ")).join("L") + "Z";
const open = (points) => "M" + points.map((p) => at(p).map((v) => v.toFixed(2)).join(" ")).join("L");

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
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 20, bevel = 0, extra = "", inner = "", owner, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}

// ---------------------------------------------------------------- cables on the plate
// Each section is a cable in a trench strip, drawn on the plate's top face with
// rounded corners. Its stroke is the live state: petrol when energised.
function routePoints(points) {
  const out = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const [p, c, n] = [points[i - 1], points[i], points[i + 1]];
    const din = [Math.sign(c[0] - p[0]), Math.sign(c[1] - p[1])];
    const dout = [Math.sign(n[0] - c[0]), Math.sign(n[1] - c[1])];
    const o = [c[0] + (dout[0] - din[0]) * CORNER_R, c[1] + (dout[1] - din[1]) * CORNER_R];
    for (let j = 0; j <= 8; j++) {
      const t = (j / 8) * (Math.PI / 2);
      out.push([o[0] - dout[0] * CORNER_R * Math.cos(t) + din[0] * CORNER_R * Math.sin(t), o[1] - dout[1] * CORNER_R * Math.cos(t) + din[1] * CORNER_R * Math.sin(t)]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}
const cableD = (name, z = 0.02) => open(routePoints(ROUTES[name]).map(([x, y]) => [x, y, z]));

// ---------------------------------------------------------------- base plate
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLATE, -2), -PLATE_H - FOOT_H, 2, P)}"/>`];
{
  const feet = k.corners(PLATE, 14);
  for (const [x, y] of feet) post("stand.foot", x, y, 5.4, -PLATE_H - FOOT_H, -PLATE_H, { tone: "lo" }, { steps: 24 });
  const screws = k.corners(PLATE, 7);
  const trenches = Object.keys(ROUTES).map((c) => `<path class="rg-trench" d="${cableD(c)}"/>`).join("");
  const cables = Object.keys(ROUTES).map((c) => `<path class="rg-cable" data-cable="${c}" d="${cableD(c)}"/>`).join("");
  // service cables from each station to its houses
  const svc = [];
  for (let i = 1; i <= 4; i++) {
    const s = ST[i];
    for (const [hx, hy] of HOUSES[i]) {
      const from = s.run === "x" ? [hx, s.cy + (hy > s.cy ? KI.wide / 2 : -KI.wide / 2)] : [s.cx + (hx > s.cx ? KI.wide / 2 : -KI.wide / 2), hy];
      const to = s.run === "x" ? [hx, hy + (hy > s.cy ? -HOUSE.d / 2 : HOUSE.d / 2)] : [hx + (hx > s.cx ? -HOUSE.w / 2 : HOUSE.w / 2), hy];
      svc.push(`<path class="rg-svc" data-st="${i}" d="${open([[...from, 0.02], [...to, 0.02]])}"/>`);
    }
  }
  // selection outlines on the plate round each station and round the OS
  const sel = [`<path class="rg-sel" data-sel="0" d="${k.planOutline({ x: -93, y: -63, w: 59, d: 39, r: 4 }, 0.02, P, 4)}"/>`];
  for (let i = 1; i <= 4; i++) sel.push(`<path class="rg-sel" data-sel="${i}" d="${k.planOutline(kioskPlan(i, 4.5), 0.02, P, 4)}"/>`);
  // the fault: a scorch mark on the cable and a ring that flashes out from it
  const [fx, fy] = FAULT_AT;
  const burst = [];
  for (let n = 0; n < 8; n++) {
    const a = (n / 8) * Math.PI * 2 + 0.2;
    const r0 = 2.2, r1 = n % 2 ? 4.4 : 6;
    burst.push(open([[fx + r0 * Math.cos(a), fy + r0 * Math.sin(a), 0.03], [fx + r1 * Math.cos(a), fy + r1 * Math.sin(a), 0.03]]));
  }
  const fault = `<g class="rg-fault" data-fault=""><path class="rg-burst" d="${burst.join("")}"/><path class="rg-scorch" d="${k.ring(fx, fy, 1.8, 0.03, P, 18)}"/><path class="rg-flash" data-flash="" d="${k.ring(fx, fy, 6, 0.03, P, 36)}"/></g>`;
  // the label plate in the middle of the ring: three rule lines and two screws
  const label = { x: -40, y: -7, w: 30, d: 13, r: 1 };
  const lx = label.x + 3.6;
  const labelBits =
    L(k.planOutline(k.insetPlan(label, 1.4), 0.02, P, 3), { tone: "faint" }) +
    L(k.lineOnTop([lx, label.y + 4.4], [lx + 22, label.y + 4.4], 0.02, P) + k.lineOnTop([lx, label.y + 7.4], [lx + 16, label.y + 7.4], 0.02, P) + k.lineOnTop([lx, label.y + 10.4], [lx + 10, label.y + 10.4], 0.02, P), { tone: "lo", free: true }) +
    Dt([at([label.x + label.w - 2.8, label.y + 2.8, 0.02]), at([label.x + label.w - 2.8, label.y + label.d - 2.8, 0.02])], { size: 0.45 });
  const extra =
    L(k.planOutline(k.insetPlan(PLATE, 4.5), 0, P, 6), { tone: "faint" }) +
    L(screws.map(([x, y]) => k.ring(x, y, 2, 0, P, 16)).join(""), { tone: "lo" }) +
    Dt(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }) +
    L(k.planOutline(label, 0.02, P, 3), { tone: "lo" }) +
    labelBits +
    sel.join("") +
    trenches +
    svc.join("") +
    cables +
    fault;
  box("stand.plate", PLATE, -PLATE_H, 0, { tone: "lo" }, { steps: 8, bevel: 1.2, inner: L(k.sideSeam(PLATE, -PLATE_H + 2.6, P, 8), { tone: "faint" }), extra });
}

// ---------------------------------------------------------------- the HS/MS substation
{
  // switch house: door, louvres and a sign on the near (+y) face, roof cap
  const b = BUILDING;
  const fy = b.y + b.d;
  const slots = [];
  for (let n = 0; n < 4; n++) {
    const z = BUILDING_H - 4 - n * 2;
    slots.push(poly([[b.x + 3, fy, z], [b.x + 11, fy, z], [b.x + 11, fy, z - 0.9], [b.x + 3, fy, z - 0.9]]));
  }
  const door = poly([[b.x + 15, fy, 0.4], [b.x + 21, fy, 0.4], [b.x + 21, fy, 11.5], [b.x + 15, fy, 11.5]]);
  const extra = L(slots.join(""), { tone: "lo" }) + L(door, { tone: "lo" }) + Dt([at([b.x + 19.9, fy, 6])], { size: 0.5, tone: "hi" });
  box("os.house", b, 0, BUILDING_H, { tone: "mid" }, { steps: 3, bevel: 0.4, inner: L(k.sideSeam(b, 2.4, P, 3), { tone: "faint" }), extra });
  const cap = k.insetPlan(b, -1);
  box("os.roof", cap, BUILDING_H, BUILDING_H + 1.8, { tone: "mid" }, { steps: 3, bevel: 0.4, extra: Dt(k.corners(cap, 2.4).map(([x, y]) => at([x, y, BUILDING_H + 1.8])), { size: 0.42 }) });
}
{
  // HS/MS power transformer on its pad: tank, radiator fins on the near face,
  // three HS bushings with sheds, a conservator on a bracket
  const pad = k.insetPlan(TRAFO, -1.6);
  box("os.trafo-pad", pad, 0, 1.4, { tone: "lo" }, { steps: 2, bevel: 0.3 });
  const t = TRAFO;
  const tz = [1.4, 15];
  box("os.trafo", t, tz[0], tz[1], { tone: "hi", crease: "lo" }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(t, tz[1] - 2, P, 2), { tone: "faint" }) });
  for (let n = 0; n < 4; n++) {
    const fx = t.x + 2.4 + n * 3.2;
    box("os.fin", { x: fx, y: t.y + t.d, w: 1.1, d: 3.4, r: 0.2 }, 3, 13, { tone: "mid", crease: "none" }, { steps: 1 });
  }
  for (let n = 0; n < 3; n++) {
    const bx = t.x + 3.4 + n * 4.1;
    const by = t.y + t.d - 3.4;
    const sheds = [1.4, 2.8, 4.2].map((z) => k.sideArc(bx, by, 1.1, tz[1] + z, P, 12)).join("");
    post("os.bushing", bx, by, 1.1, tz[1], tz[1] + 5.4, { tone: "hi", crease: "none" }, { steps: 14, inner: L(sheds, { tone: "lo" }) });
    post("os.bushing-cap", bx, by, 1.5, tz[1] + 5.4, tz[1] + 6.4, { tone: "mid" }, { steps: 14, extra: Dt([at([bx, by, tz[1] + 6.4])], { size: 0.42, tone: "hi" }) });
  }
  post("os.bracket", t.x + 7, t.y + 2.6, 0.7, tz[1], tz[1] + 1.6, { tone: "mid", crease: "none" }, { steps: 10 });
  const FC = G.frameOf([t.x + 2.5, t.y + 2.6, tz[1] + 1.6 + 2.2], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const shape = R.solid(A.disc(FC, 0, 10, 2.2, { name: "os.conservator" }));
  put("os.conservator", [t.x + 7, t.y + 2.6, tz[1] + 3.8], S(G.disc(0, 10, 2.2, FC, P), { tone: "mid" }), [shape]);
}

// The two MS feeder bays, A and B: a cabinet each, two post insulators on the
// roof and the breaker's blade, drawn closed and open (one is shown).
const blades = {};
for (const id of ["A", "B"]) {
  const c = CAB[id];
  const owner = "bay" + id;
  const along = c.along === "x";
  const cx = c.x + c.w / 2;
  const cy = c.y + c.d / 2;
  const fy = c.y + c.d;
  const fx = c.x + c.w;
  const vents = [];
  for (let n = 0; n < 3; n++) {
    const z = c.h - 3 - n * 2;
    if (along) vents.push(poly([[c.x + 3, fy, z], [c.x + 9, fy, z], [c.x + 9, fy, z - 0.8], [c.x + 3, fy, z - 0.8]]));
    else vents.push(poly([[fx, c.y + 3, z], [fx, c.y + 9, z], [fx, c.y + 9, z - 0.8], [fx, c.y + 3, z - 0.8]]));
  }
  box("os.bay", c, 0, c.h, { tone: "mid" }, { owner, steps: 2, bevel: 0.4, inner: L(k.sideSeam(c, 2.4, P, 2), { tone: "faint" }), extra: L(vents.join(""), { tone: "lo" }) });
  const cap = k.insetPlan(c, -0.6);
  box("os.bay-cap", cap, c.h, c.h + 1.2, { tone: "mid" }, { owner, steps: 2, bevel: 0.3 });
  const z0 = c.h + 1.2;
  const ends = along ? [[cx - BLADE_L / 2, cy], [cx + BLADE_L / 2, cy]] : [[cx, cy - BLADE_L / 2], [cx, cy + BLADE_L / 2]];
  for (const [px, py] of ends) {
    const ribs = [1.6, 3.2, 4.8].map((z) => k.sideArc(px, py, 1.3, z0 + z, P, 14)).join("");
    post("os.insulator", px, py, 1.3, z0, z0 + POST_H, { tone: "hi", crease: "none" }, { owner, steps: 16, inner: L(ribs, { tone: "lo" }) });
    post("os.insulator-cap", px, py, 1.8, z0 + POST_H, z0 + POST_H + 1.2, { tone: "mid" }, { owner, steps: 16 });
  }
  // blade: hinged on the first post, lying on both caps when closed
  const top = z0 + POST_H + 1.2;
  const hinge = [ends[0][0], ends[0][1], top + 0.5];
  const a = (OPEN_DEG * Math.PI) / 180;
  const dirC = along ? [1, 0, 0] : [0, 1, 0];
  const side = along ? [0, 1, 0] : [1, 0, 0];
  const dirO = along ? [Math.cos(a), 0, Math.sin(a)] : [0, Math.cos(a), Math.sin(a)];
  const upO = along ? [-Math.sin(a), 0, Math.cos(a)] : [0, -Math.sin(a), Math.cos(a)];
  const sect = [[-1.1, -0.5], [1.1, -0.5], [1.1, 0.5], [-1.1, 0.5]];
  const FCl = G.frameOf(hinge, dirC, side, [0, 0, 1]);
  const FOp = G.frameOf(hinge, dirO, side, upO);
  const span = [-0.9, BLADE_L + 0.9];
  const closed = S(G.prismOf(FCl, sect, span[0], span[1], P), { tone: "hi", crease: "lo" });
  const opened = S(G.prismOf(FOp, sect, span[0], span[1], P), { tone: "hi", crease: "lo" });
  solids--; // one blade, two poses
  const pin = Dt([at([hinge[0] + side[0] * 1.1, hinge[1] + side[1] * 1.1, hinge[2]])], { size: 0.5, tone: "mid" });
  const svg = `<g data-blade="${id}"><g class="rg-pose" data-pose="closed">${closed}</g><g class="rg-pose" data-pose="open">${opened}</g>${pin}</g>`;
  const shapes = [R.solid(A.prism(FCl, sect, span[0], span[1], { name: "os.blade", owner })), R.solid(A.prism(FOp, sect, span[0], span[1], { name: "os.blade-open", owner }))];
  blades[id] = put("os.blade" + id, [cx, cy, top + 2], svg, shapes);
}

// ---------------------------------------------------------------- compact stations
// A concrete kiosk on a plinth. The ring-main unit's front panel is on the
// near long face: a mimic busbar with a lever per load-break switch (along the
// line when closed, across it when open), the transformer field's drop to its
// fuse, and the fault passage indicator top right. A lamp on the roof shows
// the station is live; the station number is cast in the roof.
const PANEL = { u: 10.8, z0: 4.4, z1: 16, bus: 12, gap: 1.9, hub: 6.4 };
const faceAt = (i, u, z) => {
  const s = ST[i];
  return s.run === "x" ? [s.cx + u, s.cy + KI.wide / 2, z] : [s.cx + KI.wide / 2, s.cy + u, z];
};
const leverD = (i, u, closed) => {
  const half = PANEL.gap;
  return closed ? open([faceAt(i, u - half, PANEL.bus), faceAt(i, u + half, PANEL.bus)]) : open([faceAt(i, u, PANEL.bus - half), faceAt(i, u, PANEL.bus + half)]);
};
for (let i = 1; i <= 4; i++) {
  const s = ST[i];
  const owner = "st" + i;
  const plinth = kioskPlan(i, 0.8);
  box("st.plinth", plinth, 0, KI.plinth, { tone: "lo" }, { owner, steps: 2, bevel: 0.3 });
  const body = kioskPlan(i);
  const z0 = KI.plinth;
  const z1 = KI.plinth + KI.h;
  const { u, z0: pz0, z1: pz1, bus, gap, hub } = PANEL;
  const panel = poly([faceAt(i, -u, pz0), faceAt(i, u, pz0), faceAt(i, u, pz1), faceAt(i, -u, pz1)]);
  const busD = [
    open([faceAt(i, -u, bus), faceAt(i, -hub - gap, bus)]),
    open([faceAt(i, -hub + gap, bus), faceAt(i, hub - gap, bus)]),
    open([faceAt(i, hub + gap, bus), faceAt(i, u, bus)]),
  ].join("");
  const fuse = poly([faceAt(i, -0.9, 5.8), faceAt(i, 0.9, 5.8), faceAt(i, 0.9, 8.2), faceAt(i, -0.9, 8.2)]);
  const drop = open([faceAt(i, 0, bus), faceAt(i, 0, 8.2)]);
  const terminals = [-hub - gap, -hub + gap, hub - gap, hub + gap].map((uu) => at(faceAt(i, uu, bus)));
  const levers = [-1, 1]
    .map((side) => {
      const dev = "s" + i + (side * s.dir < 0 ? "L" : "R");
      const uu = side * hub;
      return `<g data-lever="${dev}"><path class="iso-line rg-pose rg-lever" data-pose="closed" data-free="" d="${leverD(i, uu, true)}"/><path class="iso-line rg-pose rg-lever" data-pose="open" data-free="" d="${leverD(i, uu, false)}"/></g>` + Dt([at(faceAt(i, uu, bus))], { size: 0.62, tone: "hi" });
    })
    .join("");
  const fpi = at(faceAt(i, u - 2.2, pz1 - 2));
  const fpiSvg = `<circle class="rg-fpi" data-fpi="${i}" cx="${fpi[0].toFixed(2)}" cy="${fpi[1].toFixed(2)}" r="2.4"/>`;
  // the end face (toward the viewer's other side): transformer-room louvres and door split
  const endFace = (uu, z) => (s.run === "x" ? [s.cx + KI.len / 2, s.cy + uu, z] : [s.cx + uu, s.cy + KI.len / 2, z]);
  const louvres = [];
  for (let n = 0; n < 3; n++) {
    const z = z1 - 3.4 - n * 1.9;
    louvres.push(poly([endFace(-4, z), endFace(4, z), endFace(4, z - 0.8), endFace(-4, z - 0.8)]));
  }
  const extra =
    `<path class="rg-panel" d="${panel}"/>` +
    L(panel, { tone: "lo" }) +
    L(busD + drop, { tone: "mid" }) +
    L(fuse, { tone: "mid" }) +
    Dt(terminals, { size: 0.4, tone: "mid" }) +
    levers +
    fpiSvg +
    L(louvres.join(""), { tone: "lo" }) +
    L(open([endFace(0, z0 + 0.4), endFace(0, z1 - 7)]), { tone: "faint" }) +
    Dt([at(endFace(-1.6, z0 + 5)), at(endFace(1.6, z0 + 5))], { size: 0.45, tone: "mid" });
  box("st.kiosk", body, z0, z1, { tone: "mid" }, { owner, steps: 2, bevel: 0.4, inner: L(k.sideSeam(body, z0 + 1.6, P, 2), { tone: "faint" }), extra });
  const roof = kioskPlan(i, 1.1);
  const rz = z1 + KI.roof;
  const digit = k.faceTextSvg(k.topMatrix([s.cx - (s.run === "x" ? 9 : 2.8), s.cy + (s.run === "x" ? 3 : 9), rz], rz, P, "x"), String(i), { size: 8, tone: "mid" });
  box("st.roof", roof, z1, rz, { tone: "mid" }, { owner, steps: 2, bevel: 0.4, extra: digit });
  // roof lamp: a base ring and a lens that lights petrol when the station is live
  const lx = s.run === "x" ? s.cx + 8 : s.cx;
  const ly = s.run === "x" ? s.cy : s.cy - 8;
  post("st.lamp-base", lx, ly, 2, rz, rz + 0.8, { tone: "mid" }, { owner, steps: 18 });
  post("st.lamp", lx, ly, 1.3, rz + 0.8, rz + 2.6, { tone: "hi", crease: "none" }, { owner, steps: 18, attrs: ` data-lamp="${i}"` });
}

// ---------------------------------------------------------------- customers
// Two houses per station stand for its customers; their windows go dark when
// the station loses supply.
let windows = 0;
for (let i = 1; i <= 4; i++) {
  for (const [hx, hy] of HOUSES[i]) {
    const plan = { x: hx - HOUSE.w / 2, y: hy - HOUSE.d / 2, w: HOUSE.w, d: HOUSE.d, r: 0.4 };
    const fy = plan.y + plan.d;
    const fx = plan.x + plan.w;
    const win = (x0, x1) => {
      windows++;
      return `<path class="rg-win" data-st="${i}" d="${poly([[x0, fy, 2.6], [x1, fy, 2.6], [x1, fy, 5.2], [x0, fy, 5.2]])}"/>`;
    };
    const side = `<path class="rg-win" data-st="${i}" d="${poly([[fx, hy - 1.4, 2.6], [fx, hy + 1.4, 2.6], [fx, hy + 1.4, 5.2], [fx, hy - 1.4, 5.2]])}"/>`;
    windows++;
    box("house.body", plan, 0, HOUSE.h, { tone: "mid" }, { steps: 2, bevel: 0.2, extra: win(hx - 4, hx - 1.2) + win(hx + 1.2, hx + 4) + side });
    const F = G.frameOf([plan.x - 0.6, hy, HOUSE.h], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
    const half = HOUSE.d / 2 + 0.8;
    const tri = [[-half, 0], [half, 0], [0, HOUSE.roof]];
    const shape = R.solid(A.prism(F, tri, 0, HOUSE.w + 1.2, { name: "house.roof" }));
    put("house.roof", [hx, hy, HOUSE.h + 1.5], S(G.prismOf(F, tri, 0, HOUSE.w + 1.2, P), { tone: "mid", crease: "lo" }), [shape]);
  }
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);

// Tap zones: one per station and one for the OS, at least 44 px on a phone.
const HIT_R = 44;
const hitAt = [at([-74, -46, 10]), ...[1, 2, 3, 4].map((i) => at([ST[i].cx, ST[i].cy, 9]))];
const hits = hitAt.map(([x, y], n) => `<circle class="rg-hit" data-hit="${n}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${HIT_R}"/>`).join("");
const FLASH_AT = at([...FAULT_AT, 0]);
const body = [...halo, ...groups, `<g data-hits="">${hits}</g>`];

const LABEL_NL =
  "Een middenspanningsring als model op een grondplaat. Achter links staat het HS/MS-onderstation met een vermogenstransformator en twee uitgaande velden, A en B, elk met een schakelmes op steunisolatoren. Vanuit veld A loopt de kabel langs vier compacte stations, 1 tot en met 4, en via veld B terug. Elk station heeft een ringkabelinstallatie met twee lastscheiders, een kortsluitverklikker en een lamp op het dak; bij elk station staan twee huizen voor zijn klanten. Het normaal open punt zit in station 3, richting station 4. Een kabelfout tussen station 1 en 2 laat veld A uitschakelen: stations 1, 2 en 3 gaan uit. Schakel de kabel aan beide kanten vrij, schakel veld A weer in en sluit het normaal open punt.";
const LABEL_EN =
  "A medium-voltage ring as a model on a base plate. At the back left stands the HS/MS substation with a power transformer and two feeder bays, A and B, each with a breaker blade on post insulators. From bay A the cable runs past four compact stations, 1 to 4, and back through bay B. Each station has a ring-main unit with two load-break switches, a fault passage indicator and a lamp on the roof; two houses beside each station stand for its customers. The normally open point is in station 3, toward station 4. A cable fault between stations 1 and 2 trips bay A: stations 1, 2 and 3 go dark. Isolate the cable on both sides, reclose bay A and close the normally open point.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- page CSS (Vantage palette)
const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#1D4A55;--anatomy-lit-shade:#173D47;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --rg-hair:rgba(240,233,218,.12);--rg-accent:#5C9FAE;--rg-dead:#45615D;--rg-trench:#0A1E23;--rg-panel:#0F2A31;
  --rg-win-on:#F0E9DA;--rg-win-off:#071619;--rg-fault:#F0E9DA;--rg-lamp-off:#26433F;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --rg-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --rg-hair:rgba(11,41,27,.14);--rg-accent:#276F81;--rg-dead:#A9AE9E;--rg-trench:#E4DCC9;--rg-panel:#F0EADD;
  --rg-win-on:#BFD8DC;--rg-win-off:#33433C;--rg-fault:#0B291B;--rg-lamp-off:#D0CAB8;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--rg-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 172px);min-height:250px;padding:26px 4px 146px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--rg-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--rg-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:76px!important;top:auto!important;max-width:calc(100% - 138px);white-space:normal;color:var(--anatomy-muted);letter-spacing:0!important;line-height:1.3}
.iso-plate-corner[data-corner="readout"]{bottom:76px!important;top:auto!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.rg-note{display:block;color:var(--anatomy-strong);font-weight:500}
.rg-note[data-kind="no"]{color:var(--anatomy-strong);font-weight:600}
.rg-tip{display:block}
.rg-line{display:block;white-space:nowrap}
.rg-acc{color:var(--rg-accent);font-weight:600}
.rg-strong{color:var(--anatomy-strong);font-weight:600}
.rg-mute{color:var(--anatomy-muted)}
.rg-model{position:absolute;left:0;right:0;bottom:0;font-family:var(--rg-sans);font-size:9.5px;line-height:1.3;color:var(--anatomy-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rg-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;border-radius:8px}
.rg-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.rg-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.rg-controls{position:absolute;left:10px;right:10px;bottom:20px;height:44px;display:flex;align-items:center;gap:5px}
.rg-btn{min-width:44px;min-height:44px;height:44px;padding:0 7px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1.15 var(--rg-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--rg-hair);display:inline-flex;flex-direction:column;align-items:center;justify-content:center;white-space:nowrap}
.rg-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.rg-btn small{font-size:10px;color:var(--anatomy-muted);font-weight:400}
.rg-btn b{font-weight:600;color:var(--anatomy-strong)}
.rg-btn[data-state="open"] b{color:var(--anatomy-muted);font-weight:500}
.rg-btn[disabled]{opacity:.45;cursor:default}
.rg-st{flex:0 0 52px;box-shadow:inset 0 0 0 1.5px var(--anatomy-mid)}
.rg-st b{font-size:13px}
.rg-dev{flex:1 1 0;max-width:120px}
.rg-reset{flex:0 0 44px;margin-left:auto}
.rg-reset svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.rg-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.rg-trench{fill:none;stroke:var(--rg-trench);stroke-width:6.5px;stroke-linecap:butt;stroke-linejoin:round}
.rg-cable{fill:none;stroke:var(--rg-dead);stroke-width:2.4px;stroke-linecap:butt;stroke-linejoin:round;transition:stroke .45s}
.rg-cable[data-live]{stroke:var(--rg-accent)}
.rg-svc{fill:none;stroke:var(--rg-dead);stroke-width:1.1px;stroke-linecap:round;transition:stroke .45s}
.rg-svc[data-live]{stroke:var(--rg-accent)}
.rg-panel{fill:var(--rg-panel);stroke:none}
.rg-pose{transition:opacity .25s}
[data-open] > .rg-pose[data-pose="closed"],:not([data-open]) > .rg-pose[data-pose="open"]{opacity:0}
.rg-lever{stroke-width:1.5px!important;stroke:var(--anatomy-hi)!important;stroke-linecap:round}
.rg-fpi{fill:var(--rg-lamp-off);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);transition:fill .3s}
.rg-fpi[data-on]{fill:var(--rg-fault)}
.rg-fpi[data-blink]{animation:rg-blink 1.3s ease-in-out infinite}
[data-hidden] .rg-fpi[data-blink]{animation-play-state:paused}
@keyframes rg-blink{0%,100%{opacity:1}50%{opacity:.25}}
.rg-win{fill:var(--rg-win-on);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);transition:fill .5s}
.rg-win[data-off]{fill:var(--rg-win-off)}
.rg-sel{fill:none;stroke:var(--anatomy-hi);stroke-width:1px;stroke-dasharray:3 2.2;opacity:0;transition:opacity .25s}
.rg-sel[data-on]{opacity:.8}
.rg-fault{opacity:0;transition:opacity .4s}
.rg-fault[data-on]{opacity:1}
.rg-burst{fill:none;stroke:var(--rg-fault);stroke-width:1.1px;stroke-linecap:round}
.rg-scorch{fill:var(--rg-fault);stroke:none}
.rg-flash{fill:none;stroke:var(--rg-fault);stroke-width:1.2px;opacity:0}
.rg-hit{fill:transparent;stroke:none;cursor:pointer}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .4s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--rg-accent)}
@media (prefers-reduced-motion:reduce){.rg-fpi[data-blink]{animation:none}.rg-cable,.rg-svc,.rg-pose,.rg-fpi,.rg-win,.rg-sel,.rg-fault,[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const CHAIN = ${JSON.stringify(CHAIN)}, DEVICES = ${JSON.stringify(DEVICES)}, BUSES = ${JSON.stringify(BUSES)};
const CUST = ${JSON.stringify(CUST)}, FAULT = ${JSON.stringify(FAULT)}, ADJ = ${JSON.stringify(ADJ)};
const NORMAL = ${JSON.stringify(NORMAL)};
const START = ${START}, ARRIVE = ${ARRIVE}, STEP_STATION = ${STEP_STATION}, STEP_REMOTE = ${STEP_REMOTE};
const FLASH_AT = ${JSON.stringify(FLASH_AT)};
const HIT_R = ${HIT_R};
${feedOf.toString()}
${offOf.toString()}
${checkOf.toString()}
const costOf = ${costOf.toString()};
const TOTAL = CUST.reduce((a, b) => a + b, 0);

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN ? ${JSON.stringify({
  off: "off", of: "customers", cmin: "cust-min", min: "min",
  normal: "ring normal · NO at 3", tripped: "fault · cable 1–2", isolated: "cable 1–2 isolated", partial: "partly restored", restored: "restored · NO at 1|2",
  os: "OS", st: "St", bay: "bay", to: "to", closed: "closed", opened: "open", on: "on", outw: "off", no: "NO",
  stName: ["substation", "station 1", "station 2", "station 3", "station 4"],
  tip: "Tap a station, then a switch",
  pre: "Ring in normal operation.",
  travel: "Bay A tripped. Technician on the way, on site 08:15.",
  start: "Indicator 1 tripped, 2 did not: the fault is in cable 1–2. Isolate it.",
  one: "One side open. Now the other side of cable 1–2.",
  iso: "Cable 1–2 isolated. Have bay A reclosed.",
  a: "Station 1 back. Close the NO point in 3 (bay B can carry it).",
  b: "2 and 3 back through bay B. Reclose bay A.",
  done: "Everyone back. Cable 1–2 awaits repair; until then no backup.",
  wait: "Wait: the technician is still on the way.",
  busy: "Switching…",
  fault: "Refused: that switches onto the fault.",
  faultB: "Refused: that feeds the fault from the other side.",
  loop: "Refused: that closes the ring. MS rings run open.",
  healthy: "Not needed: that cuts off healthy customers.",
  notThis: "Not this one: the fault is between 1 and 2.",
  undo: "Back as it was.",
  dec: ",",
})} : ${JSON.stringify({
  off: "uit", of: "klanten", cmin: "klantmin", min: "min",
  normal: "ring normaal · NO in 3", tripped: "storing · kabel 1–2", isolated: "kabel 1–2 vrij", partial: "deels hersteld", restored: "hersteld · NO bij 1|2",
  os: "OS", st: "St", bay: "veld", to: "naar", closed: "dicht", opened: "open", on: "in", outw: "uit", no: "NO",
  stName: ["onderstation", "station 1", "station 2", "station 3", "station 4"],
  tip: "Tik een station, dan een schakelaar",
  pre: "Ring in normaal bedrijf.",
  travel: "Veld A is uitgevallen. Monteur onderweg, ter plaatse 08:15.",
  start: "Verklikker 1 sprak aan, 2 niet: de fout zit in kabel 1–2. Schakel die vrij.",
  one: "Eén kant open. Nu de andere kant van kabel 1–2.",
  iso: "Kabel 1–2 vrijgeschakeld. Laat veld A weer inschakelen.",
  a: "Station 1 terug. Sluit het NO-punt in 3 (veld B kan het dragen).",
  b: "2 en 3 terug via veld B. Schakel veld A weer in.",
  done: "Iedereen terug. Kabel 1–2 wacht op reparatie; tot dan geen reserve.",
  wait: "Wacht: de monteur is nog onderweg.",
  busy: "Bezig met schakelen…",
  fault: "Geweigerd: zo schakel je in op de fout.",
  faultB: "Geweigerd: dan voed je de fout van de andere kant.",
  loop: "Geweigerd: dat sluit de ring. MS-ringen draaien open.",
  healthy: "Niet nodig: daar gaan gezonde klanten uit.",
  notThis: "Niet deze: de fout zit tussen 1 en 2.",
  undo: "Terug zoals het was.",
  dec: ".",
})};

const stage = document.querySelector(".rg-stage");
const svg = stage.querySelector("svg");
const all = (sel) => [...svg.querySelectorAll(sel)];
const el = {
  cables: all("[data-cable]"), svc: all(".rg-svc"), wins: all(".rg-win"), lamps: all("[data-lamp]"), levers: all("[data-lever]"),
  blades: all("[data-blade]"), fpis: all("[data-fpi]"), sels: all("[data-sel]"), fault: svg.querySelector("[data-fault]"), flash: svg.querySelector("[data-flash]"),
};
const lines = [...document.querySelectorAll("[data-readout] .rg-line")];
const noteEl = document.querySelector("[data-note]");
const tipEl = document.querySelector("[data-tip]");
const stBtn = document.querySelector(".rg-st");
const devBtns = [...document.querySelectorAll(".rg-dev")];
const resetBtn = document.querySelector(".rg-reset");
const announcer = document.querySelector(".rg-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const fmt = (n) => String(Math.round(n)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.dec);
const clock = (m) => { const v = START + Math.floor(m + 1e-6); return String(Math.floor(v / 60)).padStart(2, "0") + ":" + String(v % 60).padStart(2, "0"); };

// ------------------------------------------------ state
// phase: "pre" (healthy ring), "travel" (tripped, technician on the way),
// "ready" (waiting for the learner), "busy" (a switching action under way).
const state = { sw: { ...NORMAL }, phase: "pre", t: 0, cml: 0, sel: 0, pending: null, target: 0, rate: 0, note: T.pre, kind: "", faulted: false, flashAt: -9, clock: 0, preLeft: 1.4 };

const devsOf = (n) => (n === 0 ? ["brA", "brB"] : ["s" + n + "L", "s" + n + "R"]);
// what each device points at, for its button
const TOWARD = { s1L: T.os, s1R: "2", s2L: "1", s2R: "3", s3L: "2", s3R: "4", s4L: "3", s4R: T.os };

function progressNote(sw) {
  const by = feedOf(sw);
  if (BUSES.every((b) => by[b])) return T.done;
  const isolated = !sw.s1R && !sw.s2L;
  if (!isolated) return (!sw.s1R || !sw.s2L) ? T.one : T.start;
  if (sw.brA && !sw.s3R) return T.a;
  if (!sw.brA && sw.s3R) return T.b;
  return T.iso;
}
function stateLine(sw) {
  if (!state.faulted) return '<span class="rg-mute">' + T.normal + "</span>";
  const by = feedOf(sw);
  if (BUSES.every((b) => by[b])) return '<span class="rg-acc">' + T.restored + "</span>";
  if (!sw.s1R && !sw.s2L) return (sw.brA || sw.s3R) ? T.partial : T.isolated;
  return '<span class="rg-strong">' + T.tripped + "</span>";
}

function render() {
  const sw = state.sw;
  const by = feedOf(sw);
  const live = (e) => Boolean(by[e]);
  el.cables.forEach((c) => c.toggleAttribute("data-live", live(c.dataset.cable)));
  const busLive = (i) => live("b" + i);
  el.svc.forEach((c) => c.toggleAttribute("data-live", busLive(c.dataset.st)));
  el.wins.forEach((w) => w.toggleAttribute("data-off", !busLive(w.dataset.st)));
  el.lamps.forEach((l) => l.toggleAttribute("data-on", busLive(l.dataset.lamp)));
  el.levers.forEach((g) => g.toggleAttribute("data-open", !sw[g.dataset.lever]));
  el.blades.forEach((g) => g.toggleAttribute("data-open", !sw["br" + g.dataset.blade]));
  el.fpis.forEach((f) => { f.toggleAttribute("data-on", state.faulted && f.dataset.fpi === "1"); f.toggleAttribute("data-blink", state.faulted && f.dataset.fpi === "1" && (sw.s1R || sw.s2L)); });
  el.sels.forEach((s) => s.toggleAttribute("data-on", Number(s.dataset.sel) === state.sel));
  el.fault.toggleAttribute("data-on", state.faulted);
  // readout
  const off = BUSES.reduce((sum, b, i) => sum + (by[b] ? 0 : CUST[i]), 0);
  const l1 = clock(state.t) + " · +" + Math.floor(state.t + 1e-6) + " " + T.min;
  const l2 = T.off + " " + off + " / " + TOTAL + " " + T.of;
  const l3 = fmt(state.cml) + " " + T.cmin;
  const l4 = stateLine(sw);
  if (lines[0].textContent !== l1) lines[0].textContent = l1;
  if (lines[1].textContent !== l2) lines[1].textContent = l2;
  if (lines[2].textContent !== l3) lines[2].textContent = l3;
  if (lines[3].innerHTML !== l4) lines[3].innerHTML = l4;
  if (noteEl.textContent !== state.note) noteEl.textContent = state.note;
  noteEl.dataset.kind = state.kind;
  // controls
  const n = state.sel;
  stBtn.innerHTML = "<small>" + (n === 0 ? "HS/MS" : T.st) + "</small><b>" + (n === 0 ? T.os : n) + "</b>";
  stBtn.setAttribute("aria-label", T.stName[n]);
  devsOf(n).forEach((dev, j) => {
    const b = devBtns[j];
    const closed = sw[dev];
    b.dataset.dev = dev;
    b.dataset.state = closed ? "closed" : "open";
    const what = dev.startsWith("br") ? T.bay + " " + dev.slice(2) : T.to + " " + TOWARD[dev] + (dev === "s3R" && !closed && sw.s1R && sw.s2L ? " · " + T.no : "");
    const how = dev.startsWith("br") ? (closed ? T.on : T.outw) : closed ? T.closed : T.opened;
    const html = "<small>" + what + "</small><b>" + how + "</b>";
    if (b.innerHTML !== html) b.innerHTML = html;
    b.setAttribute("aria-label", T.stName[n] + ", " + what + ": " + how);
    b.disabled = state.phase === "pre";
  });
}

// ------------------------------------------------ actions
function say(text, kind) {
  state.note = text; state.kind = kind || "";
  announcer.textContent = text;
}
function act(j) {
  const dev = devsOf(state.sel)[j];
  if (state.phase === "pre") return;
  if (state.phase === "travel") { say(T.wait, "no"); render(); return; }
  if (state.phase === "busy") return;
  const verdict = checkOf(state.sw, dev);
  if (verdict !== "ok") { say(T[verdict], "no"); render(); return; }
  state.pending = dev;
  state.target = state.t + costOf(dev);
  if (still.matches) { finish(); render(); return; }
  state.phase = "busy";
  state.rate = costOf(dev) / (dev.startsWith("br") ? 0.45 : 0.9);
  say(T.busy, "");
  render();
  run();
}
function finish() {
  const dev = state.pending;
  const sw = state.sw;
  state.cml += offOf(sw) * (state.target - state.t);
  state.t = state.target;
  const wasOpen = !sw[dev];
  state.sw = { ...sw, [dev]: !sw[dev] };
  state.pending = null;
  state.phase = "ready";
  const undo = wasOpen && (dev === "s1R" || dev === "s2L");
  say(undo ? T.undo + " " + progressNote(state.sw) : progressNote(state.sw), feedOf(state.sw).b1 && feedOf(state.sw).b2 && feedOf(state.sw).b3 ? "done" : "");
}
function trip() {
  state.faulted = true;
  state.sw = { ...state.sw, brA: false };
  state.flashAt = state.clock;
  if (still.matches) {
    state.cml = offOf(state.sw) * ARRIVE; state.t = ARRIVE; state.phase = "ready"; say(T.start, "");
  } else {
    state.phase = "travel"; state.target = ARRIVE; state.rate = ARRIVE / 2.4; say(T.travel, "");
  }
}
function reset() {
  Object.assign(state, { sw: { ...NORMAL }, phase: "pre", t: 0, cml: 0, pending: null, target: 0, faulted: false, preLeft: 1.2, sel: 0 });
  say(T.pre, "");
  if (still.matches) trip();
  render();
  run();
}

// ------------------------------------------------ time
let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  state.clock += dt;
  if (state.phase === "pre") {
    state.preLeft -= dt;
    if (state.preLeft <= 0) trip();
  } else if (state.phase === "travel" || state.phase === "busy") {
    const step = Math.min(state.target - state.t, dt * state.rate);
    state.cml += offOf(state.sw) * step;
    state.t += step;
    if (state.t >= state.target - 1e-9) {
      if (state.phase === "travel") { state.t = ARRIVE; state.phase = "ready"; say(T.start, ""); }
      else finish();
    }
  }
  // the flash ring at the fault, once
  const age = state.clock - state.flashAt;
  const f = age >= 0 && age < 1.2 ? age / 1.2 : 1;
  el.flash.style.opacity = f < 1 ? String((1 - f) * (1 - f)) : "0";
  if (f < 1) {
    const s = 1 + f * 1.6;
    el.flash.setAttribute("transform", "translate(" + FLASH_AT[0] + " " + FLASH_AT[1] + ") scale(" + s.toFixed(3) + ") translate(" + (-FLASH_AT[0]) + " " + (-FLASH_AT[1]) + ")");
  }
  render();
  const moving = state.phase !== "ready" || f < 1;
  frame = visible && moving ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };

// ------------------------------------------------ controls
function select(n) { state.sel = (n + 5) % 5; render(); }
stBtn.addEventListener("click", () => select(state.sel + 1));
devBtns.forEach((b, j) => b.addEventListener("click", () => act(j)));
resetBtn.addEventListener("click", reset);
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
const HITS = [...svg.querySelectorAll("[data-hit]")].map((c) => [Number(c.getAttribute("cx")), Number(c.getAttribute("cy"))]);
stage.addEventListener("click", (event) => {
  const [x, y] = toView(event);
  let best = -1, bd = Infinity;
  HITS.forEach(([hx, hy], n) => { const d = Math.hypot(hx - x, hy - y); if (d < bd) { bd = d; best = n; } });
  if (best >= 0 && bd <= HIT_R) select(best);
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") select(state.sel + 1);
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") select(state.sel - 1);
  else if (["0", "1", "2", "3", "4"].includes(event.key)) select(Number(event.key));
  else if (event.key === "[" || event.key.toLowerCase() === "q") act(0);
  else if (event.key === "]" || event.key.toLowerCase() === "w") act(1);
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
if (still.matches) trip();
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  svg.toggleAttribute("data-hidden", !visible);
  if (visible) run();
}, { rootMargin: "60px 0px" }).observe(stage);
still.addEventListener("change", () => {
  if (still.matches) {
    cancelAnimationFrame(frame); frame = 0;
    if (state.phase === "pre") trip();
    else if (state.phase === "travel") { state.cml = offOf(state.sw) * ARRIVE; state.t = ARRIVE; state.phase = "ready"; say(T.start, ""); }
    else if (state.phase === "busy") finish();
    el.flash.style.opacity = "0";
    render();
  } else run();
});
render();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "MS-ring: storing vrijschakelen",
    tip: "Tik een station, dan een schakelaar",
    model: "schakelen in een station ≈ 10 min · veld op afstand 2 min",
    station: "Station kiezen",
    reset: "Opnieuw",
    label: LABEL_NL,
    aria: "Model van een MS-ring. Pijltoetsen of de cijfers 0 tot 4 kiezen het onderstation of een station; Q en W bedienen de twee schakelaars van de keuze.",
  },
  en: {
    title: "MS ring: isolating a fault",
    tip: "Tap a station, then a switch",
    model: "switching in a station ≈ 10 min · remote bay 2 min",
    station: "Choose station",
    reset: "Start again",
    label: LABEL_EN,
    aria: "Model of an MS ring. Arrow keys or the digits 0 to 4 choose the substation or a station; Q and W operate the chosen station's two switches.",
  },
};

const RESET_ICON = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.6-3.7"/><path d="M3 2.6v3h3"/></svg>`;
const controls = `<div class="rg-controls"><button type="button" class="rg-btn rg-st" aria-label="${STRINGS.nl.station}"></button><button type="button" class="rg-btn rg-dev" disabled></button><button type="button" class="rg-btn rg-dev" disabled></button><button type="button" class="rg-btn rg-reset" aria-label="${STRINGS.nl.reset}" title="${STRINGS.nl.reset}">${RESET_ICON}</button></div>`;

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="rg-stage" tabindex="0" role="group" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="rg-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="rg-line"></span>'.repeat(4)}</span><span class="rg-model" data-model>${STRINGS.nl.model}</span>`)
  .replace(">HINT<", `><span class="rg-note" data-note></span><span class="rg-tip" data-tip>${STRINGS.nl.tip}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;c("hint").querySelector("[data-tip]").textContent=s.tip;
document.querySelector("[data-model]").textContent=s.model;
var r=document.querySelector(".rg-reset");r.setAttribute("aria-label",s.reset);r.setAttribute("title",s.reset);
var st=document.querySelector(".rg-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, finishFigure(page));
console.log(`model: lesson order +${IDEAL.t} min, ${IDEAL.cml} customer-min; NO point first ${NO_FIRST.cml}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · ${windows} windows · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, {});
