import { useState, useEffect, useRef } from "react";
import { Image } from "lucide-react";

// Ambil semua gambar dari folder assets/laptop secara otomatis
const laptopImages = import.meta.glob("../assets/laptop/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const showcases = Object.entries(laptopImages)
  // Urutkan berdasarkan angka pada nama file (1.png, 2.png, ... 10.png)
  .sort(([a], [b]) => {
    const na = parseInt(a.match(/(\d+)\.\w+$/)?.[1] ?? 0, 10);
    const nb = parseInt(b.match(/(\d+)\.\w+$/)?.[1] ?? 0, 10);
    return na - nb;
  })
  .map(([, img]) => ({ img }));

export default function Promo() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
      className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-slate-50"
    >
      {/* Title */}
      <div className="text-center mb-12 md:mb-16">
        <span className="eyebrow">
          <Image className="w-3.5 h-3.5" />
          KOLEKSI POSTER LAPTOP
        </span>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-5">
          Showcase <span className="text-blue-600">Laptop</span>
        </h2>

        <p className="text-sm md:text-base text-slate-500 mt-4 max-w-2xl mx-auto">
          Beberapa koleksi laptop pilihan dari Solit03 dengan desain modern,
          performa terbaik, dan kualitas yang siap menemani aktivitas harianmu.
        </p>
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
            <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-soft-sm hover:shadow-soft transition-all duration-300">
              <img
                src={item.img}
                alt={item.title}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all duration-300" />
            </div>

            {/* Title */}
            <p className="text-center text-sm sm:text-base font-medium text-slate-500 mt-2 group-hover:text-slate-900 transition-colors">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}