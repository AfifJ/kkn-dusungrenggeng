"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getBeritaById } from "../actions";
import BeritaForm from "../components/BeritaForm";
import { toast } from "react-hot-toast";

export default function EditBeritaPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        // Try to get ID from params first, then fallback to query params
        let beritaId = params.id;
        if (!beritaId) {
          beritaId = searchParams.get('id');
        }
        
        if (!beritaId) {
          setError("ID berita tidak ditemukan");
          toast.error("ID berita tidak ditemukan");
          router.push("/admin/berita");
          return;
        }

        setLoading(true);
        const beritaItem = await getBeritaById(beritaId);
        
        if (!beritaItem) {
          setError(`Berita dengan ID "${beritaId}" tidak ditemukan`);
          toast.error("Berita tidak ditemukan");
          router.push("/admin/berita");
          return;
        }
        
        setBerita(beritaItem);
        setError(null);
      } catch (error) {
        console.error("Error fetching berita:", error);
        setError("Gagal memuat data berita: " + error.message);
        toast.error("Gagal memuat data berita");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [params.id, searchParams, router]);

  const handleSuccess = () => {
    toast.success("Berita berhasil diperbarui");
    router.push("/admin/berita");
  };

  const handleCancel = () => {
    router.push("/admin/berita");
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Error</div>
            <div className="text-gray-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-600 hover:cursor-pointer hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Berita</h1>
            <p className="text-gray-600 mt-1">Perbarui informasi berita</p>
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
  );
}
