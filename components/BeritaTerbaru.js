"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/client";

export default function BeritaTerbaru() {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const q = query(
          collection(db, "berita"),
          where("status", "==", "published"),
          orderBy("createdAt", "desc"),
          limit(4)
        );
        const querySnapshot = await getDocs(q);

        const beritaList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBerita(beritaList);
      } catch (error) {
        console.error("Error fetching berita:", error);
        // Fallback ke data statis dan filter published
        try {
          const { beritaData } = await import("../data/berita");
          const publishedBerita = beritaData.filter(
            (item) => item.status === "published"
          );
          setBerita(publishedBerita.slice(0, 3));
        } catch (importError) {
          console.error("Error importing berita data:", importError);
          setBerita([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-green-800 md:text-4xl">
            Berita Terbaru
          </h2>
          <div className="mx-auto mb-6 h-1 w-20 bg-green-600"></div>
          <p className="mx-auto max-w-2xl text-gray-600">
            Informasi terkini seputar aktivitas dan perkembangan terbaru Dusun
            Grenggeng
          </p>
        </div>

        {loading ? (
          // Loading skeleton
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg bg-white shadow-md"
              >
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : berita.length > 0 ? (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {berita.map((item) => {
              const generateSlug = (title) => {
                return title
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^\w\-]+/g, "");
              };

              return (
                <Link
                  key={item.id}
                  href={`/berita/${
                    item.slug || generateSlug(item.judul || item.title)
                  }`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 group-hover:shadow-lg">
                    <div className="h-48 overflow-hidden relative bg-gray-200">
                      {(item.gambar || item.image) ? (
                        <Image
                          src={item.gambar || item.image}
                          alt={item.judul || item.title}
                          width={500}
                          height={300}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          priority={false}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyATrxzLxSjYGc+Cm6Znn2GQKbJeNf/2Q=="
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-center p-4">
                          <h3 className="text-lg font-semibold text-gray-600 break-words">
                            {item.judul || item.title}
                          </h3>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold tracking-wider text-green-600 uppercase">
                          {item.kategori || "Berita"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.tanggal || item.date}
                        </span>
                      </div>
                      <h3 className="mb-3 text-xl line-clamp-2 h-14 font-bold text-gray-800 transition-colors group-hover:text-green-700">
                        {item.judul || item.title}
                      </h3>
                      <p className="mb-4 text-gray-600">
                        {item.ringkasan || item.deskripsi || item.excerpt}
                      </p>
                      <span className="inline-flex items-center font-medium text-green-600 transition-colors group-hover:text-green-800">
                        Baca selengkapnya
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-1 h-4 w-4"
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
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto max-w-5xl text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Belum Ada Berita Terbaru
              </h3>
              <p className="text-gray-600 mb-6">
                Saat ini belum ada berita yang dipublikasikan. Silakan cek
                kembali nanti.
              </p>
              <Link
                href="/berita"
                className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
              >
                Lihat Semua Berita
              </Link>
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/berita"
            className="inline-block rounded-lg bg-green-700 px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-green-800"
          >
            Lihat Semua Berita
          </Link>
        </div>
      </div>
    </section>
  );
}
