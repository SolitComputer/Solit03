// C:\Solit03\src\App.jsx
// Lazy-loaded routes: tiap halaman di-split jadi chunk terpisah,
// jadi pengunjung cuma download kode halaman yang dibuka.

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./admin/components/ProtectedRoute";

// --- Public pages ---
const Home = lazy(() => import("./pages/Home"));
const JualBeli = lazy(() => import("./pages/JualBeli"));
const Tentang = lazy(() => import("./pages/Tentang"));
const SosialMedia = lazy(() => import("./pages/SosialMedia"));
const Katalog = lazy(() => import("./pages/Katalog"));
const CekGaransi = lazy(() => import("./pages/CekGaransi"));
const CekAntrian = lazy(() => import("./pages/CekAntrian_realtime"));
const KatalogLaptop = lazy(() => import("./pages/KatalogLaptop"));

// --- Admin pages (dipisah, tidak ikut ke-load di sisi publik) ---
const Login = lazy(() => import("./admin/pages/Login"));
const AdminLayout = lazy(() => import("./admin/layouts/AdminLayout"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const Products = lazy(() => import("./admin/pages/Products"));
const CreateProducts = lazy(() => import("./admin/pages/CreateProducts"));
const EditProducts = lazy(() => import("./admin/pages/EditProducts"));
const Brands = lazy(() => import("./admin/pages/Brands"));
const Categories = lazy(() => import("./admin/pages/Categories"));
const Tags = lazy(() => import("./admin/pages/Tags"));
const KatalogFoto = lazy(() => import("./admin/pages/KatalogFoto"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename="/">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jual-beli" element={<JualBeli />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="/sosial-media" element={<SosialMedia />} />
            <Route path="/katalog" element={<Katalog />} />
            <Route path="/cek-garansi" element={<CekGaransi />} />
            <Route path="/cek-antrian" element={<CekAntrian />} />
            <Route path="/katalog-laptop" element={<KatalogLaptop />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="brands" element={<Brands />} />
            <Route path="categories" element={<Categories />} />
            <Route path="tags" element={<Tags />} />
            <Route path="products/create" element={<CreateProducts />} />
            <Route path="products/edit/:id" element={<EditProducts />} />
            <Route path="katalog-foto" element={<KatalogFoto />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
