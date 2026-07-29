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

  const { data: tagRows } = await supabase
    .from("article_tag_relations")
    .select("tag_id, article_tags(id,name)")
    .eq("article_id", id);

  return {
    ...article,
    tag_names: (tagRows || []).map((t) => t.article_tags?.name).filter(Boolean),
  };
}

export async function createArticle(article) {
  const tagNames = article.tag_names || [];
  const payload = { ...article };
  delete payload.tag_names;

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

  const tagIds = await resolveTagIds(tagNames);
  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ article_id: data.id, tag_id }));
    await supabase.from("article_tag_relations").insert(rows);
  }

  return data;
}

export async function updateArticle(id, article) {
  const tagNames = article.tag_names || [];
  const payload = { ...article };
  delete payload.id;
  delete payload.created_at;
  delete payload.tag_names;

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

  await supabase.from("article_tag_relations").delete().eq("article_id", id);
  const tagIds = await resolveTagIds(tagNames);
  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ article_id: id, tag_id }));
    await supabase.from("article_tag_relations").insert(rows);
  }

  return data;
}

export async function deleteArticle(id) {
  await supabase.from("article_tag_relations").delete().eq("article_id", id);
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}
