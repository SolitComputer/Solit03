import { supabase } from "../../services/supabase";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      brands(name),
      categories(name)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createProduct(product) {
  const gallery = product.gallery || [];
  const specs = product.specs || {};

  delete specs.id;
  delete specs.created_at;
  delete specs.product_id;

  const tagIds = product.tag_ids || [];

  delete product.gallery;
  delete product.specs;
  delete product.tag_ids;

  if (product.normal_price && product.price && product.normal_price > product.price) {
    product.discount_percent = Math.round(((product.normal_price - product.price) / product.normal_price) * 100);
    product.is_promo = true;
  } else {
    product.discount_percent = 0;
    product.is_promo = false;
  }

  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) throw error;

  if (gallery.length > 0) {
    const galleryRows = gallery.map((image) => ({
      product_id: data.id,
      image_url: image,
    }));
    const { error: galleryError } = await supabase.from("product_images").insert(galleryRows);
    if (galleryError) throw galleryError;
  }

  await supabase.from("product_specs").insert([
    {
      product_id: data.id,
      ...specs,
    },
  ]);

  if (tagIds.length > 0) {
    const tagRows = tagIds.map((tagId) => ({
      product_id: data.id,
      tag_id: tagId,
    }));
    await supabase.from("product_tags").insert(tagRows);
  }

  return data;
}

export async function updateProduct(id, product) {
  const gallery = product.gallery || [];
  const specs = product.specs || {};

  delete specs.id;
  delete specs.created_at;
  delete specs.product_id;

  const tagIds = product.tag_ids || [];

  delete product.id;
  delete product.created_at;
  delete product.gallery;
  delete product.specs;
  delete product.tag_ids;

  if (product.normal_price && product.price && product.normal_price > product.price) {
    product.discount_percent = Math.round(((product.normal_price - product.price) / product.normal_price) * 100);
    product.is_promo = true;
  } else {
    product.discount_percent = 0;
    product.is_promo = false;
  }

  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await supabase.from("product_images").delete().eq("product_id", id);

  if (gallery.length > 0) {
    const galleryRows = gallery.map((image) => ({
      product_id: id,
      image_url: image,
    }));
    const { error: galleryError } = await supabase.from("product_images").insert(galleryRows);
    if (galleryError) throw galleryError;
  }

  await supabase.from("product_specs").delete().eq("product_id", id);
  const { error: specsError } = await supabase.from("product_specs").insert([
    {
      product_id: id,
      ...specs,
    },
  ]);
  if (specsError) throw specsError;

  await supabase.from("product_tags").delete().eq("product_id", id);

  if (tagIds.length > 0) {
    const tagRows = tagIds.map((tagId) => ({
      product_id: id,
      tag_id: tagId,
    }));
    const { error: tagError } = await supabase.from("product_tags").insert(tagRows);
    if (tagError) throw tagError;
  }

  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function getProductById(id) {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (productError) throw productError;

  const { data: images } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", id);

  const { data: specs } = await supabase
    .from("product_specs")
    .select("*")
    .eq("product_id", id)
    .single();

  const { data: tags } = await supabase
    .from("product_tags")
    .select("tag_id")
    .eq("product_id", id);

  return {
    ...product,
    gallery: images?.map((img) => img.image_url) || [],
    specs: {
      processor: specs?.processor || "",
      ram: specs?.ram || "",
      storage: specs?.storage || "",
      gpu: specs?.gpu || "",
      display: specs?.display || "",
      system_os: specs?.system_os || "",
    },
    tag_ids: tags?.map((tag) => tag.tag_id) || [],
  };
}

export async function getProductsPaginated({ page, limit, search, sortBy, filterStock, filterBrand }) {
  try {
    let query = supabase
      .from("products")
      .select(`
        *,
        brands (id, name),
        categories (id, name)
      `, { count: "exact" });

    // ✅ Fix: cari brand ID dulu, lalu OR dengan name
    if (search) {
      const { data: matchedBrands } = await supabase
        .from("brands")
        .select("id")
        .ilike("name", `%${search}%`);

      const brandIds = matchedBrands?.map(b => b.id) || [];

      if (brandIds.length > 0) {
        query = query.or(
          `name.ilike.%${search}%,brand_id.in.(${brandIds.join(",")})`
        );
      } else {
        query = query.ilike("name", `%${search}%`);
      }
    }

    if (filterStock === "available") {
      query = query.gt("stock", 0);
    } else if (filterStock === "outofstock") {
      query = query.eq("stock", 0);
    }

    if (filterBrand) {
      query = query.eq("brand_id", filterBrand);
    }

    switch (sortBy) {
      case "newest": query = query.order("created_at", { ascending: false }); break;
      case "oldest": query = query.order("created_at", { ascending: true }); break;
      case "price_high": query = query.order("price", { ascending: false }); break;
      case "price_low": query = query.order("price", { ascending: true }); break;
      case "name_asc": query = query.order("name", { ascending: true }); break;
      default: query = query.order("created_at", { ascending: false });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return { data: data || [], total: count || 0 };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}