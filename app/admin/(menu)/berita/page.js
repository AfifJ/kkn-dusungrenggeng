"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getBerita, deleteBeritaWithImage, searchBerita } from "./actions";
import DeleteModal from "./components/DeleteModal";
import Dialog from "@/components/admin/Dialog";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/auth";
import { useDialog } from "@/hooks/useDialog";
import { getPreviewText, getReadingTime } from "./utils/textUtils";
import { ImageOff } from "lucide-react";

export default function AdminBeritaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { dialog, closeDialog, confirm } = useDialog();
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, berita: null });

  const categories = ["Pengumuman", "Kegiatan", "Berita Desa", "Artikel"];

  useEffect(() => {
    fetchBerita();
  }, []);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      const data = await getBerita();
      setBerita(data);
    } catch (error) {
      console.error("Error fetching berita:", error);
      toast.error("Gagal memuat berita");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchBerita(searchTerm, selectedCategory);
      setBerita(data);
    } catch (error) {
      console.error("Error searching berita:", error);
      toast.error("Gagal mencari berita");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (beritaItem) => {
    router.push(`/admin/berita/${beritaItem.id}`);
  };

  const handleDelete = (id, title) => {
    confirm(
      `Apakah Anda yakin ingin menghapus berita "${title}"?`,
      () => confirmDelete(id),
      {
        title: "Hapus Berita",
        type: "error",
        confirmText: "Hapus",
      }
    );
  };

  const confirmDelete = async (id) => {
    try {
      setLoading(true);
      const beritaItem = berita.find((item) => item.id === id);
      await deleteBeritaWithImage(
        id,
        beritaItem?.judul || "Berita",
        user.email
      );
      toast.success("Berita berhasil dihapus");
      setDeleteModal({ show: false, berita: null });
      fetchBerita();
    } catch (error) {
      console.error("Error deleting berita:", error);
      toast.error("Gagal menghapus berita");
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Berita</h1>
        <button
          onClick={() => router.push("/admin/berita/tambah")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Tambah Berita
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Cari
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
              fetchBerita();
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Berita Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {berita.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Image */}
                <div className="w-full h-40 lg:w-48 lg:h-48 my-auto flex-shrink-0">
                  <div className="aspect-video lg:aspect-square relative overflow-hidden rounded-lg bg-gray-50 w-full h-full">
                    {item.gambar ? (
                      <Image
                        src={item.gambar}
                        alt={item.judul}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-4xl w-fit mx-auto mb-2">
                            <ImageOff />
                          </div>
                          <div className="text-sm">No Image</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header Info */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                      {item.kategori}
                    </span>
                    <span
                      className={`px-3 py-1 text-sm rounded-full font-medium ${
                        item.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status === "published" ? "Terbit" : "Draft"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(item.tanggal)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => handleEdit(item)}
                    className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                    title="Klik untuk mengedit berita"
                  >
                    {item.judul}
                  </h3>

                  {/* Author */}
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Penulis:</span> {item.createdBy}
                  </div>

                  {/* Content Preview */}
                  {item.konten && (
                    <div className="mb-4">
                      <p className="text-gray-700 line-clamp-3 text-sm leading-relaxed">
                        {getPreviewText(item.konten, 200)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          Estimasi baca: {getReadingTime(item.konten)} menit
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                    >
                      Edit Berita
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.judul)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
                    >
                      Hapus
                    </button>
                    {item.status === "published" && (
                      <span className="text-xs text-gray-500">
                        Dipublikasikan pada {formatDate(item.tanggal)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {berita.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak ada berita ditemukan
          </h3>
          <p className="text-gray-500">
            Mulai dengan menambahkan berita pertama Anda
          </p>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <DeleteModal
          berita={deleteModal.berita}
          onConfirm={() => handleDelete(deleteModal.berita)}
          onCancel={() => setDeleteModal({ show: false, berita: null })}
        />
      )}

      {/* Dialog Component */}
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
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Berita List */}
//         <div className="bg-white rounded-lg shadow">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Judul
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Kategori
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Tanggal
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Aksi
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredBerita.map((item) => (
//                   <tr key={item.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {item.judul}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
//                         {item.kategori}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {item.tanggal}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 py-1 text-xs font-medium rounded-full ${
//                           item.status === "published"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleEdit(item)}
//                           className="text-blue-600 hover:text-blue-900"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(item.id, item.judul)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }
// //                           <button
// //                             onClick={() => handleEdit(item)}
// //                             className="text-indigo-600 hover:text-indigo-900"
// //                           >
// //                             <Edit className="h-4 w-4" />
// //                           </button>
// //                           <button
// //                             onClick={() => handleDelete(item.id)}
// //                             className="text-red-600 hover:text-red-900"
// //                           >
// //                             <Trash2 className="h-4 w-4" />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </AdminLayout>
// //   );
// // }
