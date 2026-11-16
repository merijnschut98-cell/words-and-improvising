// Dev tool, not shipped. A tree shake for the script libraries a film page inlines (Task 17, pilot P1: the four CNC
// films). A page that draws a machine with the anatomy kit would otherwise carry the whole kit (35 KB) and the whole
// lathe module (48 KB); shake keeps only the top-level declarations the film's own script names, and what those name
// in turn. Tests: tests/shake.test.js.
//
// The rule is textual and errs on the side of keeping: a declaration stays when a kept text mentions its name as a
// whole word (not as a property, `obj.name`); a string or a comment that mentions it also keeps it (a superset, never
// less). It only understands a library made of top-level `function`, `const` and `let` declarations, each starting at
// column 0; a top-level statement that is not one of those (a call, an assignment, a class) would be glued to the
// declaration before it and could be dropped with it, so shake refuses such a library instead of guessing.
//
//   import { shake, shakeModule } from '../_kit/shake.mjs';
//   const kit = shake(kitScript(), stageText);          // { prelude, body, kept }: page script `${prelude}${body}`
//   const lathe = shakeModule(latheSource, 'G', stageText); // 'const G = (() => { ... return { a, b }; })();'

const word = (n) => new RegExp(`(?<![\\w$.])${n.replace(/\$/g, '\\$')}(?![\\w$])`);

// The declarations of a library: every line at column 0 outside a template literal must open a declaration
// (`function`, `const`, `let`) or be a comment, a blank line or a closing bracket; anything else is a top-level
// statement shake cannot place. A line inside a template literal (CSS, markup) never opens a declaration.
function declarationsOf(source) {
  const starts = [];
  let inTemplate = false;
  let at = 0;
  source.split('\n').forEach((line, i) => {
    const startsInTemplate = inTemplate;
    const ticks = (line.replace(/\\`/g, '').match(/`/g) || []).length;
    if (ticks % 2) inTemplate = !inTemplate;
    const here = at;
    at += line.length + 1;
    if (startsInTemplate || !/^\S/.test(line)) return;
    const m = /^(?:function|const|let) ([A-Za-z0-9_$]+)/.exec(line);
    if (m) { starts.push({ name: m[1], index: here }); return; }
    if (/^(?:\/\/|\/\*|\*|[}\])])/.test(line)) return;
    throw new Error(`shake: line ${i + 1} is a top-level statement, not a declaration (${line.slice(0, 60)}); shake cannot cut this library safely`);
  });
  return starts;
}

export function shake(source, rootText) {
  const starts = declarationsOf(source);
  if (!starts.length) return { prelude: source, body: '', kept: new Set() };
  const chunks = starts.map((d, i) => ({ name: d.name, text: source.slice(d.index, i + 1 < starts.length ? starts[i + 1].index : source.length) }));
  const kept = new Set();
  const visit = (c) => {
    if (kept.has(c.name)) return;
    kept.add(c.name);
    for (const o of chunks) if (!kept.has(o.name) && word(o.name).test(c.text)) visit(o);
  };
  for (const c of chunks) if (word(c.name).test(rootText)) visit(c);
  return { prelude: source.slice(0, starts[0].index), body: chunks.filter((c) => kept.has(c.name)).map((c) => c.text).join(''), kept };
}

// An ES module (its source text) as one object `name` holding the functions the root text calls as `name.fn`:
// imports and `export` keywords are dropped, the rest is shaken. Fails when the root calls a function the module
// does not declare.
export function shakeModule(moduleSource, name, rootText) {
  const source = moduleSource.replace(/^import .*$/gm, '').replace(/^export /gm, '');
  const used = [...new Set([...rootText.matchAll(new RegExp(`\\b${name}\\.([A-Za-z0-9_$]+)`, 'g'))].map((m) => m[1]))];
  const { prelude, body } = shake(source, used.join(' '));
  for (const n of used) if (!new RegExp(`^(?:function|const|let) ${n.replace(/\$/g, '\\$')}\\b`, 'm').test(body)) throw new Error(`shake: the stage calls ${name}.${n}, which the module does not have`);
  return `const ${name} = (() => {${prelude}${body}\nreturn { ${used.join(', ')} };})();\n`;
}
