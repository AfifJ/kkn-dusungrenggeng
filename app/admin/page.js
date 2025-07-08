"use client";
import { useState } from "react";
import AdminForm from "@/components/AdminForm";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  Newspaper,
  Package,
  Image,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";

export default function AdminPage() {
  const [selectedSection, setSelectedSection] = useState("berita");
  const sections = [
    { key: "berita", label: "Berita" },
    { key: "produk", label: "Produk" },
    { key: "galeri", label: "Galeri" },
    { key: "kalender", label: "Agenda/Kalender" },
  ];

  const stats = [
    {
      name: "Total Berita",
      value: "24",
      icon: Newspaper,
      color: "bg-blue-500",
    },
    {
      name: "Produk Aktif",
      value: "12",
      icon: Package,
      color: "bg-green-500",
    },
    {
      name: "Foto Galeri",
      value: "48",
      icon: Image,
      color: "bg-purple-500",
    },
    {
      name: "Agenda Bulan Ini",
      value: "8",
      icon: Calendar,
      color: "bg-orange-500",
    },
    {
      name: "Pengunjung Hari Ini",
      value: "156",
      icon: Users,
      color: "bg-red-500",
    },
    {
      name: "Total Views",
      value: "2,341",
      icon: TrendingUp,
      color: "bg-indigo-500",
    },
  ];

  const recentActivities = [
    {
      action: "Menambah berita baru",
      item: "Panen Raya Dusun Grenggeng",
      time: "2 jam lalu",
    },
    {
      action: "Mengupdate produk",
      item: "Tahu Tradisional",
      time: "4 jam lalu",
    },
    {
      action: "Menambah foto galeri",
      item: "Kegiatan Gotong Royong",
      time: "6 jam lalu",
    },
    {
      action: "Membuat agenda baru",
      item: "Rapat RT Bulanan",
      time: "1 hari lalu",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Selamat datang di panel admin Dusun Grenggeng
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Aktivitas Terbaru
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span>:{" "}
                      {activity.item}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Aksi Cepat</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                <Newspaper className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-medium text-gray-900">Tulis Berita</h3>
                <p className="text-sm text-gray-600">
                  Buat artikel berita baru
                </p>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                <Package className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="font-medium text-gray-900">Tambah Produk</h3>
                <p className="text-sm text-gray-600">Upload produk baru</p>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                <Image className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="font-medium text-gray-900">Upload Foto</h3>
                <p className="text-sm text-gray-600">Tambah ke galeri</p>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                <Calendar className="h-8 w-8 text-orange-500 mb-2" />
                <h3 className="font-medium text-gray-900">Buat Agenda</h3>
                <p className="text-sm text-gray-600">Jadwalkan kegiatan</p>
              </button>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">
              Kelola konten website Dusun Grenggeng
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setSelectedSection(section.key)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedSection === section.key
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <AdminForm section={selectedSection} />
            </div>
          </div>
        </div> */}
      </div>
    </AdminLayout>
  );
}
