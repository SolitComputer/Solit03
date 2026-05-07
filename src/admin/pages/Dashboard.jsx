import {
  Laptop,
  Package,
  Tags,
  Layers3,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Eye,
  Star,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  MinusCircle,
  AlertCircle
} from "lucide-react";

import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { Link } from "react-router-dom";

function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="w-16 h-5 bg-gray-200 rounded"></div>
      </div>
      <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
      <div className="w-32 h-8 bg-gray-200 rounded"></div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="w-40 h-6 bg-gray-200 rounded mb-2"></div>
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-32 h-8 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActionsSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
      <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-48 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="w-32 h-6 bg-gray-200 rounded mb-2"></div>
            <div className="w-48 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-20 h-5 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PopularProductsSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
      <div className="w-40 h-6 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div>
                <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivitiesSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
        <div className="w-32 h-6 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3 pb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="w-48 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-24 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const { count: brandCount } = await supabase
        .from("brands")
        .select("*", { count: "exact", head: true });

      const { count: categoryCount } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });

      const { data: stockData } = await supabase
        .from("products")
        .select("stock");
      const totalStock = stockData?.reduce((acc, item) => acc + (item.stock || 0), 0) || 0;

      // RECENT PRODUCTS (5 terbaru)
      const { data: recentData } = await supabase
        .from("products")
        .select(`
          *,
          brands (name),
          categories (name)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      // LOW STOCK PRODUCTS (stok < 10)
      const { data: lowStockData } = await supabase
        .from("products")
        .select(`
          *,
          brands (name),
          categories (name)
        `)
        .lt("stock", 10)
        .order("stock", { ascending: true })
        .limit(5);

      // HIGHEST PRICE PRODUCTS (Top 5 termahal)
      const { data: popularData } = await supabase
        .from("products")
        .select(`
          *,
          brands (name)
        `)
        .order("price", { ascending: false })
        .limit(5);

      setStats([
        { title: "Total Products", value: productCount || 0, icon: Laptop, color: "blue", change: "+12%", trend: "up" },
        { title: "Brands", value: brandCount || 0, icon: Tags, color: "purple", change: "+2", trend: "up" },
        { title: "Categories", value: categoryCount || 0, icon: Layers3, color: "green", change: "+1", trend: "up" },
        { title: "Total Stock", value: totalStock, icon: Package, color: "orange", change: "-5%", trend: "down" }
      ]);

      setRecentProducts(recentData || []);
      setLowStockProducts(lowStockData || []);
      setPopularProducts(popularData || []);

      // Generate recent activities (simulasi)
      const activities = [
        { id: 1, action: "Menambahkan produk baru", target: "ASUS ROG Zephyrus", time: "2 menit lalu", type: "create" },
        { id: 2, action: "Mengupdate stok", target: "MacBook Pro", time: "1 jam lalu", type: "update" },
        { id: 3, action: "Menghapus brand", target: "Acer", time: "3 jam lalu", type: "delete" },
        { id: 4, action: "Menambahkan kategori baru", target: "Gaming Laptop", time: "5 jam lalu", type: "create" },
        { id: 5, action: "Mengupdate harga", target: "Lenovo Legion", time: "1 hari lalu", type: "update" },
      ];
      setRecentActivities(activities);

    } catch (error) {
      console.error(error);
    } finally {
      // Simulasi delay untuk melihat skeleton
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: "bg-blue-100", text: "text-blue-700", dark: "bg-blue-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-700", dark: "bg-purple-600" },
      green: { bg: "bg-green-100", text: "text-green-700", dark: "bg-green-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-700", dark: "bg-orange-600" }
    };
    return colors[color] || colors.blue;
  };

  // Tampilkan skeleton loading
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="mb-2 animate-pulse">
          <div className="w-64 h-10 bg-gray-200 rounded mb-2"></div>
          <div className="w-96 h-5 bg-gray-200 rounded"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>

        {/* Chart & Quick Actions Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartSkeleton />
          <QuickActionsSkeleton />
        </div>

        {/* Tables Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TableSkeleton />
          <TableSkeleton />
        </div>

        {/* Popular Products & Activities Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PopularProductsSkeleton />
          <ActivitiesSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Selamat datang di admin panel Solit 03 - Kelola toko laptop Anda dengan mudah
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;
          const colors = getColorClasses(item.color);

          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${colors.bg} ${colors.text} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${item.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                  {item.trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {item.change}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm mb-1">{item.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{item.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* CHART & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Distribution Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Distribusi Stok Produk</h2>
              <p className="text-sm text-gray-500 mt-1">Visualisasi stok per produk</p>
            </div>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-700">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
              <option>3 Bulan Terakhir</option>
            </select>
          </div>

          {/* Simple Bar Chart Representation */}
          <div className="space-y-4">
            {recentProducts.slice(0, 5).map((product, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-32 text-sm text-gray-600 truncate">{product.name}</div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg transition-all duration-500 flex items-center justify-end px-3"
                      style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                    >
                      <span className="text-xs text-white font-medium">{product.stock} unit</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products/create"
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition group"
            >
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <PlusCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Tambah Produk Baru</p>
                <p className="text-xs text-gray-500">Tambahkan laptop baru ke katalog</p>
              </div>
            </Link>

            <Link
              to="/admin/brands"
              className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition group"
            >
              <div className="w-10 h-10 bg-purple-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <Tags size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Kelola Brand</p>
                <p className="text-xs text-gray-500">Tambah atau edit brand laptop</p>
              </div>
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition group"
            >
              <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <Layers3 size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Kelola Kategori</p>
                <p className="text-xs text-gray-500">Atur kategori produk</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* TABLES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Produk Terbaru</h2>
              <p className="text-sm text-gray-500 mt-1">5 produk terakhir yang ditambahkan</p>
            </div>
            <Link to="/admin/products" className="text-blue-700 text-sm font-medium hover:underline">
              Lihat semua
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag size={40} className="mx-auto mb-3 text-gray-300" />
                <p>Belum ada produk</p>
              </div>
            ) : (
              recentProducts.map((product) => (
                <div key={product.id} className="px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {product.thumbnail ? (
                      <img src={product.thumbnail} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Laptop size={18} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.brands?.name} • {product.categories?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-700">Rp {product.price?.toLocaleString()}</p>
                    <p className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                      Stok: {product.stock} unit
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <AlertCircle size={18} className="text-orange-500" />
                Peringatan Stok Menipis
              </h2>
              <p className="text-sm text-gray-500 mt-1">Produk dengan stok kurang dari 10 unit</p>
            </div>
            <Link to="/admin/products" className="text-blue-700 text-sm font-medium hover:underline">
              Lihat semua
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package size={40} className="mx-auto mb-3 text-gray-300" />
                <p>Semua produk memiliki stok yang cukup</p>
              </div>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">
                      Stok: {product.stock}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-gray-500">{product.brands?.name}</p>
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="text-blue-700 hover:underline"
                    >
                      Update Stok
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Popular Products & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Price */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Star size={18} className="text-yellow-500 fill-yellow-500" />
                Produk Premium
              </h2>
              <p className="text-sm text-gray-500 mt-1">5 produk dengan harga tertinggi</p>
            </div>
          </div>
          <div className="space-y-3">
            {popularProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.brands?.name}</p>
                  </div>
                </div>
                <p className="font-semibold text-blue-700">Rp {product.price?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h2>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === "create" ? "bg-green-100" :
                    activity.type === "update" ? "bg-blue-100" : "bg-red-100"
                  }`}>
                  {activity.type === "create" ? <PlusCircle size={14} className="text-green-600" /> :
                    activity.type === "update" ? <Package size={14} className="text-blue-600" /> :
                      <MinusCircle size={14} className="text-red-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{activity.action}</span>
                    {" "}{activity.target}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}