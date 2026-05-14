import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Laptop, Clock, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "../services/supabase";

// Loading Skeleton Component - Premium Design
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse shadow-sm">
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
          <div className="w-1 h-1 bg-gray-200 rounded-full mt-1"></div>
          <div className="h-2.5 w-14 bg-gray-200 rounded"></div>
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
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gradient-to-b from-white to-gray-50/50">
      {/* Decorative Background Elements */}
      <div className="absolute left-0 right-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Title Section - Premium Design */}
      <div className="text-center mb-12 md:mb-14">
        {/* Badge */}
       

        {/* Main Title */}
        <div className="relative inline-block">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            <span className="text-gray-900">Produk </span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Terbaru
            </span>
          </h2>
          
          {/* Decorative Sparkle */}
          <div className="absolute -top-2 -right-6 hidden sm:block">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Underline Decoration */}
        <div className="flex justify-center gap-1.5 mt-3">
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          <div className="w-2 h-0.5 bg-blue-400 rounded-full"></div>
          <div className="w-2 h-0.5 bg-indigo-400 rounded-full"></div>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mt-3">
          {loading ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 animate-spin" />
              Memuat produk...
            </span>
          ) : (
            `${products.length} Produk terbaru dengan kualitas terbaik`
          )}
        </p>
      </div>

      {/* Grid Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        {loading ? (
          <>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        ) : products.length === 0 ? (
          <div className="col-span-3 text-center py-16">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <ShoppingBag size={40} className="text-gray-400" />
              </div>
            </div>
            <p className="text-gray-500 font-medium">Belum ada produk</p>
            <p className="text-xs text-gray-400 mt-1">Tambah produk di halaman admin</p>
          </div>
        ) : (
          products.map((item, index) => (
            <div
              key={item.id}
              data-index={index}
              className={`product-card group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer
                ${visibleItems[index]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => handleProductClick(item.slug)}
            >
              {/* Gradient Border on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10"></div>
              <div className="absolute inset-[1px] bg-white rounded-2xl transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-blue-50/50 group-hover:to-white"></div>
              
              {/* Image Section */}
              <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 pt-8 rounded-t-2xl">
                {/* Promo Badge - Premium */}
                {item.is_promo && item.discount_percent > 0 && (
                  <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white text-[11px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                    -{item.discount_percent}%
                  </div>
                )}

                {/* New Badge - Premium */}
                <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[11px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Clock size={10} />
                  <span>BARU</span>
                </div>

                {/* Image with Glow Effect */}
                <div className="relative flex justify-center items-center py-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="relative h-32 sm:h-36 md:h-40 w-auto object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative h-32 sm:h-36 md:h-40 w-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                      <Laptop size={48} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Discount Floating Tag */}
                {item.is_promo && item.discount_percent > 0 && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[11px] font-medium px-3 py-0.5 rounded-full whitespace-nowrap shadow-md">
                    🔥 Hemat {item.discount_percent}%
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="relative p-5 pt-4">
                {/* Brand & Category */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                    {item.brand}
                  </span>
                  <span className="text-[11px] text-gray-300">•</span>
                  <span className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base sm:text-lg text-gray-800 text-center group-hover:text-blue-700 transition-colors line-clamp-1">
                  {item.name}
                </h3>

                {/* Specs with Icons */}
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {item.processor !== "-" && (
                    <span className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                      {item.processor.split(' ').slice(0, 2).join(' ')}
                    </span>
                  )}
                  {item.ram !== "-" && (
                    <>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[10px] text-gray-500">{item.ram}</span>
                    </>
                  )}
                  {item.storage !== "-" && (
                    <>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[10px] text-gray-500">{item.storage}</span>
                    </>
                  )}
                </div>

                {/* Price Section */}
                <div className="text-center mt-3 pt-2 border-t border-gray-100">
                  {item.is_promo && item.normal_price && item.normal_price > item.price ? (
                    <>
                      <p className="text-blue-700 font-bold text-lg sm:text-xl">
                        {formatPrice(item.price)}
                      </p>
                      <p className="text-[11px] text-gray-400 line-through">
                        {formatPrice(item.normal_price)}
                      </p>
                    </>
                  ) : (
                    <p className="text-blue-700 font-bold text-lg sm:text-xl">
                      {formatPrice(item.price)}
                    </p>
                  )}
                </div>

                {/* Hover Action Indicator */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1 text-[10px] text-blue-600 font-medium">
                    <span>Lihat Detail</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Button */}
      {!loading && products.length > 0 && (
        <div className="text-center mt-10">
          <button 
            onClick={() => window.location.href = '/katalog'}
            className="group inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      )}
    </section>
  );
}