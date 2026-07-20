import { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, 
  Headphones, 
  Truck, 
  BadgeCheck, 
  Handshake,
  Sparkles
} from "lucide-react";

export default function Services() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const services = [
    { icon: BadgeCheck, title: "Quality Control", desc: "Teruji & Terpercaya" },
    { icon: Handshake, title: "Harga Kompetitif", desc: "Sesuai kantong" },
    { icon: Headphones, title: "Support 24 Jam", desc: "Fast response" },
    { icon: ShieldCheck, title: "Garansi Unit", desc: "1 bulan resmi" },
    { icon: Truck, title: "Gratis Ongkir", desc: "Jabodetabek" }
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
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white">

      {/* Title */}
      <div className="text-center mb-12 md:mb-16">
        <span className="eyebrow">
          <Sparkles className="w-3.5 h-3.5" />
          LAYANAN
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-5">
          Layanan <span className="text-blue-600">Setiap Hari</span>
        </h2>
        <p className="text-sm md:text-base text-slate-500 mt-4 max-w-2xl mx-auto">
          Dukungan menyeluruh untuk pengalaman belanja laptop yang aman dan nyaman.
        </p>
      </div>

      {/* Services Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-5 max-w-5xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {services.map((service, index) => (
          <div
            key={index}
            className="group card-3d p-5 text-center"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Icon */}
            <div className="w-14 h-14 mx-auto bg-slate-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-50 transition-colors duration-300">
              <service.icon className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
            </div>

            {/* Title */}
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-500">
              {service.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}