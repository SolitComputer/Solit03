export const AD_BANNER_SIZES = {
  leaderboard: { label: "Leaderboard (728×90)", width: 728, height: 90, maxBytes: 100 * 1024 },
  billboard: { label: "Billboard (970×250)", width: 970, height: 250, maxBytes: 200 * 1024 },
  medium_rectangle: { label: "Medium Rectangle (300×250)", width: 300, height: 250, maxBytes: 100 * 1024 },
  mobile_leaderboard: { label: "Mobile Leaderboard (320×50)", width: 320, height: 50, maxBytes: 50 * 1024 },
};

export const AD_PLACEMENT_LABELS = {
  leaderboard: "Section Berita di Homepage",
  billboard: "Grid halaman /berita",
  medium_rectangle: "Sidebar halaman detail artikel",
  mobile_leaderboard: "Fallback tampilan mobile untuk Leaderboard & Billboard",
};

export function formatMaxSize(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

// Cocokkan rasio gambar (width/height) ke salah satu ukuran target dalam
// toleransi tertentu. Mengembalikan key ukuran yang paling dekat, atau null
// kalau tidak ada yang cocok dalam toleransi.
export function detectBannerSize(width, height, tolerance = 0.1) {
  if (!width || !height) return null;
  const ratio = width / height;

  let best = null;
  let bestDiff = Infinity;

  for (const [key, spec] of Object.entries(AD_BANNER_SIZES)) {
    const targetRatio = spec.width / spec.height;
    const diff = Math.abs(ratio - targetRatio) / targetRatio;
    if (diff <= tolerance && diff < bestDiff) {
      best = key;
      bestDiff = diff;
    }
  }

  return best;
}
