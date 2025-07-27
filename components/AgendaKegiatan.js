"use client";
import { useState, useEffect } from "react";
import { Calendar, CheckCircle, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function AgendaKegiatan() {
  const [agendaGroups, setAgendaGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const q = query(
          collection(db, "agenda"),
          orderBy("tanggal", "asc"),
          orderBy("waktu", "asc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setAgendaGroups([]);
        } else {
          const agendaList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          const groupedByDate = agendaList.reduce((acc, item) => {
            const dateKey = item.tanggal;
            if (!acc[dateKey]) {
              acc[dateKey] = {
                date: new Date(item.tanggal).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric", 
                  month: "long",
                  day: "numeric"
                }),
                activities: [],
              };
            }
            acc[dateKey].activities.push({
              id: item.id,
              time: item.waktu,
              title: item.judul,
              description: item.deskripsi,
              location: item.tempat,
              category: item.kategori,
              organizer: item.penyelenggara,
              participants: item.peserta,
              priority: item.prioritas,
              completed: item.status === "completed"
            });
            return acc;
          }, {});

          setAgendaGroups(Object.values(groupedByDate).slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching agenda:", error);
        setAgendaGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgenda();
  }, []);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Agenda Kegiatan
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Jadwal kegiatan harian masyarakat Dusun Grenggeng
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : agendaGroups.length > 0 ? (
          <div className="space-y-6">
            {agendaGroups.map((group, groupIndex) => (
              <div key={`agenda-group-${groupIndex}`} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                  <h3 className="text-lg font-semibold text-green-800 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {group.date}
                  </h3>
                </div>
                <div className="p-6">
                  {group.activities.map((activity, activityIndex) => (
                    <div key={`activity-${activity.id || activityIndex}`} className="flex items-start space-x-4 p-4 rounded-lg">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.completed ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {activity.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {activity.title}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {activity.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {activity.location}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">Kategori:</span> {activity.category}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">Penyelenggara:</span> {activity.organizer}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">Peserta:</span> {activity.participants}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">Prioritas:</span> {activity.priority}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada agenda kegiatan untuk saat ini</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/kalender"
            className="inline-flex items-center rounded-lg bg-green-700 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-green-800"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Lihat Kalender Lengkap
          </Link>
        </div>
      </div>
    </section>
  );
}
