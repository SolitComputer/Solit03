import {
  Laptop, Package, Tags, Layers3, Star, Clock,
  PlusCircle, MinusCircle, AlertCircle, ArrowUpRight,
  ArrowDownRight, ShoppingBag, ChevronRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { Link } from "react-router-dom";

function Skeleton({ className }) {
  return <div className={`bg-gray-100 rounded animate-pulse ${className}`} />;
}

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [recentActivities] = useState([
    { id: 1, action: "Menambahkan produk baru", target: "ASUS ROG Zephyrus", time: "2 menit lalu", type: "create" },
    { id: 2, action: "Mengupdate stok", target: "MacBook Pro", time: "1 jam lalu", type: "update" },
    { id: 3, action: "Menghapus brand", target: "Acer", time: "3 jam lalu", type: "delete" },
    { id: 4, action: "Menambahkan kategori", target: "Gaming Laptop", time: "5 jam lalu", type: "create" },
    { id: 5, action: "Mengupdate harga", target: "Lenovo Legion", time: "1 hari lalu", type: "update" },
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
        { label: "Products", value: pc || 0, icon: Laptop, trend: "+12%", up: true, color: "blue" },
        { label: "Brands", value: bc || 0, icon: Tags, trend: "+2", up: true, color: "violet" },
        { label: "Categories", value: cc || 0, icon: Layers3, trend: "+1", up: true, color: "emerald" },
        { label: "Total Stock", value: totalStock, icon: Package, trend: "-5%", up: false, color: "amber" },
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
    blue: { dot: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-600", bar: "from-blue-500 to-blue-400" },
    violet: { dot: "bg-violet-500", bg: "bg-violet-50", text: "text-violet-600", bar: "from-violet-500 to-violet-400" },
    emerald: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600", bar: "from-emerald-500 to-emerald-400" },
    amber: { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-600", bar: "from-amber-500 to-amber-400" },
  };

  const actColor = { create: "bg-emerald-100 text-emerald-600", update: "bg-blue-100 text-blue-600", delete: "bg-red-100 text-red-500" };
  const ActIcon = { create: PlusCircle, update: Package, delete: MinusCircle };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="space-y-1"><Skeleton className="w-32 h-5" /><Skeleton className="w-56 h-3.5 mt-1" /></div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between"><Skeleton className="w-8 h-8 rounded-lg" /><Skeleton className="w-12 h-3" /></div>
              <Skeleton className="w-16 h-3" /><Skeleton className="w-10 h-6" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-3">
            <Skeleton className="w-40 h-4 mb-4" />
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-3 items-center"><Skeleton className="w-24 h-3" /><Skeleton className="flex-1 h-6 rounded-lg" /></div>
            ))}
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-2">
            <Skeleton className="w-24 h-4 mb-3" />
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-2.5 items-center p-2.5"><Skeleton className="w-9 h-9 rounded-lg" /><div className="space-y-1.5"><Skeleton className="w-28 h-3" /><Skeleton className="w-20 h-2.5" /></div></div>
            ))}
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-50"><Skeleton className="w-36 h-4" /></div>
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="px-5 py-3.5 flex items-center gap-3 border-b border-gray-50">
                  <Skeleton className="w-8 h-8 rounded-lg" /><div className="flex-1 space-y-1.5"><Skeleton className="w-32 h-3" /><Skeleton className="w-20 h-2.5" /></div>
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
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        <p className="text-xs text-gray-400 mt-0.5">Selamat datang di admin panel Solit</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, trend, up, color }) => {
          const c = colorMap[color];
          return (
            <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${c.bg} ${c.text} flex items-center justify-center group-hover:scale-110 transition`}>
                  <Icon size={15} />
                </div>
                <span className={`flex items-center gap-0.5 text-[10px] font-medium ${up ? "text-emerald-500" : "text-red-400"}`}>
                  {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {trend}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-0.5">{value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Stock Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Distribusi Stok</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Per produk terbaru</p>
            </div>
          </div>
          <div className="space-y-3">
            {recentProducts.slice(0, 5).map((p, i) => {
              const c = Object.values(colorMap)[i % 4];
              const pct = Math.min((p.stock / 100) * 100, 100);
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 text-[11px] text-gray-500 truncate flex-shrink-0">{p.name}</div>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${c.bar} rounded-full flex items-center justify-end px-2 min-w-[32px] transition-all duration-700`}
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    >
                      <span className="text-[9px] text-white font-semibold">{p.stock}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Aksi Cepat</h2>
          <div className="space-y-2">
            {[
              { to: "/admin/products/create", label: "Tambah Produk", desc: "Laptop baru ke katalog", color: "blue" },
              { to: "/admin/brands", label: "Kelola Brand", desc: "Tambah atau edit brand", color: "violet" },
              { to: "/admin/categories", label: "Kelola Kategori", desc: "Atur kategori produk", color: "emerald" },
            ].map(({ to, label, desc, color }) => {
              const c = colorMap[color];
              return (
                <Link key={to} to={to} className={`flex items-center gap-3 p-2.5 rounded-lg hover:${c.bg} transition group`}>
                  <div className={`w-8 h-8 ${c.bg} ${c.text} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition`}>
                    <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700">{label}</p>
                    <p className="text-[10px] text-gray-400 truncate">{desc}</p>
                  </div>
                  <ChevronRight size={12} className="text-gray-300 group-hover:text-gray-400 flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Products */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Produk Terbaru</h2>
              <p className="text-[10px] text-gray-400">5 terakhir ditambahkan</p>
            </div>
            <Link to="/admin/products" className="text-[11px] text-blue-500 hover:text-blue-700 font-medium flex items-center gap-0.5">
              Lihat <ChevronRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProducts.length === 0 ? (
              <div className="py-10 text-center"><ShoppingBag size={28} className="mx-auto text-gray-200 mb-2" /><p className="text-xs text-gray-400">Belum ada produk</p></div>
            ) : recentProducts.map((p) => (
              <div key={p.id} className="px-5 py-3 hover:bg-gray-50/60 transition flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Laptop size={14} className="text-gray-300" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-400">{p.brands?.name} · {p.categories?.name}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-xs font-semibold text-blue-600">Rp {p.price?.toLocaleString()}</p>
                  <p className={`text-[10px] ${p.stock > 0 ? "text-emerald-500" : "text-red-400"}`}>{p.stock} unit</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <AlertCircle size={13} className="text-amber-500" /> Stok Menipis
              </h2>
              <p className="text-[10px] text-gray-400">Stok kurang dari 10 unit</p>
            </div>
            <Link to="/admin/products" className="text-[11px] text-blue-500 hover:text-blue-700 font-medium flex items-center gap-0.5">
              Lihat <ChevronRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStockProducts.length === 0 ? (
              <div className="py-10 text-center"><Package size={28} className="mx-auto text-gray-200 mb-2" /><p className="text-xs text-gray-400">Semua stok aman</p></div>
            ) : lowStockProducts.map((p) => (
              <div key={p.id} className="px-5 py-3 hover:bg-gray-50/60 transition flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400">{p.brands?.name}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md
                    ${p.stock === 0 ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>
                    {p.stock} unit
                  </span>
                  <Link to={`/admin/products/edit/${p.id}`} className="text-[11px] text-blue-500 hover:text-blue-700 font-medium">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular + Activities */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top Priced */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-3">
            <Star size={13} className="text-amber-400 fill-amber-400" /> Produk Premium
          </h2>
          <div className="space-y-2">
            {popularProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition">
                <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400">{p.brands?.name}</p>
                </div>
                <span className="text-xs font-semibold text-blue-600 flex-shrink-0">Rp {p.price?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-3">
            <Clock size={13} className="text-gray-400" /> Aktivitas Terbaru
          </h2>
          <div className="space-y-2.5">
            {recentActivities.map((a) => {
              const Icon = ActIcon[a.type];
              return (
                <div key={a.id} className="flex items-start gap-2.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${actColor[a.type]}`}>
                    <Icon size={11} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">{a.action}</span> · {a.target}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}