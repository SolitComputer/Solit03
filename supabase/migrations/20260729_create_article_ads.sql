-- ============================================================
-- IKLAN LAPTOP DI ANTARA BERITA — Solit 03
-- Jalankan file ini di Supabase SQL Editor (atau via CLI: supabase db push)
-- ============================================================

create table if not exists article_ads (
  id bigint generated always as identity primary key,
  image_url text not null,
  banner_size text not null default 'billboard'
    check (banner_size in ('leaderboard', 'billboard', 'medium_rectangle', 'mobile_leaderboard')),
  cta_label text not null default 'Lihat Promo',
  cta_url text not null,
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Kalau tabel sudah sempat kebuat dari versi migration sebelumnya (masih ada
-- kolom title/price_label), bersihkan supaya sesuai skema final.
alter table article_ads drop column if exists title;
alter table article_ads drop column if exists price_label;

create index if not exists idx_article_ads_banner_size on article_ads(banner_size);
create index if not exists idx_article_ads_order on article_ads(order_index);

alter table article_ads enable row level security;

create policy "Public read article_ads" on article_ads
  for select using (true);

create policy "Authenticated manage article_ads" on article_ads
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Reuse bucket 'site-content' yang sudah dibuat di migrasi site_content — cukup
-- pastikan bucket itu ada (no-op kalau sudah dibuat sebelumnya).
insert into storage.buckets (id, name, public)
values ('site-content', 'site-content', true)
on conflict (id) do nothing;
