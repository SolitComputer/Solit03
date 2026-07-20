import { MessageCircle, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const menu = [
    { label: "Beranda", href: "/" },
    { label: "Katalog", href: "/katalog" },
    { label: "Jual-Beli Laptop", href: "/jual-beli" },
    { label: "Tentang", href: "/tentang" },
  ];

  const socials = [
    { label: "Instagram", href: "https://instagram.com/solit.comp" },
    { label: "TikTok", href: "https://tiktok.com/@solusi_it03" },
    { label: "Shopee", href: "https://shopee.co.id/solit_03?entryPoint=ShopBySearch&searchKeyword=solit03" },
    { label: "Tokopedia", href: "https://www.tokopedia.com/solit03" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 px-4 sm:px-6 py-12 md:py-14 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold text-white tracking-tight mb-3">
              Solit<span className="text-blue-400">03</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
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
                  <a href={m.href} className="text-slate-400 hover:text-white transition-colors">
                    {m.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <MessageCircle size={15} className="text-blue-400 shrink-0" />
                <span className="break-words">+62 852-1064-7047</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-blue-400 shrink-0" />
                <span className="break-words">solit03@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="text-blue-400 shrink-0" />
                <span>Depok, Indonesia</span>
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
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-slate-500">
          © {currentYear} Solit 03. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
