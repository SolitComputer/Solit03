import { useState, useEffect, useRef } from "react";
import { Image } from "lucide-react";
import promo1 from "../assets/promo11.jpeg";
import promo2 from "../assets/promo22.jpeg";
import promo3 from "../assets/promo33.jpeg";
import promo4 from "../assets/promo44.jpeg";
import promo5 from "../assets/promo55.jpeg";
import promo6 from "../assets/promo66.jpeg";

export default function Promo() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const showcases = [
    { img: promo1, title: "Dell Latitude 3310 2in1" },
    { img: promo2, title: "Laptop Business Series" },
    { img: promo3, title: "Laptop Siap Kuliah" },
    { img: promo4, title: "Laptop Gaming Pilihan" },
    { img: promo5, title: "Laptop Tipis & Elegan" },
    { img: promo6, title: "Best Performance Laptop" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8 py-10 md:py-12 bg-white"
    >
      {/* Title */}
      <div className="text-center mb-8 md:mb-10">
        <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-0.5 mb-3">
          <Image className="w-2.5 h-2.5 text-gray-500" />
          <span className="text-[9px] text-gray-600 font-medium tracking-wide">
            KOLEKSI POSTER LAPTOP
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-gray-900">
          Showcase <span className="font-semibold text-gray-900">Laptop</span>
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Beberapa koleksi laptop pilihan dari Solit03 dengan desain modern,
          performa terbaik, dan kualitas yang siap menemani aktivitas harianmu.
        </p>

        <div className="w-10 h-0.5 bg-gray-300 mx-auto mt-3 rounded-full" />
      </div>

      {/* Grid */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto transition-all duration-700 ${isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
          }`}
      >
        {showcases.map((item, index) => (
          <div
            key={index}
            className="group cursor-pointer"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            {/* Image */}
            <div className="relative rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <img
                src={item.img}
                alt={item.title}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
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