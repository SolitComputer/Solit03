import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Loader2, Eye, EyeOff, Video as VideoIcon } from "lucide-react";
import {
  getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, uploadSiteContentFile,
} from "../services/AdminSiteContent";
import { useToast } from "../context/ToastContext";

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await getAllTestimonials()); }
    catch { showToast("Gagal memuat testimoni", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadSiteContentFile(file, "testimonials");
      await createTestimonial({ video_url: url, order_index: items.length + 1 });
      showToast("Video testimoni ditambahkan", "success");
      load();
    } catch {
      showToast("Gagal upload video", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function updateName(item, name) {
    setItems((list) => list.map((it) => (it.id === item.id ? { ...it, customer_name: name } : it)));
  }
  async function saveName(item) {
    try { await updateTestimonial(item.id, { customer_name: item.customer_name }); }
    catch { showToast("Gagal menyimpan nama", "error"); }
  }

  async function toggleActive(item) {
    try { await updateTestimonial(item.id, { is_active: !item.is_active }); load(); }
    catch { showToast("Gagal memperbarui", "error"); }
  }

  async function handleDelete(id) {
    if (!window.confirm("Hapus video testimoni ini?")) return;
    try { await deleteTestimonial(id); showToast("Video dihapus", "success"); load(); }
    catch { showToast("Gagal menghapus", "error"); }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Video Testimoni
          </h1>
          <p className="text-sm text-content-muted mt-1">Kelola video bukti kepuasan pelanggan di homepage</p>
        </div>
        <label className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Upload Video
          <input type="file" accept="video/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 size={24} className="animate-spin text-blue-500" /></div>
      ) : items.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl shadow-sm py-20 text-center">
          <VideoIcon size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-content-muted">Belum ada video testimoni</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
              <video src={item.video_url} controls className={`w-full aspect-[3/4] object-cover bg-black ${!item.is_active ? "opacity-40" : ""}`} />
              <div className="p-2.5 space-y-2">
                <input
                  placeholder="Nama pelanggan (opsional)"
                  value={item.customer_name || ""}
                  onChange={(e) => updateName(item, e.target.value)}
                  onBlur={() => saveName(item)}
                  className="w-full bg-surface-muted border border-border rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center justify-between">
                  <button onClick={() => toggleActive(item)} className={`flex items-center gap-1 text-[11px] font-semibold ${item.is_active ? "text-emerald-600" : "text-content-muted"}`}>
                    {item.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                    {item.is_active ? "Aktif" : "Tersembunyi"}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
