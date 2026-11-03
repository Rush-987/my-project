-- LabBuddy: run in Supabase SQL Editor as project owner.
-- All user-owned tables enforce ownership with Row Level Security (RLS).

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now()
);

create table if not exists public.lab_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null check (track_id in ('network-recon','web-security','digital-forensics','linux-admin')),
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, track_id)
);

alter table public.profiles enable row level security;
alter table public.notes enable row level security;
alter table public.lab_progress enable row level security;

-- Users may read/update only their own profile.
create policy "profiles_select_own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Users may CRUD only their own notes.
create policy "notes_select_own" on public.notes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "notes_insert_own" on public.notes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "notes_update_own" on public.notes
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "notes_delete_own" on public.notes
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Users may CRUD only their own progress rows.
create policy "progress_select_own" on public.lab_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "progress_insert_own" on public.lab_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "progress_update_own" on public.lab_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "progress_delete_own" on public.lab_progress
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Create a profile automatically when an auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.notes to authenticated;
grant select, insert, update, delete on public.lab_progress to authenticated;

-- No anonymous policies are created. Do not add service_role credentials to frontend code.
