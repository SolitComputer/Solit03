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
    <header className="h-16 bg-surface border-b border-border px-4 md:px-6 flex items-center justify-between gap-4 shadow-sm sticky top-0 z-40">
      {/* Left — Back button & Breadcrumb */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {canGoBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            title="Kembali"
          >
            <ArrowLeft size={18} className="text-content-soft" />
          </button>
        )}

        <div className="flex items-center gap-1.5 text-xs sm:text-sm overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1 text-content-muted hover:text-blue-700 transition"
          >
            <Home size={14} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          {breadcrumbs.slice(1).map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-gray-300 text-xs">/</span>
              {crumb.isLast ? (
                <span className="text-blue-700 font-semibold truncate text-xs sm:text-sm">
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => navigate(crumb.path)}
                  className="text-content-muted hover:text-blue-700 transition truncate text-xs sm:text-sm"
                >
                  {crumb.label}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right — Preview site, Theme & user menu */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-surface-muted hover:bg-gray-100 text-content-soft hover:text-blue-700 rounded-lg transition-all duration-200 text-sm font-medium"
          title="Lihat website"
        >
          <ExternalLink size={15} />
          <span className="hidden lg:inline">Lihat Website</span>
        </a>

        {/* Theme Toggle */}
        <div className="relative">
          <button
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="p-1.5 rounded-lg text-content-muted hover:text-content hover:bg-surface-muted transition-colors"
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

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-surface-muted transition-colors"
          >
            <img src={logo} alt="Solit 03" className="w-7 h-7 rounded-full shadow-sm object-cover" />
            <div className="hidden sm:block text-left">
              <p className="font-semibold text-xs text-content leading-tight">Solit Admin</p>
              <p className="text-[10px] text-content-muted leading-tight">Administrator</p>
            </div>
            <ChevronDown size={14} className={`hidden sm:block text-content-muted transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg py-1.5 z-50">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden flex items-center gap-2 px-3.5 py-2 text-sm text-content-muted hover:bg-surface-muted transition"
              >
                <ExternalLink size={15} /> Lihat Website
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
