import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SPEAK_BANDS, DRILL_GROUPS, groupProgress, openGroups, toggleGroup,
  moduleTier, trackProgress, openTrack, cleanOpenGroups,
} from '../src/core/layout.js';
import { DRILLS } from '../src/core/progress.js';
import { MODULES, TRACKS } from '../src/content/courses/index.js';
import { defaultState } from '../src/core/storage.js';

const NOW = new Date(2026, 10, 8, 12).getTime();
const DAY = 86400000;

test('speaking home: four bands in order, each item in exactly one band', () => {
  assert.deepEqual(SPEAK_BANDS.map((b) => b.id), ['today', 'practise', 'challenge', 'real']);
  const items = SPEAK_BANDS.flatMap((b) => b.items);
  assert.equal(new Set(items).size, items.length);
  // The daily tasks sit right under the next round.
  assert.deepEqual(SPEAK_BANDS[0].items.slice(0, 2), ['next', 'quests']);
  assert.deepEqual([...SPEAK_BANDS[2].items].sort(), ['boss', 'programme', 'targeted']);
  assert.deepEqual([...SPEAK_BANDS[3].items].sort(), ['conversation', 'finder', 'listen', 'realweek']);
  assert.ok(SPEAK_BANDS[1].items.includes('groups'));
});

test('drill groups: four groups that hold every drill exactly once', () => {
  assert.deepEqual(DRILL_GROUPS.map((g) => g.id), ['basics', 'structure', 'conversation', 'pressure']);
  const all = DRILL_GROUPS.flatMap((g) => g.drills);
  assert.equal(new Set(all).size, all.length, 'no drill twice');
  assert.deepEqual([...all].sort(), [...DRILLS].sort());
  assert.ok(DRILL_GROUPS.every((g) => g.drills.length >= 3));
});

test('group progress counts owned and practised drills and gives a share for the bar', () => {
  const g = { id: 'x', drills: ['minute', 'explain', 'story', 'pause'] };
  assert.deepEqual(groupProgress([], g, NOW), { owned: 0, practised: 0, total: 4, share: 0 });
  const round = (drill, daysAgo, rating) => ({ drill, ts: NOW - daysAgo * DAY, rating, metrics: {} });
  // minute owned (three good days), explain practised (three rounds, low score).
  const history = [round('minute', 1, 5), round('minute', 2, 4), round('minute', 3, 4),
    round('explain', 1, 2), round('explain', 1, 2), round('explain', 2, 2)];
  const p = groupProgress(history, g, NOW);
  assert.equal(p.owned, 1);
  assert.equal(p.practised, 1);
  assert.equal(p.total, 4);
  // learn 0, practise 1, own 2, out of 2 per drill.
  assert.equal(p.share, 3 / 8);
});

test('open groups: closed by default, the legacy "More practice open" opens all, a stored list wins', () => {
  assert.deepEqual(openGroups(undefined), []);
  assert.deepEqual(openGroups({}), []);
  assert.deepEqual(openGroups({ moreOpen: true }), DRILL_GROUPS.map((g) => g.id));
  assert.deepEqual(openGroups({ moreOpen: true, drillGroups: ['pressure'] }), ['pressure']);
  assert.deepEqual(openGroups({ drillGroups: ['nope', 'basics'] }), ['basics']);
});

test('toggling a group keeps the others and leaves the rest of ui alone', () => {
  const ui = { subject: 'speak', moreOpen: true };
  const a = toggleGroup(ui, 'basics', false);
  assert.deepEqual(a.drillGroups, ['structure', 'conversation', 'pressure']);
  assert.equal(a.subject, 'speak');
  const b = toggleGroup({}, 'pressure', true);
  assert.deepEqual(b.drillGroups, ['pressure']);
  assert.deepEqual(toggleGroup(b, 'pressure', true).drillGroups, ['pressure'], 'no duplicates');
  assert.deepEqual(toggleGroup(b, 'basics', true).drillGroups, ['basics', 'pressure'], 'in group order');
});

test('stored open groups are cleaned on load', () => {
  assert.deepEqual(cleanOpenGroups(['basics', 3, 'x', 'basics']), ['basics']);
  assert.equal(cleanOpenGroups('basics'), null);
});

test('module difficulty: Instap / Verdieping / Specialist, never the topic level names', () => {
  assert.equal(moduleTier(1), 'intro');
  assert.equal(moduleTier(2), 'deeper');
  assert.equal(moduleTier(3), 'specialist');
  assert.equal(moduleTier(4), 'specialist');
  assert.equal(moduleTier(undefined), 'intro');
});

test('track progress sums passed lessons and levels over the modules of a track', () => {
  const metas = [{ subject: 'eng', lessons: ['a', 'b'] }, { subject: 'eng', lessons: ['c', 'd', 'e', 'f'] }];
  const s = { ...defaultState(), courses: { ...defaultState().courses, eng: { lessons: { a: { passed: 1 }, c: { passed: 1 }, d: { read: 1 } } } } };
  assert.deepEqual(trackProgress(s, metas), { done: 2, total: 6 });
  assert.deepEqual(trackProgress(defaultState(), []), { done: 0, total: 0 });
});

test('the open track is the one with the next step', () => {
  const s = defaultState();
  // A pick that names a module opens its track.
  assert.equal(openTrack(s, 'eng', { reason: 'lesson', moduleId: 'eng.gridops' }), 'grid');
  assert.equal(openTrack(s, 'pm', { reason: 'apply', moduleId: 'pm.agile' }), 'agile');
  // Without a module (due questions, done): the recommended module's track.
  assert.equal(openTrack(s, 'eng', { reason: 'due' }), 'basics');
  // Started in Manufacturing: that module is recommended, so its track opens.
  const started = { ...s, courses: { ...s.courses, eng: { ...s.courses.eng, lessons: { [MODULES.find((m) => m.id === 'eng.machining').lessons[0]]: { passed: 1 } } } } };
  assert.equal(openTrack(started, 'eng', { reason: 'due' }), 'discrete');
  // Everything passed: the first track.
  const all = Object.fromEntries(MODULES.filter((m) => m.subject === 'pm').flatMap((m) => m.lessons).map((id) => [id, { passed: 1 }]));
  assert.equal(openTrack({ ...s, courses: { ...s.courses, pm: { ...s.courses.pm, lessons: all } } }, 'pm', { reason: 'done' }), TRACKS.pm[0]);
});

test('Projecten has two tracks: projects and agile', () => {
  assert.deepEqual(TRACKS.pm, ['project', 'agile']);
  assert.ok(MODULES.some((m) => m.subject === 'pm' && m.track === 'agile'));
});
