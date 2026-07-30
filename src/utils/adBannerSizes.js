const MAX_AD_BYTES = 2 * 1024 * 1024;

export const AD_BANNER_SIZES = {
  leaderboard: { label: "Leaderboard (728×90)", width: 728, height: 90, maxBytes: MAX_AD_BYTES },
  billboard: { label: "Billboard (970×250)", width: 970, height: 250, maxBytes: MAX_AD_BYTES },
  medium_rectangle: { label: "Medium Rectangle (300×250)", width: 300, height: 250, maxBytes: MAX_AD_BYTES },
  mobile_leaderboard: { label: "Mobile Leaderboard (320×50)", width: 320, height: 50, maxBytes: MAX_AD_BYTES },
  sidebar_flank: {
    label: "Iklan Kanan-Kiri (Desktop Flanking)",
    width: 260,
    height: 500,
    maxBytes: MAX_AD_BYTES,
    customSize: true,
    maxWidth: 300,
    maxHeight: 700,
  },
};

export const AD_PLACEMENT_LABELS = {
  leaderboard: "Section Berita di Homepage",
  billboard: "Grid halaman /berita",
  medium_rectangle: "Sidebar halaman detail artikel",
  mobile_leaderboard: "Fallback tampilan mobile untuk Leaderboard & Billboard",
  sidebar_flank: "Kanan-kiri layar (desktop layar lebar, >= 1720px)",
};

export function formatMaxSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")} MB`;
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
    if (spec.customSize) continue;
    const targetRatio = spec.width / spec.height;
    const diff = Math.abs(ratio - targetRatio) / targetRatio;
    if (diff <= tolerance && diff < bestDiff) {
      best = key;
      bestDiff = diff;
    }
  }

  return best;
}
