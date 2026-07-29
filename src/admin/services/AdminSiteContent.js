import { supabase } from "../../services/supabase";

export async function getSetting(key) {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return data?.value || null;
}

export async function saveSetting(key, value) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}

// ---- Services ----
export async function getAllServices() {
  const { data, error } = await supabase.from("services").select("*").order("order_index");
  if (error) throw error;
  return data || [];
}
export async function createService(payload) {
  const { data, error } = await supabase.from("services").insert([payload]).select().single();
  if (error) throw error;
  return data;
}
export async function updateService(id, payload) {
  const { data, error } = await supabase.from("services").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
export async function deleteService(id) {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

// ---- Promo Images ----
export async function getAllPromoImages() {
  const { data, error } = await supabase.from("promo_images").select("*").order("order_index");
  if (error) throw error;
  return data || [];
}
export async function createPromoImage(payload) {
  const { data, error } = await supabase.from("promo_images").insert([payload]).select().single();
  if (error) throw error;
  return data;
}
export async function updatePromoImage(id, payload) {
  const { data, error } = await supabase.from("promo_images").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
export async function deletePromoImage(id) {
  const { error } = await supabase.from("promo_images").delete().eq("id", id);
  if (error) throw error;
}

// ---- Testimonials ----
export async function getAllTestimonials() {
  const { data, error } = await supabase.from("testimonials").select("*").order("order_index");
  if (error) throw error;
  return data || [];
}
export async function createTestimonial(payload) {
  const { data, error } = await supabase.from("testimonials").insert([payload]).select().single();
  if (error) throw error;
  return data;
}
export async function updateTestimonial(id, payload) {
  const { data, error } = await supabase.from("testimonials").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
export async function deleteTestimonial(id) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

// ---- Article Ads ----
export async function getAllArticleAds() {
  const { data, error } = await supabase.from("article_ads").select("*").order("order_index");
  if (error) throw error;
  return data || [];
}
export async function createArticleAd(payload) {
  const { data, error } = await supabase.from("article_ads").insert([payload]).select().single();
  if (error) throw error;
  return data;
}
export async function updateArticleAd(id, payload) {
  const { data, error } = await supabase.from("article_ads").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
export async function deleteArticleAd(id) {
  const { error } = await supabase.from("article_ads").delete().eq("id", id);
  if (error) throw error;
}

// ---- Upload helper (bucket: site-content) ----
export async function uploadSiteContentFile(file, folder = "misc") {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;

  const { error } = await supabase.storage.from("site-content").upload(fileName, file);
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage.from("site-content").getPublicUrl(fileName);
  return publicUrl;
}
