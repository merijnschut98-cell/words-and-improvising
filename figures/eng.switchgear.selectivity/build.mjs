// Dev tool, not shipped. Builds the standalone figure for the lesson
// "Selectivity" (module Switchgear and protection, grid track, level 2).
//
//   node figures/eng.switchgear.selectivity/build.mjs
//
// Writes src/content/courses/figures/eng.switchgear.selectivity.html: one offline
// page with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark and ?lang=nl|en from its URL (defaults: prefers-color-scheme,
// Dutch).
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
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.switchgear.selectivity.html");

// ---------------------------------------------------------------- the model
// A 10 kV radial feeder: the outgoing breaker in the substation (Q1) feeds
// section 1 to station A (Q2), section 2 to station B (Q3), and section 3 to
// the cable end. Each breaker has a definite-time overcurrent relay. A relay
// that sees fault current picks up and times; when its timer reaches its
// setting it trips its breaker, which interrupts the current about 60 ms later.
// Once the current is gone every relay still timing drops off and resets.
// Graded: 0.9 / 0.5 / 0.1 s, a 0.4 s step (typical margin 0.3-0.4 s).
// Not graded: every relay at the same 0.5 s, so all that see the fault trip.
const GRADED = [0.9, 0.5, 0.1];
const FLAT = [0.5, 0.5, 0.5];
const BREAK = 0.06; // s from trip command to current interrupted
const PICKUP = 0.02; // s for the measured current to cross pickup
const RISE = 0.05; // s for the fault current to build to its full value
const KA = [11.8, 8.4, 6.1]; // fault current in kA, by section: further out, more cable impedance
const SPEED = 0.5; // simulated seconds per real second: a 0.9 s grade takes 1.8 s to watch
const CUSTOMERS = [3, 3, 3]; // customers fed from each section

// ---------------------------------------------------------------- the world
// The feeder runs round three sides of the base plate: the substation at the
// back left, section 1 along the back to station A, section 2 down the right
// side to station B, section 3 along the front to the cable end box. The
// customers stand inside the U, each on its own section.
const WIDTH = 600;
const PLATE = { x: -94, y: -70, w: 186, d: 134, r: 8 };
const PLATE_H = 8;
const FOOT_H = 4;
const ST = [
  { x: -66, y: -50, w: 28, d: 24, h: 34, side: "y" },
  { x: 54, y: -50, w: 22, d: 22, h: 28, side: "x" },
  { x: 54, y: 44, w: 22, d: 22, h: 28, side: "x" },
];
const END = { x: -72, y: 38, w: 12, d: 12, r: 1.4 };
const END_H = 13;
const TRAY_Z = 2.5;
const TRAY_T = 1;
const LIP_H = 3.6;
const TRAY_HALF = 4.6;
const CABLE_R = 1.5;
const CABLE_Z = TRAY_Z + TRAY_T + CABLE_R;
const RELAY_Z = [10, 18];
const RELAY_W = 18;
const RELAY_D = 12.5;
const DIAL_R = 5.6;
const DIAL_TOP = RELAY_Z[1] + 1.2;
const POST_H = 7;
const BLADE_L = 12;
const BLADE_W = 2.8;
const BLADE_T = 1.2;
const OPEN_DEG = 58;
const HOUSE_D = 9;
const HOUSE_W = 12;
const HOUSE_H = 8;
const ROOF_H = 5;
const SPAN = (270 * Math.PI) / 180;
const FROM = -SPAN / 2;
const DIAL_MAX = 1; // s full scale

const cabOf = (i) => ({ x: ST[i].x - ST[i].w / 2, y: ST[i].y - ST[i].d / 2, w: ST[i].w, d: ST[i].d, r: 1.6 });
const relayOf = (i) => {
  const st = ST[i];
  return st.side === "y"
    ? { x: st.x - RELAY_W / 2, y: st.y + st.d / 2, w: RELAY_W, d: RELAY_D, r: 1.2 }
    : { x: st.x + st.w / 2, y: st.y - RELAY_W / 2, w: RELAY_D, d: RELAY_W, r: 1.2 };
};
// The dial sits toward the back of the relay top, the lamp in the front corner.
const dialAt = (i) => {
  const b = relayOf(i);
  return ST[i].side === "y" ? [b.x + 6.6, b.y + b.d / 2] : [b.x + b.w / 2, b.y + 6.6];
};
const lampAt = (i) => {
  const b = relayOf(i);
  return ST[i].side === "y" ? [b.x + b.w - 3.2, b.y + b.d - 3] : [b.x + b.w - 3, b.y + b.d - 3.2];
};
const capTop = (i) => ST[i].h + 1.6;
const hingeOf = (i) => [ST[i].x - BLADE_L / 2, ST[i].y, capTop(i) + POST_H + 1.4];
const dialAngle = (t) => FROM + (Math.min(DIAL_MAX, Math.max(0, t)) / DIAL_MAX) * SPAN;

// Sections as cable runs between cabinet faces: [from, to] on the floor.
const SECTIONS = [
  { a: [ST[0].x + ST[0].w / 2, ST[0].y], b: [ST[1].x - ST[1].w / 2, ST[1].y] },
  { a: [ST[1].x, ST[1].y + ST[1].d / 2], b: [ST[2].x, ST[2].y - ST[2].d / 2] },
  { a: [ST[2].x - ST[2].w / 2, ST[2].y], b: [END.x + END.w, END.y + END.d / 2] },
];
const MIDS = SECTIONS.map(({ a, b }) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
// Customers: house centres (front face toward +y), and the factory.
const HOUSES = [
  [[-34, -27], [-16, -27], [2, -27]],
  [[31, -25], [31, -11], [31, 3]],
  [[-6, 27.5], [10, 27.5]],
];
const FACTORY = { x: -52, y: 20, w: 30, d: 13, r: 1 };
const FACTORY_H = 10;

const FIT = [
  ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
  [ST[0].x - BLADE_L / 2, ST[0].y, hingeOf(0)[2] + BLADE_L * Math.sin((OPEN_DEG * Math.PI) / 180) + 2],
  ...k.boxCorners(cabOf(0), 0, ST[0].h + 2),
  ...k.boxCorners(cabOf(1), 0, hingeOf(1)[2] + BLADE_L * Math.sin((OPEN_DEG * Math.PI) / 180) + 2),
];
const PAD = 4;
const AZIMUTH = Number(process.env.AZ ?? 52);
const ELEVATION = Number(process.env.EL ?? 34);
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };

const at = (point) => k.iso(point, P);
let solids = 0;
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const depth = (x, y, z = 0) => k.depthOf([x, y, z], P);
const byDepth = (points) => [...points].sort((a, b) => depth(a[0], a[1]) - depth(b[0], b[1]));
const plan = (cx, cy, w, d, r) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });
const nearest = (p) => Math.max(...[[p.x, p.y], [p.x + p.w, p.y], [p.x, p.y + p.d], [p.x + p.w, p.y + p.d]].map(([x, y]) => depth(x, y)));
const poly = (points) => "M" + points.map((p) => at(p).map((v) => v.toFixed(1)).join(" ")).join("L") + "Z";

// ---------------------------------------------------------------- base
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 16))) out.push(S(k.cylinder(x, y, 5.6, -PLATE_H - FOOT_H, FOOT_H, P, 24), { tone: "lo" }));
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: "mid", inner: L(k.sideSeam(PLATE, -PLATE_H + 3, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 4.5), 0, P), { tone: "faint" }));
  const screws = k.corners(PLATE, 9);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // label plate in the middle of the U
  const label = { x: -20, y: -6, w: 30, d: 13, r: 1 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 3), { tone: "faint" }));
  const lx = label.x + 3.6;
  out.push(L(k.lineOnTop([lx, label.y + 4], [lx + 21, label.y + 4], 0.8, P) + k.lineOnTop([lx, label.y + 6.6], [lx + 15, label.y + 6.6], 0.8, P) + k.lineOnTop([lx, label.y + 9.2], [lx + 9, label.y + 9.2], 0.8, P), { tone: "lo", free: true }));
  out.push(D([at([label.x + label.w - 2.6, label.y + 2.6, 0.8]), at([label.x + label.w - 2.6, label.y + label.d - 2.6, 0.8])], { size: 0.4 }));
  return out.join("");
}

// ---------------------------------------------------------------- stations
// A switchgear cabinet with a cap, door seams and vents; on its roof two post
// insulators carry the breaker's blade (built live).
function cabinet(i) {
  const st = ST[i];
  const out = [];
  const cab = cabOf(i);
  out.push(`<path class="iso-halo" d="${k.haloOf(cab, 0, st.h, P)}" style="opacity:.45"/>`);
  out.push(S(k.slabOf(cab, 0, st.h, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(cab, 3, P, 4) + k.sideSeam(cab, st.h - 6, P, 4), { tone: "faint" }) }));
  // door split on the front (+y) face, from seam to seam; vents as closed slots; door pulls
  const fy = cab.y + cab.d;
  out.push(L(k.segment([st.x, fy, 3], [st.x, fy, st.h - 6], P), { tone: "faint" }));
  const slots = [];
  const ventTop = st.side === "y" ? st.h - 9 : st.h - 10;
  for (const dx of [-st.w / 4, st.w / 4]) {
    for (let n = 0; n < 3; n++) {
      const z = ventTop - n * 2.2;
      const x0 = st.x + dx - 3.2, x1 = st.x + dx + 3.2;
      slots.push(poly([[x0, fy, z], [x1, fy, z], [x1, fy, z - 0.9], [x0, fy, z - 0.9]]));
    }
  }
  out.push(L(slots.join(""), { tone: "lo" }));
  if (st.side !== "y") out.push(D([at([st.x - 1.6, fy, st.h * 0.4]), at([st.x + 1.6, fy, st.h * 0.4])], { size: 0.55, tone: "hi" }));
  // cap
  const cap = k.insetPlan(cab, -1);
  out.push(S(k.slabOf(cap, st.h, 1.6, P, 4, 0.5), { tone: "mid" }));
  out.push(D(k.corners(cap, 2.4).map(([x, y]) => at([x, y, st.h + 1.6])), { size: 0.45 }));
  // post insulators: a ribbed post and a cap
  const z0 = capTop(i);
  for (const px of [st.x - BLADE_L / 2, st.x + BLADE_L / 2]) {
    const ribs = [1.8, 3.6, 5.4].map((z) => k.sideArc(px, st.y, 1.5, z0 + z, P, 14)).join("");
    out.push(S(k.cylinder(px, st.y, 1.5, z0, POST_H, P, 16), { tone: "hi", crease: "none", inner: L(ribs, { tone: "lo" }) }));
    out.push(S(k.cylinder(px, st.y, 2.1, z0 + POST_H, 1.4, P, 16, 0.3), { tone: "mid" }));
  }
  return out.join("");
}

// The relay hangs on the cabinet: a time dial with a setting mark and a
// pointer, a pickup lamp, and a drop flag on its outer face.
function relay(i) {
  const st = ST[i];
  const out = [];
  const box = relayOf(i);
  out.push(S(k.slabOf(box, RELAY_Z[0], RELAY_Z[1] - RELAY_Z[0], P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(box, RELAY_Z[0] + 2.2, P, 3), { tone: "faint" }) }));
  out.push(D(k.corners(box, 1.5).map(([x, y]) => at([x, y, RELAY_Z[1]])), { size: 0.4 }));
  const [cx, cy] = dialAt(i);
  out.push(S(k.cylinder(cx, cy, DIAL_R, RELAY_Z[1], DIAL_TOP - RELAY_Z[1], P, 40), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(cx, cy, DIAL_R - 0.6, DIAL_TOP, P, 40), { tone: "lo" }));
  const ticks = k.radialTicks(cx, cy, DIAL_R - 0.6, 10, 5, DIAL_TOP, [0.8, 1.6], P, FROM, SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(`<path class="iso-line sg-mark" data-tone="mid" data-mark="${i}" style="stroke-width:1.5" d="${markAt(i, 0)}"/>`);
  out.push(`<path class="iso-line" data-tone="hi" data-free="end" data-pointer="${i}" style="stroke-width:1" d="${pointerAt(i, 0)}"/>`);
  out.push(D([at([cx, cy, DIAL_TOP])], { size: 0.55, tone: "hi" }));
  const [lx, ly] = lampAt(i);
  out.push(S(k.cylinder(lx, ly, 1.5, RELAY_Z[1], 0.9, P, 16), { tone: "mid" }));
  out.push(`<path class="sg-lamp" data-lamp="${i}" d="${k.ring(lx, ly, 1, RELAY_Z[1] + 0.9, P, 14)}"/>`);
  // drop flag: pivot pin and flag plate on the outer face
  const fl = st.side === "y"
    ? { pin: [box.x + box.w - 3.2, box.y + box.d, RELAY_Z[1] - 1.3], plate: { x: box.x + box.w - 5, y: box.y + box.d, w: 3.6, d: 0.8, r: 0.3 } }
    : { pin: [box.x + box.w, box.y + box.d - 3.2, RELAY_Z[1] - 1.3], plate: { x: box.x + box.w, y: box.y + box.d - 5, w: 0.8, d: 3.6, r: 0.3 } };
  out.push(`<g data-flag="${i}">${S(k.slabOf(fl.plate, RELAY_Z[1] - 5.2, 3.2, P, 2, 0.2), { tone: "mid", crease: "none" })}</g>`);
  out.push(D([at(fl.pin)], { size: 0.5, tone: "mid" }));
  return out.join("");
}
function pointerAt(i, t) {
  const a = dialAngle(t);
  const [cx, cy] = dialAt(i);
  return k.lineOnTop([cx, cy], [cx + Math.sin(a) * (DIAL_R - 1.2), cy - Math.cos(a) * (DIAL_R - 1.2)], DIAL_TOP + 0.1, P);
}
function markAt(i, t) {
  const a = dialAngle(t);
  const [cx, cy] = dialAt(i);
  const r = DIAL_R - 0.6;
  return k.lineOnTop([cx + Math.sin(a) * (r - 1.9), cy - Math.cos(a) * (r - 1.9)], [cx + Math.sin(a) * r, cy - Math.cos(a) * r], DIAL_TOP + 0.05, P);
}

// ---------------------------------------------------------------- cable trays
function tray(s) {
  const { a, b } = SECTIONS[s];
  const alongX = a[1] === b[1];
  const lo = alongX ? Math.min(a[0], b[0]) : Math.min(a[1], b[1]);
  const hi = alongX ? Math.max(a[0], b[0]) : Math.max(a[1], b[1]);
  const c = alongX ? a[1] : a[0];
  const box = (u0, u1, v0, v1) => (alongX ? { x: u0, y: v0, w: u1 - u0, d: v1 - v0, r: 0.4 } : { x: v0, y: u0, w: v1 - v0, d: u1 - u0, r: 0.4 });
  const pt = (u, v) => (alongX ? [u, v] : [v, u]);
  const out = [];
  for (const u of [lo + 7, hi - 7]) out.push(S(k.slabOf(box(u - 1.4, u + 1.4, c - TRAY_HALF + 0.6, c + TRAY_HALF - 0.6), 0, TRAY_Z, P, 2), { tone: "lo" }));
  out.push(S(k.slabOf(box(lo, hi, c - TRAY_HALF, c - TRAY_HALF + 0.9), TRAY_Z, LIP_H, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf(box(lo, hi, c - TRAY_HALF, c + TRAY_HALF), TRAY_Z, TRAY_T, P, 2), { tone: "lo", crease: "none" }));
  const rungs = [];
  for (let u = lo + 3; u < hi - 1; u += 5) rungs.push(k.lineOnTop(pt(u, c - TRAY_HALF + 0.9), pt(u, c + TRAY_HALF - 0.9), TRAY_Z + TRAY_T, P));
  out.push(L(rungs.join(""), { tone: "faint" }));
  const axis = alongX ? [1, 0, 0] : [0, 1, 0];
  const F = G.frameAlong([...pt(lo, c), CABLE_Z], axis);
  out.push(`<g class="sg-cable" data-cable="${s}">${S(G.solidOf([[0, CABLE_R], [hi - lo, CABLE_R]], F, P), { tone: "hi", crease: "none" })}</g>`);
  const m = alongX ? MIDS[s][0] : MIDS[s][1];
  const M = G.frameAlong([...pt(m - 1.3, c), CABLE_Z], axis);
  out.push(`<g class="sg-fault" data-fault="${s}">${k.solidSvg(G.solidOf([[0, CABLE_R + 0.7], [2.6, CABLE_R + 0.7]], M, P), { tone: "hi", crease: "none" })}</g>`);
  out.push(S(k.slabOf(box(lo, hi, c + TRAY_HALF - 0.9, c + TRAY_HALF), TRAY_Z, LIP_H, P, 2), { tone: "mid", crease: "none" }));
  out.push(D([lo + 7, hi - 7].map((u) => at([...pt(u, c + TRAY_HALF - 0.45), TRAY_Z + LIP_H])), { size: 0.4, tone: "lo" }));
  return { depth: nearest(box(lo, hi, c - TRAY_HALF, c + TRAY_HALF)), svg: out.join("") };
}

function endBox() {
  const out = [];
  out.push(S(k.slabOf(END, 0, END_H, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(END, END_H - 3, P, 3), { tone: "faint" }) }));
  out.push(D(k.corners(END, 1.8).map(([x, y]) => at([x, y, END_H])), { size: 0.4 }));
  return { depth: nearest(END), svg: out.join("") };
}

// ---------------------------------------------------------------- customers
// Each customer is fed by a service cable from its section's tray.
let windows = 0;
function windowOn(x0, x1, y, z0, z1, s) {
  windows++;
  return `<path class="sg-win" data-sec="${s}" d="${poly([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]])}"/>`;
}
const service = (from, to, s) => `<g class="sg-svc" data-sec="${s}">${k.wireSvg(at(from), at(to), { tone: "lo", size: 0.9, ends: "from" })}</g>`;
function serviceFor(s, x, y, w, d) {
  if (s === 0) return service([x, -50 + TRAY_HALF, TRAY_Z + 1.4], [x, y - d / 2 + 0.6, 0.2], s);
  if (s === 1) return service([54 - TRAY_HALF, y, TRAY_Z + 1.4], [x + w / 2 - 0.6, y, 0.2], s);
  return service([x + w / 2 - 2, 44 - TRAY_HALF, TRAY_Z + 1.4], [x + w / 2 - 2, y + d / 2, 0.2], s);
}
function house([x, y], s) {
  const out = [serviceFor(s, x, y, HOUSE_W, HOUSE_D)];
  const body = plan(x, y, HOUSE_W, HOUSE_D, 0.6);
  out.push(S(k.slabOf(body, 0, HOUSE_H, P, 2, 0.3), { tone: "mid" }));
  const fy = y + HOUSE_D / 2;
  out.push(windowOn(x - 4.4, x - 1.4, fy, 3.2, 6, s), windowOn(x + 1.4, x + 4.4, fy, 3.2, 6, s));
  const F = G.frameOf([x - HOUSE_W / 2 - 0.8, y, HOUSE_H], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const half = HOUSE_D / 2 + 1;
  out.push(S(G.prismOf(F, [[-half, 0], [half, 0], [0, ROOF_H]], 0, HOUSE_W + 1.6, P), { tone: "mid", crease: "lo" }));
  return { depth: nearest(body), svg: out.join("") };
}
function factory(s) {
  const f = FACTORY;
  const out = [serviceFor(s, f.x + 6, f.y + f.d / 2, 12, f.d)];
  out.push(S(k.slabOf(f, 0, FACTORY_H, P, 2, 0.4), { tone: "mid", inner: L(k.sideSeam(f, 3, P, 2), { tone: "faint" }) }));
  const fy = f.y + f.d;
  for (let n = 0; n < 4; n++) out.push(windowOn(f.x + 3 + n * 6.6, f.x + 7.4 + n * 6.6, fy, 4.6, 8, s));
  for (let n = 0; n < 2; n++) {
    const x0 = 2 + n * 13;
    const F = G.frameOf([f.x, f.y + f.d / 2, FACTORY_H], [0, -1, 0], [1, 0, 0], [0, 0, 1]);
    out.push(S(G.prismOf(F, [[x0, 0], [x0 + 13, 0], [x0 + 13, 5.4]], -f.d / 2 + 0.6, f.d / 2 - 0.6, P), { tone: "mid", crease: "lo" }));
  }
  out.push(S(k.cylinder(f.x + f.w - 3.6, f.y + 3.6, 1.8, FACTORY_H, 12, P, 16), { tone: "mid", crease: "none", inner: L(k.sideArc(f.x + f.w - 3.6, f.y + 3.6, 1.8, FACTORY_H + 10, P, 12), { tone: "faint" }) }));
  return { depth: nearest(f), svg: out.join("") };
}

// ---------------------------------------------------------------- the live blade
// One blade per breaker, hinged on the left post, rebuilt live as it opens.
const V = G.viewOf(P);
const LIGHT = G.lightOf(P);
const blade = (i) => `<g class="iso-solid sg-blade" data-blade="${i}"><path class="iso-fill"/><path class="iso-shade" data-shade="0"/><path class="iso-shade" data-shade="1"/><path class="iso-shade" data-shade="2"/><path class="iso-shade" data-shade="3"/><path class="iso-top"/><path class="iso-line iso-edge" data-tone="mid"/></g>`;

// ---------------------------------------------------------------- selection outline
const SEL = (s) => {
  const { a, b } = SECTIONS[s];
  const alongX = a[1] === b[1];
  const lo = alongX ? Math.min(a[0], b[0]) : Math.min(a[1], b[1]);
  const hi = alongX ? Math.max(a[0], b[0]) : Math.max(a[1], b[1]);
  const c = alongX ? a[1] : a[0];
  const g = TRAY_HALF + 2.2;
  const p = alongX ? { x: lo + 1.5, y: c - g, w: hi - lo - 3, d: 2 * g, r: 2 } : { x: c - g, y: lo + 1.5, w: 2 * g, d: hi - lo - 3, r: 2 };
  return `<path class="sg-sel" data-sel="${s}" d="${k.planOutline(p, 0, P, 3)}"/>`;
};

// ---------------------------------------------------------------- assemble
const items = [];
ST.forEach((st, i) => {
  items.push({ depth: nearest(cabOf(i)), svg: `<g data-station="${i}">${cabinet(i)}${blade(i)}</g>` });
  items.push({ depth: nearest(relayOf(i)) + 0.01, svg: `<g data-relay="${i}">${relay(i)}</g>` });
});
SECTIONS.forEach((_, s) => items.push(tray(s)));
items.push(endBox());
HOUSES.forEach((list, s) => list.forEach((c) => items.push(house(c, s))));
items.push(factory(2));
items.sort((a, b) => a.depth - b.depth);

const body = [base(), SECTIONS.map((_, s) => SEL(s)).join(""), ...items.map((item) => item.svg)];
const partsBuilt = solids + ST.length; // plus the three live blades

const LABEL_NL =
  "Een middenspanningsstreng op een grondplaat: achter links het onderstation met de uitgaande vermogensschakelaar, dan een kabel op een kabelgoot naar station A, een tweede langs de rechterkant naar station B en een derde langs de voorkant naar de kabeleindkast. Elke schakelaar heeft een relais met een tijdschijf, een aanspreeklamp en een valklep. Langs elke sectie staan huizen of een fabriek. Bij een kortsluiting schakelt alleen de dichtstbijzijnde schakelaar af en gaan alleen de klanten erachter uit; zonder tijdstaffeling valt de hele streng uit.";
const LABEL_EN =
  "A medium-voltage feeder on a base plate: at the back left the substation with the outgoing circuit breaker, then a cable on a tray to station A, a second down the right side to station B and a third along the front to the cable end box. Each breaker has a relay with a time dial, a pickup lamp and a drop flag. Houses or a factory stand along each section. On a fault only the nearest breaker trips and only the customers beyond it lose supply; without time grading the whole feeder goes dark.";

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
  --fl-hair:rgba(240,233,218,.12);--fl-accent:#5C9FAE;--fl-lamp-off:#26433F;--fl-void:#081A1E;
  --sg-win-on:#F0E9DA;--sg-win-off:#071619;--sg-scorch:#E4DDCC;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --fl-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --fl-hair:rgba(11,41,27,.14);--fl-accent:#276F81;--fl-lamp-off:#D0CAB8;--fl-void:#C9C0AA;
  --sg-win-on:#F4EFE3;--sg-win-off:#33433C;--sg-scorch:#1E3328;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--fl-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 100px);min-height:220px;padding:26px 4px 70px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--fl-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 12px 14px}
.iso-plate-corner{font-family:var(--fl-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:48px!important;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.4;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.fl-line{display:block}
.fl-acc{color:var(--fl-accent);font-weight:600}
.fl-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.fl-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.fl-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.fl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.sg-toggle{position:absolute;left:8px;bottom:6px;min-height:44px;min-width:44px;display:inline-flex;align-items:center;gap:8px;padding:0 10px 0 8px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 11.5px/1.2 var(--fl-sans);cursor:pointer;-webkit-tap-highlight-color:transparent}
.sg-toggle:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:0}
.sg-track{position:relative;width:30px;height:17px;border-radius:9px;box-shadow:inset 0 0 0 1px var(--anatomy-mid);background:transparent;transition:background .25s}
.sg-knob{position:absolute;top:3px;left:3px;width:11px;height:11px;border-radius:50%;background:var(--anatomy-mid);transition:transform .25s var(--anatomy-ease),background .25s}
.sg-toggle[aria-checked="true"] .sg-track{background:var(--fl-accent);box-shadow:none}
.sg-toggle[aria-checked="true"] .sg-knob{transform:translateX(13px);background:var(--anatomy-card)}
.sg-state{font-family:var(--anatomy-mono);font-size:10px;color:var(--anatomy-muted)}
.sg-hit{fill:transparent;stroke:none}
.sg-sel{fill:none;stroke:var(--anatomy-mid);stroke-width:var(--anatomy-weight);opacity:0;transition:opacity .3s}
.sg-sel[data-on]{opacity:1}
.sg-lamp{fill:var(--fl-lamp-off);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.sg-lamp[data-on]{fill:var(--anatomy-hi)}
.sg-win{fill:var(--sg-win-on);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);transition:fill .5s}
.sg-win[data-off]{fill:var(--sg-win-off)}
.sg-cable,.sg-svc{transition:opacity .5s}
.sg-cable[data-dead],.sg-svc[data-dead]{opacity:.42}
.sg-fault{display:none}
.sg-fault[data-on]{display:inline}
.sg-fault .iso-top,.sg-fault .iso-shade{fill:var(--sg-scorch)}
.sg-fault[data-cold] .iso-top,.sg-fault[data-cold] .iso-shade{fill:var(--anatomy-lo)}
[data-flag] .iso-solid[data-lit]>.iso-top,[data-flag] .iso-solid[data-lit]>.iso-shade,.sg-blade[data-lit]>.iso-top,.sg-blade[data-lit]>.iso-shade{fill:var(--fl-accent)}
[data-flag] .iso-solid[data-down]>.iso-top,[data-flag] .iso-solid[data-down]>.iso-shade{fill:var(--anatomy-hi)}
@media (prefers-reduced-motion:reduce){.sg-win,.sg-cable,.sg-svc,.sg-sel,.sg-track,.sg-knob{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const V = ${JSON.stringify(V)}, LIGHT = ${JSON.stringify(LIGHT)}, BANDS = [0, 0.2, 0.42, 0.62];
const GRADED = ${JSON.stringify(GRADED)}, FLAT = ${JSON.stringify(FLAT)}, KA = ${JSON.stringify(KA)}, CUSTOMERS = ${JSON.stringify(CUSTOMERS)};
const BREAK = ${BREAK}, PICKUP = ${PICKUP}, RISE = ${RISE}, SPEED = ${SPEED};
const MIDS = ${JSON.stringify(MIDS)}, CABLE_Z = ${CABLE_Z};
const SEGS = ${JSON.stringify(SECTIONS.map(({ a, b }) => [at([...a, CABLE_Z]), at([...b, CABLE_Z])]))};
const DIALS = ${JSON.stringify(ST.map((_, i) => dialAt(i)))}, DIAL_R = ${DIAL_R}, DIAL_TOP = ${DIAL_TOP}, DIAL_MAX = ${DIAL_MAX};
const SPAN = ${SPAN}, FROM = ${FROM};
const HINGES = ${JSON.stringify(ST.map((_, i) => hingeOf(i)))};
const BLADE_L = ${BLADE_L}, BLADE_W = ${BLADE_W}, BLADE_T = ${BLADE_T}, OPEN = ${(OPEN_DEG * Math.PI) / 180};
const FLAG_DROP = 3.2;
const dialAngle = ${dialAngle.toString()};
function pointerAt(i, t) { const a = dialAngle(t); const [cx, cy] = DIALS[i]; return lineOnTop([cx, cy], [cx + Math.sin(a) * (DIAL_R - 1.2), cy - Math.cos(a) * (DIAL_R - 1.2)], DIAL_TOP + 0.1, P); }
function markAt(i, t) { const a = dialAngle(t); const [cx, cy] = DIALS[i]; const r = DIAL_R - 0.6; return lineOnTop([cx + Math.sin(a) * (r - 1.9), cy - Math.cos(a) * (r - 1.9)], [cx + Math.sin(a) * r, cy - Math.cos(a) * r], DIAL_TOP + 0.05, P); }

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { fault: "fault", sec: "section", none: "none", tripped: "tripped", timing: "timing", off: "customers off", of: "of", dec: ".", dev: ["substation", "station A", "station B"], short: ["", "A", "B"], grade: "step 0.4 s (typical 0.3–0.4 s)", flat: "all relays 0.5 s (no step)", on: "on", offw: "off", also: "also", cleared: "cleared", sayFault: "Fault in section ", sayTrip: " trips after ", sayOff: " customers without supply of ", sayAll: "Selectivity off: every relay at 0.5 s.", saySel: "Selectivity on: 0.9, 0.5 and 0.1 s." }
  : { fault: "fout", sec: "sectie", none: "geen", tripped: "uit", timing: "loopt", off: "klanten uit", of: "van", dec: ",", dev: ["onderstation", "station A", "station B"], short: ["", "A", "B"], grade: "trap 0,4 s (typisch 0,3–0,4 s)", flat: "alle relais 0,5 s (geen trap)", on: "aan", offw: "uit", also: "ook", cleared: "afgeschakeld", sayFault: "Fout in sectie ", sayTrip: " schakelt af na ", sayOff: " klanten zonder stroom van ", sayAll: "Selectiviteit uit: elk relais op 0,5 s.", saySel: "Selectiviteit aan: 0,9, 0,5 en 0,1 s." };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);
const TOTAL = CUSTOMERS.reduce((a, b) => a + b, 0);

const stage = document.querySelector(".fl-stage");
const svg = stage.querySelector("svg");
const q = (sel) => [0, 1, 2].map((i) => svg.querySelector(sel.replace("#", i)));
const blades = q('[data-blade="#"]');
const bladeParts = blades.map((g) => ({ fill: g.querySelector(".iso-fill"), shades: [...g.querySelectorAll(".iso-shade")], top: g.querySelector(".iso-top"), edge: g.querySelector(".iso-edge") }));
const pointers = q('[data-pointer="#"]');
const marks = q('[data-mark="#"]');
const lamps = q('[data-lamp="#"]');
const flags = q('[data-flag="#"]');
const flagSolids = flags.map((g) => g.querySelector(".iso-solid"));
const faults = q('[data-fault="#"]');
const sels = q('[data-sel="#"]');
const cables = q('[data-cable="#"]');
const wins = [0, 1, 2].map((s) => [...svg.querySelectorAll('.sg-win[data-sec="' + s + '"]'), ...svg.querySelectorAll('.sg-svc[data-sec="' + s + '"]')]);
const lines = [...document.querySelectorAll("[data-readout] .fl-line")];
const announcer = document.querySelector(".fl-sr");
const toggle = document.querySelector(".sg-toggle");
const toggleState = toggle.querySelector(".sg-state");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ------------------------------------------------ the blade: a thin box rebuilt per frame
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const fx = (n) => n.toFixed(1);
const pathOfPts = (pts) => "M" + pts.map((p) => fx(p[0]) + " " + fx(p[1])).join("L") + "Z";
function hull(points) {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const pt of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], pt) <= 0) lo.pop(); lo.push(pt); }
  for (let i = p.length - 1; i >= 0; i--) { const pt = p[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p[i]) <= 0) up.pop(); up.push(pt); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
const band = (score) => { let t = 0; while (t < BANDS.length && score >= BANDS[t]) t++; return t; };
function drawBlade(i, angle) {
  const H = HINGES[i];
  const d = [Math.cos(angle), 0, Math.sin(angle)], w = [0, 1, 0], n = [-Math.sin(angle), 0, Math.cos(angle)];
  const corner = (a, b, c) => [H[0] + d[0] * a * BLADE_L + w[0] * b * BLADE_W + n[0] * c * BLADE_T, H[1] + d[1] * a * BLADE_L + w[1] * b * BLADE_W + n[1] * c * BLADE_T, H[2] + d[2] * a * BLADE_L + w[2] * b * BLADE_W + n[2] * c * BLADE_T];
  const pt = {};
  for (const a of [0, 1]) for (const b of [-0.5, 0.5]) for (const c of [-0.5, 0.5]) pt[a + "," + b + "," + c] = iso(corner(a, b, c), P);
  const faces = [
    [n, [[0, -0.5, 0.5], [1, -0.5, 0.5], [1, 0.5, 0.5], [0, 0.5, 0.5]]],
    [[-n[0], -n[1], -n[2]], [[0, -0.5, -0.5], [1, -0.5, -0.5], [1, 0.5, -0.5], [0, 0.5, -0.5]]],
    [w, [[0, 0.5, -0.5], [1, 0.5, -0.5], [1, 0.5, 0.5], [0, 0.5, 0.5]]],
    [[0, -1, 0], [[0, -0.5, -0.5], [1, -0.5, -0.5], [1, -0.5, 0.5], [0, -0.5, 0.5]]],
    [d, [[1, -0.5, -0.5], [1, 0.5, -0.5], [1, 0.5, 0.5], [1, -0.5, 0.5]]],
    [[-d[0], -d[1], -d[2]], [[0, -0.5, -0.5], [0, 0.5, -0.5], [0, 0.5, 0.5], [0, -0.5, 0.5]]],
  ];
  const buckets = [[], [], [], [], []];
  for (const [normal, quad] of faces) {
    if (dot(normal, V) <= 1e-6) continue;
    buckets[band(dot(normal, LIGHT))].push(pathOfPts(quad.map((c) => pt[c.join(",")])));
  }
  const outline = pathOfPts(hull(Object.values(pt)));
  const parts = bladeParts[i];
  parts.fill.setAttribute("d", outline);
  parts.shades.forEach((el, t) => el.setAttribute("d", buckets[t].join("")));
  parts.top.setAttribute("d", buckets[4].join(""));
  parts.edge.setAttribute("d", outline);
}

// ------------------------------------------------ protection model
let graded = true;
const settings = () => (graded ? GRADED : FLAT);
// One fault event: which section, and the clock since it started (simulated s).
let ev = null; // { s, t, trips: [time|null x3], clearAt, done }
function sees(i, s) { return i <= s; }
function step(e, dt) {
  e.t += dt;
  const set = settings();
  if (e.clearAt === null) {
    for (let i = 0; i < 3; i++) {
      if (!sees(i, e.s) || e.trips[i] !== null) continue;
      if (e.t - PICKUP >= set[i]) e.trips[i] = PICKUP + set[i];
    }
    const first = Math.min(...e.trips.filter((v) => v !== null));
    if (isFinite(first)) e.clearAt = first + BREAK;
  }
}
const current = (e) => { if (!e) return 0; const on = smooth(0, RISE, e.t); return e.clearAt !== null && e.t >= e.clearAt ? 0 : on; };
const timing = (e, i) => e && sees(i, e.s) && e.t >= PICKUP && (e.clearAt === null || e.t < e.clearAt) && e.trips[i] === null;
function openSet(e) { return e ? [0, 1, 2].filter((i) => e.trips[i] !== null) : []; }
function upstreamOpen(e) { const o = openSet(e); return o.length ? Math.min(...o) : null; }
function offCount(e) { const u = upstreamOpen(e); if (u === null || (e.clearAt !== null && e.t < e.clearAt)) return 0; let n = 0; for (let s = u; s < 3; s++) n += CUSTOMERS[s]; return n; }
function finish(e) { while (e.clearAt === null || e.t < e.clearAt) step(e, 0.002); }

// ------------------------------------------------ what is drawn
const view = [0, 1, 2].map(() => ({ blade: 0, flag: 0, dial: 0, pin: GRADED[0] }));
view.forEach((v, i) => (v.pin = GRADED[i]));
let restoring = false, pending = null, mode = "idle";
let frame = 0, last = 0, visible = false, touring = !still.matches, tourClock = 0, tourStep = -1, idleTimer = 0;

function targets() {
  const set = settings();
  return [0, 1, 2].map((i) => {
    const open = !restoring && ev && ev.trips[i] !== null && ev.t >= ev.trips[i] + BREAK * 0.4;
    const dialT = restoring || !ev ? 0 : timing(ev, i) ? ev.t - PICKUP : ev.trips[i] !== null ? set[i] : 0;
    return { blade: open ? 1 : 0, flag: !restoring && ev && ev.trips[i] !== null ? 1 : 0, dial: dialT, holdDial: !!ev && !restoring && timing(ev, i), pin: set[i] };
  });
}

function draw(dt, calm) {
  const want = targets();
  let moving = false;
  const ease = (from, to, tau) => { if (calm) return to; const next = from + (to - from) * (1 - Math.exp(-dt / tau)); if (Math.abs(to - next) < 1e-3) return to; moving = true; return next; };
  const acc = upstreamOpen(ev && !restoring ? ev : null);
  want.forEach((w, i) => {
    const v = view[i];
    v.blade = ease(v.blade, w.blade, w.blade > v.blade ? 0.09 : 0.16);
    v.flag = ease(v.flag, w.flag, 0.1);
    v.dial = w.holdDial ? w.dial : ease(v.dial, w.dial, 0.22);
    v.pin = ease(v.pin, w.pin, 0.18);
    drawBlade(i, v.blade * OPEN);
    pointers[i].setAttribute("d", pointerAt(i, v.dial));
    marks[i].setAttribute("d", markAt(i, v.pin));
    if (v.flag) flags[i].setAttribute("transform", translateAlong(P, [0, 0, -FLAG_DROP * v.flag])); else flags[i].removeAttribute("transform");
    const lit = acc === i && w.flag === 1;
    blades[i].toggleAttribute("data-lit", lit);
    flagSolids[i].toggleAttribute("data-lit", lit);
    flagSolids[i].toggleAttribute("data-down", w.flag === 1 && !lit);
    lamps[i].toggleAttribute("data-on", !restoring && timing(ev, i));
  });
  // supply: everything beyond the most upstream open breaker is dead once the arc is out
  const u = !restoring && ev && ev.clearAt !== null && ev.t >= ev.clearAt ? upstreamOpen(ev) : null;
  [0, 1, 2].forEach((s) => {
    const dead = u !== null && s >= u;
    wins[s].forEach((el) => el.toggleAttribute(el.classList.contains("sg-win") ? "data-off" : "data-dead", dead));
    cables[s].toggleAttribute("data-dead", dead);
  });
  faults.forEach((el, s) => {
    const on = !!ev && !restoring && ev.s === s;
    el.toggleAttribute("data-on", on);
    el.toggleAttribute("data-cold", on && current(ev) === 0 && ev.clearAt !== null);
    if (on && !calm) el.style.opacity = (0.35 + 0.65 * current(ev)).toFixed(3); else el.style.opacity = "";
    sels[s].toggleAttribute("data-on", !!ev && ev.s === s);
  });
  readout();
  return moving;
}

function readout() {
  let l1, l2, l3;
  if (!ev || restoring) {
    l1 = T.fault + ": " + T.none;
    l2 = T.tripped + ": —";
    l3 = T.off + ": 0 " + T.of + " " + TOTAL;
  } else {
    const ka = KA[ev.s] * current(ev);
    l1 = T.fault + ": " + T.sec + " " + (ev.s + 1) + " · " + (ev.clearAt !== null && ev.t >= ev.clearAt ? T.cleared : fmt(ka, 1) + " kA");
    const u = upstreamOpen(ev);
    if (u === null) l2 = T.timing + " " + fmt(Math.max(0, ev.t - PICKUP), 2) + " s";
    else {
      const others = openSet(ev).filter((i) => i !== u).map((i) => " +" + T.short[i]).join("");
      l2 = T.tripped + ': <span class="fl-acc">' + T.dev[u] + "</span>" + others + " · " + fmt(settings()[u], 2) + " s";
    }
    l3 = T.off + ": " + offCount(ev) + " " + T.of + " " + TOTAL;
  }
  const l4 = graded ? T.grade : T.flat;
  if (lines[0].textContent !== l1) lines[0].textContent = l1;
  if (lines[1].innerHTML !== l2) lines[1].innerHTML = l2;
  if (lines[2].textContent !== l3) lines[2].textContent = l3;
  if (lines[3].textContent !== l4) lines[3].textContent = l4;
}

function say(text) { announcer.textContent = text; }
function sayResult() {
  if (!ev) return;
  const u = upstreamOpen(ev);
  if (u === null) return;
  say(T.sayFault + (ev.s + 1) + ". " + T.dev[u][0].toUpperCase() + T.dev[u].slice(1) + T.sayTrip + fmt(settings()[u], 2) + " s. " + offCount(ev) + T.sayOff + TOTAL + ".");
}
function describe() {
  stage.setAttribute("aria-valuetext", ev ? T.sec + " " + (ev.s + 1) : T.none);
  toggle.setAttribute("aria-checked", String(graded));
  toggleState.textContent = graded ? T.on : T.offw;
}

// ------------------------------------------------ actions
function place(s) {
  // Close everything first if a breaker is open or a flag is down; then start the fault.
  pending = s;
  restoring = !!ev;
  if (still.matches || !restoring) { restoring = false; start(); }
  describe();
}
function start() {
  ev = { s: pending, t: 0, trips: [null, null, null], clearAt: null };
  pending = null;
  if (still.matches) { finish(ev); ev.t += 0.5; sayResult(); }
  describe();
}
function setGraded(on) {
  graded = on;
  ev = null; pending = null; restoring = false;
  say(on ? T.saySel : T.sayAll);
  describe();
}

let announced = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring && !calm) { tourClock += dt; runTour(); }
  if (restoring) {
    const closed = view.every((v) => v.blade === 0 && v.flag === 0 && v.dial === 0);
    if (closed) { restoring = false; ev = null; if (pending !== null) start(); }
  }
  if (ev && !restoring && !calm) {
    const before = upstreamOpen(ev);
    if (ev.clearAt === null || ev.t < ev.clearAt + 4) step(ev, dt * SPEED);
    if (before === null && upstreamOpen(ev) !== null) announced = false;
    if (!announced && ev.clearAt !== null && ev.t >= ev.clearAt) { announced = true; sayResult(); }
  }
  const moving = draw(dt, calm);
  const busy = touring || restoring || moving || (ev && (ev.clearAt === null || ev.t < ev.clearAt + 0.1));
  frame = visible && busy && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };

// ------------------------------------------------ idle tour
// Graded: a fault in section 3, then 2, then 1, each cleared by the nearest
// breaker. Then grading off and a fault in section 3: the whole feeder drops.
const TOUR = [[1.4, () => place(2)], [5.4, () => place(1)], [9.8, () => place(0)], [14.6, () => setGraded(false)], [15.6, () => place(2)], [20.6, () => setGraded(true)]];
const TOUR_LEN = 21.6;
function runTour() {
  if (tourClock >= TOUR_LEN) { tourClock -= TOUR_LEN; tourStep = -1; }
  while (tourStep + 1 < TOUR.length && tourClock >= TOUR[tourStep + 1][0]) { tourStep++; TOUR[tourStep][1](); }
}
function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourClock = 0; tourStep = -1; run(); } }, 40000);
}

// ------------------------------------------------ pointer: tap a section
function sectionAt(event) {
  const m = svg.getScreenCTM();
  if (!m) return 0;
  const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  let best = 0, bestD = Infinity;
  SEGS.forEach(([a, b], s) => {
    const ab = [b[0] - a[0], b[1] - a[1]];
    const u = clamp(((p.x - a[0]) * ab[0] + (p.y - a[1]) * ab[1]) / (ab[0] ** 2 + ab[1] ** 2), 0, 1);
    const d = Math.hypot(p.x - a[0] - u * ab[0], p.y - a[1] - u * ab[1]);
    if (d < bestD) { bestD = d; best = s; }
  });
  return best;
}
let down = null;
stage.addEventListener("pointerdown", (event) => { if (event.button === 0) down = { x: event.clientX, y: event.clientY, id: event.pointerId }; });
stage.addEventListener("pointerup", (event) => {
  if (!down || down.id !== event.pointerId) return;
  const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y);
  down = null;
  if (moved > 10) return;
  steer();
  place(sectionAt(event));
  kick();
});
stage.addEventListener("pointercancel", () => { down = null; });
toggle.addEventListener("click", () => { steer(); setGraded(!graded); kick(); });

// ------------------------------------------------ keyboard: 1-3 places a fault, S toggles grading
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (/^[1-3]$/.test(event.key)) { steer(); place(Number(event.key) - 1); kick(); }
  else if (event.key === "ArrowRight" || event.key === "ArrowLeft") { steer(); const s = ev ? ev.s : pending ?? -1; place(clamp(s + (event.key === "ArrowRight" ? 1 : -1), 0, 2)); kick(); }
  else if (event.key === "s" || event.key === "S") { steer(); setGraded(!graded); kick(); }
  else if (event.key === "Escape") { steer(); if (ev) { pending = null; restoring = true; if (still.matches) { restoring = false; ev = null; } } describe(); kick(); }
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); say(graded ? T.saySel : T.sayAll); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; if (restoring) { restoring = false; if (pending !== null) start(); else ev = null; } else if (ev) finish(ev); tick(performance.now()); } else run(); });
describe();
draw(1 / 60, true);
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Selectiviteit in een MS-streng",
    hint: "Tik een sectie · 1–3",
    label: LABEL_NL,
    toggle: "Selectiviteit",
    aria: "Middenspanningsstreng met drie secties. Tik een sectie of druk 1, 2 of 3 om daar een kortsluiting te plaatsen; S zet de selectiviteit aan of uit, Escape herstelt de streng.",
  },
  en: {
    title: "Selectivity on an MV feeder",
    hint: "Tap a section · 1–3",
    label: LABEL_EN,
    toggle: "Selectivity",
    aria: "Medium-voltage feeder with three sections. Tap a section or press 1, 2 or 3 to place a short circuit there; S turns selectivity on or off, Escape restores the feeder.",
  },
};

const toggleHtml = `<button type="button" class="sg-toggle" role="switch" aria-checked="true"><span class="sg-track" aria-hidden="true"><span class="sg-knob"></span></span><span class="sg-name">${STRINGS.nl.toggle}</span><span class="sg-state">aan</span></button>`;

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: STRINGS.nl.hint,
  readout: "",
  body: `<div class="fl-stage" tabindex="0" role="group" aria-label="${STRINGS.nl.aria}">${svg}</div>${toggleHtml}<div class="fl-sr" aria-live="polite"></div>`,
}).replace("data-readout></span>", 'data-readout><span class="fl-line"></span><span class="fl-line"></span><span class="fl-line"></span><span class="fl-line"></span></span>');

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;c("hint").textContent=s.hint;document.querySelector(".sg-name").textContent=s.toggle;document.querySelector(".sg-state").textContent="on";
var st=document.querySelector(".fl-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${partsBuilt} solids (3 live blades) · ${windows} windows · viewBox ${WIDTH}×${HEIGHT}`);
