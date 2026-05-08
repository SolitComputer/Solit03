import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";
import laptop1 from "../assets/thinkpad.jpg";
import laptop2 from "../assets/hp_elite.webp";
import laptop3 from "../assets/laptop_dell.jpg";

export default function BestSeller() {
  const [visibleItems, setVisibleItems] = useState({});
  const sectionRef = useRef(null);

  const products = [
    {
      img: laptop1,
      name: "ThinkPad X395",
      spec: "Ryzen 7 • 8GB • 512GB",
      price: "Rp 3.950.000",
      originalPrice: "Rp 5.200.000",
      badge: "Best Seller",
      rating: 4.9,
      sold: 234
    },
    {
      img: laptop2,
      name: "HP EliteBook 840",
      spec: "i5 • 8GB • 256GB",
      price: "Rp 3.250.000",
      originalPrice: "Rp 4.800.000",
      badge: "Hot Item",
      rating: 4.8,
      sold: 187
    },
    {
      img: laptop3,
      name: "Dell Latitude 3410",
      spec: "i7 • 16GB • 256GB",
      price: "Rp 4.150.000",
      originalPrice: "Rp 6.500.000",
      badge: "Recommended",
      rating: 4.9,
      sold: 156
    }
  ];

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
  }, []);

  const getDiscount = (price, originalPrice) => {
    const priceNum = parseInt(price.replace(/[^0-9]/g, ''));
    const originalNum = parseInt(originalPrice.replace(/[^0-9]/g, ''));
    return Math.round((1 - priceNum / originalNum) * 100);
  };

  return (
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-10 md:py-12 bg-white">

      {/* Title Section */}
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
          Best <span className="text-blue-700">Seller</span>
        </h2>
        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
          3 Laptop terlaris bulan ini
        </p>
      </div>

      {/* Grid Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
        {products.map((item, index) => (
          <div
            key={index}
            data-index={index}
            className={`product-card group bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-500 overflow-hidden
              ${visibleItems[index]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
              }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >

            {/* Image Section */}
            <div className="relative bg-gray-50 p-4 pt-5">

              {/* Badge */}
              <div className={`absolute top-2 left-2 z-10 text-white text-[9px] font-medium px-1.5 py-0.5 rounded ${item.badge === "Best Seller" ? "bg-amber-500" :
                  item.badge === "Hot Item" ? "bg-orange-500" : "bg-emerald-500"
                }`}>
                {item.badge}
              </div>

              {/* Image */}
              <div className="flex justify-center items-center py-2">
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-28 sm:h-32 md:h-36 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Discount Tag */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap">
                Hemat {getDiscount(item.price, item.originalPrice)}%
              </div>
            </div>

            {/* Content Section */}
            <div className="p-3 pt-4">

              {/* Title & Rating */}
              <div className="text-center">
                <h3 className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-blue-700 transition-colors">
                  {item.name}
                </h3>

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
                  <span className="text-[9px] text-gray-500 ml-0.5">({item.sold})</span>
                </div>
              </div>

              {/* Spec */}
              <p className="text-[9px] sm:text-[10px] text-gray-500 text-center mt-1.5">
                {item.spec}
              </p>

              {/* Price */}
              <div className="text-center mt-2">
                <p className="text-blue-700 font-bold text-sm sm:text-base">
                  {item.price}
                </p>
                <p className="text-[9px] text-gray-400 line-through">
                  {item.originalPrice}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}