-- Shared short-window rate limiting for multi-instance deployments.
-- Used by server.js via RPC function consume_security_rate_limit.

begin;

create table if not exists public.security_rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_security_rate_limits_updated_at
  on public.security_rate_limits (updated_at desc);

create or replace function public.consume_security_rate_limit(
  p_key text,
  p_limit integer,
  p_window_ms integer
)
returns table (
  ok boolean,
  remaining integer,
  reset_at timestamptz,
  count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_key text := left(btrim(coalesce(p_key, '')), 220);
  v_limit integer := greatest(1, coalesce(p_limit, 1));
  v_window_ms integer := greatest(1000, coalesce(p_window_ms, 1000));
  v_window interval := make_interval(secs => v_window_ms::numeric / 1000.0);
  v_count integer := 0;
  v_start timestamptz := v_now;
begin
  if v_key = '' then
    raise exception 'p_key is required';
  end if;

  insert into public.security_rate_limits as s (key, window_start, count, updated_at)
  values (v_key, v_now, 1, v_now)
  on conflict (key) do update
  set window_start = case when s.window_start <= v_now - v_window then v_now else s.window_start end,
      count = case when s.window_start <= v_now - v_window then 1 else s.count + 1 end,
      updated_at = v_now
  returning count, window_start into v_count, v_start;

  -- Best-effort cleanup keeps table size bounded without a dedicated cron.
  delete from public.security_rate_limits
  where updated_at < v_now - interval '2 days';

  ok := v_count <= v_limit;
  remaining := greatest(0, v_limit - v_count);
  reset_at := v_start + v_window;
  count := v_count;
  return next;
end;
$$;

grant execute on function public.consume_security_rate_limit(text, integer, integer)
to service_role;

commit;
