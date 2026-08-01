import {
  Laptop, Package, Tags, Layers3, Star, Clock,
  PlusCircle, MinusCircle, AlertCircle, ArrowUpRight,
  ArrowDownRight, ShoppingBag, ChevronRight, 
  TrendingUp, TrendingDown, Zap, Sparkles, 
  BarChart3, Activity, Award, Eye, ShoppingCart,
  UserCheck, CreditCard, Settings, HelpCircle,
  Bell, Search, Menu, Grid3X3, List, Filter,
  Download, RefreshCw, MoreVertical, Globe
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { Link } from "react-router-dom";

function Skeleton({ className }) {
  return <div className={`bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer rounded ${className}`} />;
}

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [recentActivities] = useState([
    { id: 1, action: "Menambahkan produk baru", target: "ASUS ROG Zephyrus", time: "2 menit lalu", type: "create", user: "Admin" },
    { id: 2, action: "Mengupdate stok", target: "MacBook Pro M3", time: "1 jam lalu", type: "update", user: "Staff" },
    { id: 3, action: "Menghapus brand", target: "Acer", time: "3 jam lalu", type: "delete", user: "Admin" },
    { id: 4, action: "Menambahkan kategori", target: "Gaming Laptop", time: "5 jam lalu", type: "create", user: "Admin" },
    { id: 5, action: "Mengupdate harga", target: "Lenovo Legion Pro", time: "1 hari lalu", type: "update", user: "Staff" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const [
        { count: pc }, { count: bc }, { count: cc },
        { data: sd }, { data: rd }, { data: ls }, { data: pd }
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("brands").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("products").select("stock"),
        supabase.from("products").select("*,brands(name),categories(name)").order("created_at", { ascending: false }).limit(5),
        supabase.from("products").select("*,brands(name)").lt("stock", 10).order("stock", { ascending: true }).limit(5),
        supabase.from("products").select("*,brands(name)").order("price", { ascending: false }).limit(5),
      ]);

      const totalStock = sd?.reduce((a, i) => a + (i.stock || 0), 0) || 0;
      setStats([
        { label: "Total Produk", value: pc || 0, icon: Laptop, trend: "+12%", up: true, color: "blue", subtitle: "Aktif" },
        { label: "Brand", value: bc || 0, icon: Tags, trend: "+2", up: true, color: "violet", subtitle: "Tersedia" },
        { label: "Kategori", value: cc || 0, icon: Layers3, trend: "+1", up: true, color: "emerald", subtitle: "Produk" },
        { label: "Total Stok", value: totalStock, icon: Package, trend: "-5%", up: false, color: "amber", subtitle: "Unit" },
      ]);
      setRecentProducts(rd || []);
      setLowStockProducts(ls || []);
      setPopularProducts(pd || []);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }

  const colorMap = {
    blue: { 
      dot: "bg-blue-500", 
      bg: "bg-blue-50 dark:bg-blue-500/10", 
      text: "text-blue-600 dark:text-blue-400", 
      bar: "from-blue-500 to-blue-400",
      gradient: "from-blue-600 to-blue-500",
      light: "bg-blue-100 dark:bg-blue-900/40",
      dark: "bg-blue-700 dark:bg-blue-300"
    },
    violet: { 
      dot: "bg-violet-500", 
      bg: "bg-violet-50 dark:bg-violet-500/10", 
      text: "text-violet-600 dark:text-violet-400", 
      bar: "from-violet-500 to-violet-400",
      gradient: "from-violet-600 to-violet-500",
      light: "bg-violet-100 dark:bg-violet-900/40",
      dark: "bg-violet-700 dark:bg-violet-300"
    },
    emerald: { 
      dot: "bg-emerald-500", 
      bg: "bg-emerald-50 dark:bg-emerald-500/10", 
      text: "text-emerald-600 dark:text-emerald-400", 
      bar: "from-emerald-500 to-emerald-400",
      gradient: "from-emerald-600 to-emerald-500",
      light: "bg-emerald-100 dark:bg-emerald-900/40",
      dark: "bg-emerald-700 dark:bg-emerald-300"
    },
    amber: { 
      dot: "bg-amber-500", 
      bg: "bg-amber-50 dark:bg-amber-500/10", 
      text: "text-amber-600 dark:text-amber-400", 
      bar: "from-amber-500 to-amber-400",
      gradient: "from-amber-600 to-amber-500",
      light: "bg-amber-100 dark:bg-amber-900/40",
      dark: "bg-amber-700 dark:bg-amber-300"
    },
  };

  const actColor = { 
    create: "bg-emerald-100 text-emerald-600", 
    update: "bg-blue-100 text-blue-600", 
    delete: "bg-red-100 text-red-500" 
  };
  const ActIcon = { create: PlusCircle, update: Package, delete: MinusCircle };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-64 h-4" />
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="w-16 h-4" />
              </div>
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-16 h-8" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <Skeleton className="w-40 h-5 mb-6" />
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4 items-center mb-4">
                <Skeleton className="w-28 h-3" />
                <Skeleton className="flex-1 h-7 rounded-lg" />
              </div>
            ))}
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <Skeleton className="w-32 h-5 mb-4" />
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 items-center p-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-32 h-3" />
                  <Skeleton className="w-24 h-2.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          {[1, 2].map(i => (
            <div key={i} className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <Skeleton className="w-36 h-5" />
              </div>
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="px-6 py-4 flex items-center gap-4 border-b border-border">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-40 h-3" />
                    <Skeleton className="w-24 h-2.5" />
                  </div>
                  <Skeleton className="w-20 h-3" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Animated CSS */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        .animate-slide-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
        }
        .stat-card {
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        .stat-card:hover::before {
          left: 100%;
        }
      `}</style>

      {/* Header dengan Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-4 animate-slide-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-7 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full"></div>
            <h1 className="text-xl font-bold text-content">Dashboard Overview</h1>
           
          </div>
          <p className="text-sm text-content-muted ml-3">
            Selamat datang Di Dashboard Admin
          </p>
        </div>
        <div className="flex items-center gap-2">
        </div>
      </div>

      {/* Stats Cards dengan efek modern */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, trend, up, color }, idx) => {
          const c = colorMap[color];
          return (
            <div 
              key={label} 
              className="stat-card bg-surface border border-border rounded-2xl p-5 shadow-sm card-hover cursor-pointer animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                  <Icon size="20" strokeWidth={1.5} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${
                  up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                }`}>
                  {up ? <TrendingUp size="12" /> : <TrendingDown size="12" />}
                  {trend}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-content-muted font-medium uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-content mt-1">{value.toLocaleString()}</p>
                <p className="text-[10px] text-content-muted mt-1">{stats.find(s => s.label === label)?.subtitle}</p>
              </div>
              {/* Progress bar mini */}
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${c.bar} rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min((value / 1000) * 100, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Quick Actions dengan desain premium */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Stock Bar Chart */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm card-hover animate-slide-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size="18" className="text-content-soft" />
                <h2 className="text-base font-semibold text-content">Distribusi Stok</h2>
              </div>
              <p className="text-xs text-content-muted mt-1">Visualisasi stok 5 produk teratas</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-content-muted">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Unit tersedia</span>
            </div>
          </div>
          <div className="space-y-4">
            {recentProducts.slice(0, 5).map((p, i) => {
              const c = Object.values(colorMap)[i % 4];
              const pct = Math.min((p.stock / 100) * 100, 100);
              return (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-content-muted w-6">{i+1}</span>
                      <span className="text-xs font-medium text-content-soft truncate max-w-[120px]">{p.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-content-soft">{p.stock} unit</span>
                  </div>
                  <div className="relative h-7 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full bg-gradient-to-r ${c.bar} rounded-lg transition-all duration-1000 ease-out flex items-center justify-end px-3`}
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    >
                      <span className="text-[10px] text-white font-semibold">{Math.round(pct)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions dengan ikon premium */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm card-hover animate-slide-left">
          <div className="flex items-center gap-2 mb-4">
            <Zap size="18" className="text-amber-500" />
            <h2 className="text-base font-semibold text-content">Aksi Cepat</h2>
          </div>
          <div className="space-y-3">
            {[
              { to: "/admin/products/create", label: "Tambah Produk", desc: "Masukkan laptop baru", icon: PlusCircle, color: "blue" },
              { to: "/admin/brands", label: "Kelola Brand", desc: "Atur brand laptop", icon: Tags, color: "violet" },
              { to: "/admin/categories", label: "Kelola Kategori", desc: "Atur kategori produk", icon: Layers3, color: "emerald" },
            ].map(({ to, label, desc, icon: Icon, color }) => {
              const c = colorMap[color];
              return (
                <Link 
                  key={to} 
                  to={to} 
                  className={`flex items-center gap-4 p-3 rounded-xl ${c.bg} transition-all duration-300 group hover:shadow-md`}
                >
                  <div className={`w-10 h-10 bg-surface rounded-xl flex items-center justify-center ${c.text} shadow-sm group-hover:scale-110 transition`}>
                    <Icon size="18" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-content">{label}</p>
                    <p className="text-[11px] text-content-muted">{desc}</p>
                  </div>
                  <ChevronRight size="16" className={`${c.text} opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1`} />
                </Link>
              );
            })}
          </div>
          {/* Motivational quote */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-[10px] text-content-muted text-center">
              Terus kembangkan koleksi laptop terbaikmu!
            </p>
          </div>
        </div>
      </div>

      {/* Tables dengan desain modern */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Products */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden card-hover">
          <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag size="18" className="text-content-soft" />
                  <h2 className="text-base font-semibold text-content">Produk Terbaru</h2>
                </div>
                <p className="text-xs text-content-muted mt-1">5 produk yang baru ditambahkan</p>
              </div>
              <Link to="/admin/products" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
                Lihat semua
                <ChevronRight size="14" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProducts.length === 0 ? (
              <div className="py-12 text-center">
                <Package size="40" className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-content-muted">Belum ada produk</p>
              </div>
            ) : recentProducts.map((p, idx) => (
              <div 
                key={p.id} 
                className="px-6 py-4 hover:bg-surface-muted/80 transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt="" className="w-10 h-10 rounded-xl object-cover border border-border shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <Laptop size="16" className="text-content-muted" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-content truncate group-hover:text-blue-600 transition">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-content-muted mt-0.5">
                        {p.brands?.name} · {p.categories?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-bold text-content">
                      Rp {p.price?.toLocaleString()}
                    </p>
                    <p className={`text-[11px] font-medium mt-0.5 ${
                      p.stock > 0 ? "text-emerald-600" : "text-red-500"
                    }`}>
                      {p.stock} unit
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert dengan desain premium */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden card-hover">
          <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-amber-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <AlertCircle size="18" className="text-amber-500" />
                  <h2 className="text-base font-semibold text-content">Peringatan Stok</h2>
                </div>
                <p className="text-xs text-content-muted mt-1">Stok menipis, perlu restock!</p>
              </div>
              <Link to="/admin/products" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
                Kelola
                <ChevronRight size="14" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStockProducts.length === 0 ? (
              <div className="py-12 text-center">
                <Award size="40" className="mx-auto text-emerald-200 mb-3" />
                <p className="text-sm text-content-muted">Semua stok dalam kondisi aman</p>
              </div>
            ) : lowStockProducts.map((p) => (
              <div key={p.id} className="px-6 py-4 hover:bg-amber-50/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-content">{p.name}</p>
                    <p className="text-[11px] text-content-muted mt-0.5">{p.brands?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                      p.stock === 0 
                        ? "bg-red-100 text-red-600" 
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {p.stock === 0 ? "HABIS" : `${p.stock} unit`}
                    </div>
                    <Link 
                      to={`/admin/products/edit/${p.id}`}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50 transition"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
                {/* Progress bar untuk stok */}
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      p.stock === 0 ? "bg-red-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${(p.stock / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular + Activities dengan desain modern */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top Priced Products */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles size="18" className="text-amber-500" />
              <h2 className="text-base font-semibold text-content">Produk Premium</h2>
            </div>
            <div className="px-2 py-1 bg-amber-50 rounded-lg">
              <span className="text-[10px] font-semibold text-amber-600">Harga Tertinggi</span>
            </div>
          </div>
          <div className="space-y-3">
            {popularProducts.map((p, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 to-transparent transition-all duration-300 group"
              >
                <div className="relative">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    i === 0 ? "bg-amber-100 text-amber-700" :
                    i === 1 ? "bg-gray-200 text-content-soft" :
                    i === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-gray-100 text-content-muted"
                  }`}>
                    {i + 1}
                  </div>
                  {i === 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3">
                      <div className="animate-ping absolute w-full h-full rounded-full bg-amber-400 opacity-75"></div>
                      <div className="relative w-full h-full rounded-full bg-amber-500"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-content group-hover:text-blue-600 transition">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-content-muted mt-0.5">{p.brands?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">
                    Rp {p.price?.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-content-muted mt-0.5">Premium</p>
                </div>
              </div>
            ))}
          </div>
          {/* Total value */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-content-muted">Total nilai produk</span>
              <span className="text-sm font-bold text-content">
                Rp {popularProducts.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activities dengan timeline */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm card-hover">
          <div className="flex items-center gap-2 mb-5">
            <Activity size="18" className="text-content-soft" />
            <h2 className="text-base font-semibold text-content">Aktivitas Terbaru</h2>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>
            <div className="space-y-4">
              {recentActivities.map((a, idx) => {
                const Icon = ActIcon[a.type];
                return (
                  <div key={a.id} className="relative flex items-start gap-3 pl-6 group animate-slide-left" style={{ animationDelay: `${idx * 100}ms` }}>
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5">
                      <div className={`w-2 h-2 rounded-full ring-4 ring-white ${actColor[a.type].split(' ')[0].replace('bg-', 'bg-')}`}></div>
                    </div>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${actColor[a.type]} transition group-hover:scale-110`}>
                      <Icon size="14" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="text-sm text-content-soft">
                          <span className="font-semibold">{a.action}</span>
                          <span className="text-content-muted"> · {a.target}</span>
                        </p>
                        <span className="text-[10px] text-content-muted bg-surface-muted px-2 py-0.5 rounded-full">
                          {a.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <UserCheck size="10" className="text-content-muted" />
                        <p className="text-[10px] text-content-muted">{a.user}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* View all activities */}
          <button className="mt-5 w-full py-2 text-center text-xs text-content-muted hover:text-content-soft font-medium rounded-xl hover:bg-surface-muted transition">
            Lihat semua aktivitas
          </button>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center pt-4">
        <p className="text-[10px] text-content-muted">
          Dashboard diperbarui secara real-time • Data akurat per {new Date().toLocaleTimeString('id-ID')}
        </p>
      </div>
    </div>
  );
}