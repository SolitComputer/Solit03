import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Shield, Truck, Clock, Award, Sparkles } from "lucide-react";
import bgHero from "../assets/background.webp";
import solitLogo from "../assets/solit03.jpeg";
import InteractiveBackground from "./ui/InteractiveBackground";

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setIsVisible(true), 100);
        }, 1600);
        return () => clearTimeout(timer);
    }, []);

    const handleViewCatalog = () => {
        navigate('/katalog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleWhatsApp = () => {
        const phoneNumber = "6285210647047";
        const message = "Halo Solit 03, saya tertarik dengan laptopnya. Apakah ada yang bisa dibantu?";
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // ========== LOADING SCREEN — minimalis ==========
    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 -left-32 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 -right-32 w-80 h-80 bg-blue-50 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 text-center px-4">
                    <div className="relative mb-7 mx-auto w-24 h-24 md:w-28 md:h-28">
                        <div className="absolute -inset-2 rounded-full border border-blue-200/60 animate-ping-slow" />
                        <div className="relative w-full h-full rounded-full overflow-hidden shadow-soft-lg ring-1 ring-slate-200">
                            <img src={solitLogo} alt="Solit 03" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-1">
                        Solit<span className="text-blue-600">03</span>
                    </h2>
                    <p className="text-slate-400 text-sm font-light tracking-wide mb-6">
                        Solusi Laptop Second Berkualitas
                    </p>

                    <div className="w-56 md:w-64 mx-auto h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full animate-loading-bar" />
                    </div>
                </div>
            </div>
        );
    }

    // ========== HERO ==========
    const trust = [
        { icon: Shield, label: "Garansi 1 Bulan" },
        { icon: Truck, label: "Gratis Antar Jabodetabek" },
        { icon: Clock, label: "Service Cepat & Rapi" },
        { icon: Award, label: "Tepercaya Sejak 2020" },
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Foto brand sebagai tekstur dasar */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none"
                style={{ backgroundImage: `url(${bgHero})` }}
            />
            {/* Overlay gelap — jaga keterbacaan teks */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-900/70 to-slate-900/95 pointer-events-none" />
            {/* Jaring partikel interaktif — menghindar dari kursor */}
            <InteractiveBackground className="pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Content */}
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 text-center">
                <div className={`space-y-7 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

                    {/* Badge */}
                    <div className="flex justify-center">
                        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/15 text-xs sm:text-sm text-white/90 font-medium">
                            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                            Tepercaya Sejak 2020
                        </span>
                    </div>

                    {/* Title */}
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
                            Solit<span className="text-shimmer">03</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-slate-200 font-light">
                            Laptop Second Rasa Baru, Harga Bersahabat
                        </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Setiap unit lolos quality control dan bergaransi resmi. Performa ngebut
                        untuk kuliah, kerja, hingga gaming — tanpa bikin dompet menjerit.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <motion.button
                            onClick={handleViewCatalog}
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            className="btn btn-primary px-8 py-3.5 text-sm sm:text-base group"
                        >
                            Lihat Katalog
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </motion.button>
                        <motion.button
                            onClick={handleWhatsApp}
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            className="btn px-8 py-3.5 text-sm sm:text-base text-white bg-white/10 backdrop-blur-md border border-white/25 hover:bg-white hover:text-slate-900 group"
                        >
                            Hubungi Kami
                            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </motion.button>
                    </div>

                    {/* Trust indicators */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8">
                        {trust.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-center gap-2 bg-white/[0.07] backdrop-blur-md rounded-xl px-3 py-3 border border-white/10 hover:bg-white/[0.12] hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <item.icon className="w-4.5 h-4.5 text-blue-300 shrink-0" />
                                <span className="text-xs text-white/90 font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ========== Hero-only keyframes ==========
const styles = `
    @keyframes ping-slow {
        0% { transform: scale(0.9); opacity: 0.5; }
        100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes loading-bar {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
    .animate-loading-bar { animation: loading-bar 1.4s ease-in-out infinite; }
`;

if (typeof document !== 'undefined' && !document.querySelector('#hero-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'hero-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}
