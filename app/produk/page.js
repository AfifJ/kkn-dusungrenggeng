"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function ProdukPage() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const q = query(
          collection(db, "produk"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        
        const produkList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProduk(produkList);
      } catch (error) {
        console.error("Error fetching produk:", error);
        setProduk([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Semua Produk Unggulan
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-green-100">
              Temukan berbagai produk berkualitas dari Dusun Grenggeng dengan
              cita rasa autentik dan kualitas terjamin
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
                    Produk
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : produk.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {produk.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="h-48">
                  <Image
                    src={item.gambar || item.image || "/placeholder-image.jpg"}
                    alt={item.nama || item.name || `Produk ${item.kategori || 'Dusun Grenggeng'}`}
                    width={500}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-800">
                    {item.nama || item.name}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                    {item.deskripsi || item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-green-700">
                      {item.harga || item.price}
                    </span>
                    <Link
                      href={`https://wa.me/${item.kontak ? item.kontak.startsWith('0') ? '62' + item.kontak.substring(1) : item.kontak : ''}?text=Saya%20tertarik%20dengan%20produk%20anda%20"${encodeURIComponent(item.nama || item.name)}"`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 inline-block"
                    >
                      Pesan Sekarang
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Belum ada produk tersedia
            </h3>
            <p className="text-gray-600">
              Produk akan segera ditambahkan
            </p>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/#produk"
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
