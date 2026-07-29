// Galeri poster laptop statis (fallback lama) — dipakai homepage saat promo_images
// masih kosong, dan oleh admin untuk fitur "Impor dari galeri lama".
const laptopImages = import.meta.glob("../assets/laptop/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

export const DEFAULT_SHOWCASE_IMAGES = Object.entries(laptopImages)
  .sort(([a], [b]) => {
    const na = parseInt(a.match(/(\d+)\.\w+$/)?.[1] ?? 0, 10);
    const nb = parseInt(b.match(/(\d+)\.\w+$/)?.[1] ?? 0, 10);
    return na - nb;
  })
  .map(([path, img], i) => ({ id: `d${i}`, image_url: img, title: "", fileName: path.split("/").pop() }));
