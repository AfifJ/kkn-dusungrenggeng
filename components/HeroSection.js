"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function HeroSection() {
  const [settings, setSettings] = useState({
    hero: {
      title: "Selamat Datang di Dusun Grenggeng",
      subtitle: "Desa penghasil tahu dan hasil tani berkualitas dengan keindahan alam yang mempesona.",
      backgroundImage: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae"
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "settings", "website");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex h-screen items-center bg-gray-700 pt-16">
        <div className="container mx-auto px-4 text-center md:text-left">
          <div className="bg-white/90 inline-block max-w-2xl rounded-lg p-8 shadow-lg">
            <div className="mb-4 h-12 md:h-16 bg-gray-300 rounded animate-pulse"></div>
            <div className="mb-6 space-y-2">
              <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
              <div className="h-12 w-48 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="h-12 w-40 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="bg-white/90 inline-block max-w-2xl rounded-lg p-8 shadow-lg">
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
