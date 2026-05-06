import { supabase }
from "../../services/supabase";

export async function getCategories() {

  const { data, error } =
    await supabase
      .from("categories")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if (error) throw error;

  return data;
}

export async function createCategory(
  category
) {

  const { error } =
    await supabase
      .from("categories")
      .insert([category]);

  if (error) throw error;
}

export async function deleteCategory(
  id
) {

  const { error } =
    await supabase
      .from("categories")
      .delete()
      .eq("id", id);

  if (error) throw error;
}