import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Produk UMKM - Dusun Grenggeng",
  description: "Produk unggulan UMKM lokal Dusun Grenggeng. Temukan berbagai produk berkualitas dari masyarakat desa, mulai dari kerajinan tangan, makanan tradisional, hingga produk pertanian organik.",
  keywords: "produk UMKM, dusun grenggeng, kerajinan tangan, makanan tradisional, produk lokal, pertanian organik, jawa tengah",
  openGraph: {
    title: "Produk UMKM - Dusun Grenggeng",
    description: "Produk unggulan UMKM lokal dari Dusun Grenggeng",
    url: "https://dusungrenggeng.vercel.app/produk",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Produk UMKM Dusun Grenggeng",
      },
    ],
  },
};

export default function ProdukLayout({ children }) {
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
