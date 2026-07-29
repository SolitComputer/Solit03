import { MessageCircle, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { getSiteSettings } from "../services/siteContent";

const DEFAULT_NUMBER = "6285210647047";
const DEFAULT_MESSAGE = "Halo Solit 03, saya ingin bertanya tentang...";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_NUMBER);

  useEffect(() => {
    getSiteSettings()
      .then((settings) => {
        if (settings.contact?.whatsapp_number) setWhatsappNumber(settings.contact.whatsapp_number);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
        }`}
      >
        <div className="relative group">
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Hubungi Kami via WhatsApp
            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-slate-900"></div>
          </div>

          {/* Main Button */}
          <a
            href={`${whatsappUrl}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-soft-lg transition-all duration-300 hover:scale-105 group"
          >
            <MessageCircle className="w-7 h-7 text-white" />

            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></span>
          </a>
        </div>
      </div>

      {/* WhatsApp Chat Widget (Desktop) */}
      <div
        className={`fixed bottom-24 right-6 z-40 transition-all duration-500 ${
          isHovered && isVisible ? "translate-x-0 opacity-100" : "translate-x-96 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-soft-lg w-80 overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-green-500 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Solit 03 Support</h3>
                <p className="text-green-100 text-xs">Online • Balas cepat</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="bg-slate-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-slate-600">
                Halo! Ada yang bisa kami bantu? Silakan klik tombol di bawah untuk memulai chat via WhatsApp.
              </p>
            </div>

            <a
              href={`${whatsappUrl}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-300"
            >
              <Send className="w-4 h-4" />
              Mulai Chat WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
