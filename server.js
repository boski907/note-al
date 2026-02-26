require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/schema');

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const APP_ORIGIN = String(process.env.APP_ORIGIN || '');
const OWNER_ONLY_MODE = String(process.env.OWNER_ONLY_MODE || '0') === '1';
const OWNER_USERNAME = String(process.env.OWNER_USERNAME || '');
const OWNER_PASSWORD = String(process.env.OWNER_PASSWORD || '');

function getClientIp(req) {
  const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return fwd || req.ip || 'unknown-ip';
}

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (!IS_PROD) return cb(null, true);
    if (!APP_ORIGIN) return cb(null, false);
    return cb(null, origin === APP_ORIGIN);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  if (IS_PROD) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://img.youtube.com; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"
  );
  return next();
});

function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm="Notematica Owner Access", charset="UTF-8"');
  return res.status(401).json({ error: 'Owner credentials required' });
}

function ownerOnly(req, res, next) {
  if (!OWNER_ONLY_MODE) return next();
  if (req.path === '/api/health') return next();
  if (!OWNER_USERNAME || !OWNER_PASSWORD) {
    db.logSecurityEvent('owner_mode_misconfigured', 'high', 'Owner-only mode enabled without credentials', {
      path: req.path,
      ip: getClientIp(req),
      method: req.method
    });
    return res.status(503).json({ error: 'OWNER_ONLY_MODE is enabled but owner credentials are not configured' });
  }

  const auth = String(req.headers.authorization || '');
  if (!auth.startsWith('Basic ')) {
    db.logSecurityEvent('owner_basic_auth_missing', 'medium', 'Missing owner basic auth header', {
      path: req.path,
      ip: getClientIp(req),
      method: req.method
    });
    return unauthorized(res);
  }
  const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
  const split = decoded.indexOf(':');
  if (split < 0) {
    db.logSecurityEvent('owner_basic_auth_malformed', 'medium', 'Malformed owner basic auth header', {
      path: req.path,
      ip: getClientIp(req),
      method: req.method
    });
    return unauthorized(res);
  }

  const username = decoded.slice(0, split);
  const password = decoded.slice(split + 1);
  if (username !== OWNER_USERNAME || password !== OWNER_PASSWORD) {
    db.logSecurityEvent('owner_basic_auth_failed', 'high', 'Invalid owner basic auth credentials', {
      path: req.path,
      ip: getClientIp(req),
      method: req.method,
      username
    });
    return unauthorized(res);
  }
  return next();
}

app.use(ownerOnly);
app.use(express.static(path.join(__dirname, 'public')));

function parseCookies(req) {
  const raw = String(req.headers.cookie || '');
  if (!raw) return {};
  return raw.split(';').reduce((acc, pair) => {
    const idx = pair.indexOf('=');
    if (idx < 0) return acc;
    const key = pair.slice(0, idx).trim();
    const value = decodeURIComponent(pair.slice(idx + 1).trim());
    if (key) acc[key] = value;
    return acc;
  }, {});
}

function getSessionToken(req) {
  const auth = String(req.headers.authorization || '');
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
  const cookies = parseCookies(req);
  return String(cookies.notematica_session || '');
}

function sessionAuth(req, res, next) {
  if (!req.path.startsWith('/api')) return next();
  if (req.path === '/api/health') return next();
  if (req.path === '/api/auth/status') return next();
  if (req.path === '/api/auth/bootstrap' && req.method === 'POST') return next();
  if (req.path === '/api/auth/login' && req.method === 'POST') return next();

  const token = getSessionToken(req);
  const session = token ? db.getSessionByToken(token) : null;
  if (!session) {
    if (db.getProfileCount() === 0) {
      return res.status(403).json({ error: 'no profiles exist yet; create one via /api/auth/bootstrap' });
    }
    db.logSecurityEvent('session_auth_failed', 'medium', 'Session auth failed', {
      path: req.path,
      ip: getClientIp(req),
      method: req.method
    });
    return res.status(401).json({ error: 'authentication required' });
  }
  req.profile = session.profile;
  req.csrfToken = String(session.csrf_token || '');
  req.authToken = token;
  return next();
}

app.use(sessionAuth);

function csrfProtection(req, res, next) {
  if (!req.path.startsWith('/api')) return next();
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
  if (req.path === '/api/auth/bootstrap') return next();
  if (req.path === '/api/auth/login') return next();
  if (req.path === '/api/health') return next();
  const token = String(req.headers['x-csrf-token'] || '');
  if (!req.csrfToken || !token || token !== req.csrfToken) {
    db.logSecurityEvent('csrf_failed', 'high', 'Invalid CSRF token', {
      path: req.path,
      ip: getClientIp(req),
      method: req.method
    });
    return res.status(403).json({ error: 'invalid csrf token' });
  }
  return next();
}

app.use(csrfProtection);

// ── Routes ──────────────────────────────────────────────────────────────────
const authRouter = require('./routes/auth');
const notebooksRouter = require('./routes/notebooks');
const sourcesRouter   = require('./routes/sources');
const chatRouter      = require('./routes/chat');
const transcribeRouter = require('./routes/transcribe');
const profilesRouter = require('./routes/profiles');
const securityRouter = require('./routes/security');

app.use('/api/auth', authRouter);
app.use('/api/notebooks', notebooksRouter);
app.use('/api', sourcesRouter);
app.use('/api/chat', chatRouter);
app.use('/api/transcribe', transcribeRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/security', securityRouter);

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
