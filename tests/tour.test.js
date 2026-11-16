import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { installFakeDom } from './fixtures/fakedom.js';
import { MODULES } from '../src/content/courses/index.js';
import { DRILLS } from '../src/core/progress.js';
import { STRINGS } from '../src/i18n.js';
import { defaultState } from '../src/core/storage.js';

installFakeDom();
const { tourModel, FEATURED_FILM } = await import('../src/core/tour.js');
const manifest = JSON.parse(readFileSync(new URL('../src/content/courses/films/manifest.json', import.meta.url), 'utf8'));

test('tourModel: the three subjects in order, counts computed from the data', () => {
  const m = tourModel(manifest);
  assert.deepEqual(m.map((s) => s.id), ['speak', 'eng', 'pm']);
  for (const id of ['eng', 'pm']) {
    const s = m.find((x) => x.id === id);
    const mods = MODULES.filter((x) => x.subject === id);
    assert.equal(s.modules, mods.length);
    assert.equal(s.lessons, mods.reduce((n, x) => n + x.lessons.length, 0));
    assert.equal(s.films, Object.keys(manifest.films).filter((f) => f.startsWith(`${id}.`)).length);
    assert.equal(s.hasMap, true);
    assert.ok(MODULES.find((x) => x.id === s.firstModule && x.subject === id));
  }
  const speak = m[0];
  assert.equal(speak.drills, DRILLS.length);
  assert.equal(speak.hasMap, false);
  assert.equal(speak.firstModule, null);
});

test('tourModel: without a manifest the film count is null, not zero', () => {
  assert.equal(tourModel(null).find((s) => s.id === 'eng').films, null);
});

test('the featured film is the energy field film and it has a rendered video', () => {
  assert.equal(FEATURED_FILM, 'eng.field.energy');
  assert.ok(manifest.films[FEATURED_FILM].nl && manifest.films[FEATURED_FILM].poster);
});

test('tour strings exist in both languages and the welcome has no key slide or maker note', () => {
  for (const lang of ['nl', 'en']) {
    for (const k of ['tourTitle', 'tourEntry', 'tourIntro', 'tourOpen', 'tourFeatured', 'tourFeaturedCaption', 'tourTry', 'welcomeLook', 'welcome3Title', 'welcome3Body']) {
      assert.ok(STRINGS[lang][k], `${lang}.${k}`);
    }
    assert.doesNotMatch(STRINGS[lang].welcome3Body, /API|sleutel|key/i, 'the key now lives in Settings only');
    assert.doesNotMatch(STRINGS[lang].tourIntro, /Merijn|gemaakt door|made by/i);
  }
});

test('welcome: the last slide offers two choices, Aan de slag and Ik kijk rond', async () => {
  const { renderWelcome } = await import('../src/ui/welcome.js');
  const calls = [];
  const app = {
    lang: 'nl',
    state: defaultState(),
    t: (k, ...a) => (typeof STRINGS.nl[k] === 'function' ? STRINGS.nl[k](...a) : STRINGS.nl[k]),
    setState(s) { this.state = s; },
    go: (...a) => calls.push(a),
    updateSettings() {},
  };
  const root = document.createElement('div');
  renderWelcome(app, {}, root);
  const click = (label) => root.querySelectorAll('button').find((b) => b.textContent.trim() === label);
  click('Volgende').click();
  click('Volgende').click();
  assert.ok(click('Aan de slag'), 'start button');
  const look = click('Ik kijk rond');
  assert.ok(look, 'look-around button');
  look.click();
  assert.deepEqual(calls.at(-1), ['tour']);
  assert.equal(app.state.onboarded, true);
});
