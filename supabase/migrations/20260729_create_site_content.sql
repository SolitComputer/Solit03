-- ============================================================
-- KONTEN DINAMIS HOMEPAGE — Solit 03
-- Jalankan file ini di Supabase SQL Editor (atau via CLI: supabase db push)
-- ============================================================

-- 1. Pengaturan singleton per-section (Hero, About, Kontak & Lokasi) sebagai JSON
create table if not exists site_settings (
  
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. Layanan (Services section)
create table if not exists services (
  id bigint generated always as identity primary key,
  icon text not null default 'Sparkles',
  title text not null,
  description text,
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Showcase / poster promo laptop
create table if not exists promo_images (
  id bigint generated always as identity primary key,
  image_url text not null,
  title text,
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4. Video testimoni pelanggan
create table if not exists testimonials (
  id bigint generated always as identity primary key,
  video_url text not null,
  customer_name text,
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_services_order on services(order_index);
create index if not exists idx_promo_images_order on promo_images(order_index);
create index if not exists idx_testimonials_order on testimonials(order_index);

-- Trigger auto-update updated_at untuk site_settings
create or replace function set_site_settings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_site_settings_updated_at on site_settings;
create trigger trg_site_settings_updated_at
  before update on site_settings
  for each row execute function set_site_settings_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table site_settings enable row level security;
alter table services enable row level security;
alter table promo_images enable row level security;
alter table testimonials enable row level security;

create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read services" on services for select using (true);
create policy "Public read promo_images" on promo_images for select using (true);
create policy "Public read testimonials" on testimonials for select using (true);

create policy "Authenticated manage site_settings" on site_settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated manage services" on services
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated manage promo_images" on promo_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated manage testimonials" on testimonials
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET untuk gambar/video konten homepage
-- ============================================================

insert into storage.buckets (id, name, public)
values ('site-content', 'site-content', true)
on conflict (id) do nothing;

create policy "Public read site-content bucket"
  on storage.objects for select
  using (bucket_id = 'site-content');

create policy "Authenticated upload site-content bucket"
  on storage.objects for insert
  with check (bucket_id = 'site-content' and auth.role() = 'authenticated');

create policy "Authenticated update site-content bucket"
  on storage.objects for update
  using (bucket_id = 'site-content' and auth.role() = 'authenticated');

create policy "Authenticated delete site-content bucket"
  on storage.objects for delete
  using (bucket_id = 'site-content' and auth.role() = 'authenticated');

-- ============================================================
-- SEED — nilai default sesuai konten yang sudah ada di web saat ini
-- ============================================================

insert into site_settings (key, value) values
  ('hero', '{
    "badge": "Tepercaya Sejak 2020",
    "title_prefix": "Solit",
    "title_suffix": "03",
    "subtitle": "Laptop Second Rasa Baru, Harga Bersahabat",
    "description": "Setiap unit lolos quality control dan bergaransi resmi. Performa ngebut untuk kuliah, kerja, hingga gaming — tanpa bikin dompet menjerit.",
    "cta_primary_label": "Lihat Katalog",
    "cta_secondary_label": "Hubungi Kami",
    "trust": [
      { "icon": "Shield", "label": "Garansi 1 Bulan" },
      { "icon": "Truck", "label": "Gratis Antar Jabodetabek" },
      { "icon": "Clock", "label": "Service Cepat & Rapi" },
      { "icon": "Award", "label": "Tepercaya Sejak 2020" }
    ]
  }'::jsonb),
  ('about', '{
    "eyebrow": "Our Story",
    "heading_normal": "Solit Hadir Untuk ",
    "heading_accent": "Memajukan Teknologi",
    "description": "Berkomitmen menghadirkan laptop berkualitas dengan harga terjangkau untuk mendukung kemajuan digital Indonesia.",
    "quote": "Menjadikan Solit sebagai perusahaan berkelanjutan yang tidak hanya menghadirkan akses teknologi melalui produk laptop berkualitas dengan harga terjangkau, tetapi juga menjadi wadah kebaikan yang memberikan dampak sosial, ekonomi, dan edukasi jangka panjang bagi masyarakat dan peradaban.",
    "founder_name": "Reinaldy Olyvierd Sendouw",
    "founder_role": "CEO & Founder Solit",
    "founder_initials": "RS",
    "founder_image_url": null
  }'::jsonb),
  ('contact', '{
    "whatsapp_number": "6285210647047",
    "whatsapp_message": "Halo Solit 03, saya tertarik dengan laptopnya. Apakah ada yang bisa dibantu?",
    "phone_display": "+62 852-1064-7047",
    "email": "solit03@gmail.com",
    "address": "Depok, Indonesia",
    "map_query": "Solit 03 Depok Sawangan",
    "instagram_url": "https://instagram.com/solit.comp",
    "tiktok_url": "https://tiktok.com/@solit03",
    "shopee_url": "https://shopee.co.id/solit_03?entryPoint=ShopBySearch&searchKeyword=solit03",
    "tokopedia_url": "https://www.tokopedia.com/solit03"
  }'::jsonb)
on conflict (key) do nothing;

insert into services (icon, title, description, order_index) values
  ('BadgeCheck', 'Quality Control', 'Teruji & Terpercaya', 1),
  ('Handshake', 'Harga Kompetitif', 'Sesuai kantong', 2),
  ('Headphones', 'Support 24 Jam', 'Fast response', 3),
  ('ShieldCheck', 'Garansi Unit', '1 bulan resmi', 4),
  ('Truck', 'Gratis Ongkir', 'Jabodetabek', 5)
on conflict do nothing;

-- Video testimoni yang sudah ada di /public/videos tetap dipakai sebagai default
insert into testimonials (video_url, order_index) values
  ('/videos/video1.mp4', 1),
  ('/videos/video2.mp4', 2),
  ('/videos/video3.mp4', 3)
on conflict do nothing;
