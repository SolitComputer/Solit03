import { useState, useEffect, useRef } from "react";
import { Quote, Sparkles, Shield, Target, Star } from "lucide-react";
import founderImg from "../assets/reinaldy.webp";
import { getSiteSettings } from "../services/siteContent";

const DEFAULT_ABOUT = {
  eyebrow: "Our Story",
  heading_normal: "Solit Hadir Untuk ",
  heading_accent: "Memajukan Teknologi",
  description: "Berkomitmen menghadirkan laptop berkualitas dengan harga terjangkau untuk mendukung kemajuan digital Indonesia.",
  quote: "Menjadikan Solit sebagai perusahaan berkelanjutan yang tidak hanya menghadirkan akses teknologi melalui produk laptop berkualitas dengan harga terjangkau, tetapi juga menjadi wadah kebaikan yang memberikan dampak sosial, ekonomi, dan edukasi jangka panjang bagi masyarakat dan peradaban.",
  founder_name: "Reinaldy Olyvierd Sendouw",
  founder_role: "CEO & Founder Solit",
  founder_initials: "RS",
  founder_image_url: null,
};

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const sectionRef = useRef(null);

  useEffect(() => {
    getSiteSettings()
      .then((settings) => {
        if (settings.about) setAbout({ ...DEFAULT_ABOUT, ...settings.about });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-hidden bg-surface-muted">
      {/* Subtle decorative orb */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="text-center mb-12 md:mb-16 relative z-10">
        <span className="eyebrow mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          {about.eyebrow}
        </span>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-5">
          <span className="text-content">{about.heading_normal}</span>
          <span className="text-blue-600">{about.heading_accent}</span>
        </h2>

        <div className="flex justify-center items-center gap-2 mt-6">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400 rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-400 rounded-full" />
        </div>

        <p className="text-sm md:text-base text-content-muted mt-6 max-w-2xl mx-auto leading-relaxed">
          {about.description}
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 items-center gap-10 lg:gap-14">

          {/* Image */}
          <div className={`relative w-full transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* aksen gradient di belakang */}
            <div className="absolute -inset-3 bg-gradient-to-tr from-blue-500/15 to-cyan-400/10 rounded-[2rem] blur-2xl pointer-events-none" />

            <div className="relative group rounded-[1.75rem] overflow-hidden shadow-soft-lg ring-1 ring-border/60">
              <img
                src={about.founder_image_url || founderImg}
                alt={`${about.founder_name} - Founder Solit`}
                className="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />

              {/* label founder */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base leading-tight">{about.founder_name}</p>
                  <p className="text-blue-200 text-xs">{about.founder_role}</p>
                </div>
              </div>
            </div>

            {/* Floating badge statistik */}
            <div className="absolute -bottom-5 -right-4 sm:-right-5 bg-surface rounded-2xl shadow-soft-lg border border-border px-4 py-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Shield className="w-5 h-5" />
              </span>
              <div className="leading-tight">
                <p className="text-lg font-bold text-content">Sejak 2020</p>
                <p className="text-[0.7rem] text-content-muted">Tepercaya &amp; berkembang</p>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className={`w-full transition-all duration-700 delay-150 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative bg-slate-900 rounded-[1.75rem] p-7 sm:p-9 shadow-soft-lg overflow-hidden">
              <div className="absolute -top-10 -right-10 w-56 h-56 bg-blue-500/15 rounded-full blur-3xl" />
              <Quote className="absolute top-5 right-6 w-20 h-20 text-white/[0.06]" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-blue-400 text-blue-400" />
                    ))}
                  </div>
                  <span className="text-white/40 text-[0.7rem] uppercase tracking-widest">Visi Kami</span>
                </div>

                <p className="text-slate-100 text-base sm:text-lg md:text-xl leading-relaxed mb-7 font-light">
                  "{about.quote}"
                </p>

                <div className="border-t border-white/10 pt-5 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center shrink-0 ring-2 ring-blue-400/30">
                    <span className="text-white font-bold text-sm">{about.founder_initials}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">
                      {about.founder_name}
                    </p>
                    <p className="text-blue-300 text-xs sm:text-sm mt-0.5 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {about.founder_role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
