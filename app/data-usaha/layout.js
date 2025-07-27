import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Kalender Kegiatan - Dusun Grenggeng",
  description:
    "Kalender agenda dan kegiatan Dusun Grenggeng. Pantau jadwal acara desa, upacara adat, kegiatan budaya, dan program masyarakat yang akan datang di desa tradisional Jawa Tengah.",
  keywords:
    "kalender kegiatan, agenda desa, dusun grenggeng, jadwal acara, upacara adat, kegiatan budaya, jawa tengah",
  openGraph: {
    title: "Kalender Kegiatan - Dusun Grenggeng",
    description: "Kalender agenda dan kegiatan Dusun Grenggeng",
    url: "https://dusungrenggeng.vercel.app/kalender",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kalender Kegiatan Dusun Grenggeng",
      },
    ],
  },
};

export default function KalenderLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
