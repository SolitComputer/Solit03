import TeamSlider from "../components/TeamSlider";

export default function Tentang() {
    return (
        <main className="pt-8">

            {/* HERO */}
            <section className="relative py-10 md:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="relative h-[300px] md:h-[420px] rounded-2xl overflow-hidden">
                        <img
                            src="src/assets/team-bg.jpg"
                            className="w-full h-full object-cover"
                        />
                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 flex flex-col items-center justify-center text-white text-center px-4">
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                                Tentang Solit 03
                            </h1>
                            <p className="mt-3 text-sm md:text-lg text-gray-200">
                                Laptop Second Berkualitas Tinggi, Rasa Seperti Baru
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* STORY */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        Berawal dari Kepercayaan, Tumbuh Berkat Kualitas
                    </h2>

                    <p className="text-gray-600 leading-relaxed">
                        Solit 03 hadir dari satu keresahan sederhana: mengapa laptop berkualitas tinggi
                        harus selalu mahal? Kami percaya semua orang berhak mendapatkan perangkat terbaik
                        tanpa harus mengorbankan banyak biaya.
                    </p>
                </div>

                {/* GRID */}
                <div className="grid md:grid-cols-2 gap-12 items-center mt-16">

                    <img
                        src="/assets/team-work.jpg"
                        className="rounded-2xl shadow-lg hover:scale-105 transition duration-300"
                    />

                    <div>
                        <h3 className="text-2xl font-semibold mb-4 text-primary">
                            Proses & Komitmen Kami
                        </h3>

                        <p className="text-gray-600 leading-relaxed mb-4">
                            Setiap laptop yang masuk ke Solit 03 melewati proses Quality Control (QC)
                            berlapis untuk memastikan performa, fisik, dan komponen berjalan optimal.
                        </p>

                        <p className="text-gray-600 leading-relaxed">
                            Kami tidak hanya menjual laptop bekas — kami menghadirkan kembali kualitas,
                            kenyamanan, dan rasa percaya bagi setiap pengguna.
                        </p>
                    </div>

                </div>
            </section>

            {/* VISI MISI */}
            <section className="bg-gray-50 py-20 px-6">
                <h2 className="text-center text-2xl md:text-3xl font-bold mb-12">
                    Visi dan Misi Kami
                </h2>

                <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">

                    {/* VISI */}
                    <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition">
                        <h3 className="font-bold text-xl mb-3 text-primary">Visi</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Menjadi perusahaan teknologi terpercaya yang menghadirkan laptop berkualitas tinggi
                            dengan harga yang terjangkau untuk semua kalangan.
                        </p>
                    </div>

                    {/* MISI */}
                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
                        <h3 className="font-bold text-xl mb-3 text-primary">Misi</h3>

                        <ul className="space-y-3 text-gray-600">
                            <li>✔ Menyediakan laptop berkualitas dengan harga kompetitif</li>
                            <li>✔ Memberikan layanan profesional dan transparan</li>
                            <li>✔ Membangun kepercayaan jangka panjang dengan pelanggan</li>
                            <li>✔ Mengedukasi pasar tentang laptop second berkualitas</li>
                        </ul>
                    </div>

                </div>
            </section>

            {/* VALUES */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <h2 className="text-center text-2xl md:text-3xl font-bold mb-12">
                    Nilai-Nilai Kami
                </h2>

                <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md hover:scale-105 transition">
                        <h3 className="font-semibold mb-2">Kualitas Tanpa Kompromi</h3>
                        <p className="text-sm text-blue-100">
                            Setiap produk melewati QC ketat untuk memastikan performa maksimal.
                        </p>
                    </div>

                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md hover:scale-105 transition">
                        <h3 className="font-semibold mb-2">Transparansi & Kepercayaan</h3>
                        <p className="text-sm text-blue-100">
                            Kami menjual dengan jujur tanpa manipulasi kondisi barang.
                        </p>
                    </div>

                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md hover:scale-105 transition">
                        <h3 className="font-semibold mb-2">Solusi Cerdas</h3>
                        <p className="text-sm text-blue-100">
                            Memberikan pilihan terbaik sesuai kebutuhan pelanggan.
                        </p>
                    </div>

                </div>
            </section>

            {/* TEAM */}
            <TeamSlider />

        </main>
    );
}