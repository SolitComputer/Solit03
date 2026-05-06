import { useState, useEffect } from "react";
import { ArrowRight, ChevronRight, Laptop, Shield, Truck, Clock } from "lucide-react";
import heroLaptop from "../assets/laptop.webp";

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-white">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

                    {/* Left Content */}
                    <div className={`space-y-5 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-blue-100/60 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-700"></span>
                            </span>
                            <span className="text-xs text-blue-800 font-medium">Trusted Since 2024</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                            <span className="text-blue-900">
                                Solit 03
                            </span>
                            <br />
                            <span className="text-gray-800 text-lg sm:text-xl lg:text-2xl font-normal mt-1 block">
                                Solusi Laptop Second Berkualitas
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-gray-600 max-w-lg leading-relaxed text-justify">
                            Temukan laptop second berkualitas dengan garansi resmi.
                            Performa seperti baru, harga terjangkau. Dapatkan sekarang juga!
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button className="group bg-blue-700 text-white text-sm px-6 py-2.5 rounded-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-md flex items-center justify-center gap-2">
                                <span>Lihat Katalog</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </button>

                            <button className="group border border-blue-700 text-blue-700 text-sm px-6 py-2.5 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:text-white flex items-center justify-center gap-2">
                                <span>Hubungi Kami</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex items-center gap-4 pt-4 text-xs text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5" />
                                <span>Garansi 1 Tahun</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5" />
                                <span>Free Antar</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Service Center</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className={`relative transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
                        <div className="relative group flex justify-center">

                            <div className="relative bg-gradient-to-br from-white to-blue-50/50 rounded-xl p-4 shadow-lg max-w-sm">

                                <img
                                    src={heroLaptop}
                                    alt="Laptop Solit 03"
                                    className="w-full h-[320px] object-contain transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />

                                {/* Floating Badge */}
                                <div className="absolute -top-3 -right-3 bg-white rounded-lg shadow-md p-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                            <Laptop className="w-3 h-3 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-semibold text-gray-500">Mulai dari</div>
                                            <div className="text-xs font-bold text-blue-700">Rp 2,5 Jt</div>
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