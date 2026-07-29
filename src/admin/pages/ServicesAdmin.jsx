import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, Loader2, GripVertical, Eye, EyeOff } from "lucide-react";
import { getAllServices, createService, updateService, deleteService } from "../services/AdminSiteContent";
import { useToast } from "../context/ToastContext";
import { SERVICE_ICON_OPTIONS, getServiceIcon } from "../../utils/serviceIcons";

const ICON_OPTIONS = SERVICE_ICON_OPTIONS;
const inputCls = "bg-gray-50 border-2 border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all";

export default function ServicesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [newItem, setNewItem] = useState({ icon: "Sparkles", title: "", description: "" });
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await getAllServices()); }
    catch { showToast("Gagal memuat layanan", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  function updateLocal(id, field, value) {
    setItems((list) => list.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }

  async function handleSaveRow(item) {
    setSavingId(item.id);
    try {
      await updateService(item.id, {
        icon: item.icon, title: item.title, description: item.description,
        order_index: item.order_index, is_active: item.is_active,
      });
      showToast("Layanan diperbarui", "success");
    } catch {
      showToast("Gagal menyimpan", "error");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Hapus layanan ini?")) return;
    try { await deleteService(id); showToast("Layanan dihapus", "success"); load(); }
    catch { showToast("Gagal menghapus", "error"); }
  }

  async function handleAdd() {
    if (!newItem.title.trim()) return showToast("Judul layanan harus diisi", "error");
    try {
      await createService({ ...newItem, order_index: items.length + 1 });
      setNewItem({ icon: "Sparkles", title: "", description: "" });
      showToast("Layanan ditambahkan", "success");
      load();
    } catch {
      showToast("Gagal menambahkan layanan", "error");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Layanan (Services)
        </h1>
        <p className="text-sm text-gray-500 mt-1">Kelola daftar layanan yang tampil di homepage</p>
      </div>

      {/* Add new */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-700 mb-3">Tambah Layanan Baru</p>
        <div className="flex flex-wrap items-center gap-2">
          <select value={newItem.icon} onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })} className={inputCls}>
            {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
          </select>
          <input placeholder="Judul" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className={`${inputCls} flex-1 min-w-[140px]`} />
          <input placeholder="Deskripsi singkat" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className={`${inputCls} flex-1 min-w-[140px]`} />
          <button onClick={handleAdd} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition">
            <Plus size={15} /> Tambah
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-blue-500" /></div>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-16">Belum ada layanan</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const Icon = getServiceIcon(item.icon);
              return (
              <div key={item.id} className="flex flex-wrap items-center gap-2 px-5 py-3.5">
                <GripVertical size={14} className="text-gray-300 hidden sm:block" />
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <select value={item.icon} onChange={(e) => updateLocal(item.id, "icon", e.target.value)} className={inputCls}>
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <input value={item.title} onChange={(e) => updateLocal(item.id, "title", e.target.value)} className={`${inputCls} flex-1 min-w-[120px]`} />
                <input value={item.description || ""} onChange={(e) => updateLocal(item.id, "description", e.target.value)} className={`${inputCls} flex-1 min-w-[120px]`} />
                <input
                  type="number"
                  value={item.order_index}
                  onChange={(e) => updateLocal(item.id, "order_index", Number(e.target.value))}
                  className={`${inputCls} w-16`}
                  title="Urutan"
                />
                <button
                  onClick={() => updateLocal(item.id, "is_active", !item.is_active)}
                  title={item.is_active ? "Aktif — klik untuk sembunyikan" : "Tersembunyi — klik untuk aktifkan"}
                  className={`p-2 rounded-lg transition ${item.is_active ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}
                >
                  {item.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => handleSaveRow(item)} disabled={savingId === item.id} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50">
                  {savingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={16} />
                </button>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
