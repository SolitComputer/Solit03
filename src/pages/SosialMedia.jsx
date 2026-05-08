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
            color: "from-orange-400 to-orange-600",
        },
        {
            name: "Tokopedia",
            icon: tokopediaIcon,
            link: "https://www.tokopedia.com/solit03",
            color: "from-green-400 to-green-600",
        },
        {
            name: "TikTok",
            icon: tiktokIcon,
            link: "https://www.tiktok.com/@solusi_it03",
            color: "from-pink-500 to-black",
        },
        {
            name: "WhatsApp",
            icon: whatsappIcon,
            link: WHATSAPP_URL,
            color: "from-green-400 to-green-600",
        },
        {
            name: "Instagram",
            icon: instagramIcon,
            link: "https://www.instagram.com/solit.comp",
            color: "from-pink-500 to-yellow-400",
        },
        {
            name: "Facebook",
            icon: facebookIcon,
            link: "https://www.facebook.com/share/18xXspWL5H/",
            color: "from-blue-500 to-blue-700",
        },
    ];

    const handleWhatsApp = () => {
        const message = "Halo Solit 03, saya ingin bertanya tentang produk dan layanan Anda.";
        window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank");
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* HERO */}
            <section className="text-center py-12 md:py-16 px-4 bg-white">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                    Temukan Kami di <span className="text-blue-600">Sosial Media</span>
                </h1>
                <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                    Follow dan hubungi Solit 03 di berbagai platform untuk mendapatkan update terbaru, promo, dan penawaran terbaik.
                </p>
            </section>

            {/* SOCIAL GRID */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {socials.map((item, i) => (
                        <a
                            key={i}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative rounded-xl p-4 md:p-5 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden ${item.name === "WhatsApp" ? "ring-2 ring-green-200" : ""
                                }`}
                        >
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br ${item.color}`} />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <img
                                    src={item.icon}
                                    alt={item.name}
                                    className="w-12 h-12 md:w-14 md:h-14 mb-3 transition duration-500 group-hover:scale-110 rounded-full object-cover"
                                />
                                <h3 className="font-semibold text-sm md:text-base group-hover:text-white transition">
                                    {item.name}
                                </h3>
                                {item.name === "WhatsApp" && (
                                    <span className="text-[10px] text-green-600 group-hover:text-white/80 mt-1">
                                        Balas cepat
                                    </span>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Quick WhatsApp Section */}
            <section className="text-center py-12 md:py-16 bg-gradient-to-r from-green-50 to-green-100">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 bg-green-200 rounded-full px-3 py-1 mb-4">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-medium text-green-800">Fast Response</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                        Butuh Respon Cepat?
                    </h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Langsung chat via WhatsApp untuk mendapatkan informasi produk, harga, dan promo terbaru.
                    </p>
                    <button
                        onClick={handleWhatsApp}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.032 2.001c-5.514 0-10 4.486-10 10 0 1.78.469 3.452 1.283 4.899L2 21.999l5.225-1.312c1.39.794 3.002 1.253 4.713 1.253 5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.5c-1.657 0-3.236-.448-4.618-1.277l-.338-.195-3.125.785.84-3.077-.208-.347c-.891-1.449-1.363-3.113-1.363-4.889 0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5z" />
                            <path d="M16.75 13.45c-.26-.13-1.54-.76-1.78-.85s-.41-.13-.59.13c-.18.26-.69.85-.85 1.02s-.31.2-.56.07c-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.13-.13.26-.33.39-.5.13-.17.18-.28.27-.47.09-.19.05-.36-.02-.5s-.59-1.42-.81-1.95c-.21-.52-.43-.45-.59-.46s-.31-.01-.48-.01c-.18 0-.47.07-.71.33-.24.26-.91.89-.91 2.16 0 1.27.93 2.5 1.06 2.67.13.17 1.83 2.79 4.43 3.91.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.07-.1-.26-.16-.52-.26z" />
                        </svg>
                        Hubungi Admin via WhatsApp
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                        Klik untuk chat langsung • +62 852-1064-7047
                    </p>
                </div>
            </section>

            {/* Location Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-12 bg-white">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 text-center">
                    Lokasi Kami
                </h2>
                <p className="text-gray-500 text-sm text-center mb-6">
                    Jl. Raya Sawangan No. 123, Depok, Jawa Barat
                </p>
                <div className="w-full h-[300px] md:h-[350px] rounded-xl overflow-hidden shadow-md">
                    <iframe
                        src="https://www.google.com/maps?q=Solit%2003%20Depok%20Sawangan&output=embed"
                        className="w-full h-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Lokasi Solit 03"
                    ></iframe>
                </div>
            </section>
        </main>
    );
}