import { useState, useEffect } from "react";
import { MessageCircle, Mail, MapPin, ShieldCheck } from "lucide-react";
import { getSiteSettings } from "../../services/siteContent";

const DEFAULT_CONTACT = {
  company_name: "PT SOLIT TEKNOLOGI INDONESIA",
  nib: "2212230062715",
  phone_display: "+62 852-1064-7047",
  email: "info@solit03.com",
  address: "JL. H Naiman GG MUSOLAH AINAL YAQIN, Kel. Rangkapan Jaya, Kec. Pancoran Mas, Kota Depok, Jawa Barat 16435",
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
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Solit<span className="text-blue-400">03</span>
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5 mb-3">
              {contact.company_name || "PT SOLIT TEKNOLOGI INDONESIA"}
            </p>
            <p className="text-sm text-content-muted leading-relaxed max-w-xs mb-3">
              Toko laptop second berkualitas rasa baru. Pilihan laptop terbaik
              dengan harga terjangkau dan kualitas terjamin.
            </p>
            {contact.nib && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>NIB: <strong className="font-mono text-white">{contact.nib}</strong></span>
              </div>
            )}
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

          {/* Kontak & Alamat */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Kontak & Alamat</h3>
            <ul className="space-y-3 text-sm text-content-muted">
              <li className="flex items-center gap-2.5">
                <MessageCircle size={15} className="text-blue-400 shrink-0" />
                <a
                  href={`https://wa.me/${(contact.phone_display || "").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-words hover:text-white transition-colors"
                >
                  {contact.phone_display}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-blue-400 shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  className="break-words hover:text-white transition-colors"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-blue-400 shrink-0 mt-1" />
                <span className="leading-relaxed break-words">{contact.address}</span>
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
          <span>© {currentYear} {contact.company_name || "PT SOLIT TEKNOLOGI INDONESIA"} (Solit 03). All rights reserved.</span>
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
