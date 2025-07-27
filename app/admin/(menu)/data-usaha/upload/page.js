"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/auth";
import { bulkUploadDataUsaha } from "../actions";
import AdminLayout from "@/components/admin/AdminLayout";

function UploadDataUsahaContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [jsonText, setJsonText] = useState("");

  const validateDataUsaha = (data) => {
    if (!data) return false;

    const items = Array.isArray(data) ? data : [data];
    const requiredFields = [
      /* 'nama', 'jenis', 'pemilik', 'alamat' */
    ];
    const validJenis = ["PABRIK TAHU", "PANGSIT", "WARUNG", "LAINNYA"];

    for (const item of items) {
      // Check required fields
      for (const field of requiredFields) {
        if (!item[field]) {
          throw new Error(`Field '${field}' harus diisi`);
        }
      }

      // Validate jenis
      if (!validJenis.includes(item.jenis)) {
        throw new Error(
          `Jenis usaha '${
            item.jenis
          }' tidak valid. Pilih dari: ${validJenis.join(", ")}`
        );
      }

      // Validate types
      if (
        typeof item.nama !== "string" ||
        typeof item.pemilik !== "string" ||
        typeof item.alamat !== "string"
      ) {
        throw new Error("Nama, pemilik, dan alamat harus berupa teks");
      }
    }

    return true;
  };

  const handleJsonTextChange = (e) => {
    const value = e.target.value;
    setJsonText(value);

    if (!value.trim()) {
      setJsonData(null);
      return;
    }

    try {
      const data = JSON.parse(value);
      validateDataUsaha(data);
      setJsonData(data);
    } catch (error) {
      setJsonData(null);
      toast.error(`Format JSON tidak valid: ${error.message}`, {
        duration: 5000,
      });
    }
  };

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jsonData) {
      toast.error("Silakan upload file JSON yang valid terlebih dahulu");
      return;
    }

    try {
      setLoading(true);
      const dataToUpload = Array.isArray(jsonData) ? jsonData : [jsonData];
      await bulkUploadDataUsaha(dataToUpload, user.email);

      toast.success(`Berhasil mengupload ${dataToUpload.length} data usaha`);
      router.push("/admin/data-usaha");
    } catch (error) {
      console.error("Error uploading data:", error);
      toast.error(`Gagal mengupload data: ${error.message}`);
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
        Upload Data Usaha (JSON)
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Data JSON
            </label>
            <textarea
              className="w-full min-h-[180px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Paste atau ketik data JSON di sini..."
              value={jsonText}
              onChange={handleJsonTextChange}
              spellCheck={false}
            />
            {jsonText && !jsonData && (
              <div className="text-red-600 text-sm mt-2">
                Format JSON tidak valid
              </div>
            )}
          </div>

          {jsonData && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Preview Data
              </h2>
              <pre className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                {JSON.stringify(jsonData, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push("/data-usaha")}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!jsonData}
              className={`px-6 py-2 text-white rounded-lg transition-colors cursor-pointer ${
                jsonData
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UploadDataUsaha() {
  return <UploadDataUsahaContent />;
}
