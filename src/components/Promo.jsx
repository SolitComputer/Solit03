import { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, ZoomIn, X } from "lucide-react";
import poster1 from "../assets/poster 1.png";
import poster2 from "../assets/poster 2.png";
import poster3 from "../assets/poster 3.png";
import poster4 from "../assets/poster 4.png";
import poster5 from "../assets/poster 5.png";
import poster6 from "../assets/poster 6.png";
import poster7 from "../assets/poster 7.png";
import poster8 from "../assets/poster 8.png";

export default function Promo() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const sectionRef = useRef(null);

  // Kalau mau kasih judul per poster, isi di sini. Kalau tidak, biarkan null.
  const showcases = [
    { img: poster1, title: null },
    { img: poster2, title: null },
    { img: poster3, title: null },
    { img: poster4, title: null },
    { img: poster5, title: null },
    { img: poster6, title: null },
    { img: poster7, title: null },
    { img: poster8, title: null },
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

  // Lock scroll saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8 py-10 md:py-12 bg-white"
    >
      {/* Title */}
      <div className="text-center mb-8 md:mb-10">
        <div className="inline-flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1 mb-3">
          <ImageIcon className="w-3 h-3 text-gray-500" />
          <span className="text-[11px] sm:text-xs text-gray-600 font-medium tracking-wide">
            KOLEKSI POSTER LAPTOP
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-gray-900">
          Showcase <span className="font-semibold text-gray-900">Laptop</span>
        </h2>

        <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-lg mx-auto">
          Beberapa koleksi laptop pilihan dari Solit03 dengan desain modern,
          performa terbaik, dan kualitas yang siap menemani aktivitas harianmu.
        </p>

        <div className="w-12 h-0.5 bg-gray-300 mx-auto mt-3 rounded-full" />
      </div>

      {/* Grid */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {showcases.map((item, index) => (
          <div
            key={index}
            className="group cursor-pointer"
            style={{ transitionDelay: `${index * 80}ms` }}
            onClick={() => setSelectedImage(item.img)}
          >
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 ring-1 ring-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <img
                src={item.img}
                alt={`Poster Laptop Solit03 ${index + 1}`}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay + Zoom Icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                  <ZoomIn className="w-4 h-4 text-gray-700" />
                </div>
              </div>
            </div>

            {item.title && (
              <p className="text-center text-sm sm:text-base font-medium text-gray-500 mt-2 group-hover:text-gray-900 transition-colors">
                {item.title}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={selectedImage}
            alt="Poster Laptop Solit03 - preview"
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}