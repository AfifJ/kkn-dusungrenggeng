import Link from "next/link";
import { Calendar, Clock, MapPin, CheckCircle, Circle } from "lucide-react";
import { kalenderData, kategoriWarna } from "../../data/kalender";

export default function KalenderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Kalender Kegiatan Lengkap
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-green-100">
              Jadwal lengkap semua kegiatan dan agenda masyarakat Dusun
              Grenggeng
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-500">
                    Kalender
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Statistics */}
      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {kalenderData.reduce(
              (acc, day) =>
                acc + day.activities.filter((a) => a.completed).length,
              0
            )}
          </div>
          <div className="text-gray-600">Kegiatan Selesai</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {kalenderData.reduce(
              (acc, day) =>
                acc + day.activities.filter((a) => !a.completed).length,
              0
            )}
          </div>
          <div className="text-gray-600">Kegiatan Mendatang</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-600 mb-2">
            {kalenderData.length}
          </div>
          <div className="text-gray-600">Hari Aktif</div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Month Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              November 2024
            </h2>
            <p className="text-gray-600">
              Total{" "}
              {kalenderData.reduce(
                (acc, day) => acc + day.activities.length,
                0
              )}{" "}
              kegiatan terjadwal
            </p>
          </div>

          {/* Activities by Date */}
          <div className="space-y-8">
            {kalenderData.map((dayData) => (
              <div
                key={dayData.date}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Date Header */}
                <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {dayData.dayName},{" "}
                        {new Date(dayData.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {dayData.activities.length} kegiatan
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Activities List */}
                <div className="p-6">
                  <div className="space-y-4">
                    {dayData.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex gap-4 p-4 rounded-lg border border-gray-100 hover:border-green-200 transition-colors"
                      >
                        {/* Status Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {activity.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        {/* Activity Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4
                              className={`text-lg font-semibold ${
                                activity.completed
                                  ? "text-gray-500 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {activity.title}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                kategoriWarna[activity.category]
                              }`}
                            >
                              {activity.category}
                            </span>
                          </div>

                          <p
                            className={`text-sm mb-3 ${
                              activity.completed
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {activity.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-blue-600">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">
                                {activity.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{activity.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link
              href="/#agenda"
              className="inline-flex items-center rounded-lg border border-green-700 px-6 py-3 font-medium text-green-700 transition-colors hover:bg-green-700 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5 rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
