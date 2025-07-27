"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getDataUsaha,
  deleteDataUsaha,
  searchDataUsaha,
  deleteAllDataUsaha,
  bulkUploadDataUsaha,
} from "./actions";
import DeleteModal from "./components/DeleteModal";
import Dialog from "@/components/admin/Dialog";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/auth";
import { useDialog } from "@/hooks/useDialog";

export default function AdminDataUsahaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { dialog, closeDialog, confirm } = useDialog();
  const [dataUsaha, setDataUsaha] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });
  const [jsonInput, setJsonInput] = useState("");

  useEffect(() => {
    fetchDataUsaha();
  }, []);

  const fetchDataUsaha = async () => {
    try {
      setLoading(true);
      const data = await getDataUsaha();
      setDataUsaha(data);
    } catch (error) {
      console.error("Error fetching business data:", error);
      toast.error("Gagal memuat data usaha");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchDataUsaha(searchTerm);
      setDataUsaha(data);
    } catch (error) {
      console.error("Error searching business data:", error);
      toast.error("Gagal mencari data usaha");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    router.push(`/admin/data-usaha/${item.id}`);
  };

  const handleDelete = (id, nama) => {
    confirm(
      `Apakah Anda yakin ingin menghapus data usaha "${nama || "tanpa nama"}"?`,
      () => confirmDelete(id),
      {
        title: "Hapus Data Usaha",
        type: "error",
        confirmText: "Hapus",
      }
    );
  };

  const confirmDelete = async (id) => {
    try {
      setLoading(true);
      const item = dataUsaha.find((item) => item.id === id);
      await deleteDataUsaha(id, item?.nama || "Data Usaha", user.email);
      toast.success("Data usaha berhasil dihapus");
      setDeleteModal({ show: false, item: null });
      fetchDataUsaha();
    } catch (error) {
      console.error("Error deleting business data:", error);
      toast.error("Gagal menghapus data usaha");
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  const handleDeleteAll = () => {
    confirm(
      "Apakah Anda yakin ingin menghapus SEMUA data usaha?",
      async () => {
        try {
          setLoading(true);
          await deleteAllDataUsaha(user.email);
          toast.success("Semua data usaha berhasil dihapus");
          fetchDataUsaha();
        } catch (error) {
          console.error("Error deleting all business data:", error);
          toast.error("Gagal menghapus semua data usaha");
        } finally {
          setLoading(false);
        }
      },
      {
        title: "Hapus Semua Data",
        type: "error",
        confirmText: "Hapus Semua",
      }
    );
  };

  const handleJsonUpload = async () => {
    if (!jsonInput.trim()) return;

    try {
      setLoading(true);
      let jsonData;

      try {
        jsonData = JSON.parse(jsonInput);
      } catch (error) {
        throw new Error("Format JSON tidak valid");
      }

      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
      await bulkUploadDataUsaha(dataArray, user.email);
      toast.success(`${dataArray.length} data usaha berhasil diupload`);
      fetchDataUsaha();
      setJsonInput("");
    } catch (error) {
      console.error("Error uploading JSON:", error);
      toast.error(error.message || "Gagal mengupload data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
        <h1 className="text-2xl font-bold text-gray-800">Kelola Data Usaha</h1>
        <button
          onClick={() => router.push("/admin/data-usaha/tambah")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Tambah Data
        </button>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari data usaha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Cari
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              fetchDataUsaha();
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={handleDeleteAll}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            Hapus Semua
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Usaha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pemilik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telepon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataUsaha.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.nama || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.jenis}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {item.pemilik || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {item.telepon || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {item.alamat || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.nama)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {dataUsaha.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak ada data usaha ditemukan
          </h3>
          <p className="text-gray-500">
            Mulai dengan menambahkan data usaha pertama Anda
          </p>
        </div>
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
