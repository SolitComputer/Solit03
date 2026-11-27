import { supabase } from "../../services/supabase";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureUniqueSlug(slug, excludeId) {
  let candidate = slug;
  let suffix = 2;

  while (true) {
    let query = supabase.from("articles").select("id").eq("slug", candidate).limit(1);
    if (excludeId) query = query.neq("id", excludeId);
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    if (!data) return candidate;
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
}

async function resolveTagIds(tagNames = []) {
  const names = [...new Set(tagNames.map((n) => n.trim()).filter(Boolean))];
  if (names.length === 0) return [];

  const { data: existing, error: existingError } = await supabase
    .from("article_tags")
    .select("id,name")
    .in("name", names);
  if (existingError) throw existingError;

  const existingNames = new Set((existing || []).map((t) => t.name));
  const toCreate = names.filter((n) => !existingNames.has(n));

  let created = [];
  if (toCreate.length > 0) {
    const rows = toCreate.map((name) => ({ name, slug: slugify(name) }));
    const { data, error } = await supabase.from("article_tags").insert(rows).select();
    if (error) throw error;
    created = data || [];
  }

  return [...(existing || []), ...created].map((t) => t.id);
}

// ═══════════════════════════════════════════════════════════
// BARU: Helper untuk article_images
// ═══════════════════════════════════════════════════════════

/**
 * Simpan array images ke tabel article_images
 * @param {string} articleId
 * @param {Array} images - [{ url, is_primary }]
 */
async function saveArticleImages(articleId, images = []) {
  // Hapus images lama untuk artikel ini
  await supabase.from("article_images").delete().eq("article_id", articleId);

  if (images.length === 0) return;

  const rows = images.map((img, index) => ({
    article_id: articleId,
    image_url: img.url,
    is_primary: !!img.is_primary,
    sort_order: index,
  }));

  const { error } = await supabase.from("article_images").insert(rows);
  if (error) throw error;
}

/**
 * Ambil images untuk satu artikel
 * @param {string} articleId
 * @returns {Array} [{ id, url, is_primary }]
 */
async function getArticleImages(articleId) {
  const { data, error } = await supabase
    .from("article_images")
    .select("*")
    .eq("article_id", articleId)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data || []).map((img) => ({
    id: img.id,
    url: img.image_url,
    is_primary: img.is_primary,
  }));
}

// ═══════════════════════════════════════════════════════════
// CRUD (dimodifikasi untuk support images)
// ═══════════════════════════════════════════════════════════

export async function getArticlesPaginated({ page, limit, search, sortBy, filterStatus, filterCategory }) {
  let query = supabase
    .from("articles")
    .select(`*, article_categories(id,name,slug)`, { count: "exact" });

  if (search) query = query.ilike("title", `%${search}%`);
  if (filterStatus && filterStatus !== "all") query = query.eq("status", filterStatus);
  if (filterCategory && filterCategory !== "all") query = query.eq("category_id", filterCategory);

  switch (sortBy) {
    case "oldest": query = query.order("created_at", { ascending: true }); break;
    case "title_asc": query = query.order("title", { ascending: true }); break;
    case "most_viewed": query = query.order("views", { ascending: false }); break;
    default: query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], total: count || 0 };
}

export async function getArticleById(id) {
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;

  // Load tags
  const { data: tagRows } = await supabase
    .from("article_tag_relations")
    .select("tag_id, article_tags(id,name)")
    .eq("article_id", id);

  // Load images dari tabel article_images
  const images = await getArticleImages(id);

  // Fallback: kalau belum ada data di article_images tapi ada cover_image lama
  const finalImages =
    images.length > 0
      ? images
      : article.cover_image
      ? [{ url: article.cover_image, is_primary: true }]
      : [];

  return {
    ...article,
    tag_names: (tagRows || []).map((t) => t.article_tags?.name).filter(Boolean),
    images: finalImages,
  };
}

export async function createArticle(article) {
  const tagNames = article.tag_names || [];
  const images = article.images || [];
  const payload = { ...article };
  delete payload.tag_names;
  delete payload.images;

  // Set cover_image dari primary image (backward compatible)
  const primaryImg = images.find((i) => i.is_primary) || images[0];
  if (primaryImg) payload.cover_image = primaryImg.url;

  if (!payload.slug) payload.slug = slugify(payload.title || "");
  payload.slug = await ensureUniqueSlug(payload.slug);
  if (payload.status === "published" && !payload.published_at) {
    payload.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("articles")
    .insert([payload])
    .select()
    .single();
  if (error) throw error;

  // Simpan tags
  const tagIds = await resolveTagIds(tagNames);
  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ article_id: data.id, tag_id }));
    await supabase.from("article_tag_relations").insert(rows);
  }

  // Simpan images ke tabel article_images
  if (images.length > 0) {
    await saveArticleImages(data.id, images);
  }

  return data;
}

export async function updateArticle(id, article) {
  const tagNames = article.tag_names || [];
  const images = article.images || [];
  const payload = { ...article };
  delete payload.id;
  delete payload.created_at;
  delete payload.tag_names;
  delete payload.images;

  // Set cover_image dari primary image (backward compatible)
  const primaryImg = images.find((i) => i.is_primary) || images[0];
  payload.cover_image = primaryImg ? primaryImg.url : "";

  if (!payload.slug) payload.slug = slugify(payload.title || "");
  payload.slug = await ensureUniqueSlug(payload.slug, id);
  if (payload.status === "published" && !payload.published_at) {
    payload.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("articles")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  // Update tags
  await supabase.from("article_tag_relations").delete().eq("article_id", id);
  const tagIds = await resolveTagIds(tagNames);
  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ article_id: id, tag_id }));
    await supabase.from("article_tag_relations").insert(rows);
  }

  // Update images
  await saveArticleImages(id, images);

  return data;
}

export async function deleteArticle(id) {
  // article_images dihapus otomatis via ON DELETE CASCADE
  await supabase.from("article_tag_relations").delete().eq("article_id", id);
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}