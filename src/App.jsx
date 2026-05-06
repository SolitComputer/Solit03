import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import JualBeli from "./pages/JualBeli";
import Tentang from "./pages/Tentang";
import SosialMedia from "./pages/SosialMedia";
import Katalog from "./pages/Katalog";

function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;