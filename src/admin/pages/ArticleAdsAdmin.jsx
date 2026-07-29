import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, Loader2, Eye, EyeOff, Megaphone, AlertTriangle } from "lucide-react";
import {
  getAllArticleAds, createArticleAd, updateArticleAd, deleteArticleAd, uploadSiteContentFile,
} from "../services/AdminSiteContent";
import { useToast } from "../context/ToastContext";
import { AD_BANNER_SIZES, AD_PLACEMENT_LABELS, formatMaxSize, detectBannerSize } from "../../utils/adBannerSizes";

const inputCls = "bg-gray-50 border-2 border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all";

const EMPTY_NEW = {
  banner_size: "",
  cta_label: "Lihat Promo",
  cta_url: "",
};

export default function ArticleAdsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newAd, setNewAd] = useState(EMPTY_NEW);
  const [newFile, setNewFile] = useState(null);
  const [detectedDims, setDetectedDims] = useState(null);
  const [sizeMismatch, setSizeMismatch] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await getAllArticleAds()); }
    catch (error) { showToast(error.message || "Gagal memuat iklan", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  function updateLocal(id, field, value) {
    setItems((list) => list.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }

  async function handleSaveRow(item) {
    setSavingId(item.id);
    try {
      await updateArticleAd(item.id, {
        cta_label: item.cta_label,
        cta_url: item.cta_url,
        order_index: item.order_index,
        is_active: item.is_active,
      });
      showToast("Iklan diperbarui", "success");
    } catch (error) {
      showToast(error.message || "Gagal menyimpan", "error");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Hapus iklan ini?")) return;
    try { await deleteArticleAd(id); showToast("Iklan dihapus", "success"); load(); }
    catch (error) { showToast(error.message || "Gagal menghapus", "error"); }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setNewFile(file);
    setDetectedDims(null);
    setSizeMismatch(false);

    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setDetectedDims({ width: img.naturalWidth, height: img.naturalHeight });
      const match = detectBannerSize(img.naturalWidth, img.naturalHeight);
      if (match) {
        setNewAd((a) => ({ ...a, banner_size: match }));
        setSizeMismatch(false);
      } else {
        setNewAd((a) => ({ ...a, banner_size: "" }));
        setSizeMismatch(true);
      }
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  }

  async function handleCreate() {
    if (!newAd.cta_url.trim()) return showToast("Link tujuan (CTA URL) harus diisi", "error");
    if (!newFile) return showToast("Upload gambar banner dulu", "error");
    if (!newAd.banner_size) return showToast("Pilih ukuran banner dulu (rasio gambar tidak terdeteksi otomatis)", "error");

    const spec = AD_BANNER_SIZES[newAd.banner_size];
    if (newFile.size > spec.maxBytes) {
      return showToast(
        `File terlalu besar (${(newFile.size / 1024).toFixed(0)} KB). Maksimal ${formatMaxSize(spec.maxBytes)} untuk ukuran ${spec.label}.`,
        "error"
      );
    }

    setCreating(true);
    try {
      const url = await uploadSiteContentFile(newFile, "article-ads");
      await createArticleAd({ ...newAd, image_url: url, order_index: items.length + 1 });
      setNewAd(EMPTY_NEW);
      setNewFile(null);
      setDetectedDims(null);
      setSizeMismatch(false);
      showToast("Iklan ditambahkan", "success");
      load();
    } catch (error) {
      showToast(error.message || "Gagal menambahkan iklan", "error");
    } finally {
      setCreating(false);
    }
  }

  const newSpec = newAd.banner_size ? AD_BANNER_SIZES[newAd.banner_size] : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Iklan Artikel
        </h1>
        <p className="text-sm text-gray-500 mt-1">Kelola banner iklan laptop yang diselipkan di antara berita</p>
      </div>

      {/* Add new */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        <p className="text-xs font-semibold text-gray-700">Tambah Iklan Baru</p>

        <div>
          <label className="text-xs font-semibold text-gray-700">Gambar Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`${inputCls} w-full mt-1.5`}
          />
          {newFile && detectedDims && (
            <p className="text-[11px] text-gray-400 mt-1">
              {newFile.name} — {(newFile.size / 1024).toFixed(0)} KB, terdeteksi {detectedDims.width}×{detectedDims.height}px
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700">
            Ukuran Banner {newFile && <span className="text-gray-400 font-normal">(auto-terdeteksi, bisa diubah manual)</span>}
          </label>
          <select
            value={newAd.banner_size}
            onChange={(e) => { setNewAd({ ...newAd, banner_size: e.target.value }); setSizeMismatch(false); }}
            className={`${inputCls} w-full mt-1.5`}
          >
            <option value="" disabled>-- Pilih ukuran --</option>
            {Object.entries(AD_BANNER_SIZES).map(([key, spec]) => (
              <option key={key} value={key}>{spec.label}</option>
            ))}
          </select>

          {newSpec && (
            <p className="text-[11px] text-blue-600 mt-1.5 font-medium">
              Dimensi {newSpec.width}×{newSpec.height}px, maks {formatMaxSize(newSpec.maxBytes)} → akan tampil di: {AD_PLACEMENT_LABELS[newAd.banner_size]}
            </p>
          )}

          {sizeMismatch && (
            <p className="flex items-start gap-1.5 text-[11px] text-red-600 mt-1.5 font-medium">
              <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
              Rasio gambar tidak cocok dengan ukuran manapun (toleransi ±10%). Pilih ukuran manual di atas, atau ganti gambar dengan rasio yang sesuai.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Label tombol (mis. Lihat Promo)" value={newAd.cta_label} onChange={(e) => setNewAd({ ...newAd, cta_label: e.target.value })} className={inputCls} />
          <input placeholder="Link tujuan (https://... atau /katalog-laptop)" value={newAd.cta_url} onChange={(e) => setNewAd({ ...newAd, cta_url: e.target.value })} className={inputCls} />
        </div>

        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-60"
        >
          {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Tambah Iklan
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 size={24} className="animate-spin text-blue-500" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-20 text-center">
          <Megaphone size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">Belum ada iklan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const spec = AD_BANNER_SIZES[item.banner_size] || AD_BANNER_SIZES.billboard;
            return (
              <div key={item.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="relative bg-gray-50" style={{ aspectRatio: `${spec.width} / ${spec.height}` }}>
                  <img src={item.image_url} alt="" className={`w-full h-full object-cover ${!item.is_active ? "opacity-40" : ""}`} />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded-md">
                    {spec.width}×{spec.height}
                  </span>
                </div>
                <div className="p-3 space-y-2">
                  <input value={item.cta_label} onChange={(e) => updateLocal(item.id, "cta_label", e.target.value)} placeholder="Label tombol" className={`${inputCls} w-full`} />
                  <input value={item.cta_url} onChange={(e) => updateLocal(item.id, "cta_url", e.target.value)} placeholder="Link tujuan" className={`${inputCls} w-full`} />

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => updateLocal(item.id, "is_active", !item.is_active)}
                      className={`flex items-center gap-1 text-[11px] font-semibold ${item.is_active ? "text-emerald-600" : "text-gray-400"}`}
                    >
                      {item.is_active ? <Eye size={13} /> : <EyeOff size={13} />}
                      {item.is_active ? "Aktif" : "Tersembunyi"}
                    </button>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleSaveRow(item)} disabled={savingId === item.id} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50">
                        {savingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
