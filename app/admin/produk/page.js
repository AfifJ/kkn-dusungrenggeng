"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";

export default function AdminProduk() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    try {
      const response = await fetch("/api/admin?section=produk");
      const data = await response.json();
      setProduk(data);
    } catch (error) {
      console.error("Error fetching produk:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      try {
        await fetch(`/api/admin?section=produk&id=${id}`, { method: "DELETE" });
        fetchProduk();
      } catch (error) {
        console.error("Error deleting produk:", error);
      }
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Kelola Produk</h1>
            <p className="text-gray-600">Manage semua produk unggulan dusun</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Produk
          </button>
        </div>

        {/* Produk Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produk.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="h-48 bg-gray-200">
                {item.gambar ? (
                  <Image
                    src={item.gambar}
                    alt={item.nama}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Gambar Produk
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.nama}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.deskripsi}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-green-600">
                    {item.harga}
                  </span>
                </div>
                <div className="flex justify-end space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
