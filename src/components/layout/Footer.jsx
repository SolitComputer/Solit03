import { useState, useEffect } from "react";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { getSiteSettings } from "../../services/siteContent";

const DEFAULT_CONTACT = {
  phone_display: "+62 852-1064-7047",
  email: "solit03@gmail.com",
  address: "Depok, Indonesia",
  instagram_url: "https://instagram.com/solit.comp",
  tiktok_url: "https://tiktok.com/@solit03",
  shopee_url: "https://shopee.co.id/solit_03?entryPoint=ShopBySearch&searchKeyword=solit03",
  tokopedia_url: "https://www.tokopedia.com/solit03",
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [contact, setContact] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    getSiteSettings()
      .then((settings) => {
        if (settings.contact) setContact({ ...DEFAULT_CONTACT, ...settings.contact });
      })
      .catch(() => {});
  }, []);

  const menu = [
    { label: "Beranda", href: "/" },
    { label: "Katalog", href: "/katalog" },
    { label: "Jual-Beli Laptop", href: "/jual-beli" },
    { label: "Tentang", href: "/tentang" },
  ];

  const socials = [
    { label: "Instagram", href: contact.instagram_url },
    { label: "TikTok", href: contact.tiktok_url },
    { label: "Shopee", href: contact.shopee_url },
    { label: "Tokopedia", href: contact.tokopedia_url },
  ].filter((s) => s.href);

  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 text-slate-300 px-4 sm:px-6 py-12 md:py-14">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold text-white tracking-tight mb-3">
              Solit<span className="text-blue-400">03</span>
            </h2>
            <p className="text-sm text-content-muted leading-relaxed max-w-xs">
              Toko laptop second berkualitas rasa baru. Pilihan laptop terbaik
              dengan harga terjangkau dan kualitas terjamin.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Menu</h3>
            <ul className="space-y-2.5 text-sm">
              {menu.map((m) => (
                <li key={m.href}>
                  <a href={m.href} className="text-content-muted hover:text-white transition-colors">
                    {m.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm text-content-muted">
              <li className="flex items-center gap-2.5">
                <MessageCircle size={15} className="text-blue-400 shrink-0" />
                <span className="break-words">{contact.phone_display}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-blue-400 shrink-0" />
                <span className="break-words">{contact.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="text-blue-400 shrink-0" />
                <span>{contact.address}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Follow Us</h3>
            <ul className="space-y-2.5 text-sm">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-content-muted hover:text-white transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-xs text-content-muted">
          <span>© {currentYear} Solit 03. All rights reserved.</span>
          <span className="hidden sm:inline">·</span>
          <button
            onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
            className="text-content-muted hover:text-white underline underline-offset-2 transition-colors"
          >
            Pengaturan Cookie
          </button>
        </div>
      </div>
    </footer>
  );
}
