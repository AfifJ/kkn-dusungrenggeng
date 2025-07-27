"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/auth";
import { addDataUsaha, updateDataUsaha, getDataUsahaById } from "../actions";

export default function DataUsahaForm({ id }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    jenis: "PABRIK TAHU",
    pemilik: "",
    telepon: "",
    alamat: "",
    operasional: "",
    medsos: "",
  });

  const jenisOptions = [
    "PABRIK TAHU",
    "PANGSIT",
    "WARUNG",
    "LAINNYA"
  ];

  useEffect(() => {
    if (id) {
      fetchDataUsaha();
    }
  }, [id]);

  const fetchDataUsaha = async () => {
    try {
      setLoading(true);
      const data = await getDataUsahaById(id);
      if (data) {
        setFormData({
          nama: data.nama || "",
          jenis: data.jenis || "PABRIK TAHU",
          pemilik: data.pemilik || "",
          telepon: data.telepon || "",
          alamat: data.alamat || "",
          operasional: data.operasional || "",
          medsos: data.medsos || "",
        });
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
      toast.error("Gagal memuat data usaha");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (id) {
        await updateDataUsaha(id, formData, user.email);
        toast.success("Data usaha berhasil diperbarui");
      } else {
        await addDataUsaha(formData, user.email);
        toast.success("Data usaha berhasil ditambahkan");
      }

      router.push("/admin/data-usaha");
    } catch (error) {
      console.error("Error saving business data:", error);
      toast.error("Gagal menyimpan data usaha");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? "Edit Data Usaha" : "Tambah Data Usaha"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Usaha */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Usaha
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nama usaha"
            />
          </div>

          {/* Jenis Usaha */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Usaha
            </label>
            <select
              name="jenis"
              value={formData.jenis}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {jenisOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Pemilik */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pemilik
            </label>
            <input
              type="text"
              name="pemilik"
              value={formData.pemilik}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nama pemilik"
            />
          </div>

          {/* Telepon */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telepon
            </label>
            <input
              type="text"
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nomor telepon"
            />
          </div>

          {/* Alamat */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan alamat lengkap"
              rows={3}
            />
          </div>

          {/* Jam Operasional */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jam Operasional
            </label>
            <input
              type="text"
              name="operasional"
              value={formData.operasional}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: 08.00-17.00"
            />
          </div>

          {/* Media Sosial */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Media Sosial
            </label>
            <input
              type="text"
              name="medsos"
              value={formData.medsos}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan akun media sosial"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/data-usaha")}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
