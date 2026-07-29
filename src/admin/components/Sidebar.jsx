import {
  LayoutDashboard,
  Laptop,
  Tags,
  Layers3,
  Shapes,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Newspaper,
  FolderKanban,
  Cookie,
  Home,
  Wrench,
  Image as ImageIcon,
  Video,
  Megaphone
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import logo from "../../assets/solit03.jpeg";


export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      } else {
        // Desktop: bisa diatur sesuai preferensi, default uncollapsed
        const savedState = localStorage.getItem("sidebar_collapsed");
        if (savedState !== null) {
          setCollapsed(savedState === "true");
        } else {
          setCollapsed(false);
        }
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save collapsed state ke localStorage
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebar_collapsed", collapsed);
    }
  }, [collapsed, isMobile]);

  const menus = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin", exact: true },
    { name: "Konten Homepage", icon: Home, path: "/admin/site-content", exact: false },
    { name: "Layanan", icon: Wrench, path: "/admin/services", exact: false },
    { name: "Showcase Laptop", icon: ImageIcon, path: "/admin/promo-images", exact: false },
    { name: "Video Testimoni", icon: Video, path: "/admin/testimonials", exact: false },
    { name: "Products", icon: Laptop, path: "/admin/products", exact: false },
    { name: "Brands", icon: Tags, path: "/admin/brands", exact: false },
    { name: "Categories", icon: Layers3, path: "/admin/categories", exact: false },
    { name: "Tags", icon: Shapes, path: "/admin/tags", exact: false },
    { name: "Artikel", icon: Newspaper, path: "/admin/articles", exact: false },
    { name: "Kategori Artikel", icon: FolderKanban, path: "/admin/article-categories", exact: false },
    { name: "Tag Artikel", icon: Shapes, path: "/admin/article-tags", exact: false },
    { name: "Iklan Artikel", icon: Megaphone, path: "/admin/article-ads", exact: false },
    { name: "Cookie Tracking", icon: Cookie, path: "/admin/cookie-tracking", exact: false },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Yakin ingin logout?");
    if (!confirmLogout) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Gagal logout");
      return;
    }

    navigate("/admin/login");
  };

  const isActive = (menu) => {
    if (menu.exact) {
      return location.pathname === menu.path;
    }
    return location.pathname.startsWith(menu.path);
  };

  return (
    <>
      {/* Overlay untuk mobile */}
      {!collapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-30
          bg-white border-r border-gray-100
          transition-all duration-300 ease-in-out
          flex flex-col
          ${collapsed ? "w-16" : "w-56"}
          ${collapsed && isMobile ? "-translate-x-full" : "translate-x-0"}
          h-screen shadow-sm
        `}
      >
        {/* Logo Section - Lebih kecil */}
        <div className={`
          flex items-center justify-between
          h-12 px-3 border-b border-gray-100
          ${collapsed ? "px-2 justify-center" : ""}
        `}>
          {!collapsed ? (<>
            <img
              src={logo}
              alt="Solit 03"
              className="w-7 h-7 rounded-full shadow-sm object-cover"
            />
            <h1 className="text-sm font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              Solit Admin
            </h1>
          </>

          ) : (
            <img
              src={logo}
              alt="Solit 03"
              className="w-7 h-7 rounded-full shadow-sm object-cover"
            />
          )}

          {/* Toggle Button - Desktop only */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-100 transition"
          >
            {collapsed ? (
              <ChevronRight size={14} className="text-gray-400" />
            ) : (
              <ChevronLeft size={14} className="text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation Menu - Font lebih kecil */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {menus.map((menu, index) => {
            const Icon = menu.icon;
            const active = isActive(menu);

            return (
              <Link
                key={index}
                to={menu.path}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-2
                  px-3 py-2 rounded-lg
                  transition-all duration-200
                  group relative
                  ${active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                  }
                  ${collapsed ? "justify-center px-2" : ""}
                `}
                title={collapsed ? menu.name : ""}
              >
                <Icon size={16} className="flex-shrink-0" />

                {!collapsed && (
                  <span className="text-xs font-medium whitespace-nowrap">
                    {menu.name}
                  </span>
                )}

                {/* Tooltip untuk collapsed mode */}
                {collapsed && (
                  <div className="
                    absolute left-full ml-2 px-2 py-1
                    bg-gray-800 text-white text-[10px] rounded
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-200 whitespace-nowrap z-50
                    pointer-events-none
                  ">
                    {menu.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Lebih kecil */}
        <div className={`
          p-2 border-t border-gray-100
          ${collapsed ? "px-2" : ""}
        `}>
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-2 w-full
              px-3 py-2 rounded-lg
              text-red-500 hover:bg-red-50
              transition-all duration-200
              ${collapsed ? "justify-center px-2" : ""}
            `}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!collapsed && <span className="text-xs font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button - Lebih kecil */}
      {isMobile && collapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 z-20 bg-blue-600 text-white p-2 rounded-full shadow-md lg:hidden hover:bg-blue-700 transition-all duration-200"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </>
  );
}