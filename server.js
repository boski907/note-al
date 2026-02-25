require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/schema');

const app = express();
const PORT = process.env.PORT || 3000;
const OWNER_ONLY_MODE = String(process.env.OWNER_ONLY_MODE || '0') === '1';
const OWNER_USERNAME = String(process.env.OWNER_USERNAME || '');
const OWNER_PASSWORD = String(process.env.OWNER_PASSWORD || '');

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm="Notematica Owner Access", charset="UTF-8"');
  return res.status(401).json({ error: 'Owner credentials required' });
}

function ownerOnly(req, res, next) {
  if (!OWNER_ONLY_MODE) return next();
  if (req.path === '/api/health') return next();
  if (!OWNER_USERNAME || !OWNER_PASSWORD) {
    return res.status(503).json({ error: 'OWNER_ONLY_MODE is enabled but owner credentials are not configured' });
  }

  const auth = String(req.headers.authorization || '');
  if (!auth.startsWith('Basic ')) return unauthorized(res);
  const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
  const split = decoded.indexOf(':');
  if (split < 0) return unauthorized(res);

  const username = decoded.slice(0, split);
  const password = decoded.slice(split + 1);
  if (username !== OWNER_USERNAME || password !== OWNER_PASSWORD) return unauthorized(res);
  return next();
}

app.use(ownerOnly);
app.use(express.static(path.join(__dirname, 'public')));

function getBearerToken(req) {
  const auth = String(req.headers.authorization || '');
  if (!auth.startsWith('Bearer ')) return '';
  return auth.slice(7).trim();
}

function sessionAuth(req, res, next) {
  if (!req.path.startsWith('/api')) return next();
  if (req.path === '/api/health') return next();
  if (req.path === '/api/auth/status') return next();
  if (req.path === '/api/auth/bootstrap' && req.method === 'POST') return next();
  if (req.path === '/api/auth/login' && req.method === 'POST') return next();

  const token = getBearerToken(req);
  const profile = token ? db.getProfileByToken(token) : null;
  if (!profile) {
    if (db.getProfileCount() === 0) {
      return res.status(403).json({ error: 'no profiles exist yet; create one via /api/auth/bootstrap' });
    }
    return res.status(401).json({ error: 'authentication required' });
  }
  req.profile = profile;
  req.authToken = token;
  return next();
}

app.use(sessionAuth);

// ── Routes ──────────────────────────────────────────────────────────────────
const authRouter = require('./routes/auth');
const notebooksRouter = require('./routes/notebooks');
const sourcesRouter   = require('./routes/sources');
const chatRouter      = require('./routes/chat');
const transcribeRouter = require('./routes/transcribe');
const profilesRouter = require('./routes/profiles');

app.use('/api/auth', authRouter);
app.use('/api/notebooks', notebooksRouter);
app.use('/api', sourcesRouter);
app.use('/api/chat', chatRouter);
app.use('/api/transcribe', transcribeRouter);
app.use('/api/profiles', profilesRouter);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.OPENAI_API_KEY;
  res.json({
    status: 'ok',
    openai: hasKey ? 'configured' : 'missing — add OPENAI_API_KEY to .env',
    version: '1.0.0'
  });
});

// ── Catch-all: serve frontend ────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Notematica AI is running at http://localhost:${PORT}`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not set — copy .env.example to .env and add your key');
  } else {
    console.log('✅  OpenAI API key detected');
  }
  console.log('   Press Ctrl+C to stop\n');
});

module.exports = app;
