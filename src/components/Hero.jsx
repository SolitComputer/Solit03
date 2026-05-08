import { useState, useEffect } from "react";
import { ArrowRight, ChevronRight, Laptop, Shield, Truck, Clock } from "lucide-react";
import heroLaptop from "../assets/laptop.webp";

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative pb-10 md:pt-24 md:pb-16 overflow-hidden">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center">

                    {/* Left Content */}
                    <div className={`flex-1 space-y-4 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-1.5 bg-blue-100/60 backdrop-blur-sm rounded-full px-2.5 py-0.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-700"></span>
                            </span>
                            <span className="text-[10px] sm:text-xs text-blue-800 font-medium">Trusted Since 2024</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                            <span className="text-blue-900">
                                Solit 03
                            </span>
                            <br />
                            <span className="text-gray-800 text-sm sm:text-base md:text-lg font-normal mt-0.5 block">
                                Solusi Laptop Second Berkualitas
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-gray-600 max-w-lg leading-relaxed text-justify">
                            Temukan laptop second berkualitas dengan garansi resmi.
                            Performa seperti baru, harga terjangkau. Dapatkan sekarang juga!
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <button className="group bg-blue-700 text-white text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-md flex items-center justify-center gap-1.5">
                                <span>Lihat Katalog</span>
                                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </button>

                            <button className="group border border-blue-700 text-blue-700 text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:text-white flex items-center justify-center gap-1.5">
                                <span>Hubungi Kami</span>
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center gap-3 pt-3 text-[10px] sm:text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                <span>Garansi 1 Tahun</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                <span>Free Antar</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Service Center</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className={`flex-1 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
                        <div className="relative group flex justify-center">
                            <div className="relative bg-gradient-to-br from-white to-blue-50/50 rounded-xl p-3 sm:p-4 shadow-md max-w-xs sm:max-w-sm">
                                <img
                                    src={heroLaptop}
                                    alt="Laptop Solit 03"
                                    className="w-full h-48 sm:h-56 md:h-64 object-contain transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />

                                {/* Floating Badge */}
                                <div className="absolute -top-2 -right-2 bg-white rounded-lg shadow-md p-1.5 sm:p-2">
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                            <Laptop className="w-2.5 h-2.5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-[8px] sm:text-[9px] font-semibold text-gray-500">Mulai dari</div>
                                            <div className="text-[10px] sm:text-xs font-bold text-blue-700">Rp 2,5 Jt</div>
                                        </div>
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