import { ArrowLeft, Home, ExternalLink, LogOut, ChevronDown, Sun, Moon, Monitor } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { supabase } from "../../services/supabase";
import logo from "../../assets/solit03.jpeg";

const LABELS = {
  admin: "Dashboard",
  "site-content": "Konten Homepage",
  services: "Layanan",
  "promo-images": "Showcase Laptop",
  testimonials: "Video Testimoni",
  products: "Products",
  brands: "Brands",
  categories: "Categories",
  tags: "Tags",
  create: "Tambah",
  edit: "Edit",
  "katalog-foto": "Foto Katalog",
  articles: "Artikel",
  "article-categories": "Kategori Artikel",
  "article-tags": "Tag Artikel",
  "cookie-tracking": "Cookie Tracking",
  "article-ads": "Iklan Artikel",
};

function labelFor(segment) {
  return LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const paths = location.pathname.split("/").filter(Boolean);
    let currentPath = "";
    const crumbs = paths.map((seg, i) => {
      currentPath += `/${seg}`;
      return { label: labelFor(seg), path: currentPath, isLast: i === paths.length - 1 };
    });
    setBreadcrumbs(crumbs);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const canGoBack = window.history.length > 1;

  async function handleLogout() {
    const confirmLogout = window.confirm("Yakin ingin logout?");
    if (!confirmLogout) return;
    const { error } = await supabase.auth.signOut();
    if (error) return alert("Gagal logout");
    navigate("/admin/login");
  }

  return (
    <header className="h-16 bg-surface border-b border-border px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-40">
      {/* Left — Back button & Breadcrumb */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {canGoBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-content-muted hover:text-content hover:bg-surface-muted transition-colors flex-shrink-0"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="flex items-center gap-1.5 text-xs sm:text-sm overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1.5 text-content-muted hover:text-blue-600 font-medium transition"
          >
            <Home size={15} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          {breadcrumbs.slice(1).map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-content-muted/40 text-xs font-light">/</span>
              {crumb.isLast ? (
                <span className="text-blue-600 dark:text-blue-400 font-bold truncate text-xs sm:text-sm">
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => navigate(crumb.path)}
                  className="text-content-muted hover:text-blue-600 font-medium transition truncate text-xs sm:text-sm"
                >
                  {crumb.label}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right — Preview site, Theme & user menu */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-surface-muted hover:bg-gray-100 dark:hover:bg-slate-800 border border-border text-content-soft hover:text-blue-600 rounded-xl transition-all text-xs font-semibold"
          title="Lihat website"
        >
          <ExternalLink size={14} />
          <span className="hidden lg:inline">Lihat Website</span>
        </a>

        {/* Theme Toggle */}
        <div className="relative">
          <button
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="p-2 rounded-xl text-content-muted hover:text-content hover:bg-surface-muted transition-colors border border-transparent hover:border-border"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Moon size={18} /> : theme === "light" ? <Sun size={18} /> : <Monitor size={18} />}
          </button>
          
          {themeMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setThemeMenuOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-36 bg-surface border border-border rounded-xl shadow-xl py-1.5 z-50">
                <button onClick={() => { setTheme("light"); setThemeMenuOpen(false); }} className={`w-full flex items-center gap-2 px-3.5 py-2 text-xs text-left font-medium ${theme === "light" ? "text-blue-600 font-bold bg-blue-50/60 dark:bg-blue-950/40" : "text-content-soft hover:bg-surface-muted"}`}>
                  <Sun size={14} /> Light
                </button>
                <button onClick={() => { setTheme("dark"); setThemeMenuOpen(false); }} className={`w-full flex items-center gap-2 px-3.5 py-2 text-xs text-left font-medium ${theme === "dark" ? "text-blue-600 font-bold bg-blue-50/60 dark:bg-blue-950/40" : "text-content-soft hover:bg-surface-muted"}`}>
                  <Moon size={14} /> Dark
                </button>
                <button onClick={() => { setTheme("system"); setThemeMenuOpen(false); }} className={`w-full flex items-center gap-2 px-3.5 py-2 text-xs text-left font-medium ${theme === "system" ? "text-blue-600 font-bold bg-blue-50/60 dark:bg-blue-950/40" : "text-content-soft hover:bg-surface-muted"}`}>
                  <Monitor size={14} /> System
                </button>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-surface-muted border border-transparent hover:border-border transition-colors"
          >
            <img src={logo} alt="Solit 03" className="w-8 h-8 rounded-full shadow-xs object-cover border border-border" />
            <div className="hidden sm:block text-left">
              <p className="font-bold text-xs text-content leading-tight">Solit Admin</p>
              <p className="text-[10px] text-content-muted leading-tight font-medium">Administrator</p>
            </div>
            <ChevronDown size={14} className={`hidden sm:block text-content-muted transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl py-1.5 z-50">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden flex items-center gap-2 px-3.5 py-2 text-xs text-content-soft hover:bg-surface-muted transition"
              >
                <ExternalLink size={14} /> Lihat Website
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
