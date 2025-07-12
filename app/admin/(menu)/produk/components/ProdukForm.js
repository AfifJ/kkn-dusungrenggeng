"use client";import { useState, useEffect } from "react";import Image from "next/image";
import { X } from "lucide-react";import { useAuth } from "@/context/auth";import {  addProdukWithImage,  updateProdukWithImage,} from "../actions";export default function ProdukForm({ produk, onSuccess, onCancel }) {  const { user } = useAuth();  const [loading, setLoading] = useState(false);  const [imageFile, setImageFile] = useState(null);  const [imagePreview, setImagePreview] = useState("");  const [formData, setFormData] = useState({    nama: "",    deskripsi: "",    harga: "",    kategori: "",    stok: "",    penjual: "",    kontak: "",    status: "tersedia",  });  const categories = ["Makanan", "Minuman", "Kerajinan", "Pertanian", "Lainnya"];  useEffect(() => {    if (produk) {      setFormData({        nama: produk.nama || "",        deskripsi: produk.deskripsi || "",        harga: produk.harga || "",        kategori: produk.kategori || "",        stok: produk.stok || "",        penjual: produk.penjual || "",        kontak: produk.kontak || "",        status: produk.status || "tersedia",      });      setImagePreview(produk.gambar || "");    }  }, [produk]);  const handleInputChange = (e) => {    const { name, value } = e.target;    setFormData(prev => ({      ...prev,      [name]: value    }));  };  const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {    return new Promise((resolve) => {      const canvas = document.createElement('canvas');      const ctx = canvas.getContext('2d');      const img = new Image();      
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
        alert('Ukuran file terlalu besar. Maksimal 50MB.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar.');
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
    
    if (!formData.nama || !formData.deskripsi || !formData.kategori || !formData.harga || !formData.stok || !formData.penjual || !formData.kontak) {
      alert('Harap isi semua field yang wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      
      const processedData = {
        ...formData,
        harga: parseInt(formData.harga),
        stok: parseInt(formData.stok),
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
      alert('Gagal menyimpan produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  Stok <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stok"
                  value={formData.stok}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Penjual <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="penjual"
                value={formData.penjual}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kontak <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="kontak"
                value={formData.kontak}
                onChange={handleInputChange}
                placeholder="Nomor telepon/WhatsApp"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tersedia">Tersedia</option>
                <option value="habis">Habis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gambar Produk
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: JPG, PNG, GIF. Maksimal: 50MB
              </p>
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 w-auto object-cover rounded-lg border border-gray-200"
                  />
                </div>
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
    </div>
  );
}
