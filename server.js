require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ──────────────────────────────────────────────────────────────────
const notebooksRouter = require('./routes/notebooks');
const sourcesRouter   = require('./routes/sources');
const chatRouter      = require('./routes/chat');
const transcribeRouter = require('./routes/transcribe');

app.use('/api/notebooks', notebooksRouter);
app.use('/api', sourcesRouter);
app.use('/api/chat', chatRouter);
app.use('/api/transcribe', transcribeRouter);

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
