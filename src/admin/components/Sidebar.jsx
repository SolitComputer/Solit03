import {
  LayoutDashboard,
  Laptop,
  Tags,
  Layers3,
  Shapes,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menus = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin", exact: true },
    { name: "Products", icon: Laptop, path: "/admin/products", exact: false },
    { name: "Brands", icon: Tags, path: "/admin/brands", exact: false },
    { name: "Categories", icon: Layers3, path: "/admin/categories", exact: false },
    { name: "Tags", icon: Shapes, path: "/admin/tags", exact: false }
  ];

  const toggleSidebar = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    } else {
      setCollapsed(!collapsed);
    }
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

  // Check if route is active (support nested routes)
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
          className="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-30
          bg-white shadow-xl
          transition-all duration-300 ease-in-out
          flex flex-col
          ${collapsed ? "w-20" : "w-72"}
          ${collapsed && isMobile ? "-translate-x-full" : "translate-x-0"}
          h-screen
        `}
      >
        {/* Logo Section */}
        <div className={`
          flex items-center justify-between
          h-20 px-5 border-b border-gray-100
          ${collapsed ? "px-3 justify-center" : ""}
        `}>
          {!collapsed ? (
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              Solit Admin
            </h1>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          )}

          {/* Toggle Button - Desktop only */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition"
          >
            {collapsed ? (
              <ChevronRight size={18} className="text-gray-500" />
            ) : (
              <ChevronLeft size={18} className="text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menus.map((menu, index) => {
            const Icon = menu.icon;
            const active = isActive(menu);

            return (
              <Link
                key={index}
                to={menu.path}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3
                  px-4 py-3 rounded-xl
                  transition-all duration-200
                  group relative
                  ${active
                    ? "bg-blue-700 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-700"
                  }
                  ${collapsed ? "justify-center px-2" : ""}
                `}
                title={collapsed ? menu.name : ""}
              >
                <Icon size={20} className="flex-shrink-0" />

                {!collapsed && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    {menu.name}
                  </span>
                )}

                {/* Tooltip untuk collapsed mode */}
                {collapsed && (
                  <div className="
                    absolute left-full ml-3 px-2 py-1
                    bg-gray-800 text-white text-xs rounded
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

        {/* Footer */}
        <div className={`
          p-4 border-t border-gray-100
          ${collapsed ? "px-2" : ""}
        `}>
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full
              px-4 py-3 rounded-xl
              text-red-600 hover:bg-red-50
              transition-all duration-200
              ${collapsed ? "justify-center px-2" : ""}
            `}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      {isMobile && collapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 left-6 z-20 bg-blue-700 text-white p-3 rounded-full shadow-lg lg:hidden hover:bg-blue-800 transition-all duration-200"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </>
  );
}