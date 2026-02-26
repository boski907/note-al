const express = require('express');
const router = express.Router();
const db = require('../db/schema');

function requireOwner(req, res, next) {
  if (!req.profile || req.profile.role !== 'owner') {
    return res.status(403).json({ error: 'owner access required' });
  }
  return next();
}

// Owners can view sanitized user directory (no passwords or personal data).
router.get('/', requireOwner, (req, res) => {
  res.json(db.getProfiles());
});

// Any signed-in user can view only their own profile.
router.get('/me', (req, res) => {
  const me = db.getProfilePublic(req.profile.id);
  if (!me) return res.status(404).json({ error: 'profile not found' });
  res.json(me);
});

// Any signed-in user can edit only their own username.
router.patch('/me', (req, res) => {
  const username = String(req.body.username || '').trim();
  if (username.length < 3) return res.status(400).json({ error: 'username must be at least 3 characters' });

  const out = db.updateOwnProfile(req.profile.id, username);
  if (out?.error === 'not_found') return res.status(404).json({ error: 'profile not found' });
  if (out?.error === 'duplicate') return res.status(409).json({ error: 'username already exists' });
  return res.json(out);
});

// Any signed-in user can change only their own password.
router.patch('/me/password', (req, res) => {
  const currentPassword = String(req.body.currentPassword || '');
  const newPassword = String(req.body.newPassword || '');
  if (!currentPassword) return res.status(400).json({ error: 'currentPassword required' });
  if (newPassword.length < 8) return res.status(400).json({ error: 'newPassword must be at least 8 characters' });

  const out = db.updateOwnProfilePassword(req.profile.id, currentPassword, newPassword);
  if (out?.error === 'not_found') return res.status(404).json({ error: 'profile not found' });
  if (out?.error === 'bad_password') return res.status(401).json({ error: 'current password is incorrect' });
  return res.json(out);
});

// Any signed-in user can delete only their own account, but never the last owner.
router.delete('/me', (req, res) => {
  const password = String(req.body.password || '');
  if (!password) return res.status(400).json({ error: 'password required to delete account' });

  const out = db.deleteOwnProfile(req.profile.id, password);
  if (out?.error === 'not_found') return res.status(404).json({ error: 'profile not found' });
  if (out?.error === 'bad_password') return res.status(401).json({ error: 'password is incorrect' });
  if (out?.error === 'last_owner') return res.status(409).json({ error: 'cannot delete the last owner account' });
  return res.json({ success: true });
});

module.exports = router;
