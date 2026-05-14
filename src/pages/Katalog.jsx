import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../services/supabase";
import {
  Laptop, ChevronRight, Filter, X, Star, ShoppingBag,
  ChevronLeft, Cpu, MemoryStick, HardDrive,
  Tag, ArrowRight, Search, SlidersHorizontal, RotateCcw,
  Package, Zap, Monitor, BookOpen, Gamepad2, Briefcase,
  ChevronDown, Heart, Eye, Check, Sparkles, Loader2,
  TrendingUp, Flame, Gift, Award
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const CATEGORY_ICONS = {
  gaming: <Gamepad2 size={20} />,
  bisnis: <Briefcase size={20} />,
  pelajar: <BookOpen size={20} />,
  desain: <Monitor size={20} />,
  ultrabook: <Zap size={20} />,
  default: <Laptop size={20} />,
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

// Fungsi untuk mendapatkan style warna dari nama warna
function getTagColorStyle(colorName) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-green-100 text-green-700 border-green-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    pink: "bg-pink-100 text-pink-700 border-pink-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    red: "bg-red-100 text-red-700 border-red-200",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
    teal: "bg-teal-100 text-teal-700 border-teal-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
  };
  return colorMap[colorName] || colorMap.blue;
}

function getTagBadgeColor(colorName) {
  const colorMap = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    indigo: "bg-indigo-500",
    teal: "bg-teal-500",
    orange: "bg-orange-500",
    cyan: "bg-cyan-500",
  };
  return colorMap[colorName] || "bg-blue-500";
}

function SearchLoadingIndicator() {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
      <Loader2 size={14} className="text-blue-500 animate-spin" />
    </div>
  );
}

function ProductTagBadge({ productTags, allTags }) {
  if (!productTags || productTags.length === 0) return null;

  const tagsToShow = productTags.slice(0, 2).map(pt => {
    const tagInfo = allTags.find(t => t.id === pt.tag_id);
    return tagInfo;
  }).filter(t => t);

  if (tagsToShow.length === 0) return null;

  return (
    <div className="absolute top-1.5 left-1.5 flex gap-1 z-10">
      {tagsToShow.map((tag, idx) => (
        <span
          key={idx}
          className={`${getTagBadgeColor(tag.color)} text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm`}
        >
          {tag.name.length > 10 ? tag.name.slice(0, 8) + '...' : tag.name}
        </span>
      ))}
    </div>
  );
}

function AnimatedProductCard({ product, onClick, index, allTags }) {
  const [imgError, setImgError] = useState(false);
  const specs = product.product_specs?.[0] || {};
  const outOfStock = product.stock <= 0;
  const hasDiscount = product.discount_percent > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discount_percent / 100)
    : product.price;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fadeInUp"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Container gambar dengan aspect ratio video (16:9) */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        {product.thumbnail && !imgError ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Laptop size={48} className="text-slate-300" />
          </div>
        )}

        {/* Product Tag Badge */}
        <ProductTagBadge productTags={product.product_tags} allTags={allTags} />

        {/* Out of Stock Badge */}
        {outOfStock && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full z-10 shadow-sm">
            Habis
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Informasi produk */}
      <div className="p-3">
        {/* Brand */}
        <p className="text-[11px] text-slate-500 font-medium mb-0.5 truncate">
          {product.brands?.name || "Umum"}
        </p>

        {/* Nama produk */}
        <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Spesifikasi ringkas (processor & ram) dalam satu baris */}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5 mb-2">
          {specs.processor && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">
              <Cpu size={9} />
              {specs.processor.split(" ").slice(0, 2).join(" ")}
            </span>
          )}
          {specs.ram && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[9px] font-medium">
              <MemoryStick size={9} />
              {specs.ram}
            </span>
          )}
        </div>

        {/* Harga dan tombol */}
        <div className="flex items-end justify-between pt-2 border-t border-slate-100">
          <div>
            {hasDiscount ? (
              <>
                <p className="text-base font-black text-red-600 leading-tight">
                  {fmt(finalPrice)}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <p className="text-[10px] text-slate-400 line-through">
                    {fmt(product.normal_price)}
                  </p>
                  <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1 py-px rounded">
                    -{product.discount_percent}%
                  </span>
                </div>
              </>
            ) : (
              <p className="text-base font-black text-slate-800 leading-tight">
                {fmt(product.price)}
              </p>
            )}
          </div>
          <button className="px-2.5 py-1 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 text-[11px] font-semibold rounded-lg transition-all hover:shadow-sm">
            Detail
          </button>
        </div>
      </div>
    </div>
  );
}

// Animated Search Bar
function AnimatedSearchBar({ value, onChange, isLoading, onFocus, onBlur }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
      <div
        className={`absolute inset-0 bg-blue-500 rounded-lg blur-lg transition-opacity duration-300 ${isFocused ? 'opacity-30' : 'opacity-0'
          }`}
      />

      <div className="relative">
        <Search
          size={12}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300"
          style={{
            transform: isFocused
              ? 'translateY(-50%) scale(1.1)'
              : 'translateY(-50%)',
          }}
        />

        <input
          type="text"
          placeholder="Cari produk, brand, atau kategori..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          className="w-full pl-8 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 transition-all duration-300"
        />

        {isLoading && <SearchLoadingIndicator />}

        {value && !isLoading && (
          <button
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={10} />
          </button>
        )}
      </div>
    </div>
  );
}

// Empty State with Animation
function EmptyStateWithAnimation({ onReset, hasFilter, searchTerm }) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center transition-all duration-500 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3 animate-bounce">
        {searchTerm ? (
          <Search size={24} className="text-slate-400" />
        ) : (
          <ShoppingBag size={24} className="text-slate-300" />
        )}
      </div>
      <h3 className="text-base font-bold text-slate-700 mb-1">
        {searchTerm ? "Produk tidak ditemukan" : "Belum ada produk"}
      </h3>
      <p className="text-slate-400 text-xs mb-4">
        {searchTerm
          ? `Tidak ada produk yang cocok dengan "${searchTerm}"`
          : hasFilter ? "Coba ubah filter pencarian" : "Belum ada produk tersedia"}
      </p>
      {searchTerm && (
        <button
          onClick={() => onReset()}
          className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all hover:scale-105"
        >
          Bersihkan Pencarian
        </button>
      )}
      {hasFilter && !searchTerm && (
        <button onClick={onReset} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all hover:scale-105">
          Reset Filter
        </button>
      )}
    </div>
  );
}

// Result Count with Animation
function ResultCountWithAnimation({ count, isSearching }) {
  const [displayCount, setDisplayCount] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count !== displayCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayCount(count);
        setIsAnimating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [count, displayCount]);

  return (
    <div className="flex items-center gap-1.5">
      {isSearching ? (
        <Loader2 size={10} className="text-blue-500 animate-spin" />
      ) : (
        <div className={`w-1.5 h-1.5 rounded-full bg-green-500 transition-all duration-300 ${isAnimating ? 'scale-150' : 'scale-100'}`} />
      )}
      <p className="text-xs text-slate-500">
        <span className={`font-semibold text-slate-800 transition-all duration-300 ${isAnimating ? 'text-blue-600' : ''}`}>
          {displayCount}
        </span> produk ditemukan
      </p>
    </div>
  );
}

function DynamicTagFilter({ tags, selectedTagId, onTagChange, onClear, isLoading }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center justify-between w-full mb-2">
          <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded w-full animate-pulse"></div>
          <div className="h-6 bg-slate-200 rounded w-full animate-pulse"></div>
          <div className="h-6 bg-slate-200 rounded w-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (tags.length === 0) return null;

  return (
    <div className="border-b border-slate-100 pb-3 mb-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left mb-2"
      >
        <h3 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Tag size={12} />
          Filter Tag
        </h3>
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="space-y-1.5 animate-slideDown">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs">
            <input
              type="radio"
              name="productTag"
              checked={!selectedTagId}
              onChange={onClear}
              className="w-3 h-3 text-blue-600"
            />
            <span className="text-slate-600">Semua Produk</span>
          </label>

          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-1.5 cursor-pointer text-xs group">
              <input
                type="radio"
                name="productTag"
                checked={selectedTagId === tag.id}
                onChange={() => onTagChange(tag.id)}
                className="w-3 h-3 text-blue-600"
              />
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full ${getTagColorStyle(tag.color)} transition-all group-hover:scale-105`}>
                <Tag size={10} />
                {tag.name}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="aspect-video bg-slate-200" />
      <div className="p-3">
        <div className="h-2.5 bg-slate-200 rounded w-20 mb-2" />
        <div className="h-3.5 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="flex gap-1.5 mb-3">
          <div className="h-4 bg-slate-200 rounded w-16" />
          <div className="h-4 bg-slate-200 rounded w-14" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded w-20" />
          <div className="h-7 bg-slate-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}

// Welcome Screen
function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-medium mb-6 backdrop-blur-sm">
          <Zap size={12} />
          <span>Temukan laptop impianmu</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
          Katalog<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
            Laptop
          </span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base mb-8 leading-relaxed max-w-lg mx-auto">
          Jelajahi koleksi laptop pilihan dari brand‑brand ternama. Temukan yang paling pas untuk kebutuhanmu.
        </p>
        <button
          onClick={onStart}
          className="group inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
        >
          Mulai Pilih
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="flex items-center justify-center gap-6 mt-10 text-slate-500 text-xs">
          {[
            { icon: <Package size={12} />, label: "Produk Lengkap" },
            { icon: <Tag size={12} />, label: "Harga Terbaik" },
            { icon: <Star size={12} />, label: "Brand Terpercaya" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="text-blue-400">{s.icon}</span>
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Category Screen
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Pilih Kategori</h2>
          <p className="text-slate-500 text-sm">Laptop apa yang kamu cari?</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat)}
              className="group relative rounded-xl overflow-hidden text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${COLORS[idx % COLORS.length]} opacity-90`} />
              <div className="relative p-4">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-3 text-white">
                  {getCategoryIcon(cat.name)}
                </div>
                <h3 className="text-base font-bold text-white mb-0.5">{cat.name}</h3>
                <div className="flex items-center gap-0.5 mt-2 text-white/80 text-xs font-medium">
                  Lihat produk
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
          ))}
          <button
            onClick={onSkip}
            className="group relative rounded-xl overflow-hidden text-left border border-dashed border-slate-300 hover:border-blue-400 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 bg-white"
          >
            <div className="p-4">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <ShoppingBag size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-0.5">Semua Produk</h3>
              <p className="text-slate-400 text-xs">Jelajahi semua laptop</p>
              <div className="flex items-center gap-0.5 mt-2 text-blue-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Lihat semua
                <ArrowRight size={12} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Chip Component
function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900">
        <X size={8} />
      </button>
    </span>
  );
}

// Page Button Component
function PageBtn({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${active ? "bg-blue-600 text-white shadow-sm" : disabled ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-200"
        }`}
    >
      {children}
    </button>
  );
}

// Product Modal
function ProductModal({ product, onClose, allTags }) {
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

  // Dapatkan tag produk yang terkait
  const productTags = product.product_tags || [];
  const tagNames = productTags.map(pt => {
    const tagInfo = allTags.find(t => t.id === pt.tag_id);
    return tagInfo;
  }).filter(t => t);

  const SPEC_ROWS = [
    { icon: <Cpu size={14} />, label: "Processor", value: specs.processor },
    { icon: <MemoryStick size={14} />, label: "RAM", value: specs.ram },
    { icon: <HardDrive size={14} />, label: "Storage", value: specs.storage },
    { icon: <Monitor size={14} />, label: "Display", value: specs.display },
    { icon: <Package size={14} />, label: "GPU", value: specs.gpu },
    { icon: <Tag size={14} />, label: "OS", value: specs.system_os },
  ].filter(r => r.value && r.value.trim());

  const prevImage = () => setImgIdx(prev => prev > 0 ? prev - 1 : allImages.length - 1);
  const nextImage = () => setImgIdx(prev => prev < allImages.length - 1 ? prev + 1 : 0);

  const hasDiscount = product.discount_percent > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discount_percent / 100)
    : product.price;
  const originalPrice = product.normal_price || product.price;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <Laptop size={14} className="text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <span>Detail Produk</span>
              {product.brands?.name && (
                <>
                  <ChevronRight size={12} className="text-slate-300" />
                  <span className="text-slate-700 font-medium">{product.brands.name}</span>
                </>
              )}
            </div>
          </div>
          <button onClick={onClose} className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all">
            <X size={12} className="text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-52px)]">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-slate-50 to-white p-4">
              <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group">
                {allImages[imgIdx] ? (
                  <>
                    <img src={allImages[imgIdx]} alt={product.name} className="w-full h-full object-contain p-4" />
                    {allImages.length > 1 && (
                      <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <ChevronLeft size={14} />
                        </button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <ChevronRight size={14} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Laptop size={48} className="text-slate-300" />
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="mt-3">
                  <div className="flex gap-1.5 overflow-x-auto pb-1 justify-center">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? "border-blue-500 ring-1 ring-blue-200" : "border-slate-200"}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-[10px] text-slate-400 mt-1">{imgIdx + 1} / {allImages.length}</p>
                </div>
              )}
            </div>

            <div className="p-4 lg:p-5">
              {/* Tags Produk */}
              {tagNames.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tagNames.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getTagColorStyle(tag.color)}`}
                    >
                      <Tag size={10} />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mb-3">
                {product.brands?.name && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full">
                    <Tag size={10} /> {product.brands.name}
                  </span>
                )}
                {product.categories?.name && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-full">
                    <Laptop size={10} /> {product.categories.name}
                  </span>
                )}
              </div>

              <h1 className="text-base lg:text-lg font-bold text-slate-900 mb-2 leading-tight">{product.name}</h1>

              <div className="mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  {hasDiscount ? (
                    <>
                      <p className="text-xl lg:text-2xl font-black text-red-600">{fmt(finalPrice)}</p>
                      <p className="text-xs text-slate-400 line-through">{fmt(originalPrice)}</p>
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded-full">
                        -{product.discount_percent}%
                      </span>
                    </>
                  ) : (
                    <p className="text-xl lg:text-2xl font-black text-blue-700">{fmt(originalPrice)}</p>
                  )}
                </div>
              </div>

              <div className={`mb-3 p-2 rounded-lg flex items-center gap-2 text-xs ${product.stock > 0
                ? (product.stock < 5 ? "bg-amber-50 border border-amber-100" : "bg-green-50 border border-green-100")
                : "bg-red-50 border border-red-100"
                }`}>
                <div className={`w-2 h-2 rounded-full ${product.stock > 0
                  ? (product.stock < 5 ? "bg-amber-500 animate-pulse" : "bg-green-500")
                  : "bg-red-500"
                  }`} />
                <p className={`font-medium text-[10px] ${product.stock > 0
                  ? (product.stock < 5 ? "text-amber-700" : "text-green-700")
                  : "text-red-700"
                  }`}>
                  {product.stock > 0
                    ? (product.stock < 5
                      ? `⚠ Stok ${product.stock}`
                      : `✓ Tersedia (${product.stock})`)
                    : "✕ Stok habis"}
                </p>
              </div>

              {SPEC_ROWS.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Cpu size={12} className="text-blue-600" />
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">Spesifikasi</p>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    {SPEC_ROWS.map(row => (
                      <div key={row.label} className="flex items-start gap-1.5">
                        <span className="text-slate-400 mt-0.5">{row.icon}</span>
                        <span className="text-slate-500 w-16 flex-shrink-0 text-[10px]">{row.label}</span>
                        <span className="text-slate-800 font-medium text-[10px] flex-1">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(product.short_description || product.description) && (
                <div className="space-y-3">
                  {product.short_description && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Deskripsi</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{product.short_description}</p>
                    </div>
                  )}
                  {product.description && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Informasi Lengkap</p>
                      <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{product.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Product Screen Component
function ProductScreen({
  products, categories, brands, allTags,
  selectedCategory, setSelectedCategory,
  selectedBrand, setSelectedBrand,
  sortBy, setSortBy,
  onBack, onOpenModal,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const PER_PAGE = 12;

  // SESUDAH (diperbaiki):
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (searchInput !== debouncedSearch) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchInput, debouncedSearch]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category_id === selectedCategory.id);
    }
    if (selectedBrand) {
      result = result.filter(p => p.brand_id === selectedBrand.id);
    }

    // Filter berdasarkan tag (dinamis dari database)
    if (selectedTagId) {
      result = result.filter(p => {
        const productTags = p.product_tags || [];
        return productTags.some(pt => pt.tag_id === selectedTagId);
      });
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
  }, [products, selectedCategory, selectedBrand, selectedTagId, debouncedSearch, priceRange.min, priceRange.max, stockFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilter = selectedCategory || selectedBrand || selectedTagId || debouncedSearch || priceRange.min || priceRange.max || stockFilter !== "all";

  const resetAllFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedTagId(null);
    setSearchInput("");
    setPriceRange({ min: "", max: "" });
    setStockFilter("all");
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
  };

  const handleTagChange = (tagId) => {
    setSelectedTagId(tagId);
    setPage(1);
  };

  const clearTagFilter = () => {
    setSelectedTagId(null);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedBrand, selectedTagId, debouncedSearch, priceRange, stockFilter, sortBy]);

  const FilterSidebar = () => (
    <div className="space-y-4">
      <DynamicTagFilter
        tags={allTags}
        selectedTagId={selectedTagId}
        onTagChange={handleTagChange}
        onClear={clearTagFilter}
        isLoading={isLoadingTags}
      />

      <div>
        <h3 className="text-xs font-semibold text-slate-700 mb-2">Kategori</h3>
        <div className="space-y-1.5 max-h-36 overflow-y-auto">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs">
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => setSelectedCategory(null)}
              className="w-3 h-3 text-blue-600"
            />
            <span className="text-slate-600">Semua Kategori</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input
                type="radio"
                name="category"
                checked={selectedCategory?.id === cat.id}
                onChange={() => setSelectedCategory(cat)}
                className="w-3 h-3 text-blue-600"
              />
              <span className="text-slate-600 flex items-center gap-1">
                <span className="text-sm">{getCategoryIcon(cat.name)}</span>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-700 mb-2">Brand</h3>
        <div className="space-y-1.5 max-h-36 overflow-y-auto">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs">
            <input
              type="radio"
              name="brand"
              checked={!selectedBrand}
              onChange={() => setSelectedBrand(null)}
              className="w-3 h-3 text-blue-600"
            />
            <span className="text-slate-600">Semua Brand</span>
          </label>
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input
                type="radio"
                name="brand"
                checked={selectedBrand?.id === brand.id}
                onChange={() => setSelectedBrand(brand)}
                className="w-3 h-3 text-blue-600"
              />
              <span className="text-slate-600">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-700 mb-2">Rentang Harga</h3>
        <div className="flex gap-1.5">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="w-1/2 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-1/2 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-700 mb-2">Ketersediaan</h3>
        <div className="space-y-1.5">
          {["all", "inStock", "outOfStock"].map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input
                type="radio"
                name="stock"
                checked={stockFilter === opt}
                onChange={() => setStockFilter(opt)}
                className="w-3 h-3 text-blue-600"
              />
              <span className="text-slate-600">
                {opt === "all" ? "Semua" : opt === "inStock" ? "Tersedia" : "Habis"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {hasFilter && (
        <button
          onClick={resetAllFilters}
          className="w-full py-1.5 text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw size={10} />
          Reset Filter
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
            opacity: 0;
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease-out forwards;
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
          .animate-slideInRight {
            animation: slideInRight 0.3s ease-out forwards;
          }
          .shimmer-text {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>

      <div className="relative top-6 md:top-6 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors text-xs"
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Kembali</span>
            </button>

            <div className="flex-1 max-w-xs">
              <AnimatedSearchBar
                value={searchInput}
                onChange={setSearchInput}
                isLoading={isSearching}
              />
            </div>

            <div className="flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1.5 text-xs bg-slate-100 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer transition-all hover:bg-slate-200"
              >
                <option value="newest">Terbaru</option>
                <option value="price_high">Harga Tertinggi</option>
                <option value="price_low">Harga Terendah</option>
                <option value="name_asc">Nama A-Z</option>
              </select>

              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-1.5 px-2 py-1.5 text-xs bg-slate-100 rounded-lg transition-all hover:bg-slate-200"
              >
                <Filter size={12} />
                Filter
                {hasFilter && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-3 py-10">
        <div className="flex gap-4">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-16 bg-white rounded-xl border border-slate-200 p-3">
              <FilterSidebar />
            </div>
          </div>

          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">

              {/* Overlay mulai di bawah navbar */}
              <div
                className="absolute inset-0 top-16 bg-black/50"
                onClick={() => setShowMobileFilters(false)}
              />

              {/* Sidebar filter mobile */}
              <div className="absolute right-0 top-16 bottom-0 w-72 bg-white shadow-xl overflow-y-auto animate-slideInRight rounded-tl-2xl">
                <div className="p-3 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                  <h3 className="font-bold text-slate-800 text-sm">
                    Filter
                  </h3>

                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="p-3">
                  <FilterSidebar />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <ResultCountWithAnimation count={filtered.length} isSearching={isSearching} />

              {hasFilter && (
                <div className="flex flex-wrap gap-1.5 animate-slideDown">
                  {selectedCategory && (
                    <Chip label={selectedCategory.name} onRemove={() => setSelectedCategory(null)} />
                  )}
                  {selectedBrand && (
                    <Chip label={selectedBrand.name} onRemove={() => setSelectedBrand(null)} />
                  )}
                  {selectedTagId && (
                    <Chip
                      label={allTags.find(t => t.id === selectedTagId)?.name || "Tag"}
                      onRemove={clearTagFilter}
                    />
                  )}
                  {debouncedSearch && (
                    <Chip label={`"${debouncedSearch}"`} onRemove={clearSearch} />
                  )}
                  {(priceRange.min || priceRange.max) && (
                    <Chip
                      label={`Harga: ${priceRange.min || "0"} - ${priceRange.max || "∞"}`}
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

            {isSearching ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
                    <div className="h-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 shimmer-text" />
                    <div className="p-2.5">
                      <div className="h-2 bg-slate-200 rounded w-16 mb-1.5" />
                      <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="flex gap-1 mb-2">
                        <div className="h-3 bg-slate-200 rounded w-12" />
                        <div className="h-3 bg-slate-200 rounded w-12" />
                      </div>
                      <div className="flex justify-between pt-1.5">
                        <div className="h-4 bg-slate-200 rounded w-20" />
                        <div className="h-6 bg-slate-200 rounded w-14" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : paged.length === 0 ? (
              <EmptyStateWithAnimation
                onReset={resetAllFilters}
                hasFilter={hasFilter}
                searchTerm={debouncedSearch}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {paged.map((product, idx) => (
                    <AnimatedProductCard
                      key={product.id}
                      product={product}
                      onClick={() => onOpenModal(product)}
                      index={idx}
                      allTags={allTags}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 gap-1 animate-fadeInUp">
                    <PageBtn onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
                      <ChevronLeft size={12} />
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
                      <ChevronRight size={12} />
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

export default function Katalog() {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem("katalog_step");
    if (saved === "products" || saved === "category") return saved;
    return "category";
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const saved = localStorage.getItem("katalog_category");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedBrand, setSelectedBrand] = useState(() => {
    const saved = localStorage.getItem("katalog_brand");
    return saved ? JSON.parse(saved) : null;
  });

  const [sortBy, setSortBy] = useState(
    localStorage.getItem("katalog_sort") || "newest"
  );
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem("katalog_step", step);
  }, [step]);

  useEffect(() => {
    localStorage.setItem("katalog_category", JSON.stringify(selectedCategory));
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem("katalog_brand", JSON.stringify(selectedBrand));
  }, [selectedBrand]);

  useEffect(() => {
    localStorage.setItem("katalog_sort", sortBy);
  }, [sortBy]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesRes, brandsRes, productsRes] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("brands").select("*").order("name"),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (brandsRes.error) throw brandsRes.error;
      if (productsRes.error) throw productsRes.error;

      // Tags & product_tags tidak blocking — gagal pun produk tetap tampil
      let tagsData = [];
      let productTagsData = [];
      try {
        const [tagsRes, productTagsRes] = await Promise.all([
          supabase.from("tags").select("*").order("name"),
          supabase.from("product_tags").select("*"),
        ]);
        if (!tagsRes.error) tagsData = tagsRes.data || [];
        if (!productTagsRes.error) productTagsData = productTagsRes.data || [];
      } catch (_) {
        // Tags tidak tersedia, lanjut tanpa tags
      }

      const productIds = productsRes.data.map(p => p.id);
      let specs = [], images = [];

      if (productIds.length) {
        const [specsRes, imagesRes] = await Promise.all([
          supabase.from("product_specs").select("*").in("product_id", productIds),
          supabase.from("product_images").select("*").in("product_id", productIds),
        ]);
        if (!specsRes.error) specs = specsRes.data || [];
        if (!imagesRes.error) images = imagesRes.data || [];
      }

      const productTagsMap = {};
      productTagsData.forEach(pt => {
        if (!productTagsMap[pt.product_id]) productTagsMap[pt.product_id] = [];
        productTagsMap[pt.product_id].push(pt);
      });

      const enriched = productsRes.data.map(p => ({
        ...p,
        brands: brandsRes.data.find(b => b.id === p.brand_id) || null,
        categories: categoriesRes.data.find(c => c.id === p.category_id) || null,
        product_specs: specs.filter(s => s.product_id === p.id),
        product_images: images.filter(i => i.product_id === p.id),
        product_tags: productTagsMap[p.id] || [],
      }));

      setCategories(categoriesRes.data || []);
      setBrands(brandsRes.data || []);
      setAllTags(tagsData);
      setProducts(enriched);
    } catch (err) {
      console.error("loadData error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // SESUDAH:
  useEffect(() => {
    if (!modalProduct) return;
    const updated = products.find((p) => p.id === modalProduct.id);
    if (updated && updated !== modalProduct) setModalProduct(updated);
  }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const channel = supabase
      .channel("katalog-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "product_specs" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "brands" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "tags" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "product_tags" }, () => loadData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [loadData]);

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-12 px-3">
        <div className="max-w-7xl mx-auto">
          <SkeletonGrid />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-2">Gagal memuat data</p>
          <button onClick={loadData} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Daftar Harga Laptop Second Update Setiap Hari | Solit 03
        </title>

        <meta
          name="description"
          content="Cari laptop second bergaransi? Lihat katalog laptop Solit 03 dengan harga update setiap hari. Cocok untuk kuliah, kerja, coding, desain hingga gaming."
        />

        <meta
          name="keywords"
          content="katalog laptop second, harga laptop second, laptop murah depok, laptop bekas bergaransi"
        />

        <link
          rel="canonical"
          href="https://solit03.com/katalog"
        />
      </Helmet>
      
      {step === "welcome" && <WelcomeScreen onStart={() => setStep("category")} />}
      {step === "category" && (
        <CategoryScreen
          categories={categories}
          onSelect={cat => { setSelectedCategory(cat); setStep("products"); }}
          onSkip={() => { setSelectedCategory(null); setStep("products"); }}
        />
      )}
      {step === "products" && (
        <ProductScreen
          products={products} categories={categories} brands={brands} allTags={allTags}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
          sortBy={sortBy} setSortBy={setSortBy}
          onBack={() => setStep("category")}
          onOpenModal={setModalProduct}
        />
      )}
      {modalProduct && <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} allTags={allTags} />}
    </>
  );
}