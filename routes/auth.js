const express = require('express');
const router = express.Router();
const db = require('../db/schema');

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

  const profile = db.createProfile(username, password);
  if (!profile) return res.status(409).json({ error: 'username already exists' });
  const session = db.createSession(profile.id);
  return res.status(201).json({ token: session.token, expires_at: session.expires_at, profile });
});

router.post('/login', (req, res) => {
  if (db.getProfileCount() === 0) {
    return res.status(400).json({ error: 'no profiles exist yet' });
  }
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });

  const profile = db.verifyProfileCredentials(username, password);
  if (!profile) return res.status(401).json({ error: 'invalid username or password' });

  const session = db.createSession(profile.id);
  return res.json({ token: session.token, expires_at: session.expires_at, profile });
});

router.get('/me', (req, res) => {
  if (!req.profile) return res.status(401).json({ error: 'not authenticated' });
  return res.json({ profile: req.profile });
});

router.post('/logout', (req, res) => {
  const auth = String(req.headers.authorization || '');
  if (auth.startsWith('Bearer ')) {
    db.revokeSession(auth.slice(7).trim());
  }
  return res.json({ success: true });
});

module.exports = router;
