import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/solit03.jpeg";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);

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
                sticky top-0 w-full z-50
                transition-all duration-200 ease-in-out
                bg-surface text-content border-b border-border
                ${scrolled ? "shadow-md bg-surface" : ""}
            `}
        >
            {/* Main Nav Row */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-1.5 pb-0.5">
                <div className="flex justify-between items-center h-11 md:h-12 border-b border-border pb-1">

                    {/* Logo Verge Style */}
                    <button onClick={() => handleNavigation("/")} className="group focus:outline-none flex items-center gap-2">
                        <img src={logo} alt="Solit 03" className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover ring-2 ring-border group-hover:ring-blue-500 transition-all shadow-md" />
                        <span className="text-lg md:text-xl font-black tracking-tight text-content font-['Hanken_Grotesk',sans-serif] uppercase flex items-center">
                            SOLIT<span className="text-blue-500 font-black ml-0.5">03</span>
                        </span>
                    </button>

                    {/* Desktop Navigation with Slashes `/` */}
                    <ul className="hidden md:flex items-center gap-2.5 text-xs md:text-[13px] font-medium text-content-muted">
                        {navLinks.map((item, i) => (
                            <li key={i} className="flex items-center gap-2.5">
                                <span className="text-content-muted font-light select-none">/</span>
                                <button
                                    onClick={() => handleNavigation(item.href)}
                                    className={`
                                        transition-colors duration-150 py-0.5 px-0.5 relative
                                        ${location.pathname === item.href
                                            ? "text-content font-bold tracking-tight underline decoration-blue-500 underline-offset-6 decoration-2"
                                            : "text-content-muted hover:text-content"
                                        }
                                    `}
                                >
                                    {item.name}
                                </button>
                            </li>
                        ))}
                        
                    </ul>

                    {/* Desktop Theme Toggle & Mobile Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle (Desktop & Mobile) */}
                        <div className="relative">
                            <button
                                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                                className="p-2 -m-0.5 rounded-md text-content-muted hover:text-content hover:bg-surface-muted transition"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? <Moon size={18} /> : theme === "light" ? <Sun size={18} /> : <Monitor size={18} />}
                            </button>
                            
                            {themeMenuOpen && (
                                <>
                                <div className="fixed inset-0 z-40" onClick={() => setThemeMenuOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-36 bg-surface border border-border rounded-lg shadow-xl py-1 z-50">
                                    <button onClick={() => { setTheme("light"); setThemeMenuOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left ${theme === "light" ? "text-blue-500 font-bold bg-surface-muted" : "text-content hover:bg-surface-muted"}`}>
                                        <Sun size={14} /> Light
                                    </button>
                                    <button onClick={() => { setTheme("dark"); setThemeMenuOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left ${theme === "dark" ? "text-blue-500 font-bold bg-surface-muted" : "text-content hover:bg-surface-muted"}`}>
                                        <Moon size={14} /> Dark
                                    </button>
                                    <button onClick={() => { setTheme("system"); setThemeMenuOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left ${theme === "system" ? "text-blue-500 font-bold bg-surface-muted" : "text-content hover:bg-surface-muted"}`}>
                                        <Monitor size={14} /> System
                                    </button>
                                </div>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2 -m-0.5 rounded-md text-content-muted hover:text-content hover:bg-surface-muted"
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
                    md:hidden absolute w-full bg-surface text-content border-t border-border shadow-2xl
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
                                    ? "bg-surface-muted text-blue-500 font-bold"
                                    : "text-content-muted hover:bg-surface-muted hover:text-content"
                                }
                            `}
                        >
                            <span className="text-content-muted font-mono">/</span>
                            <span>{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
