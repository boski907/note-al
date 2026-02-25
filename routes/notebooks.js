const express = require('express');
const router = express.Router();
const db = require('../db/schema');

router.get('/', (req, res) => res.json(db.getNotebooks()));

router.post('/', (req, res) => {
  const { name = 'Untitled Notebook' } = req.body;
  res.status(201).json(db.createNotebook(name.trim() || 'Untitled Notebook'));
});

router.get('/:id', (req, res) => {
  const nb = db.getNotebook(req.params.id);
  if (!nb) return res.status(404).json({ error: 'Not found' });
  res.json(nb);
});

router.patch('/:id', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const nb = db.updateNotebook(req.params.id, name.trim());
  if (!nb) return res.status(404).json({ error: 'Not found' });
  res.json(nb);
});

router.delete('/:id', (req, res) => {
  db.deleteNotebook(req.params.id);
  res.json({ success: true });
});

// Notes
router.get('/:id/notes', (req, res) => res.json(db.getNotes(req.params.id)));

router.post('/:id/notes', (req, res) => {
  const { title = 'Note', body = '' } = req.body;
  res.status(201).json(db.addNote(req.params.id, title, body));
});

router.delete('/:id/notes/:noteId', (req, res) => {
  db.deleteNote(req.params.id, req.params.noteId);
  res.json({ success: true });
});

// Messages
router.get('/:id/messages', (req, res) => res.json(db.getMessages(req.params.id)));

router.delete('/:id/messages', (req, res) => {
  db.deleteMessages(req.params.id);
  res.json({ success: true });
});

module.exports = router;
