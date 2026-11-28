import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Every shipped module must be in the service worker shell, or the app breaks offline.
test('service worker precaches every source file', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true })
    .flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
  for (const file of walk('src')) assert.ok(sw.includes(`'${file}'`), `${file} missing from sw.js`);
  for (const file of fs.readdirSync('icons').filter((f) => !f.startsWith('maskable.svg'))) {
    assert.ok(sw.includes(`'icons/${file}'`), `icons/${file} missing from sw.js`);
  }
});

// The Pages deploy copies an explicit list; anything the app loads must be on it.
test('the deploy copies every top-level path the service worker precaches', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  const wf = fs.readFileSync('.github/workflows/pages.yml', 'utf8');
  const cp = (wf.match(/cp -r ([^\n]+) _site\//) || [])[1] || '';
  const copied = new Set(cp.trim().split(/\s+/));
  const shell = [...sw.matchAll(/'([^']+)'/g)].map((m) => m[1]).filter((p) => /^[\w.-]+(\/|$)/.test(p) && !p.startsWith('http'));
  for (const p of shell) {
    if (p === './') continue;
    const top = p.split('/')[0];
    if (!/\./.test(top) && !p.includes('/')) continue;
    assert.ok(copied.has(top), `${p}: '${top}' is not copied by the deploy`);
  }
});

// Runs sw.js in a sandbox with a fake cache and returns its event handlers.
async function loadWorker(store) {
  const vm = await import('node:vm');
  const handlers = {};
  const key = (req) => (typeof req === 'string' ? req : req.url);
  const cache = {
    put: async (req, res) => { store.set(key(req), res); },
    match: async (req) => store.get(key(req)),
    addAll: async () => {},
  };
  const ctx = {
    URL, Request, Response, Promise, console,
    location: { origin: 'https://x.test' },
    self: { addEventListener: (type, fn) => { handlers[type] = fn; } },
    caches: {
      open: async () => cache,
      match: async (req) => store.get(new URL(key(req)).origin + new URL(key(req)).pathname),
      keys: async () => [],
    },
    fetch: async () => new Response('page', { status: 200 }),
    importScripts: (...files) => { for (const f of files) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx); },
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('sw.js', 'utf8'), ctx);
  return handlers;
}

function fire(handlers, url, method = 'GET') {
  const waits = [];
  let response;
  handlers.fetch({
    request: new Request(url, { method }),
    waitUntil: (p) => waits.push(p),
    respondWith: (p) => { response = p; waits.push(p); },
  });
  return Promise.all(waits).then(() => response);
}

test('background refresh stores one entry per path, without the query string', async () => {
  const store = new Map();
  const handlers = await loadWorker(store);
  for (const q of ['?retry=1', '?retry=2', '?theme=dark&lang=en']) await fire(handlers, `https://x.test/src/content/courses/figures/a.html${q}`);
  assert.deepEqual([...store.keys()], ['https://x.test/src/content/courses/figures/a.html']);
});

test('a HEAD request is answered from the cache, so a figure check works offline', async () => {
  const store = new Map([['https://x.test/f.html', new Response('x', { status: 200 })]]);
  const handlers = await loadWorker(store);
  const res = await fire(handlers, 'https://x.test/f.html?theme=dark', 'HEAD');
  assert.ok(res, 'the worker answers HEAD');
  assert.equal((await res).ok, true);
});
