"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { useDialog } from "@/hooks/useDialog";
import Image from "next/image";
import {
  getProduk,
  deleteProdukWithImage,
  searchProduk,
} from "./actions";
import ProdukForm from "./components/ProdukForm";
import Dialog from "@/components/admin/Dialog";
import { toast } from "react-hot-toast";

// Helper function to format contact information
const formatKontak = (kontak) => {
  if (typeof kontak === 'object' && kontak !== null) {
    if (kontak.telepon) {
      return `${kontak.nama || ''} - ${kontak.telepon}`;
    }
    return `${kontak.nama || ''} ${kontak.telepon || ''} ${kontak.alamat || ''}`.trim();
  }
  return kontak || '';
};

export default function AdminProdukPage() {
  const { user } = useAuth();
  const { dialog, closeDialog, confirm } = useDialog();
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduk, setEditingProduk] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"

  const categories = ["Makanan", "Minuman", "Kerajinan", "Pertanian", "Lainnya"];

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    try {
      setLoading(true);
      const data = await getProduk();
      setProduk(data);
    } catch (error) {
      console.error("Error fetching produk:", error);
      toast.error("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchProduk(searchTerm, selectedCategory);
      setProduk(data);
    } catch (error) {
      console.error("Error searching produk:", error);
      toast.error("Gagal mencari produk");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (produkItem) => {
    setEditingProduk(produkItem);
    setShowForm(true);
  };

  const handleDelete = (produkItem) => {
    confirm(
      `Apakah Anda yakin ingin menghapus produk "${produkItem.nama}"?`,
      () => confirmDelete(produkItem.id),
      {
        title: "Hapus Produk",
        type: "error",
        confirmText: "Hapus"
      }
    );
  };

  const confirmDelete = async (id) => {
    try {
      console.log("Attempting to delete produk with ID:", id);
      const produkItem = produk.find(item => item.id === id);
      console.log("Found produk item:", produkItem);
      
      if (!produkItem) {
        toast.error("Produk tidak ditemukan");
        return;
      }
      
      await deleteProdukWithImage(id, produkItem.nama, user.email);
      console.log("Delete successful");
      toast.success("Produk berhasil dihapus");
      fetchProduk();
    } catch (error) {
      console.error("Error deleting produk:", error);
      toast.error(`Gagal menghapus produk: ${error.message}`);
    } finally {
      closeDialog();
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduk(null);
    fetchProduk();
    toast.success(editingProduk ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Produk</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex items-center space-x-3">
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            + Tambah Produk
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Cari
            </button>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                fetchProduk();
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Produk Content */}
      {viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {produk.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              {/* Product Image */}
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                {item.gambar ? (
                  <Image
                    src={item.gambar}
                    alt={item.nama}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <div className="text-center">
                      <div className="text-3xl mb-2">📦</div>
                      <div className="text-xs font-medium">No Image</div>
                    </div>
                  </div>
                )}
                
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-white/90 hover:bg-white/100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="bg-white/90 hover:bg-white/100 text-red-600 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2"></div>
                
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                  {item.nama}
                </h3>
                
                <div className="text-lg font-bold text-gray-900 mb-2">
                  {formatPrice(item.harga)}
                </div>
                
                {item.deskripsi && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {item.deskripsi}
                  </p>
                )}
                
                <div className="text-xs text-gray-400 pt-2">
                  <div className="font-medium">{item.penjual}</div>
                  <div>{formatKontak(item.kontak)}</div>
                </div>
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
                    Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penjual
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
                {produk.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.gambar && (
                          <div className="h-12 w-12 flex-shrink-0 mr-4">
                            <Image
                              src={item.gambar}
                              alt={item.nama}
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
                            {item.nama}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {item.deskripsi}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(item.harga)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.penjual}</div>
                      <div className="text-sm text-gray-500">{formatKontak(item.kontak)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
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
      {produk.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
          <p className="text-gray-500">Mulai dengan menambahkan produk pertama Anda</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ProdukForm
          produk={editingProduk}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingProduk(null);
          }}
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
