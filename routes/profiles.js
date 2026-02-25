const express = require('express');
const router = express.Router();
const db = require('../db/schema');

router.get('/', (req, res) => {
  res.json(db.getProfiles());
});

router.post('/', (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');

  if (username.length < 3) return res.status(400).json({ error: 'username must be at least 3 characters' });
  if (password.length < 8) return res.status(400).json({ error: 'password must be at least 8 characters' });

  const profile = db.createProfile(username, password);
  if (!profile) return res.status(409).json({ error: 'username already exists' });
  return res.status(201).json(profile);
});

router.patch('/:id', (req, res) => {
  const username = String(req.body.username || '').trim();
  if (username.length < 3) return res.status(400).json({ error: 'username must be at least 3 characters' });

  const out = db.updateProfile(req.params.id, username);
  if (out?.error === 'not_found') return res.status(404).json({ error: 'profile not found' });
  if (out?.error === 'duplicate') return res.status(409).json({ error: 'username already exists' });
  return res.json(out);
});

router.patch('/:id/password', (req, res) => {
  const currentPassword = String(req.body.currentPassword || '');
  const newPassword = String(req.body.newPassword || '');
  if (!currentPassword) return res.status(400).json({ error: 'currentPassword required' });
  if (newPassword.length < 8) return res.status(400).json({ error: 'newPassword must be at least 8 characters' });

  const out = db.updateProfilePassword(req.params.id, currentPassword, newPassword);
  if (out?.error === 'not_found') return res.status(404).json({ error: 'profile not found' });
  if (out?.error === 'bad_password') return res.status(401).json({ error: 'current password is incorrect' });
  return res.json(out);
});

router.delete('/:id', (req, res) => {
  const password = String(req.body.password || '');
  if (!password) return res.status(400).json({ error: 'password required to delete profile' });

  const out = db.deleteProfile(req.params.id, password);
  if (out?.error === 'not_found') return res.status(404).json({ error: 'profile not found' });
  if (out?.error === 'bad_password') return res.status(401).json({ error: 'password is incorrect' });
  return res.json({ success: true });
});

module.exports = router;
