"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function Gallery() {
  const [galeriData, setGaleriData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaleri = async () => {
      try {
        const q = query(
          collection(db, "galeri"),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const querySnapshot = await getDocs(q);
        
        const galeriList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setGaleriData(galeriList);
      } catch (error) {
        console.error("Error fetching galeri:", error);
        setGaleriData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGaleri();
  }, []);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-green-800 md:text-4xl">
            Galeri Dusun Grenggeng
          </h2>
          <div className="mx-auto mb-6 h-1 w-20 bg-green-600"></div>
          <p className="mx-auto max-w-2xl text-gray-600">
            Dokumentasi kegiatan dan keindahan alam Dusun Grenggeng
          </p>
        </div>

        {/* Grid Gallery */}
        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : galeriData.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galeriData.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="h-64 relative bg-gray-200">
                  {(photo.gambar || photo.image) ? (
                    <Image
                      src={photo.gambar || photo.image}
                      alt={photo.judul || photo.title}
                      width={500}
                      height={300}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `
                          <div class="absolute inset-0 bg-gray-200 flex items-center justify-center text-center p-4">
                            <h3 class="text-lg font-semibold text-gray-600 break-words">
                              ${photo.judul || photo.title}
                            </h3>
                          </div>
                        `;
                      }}
                      priority={false}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyATrxzLxSjYGc+Cm6Znn2GQKbJeNf/2Q=="
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-center p-4">
                      <h3 className="text-lg font-semibold text-gray-600 break-words">
                        {photo.judul || photo.title}
                      </h3>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div>
                    <span className="mb-1 inline-block rounded bg-green-600 px-2 py-1 text-xs text-white">
                      {photo.kategori || photo.category}
                    </span>
                    <h3 className="font-medium text-white">{photo.judul || photo.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Belum ada foto galeri yang tersedia</p>
            <Link
              href="/galeri"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Lihat Semua Galeri
            </Link>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/galeri"
            className="inline-flex items-center rounded-lg border border-green-700 bg-white px-6 py-3 font-medium text-green-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            Lihat Lebih Banyak
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
