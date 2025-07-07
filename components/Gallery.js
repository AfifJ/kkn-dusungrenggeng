import Image from "next/image";
import Link from "next/link";

export default function Gallery() {
  const photos = [
    {
      id: 1,
      title: "Proses Pembuatan Tahu Tradisional",
      category: "Produksi",
      image:
        "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      title: "Panen Padi di Sawah Grenggeng",
      category: "Pertanian",
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      title: "Festival Tahu Tahunan",
      category: "Acara",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 4,
      title: "Pemandangan Sawah di Pagi Hari",
      category: "Alam",
      image:
        "https://images.unsplash.com/photo-1560493676-04071cc5c64a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 5,
      title: "Kegiatan Gotong Royong Warga",
      category: "Masyarakat",
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 6,
      title: "Pasar Tahu Dusun Grenggeng",
      category: "Produksi",
      image:
        "https://images.unsplash.com/photo-1601050690647-894957f6d9b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
  ];

  const categories = [
    "Semua",
    "Produksi",
    "Pertanian",
    "Acara",
    "Alam",
    "Masyarakat",
  ];

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

        {/* Filter Kategori */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === "Semua"
                  ? "bg-green-700 text-white hover:bg-green-800"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid Gallery */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <Image
                src={photo.image}
                alt={photo.title}
                width={500}
                height={300}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div>
                  <span className="mb-1 inline-block rounded bg-green-600 px-2 py-1 text-xs text-white">
                    {photo.category}
                  </span>
                  <h3 className="font-medium text-white">{photo.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

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
