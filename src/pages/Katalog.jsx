import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../services/supabase";
import {
  Laptop, ChevronRight, Filter, X, Star, ShoppingBag,
  ChevronLeft, Cpu, MemoryStick, HardDrive, Battery,
  Tag, ArrowRight, Search, SlidersHorizontal, RotateCcw,
  Package, Zap, Monitor, BookOpen, Gamepad2, Briefcase,
  ChevronDown, Heart, Eye, Check
} from "lucide-react";

const CATEGORY_ICONS = {
  gaming: <Gamepad2 size={28} />,
  bisnis: <Briefcase size={28} />,
  pelajar: <BookOpen size={28} />,
  desain: <Monitor size={28} />,
  ultrabook: <Zap size={28} />,
  default: <Laptop size={28} />,
};

function getCategoryIcon(name = "") {
  const key = name.toLowerCase();
  for (const k of Object.keys(CATEGORY_ICONS)) {
    if (key.includes(k)) return CATEGORY_ICONS[k];
  }
  return CATEGORY_ICONS.default;
}

const fmt = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-4">
        <div className="h-3 bg-slate-200 rounded w-20 mb-2" />
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
        <div className="flex gap-2 mb-3">
          <div className="h-5 bg-slate-200 rounded w-16" />
          <div className="h-5 bg-slate-200 rounded w-16" />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <div className="h-6 bg-slate-200 rounded w-24" />
          <div className="h-8 bg-slate-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}

function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl top-10 -left-20 pointer-events-none" />
      <div className="absolute w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl bottom-10 right-0 pointer-events-none" />
      <div className="absolute w-48 h-48 bg-sky-400/10 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm">
          <Zap size={14} />
          <span>Temukan laptop impianmu</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
          Katalog<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
            Laptop
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-12 leading-relaxed max-w-lg mx-auto">
          Jelajahi koleksi laptop pilihan dari brand‑brand ternama. Temukan yang paling pas untuk kebutuhanmu.
        </p>
        <button
          onClick={onStart}
          className="group inline-flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
        >
          Mulai Pilih
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="flex items-center justify-center gap-8 mt-16 text-slate-500 text-sm">
          {[
            { icon: <Package size={16} />, label: "Produk Lengkap" },
            { icon: <Tag size={16} />, label: "Harga Terbaik" },
            { icon: <Star size={16} />, label: "Brand Terpercaya" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-blue-400">{s.icon}</span>
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryScreen({ categories, onSelect, onSkip }) {
  const COLORS = [
    "from-blue-500 to-blue-700",
    "from-indigo-500 to-indigo-700",
    "from-violet-500 to-violet-700",
    "from-sky-500 to-sky-700",
    "from-cyan-500 to-cyan-700",
    "from-teal-500 to-teal-700",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Laptop size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800">LaptopStore</span>
          </div>
          <button
            onClick={onSkip}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
          >
            Lihat semua produk
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Langkah 1 dari 1</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Pilih Kategori</h2>
          <p className="text-slate-500 text-lg">Laptop apa yang kamu cari?</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat)}
              className="group relative rounded-2xl overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-95"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${COLORS[idx % COLORS.length]} opacity-90`} />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 70% 30%, white 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="relative p-6 md:p-8">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 text-white">
                  {getCategoryIcon(cat.name)}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                <div className="flex items-center gap-1 mt-4 text-white/80 text-sm font-medium">
                  Lihat produk
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
          <button
            onClick={onSkip}
            className="group relative rounded-2xl overflow-hidden text-left border-2 border-dashed border-slate-300 hover:border-blue-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 bg-white"
          >
            <div className="p-6 md:p-8">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-1">Semua Produk</h3>
              <p className="text-slate-400 text-sm">Jelajahi semua laptop tanpa filter kategori</p>
              <div className="flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Lihat semua
                <ArrowRight size={14} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductScreen({
  products, categories, brands,
  selectedCategory, setSelectedCategory,
  selectedBrand, setSelectedBrand,
  sortBy, setSortBy,
  onBack, onOpenModal,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [stockFilter, setStockFilter] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;

  const debouncedSearch = useDebounce(searchInput, 300);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category_id === selectedCategory.id);
    }
    if (selectedBrand) {
      result = result.filter(p => p.brand_id === selectedBrand.id);
    }
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(p => {
        const matchesName = p.name?.toLowerCase().includes(searchLower);
        const matchesBrand = p.brands?.name?.toLowerCase().includes(searchLower);
        const matchesCategory = p.categories?.name?.toLowerCase().includes(searchLower);
        return matchesName || matchesBrand || matchesCategory;
      });
    }
    if (priceRange.min) {
      result = result.filter(p => p.price >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(p => p.price <= parseInt(priceRange.max));
    }
    if (stockFilter === "inStock") {
      result = result.filter(p => p.stock > 0);
    } else if (stockFilter === "outOfStock") {
      result = result.filter(p => p.stock <= 0);
    }

    result.sort((a, b) => {
      if (sortBy === "price_high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "price_low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "name_asc") return (a.name || "").localeCompare(b.name || "");
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return result;
  }, [products, selectedCategory, selectedBrand, debouncedSearch, priceRange.min, priceRange.max, stockFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilter = selectedCategory || selectedBrand || debouncedSearch || priceRange.min || priceRange.max || stockFilter !== "all";

  const resetAllFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSearchInput("");
    setPriceRange({ min: "", max: "" });
    setStockFilter("all");
    setPage(1);
  };

  useEffect(() => { setPage(1); }, [selectedCategory, selectedBrand, debouncedSearch, priceRange, stockFilter, sortBy]);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Cari Produk</label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Nama produk, brand, atau kategori..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Kategori</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => setSelectedCategory(null)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">Semua Kategori</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory?.id === cat.id}
                onChange={() => setSelectedCategory(cat)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600 flex items-center gap-1">
                <span className="text-base">{getCategoryIcon(cat.name)}</span>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Brand</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="brand"
              checked={!selectedBrand}
              onChange={() => setSelectedBrand(null)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">Semua Brand</span>
          </label>
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="brand"
                checked={selectedBrand?.id === brand.id}
                onChange={() => setSelectedBrand(brand)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Rentang Harga</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="w-1/2 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-1/2 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Ketersediaan</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"
              checked={stockFilter === "all"}
              onChange={() => setStockFilter("all")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">Semua</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"
              checked={stockFilter === "inStock"}
              onChange={() => setStockFilter("inStock")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">Tersedia</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"
              checked={stockFilter === "outOfStock"}
              onChange={() => setStockFilter("outOfStock")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">Habis</span>
          </label>
        </div>
      </div>

      {hasFilter && (
        <button
          onClick={resetAllFilters}
          className="w-full py-2.5 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} />
          Reset Semua Filter
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-slate-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors text-sm whitespace-nowrap"
              >
                <ChevronLeft size={18} />
                <span className="hidden sm:inline">Kembali</span>
              </button>
              <div className="h-5 w-px bg-slate-200 hidden sm:block" />
              <div className="flex items-center gap-2 text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
                <span className="font-medium text-slate-700">Katalog</span>
                {selectedCategory && (
                  <>
                    <ChevronRight size={14} className="text-slate-300" />
                    <span className="text-slate-800 font-semibold">{selectedCategory.name}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari produk, brand, atau kategori..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                >
                  <RotateCcw size={14} />
                  Refresh
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm bg-slate-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="newest">Terbaru</option>
                  <option value="price_high">Harga Tertinggi</option>
                  <option value="price_low">Harga Terendah</option>
                  <option value="name_asc">Nama A-Z</option>
                </select>

                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 rounded-xl"
                >
                  <Filter size={14} />
                  Filter
                  {hasFilter && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 py-6">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-5">
              <FilterSidebar />
            </div>
          </div>

          {/* Mobile Sidebar Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
                  <h3 className="font-bold text-slate-800">Filter</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 rounded-lg hover:bg-slate-100">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-5">
                  <FilterSidebar />
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-800">{filtered.length}</span> produk ditemukan
              </p>
              {hasFilter && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <Chip label={selectedCategory.name} onRemove={() => setSelectedCategory(null)} />
                  )}
                  {selectedBrand && (
                    <Chip label={selectedBrand.name} onRemove={() => setSelectedBrand(null)} />
                  )}
                  {debouncedSearch && (
                    <Chip label={`"${debouncedSearch}"`} onRemove={() => setSearchInput("")} />
                  )}
                  {(priceRange.min || priceRange.max) && (
                    <Chip
                      label={`Harga: ${priceRange.min ? fmt(priceRange.min) : "0"} - ${priceRange.max ? fmt(priceRange.max) : "∞"}`}
                      onRemove={() => setPriceRange({ min: "", max: "" })}
                    />
                  )}
                  {stockFilter !== "all" && (
                    <Chip
                      label={stockFilter === "inStock" ? "Tersedia" : "Habis"}
                      onRemove={() => setStockFilter("all")}
                    />
                  )}
                </div>
              )}
            </div>

            {paged.length === 0 ? (
              <EmptyState onReset={resetAllFilters} hasFilter={hasFilter} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paged.map((product) => (
                    <ProductCard key={product.id} product={product} onClick={() => onOpenModal(product)} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-10 gap-2">
                    <PageBtn onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
                      <ChevronLeft size={16} />
                    </PageBtn>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let n;
                      if (totalPages <= 5) n = i + 1;
                      else if (page <= 3) n = i + 1;
                      else if (page >= totalPages - 2) n = totalPages - 4 + i;
                      else n = page - 2 + i;
                      return (
                        <PageBtn key={n} active={page === n} onClick={() => setPage(n)}>
                          {n}
                        </PageBtn>
                      );
                    })}
                    <PageBtn onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
                      <ChevronRight size={16} />
                    </PageBtn>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900">
        <X size={10} />
      </button>
    </span>
  );
}

function ProductCard({ product, onClick }) {
  const [imgError, setImgError] = useState(false);
  const specs = product.product_specs?.[0] || {};
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock < 5;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {product.thumbnail && !imgError ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Laptop size={40} className="text-slate-300" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {outOfStock && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[11px] font-semibold rounded-full">Habis</span>
          )}
          {lowStock && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-[11px] font-semibold rounded-full">Stok {product.stock}</span>
          )}
        </div>
        <div className="absolute inset-0 bg-blue-700/0 group-hover:bg-blue-700/10 flex items-center justify-center transition-all">
          <span className="px-4 py-2 bg-white text-blue-700 text-sm font-semibold rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg flex items-center gap-1.5">
            <Eye size={14} /> Lihat Detail
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-blue-600 font-semibold mb-0.5 truncate">{product.brands?.name || "–"}</p>
        <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
          {product.name}
        </h3>

        <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
          {specs.processor && <SpecPill icon={<Cpu size={10} />} label={specs.processor.split(" ").slice(0, 2).join(" ")} />}
          {specs.ram && <SpecPill icon={<MemoryStick size={10} />} label={specs.ram} />}
          {specs.storage && <SpecPill icon={<HardDrive size={10} />} label={specs.storage} />}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <p className="text-lg font-black text-blue-700">{fmt(product.price)}</p>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors">
            Detail
          </button>
        </div>
      </div>
    </div>
  );
}

function SpecPill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[11px]">
      {icon}
      <span className="truncate max-w-[80px]">{label}</span>
    </span>
  );
}

function EmptyState({ onReset, hasFilter }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <ShoppingBag size={36} className="text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-700 mb-2">Produk tidak ditemukan</h3>
      <p className="text-slate-400 text-sm mb-6">
        {hasFilter ? "Coba ubah filter atau kata kunci pencarian" : "Belum ada produk tersedia"}
      </p>
      {hasFilter && (
        <button onClick={onReset} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
          Reset Filter
        </button>
      )}
    </div>
  );
}

function PageBtn({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-10 rounded-xl text-sm font-semibold flex items-center justify-center transition-all ${active ? "bg-blue-600 text-white shadow-md" : disabled ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-200"
        }`}
    >
      {children}
    </button>
  );
}

function ProductModal({ product, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const specs = product.product_specs?.[0] || {};

  useEffect(() => {
    const images = [];
    if (product.thumbnail && product.thumbnail.trim() !== "") images.push(product.thumbnail);
    if (product.product_images && product.product_images.length > 0) {
      product.product_images.forEach(img => {
        if (img.image_url && img.image_url.trim() !== "") images.push(img.image_url);
      });
    }
    setAllImages([...new Map(images.map(img => [img, img])).values()]);
    setImgIdx(0);
  }, [product]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const SPEC_ROWS = [
    { icon: <Cpu size={16} />, label: "Processor", value: specs.processor },
    { icon: <MemoryStick size={16} />, label: "RAM", value: specs.ram },
    { icon: <HardDrive size={16} />, label: "Storage", value: specs.storage },
    { icon: <Monitor size={16} />, label: "Display", value: specs.display },
    { icon: <Battery size={16} />, label: "Baterai", value: specs.battery },
    { icon: <Package size={16} />, label: "GPU", value: specs.gpu },
    { icon: <Tag size={16} />, label: "OS", value: specs.system_os },
  ].filter(r => r.value && r.value.trim());

  const prevImage = () => setImgIdx(prev => prev > 0 ? prev - 1 : allImages.length - 1);
  const nextImage = () => setImgIdx(prev => prev < allImages.length - 1 ? prev + 1 : 0);

  // Hitung harga diskon jika ada
  const hasDiscount = product.discount_percent > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discount_percent / 100)
    : product.price;
  const originalPrice = product.normal_price || product.price;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header (sama seperti sebelumnya) */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
              <Laptop size={16} className="text-blue-600" />
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span>Detail Produk</span>
              {product.brands?.name && (
                <>
                  <ChevronRight size={14} className="text-slate-300" />
                  <span className="text-slate-700 font-medium">{product.brands.name}</span>
                </>
              )}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all hover:scale-110">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-70px)]">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Gallery (sama) */}
            <div className="bg-gradient-to-br from-slate-50 to-white p-6">
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group">
                {allImages[imgIdx] ? (
                  <>
                    <img src={allImages[imgIdx]} alt={product.name} className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105" />
                    {allImages.length > 1 && (
                      <>
                        <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                          <ChevronLeft size={18} />
                        </button>
                        <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
                    <Laptop size={80} className="text-slate-300" />
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="mt-4">
                  <div className="flex gap-2 overflow-x-auto pb-2 justify-center scrollbar-hide">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? "border-blue-500 ring-2 ring-blue-200 shadow-lg" : "border-slate-200 hover:border-slate-300"}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-xs text-slate-400 mt-2">{imgIdx + 1} / {allImages.length} gambar</p>
                </div>
              )}
            </div>

            {/* Informasi Produk (lengkap) */}
            <div className="p-6 lg:p-8">
              {/* Badges atas: best seller, promo, new stock */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.is_best_seller && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                    <Star size={12} className="fill-amber-500" />
                    Best Seller
                  </span>
                )}
                {product.is_promo && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                    🔥 Promo
                  </span>
                )}
                {product.is_new_stock && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    ✨ New Stock
                  </span>
                )}
              </div>

              {/* Brand & Category (sama) */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.brands?.name && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                    <Tag size={12} /> {product.brands.name}
                  </span>
                )}
                {product.categories?.name && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                    <Laptop size={12} /> {product.categories.name}
                  </span>
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 leading-tight">{product.name}</h1>

              {/* Harga dengan diskon */}
              <div className="mb-5 pb-4 border-b border-slate-100">
                <div className="flex items-baseline gap-2 flex-wrap">
                  {hasDiscount ? (
                    <>
                      <p className="text-3xl lg:text-4xl font-black text-red-600">
                        {fmt(finalPrice)}
                      </p>
                      <p className="text-lg text-slate-400 line-through">
                        {fmt(originalPrice)}
                      </p>
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        -{product.discount_percent}%
                      </span>
                    </>
                  ) : (
                    <p className="text-3xl lg:text-4xl font-black text-blue-700">
                      {fmt(originalPrice)}
                    </p>
                  )}
                </div>
                {product.normal_price && product.normal_price > product.price && !hasDiscount && (
                  <p className="text-sm text-slate-400 line-through mt-1">{fmt(product.normal_price)}</p>
                )}
              </div>

              {/* Stok status */}
              <div className={`mb-5 p-3 rounded-xl flex items-center gap-3 ${product.stock > 0
                ? (product.stock < 5 ? "bg-amber-50 border border-amber-100" : "bg-green-50 border border-green-100")
                : "bg-red-50 border border-red-100"
                }`}>
                <div className={`w-3 h-3 rounded-full ${product.stock > 0
                  ? (product.stock < 5 ? "bg-amber-500 animate-pulse" : "bg-green-500")
                  : "bg-red-500"
                  }`} />
                <p className={`text-sm font-medium ${product.stock > 0
                  ? (product.stock < 5 ? "text-amber-700" : "text-green-700")
                  : "text-red-700"
                  }`}>
                  {product.stock > 0
                    ? (product.stock < 5
                      ? `⚠ Stok terbatas: hanya ${product.stock} unit tersisa`
                      : `✓ Tersedia (${product.stock} unit)`)
                    : "✕ Stok habis"}
                </p>
              </div>

              {/* Spesifikasi (sama) */}
              {SPEC_ROWS.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Cpu size={14} className="text-blue-600" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Spesifikasi Lengkap</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                    {SPEC_ROWS.map(row => (
                      <div key={row.label} className="flex items-start gap-2 text-sm">
                        <span className="text-slate-400 mt-0.5">{row.icon}</span>
                        <span className="text-slate-500 w-20 flex-shrink-0">{row.label}</span>
                        <span className="text-slate-800 font-medium flex-1 break-words">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deskripsi (sama) */}
              {(product.short_description || product.description) && (
                <div className="space-y-4">
                  {product.short_description && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        Deskripsi Singkat
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">{product.short_description}</p>
                    </div>
                  )}
                  {product.description && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        Informasi Lengkap
                      </p>
                      <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{product.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tags (jika ada) */}
              {product.product_tags && product.product_tags.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {product.product_tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        #{typeof tag === 'object' ? tag.name : tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Katalog() {
  const [step, setStep] = useState(
    localStorage.getItem("katalog_step") || "welcome"
  );
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const saved =
      localStorage.getItem(
        "katalog_category"
      );

    return saved
      ? JSON.parse(saved)
      : null;
  });

  const [selectedBrand, setSelectedBrand] = useState(() => {
    const saved =
      localStorage.getItem(
        "katalog_brand"
      );

    return saved
      ? JSON.parse(saved)
      : null;
  });

  const [sortBy, setSortBy] = useState(
    localStorage.getItem(
      "katalog_sort"
    ) || "newest"
  );
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      "katalog_step",
      step
    );
  }, [step]);

  useEffect(() => {
    localStorage.setItem(
      "katalog_category",
      JSON.stringify(selectedCategory)
    );
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem(
      "katalog_brand",
      JSON.stringify(selectedBrand)
    );
  }, [selectedBrand]);

  useEffect(() => {
    localStorage.setItem(
      "katalog_sort",
      sortBy
    );
  }, [sortBy]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesRes, brandsRes, productsRes] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("brands").select("*").order("name"),
        supabase.from("products").select("*").order("created_at", { ascending: false })
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (brandsRes.error) throw brandsRes.error;
      if (productsRes.error) throw productsRes.error;

      const productIds = productsRes.data.map(p => p.id);
      let specs = [], images = [];

      if (productIds.length) {
        const [specsRes, imagesRes] = await Promise.all([
          supabase.from("product_specs").select("*").in("product_id", productIds),
          supabase.from("product_images").select("*").in("product_id", productIds)
        ]);
        if (!specsRes.error) specs = specsRes.data;
        if (!imagesRes.error) images = imagesRes.data;
      }

      const enriched = productsRes.data.map(p => ({
        ...p,
        brands: brandsRes.data.find(b => b.id === p.brand_id) || null,
        categories: categoriesRes.data.find(c => c.id === p.category_id) || null,
        product_specs: specs.filter(s => s.product_id === p.id),
        product_images: images.filter(i => i.product_id === p.id)
      }));

      setCategories(categoriesRes.data || []);
      setBrands(brandsRes.data || []);
      setProducts(enriched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {

    if (!modalProduct) return;

    const updated =
      products.find(
        (p) => p.id === modalProduct.id
      );

    if (updated) {
      setModalProduct(updated);
    }

  }, [products]);

  useEffect(() => {

    const channel = supabase
      .channel("katalog-realtime")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        () => {
          loadData();
        }
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "product_specs",
        },
        () => {
          loadData();
        }
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "product_images",
        },
        () => {
          loadData();
        }
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "brands",
        },
        () => {
          loadData();
        }
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
        },
        () => {
          loadData();
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [loadData]);

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton untuk header */}
          <div className="mb-8">
            <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-96 animate-pulse" />
          </div>
          <SkeletonGrid />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-500 mb-2">Gagal memuat data</p>
          <button onClick={loadData} className="px-4 py-2 bg-blue-600 text-white rounded-xl">Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {step === "welcome" && <WelcomeScreen onStart={() => setStep("category")} />}
      {step === "category" && (
        <CategoryScreen
          categories={categories}
          onSelect={cat => { setSelectedCategory(cat); setStep("products"); }}
          onSkip={() => { setSelectedCategory(null); setStep("products"); }}
        />
      )}
      {step === "products" && (
        <>
          <ProductScreen
            products={products} categories={categories} brands={brands}
            selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
            selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
            sortBy={sortBy} setSortBy={setSortBy}
            onBack={() => setStep("category")}
            onOpenModal={setModalProduct}
          />
        </>
      )}
      {modalProduct && <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />}
    </>
  );
}