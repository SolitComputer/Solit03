import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Search, Edit, Trash2, Laptop, RefreshCw,
  ChevronLeft, ChevronRight, Package, X, ChevronDown, Filter,
  TrendingUp, TrendingDown, AlertCircle, CheckCircle,
  Eye, Copy, Printer, Download, Grid3X3, List,
  Star, Sparkles, Clock, Award, Zap
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
  const [viewMode, setViewMode] = useState("table");

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
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?\nTindakan ini tidak dapat dibatalkan!")) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      showToast("Produk berhasil dihapus", "success");
      if (products.length === 1 && currentPage > 1) setCurrentPage(p => p - 1);
      else loadProducts();
    } catch {
      showToast("Gagal menghapus produk", "error");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleBulkDelete() {
    if (!selectedProducts.length || !confirm(`Hapus ${selectedProducts.length} produk yang dipilih?`)) return;
    try {
      for (const id of selectedProducts) await deleteProduct(id);
      showToast(`${selectedProducts.length} produk berhasil dihapus`, "success");
      setSelectedProducts([]);
      loadProducts();
    } catch {
      showToast("Gagal menghapus produk", "error");
    }
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const hasFilters = filterBrand !== "all" || filterStock !== "all" || searchTerm;

  const resetFilters = () => {
    setSearchTerm(""); setFilterBrand("all"); setFilterStock("all");
    setSortBy("newest"); setCurrentPage(1);
    showToast("Filter berhasil direset", "info");
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return { label: "Habis", color: "red", icon: AlertCircle };
    if (stock < 5) return { label: "Menipis", color: "yellow", icon: AlertCircle };
    if (stock < 10) return { label: "Tersedia", color: "green", icon: CheckCircle };
    return { label: "Melimpah", color: "emerald", icon: CheckCircle };
  };

  const stockColorMap = {
    red: "bg-red-50 text-red-600 border-red-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    green: "bg-green-50 text-green-600 border-green-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-400">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Animated CSS */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
        }
        .table-row-hover {
          transition: all 0.2s ease;
        }
        .table-row-hover:hover {
          background: linear-gradient(90deg, rgba(59,130,246,0.02) 0%, rgba(59,130,246,0.05) 100%);
        }
      `}</style>

      {/* Header dengan gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package size="20" className="text-blue-200" />
              <h1 className="text-2xl font-bold">Manajemen Produk</h1>
            </div>
            <p className="text-blue-100 text-sm mt-1">
              Kelola semua koleksi laptop dengan mudah dan cepat
            </p>
          </div>
          <Link
            to="/admin/products/create"
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 text-sm font-semibold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Plus size="16" /> Tambah Produk Baru
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {[
          { label: "Total Produk", value: totalCount, icon: Package, color: "blue", trend: "+12%", up: true },
          { label: "Halaman Saat Ini", value: `${currentPage}/${totalPages}`, icon: Grid3X3, color: "purple", trend: `${products.length} item`, up: true },
          { label: "Stok Menipis", value: products.filter(p => p.stock > 0 && p.stock < 5).length, icon: AlertCircle, color: "yellow", trend: "Perlu restock", up: false },
          { label: "Filter Aktif", value: [filterBrand !== "all", filterStock !== "all", !!searchTerm].filter(Boolean).length, icon: Filter, color: "indigo", trend: hasFilters ? "Filter aktif" : "Tidak ada", up: true },
        ].map(({ label, value, icon: Icon, color, trend, up }, idx) => {
          const colorClasses = {
            blue: "bg-blue-50 text-blue-600",
            purple: "bg-purple-50 text-purple-600",
            yellow: "bg-yellow-50 text-yellow-600",
            indigo: "bg-indigo-50 text-indigo-600"
          };
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm card-hover">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
                  <Icon size="18" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                  {up ? <TrendingUp size="10" /> : <TrendingDown size="10" />}
                  {trend}
                </div>
              </div>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar Premium */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search size="14" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk berdasarkan nama, brand, atau kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size="14" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg text-sm pl-3 pr-7 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-600"
                >
                  <option value="all">Semua Brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <ChevronDown size="12" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg text-sm pl-3 pr-7 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-600"
                >
                  <option value="all">Semua Stok</option>
                  <option value="available">Tersedia</option>
                  <option value="outofstock">Habis</option>
                </select>
                <ChevronDown size="12" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg text-sm pl-3 pr-7 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-600"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="price_high">Harga Tertinggi</option>
                  <option value="price_low">Harga Terendah</option>
                  <option value="name_asc">A-Z</option>
                </select>
                <ChevronDown size="12" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-gray-50 border border-gray-200 rounded-lg text-sm pl-3 pr-7 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-600"
                >
                  <option value={10}>10 per halaman</option>
                  <option value={25}>25 per halaman</option>
                  <option value={50}>50 per halaman</option>
                  <option value={100}>100 per halaman</option>
                </select>
                <ChevronDown size="12" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition flex items-center gap-1.5"
                >
                  <RefreshCw size="14" /> Reset Filter
                </button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition ${viewMode === "table" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
              >
                <List size="16" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
              >
                <Grid3X3 size="16" />
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between animate-slide-in">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <CheckCircle size="14" />
                </div>
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">{selectedProducts.length}</span> produk dipilih
                </span>
              </div>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition shadow-sm"
              >
                <Trash2 size="14" /> Hapus Terpilih
              </button>
            </div>
          )}
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onChange={() => setSelectedProducts(selectedProducts.length === products.length ? [] : products.map(p => p.id))}
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Stok</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-3 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                        <p className="text-sm text-gray-400">Memuat produk...</p>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <Package size="48" className="mx-auto mb-3 text-gray-200" />
                      <p className="text-sm text-gray-400">Tidak ada produk ditemukan</p>
                      {hasFilters && (
                        <button onClick={resetFilters} className="mt-3 text-blue-600 text-sm hover:underline">
                          Reset filter
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  products.map((p, idx) => {
                    const stockBadge = getStockBadge(p.stock);
                    const StockIcon = stockBadge.icon;
                    return (
                      <tr key={p.id} className="table-row-hover group">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedProducts.includes(p.id)}
                            onChange={() => setSelectedProducts(prev =>
                              prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                            )}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.thumbnail ? (
                              <img src={p.thumbnail} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100 shadow-sm" />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                <Laptop size="16" className="text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-gray-400 font-mono">{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {p.normal_price && p.price < p.normal_price ? (
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-red-600">
                                  Rp {p.price?.toLocaleString("id-ID")}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full font-semibold">
                                  -{p.discount_percent}%
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400 line-through mt-0.5">
                                Rp {p.normal_price?.toLocaleString("id-ID")}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm font-semibold text-gray-800">
                              Rp {p.price?.toLocaleString("id-ID")}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold ${stockColorMap[stockBadge.color]}`}>
                            <StockIcon size="10" />
                            {p.stock > 0 ? `${p.stock} unit` : stockBadge.label}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {p.brands?.name || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            {p.categories?.name || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              to={`/admin/products/edit/${p.id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit produk"
                            >
                              <Edit size="14" />
                            </Link>
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={deletingId === p.id}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
                              title="Hapus produk"
                            >
                              {deletingId === p.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 size="14" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && !loading && (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => {
                const stockBadge = getStockBadge(p.stock);
                const StockIcon = stockBadge.icon;
                return (
                  <div key={p.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden card-hover">
                    <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100">
                      {p.thumbnail ? (
                        <img src={p.thumbnail} alt={p.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Laptop size="40" className="text-gray-300" />
                        </div>
                      )}
                      {p.discount_percent > 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                          -{p.discount_percent}%
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] text-gray-500 font-medium">{p.brands?.name || "Umum"}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5 line-clamp-2">{p.name}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          {p.normal_price && p.price < p.normal_price ? (
                            <>
                              <p className="text-sm font-bold text-red-600">Rp {p.price?.toLocaleString()}</p>
                              <p className="text-[9px] text-gray-400 line-through">Rp {p.normal_price?.toLocaleString()}</p>
                            </>
                          ) : (
                            <p className="text-sm font-bold text-gray-800">Rp {p.price?.toLocaleString()}</p>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold ${stockColorMap[stockBadge.color]}`}>
                          <StockIcon size="10" />
                          {p.stock > 0 ? p.stock : "Habis"}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link
                          to={`/admin/products/edit/${p.id}`}
                          className="flex-1 px-2 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition text-center"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="px-2 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition disabled:opacity-40"
                        >
                          {deletingId === p.id ? "..." : "Hapus"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination Premium */}
        {totalCount > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Menampilkan <span className="font-semibold text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</span> -{' '}
              <span className="font-semibold text-gray-700">{Math.min(currentPage * itemsPerPage, totalCount)}</span> dari{' '}
              <span className="font-semibold text-gray-700">{totalCount.toLocaleString()}</span> produk
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size="14" />
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
                    className={`min-w-[34px] h-8 rounded-lg text-sm font-medium transition-all ${
                      currentPage === n
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size="14" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}