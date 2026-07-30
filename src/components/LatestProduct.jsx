import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Laptop, Clock, TrendingUp, Sparkles, ArrowRight, Zap, ShieldCheck, Flame } from "lucide-react";
import { supabase } from "../services/supabase";
import { isNewProduct } from "../utils/dateUtils";

// Enhanced Skeleton Component with Shimmer Effect
function ProductSkeleton() {
  return (
    <div className="card-3d overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      <div className="bg-slate-50 p-6 pt-8">
        <div className="flex justify-center items-center py-4">
          <div className="h-32 sm:h-36 md:h-40 w-40 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
      <div className="p-5 pt-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-3 w-14 bg-slate-200 rounded-full"></div>
          <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
          <div className="h-3 w-12 bg-slate-200 rounded-full"></div>
        </div>
        <div className="h-5 bg-slate-200 rounded w-3/4 mx-auto mb-3"></div>
        <div className="flex justify-center gap-1.5 mt-2 mb-3">
          <div className="h-2.5 w-14 bg-slate-200 rounded"></div>
          <div className="w-1 h-1 bg-slate-200 rounded-full mt-1"></div>
          <div className="h-2.5 w-12 bg-slate-200 rounded"></div>
        </div>
        <div className="text-center mt-3">
          <div className="h-6 bg-slate-200 rounded w-28 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState({});
  const sectionRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          brands(id, name),
          categories(id, name),
          product_specs(
            processor,
            ram,
            storage,
            gpu,
            display
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (productsError) throw productsError;

      const formattedProducts = (productsData || []).map((product) => {
        const specs = product.product_specs?.[0] || {};
        
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          thumbnail: product.thumbnail,
          price: product.price,
          normal_price: product.normal_price,
          discount_percent: product.discount_percent,
          is_promo: product.is_promo,
          stock: product.stock,
          brand: product.brands?.name || "Laptop",
          category: product.categories?.name || "Laptop",
          processor: specs.processor || "-",
          ram: specs.ram || "-",
          storage: specs.storage || "-",
          created_at: product.created_at,
        };
      });

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const subscription = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = entry.target.getAttribute('data-index');
              setVisibleItems(prev => ({ ...prev, [index]: true }));
            }
          });
        },
        { threshold: 0.2, triggerOnce: true }
      );

      const cards = document.querySelectorAll('.product-card');
      cards.forEach((card) => observer.observe(card));

      return () => {
        cards.forEach((card) => observer.unobserve(card));
      };
    }
  }, [loading, products]);

  const formatPrice = (price) => {
    return `Rp ${(price || 0).toLocaleString('id-ID')}`;
  };

  const handleProductClick = (slug) => {
    window.location.href = `/katalog?product=${slug}`;
  };

  return (
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-slate-50 overflow-hidden">
      {/* Subtle decorative orb */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Title Section */}
      <div className="relative text-center mb-12 md:mb-16">
        {/* Eyebrow */}
        <span className="eyebrow">
          <Zap className="w-3.5 h-3.5" />
          Koleksi Terbaru
        </span>

        {/* Main Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-5">
          Produk <span className="text-shimmer">Terbaru</span>
        </h2>

        {/* Subtitle with dynamic loading indicator */}
        <p className="text-sm md:text-base text-slate-500 mt-4 max-w-2xl mx-auto">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              Memuat produk terbaru...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {products.length} Produk terbaru dengan kualitas premium
            </span>
          )}
        </p>
      </div>

      {/* Grid Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
        {loading ? (
          <>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        ) : products.length === 0 ? (
          <div className="col-span-3 text-center py-20">
            <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-5">
              <ShoppingBag size={44} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium text-lg">Belum ada produk</p>
            <p className="text-sm text-slate-400 mt-2">Tambah produk di halaman admin</p>
          </div>
        ) : (
          products.map((item, index) => (
            <div
              key={item.id}
              data-index={index}
              className={`product-card transition-all duration-700
                ${visibleItems[index]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
                }`}
              style={{ transitionDelay: `${index * 120}ms`, transitionTimingFunction: 'cubic-bezier(0.2, 0.9, 0.4, 1.1)' }}
            >
            <div
              className="group card-3d overflow-hidden cursor-pointer h-full"
              onClick={() => handleProductClick(item.slug)}
            >
              {/* Image Section */}
              <div className="relative bg-slate-50 p-6 pt-8 rounded-t-2xl overflow-hidden">
                {/* Promo Badge */}
                {item.is_promo && item.discount_percent > 0 && (
                  <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[12px] font-bold px-2.5 py-1 rounded-full shadow-soft-sm">
                    -{item.discount_percent}%
                  </div>
                )}

                {/* New Badge (otomatis hilang setelah 3 hari) */}
                {isNewProduct(item.created_at, 3) && (
                  <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-[12px] font-bold px-2.5 py-1 rounded-full shadow-soft-sm flex items-center gap-1.5">
                    <Sparkles size={10} />
                    <span>BARU</span>
                  </div>
                )}

                {/* Product Image */}
                <div className="relative flex justify-center items-center py-4">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="relative h-32 sm:h-36 md:h-44 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative h-32 sm:h-36 md:h-44 w-44 bg-slate-100 rounded-2xl flex items-center justify-center">
                      <Laptop size={52} className="text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Floating Discount Tag */}
                {item.is_promo && item.discount_percent > 0 && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[11px] font-semibold px-3 py-0.5 rounded-full whitespace-nowrap shadow-soft-sm z-10 inline-flex items-center gap-1">
                    <Flame className="w-3 h-3" aria-hidden="true" /> Hemat {item.discount_percent}%
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="relative p-5 pt-4 bg-white">
                {/* Brand & Category */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {item.brand}
                  </span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Title with line-clamp */}
                <h3 className="font-bold text-base sm:text-lg text-slate-900 text-center group-hover:text-blue-600 transition-colors duration-300 line-clamp-1 px-2">
                  {item.name}
                </h3>

                {/* Specs */}
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 mt-2">
                  {item.processor !== "-" && (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.processor.split(' ').slice(0, 2).join(' ')}
                    </span>
                  )}
                  {item.ram !== "-" && (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.ram}
                    </span>
                  )}
                  {item.storage !== "-" && (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.storage}
                    </span>
                  )}
                </div>

                {/* Price Section */}
                <div className="text-center mt-4 pt-3 border-t border-slate-100">
                  {item.is_promo && item.normal_price && item.normal_price > item.price ? (
                    <>
                      <p className="text-blue-600 font-bold text-xl sm:text-2xl">
                        {formatPrice(item.price)}
                      </p>
                      <p className="text-xs text-slate-400 line-through mt-0.5">
                        {formatPrice(item.normal_price)}
                      </p>
                    </>
                  ) : (
                    <p className="text-blue-600 font-bold text-xl sm:text-2xl">
                      {formatPrice(item.price)}
                    </p>
                  )}
                </div>

                {/* Hover Action Indicator */}
                <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="btn btn-primary py-1.5 px-4 text-xs">
                    <span>Lihat Detail</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
            </div>
          ))
        )}
      </div>

      {/* View All Button - Premium CTA */}
      {!loading && products.length > 0 && (
        <div className="text-center mt-14">
          <button
            onClick={() => window.location.href = '/katalog'}
            className="btn btn-primary group px-8 py-3 text-sm"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
          <p className="text-xs text-slate-400 mt-3">Dapatkan harga spesial untuk member</p>
        </div>
      )}
    </section>
  );
}