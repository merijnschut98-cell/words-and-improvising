// v17: the phone layout shared by the subject maps: the same zones, places and road order on a narrow
// 300-unit sheet, so the labels can be bigger. Used by the app when the card is
// narrower than 460 px (src/ui/subjectmap.js); the films keep the wide map. Zones
// keep their order; the places of a zone keep theirs, row by row from the left.
// Rows hold three short titles or two long ones; a title wraps to three lines at
// most. `font` is the label size in view units: at 390 px (card 324 px) that is
// 11.4 px, at 320 px (card 254 px) 9.0 px. Objects are drawn at about half size,
// so a row of 54 units is 45.7 px at 320: the 44 px a tap needs, and a margin.
const PW = 300;
const COLS = {
  3: { w: 89, xs: [10, 105, 200] },
  2: { w: 137, xs: [10, 153] },
  1: { w: 137, xs: [81] },
};
const GAP = 3;
const HEAD = 16; // the zone's label sits above the first row
const rrect = (x, y, w, h, r = 12) => `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

// `cols` replaces column sets for one map: Engineering uses three places of 90
// units (15 characters a line instead of 14), so its long Dutch words fit rows
// of three; Projects keeps COLS as it is.
export function phoneLayout(sections, { cols = {} } = {}) {
  const set = { ...COLS, ...cols };
  const zones = [];
  const places = [];
  let y = 3;
  for (const s of sections) {
    let ry = y + HEAD;
    for (const row of s.rows) {
      const c = set[row.cols];
      row.items.forEach(([module, draw], i) => places.push({ module, x: c.xs[i], y: ry, w: c.w, h: row.h, draw }));
      ry += row.h + GAP;
    }
    const h = ry - GAP + 4 - y;
    zones.push({ field: s.field, label: s.label, path: rrect(4, y, PW - 8, h) });
    y += h + 3;
  }
  return { view: { w: PW, h: y }, font: 10.6, lineHeight: 12, labelTop: 36, scale: 0.55, floor: 21, zoneLabel: [10, 12], arrow: 24, zones, places };
}

// The wide layout of a map whose zones are stacked bands, one band per field,
// each holding rows of places (v17, Engineering). Coordinates are view units on
// a 640-wide sheet like the Projects map: a band is 624 wide, a place 116 (five
// to a row), 148 (four) or 200 (three or fewer, centred) wide, with 8 units
// between them. A section is { field, label, rows: [{ h, items: [[module, draw], ...] }] }.
export function wideLayout(subject, sections) {
  const W = 640;
  const IN = 12;
  const GAP_X = 8;
  const GAP_Y = 6;
  const MAX_W = 200;
  const TOP = 26; // the zone's label sits above the first row
  const zones = [];
  const places = [];
  let y = 4;
  for (const s of sections) {
    let ry = y + TOP;
    for (const row of s.rows) {
      const n = row.items.length;
      const w = Math.min((W - 2 * IN - GAP_X * (n - 1)) / n, MAX_W);
      const x0 = (W - (n * w + GAP_X * (n - 1))) / 2; // a short row is centred
      row.items.forEach(([module, draw], i) => places.push({ module, x: x0 + i * (w + GAP_X), y: ry, w, h: row.h, draw }));
      ry += row.h + GAP_Y;
    }
    const h = ry - GAP_Y + 4 - y;
    zones.push({ field: s.field, label: s.label, path: rrect(8, y, W - 16, h, 14) });
    y += h + GAP_Y;
  }
  return { subject, view: { w: W, h: y - GAP_Y + 4 }, zones, places };
}

