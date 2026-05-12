import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight, Shield, Truck, Clock, Cpu } from "lucide-react";
import bgHero from "../assets/background.jpg";
import solitLogo from "../assets/solit03.jpeg";

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulasi loading
        const timer = setTimeout(() => {
            setIsLoading(false);
            // Trigger animation setelah loading selesai
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

    // Loading Screen Component
    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden">
                {/* Animated Background Patterns - Soft gray */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl animate-pulse delay-700" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-50/50 rounded-full blur-2xl animate-pulse delay-300" />
                    
                    {/* Floating dots - Soft colors */}
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-200 rounded-full animate-float"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>

                {/* Main Loading Content */}
                <div className="relative z-10 text-center px-4">
                    {/* Animated Logo with Image */}
                    <div className="mb-8 relative">
                        {/* Ping effect circles - Soft blue */}
                        <div className="absolute inset-0 animate-ping-slow">
                            <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto blur-xl" />
                        </div>
                        <div className="absolute inset-0 animate-ping-slow delay-300">
                            <div className="w-40 h-40 bg-indigo-50 rounded-full mx-auto blur-xl" />
                        </div>
                        
                        {/* Logo Container */}
                        <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto">
                            {/* Rotating border ring - Blue theme */}
                            <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-spin-slow" />
                            <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin-slow" style={{ animationDuration: '2s' }} />
                            
                            {/* Logo Image */}
                            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-100 shadow-xl">
                                <img 
                                    src={solitLogo} 
                                    alt="Solit 03 Logo" 
                                    className="w-full h-full object-cover animate-pulse"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Loading Text - Dark colors */}
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 animate-pulse">
                        Solit 03
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base mb-3">
                        Loading...
                    </p>
                    
                    {/* Loading dots animation */}
                    <div className="flex justify-center gap-1 mb-8">
                        {[...Array(3)].map((_, i) => (
                            <div 
                                key={i} 
                                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>

                    {/* Loading Bar */}
                    <div className="w-64 md:w-80 mx-auto">
                        <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full animate-loading-bar" />
                        </div>
                    </div>

                    {/* Tips / Trivia Card - Light theme */}
                    <div className="mt-8 max-w-sm mx-auto">
                        
                    </div>
                    
                    {/* Progress percentage */}
                    <p className="text-gray-400 text-[10px] mt-4 tracking-wider font-medium">
                        PREPARING YOUR EXPERIENCE
                    </p>
                </div>

                {/* Brand signature - Light */}
                <div className="absolute bottom-6 left-0 right-0 text-center">
                    
                </div>
            </div>
        );
    }

    return (
        <section
            className="relative min-h-[90vh] flex justify-center overflow-hidden bg-cover bg-center bg-no-repeat pt-12 md:pt-20"
            style={{ backgroundImage: `url(${bgHero})` }}
        >
            {/* Overlay gelap agar teks terbaca */}
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 z-10 text-center">
                <div className={`space-y-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                        </span>
                        <span className="text-xs sm:text-sm text-white font-medium">Trusted Since 2020</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                        <span className="text-white">Solit 03</span>
                        <br />
                        <span className="text-white/80 text-base sm:text-lg md:text-xl font-normal mt-2 block">
                            Solusi Laptop Second Berkualitas
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
                        Temukan laptop second berkualitas dengan garansi resmi.
                        Performa seperti baru, harga terjangkau. Dapatkan sekarang juga!
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <button
                            onClick={handleViewCatalog}
                            className="group bg-white text-blue-700 text-sm sm:text-base px-6 py-2.5 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-md flex items-center justify-center gap-2 font-semibold"
                        >
                            <span>Lihat Katalog</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </button>

                        <button
                            onClick={handleWhatsApp}
                            className="group border border-white text-white text-sm sm:text-base px-6 py-2.5 rounded-lg transition-all duration-300 hover:bg-white hover:text-blue-700 flex items-center justify-center gap-2 font-semibold"
                        >
                            <span>Hubungi Kami</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs sm:text-sm text-white/70">
                        <div className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-white/80" />
                            <span>Garansi 1 Tahun</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-white/80" />
                            <span>Free Antar Sejabodetabek</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-white/80" />
                            <span>Service Center</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Tambahkan CSS ke file global atau component
const styles = `
    @keyframes spin-slow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes ping-slow {
        0% { transform: scale(0.8); opacity: 0.8; }
        100% { transform: scale(1.5); opacity: 0; }
    }
    
    @keyframes loading-bar {
        0% { width: 0%; left: 0%; }
        50% { width: 70%; left: 15%; }
        100% { width: 100%; left: 0%; }
    }
    
    @keyframes float {
        0% { transform: translateY(0px) translateX(0px); opacity: 0; }
        50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
        100% { transform: translateY(0px) translateX(0px); opacity: 0; }
    }
    
    @keyframes bounce-delay {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
    }
    
    .animate-spin-slow {
        animation: spin-slow 3s linear infinite;
    }
    
    .animate-ping-slow {
        animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    
    .animate-loading-bar {
        animation: loading-bar 2s ease-in-out infinite;
    }
    
    .animate-float {
        animation: float 4s ease-in-out infinite;
    }
    
    .animate-bounce {
        animation: bounce-delay 1s ease-in-out infinite;
    }
    
    .delay-700 {
        animation-delay: 700ms;
    }
    
    .delay-300 {
        animation-delay: 300ms;
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}