import { supabase } from "../../services/supabase";

export async function getProducts() {

    const { data, error } =
        await supabase
            .from("products")
            .select(`
        *,
        brands(name),
        categories(name)
      `)
            .order("created_at", {
                ascending: false
            });

    if (error) throw error;

    return data;
}

export async function createProduct(
  product
) {

  const gallery =
    product.gallery || [];

  const specs =
    product.specs || {};

  const tagIds =
    product.tag_ids || [];

  delete product.gallery;
  delete product.specs;
  delete product.tag_ids;

  // CREATE PRODUCT
  const {
    data,
    error
  } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();

  if (error) throw error;

  // CREATE PRODUCT IMAGES
  if (gallery.length > 0) {

    const galleryRows =
      gallery.map((image) => ({
        product_id: data.id,
        image_url: image
      }));

    const {
      error: galleryError
    } = await supabase
        .from("product_images")
        .insert(galleryRows);

    if (galleryError)
      throw galleryError;
  }

  await supabase
    .from("product_specs")
    .insert([
      {
        product_id: data.id,
        ...specs
      }
    ]);

  if (tagIds.length > 0) {

    const tagRows =
      tagIds.map((tagId) => ({
        product_id: data.id,
        tag_id: tagId
      }));

    await supabase
      .from("product_tags")
      .insert(tagRows);
  }

  return data;
}

export async function updateProduct(
    id,
    product
) {

    delete product.id;
    delete product.created_at;

    delete product.gallery;
    delete product.specs;
    delete product.tag_ids;

    const { data, error } =
        await supabase
            .from("products")
            .update(product)
            .eq("id", id)
            .select();

    if (error) throw error;

    return data;
}

export async function deleteProduct(id) {

    const { error } =
        await supabase
            .from("products")
            .delete()
            .eq("id", id);

    if (error) throw error;
}

export async function getProductById(id) {

    const { data, error } =
        await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

    if (error) throw error;

    return data;
}