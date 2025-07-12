"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { getRecentActivityLogs, getActivityStats, getActivityLogs } from "./actions";
import { toast } from "react-hot-toast";
import {
  Newspaper,
  Package,
  ImageIcon,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  Activity,
  Eye,
} from "lucide-react";

export default function AdminPage() {
  const [recentActivities, setRecentActivities] = useState([]);
  const [activityStats, setActivityStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [allLogs, setAllLogs] = useState([]);
  const { user } = useAuth();

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
      icon: ImageIcon,
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

  // Load recent activities and stats from Firebase
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        
        // Load recent activities
        const activities = await getRecentActivityLogs(10);
        setRecentActivities(activities);
        
        // Load activity statistics
        const stats = await getActivityStats();
        setActivityStats(stats);
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError("Gagal memuat data dashboard. Periksa koneksi internet Anda.");
        toast.error("Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Load all logs when showing all logs
  const handleShowAllLogs = async () => {
    try {
      setLoading(true);
      const logs = await getActivityLogs(100);
      setAllLogs(logs);
      setShowAllLogs(true);
    } catch (error) {
      console.error("Error loading all logs:", error);
      toast.error("Gagal memuat semua log");
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Baru saja";

    try {
      const now = new Date();
      const logTime = new Date(timestamp);
      const diffInMinutes = Math.floor((now - logTime) / (1000 * 60));

      if (diffInMinutes < 1) {
        return "Baru saja";
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} menit lalu`;
      } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)} jam lalu`;
      } else {
        return `${Math.floor(diffInMinutes / 1440)} hari lalu`;
      }
    } catch (error) {
      return "Baru saja";
    }
  };

  const getModuleColor = (module) => {
    const colors = {
      berita: "bg-blue-500",
      produk: "bg-green-500",
      galeri: "bg-purple-500",
      agenda: "bg-orange-500",
      settings: "bg-gray-500",
      admin: "bg-red-500",
    };
    return colors[module] || "bg-gray-400";
  };

  return (
    <>
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
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {showAllLogs ? "Semua Log Aktivitas" : "Aktivitas Terbaru"}
              </h2>
              <div className="flex space-x-2">
                {!showAllLogs && (
                  <button
                    onClick={handleShowAllLogs}
                    className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Lihat Semua
                  </button>
                )}
                {showAllLogs && (
                  <button
                    onClick={() => setShowAllLogs(false)}
                    className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Activity className="h-4 w-4 mr-1" />
                    Kembali
                  </button>
                )}
              </div>
            </div>
            {activityStats && (
              <div className="mt-2 flex space-x-4 text-sm text-gray-600">
                <span>Total: {activityStats.total}</span>
                <span>Hari ini: {activityStats.today}</span>
                <span>Minggu ini: {activityStats.thisWeek}</span>
              </div>
            )}
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center text-center py-4">
                <div className="text-orange-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">{error}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {(showAllLogs ? allLogs : recentActivities).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getModuleColor(activity.module)}`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.action}</span>
                        {activity.item && (
                          <>
                            : <span className="text-blue-600">{activity.item}</span>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.adminEmail} • {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {activity.module}
                    </div>
                  </div>
                ))}
                {(showAllLogs ? allLogs : recentActivities).length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Belum ada aktivitas
                  </p>
                )}
              </div>
            )}
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
                <ImageIcon className="h-8 w-8 text-purple-500 mb-2" />
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
      </div>
    </>
  );
}
