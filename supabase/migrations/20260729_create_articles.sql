-- ============================================================
-- FITUR ARTIKEL BERITA — Solit 03
-- Jalankan file ini di Supabase SQL Editor (atau via CLI: supabase db push)
-- ============================================================

-- 1. Tabel kategori artikel
create table if not exists article_categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  icon text default 'Berita',
  created_at timestamptz not null default now()
);

-- 2. Tabel tag artikel
create table if not exists article_tags (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- 3. Tabel artikel
create table if not exists articles (
  id bigint generated always as identity primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image text,
  category_id bigint references article_categories(id) on delete set null,
  author text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_featured boolean not null default false,
  views bigint not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_articles_status on articles(status);
create index if not exists idx_articles_category on articles(category_id);
create index if not exists idx_articles_slug on articles(slug);
create index if not exists idx_articles_published_at on articles(published_at desc);

-- 4. Relasi many-to-many artikel <-> tag
create table if not exists article_tag_relations (
  article_id bigint not null references articles(id) on delete cascade,
  tag_id bigint not null references article_tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- 5. Trigger auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_articles_updated_at on articles;
create trigger trg_articles_updated_at
  before update on articles
  for each row execute function set_updated_at();

-- 6. Fungsi increment views (dipanggil dari halaman detail publik)
create or replace function increment_article_views(article_id bigint)
returns void as $$
begin
  update articles set views = views + 1 where id = article_id;
end;
$$ language plpgsql security definer;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table article_categories enable row level security;
alter table article_tags enable row level security;
alter table articles enable row level security;
alter table article_tag_relations enable row level security;

-- Public: boleh baca kategori & tag
create policy "Public read article_categories" on article_categories
  for select using (true);

create policy "Public read article_tags" on article_tags
  for select using (true);

-- Public: hanya boleh baca artikel yang published
create policy "Public read published articles" on articles
  for select using (status = 'published');

create policy "Public read article_tag_relations" on article_tag_relations
  for select using (true);

-- Admin (user login/authenticated): full akses CRUD
create policy "Authenticated manage article_categories" on article_categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated manage article_tags" on article_tags
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated manage articles" on articles
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated manage article_tag_relations" on article_tag_relations
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Izinkan siapa saja (termasuk anon) memanggil fungsi increment views
grant execute on function increment_article_views(bigint) to anon, authenticated;

-- ============================================================
-- STORAGE BUCKET untuk gambar artikel (cover & gambar konten)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('articles', 'articles', true)
on conflict (id) do nothing;

create policy "Public read articles bucket"
  on storage.objects for select
  using (bucket_id = 'articles');

create policy "Authenticated upload articles bucket"
  on storage.objects for insert
  with check (bucket_id = 'articles' and auth.role() = 'authenticated');

create policy "Authenticated update articles bucket"
  on storage.objects for update
  using (bucket_id = 'articles' and auth.role() = 'authenticated');

create policy "Authenticated delete articles bucket"
  on storage.objects for delete
  using (bucket_id = 'articles' and auth.role() = 'authenticated');

-- ============================================================
-- SEED contoh kategori (opsional, boleh dihapus/diedit)
-- ============================================================
insert into article_categories (name, slug, icon) values
  ('Berita', 'berita', 'Berita'),
  ('Tips & Trik', 'tips-trik', 'Tips'),
  ('Promo', 'promo', 'Promo'),
  ('Teknologi', 'teknologi', 'Teknologi'),
  ('Review', 'review', 'Review')
on conflict (slug) do nothing;
