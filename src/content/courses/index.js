// Course index: subjects, tracks and module metadata, without lesson bodies,
// so the course home renders without loading content. Ids are stable:
// progress hangs on them. Module id '<subject>.<slug>', lesson id
// '<moduleId>.<slug>', question id '<lessonId>#r<n>' (recall) or '#p<n>' (pre).

export const SUBJECTS = ['eng', 'pm'];
export const TRACKS = { eng: ['basics', 'discrete', 'grid'], pm: ['project'] };

export const MODULES = [];

export const subjectOf = (id) => String(id).split('.')[0];
export const moduleOf = (id) => String(id).split('#')[0].split('.').slice(0, 2).join('.');
export const lessonOf = (questionId) => String(questionId).split('#')[0];
export const metaOf = (moduleId) => MODULES.find((m) => m.id === moduleId) || null;
export const trackOf = (moduleId) => (metaOf(moduleId) || {}).track || null;

// One module file per language; rejects when the file can't be loaded.
export async function loadModule(subject, moduleId, lang) {
  const slug = String(moduleId).split('.')[1];
  const mod = await import(`./${subject}/${slug}.${lang === 'en' ? 'en' : 'nl'}.js`);
  return mod.default;
}
