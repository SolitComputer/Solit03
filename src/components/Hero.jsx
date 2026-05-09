import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight, Shield, Truck, Clock } from "lucide-react";
import bgHero from "../assets/background.jpg";

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsVisible(true);
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

    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
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