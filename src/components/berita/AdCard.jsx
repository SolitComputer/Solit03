import { Megaphone } from "lucide-react";
import { AD_BANNER_SIZES } from "../../utils/adBannerSizes";

export default function AdCard({ ad }) {
  if (!ad) return null;
  const spec = AD_BANNER_SIZES[ad.banner_size] || AD_BANNER_SIZES.billboard;
  const width = spec.customSize ? ad.custom_width || spec.width : spec.width;
  const height = spec.customSize ? ad.custom_height || spec.height : spec.height;
  const isExternal = /^https?:\/\//i.test(ad.cta_url || "");

  return (
    <a
      href={ad.cta_url || "#"}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group relative block w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <img
        src={ad.image_url}
        alt={ad.cta_label || "Iklan Solit 03"}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Badge Iklan */}
      <span className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
        <Megaphone size={11} className="text-blue-400" /> Iklan
      </span>
      {/* CTA Button Badge */}
      {ad.cta_label && (
        <span className="absolute bottom-2.5 right-2.5 px-3 py-1.5 bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all group-hover:scale-105">
          {ad.cta_label} &rarr;
        </span>
      )}
    </a>
  );
}

