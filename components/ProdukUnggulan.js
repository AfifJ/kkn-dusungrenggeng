"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function ProdukUnggulan() {
  const [produkUnggulan, setProdukUnggulan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const q = query(
          collection(db, "produk"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        
        const produkList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (produkList.length > 0) {
          setProdukUnggulan(produkList);
        } else {
          // Fallback to import if no data in Firebase
          const { produkData } = await import("../data/produk");
          setProdukUnggulan(produkData.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching produk:", error);
        // Fallback to import if Firebase fails
        try {
          const { produkData } = await import("../data/produk");
          setProdukUnggulan(produkData.slice(0, 3));
        } catch (importError) {
          console.error("Error importing produk data:", importError);
          setProdukUnggulan([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-green-800 md:text-4xl">
            Produk Unggulan
          </h2>
          <div className="mx-auto mb-6 h-1 w-20 bg-green-600"></div>
          <p className="mx-auto max-w-2xl text-gray-600">
            Hasil karya terbaik masyarakat Dusun Grenggeng dengan kualitas dan
            cita rasa unggulan
          </p>
        </div>

        {loading ? (
          // Loading skeleton
          <div className="mx-auto max-w-4xl space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col md:max-h-64 gap-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 md:flex-row">
                <div className="h-48 md:h-auto md:w-1/3 bg-gray-200 animate-pulse"></div>
                <div className="p-6 md:w-2/3">
                  <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : produkUnggulan.length > 0 ? (
          <div className="mx-auto max-w-4xl space-y-8">
            {produkUnggulan.map((item, index) => (
              <div
                key={item.id || `produk-${index}`}
                className="flex flex-col md:max-h-64 gap-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-shadow duration-300 hover:shadow-md md:flex-row"
              >
                <div className="h-48 md:h-auto md:w-1/3">
                  <Image
                    src={item.gambar || "https://images.unsplash.com/photo-1625044081468-a5b8c0b8b195"}
                    alt={item.nama}
                    width={500}
                    height={300}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1625044081468-a5b8c0b8b195";
                    }}
                    priority={index === 0}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyATrxzLxSjYGc+Cm6Znn2GQKbJeNf/2Q=="
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="mb-2 text-xl font-bold text-gray-800">
                    {item.nama}
                  </h3>
                  <p className="mb-4 text-gray-600">{item.deskripsi}</p>
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                    <span className="text-lg font-semibold text-green-700">
                      {item.harga}
                    </span>
                    <button className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800">
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Belum ada produk yang tersedia</p>
            <Link
              href="/produk"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Lihat Semua Produk
            </Link>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/produk"
            className="inline-flex items-center rounded-lg bg-green-700 px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-green-800"
          >
            Lihat Semua Produk
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
