import { supabase } from "./supabase";

const SELECT_LIST = `
  id, title, slug, excerpt, cover_image, author, is_featured, views, published_at,
  article_categories ( id, name, slug )
`;

export async function getFeaturedArticle() {
  const { data, error } = await supabase
    .from("articles")
    .select(SELECT_LIST)
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getArticles({ page = 1, limit = 12, categorySlug, search, excludeId } = {}) {
  let query = supabase
    .from("articles")
    .select(SELECT_LIST, { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (categorySlug) {
    const { data: cat } = await supabase.from("article_categories").select("id").eq("slug", categorySlug).single();
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (search) query = query.ilike("title", `%${search}%`);
  if (excludeId) query = query.neq("id", excludeId);

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], total: count || 0 };
}

export async function getArticleCategories() {
  const { data, error } = await supabase.from("article_categories").select("*").order("name");
  if (error) throw error;
  return data || [];
}

export async function getArticleBySlug(slug) {
  const { data: article, error } = await supabase
    .from("articles")
    .select(`*, article_categories ( id, name, slug )`)
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) throw error;

  const { data: tagRows } = await supabase
    .from("article_tag_relations")
    .select("article_tags ( id, name, slug )")
    .eq("article_id", article.id);

  supabase.rpc("increment_article_views", { article_id: article.id }).then(() => {});

  return {
    ...article,
    tags: (tagRows || []).map((t) => t.article_tags).filter(Boolean),
  };
}

export async function getRelatedArticles(article, limit = 4) {
  const { data, error } = await supabase
    .from("articles")
    .select(SELECT_LIST)
    .eq("status", "published")
    .eq("category_id", article.category_id)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getPopularArticles(limit = 5, excludeId) {
  let query = supabase
    .from("articles")
    .select(SELECT_LIST)
    .eq("status", "published")
    .order("views", { ascending: false })
    .limit(limit);

  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
