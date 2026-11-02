// Course index: subjects, tracks and module metadata, without lesson bodies,
// so the course home renders without loading content. Ids are stable:
// progress hangs on them. Module id '<subject>.<slug>', lesson id
// '<moduleId>.<slug>', question id '<lessonId>#r<n>' (recall) or '#p<n>' (pre).

export const SUBJECTS = ['eng', 'pm'];
export const TRACKS = { eng: ['basics', 'discrete', 'grid'], pm: ['project'] };

export const MODULES = [
  { id: 'eng.flow', subject: 'eng', track: 'basics', level: 1, title: { en: 'Capacity and flow', nl: 'Capaciteit en flow' }, blurb: { en: 'Takt, bottlenecks, OEE: how much a line can make and why it doesn’t.', nl: 'Takt, bottlenecks, OEE: hoeveel een lijn kan maken en waarom dat niet lukt.' }, lessons: ['eng.flow.takt', 'eng.flow.bottleneck', 'eng.flow.oee', 'eng.flow.changeover', 'eng.flow.balance', 'eng.flow.capacity'], questions: { 'eng.flow.takt': 4, 'eng.flow.bottleneck': 4, 'eng.flow.oee': 4, 'eng.flow.changeover': 4, 'eng.flow.balance': 4, 'eng.flow.capacity': 4 } },
  { id: 'pm.intake', subject: 'pm', track: 'project', level: 1, title: { en: 'Intake', nl: 'Intake' }, blurb: { en: 'From the client’s question to a project worth doing.', nl: 'Van de vraag van de klant naar een project dat het waard is.' }, lessons: ['pm.intake.ask', 'pm.intake.firsttalk', 'pm.intake.stakeholders', 'pm.intake.done', 'pm.intake.start', 'pm.intake.no'], questions: { 'pm.intake.ask': 4, 'pm.intake.firsttalk': 4, 'pm.intake.stakeholders': 4, 'pm.intake.done': 4, 'pm.intake.start': 4, 'pm.intake.no': 4 } },
];

export const subjectOf = (id) => String(id).split('.')[0];
export const moduleOf = (id) => String(id).split('#')[0].split('.').slice(0, 2).join('.');
export const lessonOf = (questionId) => String(questionId).split('#')[0];
export const metaOf = (moduleId) => MODULES.find((m) => m.id === moduleId) || null;
export const trackOf = (moduleId) => (metaOf(moduleId) || {}).track || null;

// One module file per language; rejects when the file can't be loaded. A
// browser remembers a failed import, so a retry asks for a fresh URL.
export async function loadModule(subject, moduleId, lang, attempt = 0) {
  const slug = String(moduleId).split('.')[1];
  const mod = await import(`./${subject}/${slug}.${lang === 'en' ? 'en' : 'nl'}.js${attempt ? `?retry=${attempt}` : ''}`);
  return mod.default;
}
