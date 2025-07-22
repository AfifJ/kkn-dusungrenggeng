"use client";

import { useRouter } from "next/navigation";
import BeritaForm from "../components/BeritaForm";
import { toast } from "react-hot-toast";

export default function TambahBeritaPage() {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success("Berita berhasil ditambahkan");
    router.push("/admin/berita");
  };

  const handleCancel = () => {
    router.push("/admin/berita");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 text-gray-600 hover:cursor-pointer hover:text-gray-900 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Buat Berita Baru</h1>
              <p className="text-gray-600 mt-1">Bagikan informasi terbaru kepada masyarakat</p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <span className="text-sm text-gray-500">Status: </span>
              <span className="text-sm font-medium text-yellow-600">Draft</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <BeritaForm
          berita={null}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isModal={false}
        />
      </div>
    </div>
  );
}
