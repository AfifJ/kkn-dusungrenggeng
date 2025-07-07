"use client";
import { useState } from "react";
import AdminForm from "@/components/AdminForm";

export default function AdminPage() {
  const [selectedSection, setSelectedSection] = useState("landing");
  const sections = ["landing", "berita", "produk", "gallery"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="flex gap-4 mb-6">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            className={`px-4 py-2 rounded ${
              selectedSection === section
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      <AdminForm section={selectedSection} />
    </div>
  );
}
