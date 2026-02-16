-- AI Note App: billing profile table (stores Stripe customer/subscription ids)
-- This avoids using Supabase service_role at runtime; user JWT + RLS protects access.

begin;

create table if not exists public.billing_profiles (
  user_id text primary key,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text not null default 'none',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create or replace function public.set_billing_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_billing_profiles_updated_at on public.billing_profiles;
create trigger trg_set_billing_profiles_updated_at
before update on public.billing_profiles
for each row
execute function public.set_billing_profiles_updated_at();

alter table public.billing_profiles enable row level security;

drop policy if exists "billing_profiles_select_own" on public.billing_profiles;
create policy "billing_profiles_select_own"
on public.billing_profiles
for select
to authenticated
using (auth.uid()::text = user_id);

drop policy if exists "billing_profiles_insert_own" on public.billing_profiles;
create policy "billing_profiles_insert_own"
on public.billing_profiles
for insert
to authenticated
with check (auth.uid()::text = user_id);

drop policy if exists "billing_profiles_update_own" on public.billing_profiles;
create policy "billing_profiles_update_own"
on public.billing_profiles
for update
to authenticated
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

commit;

