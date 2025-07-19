"use client";

import { AlertTriangle, X } from "lucide-react";
import Image from "next/image";

export default function DeleteModal({ galeri, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Hapus Foto Galeri</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Konfirmasi Penghapusan
              </h3>
              <p className="text-sm text-gray-500">
                Tindakan ini tidak dapat dibatalkan
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">
              Apakah Anda yakin ingin menghapus foto galeri berikut?
            </p>
            <div className="mt-2 flex items-center space-x-3">
              {galeri?.gambar && (
                <div className="w-12 h-12 relative">
                  <Image
                    src={galeri.gambar}
                    alt={galeri.judul}
                    fill
                    className="object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{galeri?.judul}</p>
                <p className="text-sm text-gray-500">{galeri?.kategori}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
