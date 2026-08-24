import { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { getServices } from "../services/siteContent";
import { getServiceIcon } from "../utils/serviceIcons";
import TiltCard from "./ui/TiltCard";
import CursorSpotlight from "./ui/CursorSpotlight";
import SplitText from "./ui/SplitText";

const DEFAULT_SERVICES = [
  { id: "d1", icon: "BadgeCheck", title: "Quality Control", description: "Teruji & Terpercaya" },
  { id: "d2", icon: "Handshake", title: "Harga Kompetitif", description: "Sesuai kantong" },
  { id: "d3", icon: "Headphones", title: "Support 24 Jam", description: "Fast response" },
  { id: "d4", icon: "ShieldCheck", title: "Garansi Unit", description: "1 bulan resmi" },
  { id: "d5", icon: "Truck", title: "Gratis Ongkir", description: "Jabodetabek" },
];

export default function Services() {
  const [isVisible, setIsVisible] = useState(false);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const sectionRef = useRef(null);

  useEffect(() => {
    getServices()
      .then((data) => { if (data.length) setServices(data); })
      .catch(() => {});
  }, []);

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
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-surface">

      {/* Title */}
      <div className="text-center mb-12 md:mb-16">
        <span className="eyebrow">
          <Sparkles className="w-3.5 h-3.5" />
          LAYANAN
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-content mt-5">
          <SplitText as="span" text="Layanan " />
          <span className="text-blue-600">Setiap Hari</span>
        </h2>
        <p className="text-sm md:text-base text-content-muted mt-4 max-w-2xl mx-auto">
          Dukungan menyeluruh untuk pengalaman belanja laptop yang aman dan nyaman.
        </p>
      </div>

      {/* Services Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-5 max-w-5xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {services.map((service, index) => {
          const Icon = getServiceIcon(service.icon);
          return (
            <TiltCard key={service.id} max={8} scale={1.04} className="rounded-2xl h-full">
              <div
                className="group card-3d relative overflow-hidden p-5 text-center h-full"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CursorSpotlight size={280} color="rgba(59,130,246,0.16)" className="z-0" />
                {/* Icon */}
                <div className="relative z-10 w-14 h-14 mx-auto bg-surface-muted dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-content-soft group-hover:bg-blue-600 group-hover:text-white group-hover:-translate-y-0.5 shadow-soft-sm transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="relative z-10 text-sm sm:text-base font-semibold text-content mb-1">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="relative z-10 text-xs sm:text-sm text-content-muted">
                  {service.description}
                </p>
              </div>
            </TiltCard>
          );
        })}
      </div>

    </section>
  );
}
