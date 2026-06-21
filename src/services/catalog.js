import { supabase } from "./supabase";

// Base URL solit-pos (set di .env: VITE_POS_API_URL)
const POS_API =
  import.meta.env.VITE_POS_API_URL || "https://solit-pos.vercel.app";

export async function fetchCatalogLaptops() {
  const res = await fetch(`${POS_API}/api/public/catalog`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`POS API error: ${res.status}`);
  const json = await res.json();
  const laptops = json.data || [];
  if (laptops.length === 0) return [];

  const ids = laptops.map((l) => l.id);
  const { data: photos, error } = await supabase
    .from("laptop_photos")
    .select("*")
    .in("laptop_id", ids)
    .order("sort_order", { ascending: true });
  if (error) console.error("fetch laptop_photos:", error);

  const map = {};
  (photos || []).forEach((p) => {
    (map[p.laptop_id] ||= []).push(p);
  });

  return laptops.map((l) => ({ ...l, photos: map[l.id] || [] }));
}

export async function getLaptopPhotos(laptopId) {
  const { data, error } = await supabase
    .from("laptop_photos")
    .select("*")
    .eq("laptop_id", laptopId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addLaptopPhotos(laptopId, urls) {
  const existing = await getLaptopPhotos(laptopId);
  const start = existing.length;
  const rows = urls.map((url, i) => ({
    laptop_id: laptopId,
    image_url: url,
    sort_order: start + i,
  }));
  const { data, error } = await supabase.from("laptop_photos").insert(rows).select();
  if (error) throw error;
  return data || [];
}

export async function deleteLaptopPhoto(photoId) {
  const { error } = await supabase.from("laptop_photos").delete().eq("id", photoId);
  if (error) throw error;
}