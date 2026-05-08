// AdminBrands.js
import { supabase } from "../../services/supabase";

export async function getBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getBrandById(id) {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createBrand(brandData) {
  // Remove updated_at jika ada karena kolom ini tidak ada di database
  const dataToInsert = {
    name: brandData.name,
    slug: brandData.slug,
    color: brandData.color || 'blue',
    logo_url: brandData.logo_url || null
    // Hapus updated_at karena tidak ada di tabel
  };

  const { data, error } = await supabase
    .from("brands")
    .insert([dataToInsert])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBrand(id, brandData) {
  // Hanya update kolom yang ada di database
  const dataToUpdate = {
    name: brandData.name,
    slug: brandData.slug,
    color: brandData.color || 'blue',
    logo_url: brandData.logo_url || null
  };

  const { data, error } = await supabase
    .from("brands")
    .update(dataToUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBrand(id) {
  const { count, error: countError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("brand_id", id);

  if (countError) throw countError;

  if (count > 0) {
    throw new Error(`Brand ini masih digunakan oleh ${count} produk. Hapus atau pindahkan produk terlebih dahulu.`);
  }

  const { error } = await supabase
    .from("brands")
    .delete()
    .eq("id", id);

  if (error) throw error;
}