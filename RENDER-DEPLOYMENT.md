# Render deployment (Backend API)

This repo ships a Render blueprint in `render.yaml`:

- Service: `notematica-ai-api` (Node)
- Runtime: `node`
- Plan: `free`
- Health check: `/api/health`
- Secret env vars are marked `sync: false`

## 1) Deploy now (free)
1. Push this folder to GitHub/GitLab/Bitbucket (or use existing repo).
2. In Render, create a new **Blueprint** and point it at this repo + `main` branch.
3. Render reads `render.yaml` and creates one web service.
4. Fill required env vars:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
5. Click **Apply**.
6. Once live, verify: `https://<service>.onrender.com/api/health`

## 2) Connect mobile app
Set `EXPO_PUBLIC_API_URL` in the mobile app env to your Render service URL, for example:

```bash
EXPO_PUBLIC_API_URL=https://notematica-ai-api.onrender.com
```

(Or your custom domain once configured.)

## 3) Upgrade later for Play Store reliability
- Keep **free** now while testing.
- When you need constant availability / longer runtime, open the service settings in Render and change **Plan** from `free` to `starter`.
- If you need a custom domain later, keep the same code and only update:
  - Render service domain / SSL certificate binding
  - mobile `EXPO_PUBLIC_API_URL`

## 4) Notes
- This app’s backend listens on `PORT` from Render automatically (the code defaults to `process.env.PORT || 3000`).
- CORS in production requires `APP_ORIGIN` only if needed for browser web clients.
