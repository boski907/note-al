# AGENTS.md

## Purpose
Repository instructions for AI coding agents (Codex, Claude, and similar tools).

## Project Snapshot
- Stack: Node.js app (`server.js`) with static frontend in `public/`
- Mobile wrapper: Capacitor project in `mobile/`
- Data files: JSON files in `data/`
- Database migrations: `supabase/migrations/`

## Local Setup
1. Use Node.js 18+.
2. Copy `.env.example` to `.env` and fill required values.
3. Install deps with `npm install`.
4. Run with `npm start`.

## Safe Working Rules
- Do not commit secrets from `.env`.
- Do not delete or rewrite `data/*.json` unless explicitly requested.
- Keep edits focused; avoid broad refactors unless asked.
- Prefer minimal, reversible changes.

## Code Conventions
- Keep server logic in `server.js` style (plain JS, clear helper functions).
- Keep frontend changes small and aligned with existing structure in `public/`.
- Avoid adding heavy dependencies without a clear need.

## Validation
- For server/frontend changes, run:
  - `npm start` (smoke test app boots)
- For mobile-only changes, use commands documented in `mobile/README.md`.

## Pull Request Checklist
- Explain what changed and why.
- List manual verification steps.
- Mention any new env vars or migration requirements.
