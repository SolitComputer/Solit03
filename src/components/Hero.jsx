import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles, Star, ShieldCheck, BadgeCheck } from "lucide-react";
import bgHero from "../assets/background.webp";
import solitLogo from "../assets/solit03.jpeg";
import heroShowcase from "../assets/laptop/1.webp";
import InteractiveBackground from "./ui/InteractiveBackground";
import Aurora from "./ui/Aurora";
import SplitText from "./ui/SplitText";
import Magnet from "./ui/Magnet";
import TextLoop from "./ui/TextLoop";
import { getSiteSettings } from "../services/siteContent";
import { getServiceIcon } from "../utils/serviceIcons";

const DEFAULT_HERO = {
    badge: "Tepercaya Sejak 2020",
    title_prefix: "Solit",
    title_suffix: "03",
    subtitle: "Laptop Second Rasa Baru, Harga Bersahabat",
    description: "Setiap unit lolos quality control dan bergaransi resmi. Performa ngebut untuk kuliah, kerja, hingga gaming — tanpa bikin dompet menjerit.",
    cta_primary_label: "Lihat Katalog",
    cta_secondary_label: "Hubungi Kami",
    trust: [
        { icon: "Shield", label: "Garansi 1 Bulan" },
        { icon: "Truck", label: "Gratis Antar Jabodetabek" },
        { icon: "Clock", label: "Service Cepat & Rapi" },
        { icon: "Award", label: "Tepercaya Sejak 2020" },
    ],
};

const DEFAULT_CONTACT = {
    whatsapp_number: "6285210647047",
    whatsapp_message: "Halo Solit 03, saya tertarik dengan laptopnya. Apakah ada yang bisa dibantu?",
};

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hero, setHero] = useState(DEFAULT_HERO);
    const [contact, setContact] = useState(DEFAULT_CONTACT);
    const navigate = useNavigate();

    useEffect(() => {
        getSiteSettings()
            .then((settings) => {
                if (settings.hero) setHero({ ...DEFAULT_HERO, ...settings.hero });
                if (settings.contact) setContact({ ...DEFAULT_CONTACT, ...settings.contact });
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setIsVisible(true), 100);
        }, 1600);
        return () => clearTimeout(timer);
    }, []);

    const handleViewCatalog = () => {
        navigate('/katalog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/${contact.whatsapp_number}?text=${encodeURIComponent(contact.whatsapp_message)}`, '_blank');
    };

    // ========== LOADING SCREEN — minimalis ==========
    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 -left-32 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 -right-32 w-80 h-80 bg-blue-50 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 text-center px-4">
                    <div className="relative mb-7 mx-auto w-24 h-24 md:w-28 md:h-28">
                        <div className="absolute -inset-2 rounded-full border border-blue-200/60 animate-ping-slow" />
                        <div className="relative w-full h-full rounded-full overflow-hidden shadow-soft-lg ring-1 ring-slate-200">
                            <img src={solitLogo} alt="Solit 03" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-content tracking-tight mb-1">
                        Solit<span className="text-blue-600">03</span>
                    </h2>
                    <p className="text-content-muted text-sm font-light tracking-wide mb-6">
                        Solusi Laptop Second Berkualitas
                    </p>

                    <div className="w-56 md:w-64 mx-auto h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full animate-loading-bar" />
                    </div>
                </div>
            </div>
        );
    }

    // ========== HERO ==========
    const trust = hero.trust?.length ? hero.trust : DEFAULT_HERO.trust;

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Foto brand sebagai tekstur dasar */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none"
                style={{ backgroundImage: `url(${bgHero})` }}
            />
            {/* Overlay gelap — jaga keterbacaan teks */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-900/70 to-slate-900/95 pointer-events-none" />
            {/* Pita aurora premium yang bergerak pelan di balik jaring partikel */}
            <Aurora
                className="pointer-events-none"
                colors={["#2563eb", "#22d3ee", "#6366f1"]}
                opacity={0.4}
                blur={100}
            />
            {/* Jaring partikel interaktif — menghindar dari kursor */}
            <InteractiveBackground className="pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Content — dua kolom: teks kiri, showcase kanan */}
            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
                <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-12 lg:gap-8 items-center">

                    {/* ---------- Kolom kiri: konten ---------- */}
                    <div className={`text-center lg:text-left space-y-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

                        {/* Badge */}
                        <div className="flex justify-center lg:justify-start">
                            <span className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-md rounded-full pl-1.5 pr-4 py-1.5 border border-white/15 text-xs sm:text-sm text-white/90 font-medium">
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/90 px-2 py-0.5 text-[0.65rem] font-semibold text-white">
                                    <Sparkles className="w-3 h-3" /> NEW
                                </span>
                                {hero.badge}
                            </span>
                        </div>

                        {/* Title */}
                        <div className="space-y-4">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                                <SplitText as="span" text={hero.title_prefix} by="char" stagger={0.06} />
                                <span className="text-blue-500 ml-1">{hero.title_suffix}</span>
                            </h1>
                            <SplitText
                                as="p"
                                text={hero.subtitle}
                                by="word"
                                delay={0.25}
                                className="text-lg sm:text-xl md:text-2xl text-slate-200 font-light"
                            />
                        </div>

                        {/* Tagline berputar */}
                        <p className="text-base sm:text-lg text-slate-200 font-light">
                            Andal untuk{" "}
                            <TextLoop
                                items={["Kuliah", "Kerja", "Coding", "Desain", "Gaming"]}
                                className="font-semibold text-blue-300"
                            />
                        </p>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            {hero.description}
                        </p>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                            <Magnet>
                                <motion.button
                                    onClick={handleViewCatalog}
                                    whileHover={{ scale: 1.04, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                                    className="btn btn-primary px-8 py-3.5 text-sm sm:text-base group w-full sm:w-auto"
                                >
                                    {hero.cta_primary_label}
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </motion.button>
                            </Magnet>
                            <Magnet>
                                <motion.button
                                    onClick={handleWhatsApp}
                                    whileHover={{ scale: 1.04, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                                    className="btn px-8 py-3.5 text-sm sm:text-base text-white bg-white/[0.08] backdrop-blur-md border border-white/25 hover:bg-surface hover:text-content group w-full sm:w-auto"
                                >
                                    {hero.cta_secondary_label}
                                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </motion.button>
                            </Magnet>
                        </div>

                        {/* Trust indicators — baris kompak */}
                        <div className="grid grid-cols-2 gap-2.5 pt-6 max-w-md mx-auto lg:mx-0">
                            {trust.map((item, idx) => {
                                const Icon = getServiceIcon(item.icon);
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 bg-white/[0.06] backdrop-blur-md rounded-xl px-3 py-2.5 border border-white/10 hover:bg-white/[0.12] hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        <Icon className="w-4 h-4 text-blue-300 shrink-0" />
                                        <span className="text-xs text-white/90 font-medium text-left leading-tight">{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ---------- Kolom kanan: showcase card ---------- */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, rotate: -2 }}
                        animate={isVisible ? { opacity: 1, y: 0, rotate: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                        className="relative mx-auto w-full max-w-sm lg:max-w-md"
                    >
                        {/* Glow di belakang kartu */}
                        <div className="absolute -inset-6 bg-blue-500/20 rounded-[2rem] blur-3xl pointer-events-none" />

                        {/* Frame utama */}
                        <div className="relative rounded-[1.75rem] p-2.5 bg-white/[0.06] backdrop-blur-xl border border-white/15 shadow-2xl animate-float">
                            <div className="relative rounded-[1.25rem] overflow-hidden ring-1 ring-white/10">
                                <img
                                    src={heroShowcase}
                                    alt="Laptop second berkualitas Solit 03"
                                    className="w-full h-auto object-cover"
                                    loading="eager"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>

                        {/* Floating chip — rating (kiri atas) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                            className="absolute -top-4 -left-4 flex items-center gap-2.5 rounded-2xl bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                                <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                            </span>
                            <div className="text-left leading-tight">
                                <p className="text-sm font-bold text-slate-900">4.9/5.0</p>
                                <p className="text-[0.65rem] text-slate-500">500+ ulasan</p>
                            </div>
                        </motion.div>

                        {/* Floating chip — garansi (kanan bawah) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.85, type: "spring", stiffness: 300 }}
                            className="absolute -bottom-4 -right-3 flex items-center gap-2.5 rounded-2xl bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                                <ShieldCheck className="w-4.5 h-4.5 text-blue-600" />
                            </span>
                            <div className="text-left leading-tight">
                                <p className="text-sm font-bold text-slate-900">Bergaransi</p>
                                <p className="text-[0.65rem] text-slate-500">Lolos QC ketat</p>
                            </div>
                        </motion.div>

                        {/* Floating chip — harga (kanan atas) */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 1, type: "spring", stiffness: 300 }}
                            className="absolute top-8 -right-4 flex items-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-2 shadow-xl shadow-blue-600/30"
                        >
                            <BadgeCheck className="w-4 h-4 text-white" />
                            <span className="text-xs font-semibold text-white">Mulai 2 jt-an</span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2">
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/50">Scroll</span>
                <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
                    <span className="h-2 w-1 rounded-full bg-white/70 animate-bounce-custom" />
                </span>
            </div>
        </section>
    );
}

// ========== Hero-only keyframes ==========
const styles = `
    @keyframes ping-slow {
        0% { transform: scale(0.9); opacity: 0.5; }
        100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes loading-bar {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
    .animate-loading-bar { animation: loading-bar 1.4s ease-in-out infinite; }
`;

if (typeof document !== 'undefined' && !document.querySelector('#hero-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'hero-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}
