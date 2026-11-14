// v17: fields group a subject's modules under one field film ("a project from
// start to finish"). Every module of a subject that has fields sits in exactly
// one field; a field's film, when it has one, is named after the field.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODULES, FIELDS, fieldOf } from '../src/content/courses/index.js';
import { checkFields } from '../src/content/courses/validate.js';

const field = (extra = {}) => ({
  id: 'pm.field.x', subject: 'pm', title: { en: 'X', nl: 'X' }, blurb: { en: 'b', nl: 'b' }, modules: ['pm.plan'], ...extra,
});

test('the shipped fields are valid and cover every pm module exactly once', () => {
  assert.deepEqual(checkFields(FIELDS, MODULES), []);
  const pm = MODULES.filter((m) => m.subject === 'pm').map((m) => m.id).sort();
  assert.deepEqual(FIELDS.filter((f) => f.subject === 'pm').flatMap((f) => f.modules).sort(), pm);
});

test('the four pm fields group the modules as agreed with Merijn (13 Nov)', () => {
  const by = Object.fromEntries(FIELDS.map((f) => [f.id, f.modules]));
  assert.deepEqual(by['pm.field.lifecycle'], ['pm.intake', 'pm.plan', 'pm.run', 'pm.land', 'pm.close']);
  assert.deepEqual(by['pm.field.people'], ['pm.stuck', 'pm.lead', 'pm.negotiate', 'pm.outside', 'pm.perform']);
  assert.deepEqual(by['pm.field.portfolio'], ['pm.portfolio', 'pm.consult']);
  assert.deepEqual(by['pm.field.it'], ['pm.agile', 'pm.scaled', 'pm.devops', 'pm.itproject']);
});

test('checkFields: a field with an unknown module is rejected', () => {
  assert.equal(checkFields([field({ modules: ['pm.nope'] })], MODULES).length >= 1, true);
});

test('checkFields: a module in two fields is rejected', () => {
  const errs = checkFields([field(), field({ id: 'pm.field.y' })], MODULES);
  assert.ok(errs.some((e) => /pm\.plan/.test(e) && /two fields|more than one/.test(e)), errs.join('; '));
});

test('checkFields: the id must be <subject>.field.<slug>', () => {
  assert.ok(checkFields([field({ id: 'pm.x' })], MODULES).some((e) => /id/.test(e)));
});

test('checkFields: a film must be named after its field', () => {
  assert.ok(checkFields([field({ film: 'pm.field.other' })], MODULES).some((e) => /film/.test(e)));
  assert.ok(!checkFields([field({ film: 'pm.field.x' })], MODULES).some((e) => /film/.test(e)));
});

test('checkFields: a module of another subject is rejected', () => {
  assert.ok(checkFields([field({ modules: ['eng.flow'] })], MODULES).some((e) => /subject/.test(e)));
});

test('checkFields: a subject with fields must have all its modules in them', () => {
  const errs = checkFields([field()], MODULES); // only pm.plan of 16 pm modules
  assert.ok(errs.some((e) => /pm\.intake/.test(e) && /no field/.test(e)), errs.join('; '));
});

test('checkFields: titles and blurbs in both languages', () => {
  assert.ok(checkFields([field({ title: { en: 'X' } })], MODULES).some((e) => /title/.test(e)));
  assert.ok(checkFields([field({ blurb: { nl: 'b' } })], MODULES).some((e) => /blurb/.test(e)));
});

test('fieldOf finds the field of a module, or null', () => {
  assert.equal(fieldOf('pm.plan').id, 'pm.field.lifecycle');
  assert.equal(fieldOf('pm.itproject').id, 'pm.field.it');
  assert.equal(fieldOf('eng.flow'), null);
  assert.equal(fieldOf('nope'), null);
});
