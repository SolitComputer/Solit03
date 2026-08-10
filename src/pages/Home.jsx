import Hero from "../components/Hero";
import BestSeller from "../components/LatestProduct";
import About from "../components/About";
import StatsStrip from "../components/StatsStrip";
import Services from "../components/Services";
import JasaWebPromo from "../components/JasaWebPromo";
import Promo from "../components/Promo";
import SocialMedia from "../components/SocialMedia";
import Testimoni from "../components/Testimoni";
import Location from "../components/Location";
import Marketplace from "../components/Marketplace";
import Footer from "../components/layout/Footer";
import ChatBot from "../components/ChatBot";
import LatestArticles from "../components/berita/LatestArticles";
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>
          Laptop Second Bergaransi Murah di Depok | Solit 03
        </title>

        <meta
          name="description"
          content="Solit 03 toko laptop second bergaransi di Depok. Laptop untuk kuliah, kerja, coding, desain hingga gaming dengan harga terbaik."
        />

        <link
          rel="canonical"
          href="https://solit03.com"
        />
      </Helmet>
      <main className="overflow-x-hidden">
        <Hero />
        <BestSeller />
        <About />
        <StatsStrip />
        <Services />
        <JasaWebPromo />
        <Promo />
        <LatestArticles />
        <SocialMedia />
        <Testimoni />
        <Location />
        <Marketplace />
        <ChatBot />
      </main>
    </>
  );
}  