import TeamSlider from "../components/tentang/TeamSlider";

export default function Tentang() {
  return (
    <main className="pt-8 bg-white">

      {/* HERO - animasi tetap, desain lebih rapi */}
      <section className="relative py-10 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative h-[300px] md:h-[420px] rounded-2xl overflow-hidden group cursor-pointer shadow-md">
            <img
              src="src/assets/team-bg.jpg"
              className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              alt="Hero Tentang Solit 03"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight translate-y-6 group-hover:translate-y-0 transition duration-500">
                Tentang Solit 03
              </h1>
              <p className="mt-3 text-sm md:text-lg text-gray-100 opacity-0 group-hover:opacity-100 transition duration-700 delay-100 max-w-md">
                Laptop Second Berkualitas Tinggi, Rasa Seperti Baru
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY - perbaiki heading & spacing */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Berawal dari Kepercayaan, Tumbuh Berkat Kualitas
          </h2>
          <div className="w-20 h-1 bg-primary/40 mx-auto mb-8 rounded-full" />
          <p className="text-gray-500 leading-relaxed text-lg">
            Solit 03 hadir dari satu keresahan sederhana: mengapa laptop berkualitas tinggi
            harus selalu mahal? Kami percaya semua orang berhak mendapatkan perangkat terbaik
            tanpa harus mengorbankan banyak biaya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
          <img
            src="src/assets/teknisi.webp"
            className="rounded-2xl shadow-md hover:scale-105 transition duration-300 w-full object-cover"
            alt="Teknisi Solit 03"
          />
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">
              Proses & Komitmen Kami
            </h3>
            <p className="text-gray-500 leading-relaxed mb-4">
              Setiap laptop yang masuk ke Solit 03 melewati proses Quality Control (QC)
              berlapis untuk memastikan performa, fisik, dan komponen berjalan optimal.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Kami tidak hanya menjual laptop bekas — kami menghadirkan kembali kualitas,
              kenyamanan, dan rasa percaya bagi setiap pengguna.
            </p>
          </div>
        </div>
      </section>

      {/* VISI MISI - card lebih soft dengan shadow halus */}
      <section className="bg-gray-50 py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Visi dan Misi Kami
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* VISI */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Visi</h3>
              <p className="text-gray-500 leading-relaxed">
                Menjadi perusahaan teknologi terpercaya yang menghadirkan laptop berkualitas tinggi
                dengan harga yang terjangkau untuk semua kalangan.
              </p>
            </div>

            {/* MISI */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary text-center">Misi</h3>
              <ul className="space-y-2 text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="text-primary text-lg">✓</span>
                  Menyediakan laptop berkualitas dengan harga kompetitif
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary text-lg">✓</span>
                  Memberikan layanan profesional dan transparan
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary text-lg">✓</span>
                  Membangun kepercayaan jangka panjang dengan pelanggan
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary text-lg">✓</span>
                  Mengedukasi pasar tentang laptop second berkualitas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES - warna lebih soft, tetap ada hover scale */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
  <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-4">
    Nilai-Nilai Kami
  </h2>
  <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
    Prinsip yang menjadi fondasi setiap langkah kami dalam melayani pelanggan.
  </p>

  <div className="grid md:grid-cols-3 gap-8">
    {/* Kartu 1 */}
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition">
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">Kualitas Premium</h3>
      <p className="text-gray-500 leading-relaxed">
        Setiap laptop melalui 15+ titik pengecekan. Kami garansi performa dan fisik barang sebelum sampai ke tangan Anda.
      </p>
    </div>

    {/* Kartu 2 */}
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition">
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M6 14h12m-6-6v12m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">Transparansi Penuh</h3>
      <p className="text-gray-500 leading-relaxed">
        Kami jelaskan kondisi laptop secara jujur, termasuk minus dan plusnya. Tidak ada manipulasi — kepercayaan adalah segalanya.
      </p>
    </div>

    {/* Kartu 3 */}
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition">
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">Solusi Cerdas & Cepat</h3>
      <p className="text-gray-500 leading-relaxed">
        Bantu Anda memilih laptop yang pas dengan budget dan kebutuhan. Konsultasi gratis, respons cepat, tanpa drama.
      </p>
    </div>
  </div>
</section>


      {/* TEAM - tambahkan sedikit spacing wrapper */}
     {/* TEAM - wrapper dengan desain lebih elegan */}
<div className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-28">
  <div className="max-w-6xl mx-auto px-6">
    {/* Heading dengan aksen garis */}
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
        Tim Kami
      </h2>
      <div className="w-20 h-1 bg-primary/40 mx-auto rounded-full mb-4" />
      <p className="text-gray-500 max-w-2xl mx-auto">
        Profesional yang berdedikasi memberikan pelayanan terbaik untuk setiap pelanggan.
      </p>
    </div>

    {/* Konten slider - animasi tetap utuh */}
    <TeamSlider />
  </div>
</div>
    </main>
  );
}