// v17: the Engineering map. Four zones, one per field (FIELDS in
// src/content/courses/index.js): a plant that runs well, making things, energy
// and the grid, automation and IT. Engineering has no natural order, so there is
// no road; within a zone the places run by level, Basis first, row by row from
// the left. Plain data: the drawer is src/ui/subjectmap.js, the rules are
// checkMap in validate.js. Each place names an object mapSvg knows (`draw`).
import { phoneLayout, wideLayout } from './layout.js';

const LABEL = {
  'eng.field.plant': { en: 'A plant that runs well', nl: 'Een fabriek die goed draait' },
  'eng.field.making': { en: 'Making things', nl: 'Dingen maken' },
  'eng.field.energy': { en: 'Energy and the grid', nl: 'Energie en het net' },
  'eng.field.digital': { en: 'Automation and IT', nl: 'Automatisering en IT' },
};
const sec = (field, rows) => ({ field, label: LABEL[field], rows });

// The wide layout: three places to a row (200 units, 24 characters a line; a row
// of two is centred). Only the last row of the energy band has four (148 units,
// 19 characters), whose titles are short enough.
const WIDE = wideLayout('eng', [
  sec('eng.field.plant', [
    { h: 104, items: [['eng.flow', 'conveyor'], ['eng.quality', 'gate'], ['eng.maintenance', 'desk']] },
    { h: 104, items: [['eng.safety', 'road-stop'], ['eng.spc', 'whiteboard'], ['eng.cost', 'contract']] },
    { h: 104, items: [['eng.improve', 'board'], ['eng.reliability', 'dashboard']] }]),
  sec('eng.field.making', [
    { h: 104, items: [['eng.mechanics', 'beam'], ['eng.machining', 'machine'], ['eng.process', 'tank']] },
    { h: 104, items: [['eng.drawings', 'desk'], ['eng.joining', 'weld'], ['eng.moulding', 'press']] }]),
  sec('eng.field.energy', [
    { h: 104, items: [['eng.gridbasics', 'pylon'], ['eng.fluids', 'pump'], ['eng.power', 'motor']] },
    { h: 120, items: [['eng.transformers', 'transformer'], ['eng.switchgear', 'cabinet'], ['eng.gridops', 'dashboard'], ['eng.gridplanning', 'board']] }]),
  sec('eng.field.digital', [
    { h: 104, items: [['eng.itbasics', 'server'], ['eng.ot', 'cabinet'], ['eng.cyber', 'lock']] },
    { h: 104, items: [['eng.lines', 'arm'], ['eng.industry40', 'dashboard']] }]),
]);

// The phone layout (see layout.js): three places to a row where every title
// has words of 14 characters or fewer, otherwise two.
const PHONE = phoneLayout([
  sec('eng.field.plant', [
    { cols: 3, h: 54, items: [['eng.flow', 'conveyor'], ['eng.quality', 'gate'], ['eng.maintenance', 'desk']] },
    { cols: 3, h: 65, items: [['eng.safety', 'road-stop'], ['eng.spc', 'whiteboard'], ['eng.cost', 'contract']] },
    { cols: 2, h: 54, items: [['eng.improve', 'board'], ['eng.reliability', 'dashboard']] }]),
  sec('eng.field.making', [
    { cols: 2, h: 54, items: [['eng.mechanics', 'beam'], ['eng.machining', 'machine']] },
    { cols: 2, h: 54, items: [['eng.process', 'tank'], ['eng.drawings', 'desk']] },
    { cols: 2, h: 54, items: [['eng.joining', 'weld'], ['eng.moulding', 'press']] }]),
  sec('eng.field.energy', [
    { cols: 2, h: 54, items: [['eng.gridbasics', 'pylon'], ['eng.fluids', 'pump']] },
    { cols: 2, h: 54, items: [['eng.power', 'motor'], ['eng.transformers', 'transformer']] },
    { cols: 2, h: 54, items: [['eng.switchgear', 'cabinet'], ['eng.gridops', 'dashboard']] },
    { cols: 1, h: 54, items: [['eng.gridplanning', 'board']] }]),
  sec('eng.field.digital', [
    { cols: 3, h: 54, items: [['eng.itbasics', 'server'], ['eng.ot', 'cabinet'], ['eng.cyber', 'lock']] },
    { cols: 2, h: 54, items: [['eng.lines', 'arm'], ['eng.industry40', 'dashboard']] }]),
]);

export default { ...WIDE, phone: PHONE };
