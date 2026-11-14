// v17: the Projects map. The project is a road from left to right with five
// stations (the lifecycle field); the office (portfolio) sits above it, the
// team room (people) below it and the workshop (IT) at the bottom. Plain data:
// the drawer is src/ui/subjectmap.js, the rules are checkMap in validate.js.
// Coordinates are view units (640 x 520); every place is at least 44 px wide
// and high at 390 px (72.2 units). `draw` names an object mapSvg knows.
const WIDE = {
  subject: 'pm',
  view: { w: 640, h: 520 },
  zones: [
    { field: 'pm.field.portfolio', label: { en: 'Portfolio and consulting', nl: 'Portfolio en advies' },
      path: 'M94 4 H546 Q560 4 560 18 V97 Q560 111 546 111 H94 Q80 111 80 97 V18 Q80 4 94 4 Z' },
    { field: 'pm.field.lifecycle', label: { en: 'A project from start to finish', nl: 'Een project van begin tot eind' },
      path: 'M22 117 H618 Q632 117 632 131 V212 Q632 226 618 226 H22 Q8 226 8 212 V131 Q8 117 22 117 Z' },
    { field: 'pm.field.people', label: { en: 'People and influence', nl: 'Mensen en invloed' },
      path: 'M22 232 H618 Q632 232 632 246 V372 Q632 386 618 386 H22 Q8 386 8 372 V246 Q8 232 22 232 Z' },
    { field: 'pm.field.it', label: { en: 'IT and agile', nl: 'IT en agile' },
      path: 'M22 392 H618 Q632 392 632 406 V497 Q632 511 618 511 H22 Q8 511 8 497 V406 Q8 392 22 392 Z' },
  ],
  places: [
    { module: 'pm.portfolio', x: 100, y: 24, w: 220, h: 79, draw: 'board' },
    { module: 'pm.consult', x: 320, y: 24, w: 220, h: 79, draw: 'contract' },
    { module: 'pm.intake', x: 12, y: 143, w: 116, h: 79, draw: 'gate' },
    { module: 'pm.plan', x: 136, y: 143, w: 116, h: 79, draw: 'board' },
    { module: 'pm.run', x: 260, y: 143, w: 116, h: 79, draw: 'dashboard' },
    { module: 'pm.land', x: 384, y: 143, w: 116, h: 79, draw: 'road-stop' },
    { module: 'pm.close', x: 508, y: 143, w: 116, h: 79, draw: 'contract' },
    { module: 'pm.stuck', x: 12, y: 252, w: 116, h: 130, draw: 'road-stop' },
    { module: 'pm.lead', x: 136, y: 252, w: 116, h: 130, draw: 'whiteboard' },
    { module: 'pm.negotiate', x: 260, y: 252, w: 116, h: 130, draw: 'handshake' },
    { module: 'pm.outside', x: 384, y: 252, w: 116, h: 130, draw: 'desk' },
    { module: 'pm.perform', x: 508, y: 252, w: 116, h: 130, draw: 'dashboard' },
    { module: 'pm.agile', x: 12, y: 412, w: 148, h: 96, draw: 'whiteboard' },
    { module: 'pm.scaled', x: 168, y: 412, w: 148, h: 96, draw: 'board' },
    { module: 'pm.devops', x: 324, y: 412, w: 148, h: 96, draw: 'server' },
    { module: 'pm.itproject', x: 480, y: 412, w: 148, h: 96, draw: 'desk' },
  ],
  routes: [['pm.intake', 'pm.plan'], ['pm.plan', 'pm.run'], ['pm.run', 'pm.land'], ['pm.land', 'pm.close']],
};

// The phone layout (v273): the same zones, places and road order on a narrow
// 300-unit sheet, so the labels can be bigger. Used by the app when the card is
// narrower than 460 px (src/ui/subjectmap.js); the films keep the wide map. Zones
// keep their order; the places of a zone keep theirs, row by row from the left.
// Rows hold three short titles or two long ones; a title wraps to three lines at
// most. `font` is the label size in view units: at 390 px (card 325 px) that is
// 11.5 px, at 320 px (card 256 px) 9.0 px. Objects are drawn at half size, so a
// row is little more than the 44 px a tap needs.
const PW = 300;
const COLS = {
  3: { w: 89, xs: [10, 105, 200] },
  2: { w: 137, xs: [10, 153] },
  1: { w: 137, xs: [81] },
};
const GAP = 3;
const HEAD = 16; // the zone's label sits above the first row
const rrect = (x, y, w, h, r = 12) => `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

function phoneLayout(sections) {
  const zones = [];
  const places = [];
  let y = 3;
  for (const s of sections) {
    let ry = y + HEAD;
    for (const row of s.rows) {
      const c = COLS[row.cols];
      row.items.forEach(([module, draw], i) => places.push({ module, x: c.xs[i], y: ry, w: c.w, h: row.h, draw }));
      ry += row.h + GAP;
    }
    const h = ry - GAP + 4 - y;
    zones.push({ field: s.field, label: s.label, path: rrect(4, y, PW - 8, h) });
    y += h + 3;
  }
  return { view: { w: PW, h: y - 3 + 3 }, font: 10.6, lineHeight: 12, labelTop: 36, scale: 0.55, floor: 21, zoneLabel: [10, 12], arrow: 24, zones, places };
}

const PHONE = phoneLayout([
  { field: 'pm.field.portfolio', label: WIDE.zones[0].label, rows: [
    { cols: 2, h: 53, items: [['pm.portfolio', 'board'], ['pm.consult', 'contract']] }] },
  { field: 'pm.field.lifecycle', label: WIDE.zones[1].label, rows: [
    { cols: 3, h: 52, items: [['pm.intake', 'gate'], ['pm.plan', 'board'], ['pm.run', 'dashboard']] },
    { cols: 3, h: 52, items: [['pm.land', 'road-stop'], ['pm.close', 'contract']] }] },
  { field: 'pm.field.people', label: WIDE.zones[2].label, rows: [
    { cols: 3, h: 65, items: [['pm.stuck', 'road-stop'], ['pm.lead', 'whiteboard'], ['pm.negotiate', 'handshake']] },
    { cols: 2, h: 53, items: [['pm.outside', 'desk'], ['pm.perform', 'dashboard']] }] },
  { field: 'pm.field.it', label: WIDE.zones[3].label, rows: [
    { cols: 2, h: 53, items: [['pm.agile', 'whiteboard'], ['pm.scaled', 'board']] },
    { cols: 2, h: 53, items: [['pm.devops', 'server'], ['pm.itproject', 'desk']] }] },
]);
// Each row of the lifecycle is its own stretch of road, ended by an arrow; the
// second row carries on from the first, the way text does.
PHONE.routes = [['pm.intake', 'pm.plan'], ['pm.plan', 'pm.run'], ['pm.land', 'pm.close']];

export default { ...WIDE, phone: PHONE };
