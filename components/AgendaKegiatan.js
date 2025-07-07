import { Calendar, CheckCircle, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export default function AgendaKegiatan() {
  // Data agenda kelompok berdasarkan tanggal
  const agendaGroups = [
    {
      date: "Senin, 15 Agustus 2023",
      activities: [
        {
          id: 1,
          time: "05:00 - 07:00",
          title: "Pembuatan Tahu Batch Pagi",
          description:
            "Proses pembuatan tahu tradisional dengan bahan baku kedelai pilihan",
          location: "Sentra Produksi Tahu Dusun Grenggeng",
          completed: true,
        },
        {
          id: 2,
          time: "08:00 - 10:00",
          title: "Pengepakan dan Distribusi",
          description:
            "Pengepakan tahu untuk dikirim ke pasar tradisional sekitar",
          location: "Gudang Pengemasan Dusun",
          completed: true,
        },
        {
          id: 3,
          time: "13:00 - 15:00",
          title: "Pelatihan Pembuatan Tahu Variasi",
          description:
            "Pelatihan untuk ibu-ibu PKK membuat variasi olahan tahu",
          location: "Balai Dusun Grenggeng",
          completed: false,
        },
      ],
    },
    {
      date: "Selasa, 16 Agustus 2023",
      activities: [
        {
          id: 4,
          time: "06:00 - 09:00",
          title: "Panen Padi Kelompok Tani",
          description: "Panen raya di sawah bagian timur dusun",
          location: "Sawah Blok Timur Dusun",
          completed: false,
        },
        {
          id: 5,
          time: "10:00 - 12:00",
          title: "Gotong Royong Membersihkan Selokan",
          description: "Kegiatan kerja bakti membersihkan saluran air dusun",
          location: "Selokan Jalan Utama",
          completed: false,
        },
      ],
    },
  ];

  // Gabungkan semua aktivitas dari berbagai tanggal
  const allActivities = agendaGroups.flatMap((group) =>
    group.activities.map((activity) => ({
      ...activity,
      date: group.date,
    }))
  );

  // Filter hanya yang belum selesai
  const pendingActivities = allActivities.filter(
    (activity) => !activity.completed
  );

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Agenda Kegiatan
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Jadwal kegiatan harian masyarakat Dusun Grenggeng
          </p>
        </div>

        {/* Agenda Content */}
        {pendingActivities.length > 0 ? (
          <div className="bg-white rounded-2xl max-w-lg mx-auto shadow-sm border border-gray-100 overflow-hidden">
            {/* Activities List */}
            <div className="p-6">
              <div className="space-y-0">
                {pendingActivities.map((activity, index) => (
                  <div key={activity.id} className="relative pb-6">
                    {/* Timeline Line */}
                    {index < pendingActivities.length - 1 && (
                      <div className="absolute left-5 top-10 w-0.5 h-full bg-gray-200"></div>
                    )}

                    <div className="flex gap-4">
                      {/* Status Indicator */}
                      <div className="flex-shrink-0 relative">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300">
                          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        </div>
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-3">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {activity.title}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed mb-2">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-2 text-gray-500 mb-3">
                            <MapPin size={14} />
                            <span className="text-sm">{activity.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-blue-600">
                            <Calendar size={14} />
                            <span className="font-medium">{activity.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock size={14} />
                            <span className="font-medium">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Semua Kegiatan Selesai
            </h3>
            <p className="text-gray-600">
              Tidak ada kegiatan yang tersisa untuk hari ini
            </p>
          </div>
        )}

        {/* Action Section */}
        <div className="text-center mt-8">
          <Link
            href="/kalender"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Calendar size={20} />
            Lihat Kalender Lengkap
          </Link>
        </div>
      </div>
    </section>
  );
}
