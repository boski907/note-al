const https = require('https');

const WEBHOOK_URL = String(process.env.DISCORD_WEBHOOK_URL || '');
const ALERTS_ENABLED = String(process.env.DISCORD_ALERTS_ENABLED || '1') === '1';
const MIN_SEVERITY = String(process.env.DISCORD_ALERT_MIN_SEVERITY || 'medium').toLowerCase();

const SEVERITY_RANK = { low: 1, medium: 2, high: 3 };

function shouldSend(severity) {
  if (!ALERTS_ENABLED || !WEBHOOK_URL) return false;
  const min = SEVERITY_RANK[MIN_SEVERITY] || 2;
  const cur = SEVERITY_RANK[String(severity || '').toLowerCase()] || 1;
  return cur >= min;
}

function requestJson(url, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const u = new URL(url);
    const req = https.request(
      {
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: `${u.pathname}${u.search}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      },
      (res) => {
        let data = '';
        res.on('data', (d) => { data += d; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) return resolve();
          return reject(new Error(`Discord webhook HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function sendSecurityAlert(event) {
  if (!shouldSend(event && event.severity)) return;
  const ev = event || {};
  const sev = String(ev.severity || 'low').toUpperCase();
  const at = ev.created_at || new Date().toISOString();
  const meta = ev.meta && typeof ev.meta === 'object' ? ev.meta : {};
  const metaSummary = Object.keys(meta).length
    ? ` | ${Object.entries(meta).slice(0, 6).map(([k, v]) => `${k}=${String(v)}`).join(' ')}`
    : '';

  const content = `[${sev}] ${ev.message || ev.type || 'Security event'} | type=${ev.type || 'unknown'} | at=${at}${metaSummary}`;
  await requestJson(WEBHOOK_URL, { content });
}

module.exports = { sendSecurityAlert };
