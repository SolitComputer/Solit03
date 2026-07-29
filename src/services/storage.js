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

export async function uploadArticleImage(file) {

  const fileExt =
    file.name.split(".").pop();

  const fileName =
    `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;

  const filePath =
    `articles/${fileName}`;

  const { error } =
    await supabase.storage
      .from("articles")
      .upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl }
  } = supabase.storage
      .from("articles")
      .getPublicUrl(filePath);

  return publicUrl;
}

const MAX_ARTICLE_VIDEO_BYTES = 15 * 1024 * 1024; // 15MB — biar video di artikel tetap enteng/cepat dimuat

export async function uploadArticleVideo(file) {
  if (file.size > MAX_ARTICLE_VIDEO_BYTES) {
    throw new Error(
      `Video terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal 15MB — kompres dulu videonya (mis. pakai HandBrake atau compressvideo.io) sebelum upload.`
    );
  }

  const fileExt =
    file.name.split(".").pop();

  const fileName =
    `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;

  const filePath =
    `articles/videos/${fileName}`;

  const { error } =
    await supabase.storage
      .from("articles")
      .upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl }
  } = supabase.storage
      .from("articles")
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