import { supabase }
from "../../services/supabase";

export async function getBrands() {

  const { data, error } =
    await supabase
      .from("brands")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if (error) throw error;

  return data;
}

export async function createBrand(
  brand
) {

  const { error } =
    await supabase
      .from("brands")
      .insert([brand]);

  if (error) throw error;
}

export async function deleteBrand(
  id
) {

  const { error } =
    await supabase
      .from("brands")
      .delete()
      .eq("id", id);

  if (error) throw error;
}