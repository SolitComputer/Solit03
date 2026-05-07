import { Bell, Search, ArrowLeft, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

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

  const canGoBack = window.history.length > 1;

  return (
    <header className="h-20 bg-white border-b px-4 md:px-6 flex items-center justify-between gap-4 shadow-sm">
      {/* Left Section - Back Button & Breadcrumb */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {canGoBack && (
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            title="Kembali"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        )}
        
        <div className="flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1 text-gray-500 hover:text-blue-700 transition"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Home</span>
          </button>
          
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-gray-400">/</span>
              {crumb.isLast ? (
                <span className="text-blue-700 font-semibold truncate">
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => navigate(crumb.path)}
                  className="text-gray-500 hover:text-blue-700 transition truncate"
                >
                  {crumb.label}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar - Hidden on mobile
      <div className="hidden md:flex items-center gap-3 bg-gray-100 px-4 py-2.5 rounded-xl w-80 lg:w-96">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Cari produk, brand, kategori..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div> */}

      {/* Right Section - Notifications & User */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 text-white flex items-center justify-center font-bold shadow-sm">
            S
          </div>
          
          <div className="hidden sm:block">
            <p className="font-semibold text-sm text-gray-800">
              Solit Admin
            </p>
            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}