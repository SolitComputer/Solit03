import { useEffect, useState, useCallback } from "react";
import {
  Plus, Search, Edit, Trash2, Layers3, X, AlertTriangle, Save,
  Newspaper, TrendingUp, Tag as TagIcon, Lightbulb, Percent, Cpu, Gamepad2, Sparkles, Database, CheckCircle2
} from "lucide-react";
import {
  getArticleCategories, createArticleCategory, updateArticleCategory, deleteArticleCategory,
} from "../services/AdminArticleCategories";
import { useToast } from "../context/ToastContext";
import { useDebounce } from "../hooks/useDebounce";

const iconOptions = [
  { value: "Berita", Icon: Newspaper, bg: "from-blue-100 to-blue-200", text: "text-blue-600" },
  { value: "Trending", Icon: TrendingUp, bg: "from-red-100 to-red-200", text: "text-red-600" },
  { value: "Tips", Icon: Lightbulb, bg: "from-yellow-100 to-yellow-200", text: "text-yellow-600" },
  { value: "Promo", Icon: Percent, bg: "from-emerald-100 to-emerald-200", text: "text-emerald-600" },
  { value: "Teknologi", Icon: Cpu, bg: "from-indigo-100 to-indigo-200", text: "text-indigo-600" },
  { value: "Gaming", Icon: Gamepad2, bg: "from-purple-100 to-purple-200", text: "text-purple-600" },
  { value: "Review", Icon: Sparkles, bg: "from-pink-100 to-pink-200", text: "text-pink-600" },
  { value: "Umum", Icon: TagIcon, bg: "from-gray-100 to-gray-200", text: "text-content-soft" },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function getIconStyle(icon) {
  return iconOptions.find((o) => o.value === icon) || iconOptions[0];
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-all"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
}

function CategoryModal({ isOpen, onClose, onSubmit, title, initialData, isEditing }) {
  const [form, setForm] = useState({ name: "", slug: "", icon: "Berita" });
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({ name: initialData.name || "", slug: initialData.slug || "", icon: initialData.icon || "Berita" });
      setSlugManual(!!initialData.slug);
    } else {
      setForm({ name: "", slug: "", icon: "Berita" });
      setSlugManual(false);
    }
    setError("");
  }, [initialData, isOpen]);

  const handleName = (e) => {
    const name = e.target.value;
    setForm((f) => ({ ...f, name, slug: slugManual ? f.slug : slugify(name) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Nama kategori harus diisi");
    onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-border animate-in fade-in zoom-in duration-200" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-muted/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Layers3 size={18} />
            </div>
            <h2 className="text-base font-bold text-content">{title}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-gray-200/60 text-content-muted hover:text-content-soft transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-content-soft uppercase tracking-wider">Nama Kategori *</label>
            <input 
              autoFocus 
              type="text" 
              placeholder="Contoh: Tips & Trik, Promo, Review"
              value={form.name} 
              onChange={handleName}
              className={`w-full mt-1.5 bg-surface-muted border-2 rounded-xl text-sm font-medium px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-surface transition ${error ? "border-red-400" : "border-border"}`} 
            />
            {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={12} /> {error}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-content-soft uppercase tracking-wider">Slug (URL)</label>
              {slugManual && (
                <button
                  type="button"
                  onClick={() => { setSlugManual(false); setForm((f) => ({ ...f, slug: slugify(f.name) })); }}
                  className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded"
                >
                  Reset Auto
                </button>
              )}
            </div>
            <div className="flex items-center bg-surface-muted border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-surface transition">
              <span className="text-xs font-mono text-content-muted bg-gray-100 px-3 py-2.5 border-r border-border select-none">/</span>
              <input 
                type="text" 
                value={form.slug} 
                onChange={(e) => { setSlugManual(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
                className="w-full bg-transparent text-sm font-mono px-3 py-2.5 focus:outline-none text-content-soft" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-content-soft uppercase tracking-wider mb-2 block">Pilih Ikon Visual</label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((opt) => (
                <button 
                  key={opt.value} 
                  type="button" 
                  onClick={() => setForm((f) => ({ ...f, icon: opt.value }))}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition ${
                    form.icon === opt.value 
                      ? `bg-gradient-to-br ${opt.bg} ring-2 ring-blue-500 scale-105 shadow-sm` 
                      : "bg-surface-muted border border-border hover:bg-gray-100"
                  }`}
                >
                  <opt.Icon className={`w-5 h-5 ${opt.text}`} />
                  <span className="text-[10px] font-bold text-content-soft">{opt.value}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-border">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-xs font-bold text-content-soft hover:bg-gray-100 transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition"
            >
              <Save size={15} /> {isEditing ? "Simpan Perubahan" : "Buat Kategori"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function DeleteModal({ isOpen, onClose, onConfirm, name, isDeleting }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-red-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 rounded-xl text-red-600"><AlertTriangle size={18} /></div>
            <h2 className="text-base font-bold text-content">Hapus Kategori</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 text-content-muted"><X size={16} /></button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-content-soft">
            Apakah Anda yakin ingin menghapus kategori <span className="font-bold text-content">"{name}"</span>?
          </p>
          <p className="text-xs text-content-muted mt-1">Artikel yang menggunakan kategori ini tidak akan terhapus.</p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-border rounded-xl text-xs font-bold text-content-soft hover:bg-surface-muted transition">Batal</button>
          <button 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md shadow-red-500/20"
          >
            {isDeleting ? "Menghapus..." : (<><Trash2 size={15} /> Hapus Kategori</>)}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function ArticleCategories() {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { showToast } = useToast();
  const debouncedSearch = useDebounce(search, 300);

  const load = useCallback(async () => {
    setLoading(true);
    try { setCategories(await getArticleCategories()); }
    catch { showToast("Gagal memuat kategori", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let f = [...categories];
    if (debouncedSearch) f = f.filter((c) => c.name?.toLowerCase().includes(debouncedSearch.toLowerCase()));
    setFiltered(f);
  }, [categories, debouncedSearch]);

  const handleCreate = async (data) => {
    try { 
      await createArticleCategory(data); 
      showToast("Kategori berhasil ditambahkan", "success"); 
      setCreateOpen(false); 
      load(); 
    } catch { 
      showToast("Gagal menambahkan kategori", "error"); 
    }
  };

  const handleUpdate = async (data) => {
    try { 
      await updateArticleCategory(selected.id, data); 
      showToast("Kategori berhasil diperbarui", "success"); 
      setEditOpen(false); 
      setSelected(null); 
      load(); 
    } catch { 
      showToast("Gagal mengupdate kategori", "error"); 
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeletingId(selected.id);
    try { 
      await deleteArticleCategory(selected.id); 
      showToast("Kategori berhasil dihapus", "success"); 
      setDeleteOpen(false); 
      setSelected(null); 
      load(); 
    } catch { 
      showToast("Gagal menghapus kategori", "error"); 
    } finally { 
      setDeletingId(null); 
    }
  };

  return (
    <div className="space-y-6">
      <CategoryModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} title="Tambah Kategori Artikel Baru" isEditing={false} />
      <CategoryModal isOpen={editOpen} onClose={() => { setEditOpen(false); setSelected(null); }} onSubmit={handleUpdate} title="Edit Kategori Artikel" initialData={selected} isEditing={true} />
      <DeleteModal isOpen={deleteOpen} onClose={() => { setDeleteOpen(false); setSelected(null); }} onConfirm={handleDelete} name={selected?.name} isDeleting={deletingId === selected?.id} />

      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-5 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-md shadow-blue-500/20">
            <Layers3 size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-content">Kategori Artikel</h1>
            <p className="text-xs text-content-muted mt-0.5">Kelola topik & taksonomi artikel berita toko</p>
          </div>
        </div>

        <button 
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={16} /> Tambah Kategori Baru
        </button>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Layers3 size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-content-muted uppercase tracking-wider">Total Kategori</p>
            <p className="text-xl font-black text-content">{categories.length}</p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-content-muted uppercase tracking-wider">Status Integrasi</p>
            <p className="text-xs font-bold text-emerald-600 mt-0.5">Terhubung ke Database</p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Database size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-content-muted uppercase tracking-wider">Database Table</p>
            <p className="text-xs font-mono font-semibold text-content-soft mt-0.5">article_categories</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface rounded-2xl shadow-sm border border-border p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
          <input 
            type="text" 
            placeholder="Cari nama kategori atau slug..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-muted/80 border border-border rounded-xl text-xs font-medium pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-surface transition" 
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-soft text-xs"
            >
              Clear
            </button>
          )}
        </div>
        <span className="text-xs font-semibold text-content-muted px-2 hidden sm:inline">
          {filtered.length} Kategori
        </span>
      </div>

      {/* Main Grid View of Categories */}
      <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs font-semibold text-content-muted">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            Memuat daftar kategori...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Layers3 size={36} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-bold text-content-soft">Belum ada kategori artikel</p>
            <p className="text-xs text-content-muted mt-1">Klik tombol "+ Tambah Kategori Baru" untuk mulai membuat</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {filtered.map((cat) => {
              const style = getIconStyle(cat.icon);
              const Icon = style.Icon;
              return (
                <div 
                  key={cat.id} 
                  className="bg-surface-muted/70 border border-border rounded-2xl p-4 flex items-center justify-between hover:bg-surface hover:shadow-md hover:border-blue-100 transition duration-200 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br ${style.bg} shadow-sm group-hover:scale-105 transition`}>
                      <Icon className={`w-5 h-5 ${style.text}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-content truncate">{cat.name}</h3>
                      <p className="text-[11px] text-content-muted font-mono truncate mt-0.5">/{cat.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pl-2">
                    <button 
                      onClick={() => { setSelected(cat); setEditOpen(true); }} 
                      className="p-2 text-content-muted hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                      title="Edit Kategori"
                    >
                      <Edit size={15} />
                    </button>
                    <button 
                      onClick={() => { setSelected(cat); setDeleteOpen(true); }} 
                      disabled={deletingId === cat.id}
                      className="p-2 text-content-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-40"
                      title="Hapus Kategori"
                    >
                      {deletingId === cat.id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
