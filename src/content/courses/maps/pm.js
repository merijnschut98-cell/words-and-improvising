// v17: the Projects map. The project is a road from left to right with six
// stations (the lifecycle field); the office (portfolio) sits above it, the
// team room (people) below it and the workshop (IT) at the bottom. Plain data:
// the drawer is src/ui/subjectmap.js, the rules are checkMap in validate.js.
// Coordinates are view units (640 x 520); every place is at least 44 px wide
// and high at 390 px (72.2 units). `draw` names an object mapSvg knows.
const WIDE = {
  subject: 'pm',
  view: { w: 640, h: 543 },
  zones: [
    { field: 'pm.field.portfolio', label: { en: 'Portfolio and consulting', nl: 'Portfolio en advies' },
      path: 'M94 4 H546 Q560 4 560 18 V97 Q560 111 546 111 H94 Q80 111 80 97 V18 Q80 4 94 4 Z' },
    { field: 'pm.field.lifecycle', label: { en: 'A project from start to finish', nl: 'Een project van begin tot eind' },
      path: 'M22 117 H618 Q632 117 632 131 V235 Q632 249 618 249 H22 Q8 249 8 235 V131 Q8 117 22 117 Z' },
    { field: 'pm.field.people', label: { en: 'People and influence', nl: 'Mensen en invloed' },
      path: 'M22 255 H618 Q632 255 632 269 V395 Q632 409 618 409 H22 Q8 409 8 395 V269 Q8 255 22 255 Z' },
    { field: 'pm.field.it', label: { en: 'IT and agile', nl: 'IT en agile' },
      path: 'M22 415 H618 Q632 415 632 429 V520 Q632 534 618 534 H22 Q8 534 8 520 V429 Q8 415 22 415 Z' },
  ],
  places: [
    { module: 'pm.portfolio', x: 100, y: 24, w: 220, h: 79, draw: 'board' },
    { module: 'pm.consult', x: 320, y: 24, w: 220, h: 79, draw: 'contract' },
    { module: 'pm.approach', x: 10, y: 143, w: 101, h: 102, draw: 'road-stop' },
    { module: 'pm.intake', x: 114, y: 143, w: 101, h: 102, draw: 'gate' },
    { module: 'pm.plan', x: 218, y: 143, w: 101, h: 102, draw: 'board' },
    { module: 'pm.run', x: 322, y: 143, w: 101, h: 102, draw: 'dashboard' },
    { module: 'pm.land', x: 426, y: 143, w: 101, h: 102, draw: 'road-stop' },
    { module: 'pm.close', x: 530, y: 143, w: 101, h: 102, draw: 'contract' },
    { module: 'pm.stuck', x: 12, y: 275, w: 116, h: 130, draw: 'road-stop' },
    { module: 'pm.lead', x: 136, y: 275, w: 116, h: 130, draw: 'whiteboard' },
    { module: 'pm.negotiate', x: 260, y: 275, w: 116, h: 130, draw: 'handshake' },
    { module: 'pm.outside', x: 384, y: 275, w: 116, h: 130, draw: 'desk' },
    { module: 'pm.perform', x: 508, y: 275, w: 116, h: 130, draw: 'dashboard' },
    { module: 'pm.agile', x: 12, y: 435, w: 148, h: 96, draw: 'whiteboard' },
    { module: 'pm.scaled', x: 168, y: 435, w: 148, h: 96, draw: 'board' },
    { module: 'pm.devops', x: 324, y: 435, w: 148, h: 96, draw: 'server' },
    { module: 'pm.itproject', x: 480, y: 435, w: 148, h: 96, draw: 'desk' },
  ],
  routes: [['pm.approach', 'pm.intake'], ['pm.intake', 'pm.plan'], ['pm.plan', 'pm.run'], ['pm.run', 'pm.land'], ['pm.land', 'pm.close']],
};

import { phoneLayout } from './layout.js';

const PHONE = phoneLayout([
  { field: 'pm.field.portfolio', label: WIDE.zones[0].label, rows: [
    { cols: 2, h: 54, items: [['pm.portfolio', 'board'], ['pm.consult', 'contract']] }] },
  { field: 'pm.field.lifecycle', label: WIDE.zones[1].label, rows: [
    { cols: 3, h: 54, items: [['pm.approach', 'road-stop'], ['pm.intake', 'gate'], ['pm.plan', 'board']] },
    { cols: 3, h: 54, items: [['pm.run', 'dashboard'], ['pm.land', 'road-stop'], ['pm.close', 'contract']] }] },
  { field: 'pm.field.people', label: WIDE.zones[2].label, rows: [
    { cols: 3, h: 65, items: [['pm.stuck', 'road-stop'], ['pm.lead', 'whiteboard'], ['pm.negotiate', 'handshake']] },
    { cols: 2, h: 54, items: [['pm.outside', 'desk'], ['pm.perform', 'dashboard']] }] },
  { field: 'pm.field.it', label: WIDE.zones[3].label, rows: [
    { cols: 2, h: 54, items: [['pm.agile', 'whiteboard'], ['pm.scaled', 'board']] },
    { cols: 2, h: 54, items: [['pm.devops', 'server'], ['pm.itproject', 'desk']] }] },
]);
// Each row of the lifecycle is its own stretch of road, ended by an arrow; the
// second row carries on from the first, the way text does.
PHONE.routes = [['pm.approach', 'pm.intake'], ['pm.intake', 'pm.plan'], ['pm.run', 'pm.land'], ['pm.land', 'pm.close']];

export default { ...WIDE, phone: PHONE };
