"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [settings, setSettings] = useState({
    hero: {
      title: "Selamat Datang di Dusun Grenggeng",
      subtitle:
        "Desa penghasil tahu dan hasil tani berkualitas dengan keindahan alam yang mempesona. Kami menjaga tradisi dengan cita rasa yang autentik.",
      backgroundImage:
        "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin?section=settings");
      const data = await response.json();
      if (data && Object.keys(data).length > 0) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  return (
    <div
      className="relative flex h-screen items-center bg-cover bg-center pt-16"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${
          settings.hero?.backgroundImage ||
          "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        }')`,
      }}
    >
      <div className="container mx-auto px-4 text-center md:text-left">
        <div className="bg-opacity-90 inline-block max-w-2xl rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-4xl font-bold text-green-900 md:text-5xl">
            {settings.hero?.title || "Selamat Datang di Dusun Grenggeng"}
          </h1>
          <p className="mb-6 text-lg text-gray-700">
            {settings.hero?.subtitle ||
              "Desa penghasil tahu dan hasil tani berkualitas dengan keindahan alam yang mempesona. Kami menjaga tradisi dengan cita rasa yang autentik."}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
            <Link
              href="#produk"
              className="rounded-lg bg-green-700 px-6 py-3 font-medium text-white shadow-md transition duration-300 hover:bg-green-800 text-center"
            >
              Jelajahi Produk Kami
            </Link>
            <Link
              href="https://maps.app.goo.gl/N4V5m9pVRpyjReVc6"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border-2 border-green-700 px-6 py-3 font-medium text-green-700 transition duration-300 hover:bg-green-50 text-center"
            >
              Kunjungi Desa
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
