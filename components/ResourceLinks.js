"use client";

import Link from "next/link";
import { Share2, ExternalLink, Heart } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { useEffect, useState } from "react";

export default function ResourceLinks() {
  const [resources, setResources] = useState({
    externalResources: [],
    internalPages: [],
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const docRef = doc(db, "settings", "website");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setResources({
            externalResources: data.resources?.externalResources || [],
            internalPages: data.resources?.internalPages || [],
          });
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResources();
  }, []);

  // Fallback data if Firebase is not available
  const externalResources =
    resources.externalResources.length > 0
      ? resources.externalResources
      : [
          {
            title: "Pemerintah Kabupaten Magelang",
            url: "https://magelangkab.go.id",
            description: "Website resmi Pemerintah Kabupaten Magelang",
          },
        ];

  const internalPages =
    resources.internalPages.length > 0
      ? resources.internalPages
      : [
          {
            title: "Profil Desa",
            url: "/#tentang",
            description: "Sejarah dan profil lengkap Dusun Grenggeng",
          },
          {
            title: "Produk Unggulan",
            url: "/produk",
            description: "Tahu tradisional dan hasil pertanian terbaik",
          },
          {
            title: "Kegiatan Desa",
            url: "/agenda",
            description: "Jadwal dan agenda kegiatan masyarakat",
          },
          {
            title: "Galeri Foto",
            url: "/galeri",
            description: "Dokumentasi kegiatan dan pemandangan desa",
          },
          {
            title: "Berita Terkini",
            url: "/berita",
            description: "Informasi dan perkembangan terbaru desa",
          },
          {
            title: "Kalender Kegiatan",
            url: "/kalender",
            description: "Jadwal lengkap kegiatan dan acara desa",
          },
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
            Temukan informasi dan sumber daya yang berguna untuk mengenal lebih
            dalam tentang Dusun Grenggeng dan sekitarnya
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
              {resources.externalResources.length === 0
                ? // Skeleton loading
                  Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="border-l-3 border-blue-600 pl-4 animate-pulse"
                    >
                      <div className="h-4 w-40 bg-blue-200 rounded mb-2"></div>
                      <div className="h-3 w-64 bg-blue-100 rounded"></div>
                    </div>
                  ))
                : externalResources.map((resource, index) => (
                    <div
                      key={index}
                      className="border-l-3 border-blue-600 pl-4"
                    >
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
                    </div>
                  ))}
            </div>
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
              "Ekonomi Kreatif",
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
