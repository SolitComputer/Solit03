import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
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

    const navLinks = [
        { name: "Beranda", href: "/" },
        { name: "Katalog", href: "/katalog" },
        { name: "Jual-Beli", href: "/jual-beli" },
        { name: "Tentang", href: "/tentang" },
        { name: "Sosial", href: "/sosial-media" }
    ];

    return (
        <>
            <nav
                className={`
                    fixed top-0 left-0 w-full z-50
                    transition-all duration-500 ease-in-out
                    ${showNavbar ? "translate-y-0" : "-translate-y-full"}
                    ${scrolled 
                        ? "bg-white/90 backdrop-blur-xl shadow-sm" 
                        : "bg-white/40 backdrop-blur-md"
                    }
                `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 md:h-16">
                        
                        {/* Logo */}
                        <a href="#" className="group">
                            <h1 className="text-base md:text-lg font-semibold text-blue-900 tracking-tight">
                                Solit 03
                            </h1>
                        </a>

                        {/* Desktop Navigation */}
                        <ul className="hidden md:flex gap-6 lg:gap-8 text-gray-600 text-sm">
                            {navLinks.map((item, i) => (
                                <li key={i}>
                                    <a
                                        href={item.href}
                                        className="relative py-1.5 group transition-colors hover:text-blue-700"
                                    >
                                        {item.name}
                                        <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Desktop CTA Button */}
                        <div className="hidden md:block">
                            <button className="bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-md">
                                Hubungi Kami
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
                                    <X className="w-5 h-5 text-blue-700" />
                                ) : (
                                    <Menu className="w-5 h-5 text-blue-700" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`
                        md:hidden absolute w-full bg-white/95 backdrop-blur-xl shadow-lg
                        transition-all duration-400 ease-in-out overflow-hidden
                        ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                    `}
                >
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map((item, i) => (
                            <a
                                key={i}
                                href={item.href}
                                className="block py-1.5 text-sm text-gray-700 transition-all duration-300 hover:text-blue-700 hover:pl-2"
                                onClick={() => setMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                        
                        <hr className="my-3 border-gray-200" />
                        
                        <button className="w-full bg-blue-700 text-white text-sm py-2 rounded-lg transition-all duration-300 hover:bg-blue-800">
                            Hubungi Kami
                        </button>
                    </div>
                </div>
            </nav>

            <div className="h-14 md:h-16"></div>
        </>
    );
}