import Image from "next/image";
import Link from "next/link";
import { produkData } from "@/data/produk";

export default function ProdukPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 py-16">
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {produkData.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="h-48">
                <Image
                  src={item.gambar}
                  alt={item.nama}
                  width={500}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-800">
                  {item.nama}
                </h3>
                <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                  {item.deskripsi}
                </p>
                <div className="flex items-center justify-between">
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
