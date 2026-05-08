import { useEffect, useState, useCallback } from "react";
import {
  Plus, Search, Edit, Trash2, Tag, RefreshCw,
  ChevronLeft, ChevronRight, X, ChevronDown, Save, AlertTriangle
} from "lucide-react";
import { getTags, createTag, updateTag, deleteTag } from "../services/AdminTags";
import { useToast } from "../context/ToastContext";
import { useDebounce } from "../hooks/useDebounce";

const colorOptions = [
  { value: "blue",   bg: "bg-blue-100",   text: "text-blue-600" },
  { value: "green",  bg: "bg-green-100",  text: "text-green-600" },
  { value: "purple", bg: "bg-purple-100", text: "text-purple-600" },
  { value: "pink",   bg: "bg-pink-100",   text: "text-pink-600" },
  { value: "yellow", bg: "bg-yellow-100", text: "text-yellow-600" },
  { value: "red",    bg: "bg-red-100",    text: "text-red-600" },
  { value: "indigo", bg: "bg-indigo-100", text: "text-indigo-600" },
  { value: "teal",   bg: "bg-teal-100",   text: "text-teal-600" },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getColorStyle(color) {
  return colorOptions.find(c => c.value === color) || colorOptions[0];
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      {children}
    </div>
  );
}

// ── Tag Form Modal ──────────────────────────────────────────────────
function TagModal({ isOpen, onClose, onSubmit, title, initialData, isEditing }) {
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
    if (!form.name.trim()) return setErrors({ name: "Nama tag harus diisi" });
    onSubmit(form);
  };

  const c = getColorStyle(form.color);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 text-gray-400"><X size={15} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              Nama Tag <span className="text-red-400">*</span>
            </label>
            <input autoFocus type="text" placeholder="Best Seller" value={form.name} onChange={handleName}
              className={`w-full bg-gray-50 border rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition ${errors.name ? "border-red-300" : "border-gray-200"}`} />
            {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Slug</label>
            <div className="relative">
              <input type="text" value={form.slug}
                onChange={e => { setSlugManual(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono px-3 py-2.5 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition text-gray-500" />
              {slugManual && (
                <button type="button" onClick={() => { setSlugManual(false); setForm(f => ({ ...f, slug: slugify(f.name) })); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-blue-500 hover:text-blue-700">auto</button>
              )}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Warna</label>
            <div className="flex flex-wrap gap-1.5">
              {colorOptions.map(col => (
                <button key={col.value} type="button" onClick={() => setForm(f => ({ ...f, color: col.value }))}
                  className={`w-7 h-7 rounded-full transition-all ${col.bg}
                    ${form.color === col.value ? "ring-2 ring-offset-1 ring-blue-500 scale-110" : "hover:scale-105"}`}
                  title={col.value} />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="border border-gray-100 rounded-lg p-3 flex items-center gap-3 bg-gray-50">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${c.bg} ${c.text}`}>
              {form.name || "Nama Tag"}
            </span>
            <p className="text-[10px] text-gray-400 font-mono">{form.slug || "slug-tag"}</p>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition">Batal</button>
            <button type="submit"
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5">
              <Save size={13} /> {isEditing ? "Update" : "Simpan"}
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-red-400" />
            <h2 className="text-sm font-semibold text-gray-800">Hapus Tag</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 text-gray-400"><X size={15} /></button>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-gray-600">Hapus tag <span className="font-semibold text-red-500">"{name}"</span>? Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition">Batal</button>
          <button onClick={onConfirm} disabled={isDeleting}
            className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 disabled:opacity-50">
            {isDeleting ? <><div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Menghapus...</> : <><Trash2 size={13} /> Hapus</>}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function Tags() {
  const [tags, setTags] = useState([]);
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
    try { setTags(await getTags()); }
    catch { showToast("Gagal memuat tag", "error"); }
    finally { setLoading(false); setInitialLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let f = [...tags];
    if (debouncedSearch) f = f.filter(t => t.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || t.slug?.toLowerCase().includes(debouncedSearch.toLowerCase()));
    f.sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      return new Date(b.created_at) - new Date(a.created_at);
    });
    setFiltered(f); setPage(1);
  }, [tags, debouncedSearch, sortBy]);

  const handleCreate = async (data) => {
    try { await createTag(data); showToast("Tag ditambahkan", "success"); setCreateOpen(false); load(); }
    catch { showToast("Gagal menambahkan tag", "error"); }
  };
  const handleUpdate = async (data) => {
    try { await updateTag(selected.id, data); showToast("Tag diupdate", "success"); setEditOpen(false); setSelected(null); load(); }
    catch { showToast("Gagal mengupdate tag", "error"); }
  };
  const handleDelete = async () => {
    if (!selected) return;
    setDeletingId(selected.id);
    try { await deleteTag(selected.id); showToast("Tag dihapus", "success"); setDeleteOpen(false); setSelected(null); load(); }
    catch { showToast("Gagal menghapus tag", "error"); }
    finally { setDeletingId(null); }
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  if (initialLoading) return (
    <div className="space-y-4">
      <div className="animate-pulse space-y-1"><div className="w-12 h-5 bg-gray-200 rounded" /><div className="w-32 h-3 bg-gray-200 rounded" /></div>
      <div className="grid grid-cols-3 gap-3">{[1,2,3].map(i => <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 animate-pulse"><div className="w-12 h-3 bg-gray-200 rounded mb-2"/><div className="w-8 h-6 bg-gray-200 rounded"/></div>)}</div>
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden animate-pulse">
        {[1,2,3,4,5].map(i => <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50"><div className="w-8 h-8 bg-gray-200 rounded-lg"/><div className="flex-1"><div className="w-24 h-3 bg-gray-200 rounded mb-1.5"/><div className="w-16 h-2.5 bg-gray-200 rounded"/></div></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <TagModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} title="Tambah Tag" isEditing={false} />
      <TagModal isOpen={editOpen} onClose={() => { setEditOpen(false); setSelected(null); }} onSubmit={handleUpdate} title="Edit Tag" initialData={selected} isEditing={true} />
      <DeleteModal isOpen={deleteOpen} onClose={() => { setDeleteOpen(false); setSelected(null); }} onConfirm={handleDelete} name={selected?.name} isDeleting={deletingId === selected?.id} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Tags</h1>
          <p className="text-xs text-gray-400 mt-0.5">{tags.length} total tag</p>
        </div>
        <button onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition">
          <Plus size={14} /> Tambah Tag
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: tags.length, color: "text-blue-600" },
          { label: "Ditampilkan", value: paginated.length, color: "text-gray-600" },
          { label: "Filter", value: search ? 1 : 0, color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-lg px-3 py-2.5 shadow-sm">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
            <p className={`text-lg font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-3 flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Cari tag..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm pl-8 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={13} /></button>}
        </div>
        <div className="flex gap-2">
          {[
            { val: sortBy, set: setSortBy, opts: [["newest","Terbaru"],["oldest","Terlama"],["name_asc","A-Z"],["name_desc","Z-A"]] },
            { val: perPage, set: v => { setPerPage(Number(v)); setPage(1); }, opts: [[10,"10/hal"],[25,"25/hal"],[50,"50/hal"]] },
          ].map((s, i) => (
            <div key={i} className="relative">
              <select value={s.val} onChange={e => s.set(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg text-xs pl-2.5 pr-6 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer text-gray-600">
                {s.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          ))}
          {(search || sortBy !== "newest") && (
            <button onClick={() => { setSearch(""); setSortBy("newest"); setPage(1); }}
              className="px-2.5 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition flex items-center gap-1">
              <RefreshCw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
          <p className="text-xs font-medium text-gray-600">Daftar Tag</p>
          <p className="text-[11px] text-gray-400">{filtered.length} ditemukan</p>
        </div>

        {loading ? (
          <div>{[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              <div className="flex-1"><div className="w-28 h-3 bg-gray-200 rounded mb-1.5"/><div className="w-20 h-2.5 bg-gray-200 rounded"/></div>
            </div>
          ))}</div>
        ) : paginated.length === 0 ? (
          <div className="py-14 text-center">
            <Tag size={28} className="mx-auto text-gray-200 mb-2" />
            <p className="text-xs text-gray-400">{search ? "Tidak ditemukan" : "Belum ada tag"}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {paginated.map(tag => {
              const c = getColorStyle(tag.color);
              return (
                <div key={tag.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                    <Tag size={13} className={c.text} />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${c.bg} ${c.text}`}>{tag.name}</span>
                    <p className="text-[10px] text-gray-400 font-mono truncate">{tag.slug}</p>
                  </div>
                  {tag.created_at && (
                    <p className="text-[10px] text-gray-300 hidden sm:block flex-shrink-0">
                      {new Date(tag.created_at).toLocaleDateString("id-ID")}
                    </p>
                  )}
                  <div className="flex gap-0.5 flex-shrink-0">
                    <button onClick={() => { setSelected(tag); setEditOpen(true); }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"><Edit size={13} /></button>
                    <button onClick={() => { setSelected(tag); setDeleteOpen(true); }} disabled={deletingId === tag.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition disabled:opacity-40">
                      {deletingId === tag.id
                        ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                        : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > perPage && (
          <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-[11px] text-gray-400">{(page-1)*perPage+1}–{Math.min(page*perPage, filtered.length)} dari {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(p-1,1))} disabled={page===1}
                className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let n = totalPages <= 5 ? i+1 : page <= 3 ? i+1 : page >= totalPages-2 ? totalPages-4+i : page-2+i;
                return (
                  <button key={n} onClick={() => setPage(n)}
                    className={`min-w-[28px] h-7 rounded-md text-xs font-medium transition ${page===n ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                    {n}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(p+1,totalPages))} disabled={page===totalPages}
                className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}