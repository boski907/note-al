-- AI Note App: per-user usage counters + atomic quota consume RPC (for abuse limits / free vs premium)

begin;

create table if not exists public.usage_counters (
  user_id text not null,
  scope text not null,
  period text not null,
  period_start date not null,
  count integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint usage_counters_count_nonnegative check (count >= 0),
  constraint usage_counters_period_valid check (period in ('day','month')),
  primary key (user_id, scope, period, period_start)
);

create index if not exists idx_usage_counters_user_period
  on public.usage_counters (user_id, period, period_start desc);

alter table public.usage_counters enable row level security;

drop policy if exists "usage_counters_select_own" on public.usage_counters;
create policy "usage_counters_select_own"
on public.usage_counters
for select
to authenticated
using (auth.uid()::text = user_id);

drop policy if exists "usage_counters_insert_own" on public.usage_counters;
create policy "usage_counters_insert_own"
on public.usage_counters
for insert
to authenticated
with check (auth.uid()::text = user_id);

drop policy if exists "usage_counters_update_own" on public.usage_counters;
create policy "usage_counters_update_own"
on public.usage_counters
for update
to authenticated
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

-- Atomically consume quota for the current user (auth.uid()).
-- This prevents race conditions and avoids client-side counter manipulation (only increments; never decrements).
create or replace function public.try_consume_usage(
  scope text,
  period text,
  period_start date,
  inc integer,
  quota_limit integer
)
returns table(ok boolean, used integer)
language plpgsql
security invoker
as $$
declare
  uid text := auth.uid()::text;
  cur integer;
begin
  if uid is null then
    raise exception 'unauthorized';
  end if;

  if scope is null or length(trim(scope)) = 0 then
    raise exception 'scope_required';
  end if;

  if period not in ('day','month') then
    raise exception 'invalid_period';
  end if;

  if period_start is null then
    raise exception 'period_start_required';
  end if;

  if inc is null or inc <= 0 then
    raise exception 'invalid_inc';
  end if;

  if quota_limit is null or quota_limit < 0 then
    raise exception 'invalid_limit';
  end if;

  -- Ensure row exists (count starts at 0 for a new period).
  insert into public.usage_counters (user_id, scope, period, period_start, count)
  values (uid, scope, period, period_start, 0)
  on conflict do nothing;

  -- Atomic check + increment.
  update public.usage_counters
  set
    count = count + inc,
    updated_at = now()
  where user_id = uid
    and scope = try_consume_usage.scope
    and period = try_consume_usage.period
    and period_start = try_consume_usage.period_start
    and count + inc <= try_consume_usage.quota_limit
  returning count into cur;

  if cur is not null then
    return query select true, cur;
    return;
  end if;

  select count into cur
  from public.usage_counters
  where user_id = uid
    and scope = try_consume_usage.scope
    and period = try_consume_usage.period
    and period_start = try_consume_usage.period_start;

  return query select false, coalesce(cur, 0);
end;
$$;

grant execute on function public.try_consume_usage(text, text, date, integer, integer) to authenticated;

commit;
