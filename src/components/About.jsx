import { useState, useEffect, useRef } from "react";
import { Quote, Award, Users, Heart, ArrowRight, Calendar, MapPin } from "lucide-react";
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
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Title Section */}
      <div className="text-center mb-12 md:mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 bg-blue-100/50 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
          <span className="text-[11px] text-blue-700 font-medium">TENTANG KAMI</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Solit Hadir Untuk <span className="text-blue-700">Memajukan Teknologi</span>
        </h2>
        <div className="w-16 h-0.5 bg-blue-600 mx-auto mt-3 rounded-full"></div>
        <p className="text-xs text-gray-500 mt-3 max-w-md mx-auto">
          Berkomitmen menghadirkan laptop berkualitas dengan harga terjangkau
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
          
          {/* Image Section */}
          <div className={`flex-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="relative group">
              {/* Image Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-3 shadow-xl">
                <img
                  src={founderImg}
                  alt="Reinaldy Olyvierd Sendouw - Founder Solit"
                  className="rounded-xl w-full object-cover shadow-md"
                  loading="lazy"
                />
                
                {/* Badge on Image */}
                <div className="absolute -bottom-3 -right-3 bg-blue-700 text-white px-3 py-1.5 rounded-lg shadow-md">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-medium">Since 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Section */}
          <div className={`flex-1 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 md:p-10 shadow-2xl">
              
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-2 text-blue-300 opacity-20">
                <Quote className="w-16 h-16" />
              </div>
              
              <div className="relative z-10">
                <p className="text-white text-base md:text-lg leading-relaxed mb-6 italic">
                  "Menjadikan Solit sebagai perusahaan berkelanjutan yang tidak hanya menghadirkan akses teknologi melalui produk laptop berkualitas dengan harga terjangkau, tetapi juga menjadi wadah kebaikan yang memberikan dampak sosial, ekonomi, dan edukasi jangka panjang bagi masyarakat dan peradaban."
                </p>

                <div className="border-t border-blue-500/30 pt-4 mt-2">
                  <p className="text-blue-100 font-semibold text-sm">
                    Reinaldy Olyvierd Sendouw
                  </p>
                  <p className="text-blue-300 text-xs mt-1">
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