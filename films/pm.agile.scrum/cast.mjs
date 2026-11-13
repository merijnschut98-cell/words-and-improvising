// Dev tool, not shipped. The people of the film "Een sprint van twee weken / A
// two-week sprint" (pm.agile.scrum): a Scrum Team as simple flat-iso figures,
// in the style of the shared pm cast (films/_pm/world.mjs, read-only), whose
// person() only knows its four recurring characters. Same build as there:
// shoes, legs, a torso with a seam, arms, a neck and a head with hair; only the
// clothes and what they hold differ. Each figure is a cue group (data-cue =
// key); the three Developers share the key "devs", so one beat lights all three.
//
//   import { scrumPerson } from './cast.mjs';
//   scrumPerson(w, k, G, P, { x, y, key: 'po', look: 'po', along: 'y' })
//
// Looks: po, the Product Owner, in a light jumper with a tablet (the backlog he
// orders); sm, the Scrum Master, in a dark jacket with light hair; dev and dev2,
// Developers in mid-tone jackets, one with a laptop under the arm.
const LOOKS = {
  po: { jacket: 'hi', legs: 'mid', hair: 'mid', prop: 'tablet' },
  sm: { jacket: 'lo', legs: 'mid', hair: 'hi', prop: null },
  dev: { jacket: 'mid', legs: 'lo', hair: 'lo', prop: null },
  dev2: { jacket: 'mid', legs: 'mid', hair: 'hi', prop: 'laptop' },
};

export function scrumPerson(w, k, G, P, { x, y, key, look, along = 'x' }) {
  const L = LOOKS[look];
  if (!L) throw new Error(`cast: unknown look ${look}`);
  const S = (paths, style) => k.solidSvg(paths, style);
  const ax = along === 'x';
  const off = (s) => (ax ? [x + s, y] : [x, y + s]);
  const out = [w.halo({ x: x - 16, y: y - 12, w: 32, d: 24, r: 10 })];
  for (const s of [-7, 7]) {
    const [px, py] = off(s);
    out.push(w.box(ax ? { x: px - 5, y: py - 5, w: 10, d: 14, r: 2.4 } : { x: px - 5, y: py - 5, w: 14, d: 10, r: 2.4 }, 0, 4.5, { tone: 'lo' }, { steps: 2 }));
    out.push(w.post(px, py, 6.4, 4, 84, { tone: L.legs }, 14));
  }
  const half = ax ? { x: 16, y: 10 } : { x: 10, y: 16 };
  const torso = { x: x - half.x, y: y - half.y, w: 2 * half.x, d: 2 * half.y, r: 5.5 };
  const arm = (s) => { const [px, py] = off(s); return w.box({ x: px - 4, y: py - 4, w: 8, d: 8, r: 3 }, 90, 140, { tone: L.jacket }, { steps: 2 }); };
  out.push(arm(-20.5));
  out.push(w.box(torso, 82, 144, { tone: L.jacket }, { steps: 4, bevel: 0.6, inner: k.lineSvg(k.sideSeam(torso, 136, P, 4), { tone: 'lo' }) }));
  out.push(arm(20.5));
  // what they hold at the chest: a tablet (upright) or a closed laptop (flat)
  const [cx, cy] = ax ? [x, y + half.y + 1] : [x + half.x + 1, y];
  if (L.prop === 'tablet') out.push(w.box(ax ? { x: cx - 10, y: cy, w: 20, d: 1.4, r: 0.6 } : { x: cx, y: cy - 10, w: 1.4, d: 20, r: 0.6 }, 104, 128, { tone: 'lo' }, { steps: 2 }));
  if (L.prop === 'laptop') out.push(w.box(ax ? { x: cx - 13, y: cy, w: 26, d: 2.4, r: 0.8 } : { x: cx, y: cy - 13, w: 2.4, d: 26, r: 0.8 }, 96, 114, { tone: 'hi' }, { steps: 2 }));
  out.push(w.post(x, y, 4.4, 144, 150, { tone: 'hi' }, 12));
  out.push(S(G.sphereOf([x - 1.4, y - 1.4, 163], 12, P, { steps: 28 }), { tone: L.hair, crease: 'none' }));
  out.push(S(G.sphereOf([x + 0.5, y + 0.5, 160.5], 11.4, P, { steps: 28 }), { tone: 'hi', crease: 'none' }));
  return `<g data-cue="${key}">${out.join('')}</g>`;
}
