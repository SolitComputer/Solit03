import { useEffect, useState } from "react";
import {
  Home, Info, Phone, Save, Plus, Trash2, Loader2, ImagePlus, X,
} from "lucide-react";
import { getSetting, saveSetting, uploadSiteContentFile } from "../services/AdminSiteContent";
import { useToast } from "../context/ToastContext";
import { SERVICE_ICON_OPTIONS } from "../../utils/serviceIcons";

const ICON_OPTIONS = SERVICE_ICON_OPTIONS;

const TABS = [
  { key: "hero", label: "Hero", icon: Home },
  { key: "about", label: "About", icon: Info },
  { key: "contact", label: "Kontak & Lokasi", icon: Phone },
];

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-content-soft">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-surface-muted border-2 border-border rounded-xl text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-surface transition-all";

export default function SiteContent() {
  const [tab, setTab] = useState("hero");
  const [hero, setHero] = useState(null);
  const [about, setAbout] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFounder, setUploadingFounder] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const [h, a, c] = await Promise.all([getSetting("hero"), getSetting("about"), getSetting("contact")]);
        setHero(h || {});
        setAbout(a || {});
        setContact(c || {});
      } catch {
        showToast("Gagal memuat konten situs", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  async function handleSave() {
    setSaving(true);
    try {
      const value = tab === "hero" ? hero : tab === "about" ? about : contact;
      await saveSetting(tab, value);
      showToast("Perubahan berhasil disimpan", "success");
    } catch {
      showToast("Gagal menyimpan perubahan", "error");
    } finally {
      setSaving(false);
    }
  }

  function updateTrust(idx, field, val) {
    const trust = [...(hero.trust || [])];
    trust[idx] = { ...trust[idx], [field]: val };
    setHero((h) => ({ ...h, trust }));
  }
  function addTrust() {
    setHero((h) => ({ ...h, trust: [...(h.trust || []), { icon: "Sparkles", label: "" }] }));
  }
  function removeTrust(idx) {
    setHero((h) => ({ ...h, trust: (h.trust || []).filter((_, i) => i !== idx) }));
  }

  async function handleFounderUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFounder(true);
    try {
      const url = await uploadSiteContentFile(file, "about");
      setAbout((a) => ({ ...a, founder_image_url: url }));
    } catch {
      showToast("Gagal upload foto", "error");
    } finally {
      setUploadingFounder(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Konten Homepage
          </h1>
          <p className="text-sm text-content-muted mt-1">Edit teks & informasi yang tampil di halaman utama</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Simpan Perubahan
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-surface border border-border rounded-xl p-1.5 shadow-sm w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === key ? "bg-blue-600 text-white shadow-sm" : "text-content-muted hover:bg-surface-muted"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ===== HERO TAB ===== */}
      {tab === "hero" && (
        <div className="bg-surface border border-border rounded-2xl shadow-sm p-6 space-y-5">
          <Field label="Badge (teks kecil di atas judul)">
            <input className={inputCls} value={hero.badge || ""} onChange={(e) => setHero({ ...hero, badge: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Judul Depan">
              <input className={inputCls} value={hero.title_prefix || ""} onChange={(e) => setHero({ ...hero, title_prefix: e.target.value })} />
            </Field>
            <Field label="Judul Aksen">
              <input className={inputCls} value={hero.title_suffix || ""} onChange={(e) => setHero({ ...hero, title_suffix: e.target.value })} />
            </Field>
          </div>
          <Field label="Subjudul">
            <input className={inputCls} value={hero.subtitle || ""} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} />
          </Field>
          <Field label="Deskripsi">
            <textarea rows={3} className={inputCls} value={hero.description || ""} onChange={(e) => setHero({ ...hero, description: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Label Tombol Utama">
              <input className={inputCls} value={hero.cta_primary_label || ""} onChange={(e) => setHero({ ...hero, cta_primary_label: e.target.value })} />
            </Field>
            <Field label="Label Tombol Kedua">
              <input className={inputCls} value={hero.cta_secondary_label || ""} onChange={(e) => setHero({ ...hero, cta_secondary_label: e.target.value })} />
            </Field>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-content-soft">Badge Kepercayaan (trust indicators)</label>
              <button onClick={addTrust} type="button" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                <Plus size={14} /> Tambah
              </button>
            </div>
            <div className="space-y-2">
              {(hero.trust || []).map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={t.icon}
                    onChange={(e) => updateTrust(i, "icon", e.target.value)}
                    className="bg-surface-muted border-2 border-border rounded-xl text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                  <input
                    className={`${inputCls} flex-1`}
                    placeholder="Label"
                    value={t.label}
                    onChange={(e) => updateTrust(i, "label", e.target.value)}
                  />
                  <button onClick={() => removeTrust(i)} type="button" className="p-2 text-content-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== ABOUT TAB ===== */}
      {tab === "about" && (
        <div className="bg-surface border border-border rounded-2xl shadow-sm p-6 space-y-5">
          <Field label="Eyebrow (label kecil)">
            <input className={inputCls} value={about.eyebrow || ""} onChange={(e) => setAbout({ ...about, eyebrow: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Judul (normal)">
              <input className={inputCls} value={about.heading_normal || ""} onChange={(e) => setAbout({ ...about, heading_normal: e.target.value })} />
            </Field>
            <Field label="Judul (aksen biru)">
              <input className={inputCls} value={about.heading_accent || ""} onChange={(e) => setAbout({ ...about, heading_accent: e.target.value })} />
            </Field>
          </div>
          <Field label="Deskripsi singkat">
            <textarea rows={2} className={inputCls} value={about.description || ""} onChange={(e) => setAbout({ ...about, description: e.target.value })} />
          </Field>
          <Field label="Kutipan (quote)">
            <textarea rows={4} className={inputCls} value={about.quote || ""} onChange={(e) => setAbout({ ...about, quote: e.target.value })} />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Nama Founder">
              <input className={inputCls} value={about.founder_name || ""} onChange={(e) => setAbout({ ...about, founder_name: e.target.value })} />
            </Field>
            <Field label="Jabatan">
              <input className={inputCls} value={about.founder_role || ""} onChange={(e) => setAbout({ ...about, founder_role: e.target.value })} />
            </Field>
            <Field label="Inisial (avatar)">
              <input className={inputCls} maxLength={3} value={about.founder_initials || ""} onChange={(e) => setAbout({ ...about, founder_initials: e.target.value })} />
            </Field>
          </div>
          <Field label="Foto Founder">
            <div className="flex items-center gap-4">
              {about.founder_image_url ? (
                <div className="relative">
                  <img src={about.founder_image_url} alt="" className="w-20 h-20 rounded-xl object-cover border border-border" />
                  <button
                    onClick={() => setAbout({ ...about, founder_image_url: null })}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-content-muted text-[10px] text-center px-1">Default asset</div>
              )}
              <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-border rounded-xl text-sm text-content-soft cursor-pointer hover:border-blue-400 hover:text-blue-600 transition">
                {uploadingFounder ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
                Ganti Foto
                <input type="file" accept="image/*" className="hidden" onChange={handleFounderUpload} />
              </label>
            </div>
          </Field>
        </div>
      )}

      {/* ===== CONTACT TAB ===== */}
      {tab === "contact" && (
        <div className="bg-surface border border-border rounded-2xl shadow-sm p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nomor WhatsApp (format 62xxx)">
              <input className={inputCls} value={contact.whatsapp_number || ""} onChange={(e) => setContact({ ...contact, whatsapp_number: e.target.value })} />
            </Field>
            <Field label="Nomor Telepon (tampilan)">
              <input className={inputCls} value={contact.phone_display || ""} onChange={(e) => setContact({ ...contact, phone_display: e.target.value })} />
            </Field>
          </div>
          <Field label="Pesan Default WhatsApp">
            <textarea rows={2} className={inputCls} value={contact.whatsapp_message || ""} onChange={(e) => setContact({ ...contact, whatsapp_message: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email">
              <input className={inputCls} value={contact.email || ""} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </Field>
            <Field label="Alamat singkat (footer)">
              <input className={inputCls} value={contact.address || ""} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
            </Field>
          </div>
          <Field label="Query Google Maps (nama toko/alamat pencarian)">
            <input className={inputCls} value={contact.map_query || ""} onChange={(e) => setContact({ ...contact, map_query: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Instagram URL">
              <input className={inputCls} value={contact.instagram_url || ""} onChange={(e) => setContact({ ...contact, instagram_url: e.target.value })} />
            </Field>
            <Field label="TikTok URL">
              <input className={inputCls} value={contact.tiktok_url || ""} onChange={(e) => setContact({ ...contact, tiktok_url: e.target.value })} />
            </Field>
            <Field label="Shopee URL">
              <input className={inputCls} value={contact.shopee_url || ""} onChange={(e) => setContact({ ...contact, shopee_url: e.target.value })} />
            </Field>
            <Field label="Tokopedia URL">
              <input className={inputCls} value={contact.tokopedia_url || ""} onChange={(e) => setContact({ ...contact, tokopedia_url: e.target.value })} />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}
