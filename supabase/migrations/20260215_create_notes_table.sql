-- AI Note App: notes table and indexes
-- Run in Supabase SQL editor or via Supabase CLI migration tooling.

begin;

create table if not exists public.notes (
  id text primary key,
  user_id text not null,
  title text not null default 'Untitled',
  content_text text not null default '',
  content_html text not null default '',
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notes_tags_is_array check (jsonb_typeof(tags) = 'array')
);

create or replace function public.set_notes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_notes_updated_at on public.notes;
create trigger trg_set_notes_updated_at
before update on public.notes
for each row
execute function public.set_notes_updated_at();

create index if not exists idx_notes_user_updated_at
  on public.notes (user_id, updated_at desc);

create index if not exists idx_notes_user_id
  on public.notes (user_id);

create index if not exists idx_notes_tags_gin
  on public.notes
  using gin (tags);

create index if not exists idx_notes_content_fts
  on public.notes
  using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content_text, '')));

alter table public.notes enable row level security;

drop policy if exists "notes_select_own" on public.notes;
create policy "notes_select_own"
on public.notes
for select
to authenticated
using (auth.uid()::text = user_id);

drop policy if exists "notes_insert_own" on public.notes;
create policy "notes_insert_own"
on public.notes
for insert
to authenticated
with check (auth.uid()::text = user_id);

drop policy if exists "notes_update_own" on public.notes;
create policy "notes_update_own"
on public.notes
for update
to authenticated
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "notes_delete_own" on public.notes;
create policy "notes_delete_own"
on public.notes
for delete
to authenticated
using (auth.uid()::text = user_id);

commit;
