const express = require('express');
const router = express.Router();
const db = require('../db/schema');
const { chatWithSources } = require('../services/ai');

router.post('/', async (req, res) => {
  const { notebookId, message } = req.body;
  if (!notebookId || !message) return res.status(400).json({ error: 'notebookId and message required' });

  const sources = db.getSourcesWithContent(notebookId);
  const history = db.getMessages(notebookId).slice(-20);

  db.addMessage(notebookId, 'user', message);

  try {
    const reply = await chatWithSources(message, sources, history);
    db.addMessage(notebookId, 'assistant', reply);
    db.touchNotebook(notebookId);
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
