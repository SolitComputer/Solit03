import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import ScrollProgress from "../ui/ScrollProgress";
import CookieConsent from "../CookieConsent";

export default function MainLayout() {
  const { pathname } = useLocation();

  // Reset scroll ke atas tiap ganti halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

