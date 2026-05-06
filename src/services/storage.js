import { supabase } from "./supabase";

export async function uploadProductImage(file) {

  const fileExt =
    file.name.split(".").pop();

  const fileName =
    `${Date.now()}.${fileExt}`;

  const filePath =
    `products/${fileName}`;

  const { error } =
    await supabase.storage
      .from("products")
      .upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl }
  } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

  return publicUrl;
}

export async function uploadMultipleImages(
  files
) {

  const uploadedUrls = [];

  for (const file of files) {

    const fileExt =
      file.name.split(".").pop();

    const fileName =
      `${Date.now()}-${Math.random()}.${fileExt}`;

    const filePath =
      `products/${fileName}`;

    const { error } =
      await supabase.storage
        .from("products")
        .upload(filePath, file);

    if (error) throw error;

    const {
      data: { publicUrl }
    } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

    uploadedUrls.push(publicUrl);
  }

  return uploadedUrls;
}