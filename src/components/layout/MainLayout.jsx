import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import ScrollProgress from "../ui/ScrollProgress";

export default function MainLayout() {
  const { pathname } = useLocation();

  // Hormati preferensi "reduce motion" — matikan smooth scroll kalau user minta
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Reset scroll ke atas tiap ganti halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: !reduceMotion,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        // biarkan elemen scroll internal (dropdown, modal) tetap normal
        prevent: (node) => node.hasAttribute?.("data-lenis-prevent"),
      }}
    >
      <div className="min-h-screen flex flex-col bg-white text-slate-900">
        <ScrollProgress />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
}
