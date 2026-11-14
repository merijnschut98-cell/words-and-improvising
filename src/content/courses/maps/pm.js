// v17: the Projects map. The project is a road from left to right with five
// stations (the lifecycle field); the office (portfolio) sits above it, the
// team room (people) below it and the workshop (IT) at the bottom. Plain data:
// the drawer is src/ui/subjectmap.js, the rules are checkMap in validate.js.
// Coordinates are view units (640 x 520); every place is at least 44 px wide
// and high at 390 px (72.2 units). `draw` names an object mapSvg knows.
export default {
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
