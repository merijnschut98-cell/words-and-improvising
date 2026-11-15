// v17: the subject maps by subject. A subject without a map keeps the list-only
// home.
import pm from './pm.js';
import eng from './eng.js';

const MAPS = { pm, eng };
export const mapFor = (subject) => MAPS[subject] || null;
