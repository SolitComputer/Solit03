/**
 * compressImage.js
 * Utility kompresi gambar di browser sebelum upload ke Supabase Storage.
 * Pakai Canvas API — tidak perlu library tambahan.
 *
 * Taruh di: src/utils/compressImage.js
 */

/**
 * Kompresi dan resize satu gambar
 * @param {File} file - File gambar asli
 * @param {Object} options
 * @param {number} options.maxWidth - Max lebar (default: 1200px)
 * @param {number} options.maxHeight - Max tinggi (default: 1200px)
 * @param {number} options.quality - Kualitas 0-1 (default: 0.8 = 80%)
 * @param {string} options.outputType - MIME type output (default: 'image/webp')
 * @returns {Promise<File>} File hasil kompresi
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    outputType = "image/webp",
  } = options;

  // Skip kalau bukan image
  if (!file.type.startsWith("image/")) return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Hitung dimensi baru — maintain aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Render ke canvas lalu convert
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Gagal mengkompresi gambar"));
              return;
            }
            const ext = outputType === "image/webp" ? ".webp" : ".jpg";
            const newName = file.name.replace(/\.[^.]+$/, ext);
            resolve(
              new File([blob], newName, { type: outputType, lastModified: Date.now() })
            );
          },
          outputType,
          quality
        );
      };

      img.onerror = () => reject(new Error("Gagal memuat gambar"));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Format ukuran file ke string yang mudah dibaca
 * @param {number} bytes
 * @returns {string} e.g. "1.2 MB"
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}