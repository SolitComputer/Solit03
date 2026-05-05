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
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-white">
      
      {/* Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 rounded-full px-3 py-1 mb-3">
          <Sparkles className="w-3 h-3 text-blue-600" />
          <span className="text-[10px] text-blue-700 font-medium">LAYANAN</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Layanan <span className="text-blue-700">Setiap Hari</span>
        </h2>
        <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Services Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {services.map((service, index) => (
          <div
            key={index}
            className="group text-center"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Icon */}
            <div className="w-14 h-14 mx-auto bg-gray-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-50 transition-all duration-300 group-hover:scale-110">
              <service.icon className="w-6 h-6 text-gray-700 group-hover:text-blue-700 transition-colors" />
            </div>
            
            {/* Title */}
            <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors mb-1">
              {service.title}
            </h3>
            
            {/* Description */}
            <p className="text-[10px] text-gray-500">
              {service.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}   