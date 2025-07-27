"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useAuth } from "@/context/auth";
import Dialog from "@/components/admin/Dialog";
import { useDialog } from "@/hooks/useDialog";
import {
  addProdukWithImage,
  updateProdukWithImage,
} from "../actions";

export default function ProdukForm({ produk, onSuccess, onCancel }) {
  const { user } = useAuth();
  const { dialog, closeDialog, alert } = useDialog();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageDeleteUrl, setImageDeleteUrl] = useState("");
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
    kontak: "",
    namaKontak: "",
  });

  useEffect(() => {
    if (produk) {
      setFormData({
        nama: produk.nama || "",
        deskripsi: produk.deskripsi || "",
        harga: produk.harga || "",
        kontak: produk.kontak || "",
        namaKontak: produk.namaKontak || "",
      });
      setImagePreview(produk.gambar || "");
      setImageDeleteUrl(produk.gambarDeleteUrl || "");
    }
  }, [produk]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 50MB.', 'error');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar.', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        compressImage(file).then(compressedFile => {
          setImageFile(compressedFile);
          setImagePreview(URL.createObjectURL(compressedFile));
        });
      } else {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.deskripsi || !formData.harga || !formData.kontak || !formData.namaKontak) {
      alert('Harap isi semua field yang wajib diisi.', 'warning');
      return;
    }

    try {
      setLoading(true);
      
      const processedData = {
        ...formData,
        harga: parseInt(formData.harga),
      };

      if (produk) {
        await updateProdukWithImage(
          produk.id,
          processedData,
          imageFile,
          user.email
        );
      } else {
        await addProdukWithImage(
          processedData,
          imageFile,
          user.email
        );
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving produk:', error);
      alert('Gagal menyimpan produk. Silakan coba lagi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {produk ? "Edit Produk" : "Tambah Produk"}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Kontak <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="namaKontak"
                value={formData.namaKontak}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kontak (WhatsApp/Telepon) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="kontak"
                value={formData.kontak}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Gambar Produk</span>
              </div>

              {imagePreview ? (
                <div className="relative group">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover rounded-xl border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-opacity rounded-xl flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                      <label className="cursor-pointer bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Ganti Gambar
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={async () => {
                          if (imageDeleteUrl) {
                            try {
                              await deleteImageFromImghippo(imageDeleteUrl);
                            } catch (error) {
                              console.error("Error deleting image:", error);
                            }
                          }
                          setImagePreview("");
                          setImageFile(null);
                          setImageDeleteUrl("");
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tambahkan Gambar Produk
                    </h3>
                    <p className="text-sm text-gray-600">
                      Klik untuk upload atau drag & drop gambar
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, GIF hingga 50MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : (produk ? "Perbarui" : "Simpan")}
              </button>
            </div>
          </form>
        </div>
      </div>
      
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
