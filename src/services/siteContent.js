import { supabase } from "./supabase";

export async function getSiteSettings() {
  const { data, error } = await supabase.from("site_settings").select("key,value");
  if (error) throw error;
  const map = {};
  (data || []).forEach((row) => { map[row.key] = row.value; });
  return map;
}

export async function getServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getPromoImages() {
  const { data, error } = await supabase
    .from("promo_images")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getTestimonials() {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getArticleAds({ bannerSize } = {}) {
  let query = supabase
    .from("article_ads")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (bannerSize) query = query.eq("banner_size", bannerSize);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
