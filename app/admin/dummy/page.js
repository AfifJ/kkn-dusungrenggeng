"use client";

import { useState } from "react";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  doc,
  writeBatch,
  query
} from "firebase/firestore";
import { db } from "@/firebase/client";
import { 
  beritaData, 
  galeriData, 
  produkData, 
  agendaData 
} from "@/data/index";
import { toast } from "react-hot-toast";

export default function DummyDataPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
  };

  const importData = async (collectionName, data) => {
    const batch = writeBatch(db);
    const collectionRef = collection(db, collectionName);

    data.forEach((item) => {
      const docRef = doc(collectionRef);
      const itemWithMeta = {
        ...item,
        slug: item.slug || generateSlug(item.judul || item.title || item.nama),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: item.status || "published"
      };
      batch.set(docRef, itemWithMeta);
    });

    await batch.commit();
  };

  const clearCollection = async (collectionName) => {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  };

  const handleImportAll = async () => {
    setLoading(true);
    setStatus("Mengimport data dummy...");

    try {
      // Import berita
      setStatus("Mengimport data berita...");
      await importData("berita", beritaData);
      toast.success("Data berita berhasil diimport!");
      
      // Import galeri
      setStatus("Mengimport data galeri...");
      await importData("galeri", galeriData);
      toast.success("Data galeri berhasil diimport!");
      
      // Import produk
      setStatus("Mengimport data produk...");
      await importData("produk", produkData);
      toast.success("Data produk berhasil diimport!");
      
      // Import agenda
      setStatus("Mengimport data agenda...");
      await importData("agenda", agendaData);
      toast.success("Data agenda berhasil diimport!");

      setStatus("✅ Semua data dummy berhasil diimport!");
      toast.success("Semua data dummy berhasil diimport!");
    } catch (error) {
      console.error("Error importing data:", error);
      setStatus("❌ Error: " + error.message);
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAll = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus semua data dummy? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    setLoading(true);
    setStatus("Menghapus semua data dummy...");

    try {
      setStatus("Menghapus data berita...");
      await clearCollection("berita");
      toast.success("Data berita berhasil dihapus!");
      
      setStatus("Menghapus data galeri...");
      await clearCollection("galeri");
      toast.success("Data galeri berhasil dihapus!");
      
      setStatus("Menghapus data produk...");
      await clearCollection("produk");
      toast.success("Data produk berhasil dihapus!");
      
      setStatus("Menghapus data agenda...");
      await clearCollection("agenda");
      toast.success("Data agenda berhasil dihapus!");

      setStatus("✅ Semua data dummy berhasil dihapus!");
      toast.success("Semua data dummy berhasil dihapus!");
    } catch (error) {
      console.error("Error clearing data:", error);
      setStatus("❌ Error: " + error.message);
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportSpecific = async (type) => {
    setLoading(true);
    setStatus(`Mengimport data ${type}...`);

    try {
      switch (type) {
        case "berita":
          await importData("berita", beritaData);
          break;
        case "galeri":
          await importData("galeri", galeriData);
          break;
        case "produk":
          await importData("produk", produkData);
          break;
        case "agenda":
          await importData("agenda", agendaData);
          break;
      }
      setStatus(`✅ Data ${type} berhasil diimport!`);
      toast.success(`Data ${type} berhasil diimport!`);
    } catch (error) {
      console.error(`Error importing ${type}:`, error);
      setStatus("❌ Error: " + error.message);
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSpecific = async (type) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus semua data ${type}?`)) {
      return;
    }

    setLoading(true);
    setStatus(`Menghapus data ${type}...`);

    try {
      await clearCollection(type);
      setStatus(`✅ Data ${type} berhasil dihapus!`);
      toast.success(`Data ${type} berhasil dihapus!`);
    } catch (error) {
      console.error(`Error clearing ${type}:`, error);
      setStatus("❌ Error: " + error.message);
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Manajemen Data Dummy
          </h1>
          
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Peringatan
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Halaman ini digunakan untuk mengimport data dummy dari folder <code className="bg-yellow-200 px-1 rounded">data/</code> ke Firebase Firestore.
                    Pastikan Anda memahami konsekuensi dari setiap tindakan sebelum melanjutkan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Display */}
          {status && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Status: {status}
              </p>
            </div>
          )}

          {/* Global Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Aksi Global
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleImportAll}
                disabled={loading}
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Import Semua Data Dummy
                  </>
                )}
              </button>
              
              <button
                onClick={handleResetAll}
                disabled={loading}
                className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Reset Semua Data Dummy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Specific Collections */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Aksi Per Koleksi
            </h2>
            <div className="space-y-4">
              {[
                { key: "berita", label: "Berita", count: beritaData.length, color: "blue" },
                { key: "galeri", label: "Galeri", count: galeriData.length, color: "purple" },
                { key: "produk", label: "Produk", count: produkData.length, color: "green" },
                { key: "agenda", label: "Agenda", count: agendaData.length, color: "orange" }
              ].map((collection) => (
                <div key={collection.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {collection.label}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {collection.count} item tersedia
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleImportSpecific(collection.key)}
                      disabled={loading}
                      className={`flex-1 px-3 py-2 text-sm rounded transition-colors font-medium ${
                        collection.color === "blue" 
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400" 
                          : collection.color === "purple"
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:bg-gray-100 disabled:text-gray-400"
                          : collection.color === "green"
                          ? "bg-green-100 text-green-700 hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400"
                          : "bg-orange-100 text-orange-700 hover:bg-orange-200 disabled:bg-gray-100 disabled:text-gray-400"
                      } disabled:cursor-not-allowed`}
                    >
                      Import {collection.label}
                    </button>
                    <button
                      onClick={() => handleClearSpecific(collection.key)}
                      disabled={loading}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Clear {collection.label}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Preview */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Preview Data Dummy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-medium text-blue-900">Berita</div>
                <div className="text-blue-700">{beritaData.length} artikel</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="font-medium text-purple-900">Galeri</div>
                <div className="text-purple-700">{galeriData.length} foto</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-medium text-green-900">Produk</div>
                <div className="text-green-700">{produkData.length} produk</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="font-medium text-orange-900">Agenda</div>
                <div className="text-orange-700">{agendaData.length} kegiatan</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
