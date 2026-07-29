import { supabase } from "../../services/supabase";

export async function getArticleCategories() {
  const { data, error } = await supabase
    .from("article_categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createArticleCategory(category) {
  const { data, error } = await supabase
    .from("article_categories")
    .insert([category])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateArticleCategory(id, category) {
  const { data, error } = await supabase
    .from("article_categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteArticleCategory(id) {
  const { error } = await supabase
    .from("article_categories")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
