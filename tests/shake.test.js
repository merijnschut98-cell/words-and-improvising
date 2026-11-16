// The film kit's tree shake (films/_kit/shake.mjs, from the Task 17 pilot P1): a film page that inlines a big
// script library (the anatomy kit, the lathe module) keeps only the top-level declarations its own stage names,
// and what those name in turn. It must never drop something that is used (a superset, never less), never keep a
// name only because a property of the same name is read (`obj.name`), and refuse a library it cannot cut
// safely (a top-level statement that is not a declaration would be glued to the declaration before it).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shake, shakeModule } from '../films/_kit/shake.mjs';

const LIB = [
  '// a header',
  'const A = 1;',
  'function used(x) {',
  '  const inner = helper(x);',
  '  return inner + A;',
  '}',
  'function helper(x) { return x * 2; }',
  'function unused() { return used(1); }',
  'let $cache = null;',
  'const css = `',
  'function notADeclaration {color:red}',
  '`;',
  'function onlyAsProperty() { return 0; }',
  '',
].join('\n');

test('shake keeps what the root names and what that names in turn', () => {
  const { prelude, body, kept } = shake(LIB, 'STAGE calls used(3)');
  assert.equal(prelude, '// a header\n');
  assert.deepEqual([...kept].sort(), ['A', 'helper', 'used']);
  assert.match(body, /function used/);
  assert.match(body, /function helper/);
  assert.doesNotMatch(body, /function unused/);
  // the kept code runs: what it needs is there
  assert.equal(new Function(`${prelude}${body}; return used(3);`)(), 7);
});

test('shake does not count a property read as a use', () => {
  const { kept } = shake(LIB, 'x.onlyAsProperty(); used(1)');
  assert.ok(!kept.has('onlyAsProperty'));
  const { kept: k2 } = shake(LIB, 'onlyAsProperty()');
  assert.ok(k2.has('onlyAsProperty'));
});

test('shake keeps names with a dollar sign and a template literal as one declaration', () => {
  const { kept, body } = shake(LIB, '$cache css');
  assert.deepEqual([...kept].sort(), ['$cache', 'css']);
  assert.match(body, /notADeclaration \{color:red\}/);
});

test('shake keeps everything when the root names everything (identity)', () => {
  const names = ['A', 'used', 'helper', 'unused', '$cache', 'css', 'onlyAsProperty'];
  const { prelude, body } = shake(LIB, names.join(' '));
  assert.equal(prelude + body, LIB);
});

test('shake refuses a library with a top-level statement that is not a declaration', () => {
  const bad = 'const A = 1;\nwindow.boot = A;\nfunction f() { return A; }\n';
  assert.throws(() => shake(bad, 'f'), /top-level statement/);
  const bad2 = 'function f() {}\nf();\n';
  assert.throws(() => shake(bad2, 'f'), /top-level statement/);
  // a closing line, a comment or a blank line is fine; text inside a template literal is not a statement
  assert.doesNotThrow(() => shake('const t = `\nfoo();\n`;\n// x\nfunction f() {\n}\n', 'f'));
});

test('shakeModule wraps the kept part of an ES module as an object and fails on a missing export', () => {
  const mod = 'import { x } from "./y.mjs";\nexport function a() { return b(); }\nfunction b() { return 2; }\nexport function c() { return 3; }\n';
  const src = shakeModule(mod, 'G', 'G.a()');
  assert.match(src, /^const G = \(\(\) => \{/);
  assert.doesNotMatch(src, /function c/);
  assert.doesNotMatch(src, /import /);
  assert.equal(new Function(`${src}; return G.a();`)(), 2);
  assert.throws(() => shakeModule(mod, 'G', 'G.nope()'), /does not have/);
});
