import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Loader2, Eye, EyeOff, Image as ImageIcon, Import } from "lucide-react";
import {
  getAllPromoImages, createPromoImage, updatePromoImage, deletePromoImage, uploadSiteContentFile,
} from "../services/AdminSiteContent";
import { useToast } from "../context/ToastContext";
import { DEFAULT_SHOWCASE_IMAGES } from "../../utils/defaultShowcaseImages";

export default function PromoImagesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await getAllPromoImages()); }
    catch { showToast("Gagal memuat showcase", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadSiteContentFile(file, "promo");
      await createPromoImage({ image_url: url, order_index: items.length + 1 });
      showToast("Gambar ditambahkan", "success");
      load();
    } catch {
      showToast("Gagal upload gambar", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleImportDefaults() {
    setImporting(true);
    try {
      let orderIndex = items.length;
      for (const img of DEFAULT_SHOWCASE_IMAGES) {
        orderIndex += 1;
        const res = await fetch(img.image_url);
        const blob = await res.blob();
        const file = new File([blob], img.fileName || `showcase-${orderIndex}.webp`, { type: blob.type });
        const url = await uploadSiteContentFile(file, "promo");
        await createPromoImage({ image_url: url, order_index: orderIndex });
      }
      showToast(`${DEFAULT_SHOWCASE_IMAGES.length} gambar berhasil diimpor`, "success");
      load();
    } catch {
      showToast("Gagal mengimpor galeri lama", "error");
    } finally {
      setImporting(false);
    }
  }

  async function toggleActive(item) {
    try {
      await updatePromoImage(item.id, { is_active: !item.is_active });
      load();
    } catch { showToast("Gagal memperbarui", "error"); }
  }

  async function handleDelete(id) {
    if (!window.confirm("Hapus gambar ini?")) return;
    try { await deletePromoImage(id); showToast("Gambar dihapus", "success"); load(); }
    catch { showToast("Gagal menghapus", "error"); }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Showcase Laptop
          </h1>
          <p className="text-sm text-content-muted mt-1">Kelola galeri poster laptop di homepage</p>
        </div>
        <div className="flex items-center gap-2">
          {!loading && items.length === 0 && DEFAULT_SHOWCASE_IMAGES.length > 0 && (
            <button
              onClick={handleImportDefaults}
              disabled={importing}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface border-2 border-blue-200 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition disabled:opacity-60"
            >
              {importing ? <Loader2 size={16} className="animate-spin" /> : <Import size={16} />}
              Impor dari Galeri Lama
            </button>
          )}
          <label className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Tambah Gambar
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 size={24} className="animate-spin text-blue-500" /></div>
      ) : items.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl shadow-sm py-20 text-center">
          <ImageIcon size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-content-muted">Belum ada gambar showcase di database</p>
          {DEFAULT_SHOWCASE_IMAGES.length > 0 && (
            <p className="text-xs text-content-muted mt-1.5 max-w-sm mx-auto">
              Homepage saat ini masih menampilkan {DEFAULT_SHOWCASE_IMAGES.length} gambar bawaan lama.
              Klik "Impor dari Galeri Lama" di atas supaya bisa dikelola dari sini.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden group">
              <div className="aspect-square bg-surface-muted relative">
                <img src={item.image_url} alt="" className={`w-full h-full object-cover ${!item.is_active ? "opacity-40" : ""}`} />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => toggleActive(item)} className="p-1.5 bg-surface/90 rounded-lg text-content-soft hover:text-blue-600 shadow-sm">
                    {item.is_active ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-surface/90 rounded-lg text-content-soft hover:text-red-600 shadow-sm">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {!item.is_active && (
                <p className="text-[10px] text-center text-content-muted py-1 bg-surface-muted">Tersembunyi</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
