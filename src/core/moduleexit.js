// Where a lesson, a module check or a situation goes when it ends or is closed.
// Opened from the module screen (it passes from: 'module'), the learner returns
// there; opened from anywhere else it goes home, as before. The origin is carried
// in the params, never inferred. Pure.
import { MODULES } from '../content/courses/index.js';

export const FROM_MODULE = 'module';

// ['module', { subject, moduleId }] or ['home'].
export function exitTarget(params) {
  const p = params || {};
  if (p.from !== FROM_MODULE) return ['home'];
  const meta = MODULES.find((m) => m.id === p.moduleId);
  if (!meta) return ['home'];
  // The module's own subject: a stale or mismatched params.subject never wins.
  return ['module', { subject: meta.subject, moduleId: meta.id }];
}

// The origin part of the params, to spread into the next screen's params
// (the next level, a retry, the situation after a lesson).
export const originOf = (params) => (params && params.from === FROM_MODULE ? { from: FROM_MODULE } : {});

// The params for opening another screen from one that was itself opened with `params`.
export const nextParams = (params, extra) => ({ ...extra, ...originOf(params) });
