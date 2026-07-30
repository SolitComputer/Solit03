import { supabase } from "./supabase";

export async function fetchProducts(filters = {}) {
  let query = supabase
    .from("products")
    .select(`
      *,
      brands(*),
      categories(*),
      product_specs(*),
      product_images(*),
      product_tags(
        tags(*)
      )
    `)
    .eq("is_active", true);

  if (filters.brand) {
    query = query.eq("brand_id", filters.brand);
  }

  if (filters.category) {
    query = query.eq("category_id", filters.category);
  }

  if (filters.min_price) {
    query = query.gte("price", filters.min_price);
  }

  if (filters.max_price) {
    query = query.lte("price", filters.max_price);
  }

  if (filters.bestSeller) {
    query = query.eq("is_best_seller", true);
  }

  if (filters.promo) {
    query = query.eq("is_promo", true);
  }

  if (filters.newStock) {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    query = query.or(`is_new_stock.eq.true,created_at.gte.${threeDaysAgo}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}