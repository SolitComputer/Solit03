import { useState, useEffect } from "react";
import {
  ImagePlus, X, Loader2, Star, FileText, Sparkles,
  Tag, User, Globe, Check, Layers, Rocket, FileEdit,
  CheckCircle2,
} from "lucide-react";
import TiptapEditor from "./TiptapEditor";
import { uploadArticleImage } from "../../services/storage";
import { getArticleTags } from "../services/AdminArticleTags";
import { compressImage, formatFileSize } from "../../utils/compressImage";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const MAX_IMAGES = 10;

export default function ArticleForm({ form, setForm, categories, onSubmit, buttonText, disabled }) {
  const [slugManual, setSlugManual] = useState(!!form.slug);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

  useEffect(() => {
    if (form.slug) setSlugManual(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getArticleTags().then(setAvailableTags).catch(() => {});
  }, []);

  function handleTitle(e) {
    const title = e.target.value;
    setForm((f) => ({ ...f, title, slug: slugManual ? f.slug : slugify(title) }));
  }

  // ═══════════════════════════════════════════════════════════
  // Multi-image upload dengan kompresi otomatis
  // ═══════════════════════════════════════════════════════════
  async function handleImagesUpload(e) {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length === 0) return;

    const currentImages = form.images || [];
    const remaining = MAX_IMAGES - currentImages.length;
    if (remaining <= 0) return;

    const toProcess = files.slice(0, remaining);
    setUploadingImages(true);
    setCompressionInfo(null);

    try {
      const newImages = [];
      let totalOriginal = 0;
      let totalCompressed = 0;

      for (const file of toProcess) {
        const originalSize = file.size;

        // 1. Kompresi gambar
        const compressed = await compressImage(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.8,
          outputType: "image/webp",
        });

        totalOriginal += originalSize;
        totalCompressed += compressed.size;

        // 2. Upload ke Supabase Storage
        const url = await uploadArticleImage(compressed);

        newImages.push({
          url,
          is_primary: currentImages.length === 0 && newImages.length === 0,
        });
      }

      // Tampilkan info kompresi
      const savedPercent = Math.round(
        ((totalOriginal - totalCompressed) / totalOriginal) * 100
      );
      setCompressionInfo({
        count: newImages.length,
        original: formatFileSize(totalOriginal),
        compressed: formatFileSize(totalCompressed),
        saved: savedPercent,
      });
      setTimeout(() => setCompressionInfo(null), 4000);

      // Update form state
      const allImages = [...currentImages, ...newImages];
      const primaryUrl =
        allImages.find((i) => i.is_primary)?.url || allImages[0]?.url || "";

      setForm((f) => ({
        ...f,
        images: allImages,
        cover_image: primaryUrl,
      }));
    } catch (err) {
      console.error("Gagal upload gambar:", err);
      alert("Gagal upload gambar");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  }

  function setPrimaryImage(index) {
    const updated = (form.images || []).map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    setForm((f) => ({
      ...f,
      images: updated,
      cover_image: updated[index]?.url || "",
    }));
  }

  function removeImage(index) {
    const images = [...(form.images || [])];
    const removed = images.splice(index, 1)[0];

    // Jika yang dihapus primary, set foto pertama sebagai primary
    if (removed?.is_primary && images.length > 0) {
      images[0].is_primary = true;
    }

    setForm((f) => ({
      ...f,
      images,
      cover_image:
        images.find((i) => i.is_primary)?.url || images[0]?.url || "",
    }));
  }

  // ═══════════════════════════════════════════════════════════
  // Tags (tidak berubah)
  // ═══════════════════════════════════════════════════════════
  function addTag(name) {
    const val = (name ?? tagInput).trim();
    if (!val) return;
    if (!form.tag_names.some((t) => t.toLowerCase() === val.toLowerCase())) {
      setForm((f) => ({ ...f, tag_names: [...f.tag_names, val] }));
    }
    setTagInput("");
    setTagDropdownOpen(false);
  }

  function removeTag(name) {
    setForm((f) => ({ ...f, tag_names: f.tag_names.filter((t) => t !== name) }));
  }

  const unselectedTags = availableTags.filter(
    (t) => !form.tag_names.some((sel) => sel.toLowerCase() === t.name.toLowerCase())
  );
  const tagSuggestions = tagInput.trim()
    ? unselectedTags.filter((t) => t.name.toLowerCase().includes(tagInput.trim().toLowerCase()))
    : unselectedTags;

  const imageCount = form.images?.length || 0;
  const canAddMore = imageCount < MAX_IMAGES;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ================= MAIN CONTENT (Left 2 Cols) ================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card 1: Judul & Meta */}
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-border">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-content">Detail & Metadata Artikel</h3>
                <p className="text-xs text-content-muted">Informasi utama artikel yang akan dibaca pengunjung</p>
              </div>
            </div>

            {/* Judul Artikel */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-content-soft uppercase tracking-wider">Judul Artikel *</label>
                <span className="text-[11px] text-content-muted">{form.title.length}/100 Karakter</span>
              </div>
              <input
                required
                type="text"
                value={form.title}
                onChange={handleTitle}
                placeholder="Contoh: 5 Laptop Second Terbaik untuk Mahasiswa 2026..."
                className="w-full bg-surface-muted/80 border border-border rounded-xl text-sm font-medium px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-surface transition"
              />
            </div>

            {/* Slug / Permanent URL */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-content-soft uppercase tracking-wider flex items-center gap-1">
                  <Globe size={12} className="text-blue-500" /> URL Slug (SEO)
                </label>
                {slugManual && (
                  <button
                    type="button"
                    onClick={() => { setSlugManual(false); setForm((f) => ({ ...f, slug: slugify(f.title) })); }}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md transition"
                  >
                    Reset Auto
                  </button>
                )}
              </div>
              <div className="flex items-center bg-surface-muted border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-surface transition">
                <span className="text-xs font-mono text-content-muted bg-gray-100 px-3.5 py-3 border-r border-border select-none">
                  /berita/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { setSlugManual(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
                  placeholder="url-artikel-otomatis"
                  className="w-full bg-transparent text-sm font-mono px-3.5 py-3 focus:outline-none text-content-soft"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-content-soft uppercase tracking-wider">Ringkasan Singkat (Excerpt)</label>
                <span className="text-[11px] text-content-muted">Tampil di Google & Card</span>
              </div>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={3}
                placeholder="Tulis 1-2 kalimat ringkasan yang menarik untuk memicu klik pengunjung..."
                className="w-full bg-surface-muted/80 border border-border rounded-xl text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-surface transition resize-none"
              />
            </div>
          </div>

          {/* Card 2: Editor Isi Artikel */}
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-content">Isi Konten Artikel *</h3>
                  <p className="text-xs text-content-muted">Tulis isi berita / tips lengkap dengan format gambar & heading</p>
                </div>
              </div>
            </div>

            <TiptapEditor
              value={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
            />
          </div>
        </div>

        {/* ================= SIDEBAR (Right 1 Col) ================= */}
        <div className="space-y-6 sticky top-20">

          {/* ═══ MULTI IMAGE UPLOAD CARD ═══ */}
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-content-soft uppercase tracking-wider">
                Cover Image
              </label>
              <span className="text-[10px] text-content-muted font-medium">
                {imageCount}/{MAX_IMAGES} Gambar
              </span>
            </div>

            {/* Info Kompresi — muncul 4 detik setelah upload */}
            {compressionInfo && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-[11px] text-green-700">
                <CheckCircle2 size={13} className="flex-shrink-0" />
                <span>
                  {compressionInfo.count} gambar:{" "}
                  <span className="font-semibold">{compressionInfo.original}</span>
                  {" → "}
                  <span className="font-semibold">{compressionInfo.compressed}</span>
                  {" "}
                  <span className="font-bold">(hemat {compressionInfo.saved}%)</span>
                </span>
              </div>
            )}

            {/* Preview Grid Gambar */}
            {imageCount > 0 && (
              <div className={`grid gap-2 ${imageCount === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                {form.images.map((img, i) => (
                  <div
                    key={img.id || img.url || i}
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                      imageCount === 1 ? "aspect-video" : "aspect-[4/3]"
                    } ${
                      img.is_primary
                        ? "border-amber-400 ring-2 ring-amber-200 shadow-sm"
                        : "border-border hover:border-blue-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Cover ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Badge COVER di gambar primary */}
                    {img.is_primary && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-md shadow-sm">
                        COVER
                      </div>
                    )}

                    {/* Hover overlay — tombol set primary & hapus */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                      {!img.is_primary && imageCount > 1 && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(i)}
                          title="Set sebagai cover utama"
                          className="p-2 bg-white/90 hover:bg-amber-50 rounded-full shadow-md transition hover:scale-110"
                        >
                          <Star size={14} className="text-amber-500" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        title="Hapus gambar"
                        className="p-2 bg-white/90 hover:bg-red-50 rounded-full shadow-md transition hover:scale-110"
                      >
                        <X size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Zone — klik atau bisa pilih banyak file sekaligus */}
            {canAddMore && (
              <label
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition p-4 text-center ${
                  imageCount === 0 ? "aspect-video" : "py-3"
                } ${
                  uploadingImages
                    ? "border-blue-300 bg-blue-50/40 cursor-wait"
                    : "border-border hover:border-blue-500 hover:bg-blue-50/40"
                }`}
              >
                {uploadingImages ? (
                  <>
                    <Loader2 size={22} className="animate-spin text-blue-600" />
                    <p className="text-xs font-bold text-blue-600">Mengkompresi & upload...</p>
                  </>
                ) : (
                  <>
                    <div className={`${imageCount === 0 ? "p-3" : "p-2"} bg-blue-50 text-blue-600 rounded-full`}>
                      <ImagePlus size={imageCount === 0 ? 20 : 16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-content-soft">
                        {imageCount === 0 ? "Upload Gambar Cover" : "Tambah Gambar Lagi"}
                      </p>
                      <p className="text-[11px] text-content-muted mt-0.5">
                        PNG, JPG, WebP — otomatis dikompresi
                      </p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImagesUpload}
                  disabled={uploadingImages}
                />
              </label>
            )}

            {/* Hint set cover */}
            {imageCount > 1 && (
              <p className="text-[10px] text-content-muted text-center">
                <Star size={9} className="inline text-amber-500 mr-0.5" fill="currentColor" />
                Hover gambar & klik ★ untuk set cover utama
              </p>
            )}
          </div>

          {/* Pengaturan Kategori & Status (tidak berubah) */}
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-5 space-y-4">

            {/* Kategori */}
            <div>
              <label className="text-xs font-bold text-content-soft uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Layers size={13} className="text-blue-500" /> Kategori *
              </label>
              <select
                required
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                className="w-full bg-surface-muted border border-border rounded-xl text-sm px-3.5 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-surface transition"
              >
                <option value="">-- Pilih Kategori Artikel --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Penulis */}
            <div>
              <label className="text-xs font-bold text-content-soft uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <User size={13} className="text-content-muted" /> Penulis
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Misal: Tim Redaksi Solit"
                className="w-full bg-surface-muted border border-border rounded-xl text-sm px-3.5 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-surface transition"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-bold text-content-soft uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Tag size={13} className="text-content-muted" /> Tags
              </label>

              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onFocus={() => setTagDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setTagDropdownOpen(false), 150)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Cari & pilih tag, atau ketik baru..."
                    className="flex-1 bg-surface-muted border border-border rounded-xl text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-surface transition"
                  />
                  <button
                    type="button"
                    onClick={() => addTag()}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-content-soft font-semibold rounded-xl text-xs transition"
                  >
                    +
                  </button>
                </div>

                {tagDropdownOpen && tagSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-surface border border-border rounded-xl shadow-lg max-h-40 overflow-y-auto">
                    {tagSuggestions.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => addTag(t.name)}
                        className="w-full text-left px-3 py-2 text-xs text-content-soft hover:bg-blue-50 hover:text-blue-700 transition"
                      >
                        #{t.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {form.tag_names.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {form.tag_names.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium rounded-full">
                      #{t}
                      <button type="button" onClick={() => removeTag(t)} className="text-blue-400 hover:text-blue-700">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {unselectedTags.length > 0 && (
                <div className="mt-2.5 pt-2.5 border-t border-border">
                  <p className="text-[10px] font-semibold text-content-muted uppercase tracking-wider mb-1.5">Tag Tersedia — klik untuk pilih</p>
                  <div className="flex flex-wrap gap-1.5">
                    {unselectedTags.slice(0, 12).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => addTag(t.name)}
                        className="px-2.5 py-1 bg-surface-muted border border-border text-content-soft text-xs font-medium rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition"
                      >
                        #{t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Unggulan / Featured Toggle */}
            <div className="pt-2 border-t border-border">
              <label className="flex items-center gap-3 p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 cursor-pointer hover:bg-amber-50 transition">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                  className="w-4 h-4 rounded border-border text-amber-500 focus:ring-amber-400"
                />
                <div className="flex items-center gap-1.5">
                  <Star size={16} strokeWidth={2.5} className="text-amber-500" />
                  <span className="text-xs font-bold text-content">Artikel Unggulan (Featured)</span>
                </div>
              </label>
            </div>

            {/* Status Publish */}
            <div>
              <label className="text-xs font-bold text-content-soft uppercase tracking-wider block mb-1.5">Status Publikasi</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: "draft" }))}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    form.status === "draft"
                      ? "bg-gray-800 text-white border-gray-800 shadow-sm"
                      : "bg-surface-muted text-content-soft border-border hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-1.5 justify-center">
                    <FileEdit size={14} /> Draft
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: "published" }))}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    form.status === "published"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-surface-muted text-content-soft border-border hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-1.5 justify-center">
                    <Rocket size={14} /> Publish
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={disabled}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {disabled ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>{buttonText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}