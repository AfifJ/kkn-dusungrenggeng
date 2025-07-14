"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Circle,
  Search,
  Filter,
} from "lucide-react";
import { useAuth } from "@/context/auth";
import { 
  getAgenda, 
  addAgenda, 
  updateAgenda, 
  deleteAgenda, 
  updateAgendaStatus,
  searchAgenda
} from "./actions";
import AgendaForm from "./components/AgendaForm";
import DeleteModal from "./components/DeleteModal";
import Dialog from "@/components/admin/Dialog";
import { useDialog } from "@/hooks/useDialog";
import { agendaData } from "@/data/agenda";
import { toast } from "react-hot-toast";

export default function AdminAgenda() {
  const { user } = useAuth();
  const { dialog, closeDialog, confirm, alert } = useDialog();
  
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchAgenda = useCallback(async () => {
    try {
      setLoading(true);
      let agendaList;
      
      if (searchTerm || selectedCategory) {
        agendaList = await searchAgenda(searchTerm, selectedCategory);
      } else {
        agendaList = await getAgenda();
      }
      
      if (agendaList.length === 0) {
        setAgenda([]);
        setLoading(false);
        return;
      }
      
      // Group by date
      const groupedByDate = agendaList.reduce((acc, item) => {
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
          penyelenggara: item.penyelenggara,
          peserta: item.peserta,
          prioritas: item.prioritas,
          agenda: item.agenda,
          status: item.status,
          originalData: item
        });
        return acc;
      }, {});

      // Convert to array and sort by date
      const transformedData = Object.values(groupedByDate).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setAgenda(transformedData);
    } catch (error) {
      console.error("Error fetching agenda:", error);
      toast.error("Gagal memuat data agenda");
      // Use fallback data on error
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

      const transformedData = Object.values(groupedByDate).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setAgenda(transformedData);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchAgenda();
  }, [fetchAgenda]);

  const handleDelete = async (dayDate, activityId) => {
    const activity = agenda
      .find(day => day.date === dayDate)
      ?.activities?.find(act => act.id === activityId);
    
    if (activity) {
      confirm(
        `Apakah Anda yakin ingin menghapus agenda "${activity.title}"?`,
        () => confirmDelete(activity),
        {
          title: "Hapus Agenda",
          type: "error",
          confirmText: "Hapus"
        }
      );
    }
  };

  const confirmDelete = async (activity) => {
    if (!user?.email) {
      toast.error("User tidak terautentikasi");
      return;
    }
    
    try {
      setFormLoading(true);
      await deleteAgenda(activity.id, activity.title, user.email);
      await fetchAgenda();
      toast.success("Agenda berhasil dihapus");
    } catch (error) {
      console.error("Error deleting agenda:", error);
      toast.error("Gagal menghapus agenda");
    } finally {
      setFormLoading(false);
    }
  };

  const toggleComplete = async (dayDate, activityId) => {
    if (!user?.email) {
      toast.error("User tidak terautentikasi");
      return;
    }
    
    try {
      const activity = agenda
        .find(day => day.date === dayDate)
        ?.activities?.find(act => act.id === activityId);
        
      if (!activity) return;
      
      const newStatus = activity.completed ? "scheduled" : "completed";
      await updateAgendaStatus(activity.id, newStatus, user.email);
      await fetchAgenda();
      
      const statusText = newStatus === "completed" ? "diselesaikan" : "dijadwalkan kembali";
      toast.success(`Agenda berhasil ${statusText}`);
    } catch (error) {
      console.error("Error updating agenda status:", error);
      toast.error("Gagal mengubah status agenda");
    }
  };

  const handleFormSubmit = async (formData) => {
    if (!user?.email) {
      toast.error("User tidak terautentikasi");
      return;
    }

    try {
      setFormLoading(true);
      
      if (editingItem) {
        await updateAgenda(editingItem.id, formData, user.email);
        toast.success("Agenda berhasil diperbarui");
      } else {
        await addAgenda(formData, user.email);
        toast.success("Agenda berhasil ditambahkan");
      }
      
      setShowForm(false);
      setEditingItem(null);
      await fetchAgenda();
    } catch (error) {
      console.error("Error saving agenda:", error);
      const errorMessage = editingItem ? "Gagal memperbarui agenda" : "Gagal menambahkan agenda";
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (dayDate, activityId) => {
    const activity = agenda
      .find(day => day.date === dayDate)
      ?.activities?.find(act => act.id === activityId);
    
    if (activity && activity.originalData) {
      setEditingItem(activity.originalData);
      setShowForm(true);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Rapat: "bg-blue-100 text-blue-800",
      Pelatihan: "bg-purple-100 text-purple-800",
      Festival: "bg-pink-100 text-pink-800",
      "Gotong Royong": "bg-green-100 text-green-800",
      Kesehatan: "bg-red-100 text-red-800",
      Pendidikan: "bg-indigo-100 text-indigo-800",
      Sosial: "bg-yellow-100 text-yellow-800",
      Ekonomi: "bg-emerald-100 text-emerald-800",
      Budaya: "bg-orange-100 text-orange-800",
      Olahraga: "bg-cyan-100 text-cyan-800",
      Lingkungan: "bg-lime-100 text-lime-800",
      Keagamaan: "bg-violet-100 text-violet-800",
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
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
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

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari agenda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Semua Kategori</option>
                <option value="Rapat">Rapat</option>
                <option value="Pelatihan">Pelatihan</option>
                <option value="Festival">Festival</option>
                <option value="Gotong Royong">Gotong Royong</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Sosial">Sosial</option>
                <option value="Ekonomi">Ekonomi</option>
                <option value="Budaya">Budaya</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Lingkungan">Lingkungan</option>
                <option value="Keagamaan">Keagamaan</option>
              </select>
            </div>
          </div>
        </div>
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
                            onClick={() => handleEdit(dayData.date, activity.id)}
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

      {/* Form Modal */}
      <AgendaForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
        editingItem={editingItem}
        loading={formLoading}
      />

      {/* Dialog Component */}
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        showCancelButton={dialog.showCancelButton}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
}
