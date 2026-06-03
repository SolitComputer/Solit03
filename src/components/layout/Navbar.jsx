import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, Home, ShoppingBag, Users, Info, Share2, Shield } from "lucide-react";
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

            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && menuOpen) {
                setMenuOpen(false);
            }
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

    const navLinks = [
        { name: "Beranda", href: "/", icon: <Home size={14} /> },
        { name: "Katalog", href: "/katalog", icon: <ShoppingBag size={14} /> },
        { name: "Jual-Beli", href: "/jual-beli", icon: <Users size={14} /> },
        { name: "Tentang", href: "/tentang", icon: <Info size={14} /> },
        { name: "Sosial", href: "/sosial-media", icon: <Share2 size={14} /> },
        { name: "Cek Garansi", href: "/cek-garansi", icon: <Shield size={14} /> },
    ];

    return (
        <>
            <nav
                className={`
                    fixed top-0 left-0 w-full z-40
                    transition-all duration-300 ease-in-out
                    ${showNavbar ? "translate-y-0" : "-translate-y-full"}
                    ${scrolled
                        ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
                        : "bg-white/60 backdrop-blur-sm border-b border-gray-50"
                    }
                `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tinggi navbar lebih kecil: h-12 md:h-14 */}
                    <div className="flex justify-between items-center h-12 md:h-14">

                        {/* Logo lebih kecil */}
                        <button
                            onClick={() => handleNavigation("/")}
                            className="group focus:outline-none"
                        >
                            <div className="flex items-center gap-2">
                                <img
                                    src={logo}
                                    alt="Solit 03"
                                    className="w-8 h-8 rounded-full shadow-sm object-cover"
                                />
                                <h1 className="text-sm md:text-base font-semibold text-blue-900 tracking-tight">
                                    Solit<span className="text-blue-600">03</span>
                                </h1>
                            </div>
                        </button>

                        {/* Desktop Navigation - lebih padat */}
                        <ul className="hidden md:flex gap-1 text-sm">
                            {navLinks.map((item, i) => (
                                <li key={i}>
                                    <button
                                        onClick={() => handleNavigation(item.href)}
                                        className={`
                                            relative px-3 py-1.5 rounded-md transition-all duration-200
                                            flex items-center gap-1.5
                                            ${location.pathname === item.href
                                                ? "text-blue-700 bg-blue-50/80 font-medium"
                                                : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
                                            }
                                        `}
                                    >
                                        {item.icon}
                                        <span>{item.name}</span>
                                        {location.pathname === item.href && (
                                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-blue-600 rounded-full"></span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Desktop CTA Button - lebih kecil */}
                        <div className="hidden md:block">
                            <button
                                onClick={handleWhatsApp}
                                className="group relative inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1.5 rounded-md transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                            >
                                <MessageCircle size={14} />
                                <span>Hubungi</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="p-1.5 rounded-md transition-all duration-200 hover:bg-blue-50"
                                aria-label="Toggle menu"
                            >
                                {menuOpen ? (
                                    <X className="w-5 h-5 text-blue-700" />
                                ) : (
                                    <Menu className="w-5 h-5 text-blue-700" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu - lebih padat tapi tetap ada animasi */}
                <div
                    className={`
                        md:hidden absolute w-full bg-white/95 backdrop-blur-md shadow-lg
                        transition-all duration-300 ease-in-out overflow-hidden
                        ${menuOpen ? "max-h-96 opacity-100 border-t border-gray-100" : "max-h-0 opacity-0"}
                    `}
                >
                    <div className="px-4 py-2 space-y-0.5">
                        {navLinks.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handleNavigation(item.href)}
                                className={`
                                    w-full flex items-center gap-2 px-3 py-2 rounded-md
                                    text-sm transition-all duration-200
                                    ${location.pathname === item.href
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }
                                `}
                            >
                                <span className={location.pathname === item.href ? "text-blue-600" : "text-gray-400"}>
                                    {item.icon}
                                </span>
                                {item.name}
                                {location.pathname === item.href && (
                                    <span className="ml-auto w-1 h-4 bg-blue-600 rounded-full"></span>
                                )}
                            </button>
                        ))}

                        <div className="border-t border-gray-100 mt-2 pt-2">
                            <button
                                onClick={handleWhatsApp}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm py-2 rounded-md transition-all duration-200 hover:shadow-md"
                            >
                                <MessageCircle size={16} />
                                WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer lebih kecil */}
            <div className="h-12 md:h-14"></div>
        </>
    );
}