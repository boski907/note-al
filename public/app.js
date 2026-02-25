const healthEl = document.getElementById('health');
const outputEl = document.getElementById('output');
const healthBtn = document.getElementById('health-btn');
const echoBtn = document.getElementById('echo-btn');

async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    healthEl.textContent = data.ok ? 'API: healthy' : 'API: error';
    outputEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    healthEl.textContent = 'API: unreachable';
    outputEl.textContent = `Health check failed: ${err.message}`;
  }
}

async function testEcho() {
  try {
    const res = await fetch('/api/echo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hello: 'world', at: new Date().toISOString() })
    });
    const data = await res.json();
    outputEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    outputEl.textContent = `Echo failed: ${err.message}`;
  }
}

healthBtn.addEventListener('click', checkHealth);
echoBtn.addEventListener('click', testEcho);
checkHealth();
