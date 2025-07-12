"use client";

import { AlertTriangle } from "lucide-react";

export default function DeleteModal({ produk, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
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
            <p className="text-sm text-gray-700 mb-2">
              Apakah Anda yakin ingin menghapus produk berikut?
            </p>
            <div className="flex items-center space-x-3">
              {produk?.gambar && (
                <img
                  src={produk.gambar}
                  alt={produk.nama}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{produk?.nama}</p>
                <p className="text-sm text-gray-500">{produk?.kategori}</p>
                <p className="text-sm text-gray-500">
                  Penjual: {produk?.penjual}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
//       </div>
//     </div>
//   );
// }
