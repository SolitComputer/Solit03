import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Laptop, Clock } from "lucide-react";
import { supabase } from "../services/supabase";

// Loading Skeleton Component
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      {/* Image Section Skeleton */}
      <div className="bg-gradient-to-br from-gray-50 to-white p-4 pt-5">
        <div className="flex justify-center items-center py-2">
          <div className="h-28 sm:h-32 md:h-36 w-36 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Content Section Skeleton - teks skeleton juga ikut membesar */}
      <div className="p-3 pt-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-3 w-12 bg-gray-200 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
          <div className="h-3 w-10 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="flex justify-center gap-1 mt-2 mb-2">
          <div className="h-2 w-12 bg-gray-200 rounded"></div>
          <div className="w-1 h-1 bg-gray-200 rounded-full mt-0.5"></div>
          <div className="h-2 w-10 bg-gray-200 rounded"></div>
          <div className="w-1 h-1 bg-gray-200 rounded-full mt-0.5"></div>
          <div className="h-2 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="text-center mt-3">
          <div className="h-5 bg-gray-200 rounded w-24 mx-auto"></div>
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
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-10 md:py-12 bg-white">
      {/* Title Section - Teks diperbesar */}
      <div className="text-center mb-8 md:mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-6 h-6 text-blue-600" /> {/* Ikon diperbesar */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            Produk <span className="text-blue-700">Terbaru</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1"> {/* Deskripsi lebih besar */}
          {loading ? "Memuat produk..." : `${products.length} Produk terbaru dari Solit 03`}
        </p>
      </div>

      {/* Grid Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
        {loading ? (
          <>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        ) : products.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag size={32} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">Belum ada produk</p>
            <p className="text-xs text-gray-300 mt-1">Tambah produk di halaman admin</p>
          </div>
        ) : (
          products.map((item, index) => (
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
                {/* Promo Badge - teks diperbesar */}
                {item.is_promo && item.discount_percent > 0 && (
                  <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    -{item.discount_percent}%
                  </div>
                )}

                {/* New Badge - teks diperbesar */}
                <div className="absolute top-2 left-2 z-10 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                  <Clock size={10} /> {/* Ikon lebih besar */}
                  <span>BARU</span>
                </div>

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
                      <Laptop size={36} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Discount Tag */}
                {item.is_promo && item.discount_percent > 0 && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                    Hemat {item.discount_percent}%
                  </div>
                )}
              </div>

              {/* Content Section - teks diperbesar */}
              <div className="p-3 pt-4">
                {/* Brand & Category */}
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-[10px] sm:text-xs text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                    {item.brand}
                  </span>
                  <span className="text-[10px] text-gray-300">•</span>
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    {item.category}
                  </span>
                </div>

                {/* Title - lebih besar */}
                <h3 className="font-semibold text-sm sm:text-base text-gray-800 text-center group-hover:text-blue-700 transition-colors line-clamp-1">
                  {item.name}
                </h3>

                {/* Spec - lebih besar */}
                <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-1.5 line-clamp-1">
                  {item.processor !== "-" && `${item.processor} • `}
                  {item.ram !== "-" && `${item.ram} • `}
                  {item.storage !== "-" && item.storage}
                </p>

                {/* Price - lebih besar */}
                <div className="text-center mt-2">
                  {item.is_promo && item.normal_price && item.normal_price > item.price ? (
                    <>
                      <p className="text-blue-700 font-bold text-base sm:text-lg">
                        {formatPrice(item.price)}
                      </p>
                      <p className="text-[10px] text-gray-400 line-through">
                        {formatPrice(item.normal_price)}
                      </p>
                    </>
                  ) : (
                    <p className="text-blue-700 font-bold text-base sm:text-lg">
                      {formatPrice(item.price)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}