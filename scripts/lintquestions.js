// Question lint command line (v18 F2). A dev tool, not loaded by the app. The rules are in
// src/core/questionlint.js (the browser runs them too, for the AI test generator); this file re-exports
// them and adds the run over the real course content.
import { RULES, hasAbsolute, lintQuestion, lintModule, lintBank, lintAll, countsOf } from '../src/core/questionlint.js';

export { RULES, hasAbsolute, lintQuestion, lintModule, lintBank, lintAll, countsOf };

export async function main(argv = []) {
  const { MODULES, loadModule } = await import('../src/content/courses/index.js');
  const findings = await lintAll(MODULES, loadModule);
  // test banks, for the modules that have one (v18 T1)
  const { loadBank } = await import('../src/content/courses/index.js');
  for (const m of MODULES) {
    for (const lang of ['nl', 'en']) {
      const bank = await loadBank(m.id, lang);
      if (bank) findings.push(...lintBank(bank, m, lang, (await loadModule(m.subject, m.id, lang)).lessons));
    }
  }
  const counts = countsOf(findings);
  if (argv.includes('--json')) { console.log(JSON.stringify(counts, null, 2)); return; }
  if (argv.includes('--list')) { for (const f of findings) console.log(`${f.id} [${f.lang}] ${f.rule}: ${f.detail} | ${f.q}`); return; }
  const perRule = Object.fromEntries(RULES.map((r) => [r, findings.filter((f) => f.rule === r).length]));
  console.log('findings per rule (nl + en):');
  for (const r of RULES) console.log(`  ${r.padEnd(11)} ${perRule[r]}`);
  console.log(`  total       ${findings.length}`);
  console.log('\nfindings per module:');
  const rows = Object.entries(counts).map(([m, rs]) => [m, Object.values(rs).reduce((a, b) => a + b, 0), rs]).sort((a, b) => b[1] - a[1]);
  for (const [m, n, rs] of rows) console.log(`  ${m.padEnd(22)} ${String(n).padStart(4)}  ${Object.entries(rs).map(([r, c]) => `${r}:${c}`).join(' ')}`);
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]) {
  const { pathToFileURL } = await import('node:url');
  if (import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2));
}
