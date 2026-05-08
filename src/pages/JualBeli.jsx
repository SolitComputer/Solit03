import { useState, useEffect } from "react";
import Tabs from "../components/jualbeli/Tabs";
import StepCard from "../components/jualbeli/StepCard";
import Gallery from "../components/jualbeli/Gallery";
import { tabData } from "../components/data/jualBeliData";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 bg-white">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeSlideUp { animation: fadeSlideUp 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>

      {/* Hero Section - Compact */}
      <section
        id="hero"
        className={`text-center mb-6 md:mb-8 transition-all duration-500 ${
          isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          Solusi Laptop & Aset Kantor Kamu
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-1">
          Jadi Cuan di{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-semibold">
            Solit 03
          </span>
        </p>
        <div className="w-10 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mt-2 rounded-full" />
      </section>

      {/* Tabs - Compact */}
      <div
        id="tabs"
        className={`transition-all duration-500 delay-100 ${
          isVisible.tabs ? "opacity-100 scale-100" : "opacity-0 scale-98"
        }`}
      >
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* StepCard - Compact */}
      <div
        id="step"
        className={`mt-5 md:mt-6 transition-all duration-500 delay-200 ${
          isVisible.step ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div key={activeTab} className="animate-fadeSlideUp">
          <StepCard title={data.title} desc={data.desc} steps={data.steps} />
        </div>
      </div>

      {/* Tombol Hubungi Admin - Compact WhatsApp Button */}
      <div
        id="button"
        className={`text-center my-6 md:my-8 transition-all duration-500 delay-300 ${
          isVisible.button ? "opacity-100 scale-100" : "opacity-0 scale-98"
        }`}
      >
        <button
          onClick={handleWhatsApp}
          className="group relative inline-flex items-center gap-1.5 px-5 sm:px-6 py-2 rounded-full text-xs font-medium text-white bg-gradient-to-r from-green-500 to-green-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/30"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
          <svg className="relative w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.032 2.001c-5.514 0-10 4.486-10 10 0 1.78.469 3.452 1.283 4.899L2 21.999l5.225-1.312c1.39.794 3.002 1.253 4.713 1.253 5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.5c-1.657 0-3.236-.448-4.618-1.277l-.338-.195-3.125.785.84-3.077-.208-.347c-.891-1.449-1.363-3.113-1.363-4.889 0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5z"/>
            <path d="M16.75 13.45c-.26-.13-1.54-.76-1.78-.85s-.41-.13-.59.13c-.18.26-.69.85-.85 1.02s-.31.2-.56.07c-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.13-.13.26-.33.39-.5.13-.17.18-.28.27-.47.09-.19.05-.36-.02-.5s-.59-1.42-.81-1.95c-.21-.52-.43-.45-.59-.46s-.31-.01-.48-.01c-.18 0-.47.07-.71.33-.24.26-.91.89-.91 2.16 0 1.27.93 2.5 1.06 2.67.13.17 1.83 2.79 4.43 3.91.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.07-.1-.26-.16-.52-.26z"/>
          </svg>
          <span className="relative text-xs">
            {activeTab === "jual" && "Jual Laptop Sekarang"}
            {activeTab === "lelang" && "Lelang Aset Kantor"}
            {activeTab === "sewa" && "Sewa Laptop Sekarang"}
          </span>
          <svg
            className="relative w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <p className="text-[10px] text-gray-400 mt-2">
          Atau hubungi langsung: <span className="font-mono">+62 852-1064-7047</span>
        </p>
      </div>

      {/* Gallery - Compact */}
      <div
        id="gallery"
        className={`transition-all duration-500 delay-400 ${
          isVisible.gallery ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div key={activeTab} className="animate-fadeSlideUp">
          <Gallery images={data.images} />
        </div>
      </div>
    </div>
  );
}