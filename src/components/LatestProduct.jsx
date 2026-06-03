import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Laptop, Clock, TrendingUp, Sparkles, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { supabase } from "../services/supabase";

// Enhanced Skeleton Component with Shimmer Effect
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 pt-8">
        <div className="flex justify-center items-center py-4">
          <div className="h-32 sm:h-36 md:h-40 w-40 bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl"></div>
        </div>
      </div>
      <div className="p-5 pt-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-3 w-14 bg-gray-200 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
          <div className="h-3 w-12 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
        <div className="flex justify-center gap-1.5 mt-2 mb-3">
          <div className="h-2.5 w-14 bg-gray-200 rounded"></div>
          <div className="w-1 h-1 bg-gray-200 rounded-full mt-1"></div>
          <div className="h-2.5 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="text-center mt-3">
          <div className="h-6 bg-gray-200 rounded w-28 mx-auto"></div>
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
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/30 to-gray-50/50 overflow-hidden">
      {/* Enhanced Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Title Section - Premium with Glassmorphism */}
      <div className="relative text-center mb-14 md:mb-16">
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm rounded-full px-4 py-1.5 mb-6">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-medium text-gray-700">Koleksi Terbaru</span>
        </div>

        {/* Main Title with Animated Underline */}
        <div className="relative inline-block">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-gray-900">Produk </span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent relative">
              Terbaru
              <svg className="absolute -bottom-2 left-0 w-full h-1" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 3 C30 0, 70 6, 100 3 C130 0, 170 6, 200 3" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6"/>
                    <stop offset="100%" stopColor="#6366F1"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          
          {/* Decorative Sparkle */}
          <div className="absolute -top-4 -right-8 hidden sm:block">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
          </div>
        </div>

        {/* Subtitle with dynamic loading indicator */}
        <p className="text-sm text-gray-500 mt-5 max-w-md mx-auto">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              Memuat produk terbaru...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
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
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <ShoppingBag size={44} className="text-gray-400" />
              </div>
            </div>
            <p className="text-gray-500 font-medium text-lg">Belum ada produk</p>
            <p className="text-sm text-gray-400 mt-2">Tambah produk di halaman admin</p>
          </div>
        ) : (
          products.map((item, index) => (
            <div
              key={item.id}
              data-index={index}
              className={`product-card group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-700 overflow-hidden cursor-pointer
                ${visibleItems[index]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
                }`}
              style={{ transitionDelay: `${index * 120}ms`, transitionTimingFunction: 'cubic-bezier(0.2, 0.9, 0.4, 1.1)' }}
              onClick={() => handleProductClick(item.slug)}
            >
              {/* Premium Gradient Border with Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm group-hover:blur-md"></div>
              <div className="absolute inset-[2px] bg-white rounded-2xl transition-all duration-500"></div>
              
              {/* Image Section with Shine Effect */}
              <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 pt-8 rounded-t-2xl overflow-hidden">
                {/* Shine overlay on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
                
                {/* Promo Badge - Premium with Glow */}
                {item.is_promo && item.discount_percent > 0 && (
                  <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[12px] font-bold px-2.5 py-1 rounded-full shadow-lg animate-pulse ring-1 ring-white/20">
                    -{item.discount_percent}%
                  </div>
                )}

                {/* New Badge - Enhanced */}
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[12px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                  <Sparkles size={10} className="animate-pulse" />
                  <span>BARU</span>
                </div>

               

                {/* Product Image with Glow and Scale Effect */}
                <div className="relative flex justify-center items-center py-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="relative h-32 sm:h-36 md:h-44 w-auto object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-1 drop-shadow-md"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative h-32 sm:h-36 md:h-44 w-44 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
                      <Laptop size={52} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Floating Discount Tag */}
                {item.is_promo && item.discount_percent > 0 && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[11px] font-semibold px-3 py-0.5 rounded-full whitespace-nowrap shadow-md z-10">
                    🔥 Hemat {item.discount_percent}%
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="relative p-5 pt-4 bg-white">
                {/* Brand & Category */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-full">
                    {item.brand}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-[11px] text-gray-600 bg-gray-50/80 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Title with line-clamp */}
                <h3 className="font-bold text-base sm:text-lg text-gray-800 text-center group-hover:text-blue-700 transition-colors duration-300 line-clamp-1 px-2">
                  {item.name}
                </h3>

                {/* Specs with improved styling */}
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 mt-2">
                  {item.processor !== "-" && (
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {item.processor.split(' ').slice(0, 2).join(' ')}
                    </span>
                  )}
                  {item.ram !== "-" && (
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {item.ram}
                    </span>
                  )}
                  {item.storage !== "-" && (
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {item.storage}
                    </span>
                  )}
                </div>

                {/* Price Section with better hierarchy */}
                <div className="text-center mt-4 pt-3 border-t border-gray-100">
                  {item.is_promo && item.normal_price && item.normal_price > item.price ? (
                    <>
                      <p className="text-blue-700 font-bold text-xl sm:text-2xl">
                        {formatPrice(item.price)}
                      </p>
                      <p className="text-xs text-gray-400 line-through mt-0.5">
                        {formatPrice(item.normal_price)}
                      </p>
                    </>
                  ) : (
                    <p className="text-blue-700 font-bold text-xl sm:text-2xl">
                      {formatPrice(item.price)}
                    </p>
                  )}
                </div>

                {/* Hover Action Indicator - Enhanced */}
                <div className="absolute left-0 right-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-blue-600 text-white text-xs font-semibold py-1.5 px-4 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-blue-700 transition-colors">
                    <span>Lihat Detail</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </button>
          <p className="text-xs text-gray-400 mt-3">Dapatkan harga spesial untuk member</p>
        </div>
      )}
    </section>
  );
}