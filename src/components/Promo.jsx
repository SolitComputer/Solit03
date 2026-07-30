import { useState, useEffect, useRef } from "react";
import { Image } from "lucide-react";
import { getPromoImages } from "../services/siteContent";
import { DEFAULT_SHOWCASE_IMAGES } from "../utils/defaultShowcaseImages";

export default function Promo() {
  const [isVisible, setIsVisible] = useState(false);
  const [showcases, setShowcases] = useState(DEFAULT_SHOWCASE_IMAGES);
  const sectionRef = useRef(null);

  useEffect(() => {
    getPromoImages()
      .then((data) => { if (data.length) setShowcases(data); })
      .catch(() => {});
  }, []);

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

  if (showcases.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-surface-muted"
    >
      {/* Title */}
      <div className="text-center mb-12 md:mb-16">
        <span className="eyebrow">
          <Image className="w-3.5 h-3.5" />
          KOLEKSI POSTER LAPTOP
        </span>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-content mt-5">
          Showcase <span className="text-blue-600">Laptop</span>
        </h2>

        <p className="text-sm md:text-base text-content-muted mt-4 max-w-2xl mx-auto">
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
            key={item.id}
            className="group cursor-pointer"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden bg-surface border border-border shadow-soft-sm hover:shadow-soft transition-all duration-300">
              <img
                src={item.image_url}
                alt={item.title || "Laptop Solit 03"}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all duration-300" />
            </div>

            {/* Title */}
            {item.title && (
              <p className="text-center text-sm sm:text-base font-medium text-content-muted mt-2 group-hover:text-content transition-colors">
                {item.title}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
