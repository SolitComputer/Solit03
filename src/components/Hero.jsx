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

    const testimonials = [

    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Loading Screen Component - Premium Design
    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
                {/* Animated Background Patterns */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-300" />
                    
                    {/* Floating particles */}
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${4 + Math.random() * 6}s`
                            }}
                        />
                    ))}
                </div>

                {/* Main Loading Content */}
                <div className="relative z-10 text-center px-4">
                    {/* Animated Logo */}
                    <div className="mb-8 relative">
                        {/* Glow effects */}
                        <div className="absolute inset-0 animate-ping-slow">
                            <div className="w-32 h-32 bg-blue-500/30 rounded-full mx-auto blur-2xl" />
                        </div>
                        <div className="absolute inset-0 animate-ping-slow delay-300">
                            <div className="w-40 h-40 bg-indigo-500/20 rounded-full mx-auto blur-2xl" />
                        </div>
                        
                        {/* Logo Container */}
                        <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto">
                            {/* Rotating rings */}
                            <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-spin-slow" />
                            <div className="absolute inset-0 rounded-full border-t-2 border-blue-400 animate-spin-slow" style={{ animationDuration: '2s' }} />
                            <div className="absolute inset-0 rounded-full border-r-2 border-indigo-400 animate-spin-slow" style={{ animationDuration: '1.5s' }} />
                            
                            {/* Logo Image */}
                            <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center overflow-hidden shadow-2xl">
                                <img 
                                    src={solitLogo} 
                                    alt="Solit 03 Logo" 
                                    className="w-full h-full object-cover animate-pulse scale-110"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Loading Text */}
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 animate-pulse tracking-tight">
                        Solit 03
                    </h2>
                    <p className="text-blue-200 text-sm md:text-base mb-4 font-light">
                        Loading experience...
                    </p>
                    
                    {/* Loading dots */}
                    <div className="flex justify-center gap-1.5 mb-8">
                        {[...Array(3)].map((_, i) => (
                            <div 
                                key={i} 
                                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>

                    {/* Loading Bar */}
                    <div className="w-72 md:w-96 mx-auto">
                        <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full animate-loading-bar" />
                        </div>
                    </div>

                    {/* Brand Quote */}
                    <p className="text-blue-300/60 text-[10px] mt-6 tracking-wider font-medium">
                        QUALITY LAPTOPS • TRUSTED SERVICE
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
                style={{ backgroundImage: `url(${bgHero})` }}
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            
            {/* Animated Gradient Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700" />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-slow"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${8 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 z-10 text-center">
                <div className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    
                    {/* Sparkle Badge */}
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 shadow-lg">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                            <span className="text-xs sm:text-sm text-white font-medium tracking-wide">
                               Trusted Since 2020
                            </span>
                        </div>
                    </div>

                    {/* Main Title with Gradient */}
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
                                Solit 03
                            </span>
                        </h1>
                        
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                            <p className="relative text-lg sm:text-xl md:text-2xl text-blue-100 font-light">
                                Solusi Laptop Second Berkualitas
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
                        Temukan laptop second berkualitas dengan garansi resmi. Performa seperti baru, harga terjangkau. Dapatkan sekarang juga!
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <button
                            onClick={handleViewCatalog}
                            className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 font-semibold overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative">Lihat Katalog</span>
                            <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>

                        <button
                            onClick={handleWhatsApp}
                            className="group bg-white/10 backdrop-blur-sm border border-white/30 text-white text-sm sm:text-base px-8 py-3 rounded-xl transition-all duration-300 hover:bg-white hover:text-blue-700 hover:scale-105 flex items-center justify-center gap-2 font-semibold"
                        >
                            <span>Hubungi Kami</span>
                            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </button>
                    </div>

                    {/* Trust Indicators with Icons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                        <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                            <Shield className="w-4 h-4 text-blue-300" />
                            <span className="text-xs text-white/80">Garansi 1 Tahun</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                            <Truck className="w-4 h-4 text-blue-300" />
                            <span className="text-xs text-white/80">Free Antar Sejabodetabek</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                            <Clock className="w-4 h-4 text-blue-300" />
                            <span className="text-xs text-white/80">Service Center</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                            <Award className="w-4 h-4 text-yellow-300" />
                            <span className="text-xs text-white/80">Berpengalaman</span>
                        </div>
                    </div>

                    {/* Live Testimonial Ticker */}
                    <div className="pt-6">
                    </div>
                </div>
            </div>
        </section>
    );
}

// Add CSS animations
const styles = `
    @keyframes spin-slow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes ping-slow {
        0% { transform: scale(0.8); opacity: 0.8; }
        100% { transform: scale(1.8); opacity: 0; }
    }
    
    @keyframes loading-bar {
        0% { width: 0%; left: 0%; }
        50% { width: 70%; left: 15%; }
        100% { width: 100%; left: 0%; }
    }
    
    @keyframes float {
        0% { transform: translateY(0px) translateX(0px); opacity: 0; }
        50% { transform: translateY(-30px) translateX(15px); opacity: 0.5; }
        100% { transform: translateY(0px) translateX(0px); opacity: 0; }
    }
    
    @keyframes float-slow {
        0% { transform: translateY(0px) translateX(0px); }
        50% { transform: translateY(-20px) translateX(10px); }
        100% { transform: translateY(0px) translateX(0px); }
    }
    
    @keyframes bounce-delay {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
    }
    
    @keyframes scroll {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(10px); opacity: 0; }
    }
    
    .animate-spin-slow {
        animation: spin-slow 3s linear infinite;
    }
    
    .animate-ping-slow {
        animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    
    .animate-loading-bar {
        animation: loading-bar 2s ease-in-out infinite;
    }
    
    .animate-float {
        animation: float 5s ease-in-out infinite;
    }
    
    .animate-float-slow {
        animation: float-slow 8s ease-in-out infinite;
    }
    
    .animate-bounce {
        animation: bounce-delay 1s ease-in-out infinite;
    }
    
    .animate-scroll {
        animation: scroll 1.5s ease-in-out infinite;
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
    if (!document.querySelector('#hero-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'hero-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}