// A copy of the planned v10 topic table for eng.machining (plan Task 5), for
// tests that must not depend on the content lane having landed.
const L = (s) => `eng.machining.${s}`;
const topics = [
  { id: 'turning', title: { en: 'Turning', nl: 'Draaien' }, levels: ['processes', 'cutting', 'turnfinish', 'turncell'].map(L) },
  { id: 'milling', title: { en: 'Milling', nl: 'Frezen' }, levels: ['mill', 'millfeeds', 'millstrategy', 'fiveaxis'].map(L) },
  { id: 'drilling', title: { en: 'Drilling', nl: 'Boren' }, levels: ['drill', 'holes', 'deephole', 'holequality'].map(L) },
  { id: 'cnc', title: { en: 'CNC programme', nl: 'CNC-programma' }, levels: ['cnc', 'gcode', 'offsets', 'cam'].map(L) },
  { id: 'tooling', title: { en: 'Tooling', nl: 'Gereedschap' }, levels: ['toolbasics', 'tools', 'toollife', 'toolcost'].map(L) },
  { id: 'workholding', title: { en: 'Workholding and measuring', nl: 'Opspanning en meten' }, levels: ['fixtures', 'quality', 'metrology', 'capable'].map(L) },
];
const lessons = topics.flatMap((t) => t.levels);
export const machiningV10 = {
  id: 'eng.machining', subject: 'eng', track: 'discrete', level: 1,
  title: { en: 'Machining', nl: 'Verspanen' }, blurb: { en: 'x', nl: 'x' },
  topics, lessons, questions: Object.fromEntries(lessons.map((id) => [id, 4])),
};
