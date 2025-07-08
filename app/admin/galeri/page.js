"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export default function AdminGaleri() {
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    try {
      const response = await fetch('/api/admin?section=galeri');
      const data = await response.json();
      setGaleri(data);
    } catch (error) {
      console.error('Error fetching galeri:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus foto ini?')) {
      try {
        await fetch(`/api/admin?section=galeri&id=${id}`, { method: 'DELETE' });
        fetchGaleri();
      } catch (error) {
        console.error('Error deleting galeri:', error);
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
            <h1 className="text-2xl font-bold text-gray-900">Kelola Galeri</h1>
            <p className="text-gray-600">Manage koleksi foto dusun</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Upload Foto
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {galeri.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
              <div className="h-48 bg-gray-200 relative">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Foto Galeri
                  </div>
                )}
                {/* Action overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-white rounded-full text-indigo-600 hover:bg-indigo-50">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mb-2">
                  {item.category}
                </span>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{item.deskripsi || `Dokumentasi ${item.category}`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
