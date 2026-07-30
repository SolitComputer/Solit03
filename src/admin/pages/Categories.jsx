import { useEffect, useState, useCallback } from "react";
import {
  Plus, Search, Edit, Trash2, Layers3, RefreshCw,
  ChevronLeft, ChevronRight, X, ChevronDown, Save, AlertTriangle,
  Laptop, Gamepad2, BarChart3, Palette, BookOpen, Star, Wallet, Sparkles,
  Folder, Files, Eye, CalendarDays
} from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/AdminCategories";
import { useToast } from "../context/ToastContext";
import { useDebounce } from "../hooks/useDebounce";

const iconOptions = [
  { value: "Laptop",    Icon: Laptop,    bg: "from-blue-100 to-blue-200", text: "text-blue-600" },
  { value: "Gaming",    Icon: Gamepad2,  bg: "from-purple-100 to-purple-200", text: "text-purple-600" },
  { value: "Office",    Icon: BarChart3, bg: "from-green-100 to-green-200", text: "text-green-600" },
  { value: "Design",    Icon: Palette,   bg: "from-pink-100 to-pink-200", text: "text-pink-600" },
  { value: "Student",   Icon: BookOpen,  bg: "from-yellow-100 to-yellow-200", text: "text-yellow-600" },
  { value: "Premium",   Icon: Star,      bg: "from-amber-100 to-amber-200", text: "text-amber-600" },
  { value: "Budget",    Icon: Wallet,    bg: "from-emerald-100 to-emerald-200", text: "text-emerald-600" },
  { value: "Ultrabook", Icon: Sparkles,  bg: "from-indigo-100 to-indigo-200", text: "text-indigo-600" },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getIcon(icon) {
  return iconOptions.find(o => o.value === icon)?.Icon || Folder;
}

function getIconStyle(icon) {
  return iconOptions.find(o => o.value === icon) || iconOptions[0];
}

// ── Shared Modal Shell ──────────────────────────────────────────────
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const y = window.scrollY;
    Object.assign(document.body.style, { overflow: "hidden", position: "fixed", width: "100%", top: `-${y}px` });
    return () => {
      const top = document.body.style.top;
      Object.assign(document.body.style, { overflow: "", position: "", width: "", top: "" });
      window.scrollTo(0, parseInt(top || "0") * -1);
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      {children}
    </div>
  );
}

// ── Category Form Modal ─────────────────────────────────────────────
function CategoryModal({ isOpen, onClose, onSubmit, title, initialData, isEditing }) {
  const [form, setForm] = useState({ name: "", slug: "", icon: "Laptop" });
  const [errors, setErrors] = useState({});
  const [slugManual, setSlugManual] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("Laptop");

  useEffect(() => {
    if (initialData) {
      setForm({ name: initialData.name || "", slug: initialData.slug || "", icon: initialData.icon || "Laptop" });
      setSelectedIcon(initialData.icon || "Laptop");
      setSlugManual(!!initialData.slug);
    } else {
      setForm({ name: "", slug: "", icon: "Laptop" });
      setSelectedIcon("Laptop");
      setSlugManual(false);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleName = e => {
    const name = e.target.value;
    setForm(f => ({ ...f, name, slug: slugManual ? f.slug : slugify(name) }));
  };

  const handleIconSelect = (iconValue) => {
    setSelectedIcon(iconValue);
    setForm(f => ({ ...f, icon: iconValue }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim()) return setErrors({ name: "Nama kategori harus diisi" });
    onSubmit(form);
  };

  const iconStyle = getIconStyle(form.icon);
  const FormIcon = getIcon(form.icon);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header with blue accent */}
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Layers3 size={16} className="text-blue-600" />
              </div>
              <h2 className="text-base font-bold text-content">{title}</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 text-content-muted hover:text-content-soft">
              <X size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-content-soft">
              Nama Kategori <span className="text-red-500">*</span>
            </label>
            <input 
              autoFocus 
              type="text" 
              placeholder="Contoh: Gaming Laptop, Office, Premium" 
              value={form.name} 
              onChange={handleName}
              className={`w-full bg-surface-muted border-2 rounded-xl text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-surface transition-all duration-200
                ${errors.name ? "border-red-400 focus:ring-red-500" : "border-border hover:border-border"}`} 
            />
            {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> {errors.name}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-content-soft">Slug (URL)</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="slug-kategori-otomatis"
                value={form.slug}
                onChange={e => { setSlugManual(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                className="w-full bg-surface-muted border-2 border-border rounded-xl text-sm font-mono px-4 py-2.5 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-surface transition-all duration-200 text-content-soft" 
              />
              {slugManual && (
                <button type="button" onClick={() => { setSlugManual(false); setForm(f => ({ ...f, slug: slugify(f.name) })); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-600 hover:text-blue-700 bg-surface px-2 py-1 rounded-lg shadow-sm">
                  Auto
                </button>
              )}
            </div>
            <p className="text-xs text-content-muted">Digunakan untuk URL kategori</p>
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-content-soft">Icon Kategori</label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map(opt => (
                <button 
                  key={opt.value} 
                  type="button" 
                  onClick={() => handleIconSelect(opt.value)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200
                    ${form.icon === opt.value 
                      ? `bg-blue-50 ring-2 ring-blue-500 shadow-md transform scale-105` 
                      : "bg-surface-muted border-2 border-border hover:bg-gray-100 hover:border-border"}`}>
                  <opt.Icon className="w-6 h-6" aria-hidden="true" />
                  <span className={`text-[10px] font-medium ${form.icon === opt.value ? "text-blue-600 font-bold" : "text-content-muted"}`}>
                    {opt.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Card */}
          <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50/50">
            <p className="text-xs font-semibold text-content-soft mb-2">Preview Kategori</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md bg-surface">
                <FormIcon className="w-6 h-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-content truncate">{form.name || "Nama Kategori"}</p>
                <p className="text-xs text-content-muted font-mono truncate">{form.slug || "slug-kategori"}</p>
              </div>
              <div className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 bg-surface shadow-sm">
                {form.icon || "Icon"}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-border rounded-xl text-sm font-semibold text-content-soft hover:bg-surface-muted hover:border-border transition-all duration-200">
              Batal
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
              <Save size={16} /> {isEditing ? "Update Kategori" : "Simpan Kategori"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// ── Delete Modal ────────────────────────────────────────────────────
function DeleteModal({ isOpen, onClose, onConfirm, name, isDeleting }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600" />
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-100 rounded-full">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <h2 className="text-base font-bold text-content">Hapus Kategori</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 text-content-muted">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-content-soft">
            Apakah Anda yakin ingin menghapus kategori <span className="font-bold text-red-600">“{name}”</span>?
          </p>
          <p className="text-xs text-content-muted mt-2">Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.</p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border-2 border-border rounded-xl text-sm font-semibold text-content-soft hover:bg-surface-muted transition-all duration-200">
            Batal
          </button>
          <button onClick={onConfirm} disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
            {isDeleting 
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Menghapus...</>
              : <><Trash2 size={16} /> Hapus Permanen</>}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("newest");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { showToast } = useToast();
  const debouncedSearch = useDebounce(search, 500);

  const load = useCallback(async () => {
    setLoading(true);
    try { setCategories(await getCategories()); }
    catch { showToast("Gagal memuat kategori", "error"); }
    finally { setLoading(false); setInitialLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let f = [...categories];
    if (debouncedSearch) f = f.filter(c => c.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || c.slug?.toLowerCase().includes(debouncedSearch.toLowerCase()));
    f.sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      return new Date(b.created_at) - new Date(a.created_at);
    });
    setFiltered(f); setPage(1);
  }, [categories, debouncedSearch, sortBy]);

  const handleCreate = async (data) => {
    try { await createCategory(data); showToast("Kategori berhasil ditambahkan", "success"); setCreateOpen(false); load(); }
    catch { showToast("Gagal menambahkan kategori", "error"); }
  };
  const handleUpdate = async (data) => {
    try { await updateCategory(selected.id, data); showToast("Kategori berhasil diperbarui", "success"); setEditOpen(false); setSelected(null); load(); }
    catch { showToast("Gagal mengupdate kategori", "error"); }
  };
  const handleDelete = async () => {
    if (!selected) return;
    setDeletingId(selected.id);
    try { await deleteCategory(selected.id); showToast("Kategori berhasil dihapus", "success"); setDeleteOpen(false); setSelected(null); load(); }
    catch { showToast("Gagal menghapus kategori", "error"); }
    finally { setDeletingId(null); }
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  if (initialLoading) return (
    <div className="space-y-5">
      <div className="animate-pulse space-y-2">
        <div className="w-32 h-6 bg-gray-200 rounded-lg" />
        <div className="w-48 h-4 bg-gray-200 rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="bg-surface rounded-xl p-4 shadow-sm animate-pulse"><div className="w-16 h-3 bg-gray-200 rounded mb-2"/><div className="w-12 h-7 bg-gray-200 rounded"/></div>)}
      </div>
      <div className="bg-surface rounded-xl shadow-sm overflow-hidden animate-pulse">
        {[1,2,3,4,5].map(i => <div key={i} className="flex items-center gap-4 px-5 py-3"><div className="w-10 h-10 bg-gray-200 rounded-xl"/><div className="flex-1"><div className="w-28 h-3 bg-gray-200 rounded mb-1.5"/><div className="w-20 h-2 bg-gray-200 rounded"/></div></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <CategoryModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} title="Tambah Kategori Baru" isEditing={false} />
      <CategoryModal isOpen={editOpen} onClose={() => { setEditOpen(false); setSelected(null); }} onSubmit={handleUpdate} title="Edit Kategori" initialData={selected} isEditing={true} />
      <DeleteModal isOpen={deleteOpen} onClose={() => { setDeleteOpen(false); setSelected(null); }} onConfirm={handleDelete} name={selected?.name} isDeleting={deletingId === selected?.id} />

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-content">
            Manajemen Kategori
          </h1>
          <p className="text-sm text-content-muted mt-1">Kelola semua kategori produk Anda</p>
        </div>
        <button onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-200 hover:scale-105">
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Kategori", value: categories.length, icon: Files, badgeBg: "bg-blue-600" },
          { label: "Ditampilkan", value: paginated.length, icon: Eye, badgeBg: "bg-gray-700" },
          { label: "Filter Aktif", value: search ? "Ya" : "Tidak", icon: Search, badgeBg: "bg-blue-600" },
        ].map(({ label, value, icon: Icon, badgeBg }) => (
          <div key={label} className="bg-surface rounded-xl shadow-sm p-5 border border-border">
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-6 h-6 text-content-soft" aria-hidden="true" />
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeBg} text-white`}>
                {typeof value === 'number' ? `${value} item` : value}
              </span>
            </div>
            <p className="text-sm font-semibold text-content-soft">{label}</p>
            <p className="text-2xl font-bold text-content mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-surface rounded-xl shadow-sm border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" />
            <input 
              type="text" 
              placeholder="Cari kategori berdasarkan nama atau slug..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-surface-muted border-2 border-border rounded-xl text-sm pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-surface transition-all duration-200" 
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-soft transition-colors"><X size={14} /></button>}
          </div>
          <div className="flex gap-2">
            {[
              { val: sortBy, set: setSortBy, opts: [["newest","Terbaru"],["oldest","Terlama"],["name_asc","A-Z"],["name_desc","Z-A"]] },
              { val: perPage, set: v => { setPerPage(Number(v)); setPage(1); }, opts: [[10,"10 per halaman"],[25,"25 per halaman"],[50,"50 per halaman"]] },
            ].map((s, i) => (
              <div key={i} className="relative">
                <select value={s.val} onChange={e => s.set(e.target.value)}
                  className="bg-surface-muted border-2 border-border rounded-xl text-sm pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-content-soft font-medium hover:border-border transition-all duration-200">
                  {s.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" />
              </div>
            ))}
            {(search || sortBy !== "newest") && (
              <button onClick={() => { setSearch(""); setSortBy("newest"); setPage(1); }}
                className="px-4 py-2.5 border-2 border-border rounded-xl text-sm font-semibold text-content-soft hover:bg-surface-muted hover:border-border transition-all duration-200 flex items-center gap-2">
                <RefreshCw size={14} /> Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-surface rounded-xl shadow-md border border-border overflow-hidden">
        <div className="px-5 py-4 border-b-2 border-border flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <p className="text-sm font-bold text-content-soft">Daftar Kategori</p>
          <p className="text-xs font-semibold text-content-muted bg-gray-100 px-2 py-1 rounded-lg">{filtered.length} ditemukan</p>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1"><div className="w-32 h-3 bg-gray-200 rounded mb-2"/><div className="w-24 h-2 bg-gray-200 rounded"/></div>
                <div className="w-16 h-2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
              <Layers3 size={32} className="text-purple-400" />
            </div>
            <p className="text-base font-semibold text-content-muted">{search ? "Kategori tidak ditemukan" : "Belum ada kategori"}</p>
            <p className="text-sm text-content-muted mt-1">{search ? "Coba dengan kata kunci lain" : "Klik tombol Tambah Kategori untuk memulai"}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginated.map(cat => {
              const iconStyle = getIconStyle(cat.icon);
              const CatIcon = getIcon(cat.icon);
              return (
                <div key={cat.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md bg-gradient-to-br ${iconStyle.bg}`}>
                    <CatIcon className={`w-5 h-5 ${iconStyle.text}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-content">{cat.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${iconStyle.text} bg-surface shadow-sm`}>
                        {cat.icon || "Umum"}
                      </span>
                    </div>
                    <p className="text-xs text-content-muted font-mono">/{cat.slug}</p>
                  </div>
                  {cat.created_at && (
                    <p className="text-xs text-content-muted hidden md:block flex-shrink-0">
                      <CalendarDays className="w-3.5 h-3.5 inline" aria-hidden="true" /> {new Date(cat.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => { setSelected(cat); setEditOpen(true); }}
                      className="p-2 text-content-muted hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => { setSelected(cat); setDeleteOpen(true); }} disabled={deletingId === cat.id}
                      className="p-2 text-content-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-40">
                      {deletingId === cat.id
                        ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > perPage && (
          <div className="px-5 py-4 border-t-2 border-border bg-surface-muted flex items-center justify-between">
            <p className="text-xs font-medium text-content-soft">
              Menampilkan {(page-1)*perPage+1}–{Math.min(page*perPage, filtered.length)} dari {filtered.length} kategori
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(p-1,1))} disabled={page===1}
                className="p-2 rounded-lg border-2 border-border bg-surface text-content-soft hover:bg-surface-muted transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-border">
                <ChevronLeft size={14} />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let n = totalPages <= 5 ? i+1 : page <= 3 ? i+1 : page >= totalPages-2 ? totalPages-4+i : page-2+i;
                  return (
                    <button key={n} onClick={() => setPage(n)}
                      className={`min-w-[32px] h-8 rounded-lg text-sm font-semibold transition-all duration-200 
                        ${page===n 
                          ? "bg-blue-600 text-white shadow-sm font-bold" 
                          : "text-content-soft hover:bg-gray-100 border-2 border-transparent hover:border-border"}`}>
                      {n}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setPage(p => Math.min(p+1,totalPages))} disabled={page===totalPages}
                className="p-2 rounded-lg border-2 border-border bg-surface text-content-soft hover:bg-surface-muted transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-border">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}