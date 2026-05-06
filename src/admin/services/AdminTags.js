import { supabase }
from "../../services/supabase";

export async function getTags() {

  const { data, error } =
    await supabase
      .from("tags")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if (error) throw error;

  return data;
}

export async function createTag(
  tag
) {

  const { error } =
    await supabase
      .from("tags")
      .insert([tag]);

  if (error) throw error;
}

export async function deleteTag(
  id
) {

  const { error } =
    await supabase
      .from("tags")
      .delete()
      .eq("id", id);

  if (error) throw error;
}