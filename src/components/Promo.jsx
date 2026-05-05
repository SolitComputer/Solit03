import { useState, useEffect, useRef } from "react";
import { Tag, Sparkles } from "lucide-react";
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
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-white">
      
      {/* Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 rounded-full px-3 py-1 mb-3">
          <Tag className="w-3 h-3 text-blue-600" />
          <span className="text-[10px] text-blue-700 font-medium">PROMO</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Promo <span className="text-blue-700">Bulan Oktober</span>
        </h2>
        <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Grid Promo */}
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {promos.map((item, index) => (
          <div
            key={index}
            className="group cursor-pointer"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            {/* Image Container */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <img
                src={item.img}
                alt={item.title}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Discount Badge */}
              <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {item.discount}
              </div>
            </div>
            
            {/* Title */}
            <p className="text-center text-xs text-gray-600 mt-2 group-hover:text-blue-700 transition-colors">
              {item.title}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}