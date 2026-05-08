import { useState, useEffect, useRef } from "react";
import { Quote } from "lucide-react";
import founderImg from "../assets/reinaldy.webp";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15, triggerOnce: true }
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
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white overflow-hidden">

      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Title Section */}
      <div className="text-center mb-8 md:mb-10 relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-blue-100/50 backdrop-blur-sm rounded-full px-2.5 py-0.5 mb-3">
          <span className="text-[9px] sm:text-[10px] text-blue-700 font-medium">TENTANG KAMI</span>
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Solit Hadir Untuk <span className="text-blue-700">Memajukan Teknologi</span>
        </h2>
        <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-2 rounded-full"></div>
        <p className="text-[10px] sm:text-xs text-gray-500 mt-2 max-w-md mx-auto">
          Berkomitmen menghadirkan laptop berkualitas dengan harga terjangkau
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">

          {/* Image Section */}
          <div className={`flex-1 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative group">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-2 shadow-md">
                <img
                  src={founderImg}
                  alt="Reinaldy Olyvierd Sendouw - Founder Solit"
                  className="rounded-lg w-full object-cover shadow-sm"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Quote Section */}
          <div className={`flex-1 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-5 sm:p-6 md:p-7 shadow-xl">

              {/* Quote Icon */}
              <div className="absolute -top-3 -left-1 text-blue-300 opacity-20">
                <Quote className="w-12 h-12" />
              </div>

              <div className="relative z-10">
                <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed mb-4 italic text-justify">
                  "Menjadikan Solit sebagai perusahaan berkelanjutan yang tidak hanya menghadirkan akses teknologi melalui produk laptop berkualitas dengan harga terjangkau, tetapi juga menjadi wadah kebaikan yang memberikan dampak sosial, ekonomi, dan edukasi jangka panjang bagi masyarakat dan peradaban."
                </p>

                <div className="border-t border-blue-500/30 pt-3 mt-1">
                  <p className="text-blue-100 font-semibold text-xs sm:text-sm">
                    Reinaldy Olyvierd Sendouw
                  </p>
                  <p className="text-blue-300 text-[10px] sm:text-xs mt-0.5">
                    CEO & Founder Solit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}