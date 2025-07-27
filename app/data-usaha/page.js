"use client";

import { useState, useEffect } from "react";
import { getDataUsaha } from "@/app/admin/(menu)/data-usaha/actions";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function DataUsahaPage() {
  const [dataUsaha, setDataUsaha] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataUsaha();
        setDataUsaha(data);
      } catch (error) {
        console.error("Error fetching business data:", error);
        toast.error("Gagal memuat data usaha");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="container mx-auto mt-16 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Data Usaha di Grenggeng
        </h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nama Usaha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Jenis Usaha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nama Pemilik
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    No Telepon
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Operasional
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataUsaha.map((usaha, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {usaha.nama || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usaha.jenis || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usaha.pemilik || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usaha.telepon || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usaha.alamat || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usaha.operasional || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
