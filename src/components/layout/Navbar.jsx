import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, Phone, Home, ShoppingBag, Users, Info, Share2 } from "lucide-react";
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
    ];

    return (
        <>
            <nav
                className={`
    fixed top-0 left-0 w-full z-40
    transition-all duration-500 ease-in-out
    ${showNavbar ? "translate-y-0" : "-translate-y-full"}
    
    bg-white/70 backdrop-blur-md
    border-b border-white/20
    shadow-sm
  `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-12 md:h-14">

                        {/* Logo */}
                        <button
                            onClick={() => handleNavigation("/")}
                            className="group focus:outline-none"
                        >
                            <div className="flex items-center gap-2">
                                <img
                                    src={logo}
                                    alt="Solit 03"
                                    className="w-10 h-10 object-cover rounded-full shadow-sm"
                                />

                                <h1 className="text-sm md:text-base font-semibold text-blue-900 tracking-tight">
                                    Solit<span className="text-blue-600">03</span>
                                </h1>
                            </div>
                        </button>

                        {/* Desktop Navigation */}
                        <ul className="hidden md:flex gap-1 lg:gap-2 text-gray-600 text-xs">
                            {navLinks.map((item, i) => (
                                <li key={i}>
                                    <button
                                        onClick={() => handleNavigation(item.href)}
                                        className={`
                                            relative px-3 py-1.5 rounded-lg transition-all duration-300
                                            flex items-center gap-1.5
                                            ${location.pathname === item.href
                                                ? "text-blue-700 bg-blue-50 font-medium"
                                                : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                                            }
                                        `}
                                    >
                                        {item.icon}
                                        {item.name}
                                        {location.pathname === item.href && (
                                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-blue-600 rounded-full"></span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Desktop CTA Button - WhatsApp */}
                        <div className="hidden md:block">
                            <button
                                onClick={handleWhatsApp}
                                className="group relative inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3.5 py-1.5 rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <MessageCircle size={12} className="relative" />
                                <span className="relative">Hubungi Kami</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="p-1.5 rounded-lg transition-all duration-300 hover:bg-blue-50"
                                aria-label="Toggle menu"
                            >
                                {menuOpen ? (
                                    <X className="w-4.5 h-4.5 text-blue-700" />
                                ) : (
                                    <Menu className="w-4.5 h-4.5 text-blue-700" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div
                    className={`
                        md:hidden absolute w-full bg-white/98 backdrop-blur-md shadow-lg
                        transition-all duration-300 ease-in-out overflow-hidden
                        ${menuOpen ? "max-h-[500px] opacity-100 border-t border-gray-100" : "max-h-0 opacity-0"}
                    `}
                >
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handleNavigation(item.href)}
                                className={`
                                    w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                                    text-sm transition-all duration-300
                                    ${location.pathname === item.href
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }
                                `}
                            >
                                <span className={`${location.pathname === item.href ? "text-blue-600" : "text-gray-500"}`}>
                                    {item.icon}
                                </span>
                                {item.name}
                                {location.pathname === item.href && (
                                    <span className="ml-auto w-1 h-4 bg-blue-600 rounded-full"></span>
                                )}
                            </button>
                        ))}

                        <div className="border-t border-gray-100 my-2 pt-2">
                            <button
                                onClick={handleWhatsApp}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm py-2.5 rounded-lg transition-all duration-300 hover:shadow-md"
                            >
                                <MessageCircle size={14} />
                                Hubungi WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer untuk konten di bawah navbar */}
            <div className="h-12 md:h-14"></div>
        </>
    );
}