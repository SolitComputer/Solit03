import { useEffect, useState, useCallback } from "react";
import {
  Plus, Search, Edit, Trash2, Tags, RefreshCw,
  ChevronLeft, ChevronRight, X, ChevronDown, Save, AlertTriangle,
  Tag, Eye, CalendarDays
} from "lucide-react";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../services/AdminBrands";
import { useToast } from "../context/ToastContext";
import { useDebounce } from "../hooks/useDebounce";

const brandColors = [
  { value: "blue",   bg: "bg-gradient-to-br from-blue-400 to-blue-500", text: "text-blue-600", lightBg: "bg-blue-50", border: "border-blue-200" },
  { value: "purple", bg: "bg-gradient-to-br from-purple-400 to-purple-500", text: "text-purple-600", lightBg: "bg-purple-50", border: "border-purple-200" },
  { value: "green",  bg: "bg-gradient-to-br from-green-400 to-green-500", text: "text-green-600", lightBg: "bg-green-50", border: "border-green-200" },
  { value: "orange", bg: "bg-gradient-to-br from-orange-400 to-orange-500", text: "text-orange-600", lightBg: "bg-orange-50", border: "border-orange-200" },
  { value: "red",    bg: "bg-gradient-to-br from-red-400 to-red-500", text: "text-red-600", lightBg: "bg-red-50", border: "border-red-200" },
  { value: "teal",   bg: "bg-gradient-to-br from-teal-400 to-teal-500", text: "text-teal-600", lightBg: "bg-teal-50", border: "border-teal-200" },
];

const COLOR_DOT = {
  blue: "bg-blue-400", purple: "bg-purple-400", green: "bg-green-400",
  orange: "bg-orange-400", red: "bg-red-400", teal: "bg-teal-400",
};

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
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
    onSubmit(form);
  };

  const c = getColorStyle(form.color);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header with gradient accent */}
        <div className="relative overflow-hidden">
          <div className={`absolute top-0 left-0 right-0 h-1 ${c.bg}`} />
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-base font-bold text-gray-800">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">
              Nama Brand <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              placeholder="Contoh: ASUS, Samsung, Nike"
              value={form.name}
              onChange={handleName}
              className={`w-full bg-gray-50 border-2 rounded-xl text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200
                ${errors.name ? "border-red-400 focus:ring-red-500" : "border-gray-200 hover:border-gray-300"}`}
            />
            {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> {errors.name}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">Slug (URL)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="slug-brand-otomatis"
                value={form.slug}
                onChange={e => { setSlugManual(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-mono px-4 py-2.5 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-600"
              />
              {slugManual && (
                <button type="button" onClick={() => { setSlugManual(false); setForm(f => ({ ...f, slug: slugify(f.name) })); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-600 hover:text-blue-700 bg-white px-2 py-1 rounded-lg shadow-sm">
                  Auto
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400">Digunakan untuk URL brand</p>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">Warna Brand</label>
            <div className="flex gap-3 flex-wrap">
              {brandColors.map(col => (
                <button key={col.value} type="button" onClick={() => setForm(f => ({ ...f, color: col.value }))}
                  className={`relative w-10 h-10 rounded-full transition-all duration-200 shadow-md ${col.bg}
                    ${form.color === col.value ? "ring-4 ring-offset-2 ring-blue-500 scale-110" : "hover:scale-105 hover:shadow-lg"}`}
                  title={col.value}
                />
              ))}
            </div>
          </div>

          {/* Preview Card */}
          <div className={`border-2 rounded-xl p-4 ${c.lightBg} ${c.border}`}>
            <p className="text-xs font-semibold text-gray-500 mb-2">Preview</p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${c.bg}`}>
                <Tags size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{form.name || "Nama Brand"}</p>
                <p className="text-xs text-gray-500 font-mono truncate">{form.slug || "slug-brand"}</p>
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${c.lightBg} ${c.text}`}>
                {form.color}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
              Batal
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
              <Save size={16} /> {isEditing ? "Update Brand" : "Simpan Brand"}
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600" />
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-100 rounded-full">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <h2 className="text-base font-bold text-gray-800">Hapus Brand</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 text-gray-400">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus brand <span className="font-bold text-red-600">“{name}”</span>?
          </p>
          <p className="text-xs text-gray-400 mt-2">Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.</p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-200">
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
    } catch { showToast("Gagal memuat brand", "error"); }
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
    <div className="space-y-5">
      <div className="animate-pulse space-y-2">
        <div className="w-32 h-6 bg-gray-200 rounded-lg" />
        <div className="w-48 h-4 bg-gray-200 rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse"><div className="w-16 h-3 bg-gray-200 rounded mb-2"/><div className="w-12 h-7 bg-gray-200 rounded"/></div>)}
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
        {[1,2,3,4,5].map(i => <div key={i} className="flex items-center gap-4 px-5 py-3"><div className="w-10 h-10 bg-gray-200 rounded-xl"/><div className="flex-1"><div className="w-28 h-3 bg-gray-200 rounded mb-1.5"/><div className="w-20 h-2 bg-gray-200 rounded"/></div></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <BrandModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} title="Tambah Brand Baru" isEditing={false} />
      <BrandModal isOpen={editOpen} onClose={() => { setEditOpen(false); setSelected(null); }} onSubmit={handleUpdate} title="Edit Brand" initialData={selected} isEditing={true} />
      <DeleteModal isOpen={deleteOpen} onClose={() => { setDeleteOpen(false); setSelected(null); }} onConfirm={handleDelete} name={selected?.name} isDeleting={deletingId === selected?.id} />

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Manajemen Brand
          </h1>
          <p className="text-sm text-gray-500 mt-1">Kelola semua brand produk Anda</p>
        </div>
        <button onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
          <Plus size={18} /> Tambah Brand
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Brand", value: brands.length, icon: Tag, gradient: "from-blue-500 to-blue-600" },
          { label: "Ditampilkan", value: paginated.length, icon: Eye, gradient: "from-gray-500 to-gray-600" },
          { label: "Filter Aktif", value: search ? "Ya" : "Tidak", icon: Search, gradient: "from-purple-500 to-purple-600" },
        ].map(({ label, value, icon: Icon, gradient }) => (
          <div key={label} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-200 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-6 h-6 text-gray-600" aria-hidden="true" />
              <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${gradient} text-white`}>
                {typeof value === 'number' ? `${value} item` : value}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-700">{label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari brand berdasarkan nama atau slug..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl text-sm pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200" 
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"><X size={14} /></button>}
          </div>
          <div className="flex gap-2">
            {[
              { val: sortBy, set: setSortBy, opts: [["newest","Terbaru"],["oldest","Terlama"],["name_asc","A-Z"],["name_desc","Z-A"]] },
              { val: perPage, set: v => { setPerPage(Number(v)); setPage(1); }, opts: [[10,"10 per halaman"],[25,"25 per halaman"],[50,"50 per halaman"]] },
            ].map((s, i) => (
              <div key={i} className="relative">
                <select value={s.val} onChange={e => s.set(e.target.value)}
                  className="bg-gray-50 border-2 border-gray-200 rounded-xl text-sm pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-700 font-medium hover:border-gray-300 transition-all duration-200">
                  {s.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            ))}
            {(search || sortBy !== "newest") && (
              <button onClick={() => { setSearch(""); setSortBy("newest"); setPage(1); }}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center gap-2">
                <RefreshCw size={14} /> Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b-2 border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <p className="text-sm font-bold text-gray-700">Daftar Brand</p>
          <p className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{filtered.length} ditemukan</p>
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
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Tags size={32} className="text-gray-300" />
            </div>
            <p className="text-base font-semibold text-gray-500">{search ? "Brand tidak ditemukan" : "Belum ada brand"}</p>
            <p className="text-sm text-gray-400 mt-1">{search ? "Coba dengan kata kunci lain" : "Klik tombol Tambah Brand untuk memulai"}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginated.map(brand => {
              const c = getColorStyle(brand.color);
              return (
                <div key={brand.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${c.bg}`}>
                    <Tags size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-gray-800">{brand.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.lightBg} ${c.text}`}>{brand.color}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">/{brand.slug}</p>
                  </div>
                  {brand.created_at && (
                    <p className="text-xs text-gray-400 hidden md:block flex-shrink-0">
                      <CalendarDays className="w-3.5 h-3.5 inline" aria-hidden="true" /> {new Date(brand.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => { setSelected(brand); setEditOpen(true); }}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => { setSelected(brand); setDeleteOpen(true); }} disabled={deletingId === brand.id}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-40">
                      {deletingId === brand.id
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
          <div className="px-5 py-4 border-t-2 border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-xs font-medium text-gray-600">
              Menampilkan {(page-1)*perPage+1}–{Math.min(page*perPage, filtered.length)} dari {filtered.length} brand
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(p-1,1))} disabled={page===1}
                className="p-2 rounded-lg border-2 border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-300">
                <ChevronLeft size={14} />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let n = totalPages <= 5 ? i+1 : page <= 3 ? i+1 : page >= totalPages-2 ? totalPages-4+i : page-2+i;
                  return (
                    <button key={n} onClick={() => setPage(n)}
                      className={`min-w-[32px] h-8 rounded-lg text-sm font-semibold transition-all duration-200 
                        ${page===n 
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md" 
                          : "text-gray-600 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200"}`}>
                      {n}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setPage(p => Math.min(p+1,totalPages))} disabled={page===totalPages}
                className="p-2 rounded-lg border-2 border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-300">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}