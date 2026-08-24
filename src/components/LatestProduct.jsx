import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Laptop, Clock, TrendingUp, Sparkles, ArrowRight, Zap, ShieldCheck, Flame } from "lucide-react";
import { supabase } from "../services/supabase";
import { isNewProduct } from "../utils/dateUtils";

// Enhanced Skeleton Component with Shimmer Effect
function ProductSkeleton() {
  return (
    <div className="card-3d overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10"></div>
      <div className="bg-surface-muted dark:bg-slate-800 p-6 pt-8">
        <div className="flex justify-center items-center py-4">
          <div className="h-32 sm:h-36 md:h-40 w-40 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
      <div className="p-5 border-t border-border/70 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-14 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="flex gap-1.5 mt-3">
          <div className="h-4 w-14 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border dark:border-slate-700">
          <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
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
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-surface-muted overflow-hidden">
      {/* Subtle decorative orb */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Title Section — editorial: judul kiri, aksi kanan */}
      <div className="relative max-w-6xl mx-auto mb-10 md:mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
        <div>
          <span className="eyebrow">
            <Zap className="w-3.5 h-3.5" />
            Koleksi Terbaru
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-content mt-5">
            Produk <span className="text-blue-600">Terbaru</span>
          </h2>

          <p className="text-sm md:text-base text-content-muted mt-3 max-w-xl">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                Memuat produk terbaru...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                {products.length} unit terbaru, sudah lolos quality control
              </span>
            )}
          </p>
        </div>

        {/* Link "lihat semua" — desktop */}
        {!loading && products.length > 0 && (
          <button
            onClick={() => (window.location.href = "/katalog")}
            className="group hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 shrink-0"
          >
            Lihat semua katalog
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 bg-blue-50 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
              <ArrowRight className="w-4 h-4 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </span>
          </button>
        )}
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
              <ShoppingBag size={44} className="text-content-muted" />
            </div>
            <p className="text-content-soft font-medium text-lg">Belum ada produk</p>
            <p className="text-sm text-content-muted mt-2">Tambah produk di halaman admin</p>
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
              className="group card-3d overflow-hidden cursor-pointer h-full flex flex-col"
              onClick={() => handleProductClick(item.slug)}
            >
              {/* Image Section */}
              <div className="relative bg-gradient-to-b from-surface-muted to-surface dark:from-slate-800 dark:to-slate-900 p-6 pt-7 overflow-hidden">
                {/* New Badge (otomatis hilang setelah 30 hari) */}
                {isNewProduct(item.created_at, 30) && (
                  <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-soft-sm flex items-center gap-1.5">
                    <Sparkles size={10} />
                    <span>BARU</span>
                  </div>
                )}

                {/* Promo Badge */}
                {item.is_promo && item.discount_percent > 0 && (
                  <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-soft-sm inline-flex items-center gap-1">
                    <Flame className="w-3 h-3" aria-hidden="true" />-{item.discount_percent}%
                  </div>
                )}

                {/* Product Image */}
                <div className="relative flex justify-center items-center py-4">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="relative h-32 sm:h-36 md:h-44 w-auto object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative h-32 sm:h-36 md:h-44 w-44 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                      <Laptop size={52} className="text-slate-300" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content Section — rata kiri */}
              <div className="relative p-5 flex flex-col flex-1 border-t border-border/70 dark:border-slate-700">
                {/* Brand & Category */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full">
                    {item.brand}
                  </span>
                  <span className="text-[11px] text-content-soft dark:text-slate-300 bg-surface-muted dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base sm:text-lg text-content dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 leading-snug">
                  {item.name}
                </h3>

                {/* Specs */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {item.processor !== "-" && (
                    <span className="text-[10px] font-medium text-content-muted bg-surface-muted border border-border px-2 py-0.5 rounded-full">
                      {item.processor.split(' ').slice(0, 2).join(' ')}
                    </span>
                  )}
                  {item.ram !== "-" && (
                    <span className="text-[10px] font-medium text-content-muted bg-surface-muted border border-border px-2 py-0.5 rounded-full">
                      {item.ram}
                    </span>
                  )}
                  {item.storage !== "-" && (
                    <span className="text-[10px] font-medium text-content-muted bg-surface-muted border border-border px-2 py-0.5 rounded-full">
                      {item.storage}
                    </span>
                  )}
                </div>

                {/* Price + CTA footer — selalu tampil */}
                <div className="flex items-end justify-between gap-3 mt-4 pt-4 border-t border-border dark:border-slate-700 mt-auto">
                  <div className="min-w-0">
                    {item.is_promo && item.normal_price && item.normal_price > item.price && (
                      <p className="text-xs text-content-muted line-through leading-none mb-1">
                        {formatPrice(item.normal_price)}
                      </p>
                    )}
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-xl sm:text-2xl leading-none">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
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
          <p className="text-xs text-content-muted mt-3">Dapatkan harga spesial untuk member</p>
        </div>
      )}
    </section>
  );
}