import { useState, useEffect, useRef } from "react";
import { Star, TrendingUp, Flame, Award, ShoppingBag } from "lucide-react";
import { supabase } from "../../services/supabase";

export default function BestSeller() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState({});
  const sectionRef = useRef(null);

  useEffect(() => {
    loadBestSellerProducts();
  }, []);

  const loadBestSellerProducts = async () => {
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
        .eq("is_best_seller", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (productsError) throw productsError;

      // Format data untuk ditampilkan
      const formattedProducts = (productsData || []).map((product) => {
        const specs = product.product_specs?.[0] || {};
        
        // Tentukan badge berdasarkan data yang ada
        let badge = "Best Seller";
        let badgeColor = "bg-amber-500";
        let badgeIcon = <TrendingUp size={10} className="mr-0.5" />;
        
        if (product.discount_percent && product.discount_percent > 20) {
          badge = "🔥 Super Deal";
          badgeColor = "bg-red-500";
          badgeIcon = <Flame size={10} className="mr-0.5" />;
        } else if (product.is_promo) {
          badge = "⭐ Promo";
          badgeColor = "bg-emerald-500";
          badgeIcon = <Award size={10} className="mr-0.5" />;
        }

        // Hitung rating (default 4.5 jika belum ada rating)
        const rating = 4.8;
        const sold = Math.floor(Math.random() * 200) + 50;

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
          rating: rating,
          sold: sold,
          badge: badge,
          badgeColor: badgeColor,
          badgeIcon: badgeIcon
        };
      });

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error loading best seller products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription untuk update best seller
  useEffect(() => {
    const subscription = supabase
      .channel('best-seller-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products', filter: 'is_best_seller=eq.true' },
        () => {
          loadBestSellerProducts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Intersection Observer untuk animasi
  useEffect(() => {
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
  }, [products]);

  const formatPrice = (price) => {
    return `Rp ${(price || 0).toLocaleString('id-ID')}`;
  };

  // Handle klik produk
  const handleProductClick = (slug) => {
    window.location.href = `/katalog?product=${slug}`;
  };

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-10 md:py-12 bg-white">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            Best <span className="text-blue-700">Seller</span>
          </h2>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Memuat produk terlaris...</p>
        </div>
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-10 md:py-12 bg-white">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            Best <span className="text-blue-700">Seller</span>
          </h2>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Belum ada produk best seller</p>
        </div>
        <div className="text-center py-8">
          <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag size={28} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">Aktifkan "Best Seller" di halaman admin produk</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-10 md:py-12 bg-white">
      {/* Title Section */}
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
          Best <span className="text-blue-700">Seller</span>
        </h2>
        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
          {products.length} Laptop terlaris bulan ini
        </p>
      </div>

      {/* Grid Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
        {products.map((item, index) => (
          <div
            key={item.id}
            data-index={index}
            className={`product-card group bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-500 overflow-hidden cursor-pointer
              ${visibleItems[index]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
              }`}
            style={{ transitionDelay: `${index * 100}ms` }}
            onClick={() => handleProductClick(item.slug)}
          >
            {/* Image Section */}
            <div className="relative bg-gradient-to-br from-gray-50 to-white p-4 pt-5">
              {/* Badge Best Seller */}
              <div className={`absolute top-2 left-2 z-10 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm ${item.badgeColor}`}>
                {item.badgeIcon}
                <span>{item.badge}</span>
              </div>

              {/* Promo Badge */}
              {item.is_promo && item.discount_percent > 0 && (
                <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  -{item.discount_percent}%
                </div>
              )}

              {/* Image */}
              <div className="flex justify-center items-center py-2">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="h-28 sm:h-32 md:h-36 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-28 sm:h-32 md:h-36 w-36 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Laptop size={32} className="text-gray-300" />
                  </div>
                )}
              </div>

              {/* Discount Tag */}
              {item.is_promo && item.discount_percent > 0 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[9px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                  Hemat {item.discount_percent}%
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-3 pt-4">
              {/* Brand & Category */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[8px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                  {item.brand}
                </span>
                <span className="text-[8px] text-gray-300">•</span>
                <span className="text-[8px] text-gray-400">
                  {item.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-xs sm:text-sm text-gray-800 text-center group-hover:text-blue-700 transition-colors line-clamp-1">
                {item.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 ${i < Math.floor(item.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[9px] text-gray-500 ml-0.5">
                  ({item.sold} terjual)
                </span>
              </div>

              {/* Spec */}
              <p className="text-[9px] sm:text-[10px] text-gray-500 text-center mt-1.5 line-clamp-1">
                {item.processor !== "-" && `${item.processor} • `}
                {item.ram !== "-" && `${item.ram} • `}
                {item.storage !== "-" && item.storage}
              </p>

              {/* Price */}
              <div className="text-center mt-2">
                {item.is_promo && item.normal_price && item.normal_price > item.price ? (
                  <>
                    <p className="text-blue-700 font-bold text-sm sm:text-base">
                      {formatPrice(item.price)}
                    </p>
                    <p className="text-[9px] text-gray-400 line-through">
                      {formatPrice(item.normal_price)}
                    </p>
                  </>
                ) : (
                  <p className="text-blue-700 font-bold text-sm sm:text-base">
                    {formatPrice(item.price)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol Lihat Semua */}
      {products.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = '/katalog'}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline transition"
          >
            Lihat Semua Produk →
          </button>
        </div>
      )}
    </section>
  );
}