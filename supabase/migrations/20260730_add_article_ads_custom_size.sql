-- ============================================================
-- IKLAN KANAN-KIRI (DESKTOP FLANKING) — ukuran custom oleh admin
-- Jalankan file ini di Supabase SQL Editor (atau via CLI: supabase db push)
-- ============================================================

alter table article_ads add column if not exists custom_width int;
alter table article_ads add column if not exists custom_height int;

alter table article_ads drop constraint if exists article_ads_banner_size_check;

alter table article_ads add constraint article_ads_banner_size_check
  check (banner_size in ('leaderboard', 'billboard', 'medium_rectangle', 'mobile_leaderboard', 'sidebar_flank'));
