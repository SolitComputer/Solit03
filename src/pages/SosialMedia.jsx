import shopeeIcon from "../assets/shoppe.png";
import tokopediaIcon from "../assets/tokopedia.jpg";
import tiktokIcon from "../assets/tiktok1.png";
import whatsappIcon from "../assets/wa.png";
import instagramIcon from "../assets/ig.png";
import facebookIcon from "../assets/fb.png";

const WHATSAPP_NUMBER = "6285210647047";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function SosialMedia() {
    const socials = [
        {
            name: "Shopee",
            icon: shopeeIcon,
            link: "https://shopee.co.id/solit_03?entryPoint=ShopBySearch&searchKeyword=solit03",
            color: "from-orange-500 to-orange-700",
            bgHover: "hover:bg-orange-50",
            border: "border-orange-100",
            
        },
        {
            name: "Tokopedia",
            icon: tokopediaIcon,
            link: "https://www.tokopedia.com/solit03",
            color: "from-green-500 to-green-700",
            bgHover: "hover:bg-green-50",
            border: "border-green-100",
            
        },
        {
            name: "TikTok",
            icon: tiktokIcon,
            link: "https://www.tiktok.com/@solusi_it03",
            color: "from-pink-500 to-pink-700",
            bgHover: "hover:bg-pink-50",
            border: "border-pink-100",
            
        },
        {
            name: "WhatsApp",
            icon: whatsappIcon,
            link: WHATSAPP_URL,
            color: "from-green-500 to-green-700",
            bgHover: "hover:bg-green-50",
            border: "border-green-100",
            
        },
        {
            name: "Instagram",
            icon: instagramIcon,
            link: "https://www.instagram.com/solit.comp",
            color: "from-pink-500 to-purple-600",
            bgHover: "hover:bg-pink-50",
            border: "border-pink-100",
            
        },
        {
            name: "Facebook",
            icon: facebookIcon,
            link: "https://www.facebook.com/share/18xXspWL5H/",
            color: "from-blue-500 to-blue-700",
            bgHover: "hover:bg-blue-50",
            border: "border-blue-100",
            
        },
    ];

    const handleWhatsApp = () => {
        const message = "Halo Solit 03, saya ingin bertanya tentang produk dan layanan Anda.";
        window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank");
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* HERO SECTION - Premium Design */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 md:py-24">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                        <div className="grid grid-cols-3 gap-4 p-8 opacity-20">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-white rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold tracking-wider uppercase">Connect With Us</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                        Temukan Kami di{' '}
                        <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            Sosial Media
                        </span>
                    </h1>
                    
                    <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                        Follow dan hubungi Solit 03 di berbagai platform untuk mendapatkan update terbaru, 
                        promo, dan penawaran terbaik.
                    </p>
                    
                    {/* Floating stats */}
                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                </svg>
                            </div>
                            <span className="text-sm">24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                </svg>
                            </div>
                            <span className="text-sm">Fast Response</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                </svg>
                            </div>
                            <span className="text-sm">Trusted Store</span>
                        </div>
                    </div>
                </div>
                
                {/* Wave bottom */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-12 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                              fill="currentColor" opacity="0.6"/>
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                              fill="currentColor" className="text-gray-50"/>
                    </svg>
                </div>
            </section>

            {/* SOCIAL GRID - Premium Cards */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 md:gap-6">
                    {socials.map((item, i) => (
                        <a
                            key={i}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative bg-white rounded-2xl p-5 md:p-6 transition-all duration-500 hover:-translate-y-2 overflow-hidden border ${item.border} shadow-lg hover:shadow-2xl`}
                        >
                            {/* Gradient background on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                            
                            {/* Shine effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition duration-500 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transform transition-transform duration-1000" />
                            
                            <div className="relative z-10 flex flex-col items-center text-center">
                                {/* Icon container with glow */}
                                <div className="relative mb-4">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-full blur-xl opacity-0 group-hover:opacity-60 transition duration-500`} />
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 ring-offset-2 ring-gray-100 group-hover:ring-white/50 transition-all duration-300">
                                        <img
                                            src={item.icon}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                                
                                <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-1">
                                    {item.name}
                                </h3>
                                
                                <p className="text-xs text-gray-500 group-hover:text-white/80 transition-colors duration-300">
                                    {item.stats}
                                </p>
                                
                                {/* Arrow indicator */}
                                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Corner decoration */}
                            <div className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition duration-300">
                                <div className="w-full h-full bg-white/20 rounded-full blur-sm" />
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Quick WhatsApp Section - Premium CTA */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700" />
                
                {/* Animated background patterns */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/30">
                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-white tracking-wider uppercase">Priority Support</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Butuh <span className="underline decoration-green-300">Respon Cepat?</span>
                    </h2>
                    
                    <p className="text-base md:text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                        Langsung chat via WhatsApp untuk mendapatkan informasi produk, harga, dan promo terbaru.
                        Tim kami siap membantu Anda!
                    </p>
                    
                    <button
                        onClick={handleWhatsApp}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-green-700 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-green-100 to-white opacity-0 group-hover:opacity-100 transition duration-300" />
                        <svg className="relative z-10 w-5 h-5 group-hover:scale-110 transition duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.032 2.001c-5.514 0-10 4.486-10 10 0 1.78.469 3.452 1.283 4.899L2 21.999l5.225-1.312c1.39.794 3.002 1.253 4.713 1.253 5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.5c-1.657 0-3.236-.448-4.618-1.277l-.338-.195-3.125.785.84-3.077-.208-.347c-.891-1.449-1.363-3.113-1.363-4.889 0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5z" />
                            <path d="M16.75 13.45c-.26-.13-1.54-.76-1.78-.85s-.41-.13-.59.13c-.18.26-.69.85-.85 1.02s-.31.2-.56.07c-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.13-.13.26-.33.39-.5.13-.17.18-.28.27-.47.09-.19.05-.36-.02-.5s-.59-1.42-.81-1.95c-.21-.52-.43-.45-.59-.46s-.31-.01-.48-.01c-.18 0-.47.07-.71.33-.24.26-.91.89-.91 2.16 0 1.27.93 2.5 1.06 2.67.13.17 1.83 2.79 4.43 3.91.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.07-.1-.26-.16-.52-.26z" />
                        </svg>
                        <span className="relative z-10">Hubungi Admin via WhatsApp</span>
                        <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                    
                    <p className="text-sm text-white/70 mt-6 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Klik untuk chat langsung • +62 852-1064-7047 • Available 24/7
                    </p>
                </div>
            </section>

            {/* Location Section - Premium */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-white shadow-sm rounded-full px-4 py-1.5 mb-4">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            <span className="text-xs font-semibold text-gray-600 tracking-wider uppercase">Visit Us</span>
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            Lokasi Kami
                        </h2>
                        <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-5 rounded-full" />
                        <p className="text-gray-500 text-sm md:text-base">
                            Jl. Raya Sawangan No. 123, Depok, Jawa Barat
                        </p>
                    </div>
                    
                    <div className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 z-10" />
                        <div className="w-full h-[350px] md:h-[400px]">
                            <iframe
                                src="https://www.google.com/maps?q=Solit%2003%20Depok%20Sawangan&output=embed"
                                className="w-full h-full border-0 group-hover:scale-105 transition duration-700"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Solit 03"
                            ></iframe>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/70 backdrop-blur-md rounded-lg p-3 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="flex items-center gap-2 text-white text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                </svg>
                                <span>Jl. Raya Sawangan No. 123, Depok, Jawa Barat</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}