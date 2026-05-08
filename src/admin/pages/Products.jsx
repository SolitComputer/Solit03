import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Search, Edit, Trash2, Laptop, RefreshCw,
  ChevronLeft, ChevronRight, Package, X, ChevronDown, Filter
} from "lucide-react";
import { getProductsPaginated, deleteProduct } from "../services/AdminProducts";
import { supabase } from "../../services/supabase";
import { useDebounce } from "../hooks/useDebounce";
import { useToast } from "../context/ToastContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("newest");
  const [filterStock, setFilterStock] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [brands, setBrands] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const { showToast } = useToast();
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    supabase.from("brands").select("id,name").order("name").then(({ data }) => setBrands(data || []));
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getProductsPaginated({
        page: currentPage, limit: itemsPerPage,
        search: debouncedSearch, sortBy, filterStock,
        filterBrand: filterBrand !== "all" ? filterBrand : null,
      });
      setProducts(result.data);
      setTotalCount(result.total);
    } catch {
      showToast("Gagal memuat produk", "error");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, sortBy, filterStock, filterBrand, showToast]);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, filterStock, filterBrand, sortBy]);

  async function handleDelete(id) {
    if (!confirm("Hapus produk ini?")) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      showToast("Produk dihapus", "success");
      if (products.length === 1 && currentPage > 1) setCurrentPage(p => p - 1);
      else loadProducts();
    } catch {
      showToast("Gagal menghapus produk", "error");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleBulkDelete() {
    if (!selectedProducts.length || !confirm(`Hapus ${selectedProducts.length} produk?`)) return;
    try {
      for (const id of selectedProducts) await deleteProduct(id);
      showToast(`${selectedProducts.length} produk dihapus`, "success");
      setSelectedProducts([]);
      loadProducts();
    } catch {
      showToast("Gagal menghapus", "error");
    }
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const hasFilters = filterBrand !== "all" || filterStock !== "all" || searchTerm;

  const resetFilters = () => {
    setSearchTerm(""); setFilterBrand("all"); setFilterStock("all");
    setSortBy("newest"); setCurrentPage(1);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Products</h1>
          <p className="text-xs text-gray-400 mt-0.5">{totalCount.toLocaleString()} total produk</p>
        </div>
        <Link
          to="/admin/products/create"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition"
        >
          <Plus size={14} /> Tambah Produk
        </Link>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: totalCount, color: "text-blue-600" },
          { label: "Halaman", value: `${currentPage}/${totalPages}`, color: "text-gray-600" },
          { label: "Ditampilkan", value: products.length, color: "text-gray-600" },
          { label: "Filter", value: [filterBrand !== "all", filterStock !== "all", !!searchTerm].filter(Boolean).length, color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-lg px-3 py-2.5 shadow-sm">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
            <p className={`text-lg font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm pl-8 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: filterBrand, onChange: setFilterBrand, options: [{ value: "all", label: "Semua Brand" }, ...brands.map(b => ({ value: b.id, label: b.name }))] },
              { value: filterStock, onChange: setFilterStock, options: [{ value: "all", label: "Semua Stok" }, { value: "available", label: "Tersedia" }, { value: "outofstock", label: "Habis" }] },
              { value: sortBy, onChange: setSortBy, options: [{ value: "newest", label: "Terbaru" }, { value: "oldest", label: "Terlama" }, { value: "price_high", label: "Harga ↓" }, { value: "price_low", label: "Harga ↑" }, { value: "name_asc", label: "A-Z" }] },
              { value: itemsPerPage, onChange: (v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }, options: [10, 25, 50, 100].map(n => ({ value: n, label: `${n}/hal` })) },
            ].map((s, i) => (
              <div key={i} className="relative">
                <select
                  value={s.value}
                  onChange={(e) => s.onChange(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg text-xs pl-2.5 pr-6 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer text-gray-600"
                >
                  {s.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            ))}

            {hasFilters && (
              <button onClick={resetFilters} className="px-2.5 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition flex items-center gap-1">
                <RefreshCw size={12} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Bulk actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500"><span className="font-medium text-gray-700">{selectedProducts.length}</span> dipilih</span>
            <button onClick={handleBulkDelete} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition">
              <Trash2 size={12} /> Hapus Terpilih
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="w-9 px-3 py-3">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={() => setSelectedProducts(selectedProducts.length === products.length ? [] : products.map(p => p.id))}
                  />
                </th>
                {["Produk", "Harga", "Stok", "Brand", "Kategori", ""].map((h) => (
                  <th key={h} className={`px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider ${h === "" ? "text-center" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Memuat...
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Package size={32} className="mx-auto mb-2 text-gray-200" />
                    <p className="text-xs text-gray-400">Tidak ada produk ditemukan</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition group">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
                        checked={selectedProducts.includes(p.id)}
                        onChange={() => setSelectedProducts(prev =>
                          prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                        )}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {p.thumbnail ? (
                          <img src={p.thumbnail} alt={p.name} className="w-8 h-8 rounded-md object-cover border border-gray-100 flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                            <Laptop size={14} className="text-gray-300" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate max-w-[160px]">{p.name}</p>
                          <p className="text-[10px] text-gray-400 truncate max-w-[160px] font-mono">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.normal_price && p.price < p.normal_price ? (
                        <div>
                          <span className="text-xs font-semibold text-red-600">Rp {p.price?.toLocaleString("id-ID")}</span>
                          <p className="text-[10px] text-gray-400 line-through">Rp {p.normal_price?.toLocaleString("id-ID")}</p>
                          <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-bold">-{p.discount_percent}%</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-gray-700">Rp {p.price?.toLocaleString("id-ID")}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full
                        ${p.stock > 10 ? "bg-green-50 text-green-600" : p.stock > 0 ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"}`}>
                        <span className={`w-1 h-1 rounded-full ${p.stock > 10 ? "bg-green-500" : p.stock > 0 ? "bg-yellow-500" : "bg-red-500"}`} />
                        {p.stock > 0 ? `${p.stock} unit` : "Habis"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{p.brands?.name || "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{p.categories?.name || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-0.5">
                        <Link to={`/admin/products/edit/${p.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition">
                          <Edit size={13} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-40"
                        >
                          {deletingId === p.id
                            ? <div className="w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin" />
                            : <Trash2 size={13} />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-[11px] text-gray-400">
              {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalCount)} dari {totalCount.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={13} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let n;
                if (totalPages <= 5) n = i + 1;
                else if (currentPage <= 3) n = i + 1;
                else if (currentPage >= totalPages - 2) n = totalPages - 4 + i;
                else n = currentPage - 2 + i;
                return (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`min-w-[28px] h-7 rounded-md text-xs font-medium transition
                      ${currentPage === n ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    {n}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}