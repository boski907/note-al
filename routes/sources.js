const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db/schema');
const { parseFile, truncate, makeSummary } = require('../services/parser');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e6) + path.extname(file.originalname))
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf','.docx','.txt','.md','.csv','.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error('Unsupported type: ' + ext));
  }
});

router.get('/notebooks/:nbId/sources', (req, res) => res.json(db.getSources(req.params.nbId)));

router.delete('/notebooks/:nbId/sources/:srcId', (req, res) => {
  db.deleteSource(req.params.nbId, req.params.srcId);
  db.touchNotebook(req.params.nbId);
  res.json({ success: true });
});

router.post('/sources/upload', upload.single('file'), async (req, res) => {
  const { notebookId } = req.body;
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  if (!notebookId) return res.status(400).json({ error: 'notebookId required' });
  try {
    const raw = await parseFile(req.file.path, req.file.mimetype, req.file.originalname);
    const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    const src = db.createSource(notebookId, req.file.originalname, ext, truncate(raw), makeSummary(raw));
    db.touchNotebook(notebookId);
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(201).json(src);
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: err.message });
  }
});

router.post('/sources/url', async (req, res) => {
  const { notebookId, url } = req.body;
  if (!notebookId || !url) return res.status(400).json({ error: 'notebookId and url required' });
  let content = '';
  try {
    const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(10000) });
    const html = await resp.text();
    content = truncate(html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
  } catch (e) { content = '[Could not fetch: ' + e.message + ']\n\nURL: ' + url; }
  const src = db.createSource(notebookId, url, 'url', content, makeSummary(content));
  db.touchNotebook(notebookId);
  res.status(201).json(src);
});

router.post('/sources/text', (req, res) => {
  const { notebookId, name = 'Pasted text', text } = req.body;
  if (!notebookId || !text) return res.status(400).json({ error: 'notebookId and text required' });
  const src = db.createSource(notebookId, name, 'txt', truncate(text), makeSummary(text));
  db.touchNotebook(notebookId);
  res.status(201).json(src);
});

router.post('/sources/transcript', (req, res) => {
  const { notebookId, name, transcript, type = 'audio' } = req.body;
  if (!notebookId || !transcript) return res.status(400).json({ error: 'notebookId and transcript required' });
  const srcName = name || ('Transcript - ' + new Date().toLocaleString());
  const src = db.createSource(notebookId, srcName, type, truncate(transcript), makeSummary(transcript));
  db.touchNotebook(notebookId);
  res.status(201).json(src);
});

module.exports = router;
