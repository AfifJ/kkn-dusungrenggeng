"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { addBeritaWithImage, updateBeritaWithImage, deleteImageFromImghippo } from "../actions";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/auth";
import RichTextEditor from "./RichTextEditor";
import { Upload, X, FileText, ImageIcon, BookOpen } from "lucide-react";
import Image from "next/image";
import BeritaSidebar from "./BeritaSidebar";

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
  const [imageDeleteUrl, setImageDeleteUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const judulRef = useRef(null);
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
    mountedRef.current = true;
    setMounted(true);
    return () => {
      mountedRef.current = false;
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (berita && mounted && mountedRef.current) {
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
      setImageDeleteUrl(berita.deleteUrl || "");

      // Update judul content without affecting cursor position
      if (judulRef.current && berita.judul) {
        judulRef.current.textContent = berita.judul;
      }
    }
  }, [berita, mounted]);

  const handleInputChange = (e) => {
    if (!mountedRef.current) return;

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update image compression function to use Imghippo utility
  const compressImage = useCallback(
    (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = document.createElement("img");

        img.onload = () => {
          if (!mountedRef.current) {
            resolve(null);
            return;
          }

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
    },
    []
  );

  const handleImageChange = useCallback(
    (e) => {
      if (!mountedRef.current) return;

      const file = e.target.files[0];
      if (file) {
        // Check file size (3MB limit)
        if (file.size > 3 * 1024 * 1024) {
          toast.error("Ukuran file terlalu besar. Maksimal 3MB");
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
            if (!mountedRef.current || !compressedFile) return;

            setImageFile(compressedFile);
            const reader = new FileReader();
            reader.onload = (e) => {
              if (!mountedRef.current) return;
              setImagePreview(e.target.result);
            };
            reader.readAsDataURL(compressedFile);
          });
        } else {
          setImageFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            if (!mountedRef.current) return;
            setImagePreview(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [compressImage]
  );

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
          ? "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col xl:flex-row">
            <div className="flex-1 p-6 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">Judul Berita</span>
                </div>
                <div
                  ref={judulRef}
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="w-full text-3xl font-bold text-gray-900 border-none outline-none focus:ring-0 bg-transparent break-words min-h-[1.2em] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
                  style={{
                    minHeight: "1.2em",
                    lineHeight: "1.2",
                  }}
                  onInput={(e) => {
                    const text = e.target.textContent;
                    setFormData((prev) => ({
                      ...prev,
                      judul: text,
                    }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                  data-placeholder="Masukkan judul berita yang menarik..."
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
                          onClick={async () => {
                            if (!mountedRef.current) return;
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
                {mounted && (
                  <RichTextEditor
                    value={formData.konten}
                    onChange={(value) => {
                      if (!mountedRef.current) return;
                      setFormData((prev) => ({ ...prev, konten: value }));
                    }}
                    placeholder="Mulai menulis konten berita Anda..."
                  />
                )}
              </div>
            </div>

            {/* Sidebar */}
            <BeritaSidebar
              formData={formData}
              handleInputChange={handleInputChange}
              loading={loading}
              onCancel={onCancel}
              berita={berita}
              categories={categories}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
