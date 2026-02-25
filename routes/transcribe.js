const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { transcribeFile, transcribeYouTube } = require('../services/ai');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB for video
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.mp3','.wav','.m4a','.ogg','.flac','.aac','.mp4','.mov','.webm','.avi','.mkv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) cb(null, true);
    else cb(new Error(`Unsupported file type: ${ext}. Allowed: ${allowedExts.join(', ')}`));
  }
});

// POST /api/transcribe/file  — transcribe an audio or video file via Whisper
router.post('/file', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const transcript = await transcribeFile(req.file.path, req.file.originalname);
    fs.unlinkSync(req.file.path); // clean up
    res.json({ transcript, filename: req.file.originalname });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error('Transcription error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/transcribe/youtube  — extract transcript from YouTube
router.post('/youtube', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url is required' });

  const match = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  if (!match) return res.status(400).json({ error: 'Invalid YouTube URL' });

  const videoId = match[1];
  try {
    const transcript = await transcribeYouTube(videoId);
    res.json({ transcript, videoId, url });
  } catch (err) {
    console.error('YouTube transcript error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
