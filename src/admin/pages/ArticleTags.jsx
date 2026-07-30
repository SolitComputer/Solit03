import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, Loader2, Tag as TagIcon, Search, X } from "lucide-react";
import {
  getArticleTags, createArticleTag, updateArticleTag, deleteArticleTag,
} from "../services/AdminArticleTags";
import { useToast } from "../context/ToastContext";

const inputCls = "bg-surface-muted border-2 border-border rounded-xl text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-surface transition-all";

export default function ArticleTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try { setTags(await getArticleTags()); }
    catch { showToast("Gagal memuat tag", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await createArticleTag(newName);
      setNewName("");
      showToast("Tag ditambahkan", "success");
      load();
    } catch (error) {
      showToast(error.message?.includes("duplicate") ? "Tag ini sudah ada" : (error.message || "Gagal menambahkan tag"), "error");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(tag) {
    setEditingId(tag.id);
    setEditingName(tag.name);
  }

  async function saveEdit(id) {
    if (!editingName.trim()) return;
    setSavingId(id);
    try {
      await updateArticleTag(id, editingName);
      setEditingId(null);
      showToast("Tag diperbarui", "success");
      load();
    } catch (error) {
      showToast(error.message || "Gagal menyimpan tag", "error");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Hapus tag "${name}"? Artikel yang memakai tag ini tidak akan terhapus.`)) return;
    try { await deleteArticleTag(id); showToast("Tag dihapus", "success"); load(); }
    catch (error) { showToast(error.message || "Gagal menghapus tag", "error"); }
  }

  const filtered = tags.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Tag Artikel
        </h1>
        <p className="text-sm text-content-muted mt-1">Kelola tag supaya bisa dipilih langsung saat menulis artikel, tanpa ketik ulang</p>
      </div>

      {/* Add new */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm p-5">
        <p className="text-xs font-semibold text-content-soft mb-3">Tambah Tag Baru</p>
        <div className="flex items-center gap-2">
          <input
            placeholder="Nama tag, mis. Promo, Tips, Gaming"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCreate(); } }}
            className={`${inputCls} flex-1`}
          />
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-60"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Tambah
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            placeholder="Cari tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputCls} w-full pl-10 pr-9`}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-soft">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b-2 border-border flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <p className="text-sm font-bold text-content-soft">Daftar Tag</p>
          <p className="text-xs font-semibold text-content-muted bg-gray-100 px-2 py-1 rounded-lg">{filtered.length} tag</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-blue-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <TagIcon size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-content-muted">{search ? "Tag tidak ditemukan" : "Belum ada tag"}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((tag) => (
              <div key={tag.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <TagIcon size={14} className="text-blue-600" />
                </div>

                {editingId === tag.id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(tag.id); if (e.key === "Escape") setEditingId(null); }}
                    className={`${inputCls} flex-1`}
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-content truncate">{tag.name}</p>
                    <p className="text-[11px] text-content-muted font-mono">/{tag.slug}</p>
                  </div>
                )}

                <div className="flex items-center gap-1 flex-shrink-0">
                  {editingId === tag.id ? (
                    <button onClick={() => saveEdit(tag.id)} disabled={savingId === tag.id} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50">
                      {savingId === tag.id ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    </button>
                  ) : (
                    <button onClick={() => startEdit(tag)} className="px-2.5 py-1.5 text-xs font-semibold text-content-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      Edit
                    </button>
                  )}
                  <button onClick={() => handleDelete(tag.id, tag.name)} className="p-2 text-content-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
