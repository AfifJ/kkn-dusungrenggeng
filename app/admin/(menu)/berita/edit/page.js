"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBeritaById } from "../actions";
import BeritaForm from "../components/BeritaForm";
import { toast } from "react-hot-toast";

export default function EditBeritaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const beritaId = searchParams.get('id');
        
        if (!beritaId) {
          setError("ID berita tidak ditemukan");
          toast.error("ID berita tidak ditemukan");
          router.push("/admin/berita");
          return;
        }

        setLoading(true);
        const beritaItem = await getBeritaById(beritaId);
        
        if (!beritaItem) {
          setError("Berita tidak ditemukan");
          toast.error("Berita tidak ditemukan");
          router.push("/admin/berita");
          return;
        }
        
        setBerita(beritaItem);
        setError(null);
      } catch (error) {
        console.error("Error fetching berita:", error);
        setError("Gagal memuat data berita");
        toast.error("Gagal memuat data berita");
        router.push("/admin/berita");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [searchParams, router]);

  const handleSuccess = () => {
    toast.success("Berita berhasil diperbarui");
    router.push("/admin/berita");
  };

  const handleCancel = () => {
    router.push("/admin/berita");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data berita...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-600 text-lg font-medium mb-2">Error</div>
              <div className="text-gray-600">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Berita</h1>
              <p className="text-gray-600 mt-1">Perbarui informasi berita yang sudah ada</p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <span className="text-sm text-gray-500">Status: </span>
              <span className={`text-sm font-medium ${
                berita?.status === 'published' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {berita?.status === 'published' ? 'Terbit' : 'Draft'}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        {berita && (
          <BeritaForm
            berita={berita}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            isModal={false}
          />
        )}
      </div>
    </div>
  );
}
