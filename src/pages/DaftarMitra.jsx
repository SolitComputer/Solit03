import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  User, Phone, Mail, MapPin, CheckCircle, AlertTriangle,
  Send, Loader2, ChevronDown, FileImage, Shield,
} from "lucide-react";

const SOLIT_POS_API = import.meta.env.VITE_SOLIT_POS_URL || "https://pos.solit.id";

const INITIAL = {
  type: "",
  full_name: "",
  phone: "",
  email: "",
  full_address: "",
};
function compressImage(file, maxWidth = 1200, quality = 0.7) {
  return new Promise((resolve) => {
    // Kalau file sudah kecil (< 500KB), skip kompresi
    if (file.size < 500 * 1024) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Resize kalau lebih lebar dari maxWidth
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file); // fallback ke file asli kalau gagal
            return;
          }
          // Buat File baru dengan nama & tipe yang sama
          const compressed = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          // Pakai yang lebih kecil (kadang kompresi malah lebih besar)
          resolve(compressed.size < file.size ? compressed : file);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // fallback ke file asli
    };

    img.src = url;
  });
}
export default function DaftarMitra() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref") || "";

  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success, message }
  const [errors, setErrors] = useState({});
  const [followProofFiles, setFollowProofFiles] = useState([]);
  const [followProofPreviews, setFollowProofPreviews] = useState([]);
  const [uploadingProof, setUploadingProof] = useState(false);
  const topRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isVisible, setIsVisible] = useState({
    hero: false,
    form: false,
    benefits: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15 }
    );
    ["hero", "form", "benefits"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const MAX_FILES = 5;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const totalAfter = followProofFiles.length + files.length;

    if (totalAfter > MAX_FILES) {
      setErrors((prev) => ({ ...prev, follow_proof: `Maksimal ${MAX_FILES} foto` }));
      return;
    }

    for (const file of files) {
      if (!allowed.includes(file.type)) {
        setErrors((prev) => ({ ...prev, follow_proof: `"${file.name}" — format harus JPG, PNG, atau WebP` }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, follow_proof: `"${file.name}" — ukuran maksimal 5MB` }));
        return;
      }
    }

    // Kompres semua file sebelum simpan ke state
    Promise.all(files.map((f) => compressImage(f))).then((compressed) => {
      setFollowProofFiles((prev) => [...prev, ...compressed]);
      setFollowProofPreviews((prev) => [...prev, ...compressed.map((f) => URL.createObjectURL(f))]);
      if (errors.follow_proof) setErrors((prev) => ({ ...prev, follow_proof: null }));
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index) => {
    setFollowProofFiles((prev) => prev.filter((_, i) => i !== index));
    setFollowProofPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.type) errs.type = "Pilih tipe pendaftaran";
    if (!form.full_name.trim()) errs.full_name = "Nama lengkap wajib diisi";
    if (!form.phone.trim()) errs.phone = "No HP wajib diisi";
    if (!form.email.trim()) {
      errs.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Format email tidak valid";
    }
    if (!form.full_address.trim()) errs.full_address = "Alamat lengkap wajib diisi";
    if (followProofFiles.length === 0) errs.follow_proof = "Screenshot bukti follow wajib diupload (minimal 1 foto)";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
       // ── Upload semua screenshot satu per satu ──
      const uploadedUrls = [];
      if (followProofFiles.length > 0) {
        setUploadingProof(true);
        for (let i = 0; i < followProofFiles.length; i++) {
          try {
            const formData = new FormData();
            formData.append("file", followProofFiles[i]);
            const uploadRes = await fetch(`${SOLIT_POS_API}/api/partners/upload-proof`, {
              method: "POST",
              mode: "cors",
              body: formData,
            });
            const uploadData = await uploadRes.json();
            if (uploadData.success) {
              uploadedUrls.push(uploadData.url);
            } else {
              setResult({ success: false, message: uploadData.message || `Gagal upload foto ke-${i + 1}` });
              setUploadingProof(false);
              setLoading(false);
              return;
            }
          } catch {
            setResult({ success: false, message: `Gagal upload foto ke-${i + 1}. Coba lagi.` });
            setUploadingProof(false);
            setLoading(false);
            return;
          }
        }
        setUploadingProof(false);
      }
      const payload = {
        ...form,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        full_address: form.full_address.trim(),
        referred_by: ref || undefined,
        follow_proof_url: uploadedUrls[0] || null,
        follow_proof_urls: uploadedUrls,
      };

      const res = await fetch(`${SOLIT_POS_API}/api/partners/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setResult({ success: true, message: data.message });
        setForm(INITIAL);
        setErrors({});
        setFollowProofFiles([]);
        setFollowProofPreviews([]);
        topRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        setResult({ success: false, message: data.message || "Gagal mengirim pendaftaran" });
      }
    } catch {
      setResult({ success: false, message: "Tidak dapat terhubung ke server. Coba lagi nanti." });
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    setForm(INITIAL);
    setResult(null);
    setErrors({});
    setFollowProofFiles([]);
    setFollowProofPreviews([]);
  };

  // ── Kalau sudah sukses, tampilkan halaman terima kasih ──
  if (result?.success) {
    return (
      <div className="min-h-screen bg-surface-muted relative overflow-x-hidden">
        <Helmet>
          <title>Pendaftaran Berhasil | Solit</title>
          <meta name="description" content="Pendaftaran Mitra & Reseller Solit berhasil dikirim." />
        </Helmet>
        <div className="fixed inset-0 -z-10 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        </div>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="bg-surface rounded-2xl border border-border shadow-soft p-8 space-y-6">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-soft">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-content">Pendaftaran Berhasil!</h1>
              <p className="text-content-muted mt-2">{result.message}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
              Tim kami akan meninjau pendaftaran Anda dan menghubungi via WhatsApp dalam <span className="font-bold">1×24 jam</span>.
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-soft hover:shadow-soft-lg active:scale-95"
            >
              Daftar Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted relative overflow-x-hidden" ref={topRef}>
      <Helmet>
        <title>Daftar Mitra & Reseller | Solit</title>
        <meta
          name="description"
          content="Daftar menjadi Mitra atau Reseller resmi Solit. Dapatkan harga khusus dan akses ke stok laptop second berkualitas."
        />
        <link rel="canonical" href="https://www.solit.id/daftar-mitra" />
      </Helmet>

      <div className="fixed inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">

        {/* ── HERO ── */}
        <div
          id="hero"
          className={`text-center mb-10 md:mb-14 transition-all duration-700 ${
            isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="eyebrow">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Reseller & Official Partner
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-content mt-5">
            Gabung Jadi{" "}
            <span className="text-blue-600">Mitra & Reseller</span>
          </h1>
          <p className="text-sm md:text-base text-content-muted max-w-2xl mx-auto mt-4">
            Daftar sekarang dan dapatkan akses ke stok laptop second berkualitas
            dengan harga khusus langsung dari <span className="font-semibold text-blue-600">Solit</span>.
          </p>
          <div className="flex justify-center items-center gap-2 mt-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-400 rounded-full" />
          </div>
        </div>

        {/* ── FORM ── */}
        <div
          id="form"
          className={`max-w-2xl mx-auto transition-all duration-500 delay-100 ${
            isVisible.form ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="bg-surface rounded-2xl border border-border shadow-soft hover:shadow-soft-lg transition-all duration-300 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-content">Formulir Pendaftaran</h2>
                <p className="text-xs text-content-muted">Reseller dan Mitra Resmi Solit</p>
              </div>
            </div>

            {/* Error banner */}
            {result && !result.success && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{result.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tipe Pendaftaran */}
              <div>
                <label className="block text-sm font-semibold text-content-soft mb-2">
                  Ingin bergabung sebagai <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "MITRA", label: "Mitra", desc: "Partner resmi Solit" },
                    { value: "RESELLER", label: "Reseller", desc: "Jual kembali produk Solit" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, type: opt.value }));
                        if (errors.type) setErrors((prev) => ({ ...prev, type: null }));
                      }}
                      className={`group relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        form.type === opt.value
                          ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100"
                          : "border-border hover:border-slate-300 bg-surface"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            form.type === opt.value
                              ? "border-blue-500 bg-blue-500"
                              : "border-slate-300"
                          }`}
                        >
                          {form.type === opt.value && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span
                          className={`font-bold text-sm ${
                            form.type === opt.value ? "text-blue-700" : "text-content"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </div>
                      <p className="text-xs text-content-muted mt-1 ml-7">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                {errors.type && <p className="text-xs text-red-500 mt-1.5">{errors.type}</p>}
              </div>

              {/* Nama Lengkap */}
              <Field
                label="Nama Lengkap"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                error={errors.full_name}
                icon={<User className="w-4 h-4" />}
                placeholder="Masukkan nama lengkap"
                required
              />

              {/* No HP */}
              <Field
                label="No HP / WhatsApp"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                icon={<Phone className="w-4 h-4" />}
                placeholder="08xx-xxxx-xxxx"
                required
              />

              {/* Email */}
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail className="w-4 h-4" />}
                placeholder="email@contoh.com"
                required
              />

              {/* Alamat Lengkap */}
              <div>
                <label className="block text-sm font-semibold text-content-soft mb-2">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-3.5 text-content-muted group-focus-within:text-blue-500 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <textarea
                    name="full_address"
                    value={form.full_address}
                    onChange={handleChange}
                    placeholder="Jl. ..., Kel. ..., Kec. ..., Kota/Kab. ..."
                    rows={3}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl text-sm text-content placeholder:text-content-muted bg-surface-muted focus:outline-none focus:ring-4 transition-all resize-none ${
                      errors.full_address
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-border focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                </div>
                {errors.full_address && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.full_address}</p>
                )}
              </div>

              {/* Bukti Follow Sosmed */}
              <div>
                <label className="block text-sm font-semibold text-content-soft mb-2">
                  Bukti Follow Sosmed Solit <span className="text-red-500">*</span>
                </label>
                <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-4 py-3 mb-3">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Follow minimal 1 akun sosmed Solit:{" "}
                    <span className="font-semibold">IG @solit.comp</span>,{" "}
                    <span className="font-semibold">TikTok solit.comp</span>, atau{" "}
                    <span className="font-semibold">FB Page "Solit Computer"</span>.
                    Disarankan follow ketiganya. <span className="font-bold">Upload screenshot sebagai bukti.</span>
                  </p>
                </div>

                {/* Grid preview foto yang sudah dipilih */}
                {followProofPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {followProofPreviews.map((preview, i) => (
                      <div key={i} className="relative group/img rounded-xl overflow-hidden border-2 border-blue-200 bg-blue-50/30 aspect-square">
                        <img
                          src={preview}
                          alt={`Bukti follow ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow-md"
                          title="Hapus foto ini"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5 font-medium">
                          {followProofFiles[i]?.name?.slice(0, 15)}{followProofFiles[i]?.name?.length > 15 ? "..." : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tombol tambah foto */}
                {followProofFiles.length < MAX_FILES && (
                  <label
                    className={`group flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      followProofPreviews.length > 0 ? "h-24" : "h-40"
                    } ${
                      errors.follow_proof
                        ? "border-red-300 bg-red-50/50 hover:border-red-400"
                        : "border-slate-300 bg-surface-muted hover:border-blue-400 hover:bg-blue-50/30"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5 text-content-muted group-hover:text-blue-500 transition-colors">
                      <FileImage className="w-7 h-7" />
                      <div className="text-center">
                        <p className="text-sm font-semibold">
                          {followProofPreviews.length > 0
                            ? `Tambah foto lagi (${followProofFiles.length}/${MAX_FILES})`
                            : "Klik untuk upload screenshot"}
                        </p>
                        <p className="text-xs mt-0.5">JPG, PNG, atau WebP (maks. 5MB per foto)</p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Info kalau sudah penuh */}
                {followProofFiles.length >= MAX_FILES && (
                  <p className="text-xs text-blue-600 font-medium text-center">
                    Maksimal {MAX_FILES} foto tercapai
                  </p>
                )}
                {errors.follow_proof && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.follow_proof}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full h-14 overflow-hidden rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all duration-300 shadow-soft hover:shadow-soft-lg active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mengirim Pendaftaran...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Daftar Sekarang</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── BENEFITS ── */}
        <div
          id="benefits"
          className={`grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto transition-all duration-500 delay-200 ${
            isVisible.benefits ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {[
            {
              icon: "💰",
              title: "Harga Khusus",
              desc: "Dapatkan harga spesial langsung dari sumber untuk margin lebih besar",
            },
            {
              icon: "📦",
              title: "Stok Prioritas",
              desc: "Akses prioritas ke unit laptop berkualitas sebelum listing publik",
            },
            {
              icon: "🤝",
              title: "Support Penuh",
              desc: "Tim dedicated siap membantu kebutuhan bisnis laptop Anda",
            },
          ].map((item, i) => (
            <div key={i} className="card-3d p-6 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="text-md font-bold text-content">{item.title}</p>
              <p className="text-sm text-content-muted mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── CTA WhatsApp ── */}
        <div className="text-center mt-14">
          <a
            href="https://wa.me/6285210647047?text=Halo%20Solit%2C%20saya%20ingin%20bertanya%20tentang%20program%20Mitra%20%26%20Reseller."
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-3 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.032 2.001c-5.514 0-10 4.486-10 10 0 1.78.469 3.452 1.283 4.899L2 21.999l5.225-1.312c1.39.794 3.002 1.253 4.713 1.253 5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.5c-1.657 0-3.236-.448-4.618-1.277l-.338-.195-3.125.785.84-3.077-.208-.347c-.891-1.449-1.363-3.113-1.363-4.889 0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5z" />
            </svg>
            Tanya Dulu via WhatsApp
          </a>
          <p className="text-xs text-content-muted mt-3">
            Punya pertanyaan? Langsung hubungi tim kami sebelum mendaftar.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Reusable Field Component ──────────────────────────────────────────────────
function Field({ label, name, type = "text", value, onChange, error, icon, placeholder, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-content-soft mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-xl text-sm text-content placeholder:text-content-muted bg-surface-muted focus:outline-none focus:ring-4 transition-all ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-border focus:border-blue-500 focus:ring-blue-100"
          }`}
          autoComplete="off"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}