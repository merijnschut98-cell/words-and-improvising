// v17: the Engineering map. Five zones, one per field (FIELDS in
// src/content/courses/index.js): a plant kept running, a plant made better, making things, energy
// and the grid, automation and IT. Engineering has no natural order, so there is
// no road; within a zone the places run by level, Basis first, row by row from
// the left. Plain data: the drawer is src/ui/subjectmap.js, the rules are
// checkMap in validate.js. Each place names an object mapSvg knows (`draw`).
import { phoneLayout, wideLayout } from './layout.js';

const LABEL = {
  'eng.field.run': { en: 'Keeping the plant running', nl: 'De fabriek draaiend houden' },
  'eng.field.better': { en: 'Making the plant better', nl: 'De fabriek beter maken' },
  'eng.field.making': { en: 'Making things', nl: 'Dingen maken' },
  'eng.field.energy': { en: 'Energy and the grid', nl: 'Energie en het net' },
  'eng.field.digital': { en: 'Automation and IT', nl: 'Automatisering en IT' },
};
const sec = (field, rows) => ({ field, label: LABEL[field], rows });

// The wide layout (15 Nov: the plant zone is two zones, two rows of two each, so the sheet is 640 by 1268 and no longer
// 1128). Three places to a row (200 units, 24 characters a line; a row
// of two is centred). Only the first row of the energy band has four (148 units,
// 19 characters), whose titles are short enough; "Pompen, stroming en" is not,
// so eng.fluids sits in the row of three under it.
const WIDE = wideLayout('eng', [
  sec('eng.field.run', [
    { h: 104, items: [['eng.flow', 'conveyor'], ['eng.quality', 'gate']] },
    { h: 104, items: [['eng.maintenance', 'desk'], ['eng.safety', 'road-stop']] }]),
  sec('eng.field.better', [
    { h: 104, items: [['eng.improve', 'board'], ['eng.spc', 'whiteboard']] },
    { h: 104, items: [['eng.cost', 'contract'], ['eng.reliability', 'dashboard']] }]),
  sec('eng.field.making', [
    { h: 104, items: [['eng.mechanics', 'beam'], ['eng.machining', 'machine'], ['eng.process', 'tank']] },
    { h: 104, items: [['eng.drawings', 'desk'], ['eng.joining', 'weld'], ['eng.moulding', 'press']] }]),
  sec('eng.field.energy', [
    { h: 120, items: [['eng.gridbasics', 'pylon'], ['eng.switchgear', 'cabinet'], ['eng.transformers', 'transformer'], ['eng.power', 'motor']] },
    { h: 104, items: [['eng.fluids', 'pump'], ['eng.gridops', 'dashboard'], ['eng.gridplanning', 'board']] }]),
  sec('eng.field.digital', [
    { h: 104, items: [['eng.itbasics', 'server'], ['eng.ot', 'cabinet'], ['eng.cyber', 'lock']] },
    { h: 104, items: [['eng.lines', 'arm'], ['eng.industry40', 'dashboard']] }]),
]);

// The phone layout (see layout.js): eleven rows. Three places of 90 units to a row
// (15 characters a line) where every word of both titles fits, otherwise two of
// 137. The energy zone keeps its three long Dutch words (elektriciteitsnet,
// schakelinstallaties, energietransitie) in rows of two, with the three titles
// that fit between them. A row is 54 units (a tap of 45.7 px at 320 px), 65 when
// a title takes three lines.
const PHONE = phoneLayout([
  sec('eng.field.run', [
    { cols: 2, h: 54, items: [['eng.flow', 'conveyor'], ['eng.quality', 'gate']] },
    { cols: 2, h: 54, items: [['eng.maintenance', 'desk'], ['eng.safety', 'road-stop']] }]),
  sec('eng.field.better', [
    { cols: 2, h: 54, items: [['eng.improve', 'board'], ['eng.spc', 'whiteboard']] },
    { cols: 2, h: 54, items: [['eng.cost', 'contract'], ['eng.reliability', 'dashboard']] }]),
  sec('eng.field.making', [
    { cols: 3, h: 65, items: [['eng.mechanics', 'beam'], ['eng.machining', 'machine'], ['eng.process', 'tank']] },
    { cols: 3, h: 54, items: [['eng.drawings', 'desk'], ['eng.joining', 'weld'], ['eng.moulding', 'press']] }]),
  sec('eng.field.energy', [
    { cols: 2, h: 54, items: [['eng.gridbasics', 'pylon'], ['eng.switchgear', 'cabinet']] },
    { cols: 3, h: 65, items: [['eng.transformers', 'transformer'], ['eng.power', 'motor'], ['eng.fluids', 'pump']] },
    { cols: 2, h: 54, items: [['eng.gridops', 'dashboard'], ['eng.gridplanning', 'board']] }]),
  sec('eng.field.digital', [
    { cols: 3, h: 54, items: [['eng.itbasics', 'server'], ['eng.ot', 'cabinet'], ['eng.cyber', 'lock']] },
    { cols: 2, h: 54, items: [['eng.lines', 'arm'], ['eng.industry40', 'dashboard']] }]),
], { cols: { 3: { w: 90, xs: [10, 105, 200] } } });

export default { ...WIDE, phone: PHONE };
