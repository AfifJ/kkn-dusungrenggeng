"use client";

import Link from "next/link";
import { Share2, ExternalLink, Heart } from "lucide-react";

export default function ResourceLinks() {
  const externalResources = [
    {
      title: "Pemerintah Kabupaten Magelang",
      url: "https://magelangkab.go.id",
      description: "Website resmi Pemerintah Kabupaten Magelang",
      category: "Pemerintahan"
    },
    {
      title: "Portal Data Desa Indonesia",
      url: "https://sid.kemendesa.go.id",
      description: "Sistem Informasi Desa Kementerian Desa",
      category: "Data Desa"
    },
    {
      title: "Dinas Pertanian Jawa Tengah",
      url: "https://distan.jatengprov.go.id",
      description: "Informasi pertanian dan teknologi terbaru",
      category: "Pertanian"
    },
    {
      title: "Wonderful Indonesia",
      url: "https://www.indonesia.travel",
      description: "Portal wisata resmi Indonesia",
      category: "Wisata"
    },
    {
      title: "Kementerian Desa PDT dan Transmigrasi",
      url: "https://kemendesa.go.id",
      description: "Program pemberdayaan desa dan transmigran",
      category: "Pemberdayaan"
    },
    {
      title: "Badan Standardisasi Nasional",
      url: "https://bsn.go.id",
      description: "Standar kualitas produk makanan dan pertanian",
      category: "Standarisasi"
    },
    {
      title: "Portal Nasional Republik Indonesia",
      url: "https://indonesia.go.id",
      description: "Portal informasi resmi pemerintah Indonesia",
      category: "Pemerintahan"
    },
    {
      title: "Direktorat Jenderal Pembangunan Desa",
      url: "https://bangdes.kemendesa.go.id",
      description: "Pembangunan infrastruktur dan ekonomi desa",
      category: "Pembangunan"
    }
  ];

  const socialMediaLinks = [
    {
      name: "Instagram",
      url: "https://instagram.com/dusungrenggeng",
      icon: "📷",
      description: "Foto kegiatan sehari-hari"
    },
    {
      name: "Facebook", 
      url: "https://facebook.com/dusungrenggeng",
      icon: "📘",
      description: "Update dan diskusi masyarakat"
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/6281234567890",
      icon: "💬",
      description: "Chat langsung dengan admin"
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@dusungrenggeng",
      icon: "📺", 
      description: "Video dokumentasi kegiatan"
    }
  ];

  const shareCurrentPage = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Dusun Grenggeng',
        text: 'Kunjungi website resmi Dusun Grenggeng - Desa tradisional penghasil tahu berkualitas',
        url: window.location.origin,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.origin);
      alert('Link website telah disalin ke clipboard!');
    }
  };

  const internalPages = [
    {
      title: "Profil Desa",
      url: "/#tentang",
      description: "Sejarah dan profil lengkap Dusun Grenggeng"
    },
    {
      title: "Produk Unggulan",
      url: "/produk",
      description: "Tahu tradisional dan hasil pertanian terbaik"
    },
    {
      title: "Kegiatan Desa",
      url: "/agenda",
      description: "Jadwal dan agenda kegiatan masyarakat"
    },
    {
      title: "Galeri Foto",
      url: "/galeri",
      description: "Dokumentasi kegiatan dan pemandangan desa"
    },
    {
      title: "Berita Terkini",
      url: "/berita",
      description: "Informasi dan perkembangan terbaru desa"
    },
    {
      title: "Kalender Kegiatan",
      url: "/kalender",
      description: "Jadwal lengkap kegiatan dan acara desa"
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-green-800 md:text-4xl">
            Jelajahi Lebih Lanjut
          </h2>
          <div className="mx-auto mb-6 h-1 w-20 bg-green-600"></div>
          <p className="mx-auto max-w-2xl text-gray-600">
            Temukan informasi dan sumber daya yang berguna untuk mengenal lebih dalam tentang Dusun Grenggeng dan sekitarnya
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Internal Links */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              Halaman Website Kami
            </h3>
            <div className="space-y-3">
              {internalPages.map((page, index) => (
                <div key={index} className="border-l-3 border-green-600 pl-4">
                  <Link
                    href={page.url}
                    className="block text-green-700 hover:text-green-900 font-medium transition-colors"
                  >
                    {page.title}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    {page.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              Sumber Daya External
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {externalResources.map((resource, index) => (
                <div key={index} className="border-l-3 border-blue-600 pl-4">
                  <Link
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-700 hover:text-blue-900 font-medium transition-colors"
                  >
                    {resource.title} ↗
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    {resource.description}
                  </p>
                  <span className="inline-block text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded mt-2">
                    {resource.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Ikuti Kami
            </h3>
            <div className="space-y-3 mb-6">
              {socialMediaLinks.map((social, index) => (
                <div key={index} className="border-l-3 border-purple-600 pl-4">
                  <Link
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition-colors"
                  >
                    <span className="text-lg">{social.icon}</span>
                    {social.name}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    {social.description}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Share Button */}
            <button
              onClick={shareCurrentPage}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Bagikan Website Ini
            </button>
          </div>
        </div>

        {/* Related Topics */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Topik Terkait
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Tahu Tradisional",
              "Pertanian Organik", 
              "Wisata Desa",
              "Budaya Jawa",
              "UMKM Desa",
              "Teknologi Pertanian",
              "Gotong Royong",
              "Ekonomi Kreatif"
            ].map((topic, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{topic.replace(/\s+/g, "")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
