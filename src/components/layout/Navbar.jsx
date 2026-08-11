import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/solit03.jpeg";

/**
 * Struktur menu — dikelompokkan ala situs korporat (Wolverine):
 * beberapa item utama, dropdown yang menampung sub-menu.
 */
const NAV = [
    { name: "Beranda", href: "/" },
    {
        name: "Belanja",
        children: [
            { name: "Katalog", href: "/katalog" },
            { name: "Jual-Beli", href: "/jual-beli" },
        ],
    },
    {
        name: "Layanan",
        children: [
            { name: "Jasa Web", href: "/jasa-pembuatan-website" },
            { name: "Cek Garansi", href: "/cek-garansi" },
            { name: "Cek Antrian", href: "/cek-antrian" },
        ],
    },
    {
        name: "Tentang Kami",
        children: [
            { name: "Tentang", href: "/tentang" },
            { name: "Berita", href: "/berita" },
            { name: "Sosial Media", href: "/sosial-media" },
        ],
    },
];

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const [openGroup, setOpenGroup] = useState(null);      // dropdown desktop (hover)
    const [mobileGroup, setMobileGroup] = useState(null);  // accordion mobile
    const hoverTimer = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
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
        setOpenGroup(null);
        setMobileGroup(null);
    };

    // Cek apakah item (link tunggal / grup) sedang aktif berdasar path
    const isActive = (item) =>
        item.href
            ? location.pathname === item.href
            : item.children?.some((c) => location.pathname === c.href);

    // Hover intent — beri jeda kecil supaya dropdown tak berkedip saat kursor pindah
    const openWithIntent = (name) => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        setOpenGroup(name);
    };
    const closeWithIntent = () => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => setOpenGroup(null), 120);
    };

    return (
        <nav
            className={`
                sticky top-0 w-full z-50
                transition-all duration-300 ease-in-out
                bg-surface text-content border-b border-border
                ${scrolled ? "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] bg-surface/90 backdrop-blur-md" : ""}
            `}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-1.5 pb-0.5">
                <div className="flex justify-between items-center h-11 md:h-12 border-b border-border pb-1">

                    {/* Logo */}
                    <button onClick={() => handleNavigation("/")} className="group focus:outline-none flex items-center gap-2.5">
                        <img
                            src={logo}
                            alt="Solit 03"
                            className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover ring-2 ring-border group-hover:ring-blue-500 group-hover:scale-105 transition-all duration-300 shadow-md"
                        />
                        <span className="text-lg md:text-xl font-black tracking-tight text-content font-['Hanken_Grotesk',sans-serif] uppercase flex items-center">
                            SOLIT<span className="text-blue-500 font-black ml-0.5 group-hover:text-blue-400 transition-colors duration-300">03</span>
                        </span>
                    </button>

                    {/* Desktop Navigation — pill bar (React Bits PillNav style) */}
                    <ul className="hidden md:flex items-center gap-0.5 text-xs md:text-[13px] font-medium rounded-full border border-border bg-surface-muted/70 p-1 backdrop-blur-sm shadow-soft-sm">
                        {NAV.map((item) => {
                            const active = isActive(item);

                            // Link tunggal (Beranda)
                            if (!item.children) {
                                return (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => handleNavigation(item.href)}
                                            onMouseEnter={closeWithIntent}
                                            className={`relative py-1.5 px-3.5 rounded-full transition-colors duration-200
                                                ${active ? "text-white font-semibold" : "text-content-muted hover:text-content hover:bg-surface"}`}
                                        >
                                            {active && (
                                                <motion.span
                                                    layoutId="nav-active-pill"
                                                    className="absolute inset-0 rounded-full bg-blue-600 shadow-[0_6px_16px_-4px_rgba(37,99,235,0.55)]"
                                                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                                                />
                                            )}
                                            <span className="relative z-10">{item.name}</span>
                                        </button>
                                    </li>
                                );
                            }

                            // Grup dengan dropdown
                            const open = openGroup === item.name;
                            return (
                                <li
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={() => openWithIntent(item.name)}
                                    onMouseLeave={closeWithIntent}
                                >
                                    <button
                                        onClick={() => setOpenGroup(open ? null : item.name)}
                                        className={`relative flex items-center gap-1 py-1.5 px-3.5 rounded-full transition-colors duration-200
                                            ${active ? "text-white font-semibold" : open ? "text-content bg-surface" : "text-content-muted hover:text-content hover:bg-surface"}`}
                                        aria-expanded={open}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="nav-active-pill"
                                                className="absolute inset-0 rounded-full bg-blue-600 shadow-[0_6px_16px_-4px_rgba(37,99,235,0.55)]"
                                                transition={{ type: "spring", stiffness: 480, damping: 34 }}
                                            />
                                        )}
                                        <span className="relative z-10">{item.name}</span>
                                        <ChevronDown
                                            className={`relative z-10 w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {open && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                                transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
                                                className="absolute left-0 top-full mt-2 min-w-[190px] origin-top rounded-xl border border-border bg-surface/95 backdrop-blur-md shadow-xl shadow-black/10 p-1.5 z-50"
                                            >
                                                {item.children.map((child) => {
                                                    const childActive = location.pathname === child.href;
                                                    return (
                                                        <button
                                                            key={child.href}
                                                            onClick={() => handleNavigation(child.href)}
                                                            className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors duration-150
                                                                ${childActive
                                                                    ? "text-blue-600 font-semibold bg-blue-500/10"
                                                                    : "text-content-muted hover:text-content hover:bg-surface-muted"}`}
                                                        >
                                                            {child.name}
                                                        </button>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Theme Toggle & Mobile Actions */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                                className="p-2 -m-0.5 rounded-full text-content-muted hover:text-blue-600 hover:bg-surface-muted transition-all duration-200"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? <Moon size={18} /> : theme === "light" ? <Sun size={18} /> : <Monitor size={18} />}
                            </button>

                            {themeMenuOpen && (
                                <>
                                <div className="fixed inset-0 z-40" onClick={() => setThemeMenuOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-40 bg-surface border border-border rounded-xl shadow-xl shadow-black/10 py-1.5 z-50 overflow-hidden">
                                    <button onClick={() => { setTheme("light"); setThemeMenuOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors duration-150 ${theme === "light" ? "text-blue-600 font-semibold bg-blue-500/10" : "text-content hover:bg-surface-muted"}`}>
                                        <Sun size={14} /> Light
                                    </button>
                                    <button onClick={() => { setTheme("dark"); setThemeMenuOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors duration-150 ${theme === "dark" ? "text-blue-600 font-semibold bg-blue-500/10" : "text-content hover:bg-surface-muted"}`}>
                                        <Moon size={14} /> Dark
                                    </button>
                                    <button onClick={() => { setTheme("system"); setThemeMenuOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors duration-150 ${theme === "system" ? "text-blue-600 font-semibold bg-blue-500/10" : "text-content hover:bg-surface-muted"}`}>
                                        <Monitor size={14} /> System
                                    </button>
                                </div>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2 -m-0.5 rounded-full text-content-muted hover:text-blue-600 hover:bg-surface-muted transition-all duration-200 active:scale-90"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu — accordion terkelompok */}
            <div
                className={`
                    md:hidden absolute w-full bg-surface/95 backdrop-blur-md text-content border-t border-border shadow-2xl
                    transition-all duration-300 ease-in-out overflow-hidden
                    ${menuOpen ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0"}
                `}
            >
                <div className="px-4 py-3 space-y-1">
                    {NAV.map((item) => {
                        // Link tunggal (Beranda)
                        if (!item.children) {
                            const active = isActive(item);
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.href)}
                                    className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 text-left
                                        ${active ? "bg-blue-500/10 text-blue-600" : "text-content-muted hover:bg-surface-muted hover:text-content"}`}
                                >
                                    {item.name}
                                </button>
                            );
                        }

                        // Grup accordion
                        const groupActive = isActive(item);
                        const expanded = mobileGroup === item.name;
                        return (
                            <div key={item.name}>
                                <button
                                    onClick={() => setMobileGroup(expanded ? null : item.name)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 text-left
                                        ${groupActive ? "text-blue-600" : "text-content hover:bg-surface-muted"}`}
                                    aria-expanded={expanded}
                                >
                                    <span>{item.name}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
                                    <div className="pl-3 py-1 space-y-1 border-l border-border ml-3">
                                        {item.children.map((child) => {
                                            const childActive = location.pathname === child.href;
                                            return (
                                                <button
                                                    key={child.href}
                                                    onClick={() => handleNavigation(child.href)}
                                                    className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 text-left
                                                        ${childActive ? "bg-blue-500/10 text-blue-600 font-semibold" : "text-content-muted hover:bg-surface-muted hover:text-content"}`}
                                                >
                                                    {child.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
