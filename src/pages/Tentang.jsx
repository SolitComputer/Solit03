import { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import TeamSlider from "../components/tentang/TeamSlider";
import TimeTravelStory from "../components/tentang/TimeTravelStory";
import teamBg from "../assets/team-bg.webp";
import teknisi from "../assets/teknisi.webp";
import { Helmet } from "react-helmet-async";

export default function Tentang() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  // Variants untuk animasi
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>Tentang Solit 03 | Toko Laptop Second Bergaransi Depok</title>
        <meta
          name="description"
          content="Kenal lebih dekat dengan Solit 03, toko laptop second berkualitas di Depok. Menyediakan laptop bergaransi dengan quality control ketat dan pelayanan terpercaya."
        />
        <meta
          name="keywords"
          content="tentang solit03, toko laptop depok, laptop second bergaransi"
        />
        <link rel="canonical" href="https://solit03.com/tentang" />
      </Helmet>

      <main className="pt-8 bg-white overflow-hidden">
        {/* HERO - dengan animasi zoom dan fade */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative py-8 md:py-12"
        >
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative h-[280px] md:h-[360px] rounded-2xl overflow-hidden group cursor-pointer shadow-soft"
            >
              <motion.img
                src={teamBg}
                className="w-full h-full object-cover"
                alt="Hero Tentang Solit 03"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900/40 flex flex-col items-center justify-center text-white text-center px-4"
              >
                <motion.h1
                  initial={{ y: 20 }}
                  whileHover={{ y: 0 }}
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                >
                  Tentang Solit 03
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-3 text-sm md:text-base text-slate-100 max-w-md"
                >
                  Laptop Second Berkualitas Tinggi, Rasa Seperti Baru
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* STORY - dengan animasi scroll */}
        <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Berawal dari Kepercayaan, Tumbuh Berkat Kualitas
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-0.5 bg-blue-500/60 mx-auto mb-5 rounded-full"
            />
            <p className="text-slate-500 leading-relaxed text-base md:text-lg">
              Solit 03 hadir dari satu keresahan sederhana: mengapa laptop
              berkualitas tinggi harus selalu mahal? Kami percaya semua orang
              berhak mendapatkan perangkat terbaik tanpa harus mengorbankan
              banyak biaya.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
              transition={{ duration: 0.6 }}
            >
              <motion.img
                src={teknisi}
                className="rounded-2xl shadow-soft hover:shadow-soft-lg transition duration-300 w-full object-cover"
                alt="Teknisi Solit 03"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInRight}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h3
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl font-semibold mb-3 text-blue-600"
              >
                Proses & Komitmen Kami
              </motion.h3>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-500 leading-relaxed text-sm md:text-base mb-4"
              >
                Setiap laptop yang masuk ke Solit 03 melewati proses Quality
                Control (QC) berlapis untuk memastikan performa, fisik, dan
                komponen berjalan optimal.
              </motion.p>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-500 leading-relaxed text-sm md:text-base"
              >
                Kami tidak hanya menjual laptop bekas — kami menghadirkan
                kembali kualitas, kenyamanan, dan rasa percaya bagi setiap
                pengguna.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* PERJALANAN WAKTU — story timeline scroll-driven */}
        <TimeTravelStory />

        {/* VISI MISI - dengan animasi modern */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="py-16 md:py-20 px-4 relative overflow-hidden"
        >
          {/* Background dengan efek gradien dan blur */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Section Header */}
            <motion.div variants={fadeInUp} className="text-center mb-10 md:mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-3 shadow-soft-sm"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span className="text-[11px] font-semibold text-blue-700 tracking-wider uppercase">
                  Peta Perjalanan
                </span>
              </motion.div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                <span className="text-slate-900">
                  Visi &
                </span>
                <span className="text-blue-600 ml-2">
                  Misi Kami
                </span>
              </h2>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center gap-1.5 mt-3"
              >
                <div className="w-10 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                <div className="w-2 h-0.5 bg-blue-400 rounded-full" />
                <div className="w-2 h-0.5 bg-blue-300 rounded-full" />
              </motion.div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* VISI CARD */}
              <motion.div
                variants={fadeInLeft}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-soft-lg overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />

                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                <div className="absolute inset-[1px] bg-white rounded-2xl -z-10" />

                <div className="p-5 md:p-6 text-center relative">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="relative inline-block"
                  >
                    <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition duration-300" />
                    <div className="relative w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:scale-105 transition duration-300">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-bold mb-3">
                    <span className="text-blue-600">
                      Visi
                    </span>
                  </h3>

                  <p className="text-slate-600 leading-relaxed text-sm">
                    Menjadi perusahaan teknologi terpercaya yang menghadirkan
                    laptop berkualitas tinggi dengan harga yang terjangkau untuk
                    semua kalangan.
                  </p>
                </div>
              </motion.div>

              {/* MISI CARD */}
              <motion.div
                variants={fadeInRight}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-soft-lg overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />

                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                <div className="absolute inset-[1px] bg-white rounded-2xl -z-10" />

                <div className="p-5 md:p-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="relative inline-block mx-auto block w-fit mb-4"
                  >
                    <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition duration-300" />
                    <div className="relative w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-soft group-hover:scale-105 transition duration-300">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-bold text-center mb-4">
                    <span className="text-blue-600">
                      Misi
                    </span>
                  </h3>

                  <motion.ul
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    className="space-y-2.5"
                  >
                    {[
                      "Menyediakan laptop berkualitas dengan harga kompetitif",
                      "Memberikan layanan profesional dan transparan",
                      "Membangun kepercayaan jangka panjang dengan pelanggan",
                      "Mengedukasi pasar tentang laptop second berkualitas",
                    ].map((item, idx) => (
                      <motion.li
                        key={idx}
                        variants={fadeInRight}
                        whileHover={{ x: 5 }}
                        className="flex items-start gap-2 group/item"
                      >
                        <div className="relative flex-shrink-0 mt-0.5">
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow-soft-sm"
                          >
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </motion.div>
                        </div>
                        <span className="text-slate-600 text-xs md:text-sm leading-relaxed">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* VALUES - dengan animasi kartu */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-block mb-3">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  Core Values
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
                Nilai-Nilai Kami
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.6 }}
                className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mx-auto mb-4"
              />
              <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
                Prinsip yang menjadi fondasi setiap langkah kami dalam melayani
                pelanggan.
              </p>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
                title: "Kualitas Premium",
                desc: "Setiap laptop melalui 15+ titik pengecekan. Garansi performa dan fisik barang sebelum sampai ke tangan Anda.",
                gradient: "from-blue-100 to-blue-200",
                textColor: "text-blue-700",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M3 10h18M6 14h12m-6-6v12m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                ),
                title: "Transparansi Penuh",
                desc: "Kami jelaskan kondisi laptop secara jujur, termasuk minus dan plusnya. Tidak ada manipulasi — kepercayaan adalah segalanya.",
                gradient: "from-blue-100 to-blue-200",
                textColor: "text-blue-700",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                ),
                title: "Solusi Cerdas & Cepat",
                desc: "Bantu Anda memilih laptop yang pas dengan budget dan kebutuhan. Konsultasi gratis, respons cepat, tanpa drama.",
                gradient: "from-blue-100 to-blue-200",
                textColor: "text-blue-700",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-soft-lg overflow-hidden"
              >
                <div className="p-6 md:p-7 text-center">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft-sm`}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-50 py-12 md:py-16"
        >
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="text-center mb-10"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-2xl md:text-3xl font-bold text-slate-900 mb-3"
              >
                Tim Kami
              </motion.h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                transition={{ duration: 0.6 }}
                className="h-0.5 bg-blue-500/60 mx-auto rounded-full mb-4"
              />
              <motion.p
                variants={fadeInUp}
                className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto"
              >
                Profesional yang berdedikasi memberikan pelayanan terbaik untuk
                setiap pelanggan.
              </motion.p>
            </motion.div>

            <TeamSlider />
          </div>
        </motion.div>
      </main>
    </>
  );
}