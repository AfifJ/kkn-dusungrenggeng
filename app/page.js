import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatistikSection from "../components/StatistikSection";
import SambutanKepala from "../components/SambutanKepala";
import BeritaTerbaru from "../components/BeritaTerbaru";
import ProdukUnggulan from "../components/ProdukUnggulan";
import Gallery from "../components/Gallery";
import AgendaKegiatan from "../components/AgendaKegiatan";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="font-sans">
      <Navbar />
      <div id="hero">
        <HeroSection />
      </div>
      <div id="tentang">
        <StatistikSection />
        <SambutanKepala />
      </div>
      <BeritaTerbaru />
      <div id="produk">
        <ProdukUnggulan />
      </div>
      <div id="galeri">
        <Gallery />
      </div>
      <div id="agenda">
        <AgendaKegiatan />
      </div>
      <div id="kontak">
        <Footer />
      </div>
    </div>
  );
}
