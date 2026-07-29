import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Search, Edit, Trash2, Newspaper, RefreshCw,
  ChevronLeft, ChevronRight, X, ChevronDown, Star, Eye,
} from "lucide-react";
import { getArticlesPaginated, deleteArticle } from "../services/AdminArticles";
import { getArticleCategories } from "../services/AdminArticleCategories";
import { useDebounce } from "../hooks/useDebounce";
import { useToast } from "../context/ToastContext";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const { showToast } = useToast();
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    getArticleCategories().then(setCategories).catch(() => {});
  }, []);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getArticlesPaginated({
        page: currentPage, limit: itemsPerPage,
        search: debouncedSearch, sortBy, filterStatus, filterCategory,
      });
      setArticles(result.data);
      setTotalCount(result.total);
    } catch {
      showToast("Gagal memuat artikel", "error");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, sortBy, filterStatus, filterCategory, showToast]);

  useEffect(() => { loadArticles(); }, [loadArticles]);
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, filterStatus, filterCategory, sortBy]);

  async function handleDelete(id) {
    if (!confirm("Hapus artikel ini? Tindakan ini tidak dapat dibatalkan.")) return;
    setDeletingId(id);
    try {
      await deleteArticle(id);
      showToast("Artikel berhasil dihapus", "success");
      if (articles.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
      else loadArticles();
    } catch (err) {
      console.error("Gagal menghapus artikel:", err);
      showToast(err?.message || "Gagal menghapus artikel", "error");
    } finally {
      setDeletingId(null);
    }
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const hasFilters = filterCategory !== "all" || filterStatus !== "all" || searchTerm;

  const resetFilters = () => {
    setSearchTerm(""); setFilterCategory("all"); setFilterStatus("all"); setSortBy("newest");
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Newspaper size={20} className="text-blue-200" />
              <h1 className="text-2xl font-bold">Manajemen Artikel</h1>
            </div>
            <p className="text-blue-100 text-sm mt-1">Kelola artikel berita, tips, dan promo</p>
          </div>
          <Link
            to="/admin/articles/create"
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 text-sm font-semibold rounded-xl shadow-lg transition hover:scale-105 active:scale-95"
          >
            <Plus size={16} /> Tulis Artikel
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul artikel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg text-sm pl-3 pr-7 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-600">
                <option value="all">Semua Kategori</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg text-sm pl-3 pr-7 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-600">
                <option value="all">Semua Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg text-sm pl-3 pr-7 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-600">
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="title_asc">A-Z</option>
                <option value="most_viewed">Terpopuler</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {hasFilters && (
              <button onClick={resetFilters} className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition flex items-center gap-1.5">
                <RefreshCw size={14} /> Reset
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Artikel</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Views</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="py-20 text-center">
                  <div className="w-10 h-10 mx-auto border-3 border-blue-200 rounded-full animate-spin border-t-blue-600" />
                </td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center">
                  <Newspaper size={48} className="mx-auto mb-3 text-gray-200" />
                  <p className="text-sm text-gray-400">Belum ada artikel</p>
                </td></tr>
              ) : (
                articles.map((a) => (
                  <tr key={a.id} className="hover:bg-blue-50/30 transition group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {a.cover_image ? (
                          <img src={a.cover_image} alt={a.title} className="w-12 h-9 rounded-lg object-cover border border-gray-100" />
                        ) : (
                          <div className="w-12 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Newspaper size={14} className="text-gray-300" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition line-clamp-1 flex items-center gap-1.5">
                            {a.is_featured && <Star size={12} className="text-amber-500 flex-shrink-0" fill="currentColor" />}
                            {a.title}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">{a.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        {a.article_categories?.name || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-semibold ${
                        a.status === "published" ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}>
                        {a.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                        <Eye size={12} /> {(a.views || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link to={`/admin/articles/edit/${a.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(a.id)}
                          disabled={deletingId === a.id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
                        >
                          {deletingId === a.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalCount > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Menampilkan <span className="font-semibold text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</span>–
              <span className="font-semibold text-gray-700">{Math.min(currentPage * itemsPerPage, totalCount)}</span> dari{" "}
              <span className="font-semibold text-gray-700">{totalCount}</span> artikel
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-white transition disabled:opacity-30">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let n;
                if (totalPages <= 5) n = i + 1;
                else if (currentPage <= 3) n = i + 1;
                else if (currentPage >= totalPages - 2) n = totalPages - 4 + i;
                else n = currentPage - 2 + i;
                return (
                  <button key={n} onClick={() => setCurrentPage(n)}
                    className={`min-w-[34px] h-8 rounded-lg text-sm font-medium transition-all ${
                      currentPage === n ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
                    }`}>
                    {n}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-white transition disabled:opacity-30">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
