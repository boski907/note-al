const express = require('express');
const router = express.Router();
const db = require('../db/schema');

function requireOwner(req, res, next) {
  if (!req.profile || req.profile.role !== 'owner') {
    return res.status(403).json({ error: 'owner access required' });
  }
  return next();
}

router.get('/events', requireOwner, (req, res) => {
  const limit = Number(req.query.limit || 200);
  res.json({ events: db.getSecurityEvents(limit) });
});

module.exports = router;
