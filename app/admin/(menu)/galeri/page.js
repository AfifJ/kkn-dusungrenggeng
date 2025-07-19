"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import Image from "next/image";
import {
  getGaleri,
  deleteGaleriWithImage,
  searchGaleri,
} from "./actions";
import GaleriForm from "./components/GaleriForm";
import DeleteModal from "./components/DeleteModal";
import Dialog from "@/components/admin/Dialog";
import { toast } from "react-hot-toast";
import { useDialog } from "@/hooks/useDialog";

export default function GaleriAdminPage() {
  const { user } = useAuth();
  const { dialog, closeDialog, confirm } = useDialog();
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGaleri, setEditingGaleri] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, galeri: null });
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"

  const categories = ["Kegiatan", "Pertanian", "Acara", "Infrastruktur", "Sosial"];

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    try {
      setLoading(true);
      const data = await getGaleri();
      setGaleri(data);
    } catch (error) {
      console.error("Error fetching galeri:", error);
      toast.error("Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchGaleri(searchTerm, selectedCategory);
      setGaleri(data);
    } catch (error) {
      console.error("Error searching galeri:", error);
      toast.error("Gagal mencari galeri");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (galeriItem) => {
    setEditingGaleri(galeriItem);
    setShowForm(true);
  };

  const handleDelete = (id, title) => {
    confirm(
      `Apakah Anda yakin ingin menghapus gambar "${title}"?`,
      () => confirmDelete(id),
      {
        title: "Hapus Gambar",
        type: "error",
        confirmText: "Hapus"
      }
    );
  };

  const confirmDelete = async (id) => {
    try {
      setLoading(true);
      const galeriItem = galeri.find(item => item.id === id);
      await deleteGaleriWithImage(id, galeriItem?.judul || "Galeri", user.email);
      toast.success("Foto galeri berhasil dihapus");
      setDeleteModal({ show: false, galeri: null });
      fetchGaleri();
    } catch (error) {
      console.error("Error deleting galeri:", error);
      toast.error("Gagal menghapus foto galeri");
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingGaleri(null);
    fetchGaleri();
    toast.success(editingGaleri ? "Foto galeri berhasil diperbarui" : "Foto galeri berhasil ditambahkan");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Galeri</h1>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Table
            </button>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambah Foto
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari foto galeri..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cari
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
              fetchGaleri();
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Galeri Content */}
      {viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {galeri.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              {/* Gallery Image */}
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                {item.gambar ? (
                  <Image
                    src={item.gambar}
                    alt={item.judul}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🖼️</div>
                      <div className="text-xs font-medium">No Image</div>
                    </div>
                  </div>
                )}
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteModal({ show: true, galeri: item })}
                      className="bg-white/90 hover:bg-white text-red-600 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Gallery Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                    {item.kategori}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                  {item.judul}
                </h3>
                
                {item.deskripsi && (
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.deskripsi}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fotografer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {galeri.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.gambar && (
                          <div className="h-12 w-12 flex-shrink-0 mr-4">
                            <Image
                              src={item.gambar}
                              alt={item.judul}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.judul}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {item.deskripsi}
                          </div>
                          {item.imageSize && (
                            <div className="text-xs text-gray-400">
                              {item.imageExtension} • {(item.imageSize / 1024).toFixed(1)} KB
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status === "published" ? "Terbit" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.fotografer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(item.tanggal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, galeri: item })}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {galeri.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🖼️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada foto galeri ditemukan</h3>
          <p className="text-gray-500">Mulai dengan menambahkan foto galeri pertama Anda</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <GaleriForm
          galeri={editingGaleri}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingGaleri(null);
          }}
        />
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <DeleteModal
          galeri={deleteModal.galeri}
          onConfirm={() => handleDelete(deleteModal.galeri)}
          onCancel={() => setDeleteModal({ show: false, galeri: null })}
        />
      )}

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
