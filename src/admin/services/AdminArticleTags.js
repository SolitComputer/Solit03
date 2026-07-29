import { supabase } from "../../services/supabase";

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function getArticleTags() {
  const { data, error } = await supabase
    .from("article_tags")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createArticleTag(name) {
  const trimmed = name.trim();
  const { data, error } = await supabase
    .from("article_tags")
    .insert([{ name: trimmed, slug: slugify(trimmed) }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateArticleTag(id, name) {
  const trimmed = name.trim();
  const { data, error } = await supabase
    .from("article_tags")
    .update({ name: trimmed, slug: slugify(trimmed) })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteArticleTag(id) {
  const { error } = await supabase.from("article_tags").delete().eq("id", id);
  if (error) throw error;
}
