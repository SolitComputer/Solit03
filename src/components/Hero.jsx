import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight, Laptop, Shield, Truck, Clock } from "lucide-react";
import heroLaptop from "../assets/laptop.webp";

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleMouseMove = (e) => {
        if (!isHovering) return;
        
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        const maxRotation = 15;
        const rotateYValue = (mouseX / (rect.width / 2)) * maxRotation;
        const rotateXValue = -(mouseY / (rect.height / 2)) * maxRotation;
        
        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setRotateX(0);
        setRotateY(0);
    };

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

    return (
        <section className="relative pb-10 md:pt-24 md:pb-16 overflow-hidden">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center">

                    {/* Left Content - Text diperbesar dan dimajukan */}
                    <div className={`flex-1 space-y-5 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
                        {/* Badge - lebih besar */}
                        <div className="inline-flex items-center gap-1.5 bg-blue-100/60 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-700"></span>
                            </span>
                            <span className="text-xs sm:text-sm text-blue-800 font-medium">Trusted Since 2024</span>
                        </div>

                        {/* Main Title - lebih besar dan tegas */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                            <span className="text-blue-900">
                                Solit 03
                            </span>
                            <br />
                            <span className="text-gray-800 text-base sm:text-lg md:text-xl font-normal mt-1 block">
                                Solusi Laptop Second Berkualitas
                            </span>
                        </h1>

                        {/* Deskripsi - lebih besar dan nyaman dibaca */}
                        <p className="text-sm sm:text-base text-gray-700 max-w-xl leading-relaxed text-justify">
                            Temukan laptop second berkualitas dengan garansi resmi.
                            Performa seperti baru, harga terjangkau. Dapatkan sekarang juga!
                        </p>

                        {/* CTA Buttons - teks dan padding diperbesar */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                            <button
                                onClick={handleViewCatalog}
                                className="group bg-blue-700 text-white text-sm sm:text-base px-5 sm:px-6 py-2.5 rounded-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <span>Lihat Katalog</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </button>

                            <button
                                onClick={handleWhatsApp}
                                className="group border border-blue-700 text-blue-700 text-sm sm:text-base px-5 sm:px-6 py-2.5 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:text-white flex items-center justify-center gap-2">
                                <span>Hubungi Kami</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Trust Indicators - lebih besar */}
                        <div className="flex flex-wrap items-center gap-4 pt-3 text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <Shield className="w-4 h-4" />
                                <span>Garansi 1 Tahun</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Truck className="w-4 h-4" />
                                <span>Free Antar Sejabodetabek</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>Service Center</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Image with 3D Animation - tidak diubah */}
                    <div className={`flex-1 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
                        <div 
                            className="relative group flex justify-center perspective-1000"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div 
                                className="relative bg-gradient-to-br from-white to-blue-50/50 rounded-xl p-3 sm:p-4 shadow-md max-w-xs sm:max-w-sm"
                                style={{
                                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                                    transition: isHovering ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                {/* Glow effect */}
                                <div 
                                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.2), transparent 70%)',
                                        pointerEvents: 'none',
                                    }}
                                />
                                
                                {/* Image container */}
                                <div
                                    className="relative overflow-hidden rounded-lg"
                                    style={{
                                        transform: 'translateZ(20px)',
                                        transformStyle: 'preserve-3d',
                                    }}
                                >
                                    <img
                                        src={heroLaptop}
                                        alt="Laptop Solit 03"
                                        className="w-full h-48 sm:h-56 md:h-64 object-contain"
                                        loading="lazy"
                                        style={{
                                            filter: isHovering ? 'drop-shadow(0 20px 15px rgba(0,0,0,0.2))' : 'drop-shadow(0 10px 8px rgba(0,0,0,0.1))',
                                            transition: 'all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                                        }}
                                    />
                                </div>

                                {/* Shine effect overlay */}
                                <div 
                                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700 overflow-hidden"
                                >
                                    <div 
                                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                                        style={{
                                            transform: 'translateX(-100%) skewX(-20deg)',
                                            animation: isHovering ? 'shine 1.5s ease-in-out infinite' : 'none',
                                        }}
                                    />
                                </div>

                                {/* Shadow effect */}
                                <div 
                                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-black/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        transform: `translateX(-50%) translateZ(-10px)`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS untuk animasi (tetap) */}
            <style jsx>{`
                @keyframes shine {
                    0% {
                        transform: translateX(-100%) skewX(-20deg);
                    }
                    100% {
                        transform: translateX(200%) skewX(-20deg);
                    }
                }
                
                .perspective-1000 {
                    perspective: 1000px;
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                .group:hover .float-animation {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}