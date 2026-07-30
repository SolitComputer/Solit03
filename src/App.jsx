// C:\Solit03\src\App.jsx
// Lazy-loaded routes: tiap halaman di-split jadi chunk terpisah,
// jadi pengunjung cuma download kode halaman yang dibuka.

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./admin/components/ProtectedRoute";

// --- Public pages ---
import Home from "./pages/Home";
import JualBeli from "./pages/JualBeli";
import Tentang from "./pages/Tentang";
import SosialMedia from "./pages/SosialMedia";
import Katalog from "./pages/Katalog";
import CekGaransi from "./pages/CekGaransi";
import CekAntrian from "./pages/CekAntrian_realtime";
import KatalogLaptop from "./pages/KatalogLaptop";
import Berita from "./pages/Berita";
import ArtikelDetail from "./pages/ArtikelDetail";

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
const Articles = lazy(() => import("./admin/pages/Articles"));
const CreateArticle = lazy(() => import("./admin/pages/CreateArticle"));
const EditArticle = lazy(() => import("./admin/pages/EditArticle"));
const ArticleCategories = lazy(() => import("./admin/pages/ArticleCategories"));
const CookieTracking = lazy(() => import("./admin/pages/CookieTracking"));
const SiteContent = lazy(() => import("./admin/pages/SiteContent"));
const ServicesAdmin = lazy(() => import("./admin/pages/ServicesAdmin"));
const PromoImagesAdmin = lazy(() => import("./admin/pages/PromoImagesAdmin"));
const TestimonialsAdmin = lazy(() => import("./admin/pages/TestimonialsAdmin"));
const ArticleAdsAdmin = lazy(() => import("./admin/pages/ArticleAdsAdmin"));
const ArticleTags = lazy(() => import("./admin/pages/ArticleTags"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-border border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
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
            <Route path="/berita" element={<Berita />} />
            <Route path="/berita/:slug" element={<ArtikelDetail />} />
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
            <Route path="articles" element={<Articles />} />
            <Route path="articles/create" element={<CreateArticle />} />
            <Route path="articles/edit/:id" element={<EditArticle />} />
            <Route path="article-categories" element={<ArticleCategories />} />
            <Route path="article-tags" element={<ArticleTags />} />
            <Route path="cookie-tracking" element={<CookieTracking />} />
            <Route path="site-content" element={<SiteContent />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="promo-images" element={<PromoImagesAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="article-ads" element={<ArticleAdsAdmin />} />
          </Route>
        </Routes>
      </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
