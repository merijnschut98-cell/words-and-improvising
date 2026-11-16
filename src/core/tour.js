// The tour page ("What's inside"): what the app holds, counted from the data
// itself so the numbers never go stale. Pure; the screen is src/ui/tour.js.
import { MODULES, FIELDS } from '../content/courses/index.js';
import { mapFor } from '../content/courses/maps/index.js';
import { DRILLS } from './progress.js';

// The one film the tour plays in place: the Engineering energy field film.
export const FEATURED_FILM = 'eng.field.energy';

// The subjects in the order of the app. Films are counted from the manifest of
// rendered films (null while it has not loaded, so a screen shows no number
// rather than a wrong one). Speaking has no modules: its drills are its content.
export function tourModel(manifest) {
  const films = manifest && manifest.films ? Object.keys(manifest.films) : null;
  const course = (id) => {
    const mods = MODULES.filter((m) => m.subject === id);
    const map = mapFor(id);
    // The first module of the subject's first field (FIELDS order): where its road or reading order starts.
    const zone = FIELDS.find((f) => f.subject === id);
    return {
      id,
      modules: mods.length,
      lessons: mods.reduce((n, m) => n + m.lessons.length, 0),
      films: films ? films.filter((f) => f.startsWith(`${id}.`)).length : null,
      drills: 0,
      hasMap: Boolean(map),
      firstModule: (zone && zone.modules[0]) || (mods[0] && mods[0].id) || null,
    };
  };
  return [
    { id: 'speak', modules: 0, lessons: 0, films: 0, drills: DRILLS.length, hasMap: false, firstModule: null },
    course('eng'),
    course('pm'),
  ];
}
