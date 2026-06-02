import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight, Shield, Truck, Clock, Star, Zap, Award, Sparkles } from "lucide-react";
import bgHero from "../assets/background.jpg";
import solitLogo from "../assets/solit03.jpeg";

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setIsVisible(true), 100);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleViewCatalog = () => {
        navigate('/katalog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleWhatsApp = () => {
        const phoneNumber = "6285210647047";
        const message = "Halo Solit 03, saya tertarik dengan laptopnya. Apakah ada yang bisa dibantu?";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const testimonials = [];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // ========== LOADING SCREEN - DESAIN PREMIUM ==========
    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden">
                {/* Animated background blobs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 -left-32 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 -right-32 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-300" />
                    
                    {/* Floating particles */}
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-gray-300 rounded-full animate-float"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${4 + Math.random() * 6}s`,
                                opacity: Math.random() * 0.5,
                            }}
                        />
                    ))}
                </div>

                {/* Main loading content */}
                <div className="relative z-10 text-center px-4 transform transition-all duration-500 scale-100">
                    {/* Logo dengan efek rotating ring */}
                    <div className="relative mb-8 mx-auto w-28 h-28 md:w-36 md:h-36">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-spin-slow blur-sm" />
                        <div className="absolute inset-1 rounded-full bg-white" />
                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center overflow-hidden shadow-xl">
                            <img 
                                src={solitLogo} 
                                alt="Solit 03 Logo" 
                                className="w-full h-full object-cover animate-pulse scale-110"
                            />
                        </div>
                        {/* Pulse rings */}
                        <div className="absolute -inset-2 rounded-full border-2 border-blue-200/40 animate-ping-slow" />
                        <div className="absolute -inset-4 rounded-full border border-indigo-200/30 animate-ping-slow delay-500" />
                    </div>

                    {/* Teks brand dengan gradien */}
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-2 tracking-tight">
                        Solit 03
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base font-light tracking-wide mb-6">
                        Premium Laptop Solution
                    </p>

                    {/* Loading bar premium */}
                    <div className="w-64 md:w-80 mx-auto mb-6">
                        <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full animate-loading-bar" />
                        </div>
                    </div>

                    {/* Loading dots */}
                    <div className="flex justify-center gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div 
                                key={i} 
                                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>

                    {/* Brand quote */}
                    <p className="text-gray-300 text-[10px] mt-6 tracking-[0.2em] font-mono">
                        QUALITY • TRUST • INNOVATION
                    </p>
                </div>
            </div>
        );
    }

    // ========== HERO SECTION - DESAIN MODERN ==========
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with overlay lebih hidup */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${bgHero})` }}
            />
            
            {/* Gradient overlays yang lebih smooth */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
            
            {/* Efek cahaya dinamis */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-700" />
            
            {/* Floating particles yang lebih halus */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(25)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-slow"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${8 + Math.random() * 12}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 z-10 text-center">
                <div className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    
                    {/* Badge premium dengan efek glassmorphism */}
                    <div className="flex justify-center animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                            <span className="text-xs sm:text-sm text-white font-medium tracking-wide">
                                ✨ Premium Quality Since 2020
                            </span>
                        </div>
                    </div>

                    {/* Judul dengan gradien lebih mencolok */}
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                            <span className="bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                                Solit 03
                            </span>
                        </h1>
                        
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                            <p className="relative text-lg sm:text-xl md:text-2xl text-blue-100 font-light tracking-wide">
                                Solusi Laptop Second Berkualitas
                            </p>
                        </div>
                    </div>

                    {/* Deskripsi dengan backdrop blur */}
                    <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed backdrop-blur-sm bg-black/20 rounded-2xl px-6 py-3">
                        Temukan laptop second berkualitas dengan garansi resmi. Performa seperti baru, harga terjangkau. Dapatkan sekarang juga!
                    </p>

                    {/* CTA Buttons dengan efek modern */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
                        <button
                            onClick={handleViewCatalog}
                            className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 font-semibold overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative">Lihat Katalog</span>
                            <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>

                        <button
                            onClick={handleWhatsApp}
                            className="group bg-white/10 backdrop-blur-md border border-white/30 text-white text-sm sm:text-base px-8 py-3.5 rounded-xl transition-all duration-300 hover:bg-white hover:text-blue-700 hover:scale-105 flex items-center justify-center gap-2 font-semibold"
                        >
                            <span>Hubungi Kami</span>
                            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </button>
                    </div>

                    {/* Trust Indicators dengan ikon dan efek hover */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                        {[
                            { icon: Shield, label: "Garansi 1 Tahun", color: "text-blue-300" },
                            { icon: Truck, label: "Free Antar Sejabodetabek", color: "text-green-300" },
                            { icon: Clock, label: "Service Center", color: "text-yellow-300" },
                            { icon: Award, label: "Berpengalaman >5 Tahun", color: "text-purple-300" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md rounded-xl px-3 py-2.5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                                <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                                <span className="text-xs text-white/90 font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Live Testimonial Ticker (tetap sama, hanya styling diperbaiki) */}
                    <div className="pt-6">
                        {/* Konten testimonial tetap seperti semula (kosong) */}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ========== CSS ANIMATIONS (tidak mengubah logika, hanya style) ==========
const styles = `
    @keyframes spin-slow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    @keyframes ping-slow {
        0% { transform: scale(0.8); opacity: 0.6; }
        100% { transform: scale(2); opacity: 0; }
    }
    @keyframes loading-bar {
        0% { width: 0%; left: 0%; }
        50% { width: 80%; left: 10%; }
        100% { width: 100%; left: 0%; }
    }
    @keyframes float {
        0% { transform: translateY(0px) translateX(0px); opacity: 0; }
        50% { transform: translateY(-40px) translateX(20px); opacity: 0.6; }
        100% { transform: translateY(0px) translateX(0px); opacity: 0; }
    }
    @keyframes float-slow {
        0% { transform: translateY(0px) translateX(0px); }
        50% { transform: translateY(-30px) translateX(15px); }
        100% { transform: translateY(0px) translateX(0px); }
    }
    @keyframes bounce-delay {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-spin-slow { animation: spin-slow 4s linear infinite; }
    .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
    .animate-loading-bar { animation: loading-bar 1.8s ease-in-out infinite; }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
    .animate-bounce { animation: bounce-delay 1s ease-in-out infinite; }
    .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
    .delay-500 { animation-delay: 500ms; }
    .delay-700 { animation-delay: 700ms; }
    .delay-300 { animation-delay: 300ms; }
`;

if (typeof document !== 'undefined') {
    if (!document.querySelector('#hero-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'hero-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}