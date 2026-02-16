# AI Note App

AI note-taking app with:

- Supabase Auth (email/password)
- Supabase RLS-backed notes storage
- Rich-text editor
- Tagging + search
- Voice note transcription
- AI note actions (summarize, improve, tasks)

## Setup

1. Install Node.js 18+.
2. Copy `.env.example` to `.env`.
3. Set:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - (optional ads) `ADSENSE_CLIENT`, `ADSENSE_SLOT_BOTTOM`, `ADSENSE_SLOT_BREAK`
   - (optional ad-free subscription) `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_ADFREE_599`, `APP_BASE_URL`
   - (optional but recommended) `STRIPE_WEBHOOK_SECRET`
4. Start the app:

```bash
npm start
```

5. Open [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Supabase Migration

Run:

- `supabase/migrations/20260215_create_notes_table.sql`
- `supabase/migrations/202602160910_create_flashcards_table.sql`
- `supabase/migrations/202602160900_create_billing_profiles.sql`

It creates:

- `public.notes` table
- `public.flashcards` table (spaced repetition fields)
- update trigger for `updated_at`
- indexes (`user_id`, `user_id+updated_at`, tags GIN, full-text GIN)
- RLS policies for owner-only CRUD

## Security Model

- Runtime note operations use user JWT + RLS (`SUPABASE_ANON_KEY`), not `service_role`.
- Keep `SUPABASE_SERVICE_ROLE_KEY` out of client/runtime paths.
- Rotate secrets if they were shared in chat.

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/notes`
- `POST /api/notes`
- `DELETE /api/notes/:id`
- `GET /api/flashcards?due=1`
- `POST /api/flashcards`
- `DELETE /api/flashcards/:id`
- `POST /api/flashcards/generate`
- `POST /api/flashcards/review`
- `GET /api/flashcards/stats`
- `POST /api/ai`
- `POST /api/transcribe`
- `POST /api/testprep/generate`
- `GET /api/billing/status`
- `POST /api/billing/create-checkout-session`
- `POST /api/billing/portal`
- `POST /api/stripe/webhook`

## Stripe Webhook Setup

Configure a Stripe webhook endpoint to auto-sync subscription status:

- Endpoint URL: `https://your-domain.com/api/stripe/webhook`
- Events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

Add the webhook signing secret to `.env`:

- `STRIPE_WEBHOOK_SECRET=whsec_...`

Local testing example with Stripe CLI:

```bash
stripe listen --forward-to http://127.0.0.1:3000/api/stripe/webhook
```
