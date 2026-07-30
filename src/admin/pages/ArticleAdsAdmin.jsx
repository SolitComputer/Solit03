import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, Loader2, Eye, EyeOff, Megaphone, AlertTriangle } from "lucide-react";
import {
  getAllArticleAds, createArticleAd, updateArticleAd, deleteArticleAd, uploadSiteContentFile,
} from "../services/AdminSiteContent";
import { useToast } from "../context/ToastContext";
import { AD_BANNER_SIZES, AD_PLACEMENT_LABELS, formatMaxSize, detectBannerSize } from "../../utils/adBannerSizes";

const inputCls = "bg-gray-50 border-2 border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all";

function isAllowedImage(file) {
  return !!file && file.type.startsWith("image/");
}
const ALLOWED_IMAGE_LABEL = "semua jenis gambar (PNG, JPG, WEBP, GIF, dll)";

const EMPTY_NEW = {
  banner_size: "",
  cta_label: "Lihat Promo",
  cta_url: "",
  custom_width: "",
  custom_height: "",
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
      const spec = AD_BANNER_SIZES[item.banner_size];
      const payload = {
        cta_label: item.cta_label,
        cta_url: item.cta_url,
        order_index: item.order_index,
        is_active: item.is_active,
      };
      if (spec?.customSize) {
        const w = Number(item.custom_width);
        const h = Number(item.custom_height);
        if (!w || !h) return showToast("Isi lebar & tinggi gambar untuk Iklan Kanan-Kiri", "error");
        if (w > spec.maxWidth || h > spec.maxHeight) {
          return showToast(`Ukuran maksimal untuk Iklan Kanan-Kiri adalah ${spec.maxWidth}×${spec.maxHeight}px`, "error");
        }
        payload.custom_width = w;
        payload.custom_height = h;
      }
      await updateArticleAd(item.id, payload);
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
    setNewFile(null);
    setDetectedDims(null);
    setSizeMismatch(false);

    if (!file) return;

    if (!isAllowedImage(file)) {
      e.target.value = "";
      return showToast(`Format file tidak didukung. Gunakan ${ALLOWED_IMAGE_LABEL}.`, "error");
    }

    setNewFile(file);

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
    if (!isAllowedImage(newFile)) return showToast(`Format file tidak didukung. Gunakan ${ALLOWED_IMAGE_LABEL}.`, "error");
    if (!newAd.banner_size) return showToast("Pilih ukuran banner dulu (rasio gambar tidak terdeteksi otomatis)", "error");

    const spec = AD_BANNER_SIZES[newAd.banner_size];
    if (newFile.size > spec.maxBytes) {
      return showToast(
        `File terlalu besar (${formatMaxSize(newFile.size)}). Maksimal ${formatMaxSize(spec.maxBytes)}.`,
        "error"
      );
    }

    let custom_width = null;
    let custom_height = null;
    if (spec.customSize) {
      const w = Number(newAd.custom_width);
      const h = Number(newAd.custom_height);
      if (!w || !h) return showToast("Isi lebar & tinggi gambar untuk Iklan Kanan-Kiri", "error");
      if (w > spec.maxWidth || h > spec.maxHeight) {
        return showToast(`Ukuran maksimal untuk Iklan Kanan-Kiri adalah ${spec.maxWidth}×${spec.maxHeight}px`, "error");
      }
      custom_width = w;
      custom_height = h;
    }

    setCreating(true);
    try {
      const url = await uploadSiteContentFile(newFile, "article-ads");
      await createArticleAd({
        banner_size: newAd.banner_size,
        cta_label: newAd.cta_label,
        cta_url: newAd.cta_url,
        custom_width,
        custom_height,
        image_url: url,
        order_index: items.length + 1,
      });
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
          <p className="text-[11px] text-gray-400 mt-1">Format yang didukung: {ALLOWED_IMAGE_LABEL}</p>
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
            onChange={(e) => {
              const key = e.target.value;
              const spec = AD_BANNER_SIZES[key];
              setNewAd({
                ...newAd,
                banner_size: key,
                custom_width: spec?.customSize ? String(spec.width) : "",
                custom_height: spec?.customSize ? String(spec.height) : "",
              });
              setSizeMismatch(false);
            }}
            className={`${inputCls} w-full mt-1.5`}
          >
            <option value="" disabled>-- Pilih ukuran --</option>
            {Object.entries(AD_BANNER_SIZES).map(([key, spec]) => (
              <option key={key} value={key}>{spec.label}</option>
            ))}
          </select>

          {newSpec && !newSpec.customSize && (
            <p className="text-[11px] text-blue-600 mt-1.5 font-medium">
              Dimensi {newSpec.width}×{newSpec.height}px, maks {formatMaxSize(newSpec.maxBytes)} → akan tampil di: {AD_PLACEMENT_LABELS[newAd.banner_size]}
            </p>
          )}

          {newSpec && newSpec.customSize && (
            <div className="mt-2 space-y-1.5">
              <p className="text-[11px] text-blue-600 font-medium">
                Atur ukuran sendiri (maks {newSpec.maxWidth}×{newSpec.maxHeight}px, maks file {formatMaxSize(newSpec.maxBytes)}) → tampil di: {AD_PLACEMENT_LABELS[newAd.banner_size]}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min={1}
                  max={newSpec.maxWidth}
                  placeholder="Lebar (px)"
                  value={newAd.custom_width}
                  onChange={(e) => setNewAd({ ...newAd, custom_width: e.target.value })}
                  className={inputCls}
                />
                <input
                  type="number"
                  min={1}
                  max={newSpec.maxHeight}
                  placeholder="Tinggi (px)"
                  value={newAd.custom_height}
                  onChange={(e) => setNewAd({ ...newAd, custom_height: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
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
            const dispWidth = spec.customSize ? item.custom_width || spec.width : spec.width;
            const dispHeight = spec.customSize ? item.custom_height || spec.height : spec.height;
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="relative bg-slate-950 h-48 flex items-center justify-center p-3 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt=""
                    style={{ aspectRatio: `${dispWidth} / ${dispHeight}` }}
                    className={`max-h-full max-w-full object-contain rounded shadow-md ${!item.is_active ? "opacity-40" : ""}`}
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-slate-900/90 text-white text-[10px] font-bold rounded-md border border-slate-700 backdrop-blur-sm">
                    {dispWidth}×{dispHeight}
                  </span>
                </div>
                <div className="p-3 space-y-2">
                  {spec.customSize && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min={1}
                        max={spec.maxWidth}
                        placeholder="Lebar (px)"
                        value={item.custom_width || ""}
                        onChange={(e) => updateLocal(item.id, "custom_width", e.target.value)}
                        className={`${inputCls} w-full`}
                      />
                      <input
                        type="number"
                        min={1}
                        max={spec.maxHeight}
                        placeholder="Tinggi (px)"
                        value={item.custom_height || ""}
                        onChange={(e) => updateLocal(item.id, "custom_height", e.target.value)}
                        className={`${inputCls} w-full`}
                      />
                    </div>
                  )}
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
