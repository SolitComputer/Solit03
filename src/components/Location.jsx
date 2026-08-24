import { useState, useEffect } from "react";
import { MapPin, Navigation, Clock, Store } from "lucide-react";
import Reveal from "./ui/Reveal";
import { getSiteSettings } from "../services/siteContent";

const DEFAULT_MAP_QUERY = "Solit 03 Depok Sawangan";

export default function Location() {
  const [mapQuery, setMapQuery] = useState(DEFAULT_MAP_QUERY);

  useEffect(() => {
    getSiteSettings()
      .then((settings) => {
        if (settings.contact?.map_query) setMapQuery(settings.contact.map_query);
      })
      .catch(() => {});
  }, []);

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-surface">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-10 md:mb-14">
          <span className="eyebrow">
            <MapPin className="w-3.5 h-3.5" />
            Kunjungi Kami
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-content mt-5">
            Lokasi <span className="text-blue-600">Toko Offline</span>
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6 items-stretch">
          {/* Kartu info */}
          <Reveal className="h-full">
            <div className="h-full flex flex-col justify-between rounded-3xl bg-slate-900 text-white p-7 sm:p-9 shadow-soft-lg overflow-hidden relative">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                  <Store className="w-6 h-6" />
                </span>
                <h3 className="mt-5 text-xl sm:text-2xl font-bold">Solit 03</h3>
                <p className="mt-2 text-slate-300 text-sm leading-relaxed">
                  Datang langsung ke toko kami untuk melihat dan mencoba unit sebelum membeli.
                </p>

                <ul className="mt-6 space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4.5 h-4.5 text-blue-300 mt-0.5 shrink-0" />
                    <span className="text-slate-200">Sawangan, Depok — Jawa Barat</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-4.5 h-4.5 text-blue-300 mt-0.5 shrink-0" />
                    <span className="text-slate-200">Melayani COD &amp; free ongkir area Jabodetabek</span>
                  </li>
                </ul>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 font-semibold text-sm px-5 py-3 hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Navigation className="w-4 h-4 text-blue-600" />
                Buka di Google Maps
              </a>
            </div>
          </Reveal>

          {/* Peta */}
          <Reveal delay={0.1} className="h-full">
            <div className="h-full min-h-[320px] rounded-3xl overflow-hidden border border-border shadow-soft">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 320 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Solit 03"
                className="w-full h-full"
              ></iframe>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
