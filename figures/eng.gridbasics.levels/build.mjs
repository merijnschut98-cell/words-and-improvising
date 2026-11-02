// Dev tool, not shipped. Builds the standalone figure for the lesson
// "Voltage levels and who runs what" (module The electricity grid, level 1).
//
//   node figures/eng.gridbasics.levels/build.mjs
//
// Writes src/content/courses/figures/eng.gridbasics.levels.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
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
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.gridbasics.levels.html");

// ---------------------------------------------------------------- the model
// A simplified three-phase line: a fixed 100 MW sent at cos φ = 1 over a line
// with R = 5 Ω per conductor.
//   I      = P / (√3 · U)
//   P_loss = 3 · I² · R          (= P² · R / U²)
// The loss is computed from the sending current, as the lesson does. At 10 kV
// it comes out at 500 MW, five times what is sent: the model says plainly that
// you cannot move 100 MW at 10 kV over this line. Delivered power is shown as
// max(0, P − P_loss).
// Dutch levels and who runs them: LS 400 V and MS 10 kV by the regional grid
// operator (e.g. Enexis), TS 50 kV by regional operators (e.g. Stedin,
// Liander), HS 150 kV and EHS 380 kV by TenneT, the national TSO.
const P_MW = 100;
const R_OHM = 5;
const LEVELS = [10, 50, 150, 380]; // kV
const START = 2; // 150 kV

// ---------------------------------------------------------------- the world
// World units are model millimetres on a bench board, z up. The line runs
// along x at the back; the selector rail lies in front of it; the
// distribution end (netstation and houses) runs back along the front edge.
const WIDTH = 600;
const BASE = { x: -168, y: -114, w: 336, d: 200, r: 8 };
const BASE_H = 9;
const LINE_Y = -68;
const PH = 12; // outer phases at LINE_Y ± PH
const ARM_Z = 46; // crossarm / beam underside
const HANG_Z = 39; // clamp of a hanging insulator string
const TOWERS = [-42, 0, 42];
const GANTRIES = [-84, 84];
const POST_DY = 20;
const TOP_Z = 61; // middle phase on a post insulator on a tower
const BEAM_TOP = ARM_Z + 4;
const GTOP_Z = BEAM_TOP + 6; // middle phase on a gantry beam
const SAG = 4.5;
const RAIL = { x: -130, y: -40, w: 246, d: 12, r: 1.5 };
const RAIL_H = 5;
const DETENTS = [-114, -42, 30, 102];
const CAR_Y = RAIL.y + RAIL.d / 2;
const HOUSES = { x: -160, y: 30, w: 200, d: 26, r: 0.4 };
const HOUSE_N = 4;
const WALL_H = 19;
const RIDGE_Z = 34;
const NET = { x: 112, y: 34, w: 30, d: 26, r: 0.6 };
const NET_H = 20;
const LS_Y = 70;
const MS_X = 152.5;

const FIT = [
  ...k.boxCorners(BASE, -BASE_H - 6, 0),
  [-133, -106, 94],
  ...TOWERS.map((x) => [x, LINE_Y, TOP_Z + 2]),
  [HOUSES.x, HOUSES.y + HOUSES.d / 2, RIDGE_Z + 6],
];
const PAD = 12;
const AZIMUTH = Number(process.env.AZ ?? 58);
const ELEVATION = Number(process.env.EL ?? 42);
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };

const at = (point) => k.iso(point, P);
const { sinA, cosA, sinE, cosE } = k.cameraOf(P);
const VIEW = [cosA * cosE, sinA * cosE, sinE];
let solids = 0;
let parts = 0;
const part = (n = 1) => { parts += n; return ""; };
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const depth = ([x, y, z = 0]) => k.depthOf([x, y, z], P);
const face = (points) => k.pathOf(points.map(at), true);
const fmt1 = (v) => (Math.round(v * 10) / 10).toFixed(1);

// ---------------------------------------------------------------- convex solids from faces
// A convex polyhedron given as faces (3D polygons). Each visible face is shaded
// by facing like the kit's extrude: tops lighter, sides in four shades. Fill
// and outline are the hull of the projected vertices; creases are the edges
// shared by two visible faces.
function hull(points) {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const p of pts) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
  const upper = [];
  for (const p of [...pts].reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
function polySolid(faces) {
  const verts = faces.flat();
  const c = [0, 1, 2].map((i) => verts.reduce((s, v) => s + v[i], 0) / verts.length);
  const shades = [[], [], [], []];
  const tops = [];
  const visible = [];
  for (const f of faces) {
    let n = [0, 0, 0];
    for (let i = 0; i < f.length; i++) {
      const a = f[i], b = f[(i + 1) % f.length];
      n[0] += (a[1] - b[1]) * (a[2] + b[2]);
      n[1] += (a[2] - b[2]) * (a[0] + b[0]);
      n[2] += (a[0] - b[0]) * (a[1] + b[1]);
    }
    const len = Math.hypot(...n) || 1;
    n = n.map((v) => v / len);
    const fc = [0, 1, 2].map((i) => f.reduce((s, v) => s + v[i], 0) / f.length);
    if ((fc[0] - c[0]) * n[0] + (fc[1] - c[1]) * n[1] + (fc[2] - c[2]) * n[2] < 0) n = n.map((v) => -v);
    const facing = n[0] * VIEW[0] + n[1] * VIEW[1] + n[2] * VIEW[2];
    if (facing <= 1e-6) continue;
    visible.push(f);
    const d = face(f);
    if (n[2] > 0.55) tops.push(d);
    else {
      const h = Math.hypot(n[0], n[1]) || 1;
      const lit = ((n[0] / h) * -sinA + (n[1] / h) * cosA + 1) / 2;
      shades[Math.min(3, Math.max(0, Math.floor(lit * 4)))].push(d);
    }
  }
  const key = (p) => p.map((v) => v.toFixed(3)).join(",");
  const edges = new Map();
  for (const f of visible) for (let i = 0; i < f.length; i++) {
    const a = f[i], b = f[(i + 1) % f.length];
    const id = [key(a), key(b)].sort().join("|");
    edges.set(id, { a, b, n: (edges.get(id)?.n ?? 0) + 1 });
  }
  const crease = [...edges.values()].filter((e) => e.n > 1).map((e) => k.pathOf([at(e.a), at(e.b)])).join("");
  const outline = k.pathOf(hull(verts.map(at)), true);
  return { fill: outline, outline, crease, top: tops.join(""), shades: shades.map((s) => s.join("")) };
}
// A square frustum (a lattice tower body), half-widths r0 at z0 and r1 at z1.
function frustum(cx, cy, r0, r1, z0, z1) {
  const sq = (r, z) => [[cx - r, cy - r, z], [cx + r, cy - r, z], [cx + r, cy + r, z], [cx - r, cy + r, z]];
  const b = sq(r0, z0), t = sq(r1, z1);
  const sides = [0, 1, 2, 3].map((i) => [b[i], b[(i + 1) % 4], t[(i + 1) % 4], t[i]]);
  return { paths: polySolid([b, t, ...sides]), b, t };
}
// X bracing on the two visible faces of a frustum, in panels; every line runs
// corner to corner or edge to edge.
function bracing(cx, cy, r0, r1, z0, z1, panels) {
  const out = [];
  const rAt = (z) => r0 + ((r1 - r0) * (z - z0)) / (z1 - z0);
  for (let i = 0; i < panels; i++) {
    const za = z0 + ((z1 - z0) * i) / panels, zb = z0 + ((z1 - z0) * (i + 1)) / panels;
    const ra = rAt(za), rb = rAt(zb);
    // +x face (x = cx + r), y from -r to +r
    out.push(k.segment([cx + ra, cy - ra, za], [cx + rb, cy + rb, zb], P), k.segment([cx + ra, cy + ra, za], [cx + rb, cy - rb, zb], P));
    // +y face
    out.push(k.segment([cx - ra, cy + ra, za], [cx + rb, cy + rb, zb], P), k.segment([cx + ra, cy + ra, za], [cx - rb, cy + rb, zb], P));
    if (i > 0) out.push(k.pathOf([at([cx + ra, cy - ra, za]), at([cx + ra, cy + ra, za]), at([cx - ra, cy + ra, za])]));
  }
  return L(out.join(""), { tone: "lo" });
}

// ---------------------------------------------------------------- board
function board() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - 6, BASE_H + 6, P)}"/>`];
  part(5);
  const feet = k.corners(BASE, 18);
  for (const [x, y] of feet.sort((a, b) => depth(a) - depth(b))) {
    out.push(S(k.cylinder(x, y, 7, -BASE_H - 6, 1.4, P, 24), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.2, -BASE_H - 4.6, 4.6, P, 24), { tone: "mid", crease: "none" }));
  }
  out.push(S(k.slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.4), { tone: "lo", inner: L(k.sideSeam(BASE, -BASE_H + 3, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(BASE, 5), 0, P, 6), { tone: "faint" }));
  const screws = k.corners(BASE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  return out.join("");
}

// ---------------------------------------------------------------- power station
function station() {
  const out = [];
  part(4);
  // boiler house, tall, behind the hall
  const boiler = { x: -164, y: -112, w: 22, d: 14, r: 0.4 };
  out.push(S(k.slabOf(boiler, 0, 44, P, 2, 0.5), { tone: "mid", inner: L(k.sideSeam(boiler, 32, P, 2), { tone: "faint" }) }));
  // stack with a band and a top ring
  const [sx, sy] = [-133, -106];
  out.push(S(k.cylinder(sx, sy, 5, 0, 88, P, 32), { tone: "hi", crease: "none", inner: L(k.sideArc(sx, sy, 5, 30, P, 20) + k.sideArc(sx, sy, 5, 58, P, 20), { tone: "faint" }) }));
  out.push(S(k.cylinder(sx, sy, 5.8, 86, 3, P, 32), { tone: "mid" }));
  out.push(L(k.ring(sx, sy, 3.6, 89, P, 24), { tone: "lo" }));
  // turbine hall with a shallow parapet roof
  const hall = { x: -164, y: -98, w: 38, d: 32, r: 0.4 };
  const HZ = 26;
  const inner = [];
  const fy = hall.y + hall.d;
  for (const x0 of [-160, -152, -144]) inner.push(face([[x0, fy, 9], [x0 + 5, fy, 9], [x0 + 5, fy, 21], [x0, fy, 21]]));
  inner.push(face([[-137, fy, 0], [-130, fy, 0], [-130, fy, 13], [-137, fy, 13]]));
  out.push(S(k.slabOf(hall, 0, HZ, P, 2, 0.5), { tone: "hi", crease: "lo", inner: L(inner.join(""), { tone: "lo" }) + L(k.sideSeam(hall, 23, P, 2), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(hall, 1.6), HZ, P, 2), { tone: "faint" }));
  out.push(D([[-160, fy, 23.8], [-130, fy, 23.8]].map(at), { size: 0.45 }));
  // label: generator voltage
  out.push(k.faceTextSvg(k.sideMatrix([-160, fy], 6, P, "left"), "21 kV", { size: 4.6, tone: "mid" }));
  // isolated-phase busduct from the hall to the step-up transformer
  const duct = { x: -126, y: -72, w: 11.2, d: 7, r: 0.6 };
  out.push(S(k.slabOf(duct, 12, 5, P, 2, 0.3), { tone: "mid" }));
  return out.join("");
}

// ---------------------------------------------------------------- transformers
// tank + radiator fins on the +y face + HV bushings on top (along y)
function transformer(cx, cy, { w = 18, d = 24, h = 20, base = 0, side = 1 }) {
  const out = [];
  part(2);
  const tank = { x: cx - w / 2, y: cy - d / 2, w, d, r: 0.8 };
  out.push(S(k.slabOf(k.insetPlan(tank, -1.4), base, 2, P, 2, 0.3), { tone: "lo" }));
  // fins on the -y face are hidden; put them on the +x end facing the viewer when side > 0, otherwise on the +y face
  const fins = [];
  if (side > 0) {
    for (const y of [cy - 8, cy - 3, cy + 2, cy + 7].sort((a, b) => depth([0, a]) - depth([0, b]))) fins.push(S(k.slabOf({ x: tank.x + w - 0.5, y: y - 0.7, w: 6.5, d: 1.4, r: 0.4 }, base + 4, h - 6, P, 2), { tone: "hi", crease: "lo" }));
  }
  const seams = k.sideSeam(tank, base + h - 3, P, 2);
  out.push(S(k.slabOf(tank, base + 2, h - 2, P, 2, 0.5), { tone: "hi", crease: "lo", inner: L(seams, { tone: "faint" }) }));
  out.push(...fins);
  if (side < 0) {
    // radiators on the +y face
    for (const x of [cx - 6, cx, cx + 6]) out.push(S(k.slabOf({ x: x - 0.7, y: tank.y + d - 0.5, w: 1.4, d: 6.5, r: 0.4 }, base + 4, h - 6, P, 2), { tone: "hi", crease: "lo" }));
  }
  out.push(L(k.planOutline(k.insetPlan(tank, 1.6), base + h, P, 2), { tone: "faint" }));
  return out.join("");
}
function bushing(x, y, z, h, r = 1.8) {
  part();
  const out = [];
  out.push(S(k.cylinder(x, y, r + 1.2, z, 1.2, P, 18, 0.2), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, r, z + 1.2, h - 1.2, P, 18), { tone: "hi", crease: "none", inner: L([0.35, 0.6, 0.85].map((f) => k.sideArc(x, y, r, z + 1.2 + (h - 1.2) * f, P, 12)).join(""), { tone: "faint" }) }));
  out.push(D([at([x, y, z + h])], { size: 0.6, tone: "hi" }));
  return out.join("");
}
const STEPUP = [-106, LINE_Y];
const STEPDN = [106, LINE_Y];
const BUSH_Z = 22;
const BUSH_H = 9;
const STEPUP_B = [-1, 0, 1].map((i) => [STEPUP[0] + 3, LINE_Y + i * 8]);
const STEPDN_B = [-1, 0, 1].map((i) => [STEPDN[0] - 3, LINE_Y + i * 8]);
function stepUp() {
  const out = [transformer(STEPUP[0], STEPUP[1], { side: -1, base: 0 })];
  for (const [x, y] of STEPUP_B.sort((a, b) => depth(a) - depth(b))) out.push(bushing(x, y, 20, BUSH_H));
  return out.join("");
}
const PAD_Z = 1.4;
const SUB_PAD = { x: 68, y: -110, w: 96, d: 76, r: 1.2 };
function subPad() {
  const out = [];
  part(1);
  out.push(S(k.slabOf(SUB_PAD, 0, PAD_Z, P, 2, 0.3), { tone: "lo", crease: "none" }));
  const g = [];
  for (let x = SUB_PAD.x + 6; x < SUB_PAD.x + SUB_PAD.w - 3; x += 7) for (let y = SUB_PAD.y + 6; y < SUB_PAD.y + SUB_PAD.d - 3; y += 7) g.push(at([x + ((y * 3) % 5) * 0.3, y, PAD_Z]));
  out.push(`<g style="opacity:.55">${D(g, { size: 0.35, tone: "lo" })}</g>`);
  return out.join("");
}
function stepDown() {
  const out = [transformer(STEPDN[0], STEPDN[1], { side: 1, base: PAD_Z })];
  for (const [x, y] of STEPDN_B.sort((a, b) => depth(a) - depth(b))) out.push(bushing(x, y, PAD_Z + 20, BUSH_H - 1.4));
  return out.join("");
}
// MS switchgear building of the substation
const MSB = { x: 126, y: -58, w: 34, d: 20, r: 0.4 };
function msBuilding() {
  const out = [];
  part(2);
  const fy = MSB.y + MSB.d;
  const z0 = PAD_Z;
  const inner = [face([[129, fy, z0], [136, fy, z0], [136, fy, z0 + 12], [129, fy, z0 + 12]]), face([[139, fy, z0 + 13], [156, fy, z0 + 13], [156, fy, z0 + 15], [139, fy, z0 + 15]])];
  out.push(S(k.slabOf(MSB, z0, 17, P, 2, 0.4), { tone: "mid", inner: L(inner.join(""), { tone: "lo" }) + L(k.sideSeam(MSB, z0 + 15.6, P, 2), { tone: "faint" }) }));
  out.push(D([at([134.8, fy, z0 + 6])], { size: 0.5, tone: "hi" }));
  out.push(k.faceTextSvg(k.sideMatrix([139, fy], z0 + 6.6, P, "left"), "MS 10 kV", { size: 3.6, tone: "mid" }));
  // cable gland on the front face, where the MS cable leaves
  out.push(S(k.slabOf({ x: MS_X - 2.5, y: fy, w: 5, d: 2.4, r: 0.6 }, z0, 4, P, 2), { tone: "lo" }));
  return out.join("");
}

// ---------------------------------------------------------------- towers, gantries, insulators
const insHang = (x, y) => {
  // a string of three discs hanging from the arm, clamp at HANG_Z
  const out = [S(k.cylinder(x, y, 0.6, HANG_Z, ARM_Z - HANG_Z, P, 12), { tone: "mid", crease: "none" })];
  for (const z of [40.4, 42.4, 44.4]) out.push(S(k.cylinder(x, y, 1.7, z, 0.6, P, 18), { tone: "hi", crease: "none" }));
  out.push(D([at([x, y, HANG_Z])], { size: 0.65, tone: "hi" }));
  return out.join("");
};
const insPost = (x, y, z0, z1) => {
  const out = [S(k.cylinder(x, y, 0.7, z0, z1 - z0, P, 12), { tone: "mid", crease: "none" })];
  for (let i = 1; i <= 3; i++) out.push(S(k.cylinder(x, y, 1.7, z0 + ((z1 - z0) * i) / 4 - 0.3, 0.6, P, 18), { tone: "hi", crease: "none" }));
  out.push(D([at([x, y, z1])], { size: 0.65, tone: "hi" }));
  return out.join("");
};
function footing(x, y) {
  return S(k.slabOf({ x: x - 2.6, y: y - 2.6, w: 5.2, d: 5.2, r: 0.4 }, 0, 1.6, P, 2, 0.3), { tone: "lo" });
}
function tower(x) {
  part(6);
  const y = LINE_Y;
  const out = [];
  const R0 = 7.5, R1 = 2.6;
  out.push(insHang(x, y - PH));
  const body = frustum(x, y, R0, R1, 0, ARM_Z);
  out.push(S(body.paths, { tone: "mid", crease: "lo", inner: bracing(x, y, R0, R1, 0, ARM_Z, 4) }));
  out.push(insHang(x, y + PH));
  out.push(S(k.slabOf({ x: x - 1.6, y: y - PH - 3, w: 3.2, d: 2 * PH + 6, r: 0.4 }, ARM_Z, 3, P, 2), { tone: "mid" }));
  const peak = frustum(x, y, 1.6, 1.0, ARM_Z + 3, TOP_Z - 6);
  out.push(S(peak.paths, { tone: "mid", crease: "lo" }));
  out.push(insPost(x, y, TOP_Z - 6, TOP_Z));
  return out.join("");
}
// a gantry (portal) where the line lands in a yard: two lattice posts and a beam
const GP0 = 3.6, GP1 = 2.0;
function gantryPost(x, y, z0, z1) {
  const rAt = (z) => GP0 + ((GP1 - GP0) * z) / ARM_Z;
  const f = frustum(x, y, rAt(z0), rAt(z1), z0, z1);
  return S(f.paths, { tone: "mid", crease: "lo", inner: z1 - z0 > 20 ? bracing(x, y, rAt(z0), rAt(z1), z0, z1, 3) : "" });
}
function gantryBack(x) {
  part(1);
  return gantryPost(x, LINE_Y - POST_DY, 0, ARM_Z);
}
function gantryTop(x) {
  part(4);
  const y = LINE_Y;
  const out = [];
  out.push(insHang(x, y - PH));
  out.push(insHang(x, y + PH));
  out.push(gantryPost(x, y + POST_DY, 40, ARM_Z));
  out.push(S(k.slabOf({ x: x - 2, y: y - POST_DY - 3, w: 4, d: 2 * POST_DY + 6, r: 0.4 }, ARM_Z, BEAM_TOP - ARM_Z, P, 2, 0.3), { tone: "mid" }));
  out.push(D([[x, y - POST_DY - 1.4], [x, y + POST_DY + 1.4]].map(([px, py]) => at([px, py, BEAM_TOP])), { size: 0.45 }));
  out.push(insPost(x, y, BEAM_TOP, GTOP_Z));
  return out.join("");
}
function gantryFront(x) {
  part(1);
  return gantryPost(x, LINE_Y + POST_DY, 0, 40);
}

// ---------------------------------------------------------------- conductors
const STOPS = [GANTRIES[0], ...TOWERS, GANTRIES[1]];
const attachZ = (x, phase) => (phase === 0 ? (GANTRIES.includes(x) ? GTOP_Z : TOP_Z) : HANG_Z);
function spanPoints(x0, x1, y, z0, z1, sag = SAG, n = 18) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([x0 + (x1 - x0) * t, y, z0 + (z1 - z0) * t - sag * 4 * t * (1 - t)]);
  }
  return pts;
}
// One phase across the whole line, as one path (spans joined at the clamps).
function phasePath(phase) {
  const y = LINE_Y + phase * PH;
  const pts = [];
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i], b = STOPS[i + 1];
    const seg = spanPoints(a, b, y, attachZ(a, phase), attachZ(b, phase));
    pts.push(...(i ? seg.slice(1) : seg));
  }
  return k.pathOf(pts.map(at));
}
function conductor(phase) {
  part();
  const d = phasePath(phase);
  const ends = STOPS.map((x) => at([x, LINE_Y + phase * PH, attachZ(x, phase)]));
  return `<g class="tl-phase"><path class="tl-glow" data-glow="" d="${d}"/><path class="tl-core" data-core="" d="${d}"/>${L(d, { tone: "mid" })}<path class="tl-flow" data-flow-line="" d="${d}"/>${D(ends, { size: 0.65, tone: "hi" })}</g>`;
}
// droppers from a gantry to transformer bushings (short slack wires)
function droppers(gx, bushings, bz, phases) {
  part(phases.length / 6);
  const out = [];
  for (const phase of phases) {
    const y = LINE_Y + phase * PH;
    const [bx, by] = bushings[phase + 1];
    const z0 = phase === 0 ? GTOP_Z : HANG_Z;
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      pts.push([gx + (bx - gx) * t, y + (by - y) * t, z0 + (bz - z0) * t - 2 * 4 * t * (1 - t)]);
    }
    out.push(L(k.pathOf(pts.map(at)), { tone: "mid" }));
  }
  return out.join("");
}

// ---------------------------------------------------------------- selector rail
const CAR = { x: -7, y: RAIL.y - 2, w: 14, d: RAIL.d + 4, r: 1.2 };
function rail() {
  part(8);
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(RAIL, -2), 0, 2, P)}" style="opacity:.5"/>`);
  // label block at the left end, with the live voltage engraved on its front
  const lb = { x: -134, y: -24, w: 32, d: 14, r: 1 };
  out.push(S(k.slabOf(lb, 0, 9, P, 2, 0.5), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(lb, 1.6), 9, P, 2), { tone: "faint" }));
  out.push(D(k.corners(lb, 3).map(([x, y]) => at([x, y, 9])), { size: 0.45 }));
  out.push(k.faceTextSvg(k.sideMatrix([lb.x + 3, lb.y + lb.d], 6.4, P, "left"), "HS 150 kV", { size: 4.6, tone: "hi" }).replace("<text", "<text data-plate=\"\""));
  // end stops
  for (const x of [RAIL.x - 6, RAIL.x + RAIL.w]) {
    out.push(S(k.slabOf({ x, y: RAIL.y - 2, w: 6, d: RAIL.d + 4, r: 0.8 }, 0, 9, P, 2, 0.4), { tone: "mid" }));
    out.push(D([at([x + 3, RAIL.y + 1, 9]), at([x + 3, RAIL.y + RAIL.d - 1, 9])], { size: 0.45 }));
  }
  // the rail with its slot
  const slot = { x: RAIL.x + 4, y: CAR_Y - 1.2, w: RAIL.w - 8, d: 2.4, r: 1.2 };
  out.push(S(k.slabOf(RAIL, 0, RAIL_H, P, 2, 0.4), { tone: "mid", inner: L(k.sideSeam(RAIL, 1.6, P, 2), { tone: "faint" }) }));
  out.push(`<path class="tl-void" d="${k.planOutline(slot, RAIL_H, P, 4)}"/>`);
  out.push(L(k.planOutline(slot, RAIL_H, P, 4), { tone: "lo" }));
  // detent studs on the back half of the rail, one per voltage, growing with it
  DETENTS.forEach((x, i) => {
    out.push(S(k.cylinder(x, RAIL.y + 2.4, 1.6, RAIL_H, 2 + i * 1.1, P, 16), { tone: "hi", crease: "lo" }));
  });
  return out.join("");
}
function carriage() {
  part(2);
  const out = [];
  const top = RAIL_H + 4;
  out.push(S(k.slabOf(CAR, RAIL_H, 4, P, 2, 0.5), { tone: "hi", crease: "lo", inner: L(k.lineOnTop([0, CAR.y + CAR.d - 0.1], [0, CAR.y + CAR.d - 3.4], top, P), { tone: "lo" }) }));
  out.push(D([[-4.6, CAR.y + 1.6], [4.6, CAR.y + 1.6]].map(([x, y]) => at([x, y, top])), { size: 0.45 }));
  out.push(S(k.cylinder(0, CAR_Y + 1, 3.6, top, 5, P, 28), { tone: "hi" }));
  out.push(L(k.knurl(0, CAR_Y + 1, 3.6, top, top + 5, 26, P), { tone: "lo" }));
  out.push(D([at([0, CAR_Y + 1, top + 5])], { size: 0.6, tone: "hi" }));
  return `<g data-carriage="">${out.join("")}</g>`;
}

// ---------------------------------------------------------------- MS cable, netstation, houses, LS cable
function cable(points, cls = "") {
  const d = k.pathOf(points.map(at));
  return `<g class="tl-cable${cls}"><path class="tl-cable-o" d="${d}"/><path class="tl-cable-i" d="${d}"/></g>`;
}
function rounded(pts, r = 6, n = 6) {
  // round the corners of a polyline lying in a horizontal plane
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, b, c] = [pts[i - 1], pts[i], pts[i + 1]];
    const u = [a[0] - b[0], a[1] - b[1]], v = [c[0] - b[0], c[1] - b[1]];
    const lu = Math.hypot(...u), lv = Math.hypot(...v);
    const p0 = [b[0] + (u[0] / lu) * r, b[1] + (u[1] / lu) * r, b[2]];
    const p1 = [b[0] + (v[0] / lv) * r, b[1] + (v[1] / lv) * r, b[2]];
    for (let j = 0; j <= n; j++) {
      const t = j / n;
      const q = (1 - t) * (1 - t), w = 2 * (1 - t) * t, s = t * t;
      out.push([q * p0[0] + w * b[0] + s * p1[0], q * p0[1] + w * b[1] + s * p1[1], b[2]]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
const CZ = 1.3;
function msCable() {
  part(1);
  const fy = MSB.y + MSB.d;
  const pts = rounded([[MS_X, fy + 2.4, CZ + PAD_Z], [MS_X, SUB_PAD.y + SUB_PAD.d, CZ + PAD_Z], [MS_X, SUB_PAD.y + SUB_PAD.d + 3, CZ], [MS_X, 47, CZ], [NET.x + NET.w + 2.4, 47, CZ]], 6);
  return cable(pts);
}
// the transformer's LV side to the MS building, a short cable across the yard
function lvLink() {
  part(1);
  const ty = STEPDN[1] + 12;
  return cable(rounded([[STEPDN[0] + 4, ty + 1.4, PAD_Z + CZ], [STEPDN[0] + 4, -47, PAD_Z + CZ], [MSB.x + 2, -47, PAD_Z + CZ]], 5));
}
const LS_X = NET.x + 5.5;
function netstation() {
  part(4);
  const out = [];
  const fy = NET.y + NET.d;
  const X = NET.x;
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(NET, -2), 0, 3, P)}" style="opacity:.6"/>`);
  const inner = [
    face([[X + 9, fy, 0], [X + 16.5, fy, 0], [X + 16.5, fy, 13], [X + 9, fy, 13]]),
    face([[X + 18, fy, 0], [X + 25.5, fy, 0], [X + 25.5, fy, 13], [X + 18, fy, 13]]),
  ];
  // vent slots on the +x face
  const fx = NET.x + NET.w;
  for (const z of [5, 7.6, 10.2, 12.8]) inner.push(face([[fx, NET.y + 4, z], [fx, NET.y + 10, z], [fx, NET.y + 10, z + 1.2], [fx, NET.y + 4, z + 1.2]]));
  out.push(S(k.slabOf(NET, 0, NET_H, P, 2, 0.4), { tone: "hi", crease: "lo", inner: L(inner.join(""), { tone: "lo" }) + L(k.sideSeam(NET, 1.6, P, 2), { tone: "faint" }) }));
  out.push(D([at([X + 15.2, fy, 7]), at([X + 19.3, fy, 7])], { size: 0.45, tone: "hi" }));
  out.push(S(k.slabOf(k.insetPlan(NET, -1.6), NET_H, 2.4, P, 2, 0.5), { tone: "mid" }));
  out.push(k.faceTextSvg(k.sideMatrix([X + 9, fy], 16.8, P, "left"), "LS 400 V", { size: 3.4, tone: "mid" }));
  // cable glands: MS in on the +x face, LS out on the front
  out.push(S(k.slabOf({ x: fx, y: 44.5, w: 2.4, d: 5, r: 0.6 }, 0, 3.4, P, 2), { tone: "lo" }));
  out.push(S(k.slabOf({ x: LS_X - 2.5, y: fy, w: 5, d: 2.4, r: 0.6 }, 0, 3.4, P, 2), { tone: "lo" }));
  return out.join("");
}
const HW = HOUSES.w / HOUSE_N;
const HOUSE_X = Array.from({ length: HOUSE_N }, (_, i) => HOUSES.x + HW * (i + 0.5));
const FRONT_Y = HOUSES.y + HOUSES.d;
function houses() {
  part(2 + HOUSE_N);
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(HOUSES, 0, 4, P)}" style="opacity:.6"/>`);
  const ry = HOUSES.y + HOUSES.d / 2;
  // walls with doors, windows, party walls
  const inner = [];
  const win = [];
  const wins = [];
  HOUSE_X.forEach((cx, i) => {
    const x0 = cx - HW / 2;
    if (i > 0) inner.push(k.segment([x0, FRONT_Y, 0], [x0, FRONT_Y, WALL_H], P));
    inner.push(face([[cx - 16, FRONT_Y, 0], [cx - 9, FRONT_Y, 0], [cx - 9, FRONT_Y, 12], [cx - 16, FRONT_Y, 12]]));
    for (const [wx, z0, z1, w] of [[cx + 4, 5, 12, 16], [cx - 12, 14, 17.5, 9], [cx + 4, 14, 17.5, 12]]) {
      const q = [[wx - w / 2, FRONT_Y, z0], [wx + w / 2, FRONT_Y, z0], [wx + w / 2, FRONT_Y, z1], [wx - w / 2, FRONT_Y, z1]];
      wins.push(face(q));
      win.push(k.segment([wx, FRONT_Y, z0], [wx, FRONT_Y, z1], P));
    }
  });
  // gable-end window on the +x face
  const gx = HOUSES.x + HOUSES.w;
  wins.push(face([[gx, ry - 4, 10], [gx, ry + 4, 10], [gx, ry + 4, 15.5], [gx, ry - 4, 15.5]]));
  inner.push(...wins);
  const plinth = k.sideSeam(HOUSES, 2.4, P, 2);
  out.push(S(k.slabOf(HOUSES, 0, WALL_H, P, 2), { tone: "hi", crease: "lo", inner: `<path class="tl-win" data-win="" d="${wins.join("")}"/>` + L(inner.join("") + win.join(""), { tone: "lo" }) + L(plinth, { tone: "faint" }) }));
  // roof: a triangular prism along x, eaves overhanging
  const e = 2.4;
  const X0 = HOUSES.x - e, X1 = HOUSES.x + HOUSES.w + e, Y0 = HOUSES.y - e - 1, Y1 = FRONT_Y + e + 1, EZ = WALL_H - 1;
  const A = [X0, Y0, EZ], B = [X1, Y0, EZ], C = [X1, Y1, EZ], Dd = [X0, Y1, EZ], R0 = [X0, ry, RIDGE_Z], R1 = [X1, ry, RIDGE_Z];
  const roofFaces = [[A, B, C, Dd], [Dd, C, R1, R0], [A, R0, R1, B], [A, Dd, R0], [B, R1, C]];
  const tiles = [];
  for (const f of [0.25, 0.5, 0.75]) {
    const y = Y1 + (ry - Y1) * f, z = EZ + (RIDGE_Z - EZ) * f;
    tiles.push(k.segment([X0, y, z], [X1, y, z], P));
  }
  const party = HOUSE_X.slice(1).map((cx) => k.segment([cx - HW / 2, Y1, EZ], [cx - HW / 2, ry, RIDGE_Z], P));
  out.push(S(polySolid(roofFaces), { tone: "mid", crease: "lo", inner: L(tiles.join(""), { tone: "faint" }) + L(party.join(""), { tone: "lo" }) }));
  // meter boxes on the front walls, where each LS branch lands
  for (const cx of HOUSE_X) {
    out.push(S(k.slabOf({ x: cx - 6.5, y: FRONT_Y, w: 5, d: 1.4, r: 0.3 }, 2.4, 5.4, P, 2), { tone: "mid" }));
  }
  return out.join("");
}
function lsCable() {
  part(2);
  const out = [];
  const x0 = LS_X;
  const last = HOUSE_X[0] - 4;
  out.push(cable(rounded([[x0, NET.y + NET.d + 2.4, CZ], [x0, LS_Y, CZ], [last, LS_Y, CZ]], 6)));
  // branches into the meter boxes, with a joint sleeve on the main at each tee
  const tees = [];
  for (const cx of HOUSE_X) {
    const bx = cx - 4;
    out.push(cable(rounded([[bx, LS_Y, CZ], [bx, FRONT_Y + 3, CZ], [bx, FRONT_Y + 0.9, 2.6]], 2.4, 3), " tl-thin"));
    tees.push(bx);
  }
  out.push(D(tees.map((bx) => at([bx, LS_Y, CZ])), { size: 1.5, tone: "mid" }));
  return out.join("");
}

// ---------------------------------------------------------------- assemble
const body = [
  board(),
  station(),
  subPad(),
  stepUp(),
  droppers(GANTRIES[0], STEPUP_B, 20 + BUSH_H, [-1, 0]),
  gantryBack(GANTRIES[0]),
  gantryBack(GANTRIES[1]),
  conductor(-1),
  droppers(GANTRIES[0], STEPUP_B, 20 + BUSH_H, [1]),
  gantryTop(GANTRIES[0]),
  ...TOWERS.map(tower),
  gantryTop(GANTRIES[1]),
  conductor(0),
  conductor(1),
  stepDown(),
  droppers(GANTRIES[1], STEPDN_B, PAD_Z + 20 + BUSH_H - 1.4, [-1, 0, 1]),
  gantryFront(GANTRIES[0]),
  gantryFront(GANTRIES[1]),
  lvLink(),
  msBuilding(),
  rail(),
  carriage(),
  msCable(),
  netstation(),
  houses(),
  lsCable(),
];

const LABEL_NL =
  "Een tafelmodel van het elektriciteitsnet: een centrale met schoorsteen en een opjaagtransformator, een hoogspanningslijn op drie vakwerkmasten tussen twee portalen, een onderstation met een transformator en een middenspanningsgebouw, een middenspanningskabel naar een netstation (wijktrafo) en laagspanningskabels naar een rij van vier huizen. Een schuif voor de lijn kiest de transportspanning: 10, 50, 150 of 380 kV. Bij hetzelfde vermogen geeft een hogere spanning minder stroom, en het verlies in de lijn groeit met het kwadraat van de stroom.";
const LABEL_EN =
  "A bench model of the electricity grid: a power station with a stack and a step-up transformer, a high-voltage line on three lattice pylons between two gantries, a substation with a transformer and a medium-voltage building, a medium-voltage cable to a distribution substation and low-voltage cables to a row of four houses. A slider in front of the line picks the transmission voltage: 10, 50, 150 or 380 kV. For the same power a higher voltage needs less current, and the line loss grows with the square of the current.";

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
  --tl-hair:rgba(240,233,218,.12);--tl-accent:#5C9FAE;--tl-void:#081A1E;--tl-glow-blend:screen;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --tl-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --tl-hair:rgba(11,41,27,.14);--tl-accent:#276F81;--tl-void:#C9C0AA;--tl-glow-blend:multiply;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--tl-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 112px);min-height:200px;padding:28px 4px 80px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--tl-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 12px 14px}
.iso-plate-corner{font-family:var(--tl-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:0!important;color:var(--anatomy-muted);letter-spacing:0!important;max-width:50%}
.iso-plate-corner[data-corner="readout"]{font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.4;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.tl-line{display:block}
.tl-small{display:block;font-size:9.5px;opacity:.85}
.tl-acc{color:var(--tl-accent);font-weight:600}
.tl-mute{color:var(--anatomy-muted)}
.tl-stage{position:relative;flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;touch-action:pan-y;-webkit-tap-highlight-color:transparent;border-radius:8px}
.tl-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.tl-hit{position:absolute;left:0;top:0;width:48px;height:48px;margin:-24px 0 0 -24px;padding:0;border:0;border-radius:50%;background:transparent;cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent}
.tl-hit:focus-visible{box-shadow:0 0 0 1px var(--anatomy-muted)}
.tl-void{fill:var(--tl-void);stroke:none}
.tl-glow{fill:none;stroke:var(--tl-accent);stroke-linecap:round;stroke-linejoin:round;stroke-width:1;opacity:0;mix-blend-mode:var(--tl-glow-blend)}
.tl-core{fill:none;stroke:var(--tl-accent);stroke-linecap:round;stroke-linejoin:round;stroke-width:1.3;opacity:0}
.tl-flow{fill:none;stroke:var(--anatomy-hi);stroke-width:1;stroke-linecap:round;stroke-dasharray:1.6 7.4;opacity:.75}
.tl-cable-o{fill:none;stroke:var(--anatomy-lo);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.tl-cable-i{fill:none;stroke:var(--anatomy-shade-3);stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
.tl-thin .tl-cable-o{stroke-width:1.9}.tl-thin .tl-cable-i{stroke-width:.7}
.tl-win{fill:var(--tl-accent);stroke:none;opacity:0}
.tl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;

// ---------------------------------------------------------------- live script
const DETENT_SCREEN = DETENTS.map((x) => at([x, CAR_Y + 1, RAIL_H + 9]));
const live = `
const P = ${JSON.stringify(P)};
const P_MW = ${P_MW}, R_OHM = ${R_OHM}, LEVELS = ${JSON.stringify(LEVELS)}, START = ${START};
const DETENTS = ${JSON.stringify(DETENTS)}, DETENT_SCREEN = ${JSON.stringify(DETENT_SCREEN)};

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { dec: ".", grp: ",", loss: "loss", arrives: "arrives", over: "loss > power sent", level: ["MV", "HV", "HV", "EHV"], who: ["regional · e.g. Enexis", "regional · e.g. Stedin", "TenneT (national)", "TenneT (national)"], whoLong: ["the regional grid operator, for example Enexis", "a regional grid operator, for example Stedin or Liander", "TenneT, the national grid operator", "TenneT, the national grid operator"], at: "At", current: "current", run: "run by" }
  : { dec: ",", grp: ".", loss: "verlies", arrives: "aankomst", over: "verlies > vermogen", level: ["MS", "TS", "HS", "EHS"], who: ["regionaal · bv. Enexis", "regionaal · bv. Stedin", "TenneT (landelijk)", "TenneT (landelijk)"], whoLong: ["de regionale netbeheerder, bijvoorbeeld Enexis", "een regionale netbeheerder, bijvoorbeeld Stedin of Liander", "TenneT, de landelijke netbeheerder", "TenneT, de landelijke netbeheerder"], at: "Bij", current: "stroom", run: "beheerd door" };
const grouped = (value) => String(Math.round(value)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);
const num = (v) => (v < 1 ? v.toFixed(2) : v < 10 ? v.toFixed(1) : v.toFixed(0)).replace(".", T.dec);

const stage = document.querySelector(".tl-stage");
const svg = stage.querySelector("svg");
const car = svg.querySelector("[data-carriage]");
const plate = svg.querySelector("[data-plate]");
const glows = [...svg.querySelectorAll("[data-glow]")];
const cores = [...svg.querySelectorAll("[data-core]")];
const flows = [...svg.querySelectorAll("[data-flow-line]")];
const wins = svg.querySelector("[data-win]");
const hits = [...stage.querySelectorAll(".tl-hit")];
const lines = [...document.querySelectorAll("[data-readout] .tl-line")];
const announcer = document.querySelector(".tl-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ------------------------------------------------ the line model
const current = (kv) => (P_MW * 1e6) / (Math.sqrt(3) * kv * 1e3);
const lossMW = (kv) => (3 * current(kv) ** 2 * R_OHM) / 1e6;
// glow brightness on a log scale of the loss: 0.35 MW faint, 500 MW full
const glowOf = (mw) => clamp(0.06 + 0.94 * Math.log10(mw / 0.25) / Math.log10(500 / 0.25), 0.04, 1);

const state = { i: START, x: DETENTS[START], glow: glowOf(lossMW(LEVELS[START])), lit: Math.max(0, 1 - lossMW(LEVELS[START]) / P_MW), amps: current(LEVELS[START]), dash: 0 };

// ------------------------------------------------ drawing
function draw() {
  car.setAttribute("transform", state.x === 0 ? "" : translateAlong(P, [state.x, 0, 0]));
  const g = state.glow;
  for (const el of glows) { el.style.opacity = (0.16 + 0.5 * g) * (g > 0.05 ? 1 : g / 0.05) + ""; el.style.strokeWidth = (1.2 + 6.5 * g).toFixed(2); }
  for (const el of cores) { el.style.opacity = (0.15 + 0.85 * g).toFixed(3); el.style.strokeWidth = (0.9 + 1.2 * g).toFixed(2); }
  const off = (-state.dash).toFixed(2);
  for (const el of flows) el.style.strokeDashoffset = off;
  wins.style.opacity = (0.85 * state.lit).toFixed(3);
}
function readout() {
  const i = state.i, kv = LEVELS[i], amps = current(kv), loss = lossMW(kv), pct = (loss / P_MW) * 100;
  const l1 = '<span class="tl-acc">' + kv + " kV</span> · " + grouped(amps) + " A";
  const l2 = T.loss + " " + num(loss) + " MW · " + num(pct) + " %";
  const l3 = T.level[i] + " · " + T.who[i];
  const l4 = loss >= P_MW ? '<span class="tl-acc">' + T.over + "</span>" : T.arrives + " " + (P_MW - loss).toFixed(1).replace(".", T.dec) + " MW";
  if (lines[0].innerHTML !== l1) lines[0].innerHTML = l1;
  if (lines[1].textContent !== l2) lines[1].textContent = l2;
  if (lines[2].textContent !== l3) lines[2].textContent = l3;
  if (lines[3].innerHTML !== l4) lines[3].innerHTML = l4;
  const text = T.level[i] + " " + kv + " kV";
  if (plate.textContent !== text) plate.textContent = text;
}
function sentence(i) {
  const kv = LEVELS[i], amps = current(kv), loss = lossMW(kv);
  return kv + " kV (" + T.level[i] + "): " + T.current + " " + grouped(amps) + " A, " + T.loss + " " + num(loss) + " MW (" + num((loss / P_MW) * 100) + " %), " + T.run + " " + T.whoLong[i] + ".";
}
function describe() {
  hits.forEach((el, j) => { el.setAttribute("aria-checked", j === state.i ? "true" : "false"); el.tabIndex = j === state.i ? 0 : -1; });
}
let quietTimer = 0;
function announce() {
  clearTimeout(quietTimer);
  quietTimer = setTimeout(() => { announcer.textContent = sentence(state.i); }, 700);
}

// ------------------------------------------------ hit targets over the detents
function placeHits() {
  const m = svg.getScreenCTM();
  if (!m) return;
  const box = stage.getBoundingClientRect();
  hits.forEach((el, j) => {
    const [x, y] = DETENT_SCREEN[j];
    const p = new DOMPoint(x, y).matrixTransform(m);
    el.style.left = (p.x - box.left).toFixed(1) + "px";
    el.style.top = (p.y - box.top).toFixed(1) + "px";
  });
}

// ------------------------------------------------ idle tour
// From today's 150 kV up to 380 kV, down to 50 kV, then the absurd 10 kV.
const TOUR = [[0, START], [4, 3], [8, 1], [12, 0], [17, START]];
const TOUR_LEN = 21;
function tourAt(clock) {
  const t = clock % TOUR_LEN;
  let value = START;
  for (const [at, v] of TOUR) { if (t < at) break; value = v; }
  return value;
}

let frame = 0, last = 0, visible = false, touring = !still.matches, tourClock = 0, idleTimer = 0;
const follow = (x, target, dt, tau) => { const n = x + (target - x) * (1 - Math.exp(-dt / tau)); return Math.abs(target - n) < Math.abs(target) * 1e-4 + 1e-3 ? target : n; };
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring && !calm) { tourClock += dt; const v = tourAt(tourClock); if (v !== state.i) { state.i = v; readout(); describe(); } }
  const kv = LEVELS[state.i];
  const tx = DETENTS[state.i], tg = glowOf(lossMW(kv)), tl = Math.max(0, 1 - lossMW(kv) / P_MW), ta = current(kv);
  if (calm) { state.x = tx; state.glow = tg; state.lit = tl; state.amps = ta; }
  else {
    state.x = follow(state.x, tx, dt, 0.16);
    state.glow = follow(state.glow, tg, dt, 0.25);
    state.lit = follow(state.lit, tl, dt, 0.3);
    state.amps = follow(state.amps, ta, dt, 0.25);
    // dashes travel at a speed proportional to the current: 1 000 A is 12 units/s
    state.dash = (state.dash + state.amps * 0.012 * dt) % 9000;
  }
  draw();
  // the current keeps flowing while the figure is on screen; reduced motion draws one still frame per change
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };

function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourClock = 0; run(); } }, 40000);
}
function choose(i, focus) {
  steer();
  state.i = clamp(i, 0, LEVELS.length - 1);
  readout();
  describe();
  announce();
  if (focus) hits[state.i].focus();
  kick();
}

// ------------------------------------------------ pointer and keyboard
hits.forEach((el, j) => {
  el.addEventListener("click", () => choose(j, false));
  el.addEventListener("focus", () => { steer(); });
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  const i = state.i;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") choose(i + 1, true);
  else if (event.key === "ArrowLeft" || event.key === "ArrowDown") choose(i - 1, true);
  else if (event.key === "Home") choose(0, true);
  else if (event.key === "End") choose(LEVELS.length - 1, true);
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); } else run(); });
if ("ResizeObserver" in window) new ResizeObserver(placeHits).observe(stage);
addEventListener("resize", placeHits);
readout();
describe();
draw();
if (still.matches) tick(performance.now());
requestAnimationFrame(placeHits);
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: { title: "Spanningsniveaus en verlies", hint: "Tik een stand op de schuif", model: "vereenvoudigd model:", values: "100 MW · R 5 Ω · cos φ 1", label: LABEL_NL, group: "Transportspanning van de lijn. Pijltjes kiezen een lagere of hogere spanning, Home en End gaan naar 10 en 380 kV." },
  en: { title: "Voltage levels and loss", hint: "Tap a stop on the slider", model: "simplified model:", values: "100 MW · R 5 Ω · cos φ 1", label: LABEL_EN, group: "Transmission voltage of the line. Arrow keys pick a lower or higher voltage, Home and End go to 10 and 380 kV." },
};
const hitHtml = LEVELS.map((kv, j) => `<button type="button" class="tl-hit" role="radio" aria-checked="${j === START}" tabindex="${j === START ? 0 : -1}" aria-label="${kv} kV"></button>`).join("");
const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="tl-stage" role="radiogroup" aria-label="${STRINGS.nl.group}">${svg}${hitHtml}</div><div class="tl-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", 'data-readout><span class="tl-line"></span><span class="tl-line"></span><span class="tl-line"></span><span class="tl-line"></span></span>')
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><span class="tl-small" data-model>${STRINGS.nl.model}</span><span class="tl-small" data-values>${STRINGS.nl.values}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;var h=c("hint");h.querySelector("[data-hint]").textContent=s.hint;h.querySelector("[data-model]").textContent=s.model;h.querySelector("[data-values]").textContent=s.values;
var st=document.querySelector(".tl-stage");st.setAttribute("aria-label",s.group);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
const span = Math.hypot(DETENT_SCREEN[1][0] - DETENT_SCREEN[0][0], DETENT_SCREEN[1][1] - DETENT_SCREEN[0][1]);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${Math.round(parts)} parts (${solids} solids) · viewBox ${WIDTH}×${HEIGHT} · detent gap ${fmt1(span)} vb (${fmt1((span * 352) / WIDTH)} px at 360)`);
