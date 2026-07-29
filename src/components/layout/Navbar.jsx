import { useState, useEffect } from "react";
import { Menu, X, Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/solit03.jpeg";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && menuOpen) setMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [menuOpen]);

    const handleNavigation = (href) => {
        navigate(href);
        setMenuOpen(false);
    };

    const navLinks = [
        { name: "Beranda",     href: "/" },
        { name: "Katalog",      href: "/katalog" },
        { name: "Berita",       href: "/berita" },
        { name: "Jual-Beli",   href: "/jual-beli" },
        { name: "Tentang",     href: "/tentang" },
        { name: "Sosial",      href: "/sosial-media" },
        { name: "Garansi",     href: "/cek-garansi" },
        { name: "Antrian",     href: "/cek-antrian" },
    ];

    return (
        <nav
            className={`
                relative w-full z-50
                transition-all duration-200 ease-in-out
                bg-[#0f172a] text-white border-b border-slate-800
                ${scrolled ? "shadow-md bg-[#0f172a]" : ""}
            `}
        >
            {/* Main Nav Row */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-1.5 pb-0.5">
                <div className="flex justify-between items-center h-11 md:h-12 border-b border-white/80 pb-1">

                    {/* Logo Verge Style */}
                    <button onClick={() => handleNavigation("/")} className="group focus:outline-none flex items-center gap-2">
                        <img src={logo} alt="Solit 03" className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-blue-500 transition-all shadow-md" />
                        <span className="text-lg md:text-xl font-black tracking-tight text-white font-['Hanken_Grotesk',sans-serif] uppercase flex items-center">
                            SOLIT<span className="text-blue-500 font-black ml-0.5">03</span>
                        </span>
                    </button>

                    {/* Desktop Navigation with Slashes `/` */}
                    <ul className="hidden md:flex items-center gap-2.5 text-xs md:text-[13px] font-medium text-slate-300">
                        {navLinks.map((item, i) => (
                            <li key={i} className="flex items-center gap-2.5">
                                <span className="text-slate-600 font-light select-none">/</span>
                                <button
                                    onClick={() => handleNavigation(item.href)}
                                    className={`
                                        transition-colors duration-150 py-0.5 px-0.5 relative
                                        ${location.pathname === item.href
                                            ? "text-white font-bold tracking-tight underline decoration-blue-500 underline-offset-6 decoration-2"
                                            : "text-slate-300 hover:text-white"
                                        }
                                    `}
                                >
                                    {item.name}
                                </button>
                            </li>
                        ))}
                        
                    </ul>

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-1.5 rounded-md text-slate-200 hover:text-white hover:bg-slate-800"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu (Dark Verge Style) */}
            <div
                className={`
                    md:hidden absolute w-full bg-[#0f172a] text-white border-t border-slate-800 shadow-2xl
                    transition-all duration-300 ease-in-out overflow-hidden
                    ${menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
                `}
            >
                <div className="px-4 py-3 space-y-1">
                    {navLinks.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => handleNavigation(item.href)}
                            className={`
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-md
                                text-xs font-semibold tracking-wide transition-all text-left
                                ${location.pathname === item.href
                                    ? "bg-slate-800 text-blue-400 font-bold"
                                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                                }
                            `}
                        >
                            <span className="text-slate-600 font-mono">/</span>
                            <span>{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
