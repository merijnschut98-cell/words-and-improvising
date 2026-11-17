// 17 Nov (Merijn: "rustiger startscherm"): a start card is one button with the
// subject name, the next step and why; no separate "Open <subject>" line, since
// the whole card already opens the subject.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('a start card has no separate open link', () => {
  const src = fs.readFileSync('src/ui/home.js', 'utf8');
  const card = src.slice(src.indexOf('function startCard('), src.indexOf('function breakCard('));
  assert.doesNotMatch(card, /start-open/);
  assert.match(card, /start-subject/, 'the card reads its subject name');
});

test('a next-lesson card reads topic · level, without "Je volgende les"', () => {
  const src = fs.readFileSync('src/ui/home.js', 'utf8');
  assert.match(src, /card\.reason === 'lesson' && card\.topicId && card\.lessonId \? placeLabel\(/);
});
