-- ============================================================
-- COOKIE CONSENT TRACKING — Solit 03
-- Jalankan file ini di Supabase SQL Editor (atau via CLI: supabase db push)
-- ============================================================

create table if not exists cookie_consents (
  id bigint generated always as identity primary key,
  visitor_id text not null,
  action text not null check (action in ('accept_all', 'reject_all', 'custom')),
  necessary boolean not null default true,
  analytics boolean not null default false,
  marketing boolean not null default false,
  page_url text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_cookie_consents_created_at on cookie_consents(created_at desc);
create index if not exists idx_cookie_consents_visitor on cookie_consents(visitor_id);

alter table cookie_consents enable row level security;

-- Siapa saja (pengunjung publik/anon) boleh mencatat consent-nya sendiri
create policy "Public insert cookie_consents" on cookie_consents
  for insert with check (true);

-- Hanya admin (authenticated) yang boleh membaca data tracking
create policy "Authenticated read cookie_consents" on cookie_consents
  for select using (auth.role() = 'authenticated');
