import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatistikSection from "../components/StatistikSection";
import SambutanKepala from "../components/SambutanKepala";
import BeritaTerbaru from "../components/BeritaTerbaru";
import ProdukUnggulan from "../components/ProdukUnggulan";
import Gallery from "../components/Gallery";
import AgendaKegiatan from "../components/AgendaKegiatan";
import ResourceLinks from "../components/ResourceLinks";
import Footer from "../components/Footer";
import StructuredData from "../components/StructuredData";

// Explicit metadata export for homepage SEO
export const metadata = {
  title: "Dusun Grenggeng - Desa Tradisional Penghasil Tahu Berkualitas | Jawa Tengah",
  description: "Website resmi Dusun Grenggeng - Desa tradisional dengan budaya Jawa yang kaya. Produk tahu berkualitas, hasil pertanian segar, dan kegiatan masyarakat di Magelang, Jawa Tengah.",
  keywords: "dusun grenggeng, tahu tradisional, magelang, jawa tengah, desa wisata, budaya jawa, umkm, pertanian organik",
  openGraph: {
    title: "Dusun Grenggeng - Desa Tradisional Penghasil Tahu Berkualitas",
    description: "Kunjungi Dusun Grenggeng untuk merasakan keaslian tahu tradisional dan keindahan alam Jawa Tengah",
    url: "https://www.dusungrenggeng.netlify.app",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dusun Grenggeng - Desa Tradisional Jawa Tengah"
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://www.dusungrenggeng.netlify.app"
  }
};

export default function Home() {
  return (
    <>
      <StructuredData type="Organization" />
      <StructuredData type="LocalBusiness" />
      <StructuredData type="WebSite" />
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
        <ResourceLinks />
        <div id="kontak">
          <Footer />
        </div>
      </div>
    </>
  );
}
