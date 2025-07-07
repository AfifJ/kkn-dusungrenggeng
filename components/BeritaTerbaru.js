import Image from "next/image";
import Link from "next/link";

export default function BeritaTerbaru() {
  const berita = [
    {
      id: 1,
      title: "Festival Tahu Grenggeng Kembali Digelar",
      excerpt:
        "Festival tahunan tahu tradisional Dusun Grenggeng akan digelar pada 15 Agustus mendatang dengan berbagai lomba dan pameran produk olahan tahu.",
      date: "12 Juni 2023",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      title: "Panen Raya Komoditas Pertanian",
      excerpt:
        "Masyarakat Dusun Grenggeng bersyukur atas hasil panen yang melimpah tahun ini, dengan peningkatan produksi hingga 20% dibanding tahun sebelumnya.",
      date: "5 Juni 2023",
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
  ];

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

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {berita.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={500}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-green-600 uppercase">
                    Berita
                  </span>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-800 transition-colors hover:text-green-700">
                  {item.title}
                </h3>
                <p className="mb-4 text-gray-600">{item.excerpt}</p>
                <Link
                  href="/berita"
                  className="inline-flex items-center font-medium text-green-600 transition-colors hover:text-green-800"
                >
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
                </Link>
              </div>
            </div>
          ))}
        </div>

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
