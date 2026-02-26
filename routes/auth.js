const express = require('express');
const router = express.Router();
const db = require('../db/schema');

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 8;
const LOCK_MS = 15 * 60 * 1000;
const attempts = new Map();

function nowMs() { return Date.now(); }
function cookieOpts() {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}
function ipKey(req) {
  const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return fwd || req.ip || 'unknown-ip';
}
function limitKey(req, username) {
  return `${ipKey(req)}|${String(username || '').trim().toLowerCase()}`;
}
function getAttemptState(key) {
  const cur = attempts.get(key);
  if (!cur) return { count: 0, firstAt: nowMs(), lockUntil: 0 };
  if (cur.lockUntil && cur.lockUntil > nowMs()) return cur;
  if (nowMs() - cur.firstAt > LOGIN_WINDOW_MS) return { count: 0, firstAt: nowMs(), lockUntil: 0 };
  return cur;
}
function recordFailure(key) {
  const st = getAttemptState(key);
  const count = st.count + 1;
  const out = { count, firstAt: st.firstAt, lockUntil: 0 };
  if (count >= MAX_LOGIN_ATTEMPTS) out.lockUntil = nowMs() + LOCK_MS;
  attempts.set(key, out);
  return out;
}
function clearFailures(key) {
  attempts.delete(key);
}
function requestIp(req) {
  const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return fwd || req.ip || 'unknown-ip';
}

router.get('/status', (req, res) => {
  res.json({ hasProfiles: db.getProfileCount() > 0 });
});

router.post('/bootstrap', (req, res) => {
  if (db.getProfileCount() > 0) {
    return res.status(409).json({ error: 'profiles already exist' });
  }
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  if (username.length < 3) return res.status(400).json({ error: 'username must be at least 3 characters' });
  if (password.length < 8) return res.status(400).json({ error: 'password must be at least 8 characters' });

  const profile = db.createProfile(username, password, 'owner');
  if (!profile) return res.status(409).json({ error: 'username already exists' });
  const session = db.createSession(profile.id);
  db.logSecurityEvent('owner_bootstrap', 'medium', 'Owner account bootstrapped', {
    username: profile.username,
    ip: requestIp(req)
  });
  res.cookie('notematica_session', session.token, cookieOpts());
  return res.status(201).json({ expires_at: session.expires_at, csrfToken: session.csrf_token, profile });
});

router.post('/login', (req, res) => {
  if (db.getProfileCount() === 0) {
    return res.status(400).json({ error: 'no profiles exist yet' });
  }
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });
  const key = limitKey(req, username);
  const st = getAttemptState(key);
  if (st.lockUntil && st.lockUntil > nowMs()) {
    db.logSecurityEvent('login_locked', 'high', 'Login blocked by temporary lockout', {
      username,
      ip: requestIp(req)
    });
    return res.status(429).json({ error: 'too many login attempts; try again later' });
  }

  const profile = db.verifyProfileCredentials(username, password);
  if (!profile) {
    const failed = recordFailure(key);
    db.logSecurityEvent('login_failed', failed.lockUntil ? 'high' : 'medium', 'Invalid login attempt', {
      username,
      ip: requestIp(req),
      failures: failed.count,
      locked: !!failed.lockUntil
    });
    return res.status(401).json({ error: 'invalid username or password' });
  }
  clearFailures(key);

  const session = db.createSession(profile.id);
  db.logSecurityEvent('login_success', 'low', 'User login success', {
    username: profile.username,
    role: profile.role,
    ip: requestIp(req)
  });
  res.cookie('notematica_session', session.token, cookieOpts());
  return res.json({ expires_at: session.expires_at, csrfToken: session.csrf_token, profile });
});

router.get('/me', (req, res) => {
  if (!req.profile) return res.status(401).json({ error: 'not authenticated' });
  return res.json({ profile: req.profile, csrfToken: String(req.csrfToken || '') });
});

router.post('/logout', (req, res) => {
  const auth = String(req.headers.authorization || '');
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const token = bearer || String(req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith('notematica_session='))?.split('=')[1] || '';
  db.logSecurityEvent('logout', 'low', 'User logout', {
    username: req.profile ? req.profile.username : 'unknown',
    ip: requestIp(req)
  });
  if (token) db.revokeSession(decodeURIComponent(token));
  res.clearCookie('notematica_session', { path: '/' });
  return res.json({ success: true });
});

module.exports = router;
