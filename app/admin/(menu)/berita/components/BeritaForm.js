"use client";

import { useState, useEffect } from "react";
// import { useAuth } from "@/hooks/useAuth";
import { addBeritaWithImage, updateBeritaWithImage } from "../actions";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/auth";

export default function BeritaForm({ berita, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    judul: "",
    konten: "",
    kategori: "",
    status: "draft",
    tanggal: new Date().toISOString().split("T")[0],
    gambar: "",
  });

  const categories = ["Pengumuman", "Kegiatan", "Berita Desa", "Artikel"];

  useEffect(() => {
    if (berita) {
      setFormData({
        judul: berita.judul || "",
        konten: berita.konten || "",
        kategori: berita.kategori || "",
        status: berita.status || "draft",
        tanggal: berita.tanggal ? berita.tanggal.split("T")[0] : new Date().toISOString().split("T")[0],
        gambar: berita.gambar || "",
      });
      setImagePreview(berita.gambar || "");
    }
  }, [berita]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update image compression function to use Imghippo utility
  const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
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
      // Check file size (50MB limit for Imghippo)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar. Maksimal 50MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("File harus berupa gambar");
        return;
      }

      // Compress image if it's too large
      if (file.size > 2 * 1024 * 1024) { // If larger than 2MB
        compressImage(file).then(compressedFile => {
          setImageFile(compressedFile);
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target.result);
          };
          reader.readAsDataURL(compressedFile);
        });
      } else {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.judul || !formData.konten || !formData.kategori) {
      toast.error("Harap isi semua field yang wajib");
      return;
    }

    try {
      setLoading(true);
      
      if (berita) {
        // Update existing berita
        await updateBeritaWithImage(berita.id, formData, imageFile, user.email);
        toast.success("Berita berhasil diperbarui");
      } else {
        // Add new berita
        await addBeritaWithImage(formData, imageFile, user.email);
        toast.success("Berita berhasil ditambahkan");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving berita:", error);
      toast.error("Gagal menyimpan berita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {berita ? "Edit Berita" : "Tambah Berita"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Kategori */}
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

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
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
                <option value="draft">Draft</option>
                <option value="published">Terbit</option>
              </select>
            </div>

            {/* Gambar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gambar
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

            {/* Konten */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konten <span className="text-red-500">*</span>
              </label>
              <textarea
                name="konten"
                value={formData.konten}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Buttons */}
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
                {loading ? "Menyimpan..." : (berita ? "Perbarui" : "Simpan")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
