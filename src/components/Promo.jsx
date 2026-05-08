import { useState, useEffect, useRef } from "react";
import { Tag } from "lucide-react";
import promo1 from "../assets/promo1.webp";
import promo2 from "../assets/promo2.webp";
import promo3 from "../assets/promo3.webp";
import promo4 from "../assets/promo4.webp";
import promo5 from "../assets/promo5.webp";
import promo6 from "../assets/promo6.webp";

export default function Promo() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const promos = [
    { img: promo1, title: "Back to School", discount: "20%" },
    { img: promo2, title: "Weekend Sale", discount: "15%" },
    { img: promo3, title: "Flash Deal", discount: "30%" },
    { img: promo4, title: "Member Day", discount: "25%" },
    { img: promo5, title: "Cashback", discount: "200K" },
    { img: promo6, title: "Free Aksesoris", discount: "Bundle" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, triggerOnce: true }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-10 md:py-12 bg-white">

      {/* Title */}
      <div className="text-center mb-8 md:mb-10">
        <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-0.5 mb-3">
          <Tag className="w-2.5 h-2.5 text-gray-500" />
          <span className="text-[9px] text-gray-600 font-medium tracking-wide">PROMO TERBATAS</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-gray-900">
          Promo <span className="font-semibold text-gray-900">Bulan Ini</span>
        </h2>
        <div className="w-10 h-0.5 bg-gray-300 mx-auto mt-2 rounded-full" />
      </div>

      {/* Grid Promo */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {promos.map((item, index) => (
          <div
            key={index}
            className="group cursor-pointer"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            {/* Image Container */}
            <div className="relative rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <img
                src={item.img}
                alt={item.title}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Discount Badge */}
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded shadow-sm">
                {item.discount}
              </div>
            </div>

            {/* Title */}
            <p className="text-center text-xs sm:text-sm font-medium text-gray-500 mt-2 group-hover:text-gray-900 transition-colors">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}