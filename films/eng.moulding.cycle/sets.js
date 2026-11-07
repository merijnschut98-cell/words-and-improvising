// The three sets drawn in the page at load (the press is drawn by the build):
// the section with the temperature control unit, the mould plates and the
// coins. Plain script with no imports: the build runs it with the kit module
// (for its checks), the page with the inlined kit's functions. Drawing them in
// the page keeps the file small; they use the kit only, so no lathe module is
// shipped.
//   K: the kit (iso-kit), C: the world constants, P: the projection.
// eslint-disable-next-line no-unused-vars
function buildSets(K, C, P) {
  const at = (p) => K.iso(p, P);
  const f2 = (v) => (Math.round(v * 100) / 100).toString();
  const L = (d, style) => K.lineSvg(d, style);
  const Dt = (points, style) => K.dotsSvg(points, style);
  const S = (paths, style = {}) => K.solidSvg(paths, { tone: 'mid', ...style });
  const slab = (plan, z0, z1, style = {}, bevel = 0.4, steps = 3) => S(K.slabOf({ r: 0.6, ...plan }, z0, z1 - z0, P, steps, bevel), style);
  const cyl = (x, y, r, z0, z1, style = {}, steps = 20, bevel = 0) => S(K.cylinder(x, y, r, z0, z1 - z0, P, steps, bevel), style);
  const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
  const planeOf = (y) => K.sideMatrix([0, y], 0, P, 'left');
  const flatRect = (x0, z0, x1, z1, r, steps = 6) => K.pathOf(K.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
  let clips = 0;
  // A recess in the face y = const (a display window): inner walls shaded by
  // facing, a back plane holding `back`, clipped to the opening.
  function recess({ x0, x1, z0, z1, r, depth }, y, back = '') {
    const id = `fp-sclip-${clips++}`;
    const ringPts = K.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 6);
    const cx = (x0 + x1) / 2;
    const cz = (z0 + z1) / 2;
    const { sinA } = K.cameraOf(P);
    const tops = [];
    const sides = [[], [], [], []];
    ringPts.forEach(([ax, az], index) => {
      const [bx, bz] = ringPts[(index + 1) % ringPts.length];
      const length = Math.hypot(bx - ax, bz - az) || 1;
      let [nx, nz] = [(bz - az) / length, -(bx - ax) / length];
      if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) [nx, nz] = [-nx, -nz];
      if (nx <= 0 && nz <= 0) return;
      const quad = K.pathOf([at([ax, y, az]), at([bx, y, bz]), at([bx, y - depth, bz]), at([ax, y - depth, az])], true);
      if (nz >= nx) tops.push(quad);
      else sides[Math.min(3, Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4)))].push(quad);
    });
    const shape = flatRect(x0, z0, x1, z1, r);
    return `<clipPath id="${id}"><path transform="${planeOf(y)}" d="${shape}"/></clipPath><g clip-path="url(#${id})"><path class="iso-top" d="${tops.join('')}"/>`
      + sides.map((d, shade) => (d.length ? `<path class="iso-shade" data-shade="${shade}" d="${d.join('')}"/>` : '')).join('')
      + `<g transform="${planeOf(y - depth)}"><path class="mc-glass" d="${shape}"/>${back}<path class="iso-line" data-tone="faint" d="${shape}"/></g></g>`
      + `<g transform="${planeOf(y)}"><path class="iso-line" data-tone="lo" d="${shape}"/></g>`;
  }
  // a block on the face x = const (fittings, nipples): a short box sticking out along +x
  const xBox = (x0, x1, yc, zc, half, style = {}) => {
    // a box from x0 to x1, square half-width `half` about (yc, zc)
    return S(K.slabOf({ x: x0, y: yc - half, w: x1 - x0, d: 2 * half, r: Math.min(0.4, half / 2) }, zc - half, 2 * half, P, 2, 0.2), style);
  };

  // ============================================================ the section
  const { MM, BX, BZ, BD, CHAN, CHAN_R } = C;
  const BLOCK = { x: -BX, y: -BD, w: 2 * BX, d: BD, r: 0.4 };
  const pl = (x, z) => `${f2(x)} ${f2(-z)}`;
  const section = (() => {
    const out = [];
    out.push(`<path class="iso-halo" d="${K.haloOf(K.insetPlan(BLOCK, -3), -BZ - 3, 2, P)}"/>`);
    // two parallels under the block
    for (const x of [-BX + 10, BX - 22]) out.push(slab({ x, y: -BD + 4, w: 12, d: BD - 8 }, -BZ - 4, -BZ, { tone: 'lo' }, 0.3, 2));
    const half = (z0, z1, extra) => S(K.slabOf(BLOCK, z0, z1 - z0, P, 2, 0.5), { inner: L(K.sideSeam(BLOCK, z0 + 3, P, 2), { tone: 'faint' }) + extra });
    // the core half, with a label plate on its right face
    const rx = BX;
    const plate = [[rx, -BD + 22, -10], [rx, -BD + 42, -10], [rx, -BD + 42, -20], [rx, -BD + 22, -20]];
    const lines = [-12, -14.4, -16.8].map((z, i) => K.segment([rx, -BD + 24, z], [rx, -BD + 24 + [15, 10, 13][i], z], P)).join('');
    const bolts = [[rx, -BD + 5, -BZ + 4], [rx, -5, -BZ + 4], [rx, -BD + 5, -4], [rx, -5, -4]];
    out.push(half(-BZ, 0, `<path class="mc-card" d="${K.pathOf(plate.map(at), true)}"/>` + L(lines, { tone: 'lo', free: true }) + Dt(bolts.map(at), { size: 0.5 })));
    // the cavity half: socket screws and two guide bushings on top
    const top = BZ;
    const screws = [[-BX + 6, -BD + 6], [BX - 6, -BD + 6], [-BX + 6, -6], [BX - 6, -6]];
    const topBits = Dt(screws.map(([x, y]) => at([x, y, top])), { size: 0.55, tone: 'hi' })
      + L(screws.map(([x, y]) => K.ring(x, y, 2.6, top, P, 20)).join(''), { tone: 'lo' })
      + L([[-BX + 18, -BD / 2], [BX - 18, -BD / 2]].map(([x, y]) => K.ring(x, y, 4.2, top, P, 24) + K.ring(x, y, 2.4, top, P, 20)).join(''), { tone: 'lo' })
      + Dt([[rx, -BD + 5, 4], [rx, -5, 4], [rx, -BD + 5, BZ - 4], [rx, -5, BZ - 4]].map(at), { size: 0.5 });
    out.push(half(0, BZ, topBits));
    // a lifting eyebolt on top: collar, shank and a ring standing in the plane x = 0
    out.push(cyl(0, -BD / 2, 4, top, top + 1.6, {}, 20, 0.3) + cyl(0, -BD / 2, 1.8, top + 1.6, top + 3.4, { tone: 'mid' }, 14));
    // (the plane x = 0 seen from +x: u runs along −y, v down)
    const eye = `M${f2(BD / 2 - 4.6)} ${f2(-(top + 8))}a4.6 4.6 0 1 0 9.2 0a4.6 4.6 0 1 0 -9.2 0Z`;
    out.push(`<g transform="${K.sideMatrix([0, 0], 0, P, 'right')}"><path class="fp-eye" d="${eye}"/></g>`);
    // the cut face: hatched steel, the cavity with the part, the channels
    const rect = `M${pl(-BX, -BZ)}H${f2(BX)}V${f2(-BZ)}H${f2(-BX)}Z`;
    const hatch = [];
    for (let c = -BX - 2 * BZ; c < BX + 2 * BZ; c += 5) hatch.push(`M${pl(c, -BZ)}L${pl(c + 2 * BZ, BZ)}`);
    const holes = CHAN.map(([x, z]) => `M${pl(x + CHAN_R, z)}A${f2(CHAN_R)} ${f2(CHAN_R)} 0 1 0 ${pl(x - CHAN_R, z)}A${f2(CHAN_R)} ${f2(CHAN_R)} 0 1 0 ${pl(x + CHAN_R, z)}Z`).join('');
    out.push(`<g transform="${planeOf(0)}">`
      + g('steel', '', ' data-cue="mouldtemp"')
      + g('cav', '', ' data-cue="cavity"')
      + `<g data-cue="channels"><path class="fp-water" d="${holes}"/>${g('swirl', '')}<path class="fp-mark" d="${holes}"/></g>`
      + g('heat', '')
      + g('dims', '', ' data-cue="boss"')
      + `<path class="iso-line" data-tone="lo" d="M${pl(-BX, 0)}H${f2(BX)}"/>`
      + `<path class="iso-line" data-tone="mid" d="${rect}"/>`
      + '</g>');
    // a water coupling on the right face of each half: hex body and nipple
    const coup = (z) => xBox(BX, BX + 2.4, -BD + 14, z, 2.8) + xBox(BX + 2.4, BX + 6.6, -BD + 14, z, 1.6, { tone: 'hi', crease: 'lo' });
    out.push(g('coupL', coup(-4.5 * MM), ' data-cue="channels"'), g('coupU', coup(4.5 * MM), ' data-cue="channels"'));
    return { svg: out.join(''), SEC: { rect, hatch: hatch.join(''), holes } };
  })();

  // ============================================================ the temperature control unit
  const { TCU, TCU_Z } = C;
  const tcu = (() => {
    const out = [];
    const [z0, z1] = TCU_Z;
    out.push(`<path class="iso-halo" d="${K.haloOf(K.insetPlan(TCU, -2), z0 - 6, 2, P)}"/>`);
    // four castors: plate, fork, wheel
    for (const [x, y] of K.corners(TCU, 5)) {
      out.push(slab({ x: x - 2.4, y: y - 1.2, w: 4.8, d: 2.4, r: 1.1 }, z0 - 6, z0 - 1.4, { tone: 'lo' }, 0.2, 2));
      out.push(cyl(x, y, 2.4, z0 - 1.4, z0, { tone: 'mid', crease: 'none' }, 12));
    }
    const fy = TCU.y + TCU.d;
    const slots = [];
    for (const z of [z0 + 5, z0 + 8, z0 + 11]) slots.push(K.pathOf(K.roundedPlan({ x: TCU.x + 8, y: z, w: 30, d: 1.3, r: 0.6 }, 3).map(([u, w]) => at([u, fy, w])), true));
    const disp = { x0: TCU.x + 6, x1: TCU.x + 30, z0: z1 - 16, z1: z1 - 5, r: 0.8, depth: 0.7 };
    const text = K.faceTextSvg(`${planeOf(fy - 0.7)} translate(${f2(disp.x0 + 12)} ${f2(-(disp.z0 + 2.6))})`, '80 °C', { size: 6.2, tone: 'hi', anchor: 'middle' });
    const label = [[TCU.x + 6, fy, z0 + 22], [TCU.x + 22, fy, z0 + 22], [TCU.x + 22, fy, z0 + 16], [TCU.x + 6, fy, z0 + 16]];
    // a dial gauge on the front: a flat face in the plane y = fy
    const gx = TCU.x + 38;
    const gz = z1 - 10;
    const gauge = `<g transform="${planeOf(fy)}"><circle class="mc-card" cx="${gx}" cy="${-gz}" r="5"/><circle class="fp-mark" cx="${gx}" cy="${-gz}" r="3.6"/><path class="fp-mark" d="M${gx} ${-gz}l2.6 -1.6"/><circle class="fp-ink" cx="${gx}" cy="${-gz}" r=".7"/></g>`;
    const extra = `<g data-cue="mouldtemp">${recess(disp, fy, text)}</g>`
      + `<path class="mc-card" d="${K.pathOf(label.map(at), true)}"/>`
      + L([20.6, 18.8, 17.2].map((dz, i) => K.segment([TCU.x + 7.4, fy, z0 + dz], [TCU.x + 7.4 + [12, 8, 10][i], fy, z0 + dz], P)).join(''), { tone: 'lo', free: true })
      + Dt([[TCU.x + 2, fy, z0 + 2], [TCU.x + TCU.w - 2, fy, z0 + 2], [TCU.x + 2, fy, z1 - 2], [TCU.x + TCU.w - 2, fy, z1 - 2]].map(at), { size: 0.45 })
      + gauge;
    out.push(`<g data-cue="tcu">${S(K.slabOf(TCU, z0, z1 - z0, P, 3, 0.8), { inner: L(slots.join('') + K.sideSeam(TCU, z0 + 3, P, 3), { tone: 'lo' }) }) + extra}`);
    for (const x of [TCU.x + 34, TCU.x + 40]) out.push(slab({ x: x - 1.8, y: fy, w: 3.6, d: 1 }, z0 + 16, z0 + 19, { tone: 'mid' }, 0.2, 1));
    // a carrying handle: two posts and a bar
    const hy = TCU.y + TCU.d / 2;
    for (const x of [TCU.x + 8, TCU.x + 38]) out.push(cyl(x, hy - 10, 1.6, z1, z1 + 8, {}, 14));
    out.push(slab({ x: TCU.x + 6, y: hy - 11.8, w: 34, d: 3.6, r: 1.6 }, z1 + 8, z1 + 11, { tone: 'hi', crease: 'lo' }, 0.3, 4));
    // the two water nipples the hoses land on
    out.push(cyl(TCU.x + 18, TCU.y + 12, 2.6, z1, z1 + 3, {}, 16, 0.3) + cyl(TCU.x + 18, TCU.y + 30, 2.6, z1, z1 + 3, {}, 16, 0.3));
    out.push('</g>');
    return out.join('');
  })();

  // ============================================================ the mould plates
  const { PZ, CAV4, CAV8, RUN4, RUN8, PLATE4, PLATE8, FAM, POCKET_R } = C;
  const runnerBand = (paths, w = 2.4) => paths.map((pts) => {
    const segs = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [a, b] = [pts[i], pts[i + 1]];
      const x0 = Math.min(a[0], b[0]) - w;
      const x1 = Math.max(a[0], b[0]) + w;
      const y0 = Math.min(a[1], b[1]) - w;
      const y1 = Math.max(a[1], b[1]) + w;
      segs.push(K.onTop([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], PZ, P, true));
    }
    return segs.join('');
  }).join('');
  function plateBody(plan) {
    const out = [];
    out.push(`<path class="iso-halo" d="${K.haloOf(K.insetPlan(plan, -3), -40, 2, P)}"/>`);
    out.push(slab(K.insetPlan(plan, 6), -40, -26, { tone: 'lo' }, 0.4, 3));
    for (const x of [plan.x + 10, plan.x + plan.w - 22]) out.push(slab({ x, y: plan.y + 8, w: 12, d: plan.d - 16 }, -26, -18, { tone: 'mid' }, 0.3, 2));
    const screws = K.corners(plan, 6);
    const extra = Dt(screws.map(([x, y]) => at([x, y, PZ])), { size: 0.55, tone: 'hi' }) + L(screws.map(([x, y]) => K.ring(x, y, 2.4, PZ, P, 18)).join(''), { tone: 'lo' });
    out.push(S(K.slabOf(plan, -18, 18 + PZ, P, 3, 0.8), { inner: L(K.sideSeam(plan, -14, P, 3), { tone: 'faint' }) }) + extra);
    return out.join('');
  }
  function pockets(list, runner) {
    const top = list.map((p) => (!p.w ? K.ring(p.x, p.y, p.r, PZ, P, 40) : K.planOutline(p, PZ, P, 4))).join('');
    const inner = list.map((p) => (!p.w ? K.ring(p.x, p.y, p.r - 5, PZ, P, 32) : K.planOutline(K.insetPlan(p, 6), PZ, P, 4))).join('');
    return `<path class="mc-well" d="${top}${runner}"/>` + L(top + runner, { tone: 'lo' }) + L(inner, { tone: 'faint' }) + Dt([at([0, 0, PZ])], { size: 1.1, tone: 'hi' });
  }
  // guide pins at the corners, back to front: shank and a chamfered tip
  function pins(plan) {
    return K.corners(plan, 13).sort((a, b) => K.depthOf([a[0], a[1], 0], P) - K.depthOf([b[0], b[1], 0], P))
      .map(([x, y]) => cyl(x, y, 4.4, PZ, PZ + 15, { tone: 'hi', crease: 'lo' }, 24) + cyl(x, y, 3.4, PZ + 15, PZ + 17.4, { tone: 'hi', crease: 'lo' }, 20, 0.6)).join('');
  }
  const pk = (list) => list.map(([x, y]) => ({ x, y, r: POCKET_R }));
  const plates = [
    g('plate4', plateBody(PLATE4) + pockets(pk(CAV4), runnerBand(RUN4)) + pins(PLATE4)),
    g('plate8', plateBody(PLATE8) + g('pk8', pockets(pk(CAV8), runnerBand(RUN8)) + `<g data-cue="balance">${L(runnerBand(RUN8), { tone: 'lo', className: 'fp-runline' })}</g>`)
      + g('pkF', pockets([FAM.lid, FAM.base], runnerBand([[[0, 0], [FAM.lid.x + FAM.lid.w, 0]], [[0, 0], [FAM.base.x, 0]]]))) + pins(PLATE8)),
    g('melt', '', ' data-cue="balance"'),
    g('famcue', '', ' data-cue="family"'),
    g('mani', '', ' data-cue="valve"'),
  ].join('');

  // ============================================================ the coins
  const { COINS_BASE } = C;
  const coins = (() => {
    const out = [];
    out.push(`<path class="iso-halo" d="${K.haloOf(K.insetPlan(COINS_BASE, -3), -8, 2, P)}"/>`);
    out.push(S(K.slabOf(COINS_BASE, -8, 8, P, 3, 0.8), { inner: L(K.sideSeam(COINS_BASE, -4, P, 3), { tone: 'faint' }) })
      + ((t) => L(t.minor, { tone: 'lo' }) + L(t.major, { tone: 'mid' }))(K.topTicks(COINS_BASE.x + 6, COINS_BASE.x + COINS_BASE.w - 6, 4, 5, COINS_BASE.y + COINS_BASE.d, 0, [-1.6, -3], P)));
    // a scale with the cap on its pan, at the left
    const SC = { x: -88, y: -18, w: 36, d: 36, r: 2 };
    out.push(slab(SC, 0, 7, {}, 0.5, 3));
    const fy = SC.y + SC.d;
    const disp = { x0: SC.x + 6, x1: SC.x + 30, z0: 1.4, z1: 5.6, r: 0.5, depth: 0.5 };
    out.push(recess(disp, fy, K.faceTextSvg(`${planeOf(fy - 0.5)} translate(${f2(SC.x + 18)} ${f2(-2.2)})`, '40 g', { size: 3.6, tone: 'hi', anchor: 'middle' })));
    const cx = SC.x + 18;
    const cy = SC.y + 18;
    out.push(cyl(cx, cy, 4, 7, 9, {}, 20) + cyl(cx, cy, 15, 9, 10.6, {}, 40, 0.4));
    // the cap: a ribbed cup, open side down, with a smooth top
    out.push(cyl(cx, cy, 9, 10.6, 16.6, { tone: 'hi', crease: 'lo' }, 40) + L(K.knurl(cx, cy, 9, 11.4, 15.8, 36, P), { tone: 'lo' }) + L(K.ring(cx, cy, 6.4, 16.6, P, 32), { tone: 'lo' }));
    out.push(g('cMat', ''), g('cScrap', '', ' data-cue="scrap"'), g('cMach', '', ' data-cue="rate"'), g('cMould', '', ' data-cue="amort"'));
    return out.join('');
  })();

  return { section: section.svg, SEC: section.SEC, tcu, plates, coins };
}
