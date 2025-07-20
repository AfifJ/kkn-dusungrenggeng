import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Galeri Foto - Dusun Grenggeng",
  description: "Galeri foto dokumentasi kegiatan dan keindahan Dusun Grenggeng. Lihat berbagai momen bersejarah, kegiatan budaya, dan pemandangan alam desa tradisional di Jawa Tengah.",
  keywords: "galeri foto, dusun grenggeng, dokumentasi kegiatan, budaya tradisional, pemandangan desa, jawa tengah",
  openGraph: {
    title: "Galeri Foto - Dusun Grenggeng",
    description: "Galeri foto dokumentasi kegiatan dan keindahan Dusun Grenggeng",
    url: "https://dusungrenggeng.vercel.app/galeri",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Galeri Foto Dusun Grenggeng",
      },
    ],
  },
};

export default function GaleriLayout({ children }) {
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
