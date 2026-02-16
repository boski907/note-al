-- AI Note App: flashcards table, indexes, and RLS policies

begin;

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  note_id text,
  front text not null,
  back text not null,
  tags jsonb not null default '[]'::jsonb,
  ease real not null default 2.5,
  interval_days integer not null default 0,
  reps integer not null default 0,
  lapses integer not null default 0,
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint flashcards_tags_is_array check (jsonb_typeof(tags) = 'array'),
  constraint flashcards_note_fk foreign key (note_id) references public.notes(id) on delete set null
);

create or replace function public.set_flashcards_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_flashcards_updated_at on public.flashcards;
create trigger trg_set_flashcards_updated_at
before update on public.flashcards
for each row
execute function public.set_flashcards_updated_at();

create index if not exists idx_flashcards_user_due
  on public.flashcards (user_id, due_at asc);

create index if not exists idx_flashcards_user_note
  on public.flashcards (user_id, note_id);

create index if not exists idx_flashcards_tags_gin
  on public.flashcards using gin (tags);

alter table public.flashcards enable row level security;

drop policy if exists "flashcards_select_own" on public.flashcards;
create policy "flashcards_select_own"
on public.flashcards
for select
to authenticated
using (auth.uid()::text = user_id);

drop policy if exists "flashcards_insert_own" on public.flashcards;
create policy "flashcards_insert_own"
on public.flashcards
for insert
to authenticated
with check (auth.uid()::text = user_id);

drop policy if exists "flashcards_update_own" on public.flashcards;
create policy "flashcards_update_own"
on public.flashcards
for update
to authenticated
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "flashcards_delete_own" on public.flashcards;
create policy "flashcards_delete_own"
on public.flashcards
for delete
to authenticated
using (auth.uid()::text = user_id);

commit;
