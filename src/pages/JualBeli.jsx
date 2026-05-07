import { useState, useEffect } from "react";
import Tabs from "../components/jualbeli/Tabs";
import StepCard from "../components/jualbeli/StepCard";
import Gallery from "../components/jualbeli/Gallery";
import { tabData } from "../components/data/jualBeliData";

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

  // Animasi scroll reveal pertama kali
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 bg-white overflow-hidden">
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeSlideUp {
          animation: fadeSlideUp 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out forwards;
        }
      `}</style>

      {/* Hero Section */}
      <section
        id="hero"
        className={`text-center mb-14 md:mb-20 transition-all duration-700 ${
          isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
          Solusi Laptop Lama Kamu
        </h1>
        <p className="text-gray-500 text-lg md:text-xl mt-4 font-light">
          Jadi Cuan di{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-semibold">
            Solit 03
          </span>
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mt-6 rounded-full" />
      </section>

      {/* Tabs */}
      <div
        id="tabs"
        className={`transition-all duration-700 delay-100 ${
          isVisible.tabs ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* StepCard dengan animasi saat ganti tab */}
      <div
        id="step"
        className={`transition-all duration-700 delay-200 ${
          isVisible.step ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div key={activeTab} className="animate-fadeSlideUp">
          <StepCard title={data.title} desc={data.desc} steps={data.steps} />
        </div>
      </div>

      {/* Tombol Hubungi Admin */}
      <div
        id="button"
        className={`text-center my-12 md:my-16 transition-all duration-700 delay-300 ${
          isVisible.button ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <button className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative">Hubungi Admin</span>
          <svg
            className="relative w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Gallery dengan animasi saat ganti tab */}
      <div
        id="gallery"
        className={`transition-all duration-700 delay-400 ${
          isVisible.gallery ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div key={activeTab} className="animate-fadeSlideUp">
          <Gallery images={data.images} />
        </div>
      </div>
    </div>
  );
}