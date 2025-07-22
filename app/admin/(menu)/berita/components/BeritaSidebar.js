"use client";

import { Settings, Globe, Lock, Save } from "lucide-react";

export default function BeritaSidebar({
  formData,
  handleInputChange,
  loading,
  onCancel,
  berita,
  categories,
}) {
  return (
    <div className="w-full xl:w-80 p-6 space-y-6 xl:sticky xl:top-0 self-start">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
            />
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
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
                <span>{berita ? "Perbarui Berita" : "Simpan Berita"}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
