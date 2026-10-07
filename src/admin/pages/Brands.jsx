import { useEffect, useState, useCallback } from "react";
import {
  Plus, Search, Edit, Trash2, Tags, RefreshCw,
  ChevronLeft, ChevronRight, X, ChevronDown, Save, AlertTriangle,
  Tag, Eye, CalendarDays, Check, Sparkles
} from "lucide-react";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../services/AdminBrands";
import { useToast } from "../context/ToastContext";
import { useDebounce } from "../hooks/useDebounce";

const brandColors = [
  { value: "blue", bg: "bg-gradient-to-br from-blue-500 to-blue-600", text: "text-blue-600 dark:text-blue-400", lightBg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/30" },
  { value: "purple", bg: "bg-gradient-to-br from-purple-500 to-purple-600", text: "text-purple-600 dark:text-purple-400", lightBg: "bg-purple-50 dark:bg-purple-500/10", border: "border-purple-200 dark:border-purple-500/30" },
  { value: "green", bg: "bg-gradient-to-br from-emerald-500 to-emerald-600", text: "text-emerald-600 dark:text-emerald-400", lightBg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/30" },
  { value: "orange", bg: "bg-gradient-to-br from-amber-500 to-amber-600", text: "text-amber-600 dark:text-amber-400", lightBg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/30" },
  { value: "red", bg: "bg-gradient-to-br from-rose-500 to-rose-600", text: "text-rose-600 dark:text-rose-400", lightBg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-200 dark:border-rose-500/30" },
  { value: "teal", bg: "bg-gradient-to-br from-teal-500 to-teal-600", text: "text-teal-600 dark:text-teal-400", lightBg: "bg-teal-50 dark:bg-teal-500/10", border: "border-teal-200 dark:border-teal-500/30" },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getColorStyle(color) {
  return brandColors.find(c => c.value === color) || brandColors[0];
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
}

// ── Brand Form Modal ────────────────────────────────────────────────
function BrandModal({ isOpen, onClose, onSubmit, title, initialData, isEditing }) {
  const [form, setForm] = useState({ name: "", slug: "", color: "blue" });
  const [errors, setErrors] = useState({});
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({ name: initialData.name || "", slug: initialData.slug || "", color: initialData.color || "blue" });
      setSlugManual(!!initialData.slug);
    } else {
      setForm({ name: "", slug: "", color: "blue" });
      setSlugManual(false);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleName = e => {
    const name = e.target.value;
    setForm(f => ({ ...f, name, slug: slugManual ? f.slug : slugify(name) }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim()) return setErrors({ name: "Nama brand harus diisi" });
    onSubmit({ ...form, color: "blue" });
  };

  const c = getColorStyle(form.color);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-surface border border-border/80 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header with accent bar */}
        <div className="relative border-b border-border/80">
          <div className={`absolute top-0 left-0 right-0 h-1.5 ${c.bg}`} />
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.lightBg} ${c.text}`}>
                <Tags size={16} />
              </div>
              <h2 className="text-base font-bold text-content">{title}</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-muted transition text-content-muted hover:text-content">
              <X size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-content-soft flex items-center justify-between">
              <span>Nama Brand <span className="text-red-500 font-bold">*</span></span>
            </label>
            <input
              autoFocus
              type="text"
              placeholder="Contoh: ASUS, Lenovo, Apple"
              value={form.name}
              onChange={handleName}
              className={`w-full bg-surface-muted/60 border rounded-xl text-sm px-3.5 py-2.5 text-content placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-surface transition-all
                ${errors.name ? "border-red-500 focus:ring-red-500/20" : "border-border"}`}
            />
            {errors.name && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> {errors.name}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-content-soft">Slug URL</label>
              <span className="text-[11px] text-content-muted">{slugManual ? "Mode manual" : "Otomatis dari nama"}</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="slug-brand-otomatis"
                value={form.slug}
                onChange={e => { setSlugManual(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                className="w-full bg-surface-muted/60 border border-border rounded-xl text-xs font-mono text-content px-3.5 py-2.5 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-surface transition-all"
              />
              {slugManual && (
                <button type="button" onClick={() => { setSlugManual(false); setForm(f => ({ ...f, slug: slugify(f.name) })); }}
                  className="absolute right-2 text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-2 py-1 rounded-md transition">
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3.5 transition-all">
            <p className="text-[11px] font-bold text-content-muted uppercase tracking-wider mb-2">Live Preview</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm bg-gradient-to-br from-blue-500 to-blue-600">
                <Tags size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-content truncate">{form.name || "Nama Brand"}</p>
                <p className="text-xs text-content-muted font-mono truncate">/{form.slug || "slug-brand"}</p>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-xs font-semibold text-content-soft hover:bg-surface-muted transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Save size={15} /> {isEditing ? "Simpan Perubahan" : "Tambah Brand"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// ── Delete Confirm Modal ────────────────────────────────────────────
function DeleteModal({ isOpen, onClose, onConfirm, name, isDeleting }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-surface border border-border/80 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        <div className="relative border-b border-border/80">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 flex items-center justify-center">
                <AlertTriangle size={18} />
              </div>
              <h2 className="text-base font-bold text-content">Hapus Brand</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-muted transition text-content-muted">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-2">
          <p className="text-sm text-content">
            Apakah Anda yakin ingin menghapus brand <span className="font-bold text-red-600">“{name}”</span>?
          </p>
          <p className="text-xs text-content-muted">
            Tindakan ini tidak dapat dibatalkan. Produk yang menggunakan brand ini mungkin terpengaruh.
          </p>
        </div>
        <div className="flex gap-2.5 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-xl text-xs font-semibold text-content-soft hover:bg-surface-muted transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {isDeleting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Menghapus...</>
            ) : (
              <><Trash2 size={15} /> Ya, Hapus</>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function Brands() {
  const [brands, setBrands] = useState([]);
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
    try {
      setBrands(await getBrands());
    } catch { showToast("Gagal memuat daftar brand", "error"); }
    finally { setLoading(false); setInitialLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let f = [...brands];
    if (debouncedSearch) f = f.filter(b => b.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || b.slug?.toLowerCase().includes(debouncedSearch.toLowerCase()));
    f.sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      return new Date(b.created_at) - new Date(a.created_at);
    });
    setFiltered(f);
    setPage(1);
  }, [brands, debouncedSearch, sortBy]);

  const handleCreate = async (data) => {
    try { await createBrand(data); showToast("Brand berhasil ditambahkan", "success"); setCreateOpen(false); load(); }
    catch { showToast("Gagal menambahkan brand", "error"); }
  };

  const handleUpdate = async (data) => {
    try { await updateBrand(selected.id, data); showToast("Brand berhasil diperbarui", "success"); setEditOpen(false); setSelected(null); load(); }
    catch { showToast("Gagal mengupdate brand", "error"); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeletingId(selected.id);
    try { await deleteBrand(selected.id); showToast("Brand berhasil dihapus", "success"); setDeleteOpen(false); setSelected(null); load(); }
    catch { showToast("Gagal menghapus brand", "error"); }
    finally { setDeletingId(null); }
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  if (initialLoading) return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-2">
        <div className="w-40 h-7 bg-border/60 rounded-xl" />
        <div className="w-60 h-4 bg-border/40 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="bg-surface rounded-2xl p-5 border border-border animate-pulse"><div className="w-20 h-4 bg-border/60 rounded mb-2"/><div className="w-12 h-8 bg-border/80 rounded"/></div>)}
      </div>
      <div className="bg-surface rounded-2xl border border-border overflow-hidden animate-pulse p-4 space-y-4">
        {[1,2,3,4,5].map(i => <div key={i} className="flex items-center gap-4 py-2"><div className="w-10 h-10 bg-border/60 rounded-xl"/><div className="flex-1"><div className="w-32 h-4 bg-border/60 rounded mb-1.5"/><div className="w-20 h-3 bg-border/40 rounded"/></div></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <BrandModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} title="Tambah Brand Baru" isEditing={false} />
      <BrandModal isOpen={editOpen} onClose={() => { setEditOpen(false); setSelected(null); }} onSubmit={handleUpdate} title="Edit Brand" initialData={selected} isEditing={true} />
      <DeleteModal isOpen={deleteOpen} onClose={() => { setDeleteOpen(false); setSelected(null); }} onConfirm={handleDelete} name={selected?.name} isDeleting={deletingId === selected?.id} />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
            <Tags size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-content tracking-tight">
              Manajemen Brand
            </h1>
            <p className="text-xs text-content-muted">Kelola daftar merk dan brand produk laptop Anda.</p>
          </div>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all duration-200 hover:shadow-lg active:scale-95"
        >
          <Plus size={16} /> Tambah Brand
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Brand", value: brands.length, icon: Tag, color: "blue" },
          { label: "Brand Ditampilkan", value: filtered.length, icon: Eye, color: "purple" },
          { label: "Status Pencarian", value: search ? "Filtered" : "Semua", icon: Search, color: "emerald" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface rounded-2xl p-5 border border-border/80 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-content-muted uppercase tracking-wider">{label}</p>
              <p className="text-2xl font-extrabold text-content mt-1.5 tabular-nums">{value}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              color === "blue" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" :
              color === "purple" ? "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400" :
              "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}>
              <Icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar / Search & Filter */}
      <div className="bg-surface rounded-2xl border border-border/80 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Cari brand berdasarkan nama atau slug..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-surface-muted/60 border border-border rounded-xl text-xs font-medium pl-10 pr-10 py-2.5 text-content placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-surface transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-content-muted hover:text-content transition">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-surface-muted/60 border border-border rounded-xl text-xs font-semibold pl-3 pr-8 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition"
              >
                <option value="newest">Urutan: Terbaru</option>
                <option value="oldest">Urutan: Terlama</option>
                <option value="name_asc">Nama: A - Z</option>
                <option value="name_desc">Nama: Z - A</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={perPage}
                onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                className="bg-surface-muted/60 border border-border rounded-xl text-xs font-semibold pl-3 pr-8 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition"
              >
                <option value={10}>10 / Hal</option>
                <option value={25}>25 / Hal</option>
                <option value={50}>50 / Hal</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" />
            </div>

            {(search || sortBy !== "newest") && (
              <button
                onClick={() => { setSearch(""); setSortBy("newest"); setPage(1); }}
                className="px-3.5 py-2.5 border border-border rounded-xl text-xs font-semibold text-content-soft hover:bg-surface-muted transition flex items-center gap-1.5"
                title="Reset pencarian & filter"
              >
                <RefreshCw size={14} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Brands Card List */}
      <div className="bg-surface rounded-2xl border border-border/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border/80 flex items-center justify-between bg-surface-muted/40">
          <p className="text-xs font-bold text-content uppercase tracking-wider">Daftar Brand ({filtered.length})</p>
          <span className="text-[11px] font-semibold text-content-muted">Halaman {page} dari {totalPages || 1}</span>
        </div>

        {loading ? (
          <div className="divide-y divide-border/60">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-10 h-10 bg-border/60 rounded-xl flex-shrink-0" />
                <div className="flex-1"><div className="w-32 h-3.5 bg-border/60 rounded mb-1.5"/><div className="w-24 h-2.5 bg-border/40 rounded"/></div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto bg-surface-muted rounded-2xl flex items-center justify-center mb-3">
              <Tags size={28} className="text-content-muted/40" />
            </div>
            <p className="text-sm font-bold text-content">{search ? "Brand tidak ditemukan" : "Belum ada data brand"}</p>
            <p className="text-xs text-content-muted mt-1 max-w-sm mx-auto">{search ? "Coba gunakan kata kunci lain untuk mencari brand" : "Klik tombol Tambah Brand di atas untuk membuat brand baru"}</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {paginated.map(brand => {
              const c = getColorStyle(brand.color);
              return (
                <div key={brand.id} className="flex items-center justify-between px-5 py-4 hover:bg-surface-muted/60 transition-colors duration-150 group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${c.bg}`}>
                      <Tags size={18} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-content truncate">{brand.name}</p>
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold capitalize ${c.lightBg} ${c.text}`}>
                          {brand.color}
                        </span>
                      </div>
                      <p className="text-xs text-content-muted font-mono mt-0.5">/{brand.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {brand.created_at && (
                      <span className="text-xs text-content-muted hidden md:flex items-center gap-1">
                        <CalendarDays size={13} /> {new Date(brand.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setSelected(brand); setEditOpen(true); }}
                        className="p-2 text-content-muted hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition"
                        title="Edit brand"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => { setSelected(brand); setDeleteOpen(true); }}
                        disabled={deletingId === brand.id}
                        className="p-2 text-content-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition disabled:opacity-40"
                        title="Hapus brand"
                      >
                        {deletingId === brand.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {filtered.length > perPage && (
          <div className="px-5 py-3.5 border-t border-border/80 bg-surface-muted/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-semibold text-content-muted">
              Menampilkan {(page-1)*perPage+1}–{Math.min(page*perPage, filtered.length)} dari {filtered.length} brand
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(p-1,1))}
                disabled={page===1}
                className="p-1.5 rounded-xl border border-border bg-surface text-content-soft hover:bg-surface-muted transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let n = totalPages <= 5 ? i+1 : page <= 3 ? i+1 : page >= totalPages-2 ? totalPages-4+i : page-2+i;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`min-w-[32px] h-8 rounded-xl text-xs font-bold transition-all ${
                        page===n
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "text-content-soft hover:bg-surface-muted"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(p+1,totalPages))}
                disabled={page===totalPages}
                className="p-1.5 rounded-xl border border-border bg-surface text-content-soft hover:bg-surface-muted transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}