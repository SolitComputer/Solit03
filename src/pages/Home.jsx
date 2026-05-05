import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BestSeller from "../components/BestSeller";
import About from "../components/About";
import Services from "../components/Services";
import Promo from "../components/Promo";
import SocialMedia from "../components/SocialMedia";
import Testimoni from "../components/Testimoni";
import Location from "../components/Location";
import Marketplace from "../components/Marketplace";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <BestSeller />
      <About />
      <Services />
      <Promo />
      <SocialMedia />
      <Testimoni />
      <Location />
      <Marketplace />
      <Footer />
    </main>
  );
}