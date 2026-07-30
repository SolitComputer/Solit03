import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import shopeeIcon from "../assets/shoppe.png";
import tokopediaIcon from "../assets/tokopedia.webp";
import tiktokIcon from "../assets/tiktok1.png";
import whatsappIcon from "../assets/wa.png";
import instagramIcon from "../assets/ig.png";
import facebookIcon from "../assets/fb.png";

const WHATSAPP_NUMBER = "6285210647047";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function SosialMedia() {
    const [isVisible, setIsVisible] = useState({
        hero: false,
        grid: false,
        cta: false,
        location: false,
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.2, triggerOnce: true }
        );

        const sections = ["hero", "grid", "cta", "location"];
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const socials = [
        {
            name: "Shopee",
            icon: shopeeIcon,
            link: "https://shopee.co.id/solit_03?entryPoint=ShopBySearch&searchKeyword=solit03",
            color: "from-orange-500 to-orange-600",
        },
        {
            name: "Tokopedia",
            icon: tokopediaIcon,
            link: "https://www.tokopedia.com/solit03",
            color: "from-green-500 to-green-600",
        },
        {
            name: "TikTok",
            icon: tiktokIcon,
            link: "https://www.tiktok.com/@solusi_it03",
            color: "from-pink-500 to-pink-600",
        },
        {
            name: "WhatsApp",
            icon: whatsappIcon,
            link: WHATSAPP_URL,
            color: "from-green-500 to-green-600",
        },
        {
            name: "Instagram",
            icon: instagramIcon,
            link: "https://www.instagram.com/solit.comp",
            color: "from-pink-500 to-purple-600",
        },
        {
            name: "Facebook",
            icon: facebookIcon,
            link: "https://www.facebook.com/share/18xXspWL5H/",
            color: "from-blue-500 to-blue-600",
        },
    ];

    const handleWhatsApp = () => {
        const message = "Halo Solit 03, saya ingin bertanya tentang produk dan layanan Anda.";
        window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-surface-muted relative overflow-hidden">
            <Helmet>
                <title>Sosial Media & Marketplace Solit 03 | Shopee, Tokopedia, TikTok</title>
                <meta
                    name="description"
                    content="Ikuti Solit 03 di Instagram, TikTok, dan belanja laptop second bergaransi lewat Shopee & Tokopedia resmi kami. Hubungi via WhatsApp untuk info & COD Jabodetabek."
                />
                <link rel="canonical" href="https://solit03.com/sosial-media" />
            </Helmet>
            {/* Subtle decorative orb */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                {/* Hero Section */}
                <section
                    id="hero"
                    className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
                        isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <span className="eyebrow">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        Connect With Us
                    </span>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-content mt-5">
                        Temukan Kami di <span className="text-blue-600">Sosial Media</span>
                    </h1>

                    <p className="text-sm md:text-base text-content-muted mt-4 max-w-2xl mx-auto">
                        Follow dan hubungi{" "}
                        <span className="font-semibold text-blue-600">Solit 03</span>
                    </p>

                    <div className="flex justify-center items-center gap-2 mt-6">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400 rounded-full" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-400 rounded-full" />
                    </div>
                </section>

                {/* SOCIAL GRID */}
                <div
                    id="grid"
                    className={`transition-all duration-500 delay-100 ${
                        isVisible.grid ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-5">
                        {socials.map((item, i) => (
                            <a
                                key={i}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group card-3d p-4 md:p-5 text-center overflow-hidden"
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full mx-auto mb-3 overflow-hidden ring-2 ring-offset-2 ring-slate-100 group-hover:ring-blue-200 transition-all duration-300">
                                    <img
                                        src={item.icon}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                                    />
                                </div>

                                {/* Name */}
                                <h3 className="text-sm md:text-base font-bold text-content group-hover:text-blue-600 transition-colors duration-300">
                                    {item.name}
                                </h3>

                                {/* Action Text */}
                                <p className="text-[10px] text-content-muted mt-1 group-hover:text-blue-500 transition-colors inline-flex items-center justify-center gap-1">
                                    Kunjungi <ArrowRight className="w-3 h-3" aria-hidden="true" />
                                </p>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Location Section */}
                <div
                    id="location"
                    className={`mt-12 md:mt-16 transition-all duration-500 delay-200 ${
                        isVisible.location ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                >
                    {/* Section Header */}
                    <div className="text-center mb-8">
                        <span className="eyebrow">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            </svg>
                            Visit Us
                        </span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-content mt-5">
                            Lokasi <span className="text-blue-600">Kami</span>
                        </h2>
                        <div className="w-12 h-0.5 bg-blue-500 mx-auto mt-4 rounded-full" />
                    </div>

                    {/* Map */}
                    <div className="card-3d overflow-hidden p-0">
                        <div className="w-full h-[280px] md:h-[320px]">
                            <iframe
                                src="https://www.google.com/maps?q=Solit%2003%20Depok%20Sawangan&output=embed"
                                className="w-full h-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Solit 03"
                            ></iframe>
                        </div>
                        <div className="bg-surface-muted px-4 py-3 border-t border-border">
                            <div className="flex items-center justify-center gap-2 text-xs text-content-soft">
                                <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                </svg>
                                <span>Jl. Raya Sawangan No. 123, Depok, Jawa Barat</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA WhatsApp Section */}
                <div
                    id="cta"
                    className={`text-center my-12 md:my-16 transition-all duration-500 delay-300 ${
                        isVisible.cta ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                >
                    <button
                        onClick={handleWhatsApp}
                        className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                    >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.032 2.001c-5.514 0-10 4.486-10 10 0 1.78.469 3.452 1.283 4.899L2 21.999l5.225-1.312c1.39.794 3.002 1.253 4.713 1.253 5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.5c-1.657 0-3.236-.448-4.618-1.277l-.338-.195-3.125.785.84-3.077-.208-.347c-.891-1.449-1.363-3.113-1.363-4.889 0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5z" />
                            <path d="M16.75 13.45c-.26-.13-1.54-.76-1.78-.85s-.41-.13-.59.13c-.18.26-.69.85-.85 1.02s-.31.2-.56.07c-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.13-.13.26-.33.39-.5.13-.17.18-.28.27-.47.09-.19.05-.36-.02-.5s-.59-1.42-.81-1.95c-.21-.52-.43-.45-.59-.46s-.31-.01-.48-.01c-.18 0-.47.07-.71.33-.24.26-.91.89-.91 2.16 0 1.27.93 2.5 1.06 2.67.13.17 1.83 2.79 4.43 3.91.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.07-.1-.26-.16-.52-.26z" />
                        </svg>

                        <span className="font-semibold">Hubungi Kami via WhatsApp</span>

                        <svg
                            className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Contact Info */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <div className="h-3 w-px bg-slate-300"></div>
                        <p className="text-[11px] text-content-muted">Atau hubungi langsung:</p>
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-mono text-green-600 hover:text-green-700 font-medium hover:underline transition"
                        >
                            +62 852-1064-7047
                        </a>
                        <div className="h-3 w-px bg-slate-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
