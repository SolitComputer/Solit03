import { Bell, Search, ArrowLeft, Home, Phone, MessageCircle, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../assets/solit03.jpeg";


const WHATSAPP_NUMBER = "6285210647047";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const paths = location.pathname.split("/").filter(path => path);
    const crumbs = [];

    let currentPath = "";
    for (let i = 0; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;
      const label = paths[i].charAt(0).toUpperCase() + paths[i].slice(1);

      let customLabel = label;
      if (paths[i] === "admin") customLabel = "Dashboard";
      if (paths[i] === "products") customLabel = "Products";
      if (paths[i] === "brands") customLabel = "Brands";
      if (paths[i] === "categories") customLabel = "Categories";
      if (paths[i] === "tags") customLabel = "Tags";
      if (paths[i] === "create") customLabel = "Tambah Produk";
      if (paths[i] === "edit") customLabel = "Edit Produk";
      if (paths[i] === "katalog") customLabel = "Katalog Laptop";
      if (paths[i] === "jual-beli") customLabel = "Jual Beli";
      if (paths[i] === "tentang") customLabel = "Tentang Kami";
      if (paths[i] === "sosial-media") customLabel = "Sosial Media";

      crumbs.push({
        label: customLabel,
        path: currentPath,
        isLast: i === paths.length - 1
      });
    }

    setBreadcrumbs(crumbs);
  }, [location]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleWhatsApp = () => {
    const message = "Halo Solit 03, saya ingin bertanya tentang produk dan layanan Anda.";
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const canGoBack = window.history.length > 1;
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Navigation items for non-admin pages
  const navItems = [
    { name: "Beranda", path: "/", icon: "🏠" },
    { name: "Katalog", path: "/katalog", icon: "💻" },
    { name: "Jual Beli", path: "/jual-beli", icon: "💰" },
    { name: "Tentang", path: "/tentang", icon: "📖" },
    { name: "Sosial Media", path: "/sosial-media", icon: "📱" },
  ];

  return (
    <>
      <header className="h-16 bg-white border-b px-4 md:px-6 flex items-center justify-between gap-4 shadow-sm sticky top-0 z-40">
        {/* Left Section - Back Button & Breadcrumb */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {canGoBack && (
            <button
              onClick={handleBack}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              title="Kembali"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs sm:text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button
              onClick={() => navigate(isAdminRoute ? "/admin" : "/")}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-700 transition"
            >
              <Home size={14} />
              <span className="hidden sm:inline">{isAdminRoute ? "Dashboard" : "Home"}</span>
            </button>

            {breadcrumbs.map((crumb, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-gray-400 text-xs">/</span>
                {crumb.isLast ? (
                  <span className="text-blue-700 font-semibold truncate text-xs sm:text-sm">
                    {crumb.label}
                  </span>
                ) : (
                  <button
                    onClick={() => navigate(crumb.path)}
                    className="text-gray-500 hover:text-blue-700 transition truncate text-xs sm:text-sm"
                  >
                    {crumb.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Navigation (Non-Admin) */}
        {!isAdminRoute && (
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === item.path
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  }`}
              >
                <span className="flex items-center gap-1.5">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsApp}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-all duration-300 text-sm font-medium"
            title="Hubungi via WhatsApp"
          >
            <MessageCircle size={16} />
            <span className="hidden lg:inline">WhatsApp</span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Solit 03"
              className="w-7 h-7 rounded-full shadow-sm object-cover"
            />

            <div className="hidden sm:block">
              <p className="font-semibold text-xs text-gray-800">
                {isAdminRoute ? "Solit Admin" : "Solit 03"}
              </p>
              <p className="text-[10px] text-gray-500">
                {isAdminRoute ? "Administrator" : "Customer"}
              </p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          {!isAdminRoute && (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {!isAdminRoute && showMobileMenu && (
        <div className="fixed inset-x-0 top-16 bottom-0 bg-white z-30 md:hidden shadow-lg overflow-y-auto">
          <div className="p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${location.pathname === item.path
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}

            <div className="border-t border-gray-100 my-3 pt-3">
              <button
                onClick={() => {
                  handleWhatsApp();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-green-50 text-green-700"
              >
                <MessageCircle size={18} />
                <span>Hubungi WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          onClick={handleWhatsApp}
          className="w-12 h-12 bg-green-500 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <MessageCircle size={22} className="text-white" />
        </button>
      </div>
    </>
  );
}