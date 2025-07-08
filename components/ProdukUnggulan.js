import Image from "next/image";
import Link from "next/link";
import { produkData } from "../data/produk";

export default function ProdukUnggulan() {
  // Filter hanya produk unggulan (featured)
  const produkUnggulan = produkData;

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

        <div className="mx-auto max-w-4xl space-y-8">
          {produkUnggulan.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:max-h-64 gap-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-shadow duration-300 hover:shadow-md md:flex-row"
            >
              <div className="h-48 md:h-auto md:w-1/3">
                <Image
                  src={item.gambar}
                  alt={item.nama}
                  width={500}
                  height={300}
                  className="h-full w-full object-cover"
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
