"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Plus, Edit, Trash2, Eye, X } from "lucide-react";

// Dummy data
const dummyBerita = [
  {
    id: 1,
    judul: "Pembangunan Jalan Desa Dimulai",
    deskripsi:
      "Proyek pembangunan jalan utama desa telah dimulai dengan anggaran dari pemerintah daerah",
    kategori: "Pembangunan",
    tanggal: "2024-01-15",
    penulis: "Admin Desa",
    gambar: "/images/jalan.jpg",
  },
  {
    id: 2,
    judul: "Festival Budaya Tahunan",
    deskripsi:
      "Festival budaya tahunan akan diselenggarakan bulan depan dengan berbagai pertunjukan tradisional",
    kategori: "Budaya",
    tanggal: "2024-01-10",
    penulis: "Panitia Festival",
    gambar: "/images/festival.jpg",
  },
  {
    id: 3,
    judul: "Posyandu Balita Bulan Ini",
    deskripsi:
      "Kegiatan posyandu balita akan dilaksanakan setiap minggu pertama bulan ini",
    kategori: "Kesehatan",
    tanggal: "2024-01-08",
    penulis: "Bidan Desa",
    gambar: "/images/posyandu.jpg",
  },
];

export default function AdminBerita() {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    kategori: "Umum",
    penulis: "",
    gambar: "",
  });

  useEffect(() => {
    fetchBerita();
  }, []);

  const fetchBerita = async () => {
    try {
      // Simulate API delay
      // setTimeout(() => {
      setBerita(dummyBerita);
      setLoading(false);
      // }, 1000);
    } catch (error) {
      console.error("Error fetching berita:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus berita ini?")) {
      try {
        setBerita(berita.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting berita:", error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingItem) {
      // Update existing item
      setBerita(
        berita.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...formData,
                tanggal: new Date().toISOString().split("T")[0],
              }
            : item
        )
      );
    } else {
      // Add new item
      const newItem = {
        id: Math.max(...berita.map((b) => b.id)) + 1,
        ...formData,
        tanggal: new Date().toISOString().split("T")[0],
      };
      setBerita([newItem, ...berita]);
    }

    // Reset form
    setFormData({
      judul: "",
      deskripsi: "",
      kategori: "Umum",
      penulis: "",
      gambar: "",
    });
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi,
      kategori: item.kategori,
      penulis: item.penulis,
      gambar: item.gambar || "",
    });
    setShowForm(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Berita</h1>
            <p className="text-gray-600">Manage semua artikel berita dusun</p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({
                judul: "",
                deskripsi: "",
                kategori: "Umum",
                penulis: "",
                gambar: "",
              });
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Berita
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingItem ? "Edit Berita" : "Tambah Berita"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul
                  </label>
                  <input
                    type="text"
                    value={formData.judul}
                    onChange={(e) =>
                      setFormData({ ...formData, judul: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) =>
                      setFormData({ ...formData, deskripsi: e.target.value })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) =>
                      setFormData({ ...formData, kategori: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Umum">Umum</option>
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Budaya">Budaya</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Ekonomi">Ekonomi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Penulis
                  </label>
                  <input
                    type="text"
                    value={formData.penulis}
                    onChange={(e) =>
                      setFormData({ ...formData, penulis: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Gambar
                  </label>
                  <input
                    type="url"
                    value={formData.gambar}
                    onChange={(e) =>
                      setFormData({ ...formData, gambar: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {editingItem ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Berita List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {berita.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Belum ada berita tersedia</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Judul
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penulis
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {berita.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.judul}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {item.deskripsi}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.tanggal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.penulis}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
