import { useEffect, useState, useMemo, useCallback } from "react";
import { X, Search, Laptop, RefreshCw, Camera, CheckCircle, AlertCircle } from "lucide-react";
import { fetchCatalogLaptops, addLaptopPhotos, deleteLaptopPhoto } from "../../services/catalog";
import { uploadMultipleImages } from "../../services/storage";
import { useToast } from "../context/ToastContext";

const fmt = (n) => `Rp ${(Number(n) || 0).toLocaleString("id-ID")}`;

function LaptopPhotoCard({ laptop, onChanged }) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const photos = laptop.photos || [];

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    for (const f of files) {
      if (!f.type.startsWith("image/")) return showToast("Semua file harus gambar", "error");
      if (f.size > 5 * 1024 * 1024) return showToast("Maks 5MB per gambar", "error");
    }
    try {
      setUploading(true);
      const urls = await uploadMultipleImages(files);
      await addLaptopPhotos(laptop.id, urls);
      showToast(`${urls.length} foto ditambahkan`, "success");
      onChanged();
    } catch (err) {
      showToast(err.message || "Gagal upload foto", "error");
    } finally { setUploading(false); }
  }

  async function handleDelete(photoId) {
    if (!confirm("Hapus foto ini?")) return;
    try {
      setDeletingId(photoId);
      await deleteLaptopPhoto(photoId);
      showToast("Foto dihapus", "success");
      onChanged();
    } catch (err) {
      showToast(err.message || "Gagal hapus foto", "error");
    } finally { setDeletingId(null); }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-3 border-b border-gray-50 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{laptop.laptop_name}</p>
          <p className="text-[11px] text-gray-400">{laptop.brand || "—"} · {fmt(laptop.price)} · Ready {laptop.stock}</p>
        </div>
        {photos.length > 0 ? (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex-shrink-0">
            <CheckCircle size={10} /> {photos.length} foto
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex-shrink-0">
            <AlertCircle size={10} /> Belum ada foto
          </span>
        )}
      </div>

      <div className="p-3">
        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {photos.map((p) => (
              <div key={p.id} className="relative group aspect-square">
                <img src={p.image_url} alt="" className="w-full h-full object-cover rounded-lg border border-gray-100" />
                <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition disabled:opacity-50" title="Hapus">
                  {deletingId === p.id
                    ? <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <X size={11} className="text-white" />}
                </button>
              </div>
            ))}
          </div>
        )}

        <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-4 cursor-pointer transition ${uploading ? "border-blue-300 bg-blue-50/50" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"}`}>
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-1.5" />
              <span className="text-xs text-blue-500">Mengupload...</span>
            </>
          ) : (
            <>
              <Camera size={18} className="text-gray-300 mb-1.5" />
              <span className="text-xs text-gray-400">Tambah foto (bisa banyak sekaligus)</span>
              <span className="text-[10px] text-gray-300 mt-0.5">PNG, JPG, WEBP · maks 5MB</span>
            </>
          )}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

export default function KatalogFoto() {
  const { showToast } = useToast();
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL | WITH | WITHOUT

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCatalogLaptops();
      setLaptops(data);
    } catch (err) {
      console.error(err);
      showToast("Gagal memuat data dari solit-pos", "error");
    } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    let list = [...laptops];
    if (search.trim()) {
      const t = search.toLowerCase();
      list = list.filter((l) => l.laptop_name?.toLowerCase().includes(t) || l.brand?.toLowerCase().includes(t));
    }
    if (filter === "WITH") list = list.filter((l) => (l.photos || []).length > 0);
    if (filter === "WITHOUT") list = list.filter((l) => (l.photos || []).length === 0);
    return list;
  }, [laptops, search, filter]);

  const stats = useMemo(() => {
    const withPhoto = laptops.filter((l) => (l.photos || []).length > 0).length;
    return { total: laptops.length, withPhoto, without: laptops.length - withPhoto };
  }, [laptops]);

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Camera size={20} className="text-blue-200" />
          <h1 className="text-xl font-bold">Foto Katalog Laptop</h1>
        </div>
        <p className="text-blue-100 text-sm">Upload foto laptop ready stock. Data ditarik langsung dari solit-pos (hanya status siap jual).</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Ready", value: stats.total },
          { label: "Sudah Ada Foto", value: stats.withPhoto },
          { label: "Belum Ada Foto", value: stats.without },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-3 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Cari nama atau brand laptop..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-600">
            <option value="ALL">Semua</option>
            <option value="WITHOUT">Belum ada foto</option>
            <option value="WITH">Sudah ada foto</option>
          </select>
          <button onClick={load} className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 flex items-center gap-1.5">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-white border border-gray-100 rounded-xl animate-pulse h-56" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl py-16 text-center">
          <Laptop size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="text-sm text-gray-500">{laptops.length === 0 ? "Belum ada laptop siap jual di solit-pos" : "Tidak ada laptop yang cocok"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((l) => <LaptopPhotoCard key={l.id} laptop={l} onChanged={load} />)}
        </div>
      )}
    </div>
  );
}