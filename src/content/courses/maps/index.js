// v17: the subject maps by subject. A subject without a map (Engineering, for
// now) keeps the list-only home.
import pm from './pm.js';

const MAPS = { pm };
export const mapFor = (subject) => MAPS[subject] || null;
