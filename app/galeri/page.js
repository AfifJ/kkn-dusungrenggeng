import Image from "next/image";
import Link from "next/link";
import { galeriData } from "../../data/galeri";

export default function GaleriPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Galeri Dusun Grenggeng
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-green-100">
              Jelajahi keindahan alam, budaya, dan kehidupan sehari-hari 
              masyarakat Dusun Grenggeng melalui koleksi foto kami
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
                    Galeri
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {galeriData.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="h-64">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={500}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    {item.category}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.deskripsi || `Dokumentasi ${item.category.toLowerCase()} di Dusun Grenggeng`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/#galeri"
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
