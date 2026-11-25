// Zero-dependency local HTTP server for interactive 60fps MV preview (`http://127.0.0.1:8080/mv.html`)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const B3D_DIR = process.env.CORTEX_3D_DIR || (fs.existsSync('F:\\cortex_v6_3d') ? 'F:\\cortex_v6_3d' : path.join(ROOT, 'v6_3d'));
const PORT = Number(process.env.PORT || 8080);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
};

http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const rel = urlPath === '/' ? '/mv.html' : urlPath;
  const fullPath = rel.startsWith('/v6_3d/')
    ? path.join(B3D_DIR, rel.slice('/v6_3d/'.length))
    : path.join(ROOT, rel);

  if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  const ext = path.extname(fullPath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(fullPath).pipe(res);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`CORTEX MV interactive server ready -> http://127.0.0.1:${PORT}/mv.html`);
});
