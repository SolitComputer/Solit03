import TeamSlider from "../components/tentang/TeamSlider";
import teamBg from "../assets/team-bg.jpg";
import teknisi from "../assets/teknisi.webp";

export default function Tentang() {
  return (
    <main className="pt-8 bg-white">

      {/* HERO - compact */}
      <section className="relative py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative h-[250px] md:h-[320px] rounded-xl overflow-hidden group cursor-pointer shadow-sm">
            <img
              src={teamBg}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              alt="Hero Tentang Solit 03"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight translate-y-4 group-hover:translate-y-0 transition duration-500">
                Tentang Solit 03
              </h1>
              <p className="mt-2 text-xs md:text-sm text-gray-100 opacity-0 group-hover:opacity-100 transition duration-500 delay-100 max-w-md">
                Laptop Second Berkualitas Tinggi, Rasa Seperti Baru
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY - compact */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
            Berawal dari Kepercayaan, Tumbuh Berkat Kualitas
          </h2>
          <div className="w-12 h-0.5 bg-blue-500/60 mx-auto mb-4 rounded-full" />
          <p className="text-gray-500 leading-relaxed text-sm md:text-base">
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
            <h3 className="text-base md:text-lg font-semibold mb-2 text-blue-700">
              Proses & Komitmen Kami
            </h3>
            <p className="text-gray-500 leading-relaxed text-xs md:text-sm mb-3">
              Setiap laptop yang masuk ke Solit 03 melewati proses Quality Control (QC)
              berlapis untuk memastikan performa, fisik, dan komponen berjalan optimal.
            </p>
            <p className="text-gray-500 leading-relaxed text-xs md:text-sm">
              Kami tidak hanya menjual laptop bekas — kami menghadirkan kembali kualitas,
              kenyamanan, dan rasa percaya bagi setiap pengguna.
            </p>
          </div>
        </div>
      </section>

      {/* VISI MISI - compact */}
      <section className="bg-gray-50 py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-6">
            Visi dan Misi Kami
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {/* VISI */}
            <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition duration-300 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-2 text-blue-700">Visi</h3>
              <p className="text-gray-500 leading-relaxed text-xs md:text-sm">
                Menjadi perusahaan teknologi terpercaya yang menghadirkan laptop berkualitas tinggi
                dengan harga yang terjangkau untuk semua kalangan.
              </p>
            </div>

            {/* MISI */}
            <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-2 text-blue-700 text-center">Misi</h3>
              <ul className="space-y-1.5 text-gray-500 text-xs md:text-sm">
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 text-sm">✓</span>
                  Menyediakan laptop berkualitas dengan harga kompetitif
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 text-sm">✓</span>
                  Memberikan layanan profesional dan transparan
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 text-sm">✓</span>
                  Membangun kepercayaan jangka panjang dengan pelanggan
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 text-sm">✓</span>
                  Mengedukasi pasar tentang laptop second berkualitas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES - compact */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Nilai-Nilai Kami
        </h2>
        <p className="text-center text-gray-400 text-xs md:text-sm max-w-2xl mx-auto mb-8">
          Prinsip yang menjadi fondasi setiap langkah kami dalam melayani pelanggan.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Kartu 1 */}
          <div className="group bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition">
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">Kualitas Premium</h3>
            <p className="text-gray-500 leading-relaxed text-xs">
              Setiap laptop melalui 15+ titik pengecekan. Kami garansi performa dan fisik barang sebelum sampai ke tangan Anda.
            </p>
          </div>

          {/* Kartu 2 */}
          <div className="group bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition">
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M6 14h12m-6-6v12m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">Transparansi Penuh</h3>
            <p className="text-gray-500 leading-relaxed text-xs">
              Kami jelaskan kondisi laptop secara jujur, termasuk minus dan plusnya. Tidak ada manipulasi — kepercayaan adalah segalanya.
            </p>
          </div>

          {/* Kartu 3 */}
          <div className="group bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition">
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">Solusi Cerdas & Cepat</h3>
            <p className="text-gray-500 leading-relaxed text-xs">
              Bantu Anda memilih laptop yang pas dengan budget dan kebutuhan. Konsultasi gratis, respons cepat, tanpa drama.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM - compact */}
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Tim Kami
            </h2>
            <div className="w-12 h-0.5 bg-blue-500/60 mx-auto rounded-full mb-3" />
            <p className="text-gray-400 text-xs md:text-sm max-w-2xl mx-auto">
              Profesional yang berdedikasi memberikan pelayanan terbaik untuk setiap pelanggan.
            </p>
          </div>

          <TeamSlider />
        </div>
      </div>
    </main>
  );
}