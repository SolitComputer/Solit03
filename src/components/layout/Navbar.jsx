import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, Home, ShoppingBag, Users, Info, Share2, Shield, Wrench, Laptop } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/solit03.jpeg";

const WHATSAPP_NUMBER = "6285210647047";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                setShowNavbar(false);
            } else {
                setShowNavbar(true);
            }
            setScrolled(window.scrollY > 20);
            setLastScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && menuOpen) setMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [menuOpen]);

    const handleWhatsApp = () => {
        const message = "Halo Solit 03, saya ingin bertanya tentang produk dan layanan Anda.";
        window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank");
    };

    const handleNavigation = (href) => {
        navigate(href);
        setMenuOpen(false);
    };

    // ✅ Icon dikecilkan dari 16 → 13
    const navLinks = [
        { name: "Beranda",     href: "/",             icon: <Home size={13} /> },
        { name: "Katalog",      href: "/katalog",        icon: <ShoppingBag size={13} /> },
        // { name: "Laptop Ready", href: "/katalog-laptop", icon: <Laptop size={13} /> },
        { name: "Jual-Beli",   href: "/jual-beli",     icon: <Users size={13} /> },
        { name: "Tentang",     href: "/tentang",       icon: <Info size={13} /> },
        { name: "Sosial",      href: "/sosial-media",  icon: <Share2 size={13} /> },
        { name: "Cek Garansi", href: "/cek-garansi",   icon: <Shield size={13} /> },
        { name: "Cek Antrian", href: "/cek-antrian",   icon: <Wrench size={13} /> },
        
    ];

    return (
        <>
            <nav
                className={`
                    fixed top-0 left-0 w-full z-40
                    transition-all duration-300 ease-in-out
                    ${showNavbar ? "translate-y-0" : "-translate-y-full"}
                    ${scrolled
                        ? "bg-white/85 backdrop-blur-md border-b border-slate-200 shadow-soft-sm"
                        : "bg-white/60 backdrop-blur-sm border-b border-transparent"
                    }
                `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">

                        {/* Logo */}
                        <button onClick={() => handleNavigation("/")} className="group focus:outline-none">
                            <div className="flex items-center gap-2">
                                <img src={logo} alt="Solit 03" className="w-10 h-10 rounded-full shadow-soft-sm object-cover ring-1 ring-slate-200" />
                                <h1 className="text-base md:text-lg font-semibold text-slate-900 tracking-tight">
                                    Solit<span className="text-blue-600">03</span>
                                </h1>
                            </div>
                        </button>

                        {/* ✅ Desktop nav — text-xs, gap lebih kecil */}
                        <ul className="hidden md:flex gap-0.5 text-slate-500 text-xs">
                            {navLinks.map((item, i) => (
                                <li key={i}>
                                    <button
                                        onClick={() => handleNavigation(item.href)}
                                        className={`
                                            relative px-2.5 py-1.5 rounded-lg transition-all duration-200
                                            flex items-center gap-1
                                            ${location.pathname === item.href
                                                ? "text-blue-700 bg-blue-50 font-semibold"
                                                : "text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                                            }
                                        `}
                                    >
                                        {item.icon}
                                        <span>{item.name}</span>
                                        {location.pathname === item.href && (
                                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-blue-600 rounded-full" />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Desktop CTA — tetap sama */}
                        <div className="hidden md:block">
                            <button
                                onClick={handleWhatsApp}
                                className="btn btn-primary text-xs px-4 py-2"
                            >
                                <MessageCircle size={13} />
                                <span>Hubungi</span>
                            </button>
                        </div>

                        {/* Mobile hamburger — tetap sama */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="p-1.5 rounded-md transition-all duration-200 hover:bg-blue-50"
                                aria-label="Toggle menu"
                            >
                                {menuOpen ? <X className="w-6 h-6 text-blue-700" /> : <Menu className="w-6 h-6 text-blue-700" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ✅ Mobile Menu — text-xs */}
                <div
                    className={`
                        md:hidden absolute w-full bg-white/95 backdrop-blur-md shadow-soft-lg
                        transition-all duration-300 ease-in-out overflow-hidden
                        ${menuOpen ? "max-h-[700px] opacity-100 border-t border-slate-200" : "max-h-0 opacity-0"}
                    `}
                >
                    <div className="px-4 py-2 space-y-0.5">
                        {navLinks.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handleNavigation(item.href)}
                                className={`
                                    w-full flex items-center gap-2 px-3 py-2 rounded-md
                                    text-xs transition-all duration-200
                                    ${location.pathname === item.href
                                        ? "bg-blue-50 text-blue-700 font-semibold"
                                        : "text-slate-600 hover:bg-slate-50"
                                    }
                                `}
                            >
                                <span className={location.pathname === item.href ? "text-blue-600" : "text-slate-400"}>
                                    {item.icon}
                                </span>
                                {item.name}
                                {item.href === "/cek-antrian" && location.pathname !== "/cek-antrian" && (
                                    <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                                        Live
                                    </span>
                                )}
                                {location.pathname === item.href && (
                                    <span className="ml-auto w-1 h-4 bg-blue-600 rounded-full" />
                                )}
                            </button>
                        ))}

                        <div className="border-t border-slate-100 mt-2 pt-2">
                            <button
                                onClick={handleWhatsApp}
                                className="btn btn-primary w-full text-xs py-2.5"
                            >
                                <MessageCircle size={14} />
                                WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="h-8 md:h-12" />
        </>
    );
}