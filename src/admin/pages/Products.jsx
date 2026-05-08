import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Laptop,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Package,
  TrendingUp,
  AlertTriangle,
  X,
  ChevronDown,
  Eye,
  Filter
} from "lucide-react";
import {
  getProducts,
  deleteProduct,
  getProductsPaginated
} from "../services/AdminProducts";
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { showToast } = useToast();
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Load brands untuk filter
  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    const { data } = await supabase
      .from("brands")
      .select("id, name")
      .order("name");
    setBrands(data || []);
  }

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getProductsPaginated({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        sortBy,
        filterStock,
        filterBrand: filterBrand !== "all" ? filterBrand : null
      });

      setProducts(result.data);
      setTotalCount(result.total);
    } catch (error) {
      console.error(error);
      showToast("Gagal memuat data produk", "error");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, sortBy, filterStock, filterBrand, showToast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function handleDelete(id) {
    const confirmDelete = confirm("Yakin ingin hapus produk?");
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await deleteProduct(id);
      showToast("Produk berhasil dihapus", "success");

      // Reload current page
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        loadProducts();
      }
    } catch (error) {
      console.error(error);
      showToast("Gagal menghapus produk", "error");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleBulkDelete() {
    if (selectedProducts.length === 0) return;

    const confirmDelete = confirm(`Hapus ${selectedProducts.length} produk?`);
    if (!confirmDelete) return;

    try {
      for (const id of selectedProducts) {
        await deleteProduct(id);
      }
      showToast(`${selectedProducts.length} produk berhasil dihapus`, "success");
      setSelectedProducts([]);
      loadProducts();
    } catch (error) {
      console.error(error);
      showToast("Gagal menghapus produk", "error");
    }
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pid => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStock, filterBrand, sortBy]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const totalProducts = totalCount;
  const availableProducts = 0;
  const lowStockProducts = 0;
  const outOfStockProducts = 0;

  // Items per page options
  const itemsPerPageOptions = [10, 25, 50, 100];

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header dengan Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-700 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Produk</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalProducts.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="text-blue-700" size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600">
            {totalProducts} produk terdaftar
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Halaman Saat Ini</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{currentPage}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Dari {totalPages} halaman
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Data Ditampilkan</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{products.length}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Eye className="text-yellow-600" size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-yellow-600">
            Per halaman: {itemsPerPage}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Filter Aktif</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {filterBrand !== "all" ? "1" : filterStock !== "all" ? "1" : "0"}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Filter size={20} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Filter sedang diterapkan
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari produk berdasarkan nama atau brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Brand Filter */}
            <div className="relative">
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white text-sm appearance-none cursor-pointer"
              >
                <option value="all">Semua Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Stock Filter */}
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white text-sm"
            >
              <option value="all">Semua Stok</option>
              <option value="available">Tersedia (Stok {'>'} 0)</option>
              <option value="outofstock">Habis (Stok = 0)</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white text-sm"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="price_high">Harga Tertinggi</option>
              <option value="price_low">Harga Terendah</option>
              <option value="name_asc">Nama A-Z</option>
            </select>

            {/* Items per page */}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white text-sm"
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>{option} / halaman</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setFilterBrand("all");
                setFilterStock("all");
                setSortBy("newest");
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
              title="Reset Filter"
            >
              <RefreshCw size={18} className="text-gray-600" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <Link
              to="/admin/products/create"
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah</span>
            </Link>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{selectedProducts.length}</span> produk dipilih
            </div>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <Trash2 size={16} />
              Hapus Terpilih
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-10 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-700 focus:ring-blue-700"
                  />
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-3 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-500">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="text-gray-400">
                      <Package size={48} className="mx-auto mb-3 opacity-50" />
                      <p className="text-lg mb-2">Tidak ada produk</p>
                      <p className="text-sm">Coba ubah filter atau cari dengan kata kunci berbeda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition group">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-700 focus:ring-blue-700"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover ring-1 ring-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Laptop size={20} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.normal_price && product.price < product.normal_price ? (
                        <div>
                          <span className="font-semibold text-red-600">
                            Rp {product.price?.toLocaleString('id-ID')}
                          </span>
                          <p className="text-xs text-gray-400 line-through">
                            Rp {product.normal_price?.toLocaleString('id-ID')}
                          </p>
                          <span className="inline-block mt-1 px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">
                            -{product.discount_percent}%
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-blue-700">
                          Rp {product.price?.toLocaleString('id-ID')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? "bg-green-100 text-green-700" :
                          product.stock > 0 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? "bg-green-500" :
                            product.stock > 0 ? "bg-yellow-500" :
                              "bg-red-500"
                          }`}></div>
                        {product.stock > 0 ? `${product.stock.toLocaleString()} unit` : "Habis"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {product.brands?.name || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {product.categories?.name || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition ${deletingId === product.id ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          title="Hapus"
                        >
                          {deletingId === product.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
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
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} dari {totalCount.toLocaleString()} produk
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
              >
                <ChevronLeft size={16} />
                Sebelumnya
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition ${currentPage === pageNum
                          ? "bg-blue-700 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
              >
                Selanjutnya
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}