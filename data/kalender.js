export const kalenderData = [
  {
    date: "2024-11-15",
    dayName: "Jumat",
    activities: [
      {
        id: 1,
        time: "05:00 - 07:00",
        title: "Pembuatan Tahu Batch Pagi",
        description: "Proses pembuatan tahu tradisional dengan bahan baku kedelai pilihan",
        location: "Sentra Produksi Tahu Dusun Grenggeng",
        completed: true,
        category: "Produksi"
      },
      {
        id: 2,
        time: "08:00 - 10:00",
        title: "Pengepakan dan Distribusi",
        description: "Pengepakan tahu untuk dikirim ke pasar tradisional sekitar",
        location: "Gudang Pengemasan Dusun",
        completed: true,
        category: "Distribusi"
      }
    ]
  },
  {
    date: "2024-11-16",
    dayName: "Sabtu",
    activities: [
      {
        id: 3,
        time: "06:00 - 09:00",
        title: "Panen Padi Kelompok Tani",
        description: "Panen raya di sawah bagian timur dusun",
        location: "Sawah Blok Timur Dusun",
        completed: false,
        category: "Pertanian"
      },
      {
        id: 4,
        time: "10:00 - 12:00",
        title: "Gotong Royong Membersihkan Selokan",
        description: "Kegiatan kerja bakti membersihkan saluran air dusun",
        location: "Selokan Jalan Utama",
        completed: false,
        category: "Lingkungan"
      }
    ]
  },
  {
    date: "2024-11-17",
    dayName: "Minggu",
    activities: [
      {
        id: 5,
        time: "07:00 - 09:00",
        title: "Senam Pagi Bersama",
        description: "Kegiatan senam pagi rutin warga dusun",
        location: "Lapangan Dusun",
        completed: false,
        category: "Kesehatan"
      },
      {
        id: 6,
        time: "14:00 - 16:00",
        title: "Pelatihan Kerajinan Tangan",
        description: "Workshop membuat kerajinan dari bahan daur ulang",
        location: "Balai Dusun Grenggeng",
        completed: false,
        category: "Keterampilan"
      }
    ]
  },
  {
    date: "2024-11-18",
    dayName: "Senin",
    activities: [
      {
        id: 7,
        time: "05:30 - 07:30",
        title: "Pembuatan Tahu Batch Pagi",
        description: "Produksi tahu harian untuk memenuhi permintaan pasar",
        location: "Sentra Produksi Tahu",
        completed: false,
        category: "Produksi"
      },
      {
        id: 8,
        time: "19:00 - 21:00",
        title: "Rapat Koordinasi RT",
        description: "Rapat bulanan membahas program dusun",
        location: "Rumah Ketua RT",
        completed: false,
        category: "Administrasi"
      }
    ]
  }
];

export const kategoriWarna = {
  "Produksi": "bg-blue-100 text-blue-800",
  "Distribusi": "bg-green-100 text-green-800",
  "Pertanian": "bg-yellow-100 text-yellow-800",
  "Lingkungan": "bg-emerald-100 text-emerald-800",
  "Kesehatan": "bg-pink-100 text-pink-800",
  "Keterampilan": "bg-purple-100 text-purple-800",
  "Administrasi": "bg-gray-100 text-gray-800"
};
