// Home layout, pure: the speaking home's bands and drill groups, and the
// course homes' track progress, open track and module difficulty.
import { masteryOf } from './mastery.js';
import { recommendedModule, levelsDone } from './course.js';
import { MODULES, TRACKS, trackOf } from '../content/courses/index.js';

// The speaking home, top to bottom. Items are rendered by ui/home.js.
export const SPEAK_BANDS = [
  { id: 'today', items: ['next', 'lesson', 'reviews', 'quests'] },
  { id: 'practise', items: ['quick', 'groups'] },
  { id: 'challenge', items: ['boss', 'programme', 'targeted'] },
  { id: 'real', items: ['realweek', 'conversation', 'finder', 'listen'] },
];

// Items that fold shut on the speaking home, and the key that remembers them.
const FOLDS = { quests: 'quests', groups: 'practice' };
const SPEAK_KEYS = ['quests', 'practice'];

// Known keys, once each, in order; null when not a list.
export function cleanSpeakOpen(v) {
  if (!Array.isArray(v)) return null;
  return SPEAK_KEYS.filter((k) => v.includes(k));
}

export const speakOpen = (ui) => cleanSpeakOpen((ui || {}).speakOpen) || [];

export function toggleSpeak(ui, key, open) {
  const cur = new Set(speakOpen(ui));
  if (open) cur.add(key); else cur.delete(key);
  return { ...(ui || {}), speakOpen: SPEAK_KEYS.filter((k) => cur.has(k)) };
}

// The speaking home, ready to draw: bands in order, each item with the fold it
// belongs to (or null) and whether it is open. Everything starts closed that folds.
export function speakLayout(state) {
  const opened = speakOpen(state && state.ui);
  return SPEAK_BANDS.map((b) => ({
    id: b.id,
    items: b.items.map((id) => {
      const fold = FOLDS[id] || null;
      return { id, fold, open: fold ? opened.includes(fold) : true };
    }),
  }));
}

// Every drill in one group that folds open.
export const DRILL_GROUPS = [
  { id: 'basics', drills: ['minute', 'explain', 'story', 'pause'] },
  { id: 'structure', drills: ['prep', 'frame', 'bridge', 'real'] },
  { id: 'conversation', drills: ['smalltalk', 'yesAnd', 'listen', 'followUp'] },
  { id: 'pressure', drills: ['rapid', 'debate', 'expert', 'pressure'] },
];
const GROUP_IDS = DRILL_GROUPS.map((g) => g.id);

const MASTERY_PTS = { learn: 0, practise: 1, own: 2 };

// Owned and practised drills in a group, and a 0–1 share for its bar.
export function groupProgress(history, group, now = Date.now()) {
  const m = group.drills.map((d) => masteryOf(history, d, now));
  const pts = m.reduce((a, x) => a + MASTERY_PTS[x], 0);
  return {
    owned: m.filter((x) => x === 'own').length,
    practised: m.filter((x) => x === 'practise').length,
    total: group.drills.length,
    share: group.drills.length ? pts / (2 * group.drills.length) : 0,
  };
}

// Known group ids, once each, in group order; null when not a list.
export function cleanOpenGroups(v) {
  if (!Array.isArray(v)) return null;
  return GROUP_IDS.filter((id) => v.includes(id));
}

// Which groups are open: a stored list wins; before one exists, the old
// "More practice" open flag opens them all; otherwise all closed.
export function openGroups(ui) {
  const u = ui || {};
  const stored = cleanOpenGroups(u.drillGroups);
  if (stored) return stored;
  return u.moreOpen === true ? [...GROUP_IDS] : [];
}

export function toggleGroup(ui, id, open) {
  const cur = new Set(openGroups(ui));
  if (open) cur.add(id); else cur.delete(id);
  return { ...(ui || {}), drillGroups: GROUP_IDS.filter((g) => cur.has(g)) };
}

// Module difficulty, named apart from the topic levels (Basis … Expert).
export const moduleTier = (level) => (level >= 3 ? 'specialist' : level === 2 ? 'deeper' : 'intro');

// Passed lessons over all modules of a track (a topic level is one lesson).
export function trackProgress(state, metas) {
  return metas.reduce((acc, m) => {
    const { done, total } = levelsDone(state, m);
    return { done: acc.done + done, total: acc.total + total };
  }, { done: 0, total: 0 });
}

// The track that opens first: where the next step lives.
export function openTrack(state, subject, pick, modules = MODULES, tracks = TRACKS[subject]) {
  const id = (pick && pick.moduleId) || recommendedModule(state, subject, modules);
  const track = id ? trackOf(id) : null;
  if (track && tracks.includes(track)) return track;
  return tracks.find((tr) => modules.some((m) => m.subject === subject && m.track === tr)) || tracks[0];
}
