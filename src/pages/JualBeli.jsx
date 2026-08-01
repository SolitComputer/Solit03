import { useState, useEffect } from "react";
import { Banknote, Building2, Laptop } from "lucide-react";
import Tabs from "../components/jualbeli/Tabs";
import StepCard from "../components/jualbeli/StepCard";
import Gallery from "../components/jualbeli/Gallery";
import { tabData } from "../components/data/jualBeliData";
import { Helmet } from "react-helmet-async";

const WHATSAPP_NUMBER = "6285210647047";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function JualBeli() {
  const [activeTab, setActiveTab] = useState("jual");
  const [isVisible, setIsVisible] = useState({
    hero: false,
    tabs: false,
    step: false,
    button: false,
    gallery: false,
  });
  const data = tabData[activeTab];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.2, triggerOnce: true }
    );

    const sections = ["hero", "tabs", "step", "button", "gallery"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const getWhatsAppMessage = () => {
    switch (activeTab) {
      case "jual":
        return "Halo Solit 03, saya ingin menjual laptop saya. Berikut detailnya:";
      case "lelang":
        return "Halo Solit 03, saya ingin melelang barang kantor. Berikut daftar asetnya:";
      case "sewa":
        return "Halo Solit 03, saya ingin menyewa laptop. Apakah ada stok yang tersedia?";
      default:
        return "Halo Solit 03, saya butuh informasi lebih lanjut.";
    }
  };

  const handleWhatsApp = () => {
    const message = getWhatsAppMessage();
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>
          Jual & Beli Laptop Second | Solit 03
        </title>

        <meta
          name="description"
          content="Mau jual atau beli laptop second? Solit 03 menerima jual beli laptop bekas dengan proses aman, cepat dan transparan."
        />

        <link
          rel="canonical"
          href="https://solit03.com/jual-beli"
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <style>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
              }
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-8px); }
          }
          .animate-fadeSlideUp { animation: fadeSlideUp 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards; }
          .animate-scaleIn { animation: scaleIn 0.4s ease-out forwards; }
          .animate-float { animation: float 4s ease-in-out infinite; }
          .shimmer-text {
            background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%);
            background-size: 200% auto;
            animation: shimmer 2s linear infinite;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            }
            `}</style>

          {/* Hero Section - Premium Design */}
          <section
            id="hero"
            className={`text-center mb-10 md:mb-12 transition-all duration-700 ${isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {/* Decorative Badge */}
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-4 shadow-soft-sm">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span className="text-[10px] font-semibold text-blue-700 tracking-wider uppercase">
                Solusi Terpercaya
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-content">Solusi Laptop & </span>
              <span className="text-blue-600">
                Aset Kantor
              </span>
              <br />
              <span className="text-content">Kamu</span>
            </h1>

            {/* Subtitle with Animation */}
            <div className="mt-4">
              <p className="text-content-muted text-sm sm:text-base md:text-lg">
                Jadi Cuan di{" "}
                <span className="relative inline-block">
                  <span className="absolute inset-x-0 bottom-0 h-2 bg-blue-200/50 rounded-full -z-10"></span>
                  <span className="font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                    Solit 03
                  </span>
                </span>
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-blue-600 rounded-full" />
              <div className="w-2 h-0.5 bg-blue-500 rounded-full" />
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-transparent rounded-full" />
            </div>

            {/* Floating Icon Decoration */}
            <div className="absolute left-4 top-20 opacity-20 hidden lg:block animate-float">
              <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="absolute right-4 bottom-20 opacity-20 hidden lg:block animate-float" style={{ animationDelay: "2s" }}>
              <svg className="w-10 h-10 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </section>

          {/* Tabs - Premium Design */}
          <div
            id="tabs"
            className={`transition-all duration-500 delay-100 ${isVisible.tabs ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
          >
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* StepCard - Premium Design */}
          <div
            id="step"
            className={`mt-8 md:mt-10 transition-all duration-500 delay-200 ${isVisible.step ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            <div key={activeTab} className="animate-fadeSlideUp">
              <StepCard title={data.title} desc={data.desc} steps={data.steps} />
            </div>
          </div>

          {/* Tombol Hubungi Admin - Premium WhatsApp Button */}
          <div
            id="button"
            className={`text-center my-8 md:my-10 transition-all duration-500 delay-300 ${isVisible.button ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
          >
            {/* Background Glow Effect */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-green-400/40 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition duration-500"></div>

              <button
                onClick={handleWhatsApp}
                className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full text-sm font-medium text-white bg-green-500 hover:bg-green-600 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 overflow-hidden"
              >
                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                <svg className="relative w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.032 2.001c-5.514 0-10 4.486-10 10 0 1.78.469 3.452 1.283 4.899L2 21.999l5.225-1.312c1.39.794 3.002 1.253 4.713 1.253 5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.5c-1.657 0-3.236-.448-4.618-1.277l-.338-.195-3.125.785.84-3.077-.208-.347c-.891-1.449-1.363-3.113-1.363-4.889 0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5z" />
                  <path d="M16.75 13.45c-.26-.13-1.54-.76-1.78-.85s-.41-.13-.59.13c-.18.26-.69.85-.85 1.02s-.31.2-.56.07c-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.13-.13.26-.33.39-.5.13-.17.18-.28.27-.47.09-.19.05-.36-.02-.5s-.59-1.42-.81-1.95c-.21-.52-.43-.45-.59-.46s-.31-.01-.48-.01c-.18 0-.47.07-.71.33-.24.26-.91.89-.91 2.16 0 1.27.93 2.5 1.06 2.67.13.17 1.83 2.79 4.43 3.91.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.07-.1-.26-.16-.52-.26z" />
                </svg>

                <span className="relative font-semibold inline-flex items-center gap-1.5">
                  {activeTab === "jual" && <><Banknote className="w-4 h-4" aria-hidden="true" /> Jual Laptop Sekarang</>}
                  {activeTab === "lelang" && <><Building2 className="w-4 h-4" aria-hidden="true" /> Lelang Aset Kantor</>}
                  {activeTab === "sewa" && <><Laptop className="w-4 h-4" aria-hidden="true" /> Sewa Laptop Sekarang</>}
                </span>

                <svg
                  className="relative w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Contact Info with Icon */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-3 w-px bg-slate-300"></div>
              <p className="text-[11px] text-content-muted">
                Atau hubungi langsung:
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-green-600 hover:text-green-700 font-medium hover:underline transition"
              >
                +62 852-1064-7047
              </a>
              <div className="h-3 w-px bg-slate-300"></div>
            </div>
          </div>

          {/* Gallery - Premium Design */}
          <div
            id="gallery"
            className={`mt-8 md:mt-10 transition-all duration-500 delay-400 ${isVisible.gallery ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            <div className="relative">
              {/* Decorative Title for Gallery */}
              <div className="text-center mb-6">
                <h3 className="text-sm font-semibold text-content-muted uppercase tracking-wider">
                  Galeri Produk
                </h3>
                <div className="flex justify-center gap-1 mt-1">
                  <div className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-transparent rounded-full"></div>
                  <div className="w-6 h-0.5 bg-gradient-to-r from-transparent to-blue-400 rounded-full"></div>
                </div>
              </div>

              <div key={activeTab} className="animate-fadeSlideUp">
                <Gallery images={data.images} />
              </div>
            </div>
          </div>

          {/* Bottom Decorative Element */}
          <div className="flex justify-center mt-10">
            <div className="flex gap-1.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-blue-300 opacity-40"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}