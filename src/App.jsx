import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import JualBeli from "./pages/JualBeli";
import Tentang from "./pages/Tentang";
import SosialMedia from "./pages/SosialMedia";
import Katalog from "./pages/Katalog";
import Login from "./admin/pages/Login";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import CreateProducts from "./admin/pages/CreateProducts";
import EditProducts from "./admin/pages/EditProducts";
import Brands from "./admin/pages/Brands";
import Categories from "./admin/pages/Categories";
import Tags from "./admin/pages/Tags";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jual-beli" element={<JualBeli />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/sosial-media" element={<SosialMedia />} />
          {/* Route baru untuk halaman katalog/funnel */}
          <Route path="/katalog" element={<Katalog />} />
          {/* Bisa juga pakai path /jual-beli/katalog jika diinginkan */}
        </Route>
        <Route
          path="/admin/login"
          element={<Login />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="products"
            element={<Products />}
          />
          <Route
            path="brands"
            element={<Brands />}
          />
          <Route
            path="categories"
            element={<Categories />}
          />
          <Route
            path="tags"
            element={<Tags />}
          />

          <Route
            path="products/create"
            element={<CreateProducts />}
          />

          <Route
            path="products/edit/:id"
            element={<EditProducts />}
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;