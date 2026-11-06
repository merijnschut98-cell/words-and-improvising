// Dev tool, not shipped. Builds the standalone figure for the topic
// CNC-programma (module Verspanen): the lessons eng.machining.cnc (level 1),
// gcode (level 2), offsets (level 3) and cam (level 4).
//
//   node figures/eng.machining.gcode/build.mjs            build the page
//   node figures/eng.machining.gcode/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.machining.gcode.html: one offline page
// with the anatomy kit, the kit's lathe module and the live script inlined. The
// page reads ?theme=light|dark, ?lang=nl|en and ?level=1..4 from its URL
// (defaults: prefers-color-scheme, Dutch, level 2).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
const OUT = join(ROOT, "src/content/courses/figures/eng.machining.gcode.html");

// ---------------------------------------------------------------- the model
// The slot program of the lesson "gcode" (a slot 3 mm deep in a steel plate,
// end mill Ø10 with 4 teeth, tool 3), read the way the control reads it:
// modal G codes, absolute (G90) from the work offset G54, F in mm/min.
//   F640 = fz · z · n = 0.05 · 4 · 3,200
//   N60  G01 Z25 → Z-3 at F150: 28 mm → 11.2 s (mostly air)
//   N70  G01 Y-10 → Y40 at F640: 50 mm → 4.7 s
//   N80  G02 (0,40) → (20,60) R20 clockwise, centre (20,40): 31.4 mm → 2.9 s
// Level 4 (lesson "cam"): toolpath B rapids to Z2 first and feeds the last
// 5 mm: 2.0 s, saving 9 s a part, 9 × 2,000 = 18,000 s = 5 hours.
// Level 3 (lesson "offsets"): G54 Z typed 30 mm too low; the control thinks it
// sits at Z25 while the tool tip is 5 mm under the top of the plate, and the
// rapid N50 drives it into the plate's side.
const PROG_A = [
  ["N10", "G90 G54"],
  ["N20", "T3 M06"],
  ["N30", "S3200 M03"],
  ["N40", "G00 G43 H3 Z25 M08"],
  ["N50", "X0 Y-10"],
  ["N60", "G01 Z-3 F150"],
  ["N70", "Y40 F640"],
  ["N80", "G02 X20 Y60 R20"],
  ["N90", "G00 Z25 M09"],
  ["N100", "M30"],
];
const PROG_B = [...PROG_A.slice(0, 5), ["N60", "G00 Z2"], ["N65", "G01 Z-3 F150"], ...PROG_A.slice(6)];
const RAPID = 30000; // mm/min, an assumed rapid rate (only the small rapid times use it)
const START = [35, -38, 50]; // where the tool stands after the tool change, in G54 (right offset)
const ZERR = -30; // level 3: G54 Z typed 30 mm too low
const RT = 5; // tool radius: end mill Ø10
const TS = 4; // simulated seconds per real second
const PLATE = { x0: -25, x1: 45, y0: -25, y1: 75 }; // the plate in program coordinates (G54)

function compile(lines, start, zerr) {
  let pos = [start[0], start[1], start[2] - zerr];
  let mode = 0, F = 0, S = 0, T = 0, spin = false, cool = false, end = false;
  const out = [];
  for (const [n, w] of lines) {
    const to = pos.slice();
    let moved = false, R = 0;
    for (const word of w.split(" ")) {
      const L = word[0], v = Number(word.slice(1));
      if (L === "G" && [0, 1, 2, 3].includes(v)) mode = v;
      else if (L === "X") { to[0] = v; moved = true; }
      else if (L === "Y") { to[1] = v; moved = true; }
      else if (L === "Z") { to[2] = v; moved = true; }
      else if (L === "F") F = v;
      else if (L === "S") S = v;
      else if (L === "T") T = v;
      else if (L === "R") R = v;
      else if (L === "M") { if (v === 3) spin = true; if (v === 5 || v === 30) spin = false; if (v === 8) cool = true; if (v === 9 || v === 30) cool = false; if (v === 30) end = true; }
    }
    const b = { n, w, kind: !moved ? "none" : mode === 0 ? "rapid" : mode === 1 ? "feed" : "arc", from: pos.slice(), to, F, S, T, spin, cool, end, len: 0, time: 0 };
    if (b.kind === "arc") {
      const dx = to[0] - pos[0], dy = to[1] - pos[1], c = Math.hypot(dx, dy);
      const h = Math.sqrt(Math.max(0, R * R - (c / 2) ** 2));
      const side = mode === 2 ? 1 : -1; // G02: the centre lies right of the chord
      b.c = [(pos[0] + to[0]) / 2 + (side * h * dy) / c, (pos[1] + to[1]) / 2 - (side * h * dx) / c];
      b.a0 = Math.atan2(pos[1] - b.c[1], pos[0] - b.c[0]);
      const a1 = Math.atan2(to[1] - b.c[1], to[0] - b.c[0]);
      let sw = mode === 2 ? b.a0 - a1 : a1 - b.a0;
      while (sw <= 0) sw += 2 * Math.PI;
      b.sw = mode === 2 ? sw : -sw;
      b.r = R;
      b.len = Math.hypot(R * sw, to[2] - pos[2]);
    } else if (moved) b.len = Math.hypot(to[0] - pos[0], to[1] - pos[1], to[2] - pos[2]);
    if (b.kind === "rapid") b.time = (b.len / RAPID) * 60;
    else if (b.kind !== "none") b.time = (b.len / F) * 60;
    out.push(b);
    pos = to;
  }
  return out;
}
function posAt(b, u) {
  const z = b.from[2] + (b.to[2] - b.from[2]) * u;
  if (b.kind === "arc") { const a = b.a0 - b.sw * u; return [b.c[0] + Math.cos(a) * b.r, b.c[1] + Math.sin(a) * b.r, z]; }
  return [b.from[0] + (b.to[0] - b.from[0]) * u, b.from[1] + (b.to[1] - b.from[1]) * u, z];
}
const cycleOf = (blocks) => blocks.reduce((s, b) => s + b.time, 0);

const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) throw new Error(`${what}: ${a} ≠ ${b}`); };
const BA = compile(PROG_A, START, 0);
const BB = compile(PROG_B, START, 0);
const BW = compile(PROG_A, START, ZERR);
const blk = (bs, n) => bs.find((b) => b.n === n);
near(0.05 * 4 * 3200, 640, 1e-9, "lesson F640");
near(blk(BA, "N60").len, 28, 1e-9, "lesson N60 length");
near(blk(BA, "N60").time, 11.2, 1e-9, "lesson N60 time");
near(blk(BA, "N70").len, 50, 1e-9, "lesson N70 length");
near(blk(BA, "N70").time, 4.7, 0.05, "recall N70 time");
near(blk(BA, "N80").c[0], 20, 1e-9, "arc centre x");
near(blk(BA, "N80").c[1], 40, 1e-9, "arc centre y");
near(blk(BA, "N80").len, 10 * Math.PI, 1e-9, "quarter circle R20");
near(blk(BB, "N65").time, 2.0, 1e-9, "lesson feed from Z2");
near(blk(BA, "N60").time - blk(BB, "N65").time - blk(BB, "N60").time, 9.15, 0.01, "lesson saving per part");
near((9 * 2000) / 3600, 5, 1e-9, "lesson 5 hours on 2,000 parts");
near(blk(BW, "N40").to[2] + ZERR, -5, 1e-9, "wrong offset: tip 5 mm under the top");
if (BA.length !== 10) throw new Error("the program has 10 lines");

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, x along the table, +y toward the operator.
// Program X is world x, program Y points away from the operator (world −y).
// The plate (70 × 100 × 20) sits in the vice; the spindle axis stands at
// x = 0, y = SPY. The floor is z = −10.
const WIDTH = 420;
const FLOOR = -10;
const PX = 10, PY = 25; // program (10, 25) is the plate centre
const BLK = { x0: PLATE.x0 - PX, x1: PLATE.x1 - PX, y0: PY - PLATE.y1, y1: PY - PLATE.y0 };
const B0 = 87;
const TOP = 107;
const SPY = 12;
const TOOL_S = 36; // tool face below the nose (collet nut end)
const END_LEN = 42; // end-mill stick-out
const ZS0 = TOP + 2 + TOOL_S + END_LEN; // spindle nose with the tip 2 mm over the plate
const XHOME = -(BLK.x1 + RT + 4); // audit home: the plate left of the tool
const BASE = { x: -140, y: -195, w: 280, d: 300, r: 4 };
const BASE_TOP = 24;
const COL = { x: -70, y: -195, w: 140, d: 70, r: 3 };
const HEAD = { x: -46, y: -112, w: 92, d: 158, r: 4 };
const HB0 = ZS0 + 18;
const HT0 = HB0 + 46;
const ZUP = 50; // the head's highest point in the program (start Z50)
const COL_TOP = HT0 + ZUP + 12;
const TABLE = { x: -100, y: -62, w: 200, d: 124, r: 2 };
const TABLE_Z = [50, 64];
const CON = { x: 150, y: -104, w: 52, d: 16, r: 2 };
const CON_Z = [128, 186];
const CON_POST = [176, -96];
const WIN = { x0: 155, x1: 197, z0: 153, z1: 181, r: 2, depth: 1 };
const MAG = { x: 78, y: -160, z: HT0 - 34, r: 42 };

const FIT = [
  ...k.boxCorners(BASE, FLOOR, BASE_TOP),
  ...k.boxCorners({ x: TABLE.x - 70, y: TABLE.y - 50, w: TABLE.w + 140, d: TABLE.d + 100 }, TABLE_Z[0], TABLE_Z[1]),
  ...k.boxCorners(COL, BASE_TOP, COL_TOP),
  ...k.boxCorners(HEAD, HB0, HT0 + 30 + ZUP),
  ...k.boxCorners({ x: CON.x, y: CON.y, w: CON.w, d: CON.d }, FLOOR, CON_Z[1] + 2),
  [MAG.x + 20, MAG.y - MAG.r, MAG.z + MAG.r],
  [MAG.x + 20, MAG.y + MAG.r, MAG.z - MAG.r],
];
const PAD = 6;
const AZIMUTH = Number(process.env.AZ ?? 60);
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
const frameDown = (o) => G.frameOf(o, [0, 0, -1], X, Y);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const { sinA, cosA } = k.cameraOf(P);
const SHADE_Y = Math.min(3, Math.max(0, Math.floor(((cosA + 1) / 2) * 4)));
const SHADE_X = Math.min(3, Math.max(0, Math.floor(((-sinA + 1) / 2) * 4)));

// ---------------------------------------------------------------- recorder
const MOVE = [-2 * XHOME, 0, 0];
const R = A.recorder(P, { order: ["x"], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { piece = "", bias = 0, attrs = "" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece, move: piece ? MOVE : [0, 0, 0], attrs });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
const grp = (g) => ({ piece: g === "x" ? "x" : "", attrs: ` data-g="${g}"` });
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", g = "s", ...opts } = {}) {
  const ground = name.startsWith("stand.");
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, ...(ground ? { ground: true } : {}) }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], { ...grp(g), ...opts });
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", g = "s", ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, ...(name.startsWith("stand.") ? { ground: true } : {}) }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], { ...grp(g), ...opts });
}
function turned(name, F, profile, style = {}, { extra = "", inner = "", g = "s", ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], { ...grp(g), ...opts });
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", g = "s", steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], { ...grp(g), ...opts });
}

// A recess in the face y = const: inner walls shaded by facing, a back plane
// holding `back`, clipped to the opening.
let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "gc-glass") {
  const id = `gc-clip-${clips++}`;
  const ring = k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 6);
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const tops = [];
  const sides = [[], [], [], []];
  ring.forEach(([ax, az], index) => {
    const [bx, bz] = ring[(index + 1) % ring.length];
    const length = Math.hypot(bx - ax, bz - az) || 1;
    let [nx, nz] = [(bz - az) / length, -(bx - ax) / length];
    if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) [nx, nz] = [-nx, -nz];
    if (nx <= 0 && nz <= 0) return;
    const quad = k.pathOf([at([ax, y, az]), at([bx, y, bz]), at([bx, y - depth, bz]), at([ax, y - depth, az])], true);
    if (nz >= nx) tops.push(quad);
    else sides[Math.min(3, Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4)))].push(quad);
  });
  const shape = flatRect(x0, z0, x1, z1, r);
  return [
    `<clipPath id="${id}"><path transform="${planeOf(y)}" d="${shape}"/></clipPath>`,
    `<g clip-path="url(#${id})">`,
    `<path class="iso-top" d="${tops.join("")}"/>`,
    ...sides.map((d, shade) => (d.length ? `<path class="iso-shade" data-shade="${shade}" d="${d}"/>` : "")),
    `<g transform="${planeOf(y - depth)}"><path class="${backClass}" d="${shape}"/>${back}<path class="iso-line" data-tone="faint" d="${shape}"/></g>`,
    `</g>`,
    `<g transform="${planeOf(y)}"><path class="iso-line" data-tone="lo" d="${shape}"/></g>`,
  ].join("");
}

// ---------------------------------------------------------------- shared live geometry
// These draw the parts that change every frame. They take the kit and the lathe
// module as arguments, so the build and the page run the very same code.

// The slot milled so far, as an outline in program coordinates: the centreline
// points offset by the tool radius, with round ends.
function slotOutline(pts, r) {
  const out = [];
  const n = pts.length;
  if (n < 2) {
    for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; out.push([pts[0][0] + Math.cos(a) * r, pts[0][1] + Math.sin(a) * r]); }
    return out;
  }
  const tan = pts.map((_, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  });
  const left = pts.map(([x, y], i) => [x - tan[i][1] * r, y + tan[i][0] * r]);
  const right = pts.map(([x, y], i) => [x + tan[i][1] * r, y - tan[i][0] * r]);
  const cap = (p, from) => {
    const res = [];
    const a0 = Math.atan2(from[1] - p[1], from[0] - p[0]);
    for (let i = 1; i < 14; i++) { const a = a0 - (Math.PI * i) / 14; res.push([p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r]); }
    return res;
  };
  return [...left, ...cap(pts[n - 1], left[n - 1]), ...right.slice().reverse(), ...cap(pts[0], right[0])];
}
// What the tool has cut by block i at fraction u: the centreline under the top
// of the plate and the depth reached.
function cutOf(blocks, i, u, zerr) {
  const pts = [];
  let depth = 0;
  for (let j = 0; j <= i && j < blocks.length; j++) {
    const b = blocks[j];
    if (b.kind === "none" || b.kind === "rapid") continue;
    const uu = j < i ? 1 : u;
    const steps = Math.max(1, Math.ceil((b.len * uu) / 1.5));
    for (let s = 0; s <= steps; s++) {
      const p = posAt(b, (uu * s) / steps);
      const rz = p[2] + zerr;
      if (rz > -1e-6) continue;
      depth = Math.max(depth, -rz);
      const last = pts[pts.length - 1];
      if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > 0.4) pts.push([p[0], p[1]]);
    }
  }
  return pts.length ? { pts, depth } : null;
}
// The plate in the vice, with the slot cut so far and the work offset G54
// marked on its top. Drawn at the table's audit home (x shifted by XHOME).
function plateSvg(K, P, cut, shadeY, shadeX) {
  const W = (x, y, z) => K.iso([x - PX + XHOME, PY - y, TOP + z], P);
  const Wb = (x, y, z) => K.iso([x + XHOME, y, z], P);
  const poly = (pts) => K.pathOf(pts, true);
  const out = [];
  const edges = [];
  const add = (cls, pts) => { const d = poly(pts); out.push(`<path class="${cls}" d="${d}"/>`); edges.push(d); };
  add("iso-top", [[BLK.x0, BLK.y0], [BLK.x1, BLK.y0], [BLK.x1, BLK.y1], [BLK.x0, BLK.y1]].map(([x, y]) => Wb(x, y, TOP)));
  add(`iso-shade" data-shade="${shadeY}`, [[BLK.x0, B0], [BLK.x1, B0], [BLK.x1, TOP], [BLK.x0, TOP]].map(([x, z]) => Wb(x, BLK.y1, z)));
  add(`iso-shade" data-shade="${shadeX}`, [[BLK.y0, B0], [BLK.y1, B0], [BLK.y1, TOP], [BLK.y0, TOP]].map(([y, z]) => Wb(BLK.x1, y, z)));
  out.push(`<path class="iso-line" data-tone="mid" d="${edges.join("")}"/>`);
  // the work offset G54: a ring at the zero point and two short axes, +X and +Y
  const o = W(0, 0, 0), ex = W(9, 0, 0), ey = W(0, 9, 0);
  const ring = [];
  for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2; ring.push(W(Math.cos(a) * 2.6, Math.sin(a) * 2.6, 0)); }
  out.push(`<path class="iso-line" data-tone="lo" d="${K.pathOf(ring, true)}M${o[0].toFixed(2)} ${o[1].toFixed(2)}L${ex[0].toFixed(2)} ${ex[1].toFixed(2)}M${o[0].toFixed(2)} ${o[1].toFixed(2)}L${ey[0].toFixed(2)} ${ey[1].toFixed(2)}"/>`);
  out.push(K.dotsSvg([o, ex, ey], { size: 0.5, tone: "hi" }));
  if (cut) {
    const ol = slotOutline(cut.pts, RT);
    const top = poly(ol.map(([x, y]) => W(x, y, 0)));
    const floor = poly(ol.map(([x, y]) => W(x, y, -cut.depth)));
    out.push(`<clipPath id="gc-slot-clip"><path d="${top}"/></clipPath>`);
    out.push(`<path class="iso-shade" data-shade="0" d="${top}"/>`);
    out.push(`<g clip-path="url(#gc-slot-clip)"><path class="gc-cut" d="${floor}"/><path class="iso-line" data-tone="lo" d="${floor}"/></g>`);
    out.push(`<path class="iso-line" data-tone="mid" d="${top}"/>`);
  }
  return `<g class="iso-solid">${out.join("")}</g>`;
}

// The end mill: a solid carbide body with helical flutes that turn with the
// spindle. Drawn at the spindle's home height; the head group moves it.
function endMillSvg(K, GG, P, d, z, phase, spy) {
  const r = d / 2;
  const F = GG.frameOf([0, spy, ZS0], [0, 0, -1], [1, 0, 0], [0, 1, 0]);
  const s0 = TOOL_S, s1 = TOOL_S + END_LEN, sf = s1 - 24;
  let out = K.solidSvg(GG.solidOf([[s0, r], [s1 - 0.6, r], [s1, r - 0.6]], F, P), { tone: "hi", crease: "lo", lit: true });
  const V = GG.viewOf(P);
  const lead = 0.55 / r;
  const lines = [];
  for (let i = 0; i < z; i++) {
    let run = [];
    for (let j = 0; j <= 24; j++) {
      const s = sf + j;
      const t = phase + (i / z) * Math.PI * 2 - (s - sf) * lead;
      const nrm = [Math.cos(t), Math.sin(t), 0];
      const facing = nrm[0] * V[0] + nrm[1] * V[1];
      if (facing > 0.04) run.push(K.iso(GG.pointOf(F, Math.min(s, s1 - 0.6), r, t), P));
      else if (run.length) { if (run.length > 1) lines.push(K.pathOf(run)); run = []; }
    }
    if (run.length > 1) lines.push(K.pathOf(run));
  }
  out += `<path class="iso-line" data-tone="lo" d="${lines.join("")}${GG.arcOf(F, sf, r, P)}"/>`;
  return out;
}

// ---------------------------------------------------------------- floor, base, Y ways
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BASE, -4), FLOOR, 2, P)}"/>`, `<path class="iso-halo" d="${k.haloOf({ x: CON_POST[0] - 24, y: CON_POST[1] - 20, w: 48, d: 42, r: 4 }, FLOOR, 1, P)}" style="opacity:.6"/>`];
for (const [x, y] of k.corners(BASE, 16)) post("stand.foot", x, y, 9, FLOOR, 0, { tone: "lo" }, { steps: 6 });
{
  const bolts = k.corners(BASE, 8);
  const extra = L(k.planOutline(k.insetPlan(BASE, 4), BASE_TOP, P, 3), { tone: "faint" }) + L(bolts.map(([x, y]) => k.ring(x, y, 2.4, BASE_TOP, P, 14)).join(""), { tone: "lo" }) + Dt(bolts.map(([x, y]) => at([x, y, BASE_TOP])), { size: 0.5 });
  const fy = BASE.y + BASE.d;
  const plate = [
    `<g transform="${planeOf(fy)}"><path class="gc-card" d="${flatRect(-112, 7, -64, 20, 1.2, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M-106 -16.6H-74M-106 -13.4H-84M-106 -10.2H-78"/></g>`,
    Dt([[-110, fy, 18.6], [-66, fy, 18.6], [-110, fy, 8.4], [-66, fy, 8.4]].map(at), { size: 0.42 }),
  ].join("");
  box("stand.base", BASE, 0, BASE_TOP, { tone: "lo" }, { steps: 3, bevel: 0.8, inner: L(k.sideSeam(BASE, 5, P, 3), { tone: "faint" }), extra: extra + plate });
}
for (const x of [-94, 78]) {
  const way = { x, y: -118, w: 16, d: 218, r: 1 };
  const bolts = [-106, -74, -42, -10, 22, 54, 86].map((y) => [x + 8, y]);
  box("yway", way, BASE_TOP, BASE_TOP + 6, { tone: "mid", crease: "lo" }, { bevel: 0.4, extra: Dt(bolts.map(([bx, by]) => at([bx, by, BASE_TOP + 6])), { size: 0.4, tone: "lo" }) });
  box("yway.stop", { x: x + 2, y: 92, w: 12, d: 8, r: 0.6 }, BASE_TOP + 6, BASE_TOP + 11, { tone: "mid" }, { bevel: 0.3 });
}

// ---------------------------------------------------------------- saddle (Y) and X ways
{
  const sad = { x: -100, y: -55, w: 200, d: 112, r: 2 };
  box("y.saddle", sad, BASE_TOP + 6, TABLE_Z[0] - 4, { tone: "mid" }, { g: "y", bevel: 0.6, inner: L(k.sideSeam(sad, BASE_TOP + 12, P, 2), { tone: "faint" }) });
  for (const x of [-104, 100]) box("y.wiper", { x, y: -53, w: 4, d: 108, r: 0.6 }, BASE_TOP + 9, TABLE_Z[0] - 6, { tone: "lo" }, { g: "y" });
  for (const y of [-46, 34]) {
    const way = { x: -96, y, w: 192, d: 12, r: 0.8 };
    box("y.xway", way, TABLE_Z[0] - 4, TABLE_Z[0], { tone: "mid", crease: "lo" }, { g: "y", bevel: 0.3 });
  }
  const Fh = frameY([70, sad.y + sad.d, BASE_TOP + 14]);
  discAt("y.boss", Fh, 0, 3, 6, { tone: "mid" }, { g: "y", extra: Dt([at(G.pointOf(Fh, 3, 0, 0))], { size: 0.5, tone: "hi" }) });
}

// ---------------------------------------------------------------- table, vice, plate (X)
const XG = { g: "x" };
{
  const fy = TABLE.y + TABLE.d;
  const ticks = k.sideTicks(TABLE.x + 6, TABLE.x + TABLE.w - 6, 5, 5, fy + 0.8, TABLE_Z[1] - 4, [1.6, 3.2], P);
  const slots = [-36, 0, 36].map((y) => k.planOutline({ x: TABLE.x, y: y - 5, w: TABLE.w, d: 10, r: 0 }, TABLE_Z[1], P, 1)).join("");
  const tp = { ...TABLE, x: TABLE.x + XHOME };
  box("x.table", tp, TABLE_Z[0], TABLE_Z[1], { tone: "mid" }, { ...XG, bevel: 0.6, inner: L(k.sideSeam(tp, TABLE_Z[0] + 4, P, 2), { tone: "faint" }), extra: `<g transform="${k.translateAlong(P, [XHOME, 0, 0])}">${L(slots, { tone: "faint" })}</g>` });
  const strip = { x: TABLE.x + 4 + XHOME, y: fy, w: TABLE.w - 8, d: 0.8, r: 0.2 };
  box("x.scale", strip, TABLE_Z[0] + 3, TABLE_Z[1] - 3, { tone: "lo", crease: "none" }, { ...XG, extra: `<g transform="${k.translateAlong(P, [XHOME, 0, 0])}">${L(ticks.minor, { tone: "lo" })}${L(ticks.major, { tone: "mid" })}</g>` });
}
const vx = (plan) => ({ ...plan, x: plan.x + XHOME });
{
  const base = vx({ x: -75, y: -50, w: 160, d: 100, r: 2 });
  box("x.vice-base", base, TABLE_Z[1], TABLE_Z[1] + 6, { tone: "mid" }, { ...XG, bevel: 0.4 });
  for (const [x, y] of [[-71, -46], [-71, 46], [81, -46], [81, 46]]) post("x.vice-bolt", x + XHOME, y, 3.2, TABLE_Z[1] + 6, TABLE_Z[1] + 9, { tone: "mid" }, { ...XG, steps: 6, extra: Dt([at([x + XHOME, y, TABLE_Z[1] + 9])], { size: 0.4, tone: "hi" }) });
  const bed = vx({ x: -69, y: -45, w: 148, d: 90, r: 1.5 });
  box("x.vice-bed", bed, TABLE_Z[1] + 6, B0, { tone: "mid" }, { ...XG, bevel: 0.5, inner: L(k.sideSeam(bed, B0 - 4, P, 2), { tone: "faint" }) });
  const jaw = (name, plan, plate) => {
    box(name, vx(plan), B0, TOP - 12, { tone: "mid" }, { ...XG, bevel: 0.4 });
    const pl = vx(plate);
    const screws = [-24, 24].map((y) => at([pl.x + pl.w, y, TOP - 17.5]));
    box(name + "-plate", pl, B0 + 1, TOP - 12, { tone: "hi", crease: "lo" }, { ...XG, extra: name.endsWith("move") ? Dt(screws, { size: 0.45, tone: "mid" }) : "" });
  };
  jaw("x.jaw-fixed", { x: BLK.x0 - 18, y: -45, w: 16, d: 90, r: 1 }, { x: BLK.x0 - 2, y: -43, w: 2, d: 86, r: 0.3 });
  jaw("x.jaw-move", { x: BLK.x1 + 2, y: -45, w: 16, d: 90, r: 1 }, { x: BLK.x1, y: -43, w: 2, d: 86, r: 0.3 });
  box("x.vice-nut", vx({ x: 59, y: -16, w: 20, d: 32, r: 1 }), B0, B0 + 12, { tone: "mid" }, { ...XG, bevel: 0.4 });
  const Fs = frameX([53 + XHOME, 0, B0 + 6]);
  discAt("x.vice-screw", Fs, 0, 6, 4, { tone: "hi", crease: "none" }, XG);
  const Fc = frameX([79 + XHOME, 0, B0 + 6]);
  discAt("x.crank-hub", Fc, 0, 5, 7, { tone: "mid" }, { ...XG, steps: 6 });
  box("x.crank-arm", vx({ x: 84, y: -3.5, w: 4, d: 7, r: 0.8 }), B0 + 2, B0 + 26, { tone: "mid", crease: "lo" }, XG);
  const Fk = frameX([88 + XHOME, 0, B0 + 22]);
  discAt("x.crank-knob", Fk, 0, 11, 3.2, { tone: "hi", crease: "lo" }, { ...XG, extra: Dt([at(G.pointOf(Fk, 11, 0, 0))], { size: 0.45, tone: "mid" }) });
}
// the plate, rebuilt live with the slot; recorded as the plain plate
const plateItem = (() => {
  solids++;
  return put("x.plate", [XHOME, 0, (B0 + TOP) / 2], plateSvg(k, P, null, SHADE_Y, SHADE_X), [R.solid(A.box([BLK.x0 + XHOME, BLK.y0, B0], [BLK.x1 + XHOME, BLK.y1, TOP], { name: "x.plate" }))], { piece: "x", attrs: ' data-g="x" data-plate=""' });
})();

// ---------------------------------------------------------------- column, Z ways, magazine
{
  const inner = L(k.sideSeam(COL, BASE_TOP + 14, P, 2) + k.sideSeam(COL, COL_TOP - 10, P, 2), { tone: "faint" });
  box("col", COL, BASE_TOP, COL_TOP, { tone: "mid" }, { bevel: 0.8, inner });
  const cap = k.insetPlan(COL, 3);
  box("col.cap", cap, COL_TOP, COL_TOP + 4, { tone: "mid", crease: "lo" }, { bevel: 0.4, extra: Dt(k.corners(cap, 5).map(([x, y]) => at([x, y, COL_TOP + 4])), { size: 0.42 }) });
  for (const x of [-56, 44]) box("col.zway", { x, y: -125, w: 12, d: 5, r: 0.5 }, 130, COL_TOP - 4, { tone: "mid", crease: "lo" });
  box("mag.bracket", { x: 70, y: -176, w: 8, d: 32, r: 0.6 }, MAG.z - 16, MAG.z + 16, { tone: "mid" }, { bevel: 0.3 });
  const F = frameX([MAG.x, MAG.y, MAG.z]);
  const pockets = Array.from({ length: 16 }, (_, i) => G.frameOf(G.pointOf(F, 14, 46, (i / 16) * Math.PI * 2 + 0.1), X, Y, Zv));
  const face = [
    L(pockets.map((Fp) => G.circleOf(Fp, 0, 4.6, P, 16)).join(""), { tone: "lo" }),
    Dt(pockets.map((Fp) => at(Fp.o)), { size: 0.5, tone: "mid" }),
    L(G.circleOf(F, 14, 34, P, 64), { tone: "faint" }),
  ].join("");
  discAt("mag.disc", F, 0, 14, MAG.r, { tone: "mid" }, { extra: face, inner: L(G.arcOf(F, 7, MAG.r, P), { tone: "faint" }) });
  discAt("mag.hub", F, 14, 20, 15, { tone: "mid" }, { extra: Dt([at(G.pointOf(F, 20, 0, 0))], { size: 0.55, tone: "hi" }) });
}

// ---------------------------------------------------------------- spindle head (Z)
const ZG = { g: "z" };
{
  const inner = L(k.sideSeam(HEAD, HT0 - 10, P, 2), { tone: "faint" });
  const fy = HEAD.y + HEAD.d;
  const slots = [0, 1, 2].map((i) => flatRect(-30, HB0 + 24 + i * 6, 10, HB0 + 26.4 + i * 6, 1.2, 3)).join("");
  const extra = `<g transform="${planeOf(fy)}">${L(slots, { tone: "lo" })}</g>` + Dt([[-40, fy, HB0 + 6], [40, fy, HB0 + 6], [-40, fy, HT0 - 6], [40, fy, HT0 - 6]].map(at), { size: 0.42 });
  box("z.head", HEAD, HB0, HT0, { tone: "mid" }, { ...ZG, bevel: 0.8, inner, extra });
  box("z.slide", { x: -60, y: -120, w: 120, d: 8, r: 1 }, HB0 - 6, HT0 + 6, { tone: "mid", crease: "lo" }, { ...ZG, bevel: 0.4 });
  const Fm = G.frameOf([0, -10, HT0], Zv, X, Y);
  const fins = G.ribsOf(Fm, 2, 22, 22, 24, P, { fade: [0.04, 0.42], seams: true });
  turned("z.motor", Fm, [[0, 22], [24, 22]], { tone: "mid", crease: "lo" }, { ...ZG, inner: k.fadedSvg(fins, { tone: "lo" }) });
  discAt("z.motor-cap", Fm, 24, 28, 17, { tone: "mid" }, { ...ZG, extra: Dt([at([0, -10, HT0 + 28])], { size: 0.5, tone: "hi" }) });
  box("z.tbox", { x: 22, y: -20, w: 9, d: 20, r: 1 }, HT0 + 6, HT0 + 18, { tone: "mid" }, { ...ZG, bevel: 0.3 });
  const Fz = frameDown([0, SPY, ZS0]);
  discAt("z.quill", Fz, -18, -14, 34, { tone: "mid" }, ZG);
  discAt("z.nose", Fz, -14, 0, 28, { tone: "mid" }, { ...ZG, extra: Dt(G.dotsOf(Fz, 0, 24, 8, P, { fade: [0.04, 0.4], all: false }), { size: 0.4 }) });
  discAt("z.flange", Fz, 0, 6, 23, { tone: "mid", crease: "lo" }, ZG);
  discAt("z.flange2", Fz, 9, 14, 23, { tone: "mid", crease: "lo" }, ZG);
  discAt("z.groove", Fz, 6, 9, 19, { tone: "lo", crease: "none" }, ZG);
  // coolant nozzle on a short arm beside the nose
  box("z.cool-arm", { x: -42, y: SPY - 3, w: 14.1, d: 6, r: 0.8 }, ZS0 + 2, ZS0 + 8, { tone: "mid", crease: "lo" }, ZG);
  const Fn = G.frameOf([-37, SPY, ZS0 + 2], [0, 0, -1], X, Y);
  turned("z.cool-nozzle", Fn, [[0, 2.2], [16, 1.6], [18, 1.1]], { tone: "mid", crease: "lo" }, { ...ZG, attrs: ' data-g="z" data-cool=""' });
}
const toolItem = put("z.endmill", [0, SPY, ZS0 - TOOL_S - END_LEN / 2], endMillSvg(k, G, P, 2 * RT, 4, 0, SPY), [R.solid(A.disc(frameDown([0, SPY, ZS0]), TOOL_S, TOOL_S + END_LEN, RT, { name: "z.endmill" }))], { attrs: ' data-g="z" data-tool=""' });
solids++;
{
  const Fz = frameDown([0, SPY, ZS0]);
  turned("z.collet", Fz, [[14, 16], [26, 13.5], [30, 13.5]], { tone: "mid", crease: "lo" }, ZG);
  discAt("z.nut", Fz, 30, TOOL_S, 15, { tone: "hi", crease: "lo" }, { ...ZG, steps: 8 });
}

// ---------------------------------------------------------------- the control console
const CON_LINES = 10;
const LINE_DZ = 2.5;
{
  const foot = { x: CON_POST[0] - 20, y: CON_POST[1] - 16, w: 40, d: 34, r: 1.5 };
  box("stand.con-foot", foot, FLOOR, FLOOR + 5, { tone: "lo" }, { bevel: 0.4, extra: Dt(k.corners(foot, 4).map(([x, y]) => at([x, y, FLOOR + 5])), { size: 0.42 }) });
  post("con.post", CON_POST[0], CON_POST[1], 7, FLOOR + 5, CON_Z[0] - 6, { tone: "mid" }, { steps: 24, inner: L(k.sideArc(CON_POST[0], CON_POST[1], 7, 40, P, 16), { tone: "faint" }) });
  post("con.collar", CON_POST[0], CON_POST[1], 10, CON_Z[0] - 6, CON_Z[0], { tone: "mid" }, { steps: 28, bevel: 0.3 });
  const fy = CON.y + CON.d;
  const lens = PROG_A.map(([n, w]) => (n + " " + w).length);
  const screen = [
    `<g data-prog="">`,
    ...lens.map((len, i) => `<path class="iso-line" data-tone="lo" data-free="" data-pl="${i}" d="M${WIN.x0 + 5} ${-(WIN.z1 - 3.2 - i * LINE_DZ)}h${(len * 1.3).toFixed(1)}"/>`),
    `<path class="gc-bar" data-bar="" d="M${WIN.x0 + 2.6} ${-(WIN.z1 - 3.2) - 0.9}v1.8"/>`,
    `</g>`,
  ].join("");
  const faceBits = [recess(WIN, fy, screen), Dt([[CON.x + 2, fy, CON_Z[0] + 2], [CON.x + CON.w - 2, fy, CON_Z[0] + 2], [CON.x + 2, fy, CON_Z[1] - 2], [CON.x + CON.w - 2, fy, CON_Z[1] - 2]].map(at), { size: 0.42 })].join("");
  box("con.box", CON, CON_Z[0], CON_Z[1], { tone: "mid" }, { bevel: 0.6, extra: faceBits });
  box("con.hood", { x: CON.x - 1.5, y: CON.y - 1, w: CON.w + 3, d: CON.d + 3, r: 1 }, CON_Z[1], CON_Z[1] + 2, { tone: "mid" }, { bevel: 0.3 });
  const Fe = frameY([159, fy, 138]);
  discAt("con.estop", Fe, 0, 1.6, 6, { tone: "mid" }, {});
  discAt("con.mushroom", Fe, 1.6, 4.6, 4.6, { tone: "hi", crease: "lo" }, { extra: L(G.circleOf(Fe, 4.6, 2.2, P, 20), { tone: "faint" }) });
  const Fs = frameY([171, fy, 138]);
  discAt("con.start", Fs, 0, 1.4, 3.4, { tone: "mid" }, {});
  discAt("con.start-cap", Fs, 1.4, 2.6, 2.4, { tone: "hi", crease: "lo" }, { attrs: ' data-lamp=""' });
  const Fo = frameY([182, fy, 138]);
  discAt("con.override", Fo, 0, 4, 5.2, { tone: "mid" }, { extra: L(G.ribsOf(Fo, 0.4, 3.6, 5.2, 18, P, { seams: false }), { tone: "lo" }) });
  {
    // the rapid-override knob's pointer, turned live (25 % or 100 %)
    const tip = (a) => at(G.pointOf(Fo, 4, 3.6, a));
    const d100 = tip(-Math.PI / 2), d25 = tip(-Math.PI / 2 + 1.9);
    R.items[R.items.length - 1].svg += `<g data-knob=""><circle class="gc-knob" data-k="100" cx="${d100[0].toFixed(2)}" cy="${d100[1].toFixed(2)}" r=".7"/><circle class="gc-knob" data-k="25" cx="${d25[0].toFixed(2)}" cy="${d25[1].toFixed(2)}" r=".7" style="display:none"/></g>`;
  }
  const Fw = frameY([194, fy, 138]);
  discAt("con.mpg", Fw, 0, 2.4, 5.6, { tone: "mid" }, { extra: L(G.circleOf(Fw, 2.4, 3.4, P, 24), { tone: "faint" }) + Dt([at(G.pointOf(Fw, 2.4, 4.4, 0.6))], { size: 0.55, tone: "hi" }) });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, { states: A.uniformStates(12) });
R.items.sort((a, b) => a.key - b.key);
const plateSlot = R.items.indexOf(plateItem);
const groups = R.items.map((item, index) => {
  const g = `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`;
  if (index === plateSlot) return g + `<g class="it" data-g="x" data-trace=""></g>`;
  return g;
});
const body = [...halo, ...groups, `<g data-chips=""></g>`, `<g data-mark=""></g>`];

const LABEL_NL =
  "Een verticaal bewerkingscentrum: een gegoten bed op stelvoeten, een zadel dat in Y beweegt, een tafel met T-sleuven die in X beweegt, een bankschroef met daarin een stalen plaat van 70 bij 100 bij 20 mm, een kolom met een spilkop die in Z beweegt, een gereedschapsmagazijn en een bedieningskast met een scherm. Op de plaat is het werkstuknulpunt G54 gemarkeerd. In de spil zit een vingerfrees van 10 mm. Naast de machine staat het programma van tien regels; de actieve regel licht op en de frees tekent zijn baan: ijlgangen gestippeld, sneden doorgetrokken.";
const LABEL_EN =
  "A vertical machining centre: a cast base on levelling feet, a saddle moving in Y, a T-slotted table moving in X, a vice holding a steel plate of 70 by 100 by 20 mm, a column with a spindle head moving in Z, a tool magazine and a control console with a screen. The work offset G54 is marked on the plate. The spindle holds a 10 mm end mill. Beside the machine stands the ten-line program; the active line lights up and the tool traces its path: rapids dashed, cuts solid.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// Levels 2 to 4 look closer: the same drawing, cropped to the work zone (the
// plate over all its program positions, the vice, and the spindle nose at Z50).
const WORK = (() => {
  const pts = [];
  for (const [gx, gy] of [[-10, -35], [25, -35], [-10, 63], [25, 63]]) {
    const tx = -(gx - PX), ty = SPY - (PY - gy);
    for (const [x, y] of [[BLK.x0 - 18, BLK.y0], [BLK.x1 + 18, BLK.y0], [BLK.x0 - 18, BLK.y1], [BLK.x1 + 18, BLK.y1]]) for (const z of [B0 - 4, TOP]) pts.push(at([x + tx, y + ty, z]));
  }
  for (const z of [TOP - 5, ZS0 + ZUP + 6]) for (const [x, y] of [[-28, SPY - 28], [28, SPY + 28], [-28, SPY + 28], [28, SPY - 28]]) pts.push(at([x, y, z]));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.max(0, Math.min(...xs) - 4), y0 = Math.max(0, Math.min(...ys) - 4);
  return [x0, y0, Math.min(WIDTH, Math.max(...xs) + 4) - x0, Math.min(HEIGHT, Math.max(...ys) + 4) - y0].map((v) => +v.toFixed(1));
})();

// ---------------------------------------------------------------- parts to name on tap (level 1)
const PARTS = [
  { key: "spindle", g: "z", at: [0, SPY, ZS0 - 7] },
  { key: "tool", g: "z", at: [0, SPY, ZS0 - TOOL_S - 18] },
  { key: "zero", g: "x", at: [-PX, PY, TOP] },
  { key: "plate", g: "x", at: [BLK.x1 - 6, BLK.y1, TOP - 8] },
  { key: "vice", g: "x", at: [BLK.x0 - 10, 40, TOP - 14] },
  { key: "table", g: "x", at: [-95, 62, TABLE_Z[1]] },
  { key: "saddle", g: "y", at: [60, 57, BASE_TOP + 14] },
  { key: "head", g: "z", at: [0, HEAD.y + HEAD.d, HB0 + 30] },
  { key: "column", g: "s", at: [70, -125, 160] },
  { key: "magazine", g: "s", at: [MAG.x + 14, MAG.y, MAG.z] },
  { key: "control", g: "s", at: [(WIN.x0 + WIN.x1) / 2, CON.y + CON.d, (WIN.z0 + WIN.z1) / 2] },
  { key: "base", g: "s", at: [-40, BASE.y + BASE.d, 12] },
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
  --gc-hair:rgba(240,233,218,.12);--gc-accent:#5C9FAE;--gc-glass:#0A1E23;--gc-cut:#1B4049;--gc-hl:rgba(92,159,174,.16);
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --gc-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --gc-hair:rgba(11,41,27,.14);--gc-accent:#276F81;--gc-glass:#E2ECEA;--gc-cut:#CCDCDB;--gc-hl:rgba(39,111,129,.12);
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--gc-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--bottom:126px;height:100%;min-height:300px;padding:26px 6px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--gc-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--gc-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:62px!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:80px!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.gc-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-height:1.45em}
.gc-acc{color:var(--gc-accent);font-weight:600}
.gc-strong{color:var(--anatomy-strong);font-weight:600}
.gc-mute{color:var(--anatomy-muted)}
.gc-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;gap:6px;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;border-radius:8px}
.gc-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.gc-art{flex:1 1 auto;min-width:0;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer}
.gc-art .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
html:not([data-level="1"]) .gc-art .iso-svg{-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 7%,#000 88%,transparent 100%),linear-gradient(to right,transparent 0,#000 7%,#000 93%,transparent 100%);-webkit-mask-composite:source-in;mask-image:linear-gradient(to bottom,transparent 0,#000 7%,#000 88%,transparent 100%),linear-gradient(to right,transparent 0,#000 7%,#000 93%,transparent 100%);mask-composite:intersect}
.gc-screen{flex:0 0 auto;width:clamp(160px,40%,250px);max-height:100%;overflow:hidden;align-self:center;background:var(--gc-glass);border-radius:8px;box-shadow:inset 0 0 0 1px var(--gc-hair);padding:5px 3px 5px;font:clamp(9.5px,2.55vw,12.5px)/1.42 var(--anatomy-mono);color:var(--anatomy-text)}
.gc-head{display:flex;justify-content:space-between;padding:0 5px 3px;margin-bottom:3px;color:var(--anatomy-muted);font-size:.86em;box-shadow:inset 0 -1px 0 var(--gc-hair)}
.gc-prog{margin:0;padding:0;list-style:none}
.gc-pl{display:block;padding:0 5px;border-radius:3px;white-space:pre;color:var(--anatomy-muted)}
.gc-pl b{font-weight:400;opacity:.75}
.gc-pl[data-done]{color:var(--anatomy-text)}
.gc-pl[data-on]{color:var(--anatomy-strong);background:var(--gc-hl);box-shadow:inset 2px 0 0 var(--gc-accent)}
.gc-pl[data-new] span{color:var(--gc-accent)}
.gc-modal{display:flex;gap:.7em;flex-wrap:wrap;padding:3px 5px 0;margin-top:3px;box-shadow:inset 0 1px 0 var(--gc-hair);font-size:.92em}
.gc-modal span{white-space:nowrap}
.gc-modal [data-off]{color:var(--anatomy-muted)}
.gc-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.gc-row{display:flex;gap:4px;height:44px}
.gc-row[hidden]{display:none}
.gc-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 6px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--gc-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--gc-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gc-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.gc-btn[aria-checked="true"],.gc-btn[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--gc-accent);color:var(--gc-accent);font-weight:600}
.gc-btn[data-icon]{flex:0 0 44px;font-size:16px;font-weight:400}
.gc-btn:disabled{opacity:.4;cursor:default}
.gc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.gc-glass{fill:var(--gc-glass);stroke:none}
.gc-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.gc-bar{stroke:var(--gc-accent);stroke-width:1.2px;stroke-linecap:round}
.gc-knob{fill:var(--anatomy-hi);stroke:none}
.iso .gc-cut{fill:var(--gc-cut);stroke:none}
.gc-rapid{fill:none;stroke:var(--anatomy-hi);stroke-width:.8px;stroke-dasharray:2.4 2;stroke-linecap:butt;stroke-linejoin:round}
.gc-feed{fill:none;stroke:var(--gc-accent);stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round}
.gc-end{fill:var(--anatomy-hi);stroke:none}
.gc-endf{fill:var(--gc-accent);stroke:none}
.gc-chip-fly{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.5px;stroke-linejoin:round}
.gc-crash{fill:var(--gc-hl);stroke:var(--gc-accent);stroke-width:1.4px;stroke-linejoin:round}
.gc-crash-core{fill:var(--anatomy-strong);stroke:none}
.gc-mark{fill:none;stroke:var(--gc-accent);stroke-width:1.4px}
.gc-mark-dot{fill:var(--gc-accent);stroke:none}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill,[data-cool] .iso-top,[data-cool] .iso-shade,[data-cool] .iso-fill{transition:fill .4s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill,[data-cool][data-on] .iso-top,[data-cool][data-on] .iso-shade,[data-cool][data-on] .iso-fill{fill:var(--gc-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill,[data-cool] .iso-top,[data-cool] .iso-shade,[data-cool] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const latheSource = readFileSync(join(SKILL, "kit/lathe.mjs"), "utf8").replace(/^import .*$/m, "").replace(/^export /gm, "");
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, solidOf, arcOf, dot3, add3, mul3 };})();\n`;

const fmt1 = (v, dec) => v.toFixed(1).replace(".", dec);
const MEAN = {
  nl: {
    N10: "absoluut (G90), vanaf werkstuknulpunt G54",
    N20: "gereedschap 3 erin (M06): vingerfrees Ø10",
    N30: "spil 3.200 omw/min, met de klok mee (M03)",
    N40: "ijlgang naar Z25, lengtecorrectie H3, koeling aan",
    N50: "G00 is modaal: ijlgang boven het startpunt",
    N60: `G01 op voeding F150 naar 3 mm diep: 28 mm = ${fmt1(blk(BA, "N60").time, ",")} s`,
    N70: `nog G01: 50 mm op F640 = 0,05 × 4 × 3.200: ${fmt1(blk(BA, "N70").time, ",")} s`,
    N80: `G02 kwart cirkel R20, met de klok mee: ${fmt1(blk(BA, "N80").time, ",")} s`,
    N90: "ijlgang omhoog naar Z25, koeling uit (M09)",
    N100: "einde programma (M30)",
    B60: "ijlgang naar Z2, 2 mm boven het werkstuk",
    B65: `G01 op F150, de laatste 5 mm naar Z-3: ${fmt1(blk(BB, "N65").time, ",")} s`,
  },
  en: {
    N10: "absolute (G90), from work offset G54",
    N20: "tool 3 in (M06): 10 mm end mill",
    N30: "spindle 3,200 rpm, clockwise (M03)",
    N40: "rapid to Z25, length offset H3, coolant on",
    N50: "G00 is modal: rapid above the start point",
    N60: `G01 at feed F150 to 3 mm deep: 28 mm = ${fmt1(blk(BA, "N60").time, ".")} s`,
    N70: `still G01: 50 mm at F640 = 0.05 × 4 × 3,200: ${fmt1(blk(BA, "N70").time, ".")} s`,
    N80: `G02 quarter circle R20, clockwise: ${fmt1(blk(BA, "N80").time, ".")} s`,
    N90: "rapid up to Z25, coolant off (M09)",
    N100: "end of program (M30)",
    B60: "rapid to Z2, 2 mm above the work",
    B65: `G01 at F150, the last 5 mm to Z-3: ${fmt1(blk(BB, "N65").time, ".")} s`,
  },
};
const CYCLE = { a: cycleOf(BA), b: cycleOf(BB), n60: blk(BA, "N60").time, b65: blk(BB, "N65").time + blk(BB, "N60").time };

const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const TS = ${TS}, RT = ${RT}, ZERR = ${ZERR}, RAPID = ${RAPID};
const BLK = ${JSON.stringify(BLK)}, B0 = ${B0}, TOP = ${TOP}, SPY = ${SPY}, ZS0 = ${ZS0}, XHOME = ${XHOME}, PX = ${PX}, PY = ${PY};
const TOOL_S = ${TOOL_S}, END_LEN = ${END_LEN};
const SHADE_Y = ${SHADE_Y}, SHADE_X = ${SHADE_X};
const START = ${JSON.stringify(START)}, PLATE = ${JSON.stringify(PLATE)};
const PROG = { a: ${JSON.stringify(PROG_A)}, b: ${JSON.stringify(PROG_B)} };
const PARTS = ${JSON.stringify(PARTS)};
const MEAN = ${JSON.stringify(MEAN)};
const CYCLE = ${JSON.stringify(CYCLE)};
const CON_LINES = ${CON_LINES}, LINE_DZ = ${LINE_DZ}, WIN = ${JSON.stringify(WIN)};
${compile.toString()}
${posAt.toString()}
${slotOutline.toString()}
${cutOf.toString()}
${plateSvg.toString()}
${endMillSvg.toString()}
const K = { solidSvg, lineSvg, dotsSvg, iso, pathOf };

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
if (LVL > 1) document.querySelector(".gc-art svg").setAttribute("viewBox", ${JSON.stringify(WORK.join(" "))});
const M = EN ? MEAN.en : MEAN.nl;
const T = EN
  ? { dec: ".", grp: ",", rapid: "rapid (G00)", feed: "straight cut (G01)", arc: "arc (G02)", none: "no motion", togo: "to go", tapPart: "tap a part to name it", off: "off",
      g54ok: "G54 Z: as measured", g54bad: "G54 Z: typed 30 mm too low", safeOn: "single block · rapid 25 % · first part measured", safeOff: "auto · rapid 100 % · no first-part check",
      ctrl: "control", real: "real", under: "under the top", above: "above the top",
      crash: "CRASH on N50: rapid at full speed into the plate", halt: "N40 done: tool 5 mm under the top → stop, check G54", ok: "First part measured: slot 3.0 mm deep → release", run: "running", wait: "single block: press cycle start", end: "end of program",
      pathA: "A", pathB: "B", cycle: "cycle", per: "× 2,000 parts", hours: "≈ 5 h", clock: "clock",
      parts: { spindle: ["Spindle", "turns the tool; up and down in Z"], tool: ["End mill Ø10", "tool 3, called with T3 M06"], zero: ["Work offset G54", "the program's X0 Y0 Z0 on the plate"], plate: ["Workpiece", "steel plate, the slot is 3 mm deep"], vice: ["Vice", "clamps the plate on the table"], table: ["Table", "moves left-right: X"], saddle: ["Saddle", "moves front-back: Y"], head: ["Spindle head", "slides along the column: Z"], column: ["Column", "carries the head, stiff and heavy"], magazine: ["Magazine", "M06 takes tool 3 from here"], control: ["CNC control", "reads the program line by line"], base: ["Base", "cast iron on levelling feet"] } }
  : { dec: ",", grp: ".", rapid: "ijlgang (G00)", feed: "rechte snede (G01)", arc: "cirkelboog (G02)", none: "geen beweging", togo: "restweg", tapPart: "tik een onderdeel voor de naam", off: "uit",
      g54ok: "G54 Z: zoals gemeten", g54bad: "G54 Z: 30 mm te laag ingetypt", safeOn: "enkelregel · ijlgang 25 % · eerste stuk meten", safeOff: "automaat · ijlgang 100 % · geen controle",
      ctrl: "besturing", real: "echt", under: "onder de bovenkant", above: "boven de bovenkant",
      crash: "BOTSING op N50: ijlgang op volle snelheid in de plaat", halt: "N40 klaar: frees 5 mm onder de bovenkant → stop, G54 nakijken", ok: "Eerste stuk gemeten: sleuf 3,0 mm diep → vrijgeven", run: "loopt", wait: "enkelregel: druk op cyclusstart", end: "einde programma",
      pathA: "A", pathB: "B", cycle: "cyclus", per: "× 2.000 stuks", hours: "≈ 5 uur", clock: "klok",
      parts: { spindle: ["Spil", "draait het gereedschap; op en neer in Z"], tool: ["Vingerfrees Ø10", "gereedschap 3, aangeroepen met T3 M06"], zero: ["Werkstuknulpunt G54", "X0 Y0 Z0 van het programma, op de plaat"], plate: ["Werkstuk", "stalen plaat, de sleuf wordt 3 mm diep"], vice: ["Bankschroef", "klemt de plaat op de tafel"], table: ["Tafel", "beweegt links-rechts: X"], saddle: ["Zadel", "beweegt voor-achter: Y"], head: ["Spilkop", "schuift langs de kolom: Z"], column: ["Kolom", "draagt de spilkop, stijf en zwaar"], magazine: ["Magazijn", "M06 pakt hier gereedschap 3"], control: ["CNC-besturing", "leest het programma regel voor regel"], base: ["Bed", "gietijzer op stelvoeten"] } };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec).replace(/^-/, "−");
const grouped = (value) => String(Math.round(value)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);

const stage = document.querySelector(".gc-stage");
const art = stage.querySelector(".gc-art");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  plate: q("[data-plate]"), trace: q("[data-trace]"), tool: q("[data-tool]"), chips: q("[data-chips]"), mark: q("[data-mark]"),
  lamp: q("[data-lamp]"), cool: q("[data-cool]"), bar: q("[data-bar]"), knob: [...svg.querySelectorAll("[data-k]")],
  gx: [...svg.querySelectorAll('[data-g="x"]')], gy: [...svg.querySelectorAll('[data-g="y"]')], gz: [...svg.querySelectorAll('[data-g="z"]')],
};
const lines = [...document.querySelectorAll("[data-readout] .gc-line")];
const listing = document.querySelector(".gc-prog");
const modal = document.querySelector(".gc-modal");
const announcer = document.querySelector(".gc-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ------------------------------------------------ state
// path: "a" (the lesson's program) or "b" (level 4, CAM: rapid to Z2 first)
const st = { path: "a", wrong: LVL === 3, safe: false, single: LVL === 2, playing: true };
let blocks = [];
const run = { i: 0, u: 0, state: "run", wait: 0, crash: null };
function rebuild() {
  blocks = compile(PROG[st.path], START, st.wrong ? ZERR : 0);
  buildListing();
}
const zerr = () => (st.wrong ? ZERR : 0);
const override = () => (st.safe ? 0.25 : 1);
const singleNow = () => st.single || st.safe;
function dispDur(b) {
  if (b.kind === "none") return 0.5;
  if (b.kind === "rapid") return Math.max(0.55, b.time / TS) / override();
  return b.time / TS;
}
function toolAt() { // the tool tip in program coordinates (what the control shows)
  const b = blocks[run.i];
  return run.state === "run" || run.state === "crash" ? posAt(b, run.u) : b.to.slice();
}
function startPos() { return [START[0], START[1], START[2] - zerr()]; }
function clockNow() {
  let t = 0;
  for (let j = 0; j < run.i; j++) t += blocks[j].time;
  return t + blocks[run.i].time * (run.state === "run" || run.state === "crash" ? run.u : 1);
}
function contact(p) { // does the tool, tip below the top, touch the plate?
  if (p[2] + zerr() >= 0) return false;
  const cx = clamp(p[0], PLATE.x0, PLATE.x1), cy = clamp(p[1], PLATE.y0, PLATE.y1);
  return Math.hypot(p[0] - cx, p[1] - cy) < RT;
}
function reset() {
  run.i = 0; run.u = 0; run.state = "run"; run.wait = 0; run.crash = null;
  chips.length = 0;
}
function finish() {
  const b = blocks[run.i];
  run.u = 1;
  if (run.i === blocks.length - 1) { run.state = "end"; run.wait = 2.6; announce(); return; }
  if (st.safe && b.kind === "rapid" && b.to[2] + zerr() < 0) { run.state = "halt"; run.wait = 3.6; announce(); return; }
  if (singleNow()) { run.state = "wait"; run.wait = LVL === 3 ? 0.7 : 1.1; }
  else { run.state = "gap"; run.wait = 0.12; }
}
function startNext() {
  if (run.i >= blocks.length - 1) return;
  run.i++; run.u = 0; run.state = "run";
}
function stepRun(dt) {
  if (run.state === "run") {
    const b = blocks[run.i];
    const u1 = Math.min(1, run.u + dt / dispDur(b));
    if (b.kind === "rapid" && (b.to[0] !== b.from[0] || b.to[1] !== b.from[1] || b.to[2] < b.from[2])) {
      for (let s = 1; s <= 8; s++) {
        const u = run.u + ((u1 - run.u) * s) / 8;
        if (contact(posAt(b, u))) { run.u = u; run.state = "crash"; run.crash = posAt(b, u); run.wait = 3.6; chips.length = 0; announce(); return; }
      }
    }
    run.u = u1;
    if (run.u >= 1) finish();
  } else if (run.state === "gap") {
    run.wait -= dt;
    if (run.wait <= 0) startNext();
  } else if (run.state === "wait") {
    if (touring) { run.wait -= dt; if (run.wait <= 0) startNext(); }
  } else if (touring) {
    run.wait -= dt;
    if (run.wait <= 0) tourNext();
  } else if (run.state === "end" && LVL === 1 && st.playing) {
    run.wait -= dt;
    if (run.wait <= 0) reset();
  }
}

// ------------------------------------------------ drawing
function place(p) {
  // the table carries the plate under the fixed spindle; the head moves in Z
  const wx = p[0] - PX, wy = PY - p[1];
  const tx = -wx, ty = SPY - wy, tz = p[2] + zerr() - 2;
  const ax = translateAlong(P, [tx - XHOME, ty, 0]);
  const ay = translateAlong(P, [0, ty, 0]);
  const az = translateAlong(P, [0, 0, tz]);
  el.gx.forEach((n) => n.setAttribute("transform", ax));
  el.gy.forEach((n) => n.setAttribute("transform", ay));
  el.gz.forEach((n) => n.setAttribute("transform", az));
  return { tx, ty, tz };
}
let lastPlate = "";
function drawPlate() {
  const c = cutOf(blocks, run.i, run.state === "run" || run.state === "crash" ? run.u : 1, zerr());
  const key = c ? c.pts.length + "|" + c.depth.toFixed(2) + "|" + c.pts[c.pts.length - 1].map((v) => v.toFixed(1)).join(",") : "none";
  if (key === lastPlate) return;
  lastPlate = key;
  el.plate.innerHTML = plateSvg(K, P, c, SHADE_Y, SHADE_X);
}
function W(p) { const z = zerr(); return iso([p[0] - PX + XHOME, PY - p[1], TOP + p[2] + z], P); }
function drawTrace() {
  const parts = { rapid: [], feed: [] };
  const ends = [[], []];
  let prev = W(startPos());
  ends[0].push(prev);
  const upto = run.state === "run" || run.state === "crash" ? run.i : run.i + 1;
  for (let j = 0; j < upto && j < blocks.length; j++) {
    const b = blocks[j];
    if (b.kind === "none") continue;
    const uu = j < run.i || !(run.state === "run" || run.state === "crash") ? 1 : run.u;
    if (j === run.i && uu <= 0) continue;
    const n = b.kind === "arc" ? Math.max(2, Math.ceil(24 * uu)) : 1;
    const pts = [];
    for (let s = 0; s <= n; s++) pts.push(W(posAt(b, (uu * s) / n)));
    (b.kind === "rapid" ? parts.rapid : parts.feed).push(pathOf(pts));
    ends[b.kind === "rapid" ? 0 : 1].push(pts[pts.length - 1]);
  }
  // the current point
  const f = (pts) => pts.map(([x, y]) => '<circle cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r=".75"/>').join("");
  el.trace.innerHTML = '<path class="gc-rapid" d="' + parts.rapid.join("") + '"/><path class="gc-feed" d="' + parts.feed.join("") + '"/><g class="gc-end">' + f(ends[0]) + '</g><g class="gc-endf">' + f(ends[1]) + "</g>";
}
let lastTool = "";
function drawTool() {
  const key = phase.toFixed(3);
  if (key === lastTool) return;
  lastTool = key;
  el.tool.innerHTML = endMillSvg(K, G, P, 2 * RT, 4, phase, SPY);
}
function chipPath(cx, cy, size, turn) {
  const out = [], inner = [], n = 12;
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = turn + t * Math.PI * 2 * 1.1, r = size * (0.4 + 0.6 * t), w = size * (0.14 + 0.2 * t);
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.6]);
    inner.push([cx + Math.cos(a) * (r - w), cy + Math.sin(a) * (r - w) * 0.6]);
  }
  return "M" + out.concat(inner.reverse()).map(([x, y]) => x.toFixed(1) + " " + y.toFixed(1)).join("L") + "Z";
}
const chips = [];
function drawChips() {
  let html = "";
  for (const c of chips) {
    const [sx, sy] = iso(c.p, P);
    html += '<path class="gc-chip-fly" style="opacity:' + c.a.toFixed(2) + '" d="' + chipPath(sx, sy, c.size * KS, c.turn) + '"/>';
  }
  el.chips.innerHTML = html;
}
let marked = -1;
function drawMark(off) {
  let html = "";
  if (run.state === "crash" && run.crash) {
    // where the tool's side meets the plate: a burst on the plate face
    const p = run.crash;
    const cx = clamp(p[0], PLATE.x0, PLATE.x1), cy = clamp(p[1], PLATE.y0, PLATE.y1);
    const w = [cx - PX + off.tx, PY - cy + off.ty, TOP + (p[2] + zerr()) / 2];
    const [x, y] = iso(w, P);
    const pts = [];
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 + 0.2, r = i % 2 ? 4.2 : 10 - (i % 4) * 0.8; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r * 0.8]); }
    html += '<path class="gc-crash" d="' + pathOf(pts, true) + '"/><circle class="gc-crash-core" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.8"/>';
  }
  if (LVL === 1 && marked >= 0) {
    const p = PARTS[marked];
    const o = p.g === "x" ? [off.tx, off.ty, 0] : p.g === "y" ? [0, off.ty, 0] : p.g === "z" ? [0, 0, off.tz] : [0, 0, 0];
    const [x, y] = iso([p.at[0] + o[0], p.at[1] + o[1], p.at[2] + o[2]], P);
    html += '<circle class="gc-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="gc-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  }
  el.mark.innerHTML = html;
}

// ------------------------------------------------ the control's screen
function buildListing() {
  const changed = (n) => st.path === "b" && (n === "N60" || n === "N65");
  listing.innerHTML = blocks.map((b, i) => '<li class="gc-pl" data-i="' + i + '"' + (changed(b.n) ? " data-new" : "") + "><b>" + b.n.padEnd(5, " ") + "</b><span>" + b.w + "</span></li>").join("");
}
let lastList = "";
function drawListing() {
  const key = st.path + "|" + run.i + "|" + run.state + (LVL === 4 ? "|" + clockNow().toFixed(1) : "");
  if (key === lastList) return;
  lastList = key;
  [...listing.children].forEach((li, i) => {
    const on = i === run.i, done = i < run.i || (i === run.i && run.state !== "run");
    if (on) li.setAttribute("data-on", ""); else li.removeAttribute("data-on");
    if (done) li.setAttribute("data-done", ""); else li.removeAttribute("data-done");
  });
  const b = blocks[run.i];
  const live = run.state === "run" || run.state === "wait" || run.state === "gap";
  const spin = b.spin && live;
  modal.innerHTML = '<span' + (b.F ? "" : " data-off") + ">F " + (b.F || 0) + "</span><span" + (spin ? "" : " data-off") + ">S " + (spin ? b.S : 0) + "</span><span>T" + (b.T || 3) + "</span><span" + (b.cool && live ? "" : " data-off") + ">" + (b.cool && live ? "M08" : "M09") + "</span>" + (LVL === 4 ? "<span>" + fmt(clockNow(), 1) + " s</span>" : "");
  // the console's own small screen: the bar beside the active line
  const z = WIN.z1 - 3.2 - Math.min(run.i, CON_LINES - 1) * LINE_DZ;
  el.bar.setAttribute("d", "M" + (WIN.x0 + 2.6) + " " + (-z - 0.9).toFixed(2) + "v1.8");
}
function posText(p) { return "X " + fmt(p[0], 1) + "  Y " + fmt(p[1], 1) + "  Z " + fmt(p[2], 1); }
function lineText(b) { return '<span class="gc-acc">' + b.n + "</span> " + b.w; }
function meaning(b) { return st.path === "b" && b.n === "N60" ? M.B60 : st.path === "b" && b.n === "N65" ? M.B65 : M[b.n]; }
function readout() {
  const out = [];
  const b = blocks[run.i];
  const p = toolAt();
  if (LVL === 1) {
    out.push(lineText(b) + ' <span class="gc-mute">· ' + T[b.kind] + "</span>");
    out.push(posText(p) + ' <span class="gc-mute">(G54)</span>');
    if (marked >= 0) { const [name, what] = T.parts[PARTS[marked].key]; out.push('<span class="gc-acc">' + name + "</span> · " + what); }
    else out.push('<span class="gc-mute">' + T.tapPart + "</span>");
  } else if (LVL === 2) {
    out.push(lineText(b) + ' <span class="gc-mute">· ' + T[b.kind] + "</span>");
    out.push(meaning(b));
    const togo = b.kind === "none" ? 0 : b.len * (1 - (run.state === "run" ? run.u : 1));
    out.push(posText(p) + ' <span class="gc-mute">· ' + T.togo + " " + fmt(togo, 1) + " · " + fmt(clockNow(), 1) + " s</span>");
  } else if (LVL === 3) {
    out.push((st.wrong ? '<span class="gc-acc">' + T.g54bad + "</span>" : T.g54ok));
    if (run.state === "crash") out.push('<span class="gc-strong">' + T.crash + "</span>");
    else if (run.state === "halt") out.push('<span class="gc-strong">' + T.halt + "</span>");
    else if (run.state === "end" && st.safe && !st.wrong) out.push('<span class="gc-strong">' + T.ok + "</span>");
    else {
      const rz = p[2] + zerr();
      out.push(lineText(b) + ' <span class="gc-mute">· ' + T.ctrl + " Z " + fmt(p[2], 1) + " · " + T.real + " " + fmt(Math.abs(rz), 1) + " " + (rz < 0 ? T.under : T.above) + "</span>");
    }
    out.push('<span class="gc-mute">' + (st.safe ? T.safeOn : T.safeOff) + "</span>");
  } else {
    const a = st.path === "a";
    out.push((a ? '<span class="gc-acc">A</span>' : "A") + ": N60 G01 Z25 → Z-3 F150 · 28 mm = " + fmt(CYCLE.n60, 1) + " s");
    out.push((a ? "B" : '<span class="gc-acc">B</span>') + ": G00 Z2 + G01 Z-3 F150 · 5 mm = " + fmt(CYCLE.b65, 1) + " s");
    out.push(T.cycle + " A " + fmt(CYCLE.a, 1) + " s · B " + fmt(CYCLE.b, 1) + " s · 9 s " + T.per + " " + T.hours);
  }
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
function draw() {
  const p = toolAt();
  const off = place(p);
  drawPlate();
  drawTrace();
  drawTool();
  drawChips();
  drawMark(off);
  drawListing();
  readout();
  const b = blocks[run.i];
  const live = run.state === "run" || run.state === "wait" || run.state === "gap";
  if (live && run.state === "run") el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  if (b.cool && live) el.cool.setAttribute("data-on", ""); else el.cool.removeAttribute("data-on");
  el.knob.forEach((n) => (n.style.display = (n.dataset.k === "25") === st.safe ? "" : "none"));
}

// ------------------------------------------------ chips while cutting
let spin = 0, phase = 0, chipClock = 0;
function spawnChip() {
  if (chips.length > 8) return;
  const side = Math.random() < 0.5 ? -1 : 1;
  chips.push({ p0: [side * RT, SPY + 3, TOP], p: [0, SPY, TOP], age: 0, a: 0, size: 1.8 + Math.random() * 1.2, turn0: Math.random() * 6.28, turn: 0, vx: side * (8 + Math.random() * 10), vy: 10 + Math.random() * 8, vz: 16 + Math.random() * 10 });
}
function stepChips(dt) {
  const b = blocks[run.i];
  const cutting = run.state === "run" && (b.kind === "feed" || b.kind === "arc") && toolAt()[2] + zerr() < 0;
  if (cutting) { chipClock += dt; if (chipClock > 0.16) { chipClock = 0; spawnChip(); } }
  for (const c of chips) {
    c.age += dt;
    const t = c.age;
    c.p = [c.p0[0] + c.vx * t, c.p0[1] + c.vy * t, c.p0[2] + c.vz * t - 60 * t * t];
    c.turn = c.turn0 + 5 * t;
    c.a = (t < 0.06 ? t / 0.06 : 1) * clamp((0.8 - t) / 0.35, 0, 1);
  }
  for (let i = chips.length - 1; i >= 0; i--) if (chips[i].age > 0.8) chips.splice(i, 1);
}

// ------------------------------------------------ the idle tour
// Level 1: the program loops. Level 2: line by line, a pause after each.
// Level 3: wrong G54 without safeguards (crash), with safeguards (stopped after
// N40), then the right G54 with safeguards (a good first part).
// Level 4: toolpath A, then B, and again.
const TOURS = {
  3: [{ wrong: true, safe: false }, { wrong: true, safe: true }, { wrong: false, safe: true }],
  4: [{ path: "a" }, { path: "b" }],
};
let touring = !still.matches, tourStep = 0, idleTimer = 0;
function tourNext() {
  if (TOURS[LVL]) { tourStep = (tourStep + 1) % TOURS[LVL].length; Object.assign(st, TOURS[LVL][tourStep]); rebuild(); }
  reset();
  sync();
}

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (!calm && st.playing) {
    stepRun(dt);
    stepChips(dt);
    const b = blocks[run.i];
    const goal = b.spin && (run.state === "run" || run.state === "wait" || run.state === "gap") ? 1 : 0;
    spin += (goal - spin) * (1 - Math.exp(-dt / 0.3));
    phase = (phase + dt * spin * 2 * Math.PI * 0.8) % (2 * Math.PI); // shown slowed
  }
  draw();
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const go = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else go(); };
function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; go(); } }, 40000);
}
// reduced motion: a still, meaningful state for each level
function stillPose() {
  reset();
  if (LVL === 3) { st.safe = false; rebuild(); const n50 = blocks.findIndex((b) => b.n === "N50"); run.i = n50; for (let s = 1; s <= 200; s++) { const p = posAt(blocks[n50], s / 200); if (contact(p)) { run.u = s / 200; run.crash = p; break; } } run.state = "crash"; }
  else { const n70 = blocks.findIndex((b) => b.n === "N70"); run.i = n70; run.u = 0.6; run.state = "run"; }
}

// ------------------------------------------------ controls
const rows = [...document.querySelectorAll("[data-row]")];
rows.forEach((r) => (r.hidden = r.dataset.row !== String(LVL)));
const btn = (sel) => document.querySelector(sel);
function sync() {
  const play = btn('[data-act="play"]');
  play.setAttribute("aria-pressed", String(!st.playing));
  btn('[data-act="auto"]').setAttribute("aria-pressed", String(!st.single));
  btn('[data-act="wrong"]').setAttribute("aria-pressed", String(st.wrong));
  btn('[data-act="safe"]').setAttribute("aria-pressed", String(st.safe));
  document.querySelectorAll("[data-path]").forEach((b) => { const on = b.dataset.path === st.path; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  btn('[data-act="prev"]').disabled = run.i === 0;
  lastList = ""; lastPlate = "";
  describe();
}
function describe() {
  const b = blocks[run.i];
  let text = b.n + " " + b.w + ": " + meaning(b);
  if (LVL === 1 && marked >= 0) text = T.parts[PARTS[marked].key].join(": ") + ". " + text;
  if (LVL === 3) text = (st.wrong ? T.g54bad : T.g54ok) + ". " + (st.safe ? T.safeOn : T.safeOff) + ". " + (run.state === "crash" ? T.crash : run.state === "halt" ? T.halt : run.state === "end" && st.safe && !st.wrong ? T.ok : text);
  if (LVL === 4) text = "A " + fmt(CYCLE.a, 1) + " s, B " + fmt(CYCLE.b, 1) + " s. " + text;
  stage.setAttribute("aria-valuetext", text);
  return text;
}
let quiet = 0;
function announce() { clearTimeout(quiet); quiet = setTimeout(() => { announcer.textContent = describe() + "."; }, 500); }
function act(name) {
  steer();
  if (name === "play") { st.playing = !st.playing; if (run.state === "end") reset(); }
  else if (name === "reset") { reset(); st.playing = true; }
  else if (name === "next" || name === "start") {
    if (run.state === "wait" || run.state === "gap") startNext();
    else if (run.state === "run") { finish(); if (run.state === "wait") startNext(); }
    else reset();
  } else if (name === "prev") {
    if (run.i > 0) { run.i--; run.u = 1; run.state = "wait"; }
  } else if (name === "auto") { st.single = !st.single; if (!st.single && run.state === "wait") startNext(); }
  else if (name === "wrong") { st.wrong = !st.wrong; rebuild(); reset(); }
  else if (name === "safe") { st.safe = !st.safe; reset(); }
  else if (name === "a" || name === "b") { st.path = name; rebuild(); reset(); }
  if (still.matches) { let n = 0; while ((run.state === "run" || run.state === "gap") && n++ < 5000) stepRun(0.05); } // reduced motion: jump to where the run stops
  sync(); announce(); kick();
}
document.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => act(b.dataset.act)));
document.querySelectorAll("[data-path]").forEach((b) => b.addEventListener("click", () => act(b.dataset.path)));
document.querySelector('[data-row="4"] [role="radiogroup"]').addEventListener("keydown", (event) => {
  if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)) return;
  event.preventDefault();
  const next = st.path === "a" ? "b" : "a";
  act(next);
  document.querySelector('[data-path="' + next + '"]').focus();
});

// tap the drawing: at level 1 name the nearest part
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearestPart([x, y]) {
  const p = toolAt();
  const wx = p[0] - PX, wy = PY - p[1];
  const off = { tx: -wx, ty: SPY - wy, tz: p[2] + zerr() - 2 };
  let best = -1, bestD = 40;
  PARTS.forEach((part, i) => {
    const o = part.g === "x" ? [off.tx, off.ty, 0] : part.g === "y" ? [0, off.ty, 0] : part.g === "z" ? [0, 0, off.tz] : [0, 0, 0];
    const [px, py] = iso([part.at[0] + o[0], part.at[1] + o[1], part.at[2] + o[2]], P);
    const d = Math.hypot(px - x, py - y);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}
art.addEventListener("click", (event) => {
  if (LVL !== 1) return;
  marked = nearestPart(toView(event));
  steer();
  sync();
  announce();
  kick();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (LVL === 1 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { marked = (marked + 1) % PARTS.length; steer(); sync(); announce(); kick(); }
  else if (LVL === 1 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { marked = (marked + PARTS.length - 1) % PARTS.length; steer(); sync(); announce(); kick(); }
  else if (LVL === 2 && (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ")) act("next");
  else if (LVL === 2 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) act("prev");
  else if (LVL === 3 && (event.key === "g" || event.key === "G")) act("wrong");
  else if (LVL === 3 && (event.key === "s" || event.key === "S")) act("safe");
  else if (LVL >= 3 && event.key === " ") act("start");
  else if (LVL === 4 && (event.key === "a" || event.key === "A" || event.key === "b" || event.key === "B")) act(event.key.toLowerCase());
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); kick(); });

// ------------------------------------------------ start
rebuild();
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) go();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; stillPose(); tick(performance.now()); } else { reset(); go(); } });
if (still.matches) stillPose();
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Een CNC-programma lezen",
    hint1: "Tik een onderdeel · het programma loopt",
    hint2: "Volgende regel: één regel per tik · 1 s = 4 s",
    hint3: "Zet G54 fout of goed, beveiliging aan of uit",
    hint4: "Kies baan A of B · 1 s = 4 s",
    pause: "Pauze",
    again: "Opnieuw",
    prev: "Vorige regel",
    next: "Volgende regel",
    auto: "Automaat",
    wrong: "G54 fout",
    safe: "Beveiliging",
    start: "Cyclusstart",
    pathA: "Baan A",
    pathB: "Baan B · CAM",
    paths: "Gereedschapsbaan",
    label: LABEL_NL,
    aria: "Bewerkingscentrum met CNC-programma. Niveau 1: pijltjes kiezen een onderdeel. Niveau 2: pijl rechts voert de volgende regel uit, pijl links gaat terug. Niveau 3: G zet het werkstuknulpunt fout of goed, S de beveiliging, spatie is cyclusstart. Niveau 4: A of B kiest de gereedschapsbaan.",
  },
  en: {
    title: "Reading a CNC program",
    hint1: "Tap a part · the program runs",
    hint2: "Next line: one line per tap · 1 s = 4 s",
    hint3: "Set G54 wrong or right, safeguards on or off",
    hint4: "Pick toolpath A or B · 1 s = 4 s",
    pause: "Pause",
    again: "Restart",
    prev: "Previous line",
    next: "Next line",
    auto: "Auto",
    wrong: "G54 wrong",
    safe: "Safeguards",
    start: "Cycle start",
    pathA: "Path A",
    pathB: "Path B · CAM",
    paths: "Toolpath",
    label: LABEL_EN,
    aria: "Machining centre with a CNC program. Level 1: arrows pick a part. Level 2: right arrow runs the next line, left arrow goes back. Level 3: G sets the work offset wrong or right, S the safeguards, space is cycle start. Level 4: A or B picks the toolpath.",
  },
};

const sN = STRINGS.nl;
const controls = [
  `<div class="gc-controls">`,
  `<div class="gc-row" data-row="1"><button type="button" class="gc-btn" data-act="play" aria-pressed="false" data-t="pause">${sN.pause}</button><button type="button" class="gc-btn" data-icon="" data-act="reset" aria-label="${sN.again}" data-l="again">↺</button></div>`,
  `<div class="gc-row" data-row="2"><button type="button" class="gc-btn" data-icon="" data-act="prev" aria-label="${sN.prev}" data-l="prev">◀</button><button type="button" class="gc-btn" data-act="next" data-t="next">${sN.next} ▶</button><button type="button" class="gc-btn" data-act="auto" aria-pressed="false" data-t="auto">${sN.auto}</button></div>`,
  `<div class="gc-row" data-row="3"><button type="button" class="gc-btn" data-act="wrong" aria-pressed="true" data-t="wrong">${sN.wrong}</button><button type="button" class="gc-btn" data-act="safe" aria-pressed="false" data-t="safe">${sN.safe}</button><button type="button" class="gc-btn" data-icon="" data-act="start" aria-label="${sN.start}" data-l="start">▶</button></div>`,
  `<div class="gc-row" data-row="4"><div role="radiogroup" aria-label="${sN.paths}" style="display:flex;gap:4px;flex:1 1 auto"><button type="button" class="gc-btn" role="radio" data-path="a" aria-checked="true" data-t="pathA">${sN.pathA}</button><button type="button" class="gc-btn" role="radio" data-path="b" aria-checked="false" tabindex="-1" data-t="pathB">${sN.pathB}</button></div><button type="button" class="gc-btn" data-icon="" data-act="start" aria-label="${sN.start}" data-l="start">▶</button></div>`,
  `</div>`,
].join("");
const screen = `<div class="gc-screen" aria-hidden="true"><div class="gc-head"><span>O1001</span><span>G54 · mm</span></div><ol class="gc-prog"></ol><div class="gc-modal"></div></div>`;

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="gc-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}"><div class="gc-art">${svg}</div>${screen}</div>${controls}<div class="gc-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="gc-line"></span>'.repeat(3)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
var l=Number(q.get("level"));d.setAttribute("data-level",String(l>=1&&l<=4?l:2));
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";var s=en?${JSON.stringify(STRINGS.en)}:${JSON.stringify({ ...STRINGS.nl, label: undefined })};
var lv=document.documentElement.getAttribute("data-level");document.querySelector("[data-hint]").textContent=s["hint"+lv];
if(!en)return;
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
document.querySelectorAll("[data-t]").forEach(function(n){n.textContent=s[n.getAttribute("data-t")]+(n.getAttribute("data-t")==="next"?" \\u25B6":"");});
document.querySelectorAll("[data-l]").forEach(function(n){n.setAttribute("aria-label",s[n.getAttribute("data-l")]);});
document.querySelector('[data-row="4"] [role="radiogroup"]').setAttribute("aria-label",s.paths);
var st=document.querySelector(".gc-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + latheScript + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: F ${0.05 * 4 * 3200} · N60 ${blk(BA, "N60").time.toFixed(2)} s · N70 ${blk(BA, "N70").time.toFixed(2)} s · N80 ${blk(BA, "N80").time.toFixed(2)} s · B N65 ${blk(BB, "N65").time.toFixed(2)} s · cycle A ${CYCLE.a.toFixed(2)} s · B ${CYCLE.b.toFixed(2)} s`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { frames: A.uniformStates(20), apart: true });
