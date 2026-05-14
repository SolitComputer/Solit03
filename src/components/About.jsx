import { useState, useEffect, useRef } from "react";
import { Quote, Sparkles, Shield, Heart, Target, Star, Award, ArrowRight } from "lucide-react";
import founderImg from "../assets/reinaldy.webp";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [

  ];

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
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-hidden">
      
      {/* Premium Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50/30" />
      
      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Title Section */}
      <div className="text-center mb-12 md:mb-16 relative z-10">
        {/* Our Story Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full px-4 py-1.5 mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span className="text-[11px] font-semibold text-blue-700 tracking-wider uppercase">
            Our Story
          </span>
        </div>

        

        {/* Elegant Separator */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-blue-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-blue-300"></div>
        </div>

        {/* Main Title */}
        <div className="relative inline-block">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-gray-900">Solit Hadir Untuk </span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Memajukan Teknologi
            </span>
          </h2>
          
          {/* Decorative Star */}
          <div className="absolute -top-2 -right-6 hidden sm:block">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Elegant Underline */}
        <div className="flex justify-center gap-1.5 mt-6">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-blue-600 rounded-full" />
          <div className="w-2 h-0.5 bg-blue-500 rounded-full" />
          <div className="w-2 h-0.5 bg-indigo-500 rounded-full" />
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-transparent rounded-full" />
        </div>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-gray-500 mt-4 max-w-2xl mx-auto">
          Berkomitmen menghadirkan laptop berkualitas dengan harga terjangkau 
          untuk mendukung kemajuan digital Indonesia
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

          {/* Image Section */}
          <div className={`flex-1 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500" />
              
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-2 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition duration-500" />
                
                <img
                  src={founderImg}
                  alt="Reinaldy Olyvierd Sendouw - Founder Solit"
                  className="rounded-xl w-full object-cover shadow-md group-hover:scale-[1.02] transition-all duration-500"
                  loading="lazy"
                />
                
                {/* Founder Badge */}
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-lg px-3 py-1.5">
                  <p className="text-white text-xs font-medium">Founder & CEO</p>
                </div>
              </div>

              {/* Stats Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-3 hidden lg:block animate-float">
                <div className="flex items-center gap-2">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="text-center px-2">
                      <stat.icon className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                      <p className="text-[10px] text-gray-500">{stat.label.split(' ')[0]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quote Section */}
          <div className={`flex-1 transition-all duration-700 delay-200 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="relative">
              {/* Animated Gradient Border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500" />
              
              {/* Quote Card */}
              <div className="relative bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 sm:p-7 md:p-8 shadow-2xl overflow-hidden">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                </div>

                {/* Quote Icons */}
                <div className="absolute -top-3 -left-3 text-white/10">
                  <Quote className="w-20 h-20" />
                </div>
                <div className="absolute -bottom-3 -right-3 text-white/5 rotate-180">
                  <Quote className="w-16 h-16" />
                </div>

                {/* Quote Content */}
                <div className="relative z-10">
                  {/* Rating Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed mb-6 italic font-light">
                    "Menjadikan Solit sebagai perusahaan berkelanjutan yang tidak hanya menghadirkan akses teknologi melalui produk laptop berkualitas dengan harga terjangkau, tetapi juga menjadi wadah kebaikan yang memberikan dampak sosial, ekonomi, dan edukasi jangka panjang bagi masyarakat dan peradaban."
                  </p>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-start">
                      <div className="bg-gradient-to-r from-white/20 to-transparent px-4 py-2 -mt-3">
                        <div className="w-12 h-0.5 bg-white/40 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="mt-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">RS</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm sm:text-base">
                          Reinaldy Olyvierd Sendouw
                        </p>
                        <p className="text-blue-200 text-xs sm:text-sm mt-0.5 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          CEO & Founder Solit
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="mt-5 flex items-center gap-2 text-white/40 text-[10px]">
                    <Shield className="w-3 h-3" />
                    <span>Vision • Mission • Impact</span>
                  </div>
                </div>
              </div>

              {/* Mobile Stats */}
              <div className="lg:hidden mt-6 bg-white rounded-xl shadow-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {stats.map((stat, idx) => (
                    <div key={idx}>
                      <stat.icon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-[10px] text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Element */}
      <div className="relative z-10 flex justify-center mt-12">
        <div className="flex gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-40 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// CSS Animations
const styles = `
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(-15px) translateX(8px); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .animate-float-slow {
    animation: float-slow 7s ease-in-out infinite;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-gradient {
    background-size: 200% auto;
    animation: gradient 3s ease infinite;
  }
`;

if (typeof document !== 'undefined') {
  if (!document.querySelector('#about-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'about-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
}