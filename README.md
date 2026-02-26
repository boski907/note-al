# Notematica AI

A full-stack, local-first research assistant inspired by Google NotebookLM.
Upload documents, audio, and video — then chat with your content using real AI.

---

## Quick Start

### 1. Install dependencies
```bash
cd Notematica-AI
npm install
```

### 2. Set up your API key
```bash
cp .env.example .env
```
Open `.env` and paste your OpenAI API key:
```
OPENAI_API_KEY=sk-...your-key-here...
PORT=3000
OWNER_ONLY_MODE=1
OWNER_USERNAME=your-username
OWNER_PASSWORD=your-strong-password
APP_ORIGIN=https://notematica.com
```

`OWNER_ONLY_MODE=1` locks the entire app and API to HTTP Basic Auth using `OWNER_USERNAME` and `OWNER_PASSWORD`.

### 3. Run the app
```bash
npm start
```

Open **http://localhost:3000** in your browser.

---

## Features

| Feature | How it works |
|---|---|
| 📄 PDF / DOCX / TXT upload | Real text extraction via pdf-parse & mammoth |
| 🔗 URL source | Page is fetched and text indexed |
| ✏️ Paste text | Saved directly as a source |
| 🎵 Audio upload | Transcribed via OpenAI Whisper |
| 🎬 Video upload (MP4, MOV…) | Audio track extracted & transcribed via Whisper |
| ▶️ YouTube URL | Captions fetched via youtube-transcript |
| 🎤 Live mic transcript | Browser Web Speech API (Chrome/Edge) |
| 💬 AI Chat | GPT-4o-mini, grounded in your sources |
| 💾 Persistence | SQLite database — notebooks survive restarts |
| 📝 Notes | Saved per notebook in the database |
| 👤 User profiles | Create, edit, delete profiles and change passwords |
| 🔐 Session auth | Sign in/out with profile credentials (bearer token sessions) |
| 🛡️ Security monitoring | Owner-only security event feed (failed logins, lockouts, CSRF/auth failures, account actions) |

---

## Project Structure

```
Notematica-AI/
├── server.js          ← Express server entry point
├── package.json
├── .env               ← Your API key (create from .env.example)
├── notematica.db      ← SQLite database (auto-created on first run)
├── db/
│   └── schema.js      ← Database schema & seeding
├── routes/
│   ├── notebooks.js   ← Notebook, note & message CRUD
│   ├── sources.js     ← File upload, URL & text sources
│   ├── chat.js        ← AI chat endpoint
│   └── transcribe.js  ← Whisper & YouTube transcript
├── services/
│   ├── parser.js      ← PDF, DOCX, TXT parsing
│   └── ai.js          ← OpenAI (GPT + Whisper) integration
├── uploads/           ← Temp storage for uploaded files (auto-cleaned)
└── public/
    └── index.html     ← Full frontend (served by Express)
```

---

## Deploying

### Fly.io (free tier)
```bash
fly launch
fly secrets set OPENAI_API_KEY=sk-...
fly deploy
```

### Railway
1. Push to GitHub
2. Connect repo in Railway dashboard
3. Add `OPENAI_API_KEY` environment variable

### Render
Same as Railway — connect repo, set env var, deploy.

> **Note:** For cloud deployment, replace SQLite with PostgreSQL (use `pg` + `drizzle-orm`).
> SQLite works perfectly for local / single-user use.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notebooks` | List all notebooks |
| POST | `/api/notebooks` | Create notebook |
| PATCH | `/api/notebooks/:id` | Rename notebook |
| DELETE | `/api/notebooks/:id` | Delete notebook |
| GET | `/api/notebooks/:id/sources` | List sources |
| POST | `/api/sources/upload` | Upload file (PDF, DOCX, TXT) |
| POST | `/api/sources/url` | Add URL source |
| POST | `/api/sources/text` | Add pasted text |
| POST | `/api/sources/transcript` | Save transcript as source |
| DELETE | `/api/notebooks/:id/sources/:sid` | Delete source |
| POST | `/api/chat` | Chat with sources |
| POST | `/api/transcribe/file` | Transcribe audio/video |
| POST | `/api/transcribe/youtube` | Extract YouTube captions |
| GET | `/api/profiles` | List profiles (without passwords) |
| POST | `/api/profiles` | Create profile with username/password |
| PATCH | `/api/profiles/:id` | Update profile username |
| PATCH | `/api/profiles/:id/password` | Change profile password |
| DELETE | `/api/profiles/:id` | Delete profile (password confirmation) |
| GET | `/api/auth/status` | Check whether any profiles exist |
| POST | `/api/auth/bootstrap` | Create first account + sign in |
| POST | `/api/auth/login` | Sign in with username/password |
| GET | `/api/auth/me` | Get current signed-in profile |
| POST | `/api/auth/logout` | Sign out and revoke current session |
| GET | `/api/security/events` | Owner-only security event feed |
| GET | `/api/health` | Server health check |

## Owner-only lock

- To lock the app so only you can access it:
  - Set `OWNER_ONLY_MODE=1`
  - Set `OWNER_USERNAME` and `OWNER_PASSWORD`
- Keep `/api/health` public for deployment health checks.

## App sign-in flow

- On first run (no profiles), the app asks you to create the first account.
- After that, all API routes (except health + auth bootstrap/login/status) require sign-in.
- Sessions use HttpOnly cookies (not localStorage tokens) and can be revoked with `POST /api/auth/logout`.
- Login has basic brute-force protection (rate limit + temporary lockout on repeated failures).
- CSRF protection is enforced for state-changing API routes (`POST`, `PATCH`, `PUT`, `DELETE`) after login.
- In production, set `APP_ORIGIN` to your exact frontend origin to tighten CORS.
