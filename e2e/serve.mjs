// Static file server for the e2e scripts, serving the worktree this file lives in.
// Port: E2E_PORT if set (override, fails loudly when taken), else a free port
// chosen by the OS (listen on 0), so parallel runs never collide. The server is
// in-process: nothing is spawned, so nothing else's process can be killed.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = {
  html: 'text/html', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json',
  webmanifest: 'application/manifest+json', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  webp: 'image/webp', gif: 'image/gif', ico: 'image/x-icon', mp4: 'video/mp4', webm: 'video/webm', vtt: 'text/vtt',
  txt: 'text/plain', md: 'text/markdown', woff: 'font/woff', woff2: 'font/woff2', mp3: 'audio/mpeg', wav: 'audio/wav',
};

export async function startServer() {
  const server = http.createServer((req, res) => {
    let rel;
    try { rel = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400).end(); return; }
    let file = path.join(ROOT, rel);
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) { res.writeHead(403).end(); return; }
    try { if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html'); } catch { /* 404 below */ }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404).end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).slice(1).toLowerCase()] || 'application/octet-stream', 'Content-Length': buf.length });
      res.end(buf);
    });
  });
  const want = process.env.E2E_PORT ? Number(process.env.E2E_PORT) : 0;
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(want, resolve); });
  const port = server.address().port;
  console.log(`e2e server: ${ROOT} on http://localhost:${port}/${process.env.E2E_PORT ? ' (E2E_PORT)' : ' (free port)'}`);
  let closed = false;
  const stop = () => { if (closed) return; closed = true; server.closeAllConnections?.(); server.close(); };
  process.on('exit', stop);
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { stop(); process.exit(130); });
  return { port, base: `http://localhost:${port}/`, stop };
}
