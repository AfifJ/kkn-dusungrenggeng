import Link from "next/link";
import { ArrowLeft, Home, Search, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Halaman Tidak Ditemukan - 404 | Dusun Grenggeng",
  description:
    "Halaman yang Anda cari tidak ditemukan. Jelajahi halaman lain di website Dusun Grenggeng.",
};

export default function NotFound() {
  const popularPages = [
    {
      title: "Berita Terkini",
      description: "Informasi dan perkembangan terbaru dari Dusun Grenggeng",
      href: "/berita",
      icon: "📰",
    },
    {
      title: "Produk Unggulan",
      description: "Tahu tradisional dan hasil pertanian berkualitas",
      href: "/produk",
      icon: "🏪",
    },
    {
      title: "Galeri Foto",
      description: "Dokumentasi kegiatan dan pemandangan desa",
      href: "/galeri",
      icon: "📸",
    },
    {
      title: "Agenda Kegiatan",
      description: "Jadwal dan kalender kegiatan masyarakat",
      href: "/agenda",
      icon: "📅",
    },
  ];

  const helpfulLinks = [
    {
      title: "Pemerintah Kabupaten Magelang",
      href: "https://magelangkab.go.id",
      external: true,
    },
    {
      title: "Portal Data Desa Indonesia",
      href: "https://sid.kemendesa.go.id",
      external: true,
    },
    {
      title: "Dinas Pertanian Jawa Tengah",
      href: "https://distan.jatengprov.go.id",
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">
      <Navbar />
      {/* Header */}
      {/* <header className="bg-green-800 text-white py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="text-xl font-bold hover:text-green-200 transition-colors"
          >
            Dusun Grenggeng
          </Link>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="flex-1 mt-16 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl w-full text-center">
          {/* 404 Error Display */}
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-green-700 mb-4 opacity-20">
              404
            </h1>
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                Halaman Tidak Ditemukan
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin
                halaman telah dipindahkan, dihapus, atau URL yang Anda masukkan
                salah.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition-colors"
              >
                <Home size={20} />
                Kembali ke Beranda
              </Link>
            </div>
          </div>

          {/* Search Suggestion */}
          <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Coba Cari Halaman Lain
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Gunakan menu navigasi di atas atau kunjungi halaman beranda untuk
              menemukan informasi yang Anda butuhkan.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { name: "Beranda", href: "/" },
                { name: "Berita", href: "/berita" },
                { name: "Produk", href: "/produk" },
                { name: "Galeri", href: "/galeri" },
                { name: "Agenda", href: "/agenda" },
                { name: "Kalender", href: "/kalender" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-green-200 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-green-200">
            © 2025 Dusun Grenggeng. Seluruh hak cipta dilindungi.
          </p>
          <div className="mt-4 space-x-6">
            <Link
              href="/berita"
              className="text-green-200 hover:text-white transition-colors"
            >
              Berita
            </Link>
            <Link
              href="/produk"
              className="text-green-200 hover:text-white transition-colors"
            >
              Produk
            </Link>
            <Link
              href="/galeri"
              className="text-green-200 hover:text-white transition-colors"
            >
              Galeri
            </Link>
            <Link
              href="/#kontak"
              className="text-green-200 hover:text-white transition-colors"
            >
              Kontak
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
