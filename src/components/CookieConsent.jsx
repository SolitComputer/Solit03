import { useEffect, useState } from "react";
import { Cookie, Settings2, X } from "lucide-react";
import { getStoredConsent, saveConsent } from "../services/cookieConsent";

const DEFAULT_PREFS = { analytics: false, marketing: false };

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  useEffect(() => {
    if (!getStoredConsent()) setVisible(true);

    const openSettings = () => {
      setPrefs(getStoredConsent() || DEFAULT_PREFS);
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener("open-cookie-settings", openSettings);
    return () => window.removeEventListener("open-cookie-settings", openSettings);
  }, []);

  async function handle(action, overridePrefs) {
    const chosen = overridePrefs || prefs;
    await saveConsent({ action, analytics: chosen.analytics, marketing: chosen.marketing });
    setVisible(false);
    setCustomizing(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-[#0f172a] text-white shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Cookie size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Kami menggunakan cookie</p>
              <p className="text-xs text-content-muted mt-1 leading-relaxed">
                Solit 03 memakai cookie untuk menjaga situs tetap berfungsi, menganalisis
                trafik, dan meningkatkan pengalaman kamu. Kamu bisa terima semua, tolak yang
                tidak esensial, atau atur sendiri preferensinya.
              </p>
            </div>
          </div>

          {customizing && (
            <div className="mt-4 space-y-2 border-t border-slate-800 pt-4">
              <PrefRow
                label="Cookie Esensial"
                desc="Selalu aktif — dibutuhkan agar situs berjalan normal."
                checked
                disabled
              />
              <PrefRow
                label="Cookie Analitik"
                desc="Membantu kami memahami cara pengunjung menggunakan situs."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <PrefRow
                label="Cookie Marketing"
                desc="Dipakai untuk menampilkan promosi yang relevan."
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handle("accept_all", { analytics: true, marketing: true })}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
            >
              Terima Semua
            </button>
            <button
              onClick={() => handle("reject_all", { analytics: false, marketing: false })}
              className="px-4 py-2 rounded-xl bg-surface/10 hover:bg-surface/15 text-white text-xs font-semibold transition"
            >
              Tolak Non-Esensial
            </button>
            {customizing ? (
              <button
                onClick={() => handle("custom")}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-500 text-xs font-semibold transition"
              >
                Simpan Preferensi
              </button>
            ) : (
              <button
                onClick={() => setCustomizing(true)}
                className="px-3 py-2 rounded-xl text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
              >
                <Settings2 size={14} />
                Atur Preferensi
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          aria-label="Tutup"
          className="absolute top-3 right-3 text-content-muted hover:text-white transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function PrefRow({ label, desc, checked, disabled, onChange }) {
  return (
    <label className={`flex items-center justify-between gap-3 py-1.5 ${disabled ? "opacity-60" : "cursor-pointer"}`}>
      <div>
        <p className="text-xs font-semibold text-white">{label}</p>
        <p className="text-[11px] text-content-muted">{desc}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-4 h-4 accent-blue-600 flex-shrink-0"
      />
    </label>
  );
}
