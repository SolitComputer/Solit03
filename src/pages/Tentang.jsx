import TeamSlider from "../components/tentang/TeamSlider";
import teamBg from "../assets/team-bg.jpg";
import teknisi from "../assets/teknisi.webp";

export default function Tentang() {
  return (
    <main className="pt-8 bg-white">

      {/* HERO - lebih besar */}
      <section className="relative py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative h-[280px] md:h-[360px] rounded-xl overflow-hidden group cursor-pointer shadow-md">
            <img
              src={teamBg}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              alt="Hero Tentang Solit 03"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight translate-y-4 group-hover:translate-y-0 transition duration-500">
                Tentang Solit 03
              </h1>
              <p className="mt-3 text-sm md:text-base text-gray-100 opacity-0 group-hover:opacity-100 transition duration-500 delay-100 max-w-md">
                Laptop Second Berkualitas Tinggi, Rasa Seperti Baru
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY - lebih besar */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Berawal dari Kepercayaan, Tumbuh Berkat Kualitas
          </h2>
          <div className="w-16 h-0.5 bg-blue-500/60 mx-auto mb-5 rounded-full" />
          <p className="text-gray-500 leading-relaxed text-base md:text-lg">
            Solit 03 hadir dari satu keresahan sederhana: mengapa laptop berkualitas tinggi
            harus selalu mahal? Kami percaya semua orang berhak mendapatkan perangkat terbaik
            tanpa harus mengorbankan banyak biaya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
          <img
            src={teknisi}
            className="rounded-xl shadow-sm hover:shadow-md transition duration-300 w-full object-cover"
            alt="Teknisi Solit 03"
          />
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-blue-700">
              Proses & Komitmen Kami
            </h3>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base mb-4">
              Setiap laptop yang masuk ke Solit 03 melewati proses Quality Control (QC)
              berlapis untuk memastikan performa, fisik, dan komponen berjalan optimal.
            </p>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base">
              Kami tidak hanya menjual laptop bekas — kami menghadirkan kembali kualitas,
              kenyamanan, dan rasa percaya bagi setiap pengguna.
            </p>
          </div>
        </div>
      </section>

      {/* VISI MISI - Premium Compact Design */}
<section className="py-16 md:py-20 px-4 relative overflow-hidden">
  {/* Background dengan efek gradien dan blur */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />
  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
  <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />
  
  <div className="max-w-5xl mx-auto relative z-10">
    {/* Section Header - Lebih compact */}
    <div className="text-center mb-10 md:mb-12">
      <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1 mb-3 shadow-sm">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-[11px] font-semibold text-gray-600 tracking-wider uppercase">
          Peta Perjalanan
        </span>
      </div>
      
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Visi & 
        </span>
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ml-2">
          Misi Kami
        </span>
      </h2>
      
      <div className="flex justify-center gap-1.5 mt-3">
        <div className="w-10 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
        <div className="w-2 h-0.5 bg-blue-400 rounded-full" />
        <div className="w-2 h-0.5 bg-indigo-400 rounded-full" />
      </div>
      
      <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-xs md:text-sm">
        Komitmen kami dalam menghadirkan yang terbaik untuk setiap pelanggan
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {/* VISI CARD - Compact Premium */}
      <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-full blur-2xl" />
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
        <div className="absolute inset-[1px] bg-white rounded-xl -z-10" />
        
        <div className="p-5 md:p-6 text-center relative">
          {/* Icon Container - Diperkecil */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition duration-300" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-105 transition duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Visi
            </span>
          </h3>
          
          <p className="text-gray-600 leading-relaxed text-sm">
            Menjadi perusahaan teknologi terpercaya yang menghadirkan laptop berkualitas tinggi
            dengan harga yang terjangkau untuk semua kalangan.
          </p>
          
          {/* Quote decoration - Lebih subtle */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-center gap-1 text-blue-400">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* MISI CARD - Compact Premium */}
      <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl" />
        
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
        <div className="absolute inset-[1px] bg-white rounded-xl -z-10" />
        
        <div className="p-5 md:p-6">
          {/* Icon Container - Diperkecil */}
          <div className="relative inline-block mx-auto block w-fit mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition duration-300" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Misi
            </span>
          </h3>
          
          <ul className="space-y-2.5">
            {[
              "Menyediakan laptop berkualitas dengan harga kompetitif",
              "Memberikan layanan profesional dan transparan",
              "Membangun kepercayaan jangka panjang dengan pelanggan",
              "Mengedukasi pasar tentang laptop second berkualitas"
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 group/item hover:translate-x-0.5 transition duration-300">
                <div className="relative flex-shrink-0 mt-0.5">
                  <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          
          {/* Decorative line - Lebih subtle */}
          <div className="mt-4 pt-3 flex justify-center gap-1 text-indigo-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    {/* Decorative bottom element - Lebih kecil */}
    <div className="flex justify-center mt-8">
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-60" />
        ))}
      </div>
    </div>
  </div>
</section>

     {/* VALUES - Compact & Clean Design */}
<section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
  {/* Header Section - Lebih besar */}
  <div className="text-center mb-12 md:mb-16">
    <div className="inline-block mb-3">
      <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
        Core Values
      </span>
    </div>
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
      Nilai-Nilai Kami
    </h2>
    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mx-auto mb-4"></div>
    <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
      Prinsip yang menjadi fondasi setiap langkah kami dalam melayani pelanggan.
    </p>
  </div>

  {/* Cards Grid - Gap lebih besar */}
  <div className="grid md:grid-cols-3 gap-6 md:gap-8">
    {/* Kartu 1 - Kualitas Premium */}
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
      <div className="p-6 md:p-7 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-sm">
          <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Kualitas Premium</h3>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          Setiap laptop melalui <span className="font-semibold text-blue-600">15+ titik pengecekan</span>. Garansi performa dan fisik barang sebelum sampai ke tangan Anda.
        </p>
      </div>
    </div>

    {/* Kartu 2 - Transparansi Penuh */}
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
      <div className="p-6 md:p-7 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-sm">
          <svg className="w-7 h-7 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 10h18M6 14h12m-6-6v12m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Transparansi Penuh</h3>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          Kami jelaskan kondisi laptop secara jujur, termasuk minus dan plusnya. <span className="font-semibold text-emerald-600">Tidak ada manipulasi</span> — kepercayaan adalah segalanya.
        </p>
      </div>
    </div>

    {/* Kartu 3 - Solusi Cerdas & Cepat */}
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
      <div className="p-6 md:p-7 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-sm">
          <svg className="w-7 h-7 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Solusi Cerdas & Cepat</h3>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          Bantu Anda memilih laptop yang pas dengan budget dan kebutuhan. <span className="font-semibold text-purple-600">Konsultasi gratis, respons cepat</span>, tanpa drama.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* TEAM - lebih besar */}
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Tim Kami
            </h2>
            <div className="w-16 h-0.5 bg-blue-500/60 mx-auto rounded-full mb-4" />
            <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
              Profesional yang berdedikasi memberikan pelayanan terbaik untuk setiap pelanggan.
            </p>
          </div>

          <TeamSlider />
        </div>
      </div>
    </main>
  );
}