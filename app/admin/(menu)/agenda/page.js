"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Circle,
} from "lucide-react";
import { agendaData } from "@/data/agenda";

export default function AdminAgenda() {
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchAgenda();
  }, []);

  const fetchAgenda = async () => {
    try {
      const response = await fetch("/api/admin?section=kalender");
      const data = await response.json();
      // Check if data is valid and not empty
      if (Array.isArray(data) && data.length > 0) {
        setAgenda(data);
      } else {
        // Use fallback data if API returns empty or invalid data
        const groupedByDate = agendaData.reduce((acc, item) => {
          const dateKey = item.tanggal;
          if (!acc[dateKey]) {
            acc[dateKey] = {
              date: item.tanggal,
              dayName: new Date(item.tanggal).toLocaleDateString("id-ID", {
                weekday: "long",
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
            completed: item.status === "completed",
            category: item.kategori,
          });
          return acc;
        }, {});

        // Convert to array and sort by date
        const transformedData = Object.values(groupedByDate).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setAgenda(transformedData);
      }
    } catch (error) {
      console.error("Error fetching agenda:", error);
      // Transform agendaData to match expected format on error
      const groupedByDate = agendaData.reduce((acc, item) => {
        const dateKey = item.tanggal;
        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: item.tanggal,
            dayName: new Date(item.tanggal).toLocaleDateString("id-ID", {
              weekday: "long",
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
          completed: item.status === "completed",
          category: item.kategori,
        });
        return acc;
      }, {});

      // Convert to array and sort by date
      const transformedData = Object.values(groupedByDate).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setAgenda(transformedData);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dayDate, activityId) => {
    if (confirm("Yakin ingin menghapus agenda ini?")) {
      try {
        // Ensure agenda is an array before mapping
        if (!Array.isArray(agenda)) return;

        // Update the agenda by removing the specific activity
        const updatedAgenda = agenda
          .map((day) => {
            if (day.date === dayDate) {
              return {
                ...day,
                activities: day.activities.filter(
                  (activity) => activity.id !== activityId
                ),
              };
            }
            return day;
          })
          .filter((day) => day.activities.length > 0); // Remove days with no activities

        setAgenda(updatedAgenda);

        // In a real app, you would also update the backend
        // await fetch(`/api/admin?section=kalender&id=${activityId}`, { method: 'DELETE' });
      } catch (error) {
        console.error("Error deleting agenda:", error);
      }
    }
  };

  const toggleComplete = async (dayDate, activityId) => {
    try {
      // Ensure agenda is an array before mapping
      if (!Array.isArray(agenda)) return;

      const updatedAgenda = agenda.map((day) => {
        if (day.date === dayDate) {
          return {
            ...day,
            activities: day.activities.map((activity) => {
              if (activity.id === activityId) {
                return { ...activity, completed: !activity.completed };
              }
              return activity;
            }),
          };
        }
        return day;
      });

      setAgenda(updatedAgenda);

      // In a real app, you would also update the backend
      // await fetch('/api/admin', {
      //   method: 'POST',
      //   body: JSON.stringify({ section: 'kalender', data: updatedAgenda })
      // });
    } catch (error) {
      console.error("Error updating agenda:", error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Produksi: "bg-blue-100 text-blue-800",
      Distribusi: "bg-green-100 text-green-800",
      Pertanian: "bg-yellow-100 text-yellow-800",
      Lingkungan: "bg-emerald-100 text-emerald-800",
      Kesehatan: "bg-pink-100 text-pink-800",
      Keterampilan: "bg-purple-100 text-purple-800",
      Administrasi: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Agenda</h1>
          <p className="text-gray-600">Manage jadwal kegiatan dusun</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Agenda
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {Array.isArray(agenda)
              ? agenda.reduce(
                  (acc, day) => acc + (day.activities?.length || 0),
                  0
                )
              : 0}
          </div>
          <div className="text-sm text-gray-600">Total Kegiatan</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {Array.isArray(agenda)
              ? agenda.reduce(
                  (acc, day) =>
                    acc +
                    (day.activities?.filter((a) => a.completed) || []).length,
                  0
                )
              : 0}
          </div>
          <div className="text-sm text-gray-600">Selesai</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {Array.isArray(agenda)
              ? agenda.reduce(
                  (acc, day) =>
                    acc +
                    (day.activities?.filter((a) => !a.completed) || []).length,
                  0
                )
              : 0}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {Array.isArray(agenda) ? agenda.length : 0}
          </div>
          <div className="text-sm text-gray-600">Hari Aktif</div>
        </div>
      </div>

      {/* Agenda List */}
      <div className="space-y-6">
        {Array.isArray(agenda) &&
          agenda.map((dayData) => (
            <div
              key={dayData.date}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              {/* Date Header */}
              <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {dayData.dayName},{" "}
                      {new Date(dayData.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {dayData.activities?.length || 0} kegiatan
                    </p>
                  </div>
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
              </div>

              {/* Activities */}
              <div className="p-6">
                {dayData.activities?.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg mb-4 last:mb-0 hover:border-green-200 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <button
                        onClick={() =>
                          toggleComplete(dayData.date, activity.id)
                        }
                        className="focus:outline-none"
                      >
                        {activity.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 hover:text-green-600" />
                        )}
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={`text-lg font-semibold ${
                                activity.completed
                                  ? "text-gray-500 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {activity.title}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                activity.category
                              )}`}
                            >
                              {activity.category}
                            </span>
                          </div>
                          <p
                            className={`text-sm mb-3 ${
                              activity.completed
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {activity.description}
                          </p>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingItem({
                                ...activity,
                                dayDate: dayData.date,
                              });
                              setShowForm(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(dayData.date, activity.id)
                            }
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{activity.time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{activity.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {(!Array.isArray(agenda) || agenda.length === 0) && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada agenda
            </h3>
            <p className="text-gray-600 mb-4">
              Mulai dengan menambahkan kegiatan pertama
            </p>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Agenda
            </button>
          </div>
        )}
      </div>

      {/* Form Modal (placeholder - would be a separate component in real app) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? "Edit Agenda" : "Tambah Agenda Baru"}
            </h3>
            <p className="text-gray-600 mb-4">
              Form untuk menambah/edit agenda akan diimplementasikan di sini
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
//   );
// }
