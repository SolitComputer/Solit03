import { useState, useEffect } from "react";
import { 
  ImagePlus, X, Loader2, Star, FileText, Sparkles, 
  Tag, User, Globe, Check, Layers 
} from "lucide-react";
import TiptapEditor from "./TiptapEditor";
import { uploadArticleImage } from "../../services/storage";
import { getArticleTags } from "../services/AdminArticleTags";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ArticleForm({ form, setForm, categories, onSubmit, buttonText, disabled }) {
  const [slugManual, setSlugManual] = useState(!!form.slug);
  const [uploadingCover, setUploadingCover] = useState(false);
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

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingCover(true);
      const url = await uploadArticleImage(file);
      setForm((f) => ({ ...f, cover_image: url }));
    } catch (err) {
      console.error(err);
      alert("Gagal upload cover image");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  }

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
          
          {/* Cover Image Upload Card */}
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-content-soft uppercase tracking-wider">Cover Image</label>
              <span className="text-[10px] text-content-muted font-medium">16:9 (Maks 5MB)</span>
            </div>

            {form.cover_image ? (
              <div className="relative rounded-xl overflow-hidden border border-border group">
                <img src={form.cover_image} alt="cover" className="w-full aspect-video object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, cover_image: "" }))}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition"
                    title="Hapus Cover"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl aspect-video cursor-pointer hover:border-blue-500 hover:bg-blue-50/40 transition p-4 text-center">
                {uploadingCover ? (
                  <Loader2 size={24} className="animate-spin text-blue-600" />
                ) : (
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                    <ImagePlus size={20} />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-content-soft">Klik / Upload Gambar</p>
                  <p className="text-[11px] text-content-muted mt-0.5">PNG, JPG, WebP</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </label>
            )}
          </div>

          {/* Pengaturan Kategori & Status */}
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
                  <Star size={15} className="text-amber-500 fill-amber-500" />
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
                  📝 Draft
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
                  🚀 Publish
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
