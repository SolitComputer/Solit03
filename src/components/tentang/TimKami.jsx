import { motion } from "framer-motion";

// Foto tim — sama persis dengan yang dipakai di TeamSlider.jsx (src/assets/foto/)
import fotoReinaldy from "../../assets/foto/reinaldy-olyvierd-sendouw.webp";
import fotoYoga from "../../assets/foto/yoga-adi-prakoso.webp";
import fotoRayhan from "../../assets/foto/rayhan-saputra.webp";
import fotoYulfa from "../../assets/foto/yulfa.webp";
import fotoIkmal from "../../assets/foto/ikmal-fairuz-arabi.webp";
import fotoFauzan from "../../assets/foto/fauzan-abdul-g.webp";
import fotoMoreno from "../../assets/foto/moreno-akbari-p.webp";
import fotoDimas from "../../assets/foto/dimas-dwi-ap.webp";
import fotoNurAlim from "../../assets/foto/nur-alim.webp";
import fotoYuna from "../../assets/foto/yuna-lw.webp";
import fotoDivaK from "../../assets/foto/diva-k.webp";
import fotoRaesty from "../../assets/foto/raesty-yuliana.webp";
import fotoDirga from "../../assets/foto/dirga-riadmas.webp";
import fotoRafiDwi from "../../assets/foto/rafi-dwi-saputra.webp";
import fotoRafiSalim from "../../assets/foto/rafi-salim.webp";
import fotoLionel from "../../assets/foto/lionel-jaa.webp";
import fotoHaifano from "../../assets/foto/m-haifano-ap.webp";
import fotoFikri from "../../assets/foto/fikri-aryansyah.webp";
import fotoRomadon from "../../assets/foto/romadon-abdusallam.webp";
import fotoDicky from "../../assets/foto/dicky-pratama-s.webp";
import fotoFadriansyah from "../../assets/foto/fadriansyah.webp";
import fotoDavid from "../../assets/foto/david-j-sendouw.webp";
import fotoAmaliyah from "../../assets/foto/amaliyah.webp";
import fotoFauziahNurul from "../../assets/foto/fauziah-nurul-rahma.webp";
import fotoBungaChalista from "../../assets/foto/bunga-chalista-augustav.webp";
import fotoFitriHidayat from "../../assets/foto/fitri-hidayat.webp";
import fotoNovaRovatul from "../../assets/foto/nova-rovatul-walidah.webp";
import fotoHerry from "../../assets/foto/r-herry-sudiarman.webp";

const teamMembers = [
  { name: "Reinaldy Olyvierd Sendouw", role: "CEO", photo: fotoReinaldy },
  { name: "Yoga Adi Prakoso", role: "HRD", photo: fotoYoga },
  { name: "Rayhan Saputra", role: "Accounting", photo: fotoRayhan },
  { name: "Yulfa", role: "Purchasing", photo: fotoYulfa },
  { name: "Ikmal Fairuz Arabi", role: "Programmer", photo: fotoIkmal },
  { name: "Fauzan Abdul G", role: "Programmer", photo: fotoFauzan },
  { name: "Moreno Akbari P", role: "Programmer", photo: fotoMoreno },
  { name: "Dimas Dwi A.P", role: "Programmer", photo: fotoDimas },
  { name: "Nur Alim", role: "Marketing", photo: fotoNurAlim },
  { name: "Yuna L.W", role: "Content Creator", photo: fotoYuna },
  { name: "Diva K.", role: "Content Creator", photo: fotoDivaK },
  { name: "Raesty Yuliana", role: "Customer Service", photo: fotoRaesty },
  { name: "Dirga Riadmas", role: "Teknisi", photo: fotoDirga },
  { name: "Rafi Dwi Saputra", role: "Teknisi", photo: fotoRafiDwi },
  { name: "Rafi Salim", role: "Pengelola Barang", photo: fotoRafiSalim },
  { name: "Lionel J.A.A", role: "Pengelola Barang", photo: fotoLionel },
  { name: "M. Haifano A.P", role: "Pengelola Barang", photo: fotoHaifano },
  { name: "Fikri Aryansyah", role: "Penyedia Barang", photo: fotoFikri },
  { name: "Farrel Dewa A.", role: "Penyedia Barang", photo: null },
  { name: "Romadon Abdusallam", role: "Sales", photo: fotoRomadon },
  { name: "Dicky Pratama S.", role: "Sotech", photo: fotoDicky },
  { name: "Fadriansyah", role: "Onpoint", photo: fotoFadriansyah },
  { name: "David J. Sendouw", role: "Zenith", photo: fotoDavid },
  { name: "Andika", role: "Sales", photo: null },
  { name: "Amaliyah", role: "Sales", photo: fotoAmaliyah },
  { name: "Andini Sazia Putri", role: "Sales", photo: null },
  { name: "Fauziah Nurul Rahma", role: "Sales", photo: fotoFauziahNurul },
  { name: "Bunga Chalista Augustav", role: "Sales", photo: fotoBungaChalista },
  { name: "Fitri Hidayat", role: "Sales", photo: fotoFitriHidayat },
  { name: "Nova Rovatul Walidah", role: "Sales", photo: fotoNovaRovatul },
  { name: "Novita Glory", role: "Sales", photo: null },
  { name: "Tengku M.F", role: "Pengantaran", photo: null },
  { name: "R Herry Sudiarman", role: "Pengantaran", photo: fotoHerry },
];

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function TimKami() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="text-center mb-12 md:mb-16"
      >
        <motion.div variants={cardVariant}>
          <div className="inline-block mb-3">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
              Our People
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-content mb-3">
            Tim Kami
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mx-auto mb-4" />
          <p className="text-content-muted text-base md:text-lg max-w-2xl mx-auto">
            Orang-orang di balik setiap laptop yang sampai ke tangan Anda.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6"
      >
        {teamMembers.map((member, idx) => (
          <motion.div
            key={idx}
            variants={cardVariant}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="group bg-surface rounded-2xl border border-border shadow-soft hover:shadow-soft-lg overflow-hidden text-center"
          >
            <div className="aspect-square w-full overflow-hidden bg-blue-50">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-2xl">
                  {getInitials(member.name)}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-sm md:text-base font-bold text-content leading-tight">
                {member.name}
              </h3>
              <p className="text-xs md:text-sm text-blue-600 font-semibold mt-1">
                {member.role}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}