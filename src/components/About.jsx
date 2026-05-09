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

      {/* Title Section - Teks diperbesar */}
      <div className="text-center mb-8 md:mb-10 relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-blue-100/50 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
          <span className="text-xs sm:text-sm text-blue-700 font-medium">TENTANG KAMI</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Solit Hadir Untuk <span className="text-blue-700">Memajukan Teknologi</span>
        </h2>
        <div className="w-16 h-0.5 bg-blue-600 mx-auto mt-3 rounded-full"></div>
        <p className="text-xs sm:text-sm text-gray-500 mt-3 max-w-md mx-auto">
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

          {/* Quote Section - Teks diperbesar */}
          <div className={`flex-1 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-6 sm:p-7 md:p-8 shadow-xl">

              {/* Quote Icon - lebih besar */}
              <div className="absolute -top-4 -left-2 text-blue-300 opacity-20">
                <Quote className="w-16 h-16" />
              </div>

              <div className="relative z-10">
                <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed mb-5 italic text-justify">
                  "Menjadikan Solit sebagai perusahaan berkelanjutan yang tidak hanya menghadirkan akses teknologi melalui produk laptop berkualitas dengan harga terjangkau, tetapi juga menjadi wadah kebaikan yang memberikan dampak sosial, ekonomi, dan edukasi jangka panjang bagi masyarakat dan peradaban."
                </p>

                <div className="border-t border-blue-500/30 pt-4 mt-2">
                  <p className="text-blue-100 font-semibold text-sm sm:text-base">
                    Reinaldy Olyvierd Sendouw
                  </p>
                  <p className="text-blue-300 text-xs sm:text-sm mt-1">
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