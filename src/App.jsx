import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import JualBeli from "./pages/JualBeli";
import Tentang from "./pages/Tentang";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jual-beli" element={<JualBeli />} />
          <Route path="/tentang" element={<Tentang   />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;