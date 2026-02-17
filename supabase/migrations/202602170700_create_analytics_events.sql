-- AI Note App: analytics event table

begin;

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  event_name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_events_user_created_at
  on public.analytics_events (user_id, created_at desc);

create index if not exists idx_analytics_events_event_name
  on public.analytics_events (event_name);

alter table public.analytics_events enable row level security;

drop policy if exists "analytics_events_select_own" on public.analytics_events;
create policy "analytics_events_select_own"
on public.analytics_events
for select
to authenticated
using (auth.uid()::text = user_id);

drop policy if exists "analytics_events_insert_own" on public.analytics_events;
create policy "analytics_events_insert_own"
on public.analytics_events
for insert
to authenticated
with check (auth.uid()::text = user_id);

commit;

