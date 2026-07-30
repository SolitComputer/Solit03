import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const SITE_URL = 'https://solit03.com';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment (.env).'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const STATIC_PAGES = [
  { path: '/', priority: '1.0' },
  { path: '/katalog', priority: '0.9' },
  { path: '/jual-beli', priority: '0.8' },
  { path: '/berita', priority: '0.8' },
  { path: '/tentang', priority: '0.7' },
  { path: '/sosial-media', priority: '0.7' },
];

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry({ loc, lastmod, priority }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

async function main() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('slug, published_at')
    .eq('status', 'published');

  if (error) {
    console.error('Failed to fetch published articles from Supabase:', error.message);
    process.exit(1);
  }

  const staticEntries = STATIC_PAGES.map((page) =>
    urlEntry({ loc: `${SITE_URL}${page.path}`, priority: page.priority })
  );

  const articleEntries = (articles ?? []).map((article) =>
    urlEntry({
      loc: `${SITE_URL}/berita/${encodeURIComponent(article.slug)}`,
      lastmod: article.published_at ? article.published_at.slice(0, 10) : null,
      priority: '0.6',
    })
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticEntries,
    ...articleEntries,
    '</urlset>',
    '',
  ].join('\n');

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, xml, 'utf-8');

  console.log(
    `sitemap.xml generated: ${staticEntries.length} static pages + ${articleEntries.length} articles -> ${outputPath}`
  );
}

main();
