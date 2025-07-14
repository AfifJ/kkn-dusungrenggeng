"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/client";
import { beritaData } from "../../data/berita";

export default function BeritaPage() {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const q = query(
          collection(db, "berita"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        
        const beritaList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setBerita(beritaList.length > 0 ? beritaList : beritaData);
      } catch (error) {
        console.error("Error fetching berita:", error);
        setBerita(beritaData); // Fallback to static data
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-green-700 py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Semua Berita Terkini
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-green-100">
              Ikuti perkembangan terbaru dan berita menarik seputar kehidupan
              masyarakat Dusun Grenggeng
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-500">
                    Berita
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* News Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {berita.map((item) => {
              const generateSlug = (title) => {
                return title
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^\w\-]+/g, '');
              };

              return (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug || generateSlug(item.judul || item.title)}`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                    <div className="h-48">
                      <Image
                        src={item.gambar || item.image || "/placeholder-image.jpg"}
                        alt={item.judul || item.title || `Berita ${item.kategori || item.category || 'Dusun Grenggeng'}`}
                        width={500}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          {item.kategori || item.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.tanggal || 
                           (item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('id-ID') : 
                            new Date().toLocaleDateString('id-ID'))}
                        </span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-green-700 transition-colors">
                        {item.judul || item.title}
                      </h3>
                      <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                        {item.ringkasan || item.deskripsi || item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Oleh: {item.penulis || item.author || "Admin"}
                        </span>
                        <span className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors group-hover:bg-green-800">
                          Baca Selengkapnya
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/#berita"
            className="inline-flex items-center rounded-lg border border-green-700 px-6 py-3 font-medium text-green-700 transition-colors hover:bg-green-700 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5 rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
