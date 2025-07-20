import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Berita Terkini - Dusun Grenggeng",
  description: "Berita terbaru dan informasi terkini dari Dusun Grenggeng. Ikuti perkembangan kegiatan masyarakat, program desa, dan berbagai aktivitas budaya di desa tradisional Jawa Tengah.",
  keywords: "berita dusun grenggeng, informasi desa, kegiatan masyarakat, berita terkini, desa tradisional, jawa tengah",
  openGraph: {
    title: "Berita Terkini - Dusun Grenggeng",
    description: "Berita terbaru dan informasi terkini dari Dusun Grenggeng",
    url: "https://dusungrenggeng.vercel.app/berita",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Berita Dusun Grenggeng",
      },
    ],
  },
};

export default function BeritaLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
