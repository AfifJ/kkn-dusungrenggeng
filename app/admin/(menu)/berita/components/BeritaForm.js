"use client";

import { useState, useEffect } from "react";
import { addBeritaWithImage, updateBeritaWithImage } from "../actions";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/auth";
import RichTextEditor from "./RichTextEditor";
import BlockEditor from "./BlockEditor";
import {
  Upload,
  Type,
  Tag,
  Calendar,
  Eye,
  X,
  Settings,
  FileText,
  ImageIcon,
  Save,
  BookOpen,
  Clock,
  Globe,
  Lock,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

export default function BeritaForm({
  berita,
  onSuccess,
  onCancel,
  isModal = true,
}) {
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
        tanggal: berita.tanggal
          ? berita.tanggal.split("T")[0]
          : new Date().toISOString().split("T")[0],
        gambar: berita.gambar || "",
      });
      setImagePreview(berita.gambar || "");
    }
  }, [berita]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update image compression function to use Imghippo utility
  const compressImage = (
    file,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8
  ) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
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
        canvas.toBlob(resolve, "image/jpeg", quality);
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
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }

      // Compress image if it's too large
      if (file.size > 2 * 1024 * 1024) {
        // If larger than 2MB
        compressImage(file).then((compressedFile) => {
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
    <div
      className={
        isModal
          ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          : ""
      }
    >
      <div
        className={
          isModal
            ? "bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
            : "bg-white rounded-xl shadow-sm border border-gray-200 max-w-7xl mx-auto"
        }
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-xl">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {berita ? "Edit Berita" : "Buat Berita Baru"}
                </h1>
                <p className="text-sm text-gray-500">
                  {berita
                    ? "Perbarui informasi berita"
                    : "Tulis dan publikasikan berita terbaru"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Terakhir disimpan: baru saja</span>
              </div>
              {isModal && (
                <button
                  onClick={onCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col xl:flex-row">
            {/* Main Content Area */}
            <div className="flex-1 p-6 space-y-8">
              {/* Article Title */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium">Judul Berita</span>
                </div>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none focus:ring-0 bg-transparent resize-none"
                  placeholder="Masukkan judul berita yang menarik..."
                  required
                />
                <div className="h-px bg-gray-200"></div>
              </div>

              {/* Feature Image */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Gambar Utama</span>
                </div>

                {imagePreview ? (
                  <div className="relative group">
                    <Image
                      src={imagePreview}
                      alt="Feature image"
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover rounded-xl border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-opacity rounded-xl flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                        <label className="cursor-pointer bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                          <Upload className="w-4 h-4 inline mr-2" />
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
                          onClick={() => {
                            setImagePreview("");
                            setImageFile(null);
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                          <X className="w-4 h-4 inline mr-2" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Tambahkan Gambar Utama
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

              {/* Rich Text Editor */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-sm font-medium">Konten Berita</span>
                </div>
                <RichTextEditor
                  value={formData.konten}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, konten: value }))
                  }
                  placeholder="Mulai menulis konten berita Anda..."
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full xl:w-80 bg-gray-50 p-6 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Pengaturan</h3>
                </div>

                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Publikasi
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label
                        className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.status === "draft"
                            ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value="draft"
                          checked={formData.status === "draft"}
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        <Lock className="w-4 h-4 mr-2" />
                        Draft
                      </label>
                      <label
                        className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.status === "published"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value="published"
                          checked={formData.status === "published"}
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        <Globe className="w-4 h-4 mr-2" />
                        Publish
                      </label>
                    </div>
                  </div>

                  {/* Kategori */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Publikasi
                    </label>
                    <input
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Author Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {user?.displayName?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "A"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Penulis</h3>
                    <p className="text-sm text-gray-600">
                      {user?.displayName || user?.email || "Admin"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>
                          {berita ? "Perbarui Berita" : "Simpan Berita"}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onCancel}
                    className="w-full px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
