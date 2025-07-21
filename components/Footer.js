"use client";
import {
  MapPin,
  Instagram,
  MessageCircle,
  Twitter,
  Youtube,
  Mail,
  Phone,
  Globe,
  Share2,
  Facebook,
} from "lucide-react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { websiteData } from "@/data/website";
import Link from "next/link";

const iconMap = {
  Instagram,
  MessageCircle,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Globe,
  Share2,
};

export default function Footer() {
  const [settings, setSettings] = useState(websiteData);
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
      } else {
        setSettings(websiteData);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setSettings(websiteData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-green-800 pt-12 pb-8 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {/* Kolom Kiri - Tentang Desa */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold">
                {settings.footer?.title || "Dusun Grenggeng"}
              </h3>
            </div>

            <p className="text-green-100">
              {settings.footer?.description ||
                "Desa penghasil tahu dan hasil tani berkualitas dengan keindahan alam yang mempesona."}
            </p>

            {/* Quick Links */}
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold text-green-200 uppercase tracking-wider">
                Jelajahi Website
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/berita"
                  className="text-green-100 hover:text-white transition-colors text-sm"
                >
                  Berita Desa
                </Link>
                <Link
                  href="/produk"
                  className="text-green-100 hover:text-white transition-colors text-sm"
                >
                  Produk UMKM
                </Link>
                <Link
                  href="/galeri"
                  className="text-green-100 hover:text-white transition-colors text-sm"
                >
                  Galeri Foto
                </Link>
                <Link
                  href="/agenda"
                  className="text-green-100 hover:text-white transition-colors text-sm"
                >
                  Agenda Kegiatan
                </Link>
                <Link
                  href="/kalender"
                  className="text-green-100 hover:text-white transition-colors text-sm"
                >
                  Kalender Desa
                </Link>
                <Link
                  href="#tentang"
                  className="text-green-100 hover:text-white transition-colors text-sm"
                >
                  Tentang Kami
                </Link>
              </div>
            </div>
          </div>

          {/* Kolom Tengah - Layanan */}
          <div className="space-y-4">
            <h4 className="mb-4 text-lg font-semibold">Layanan Desa</h4>
            <div className="space-y-2">
              <Link
                href="/produk"
                className="block text-green-100 hover:text-white transition-colors"
              >
                • Tahu Tradisional Grenggeng
              </Link>
              <Link
                href="/produk"
                className="block text-green-100 hover:text-white transition-colors"
              >
                • Hasil Pertanian Segar
              </Link>
              <Link
                href="/agenda"
                className="block text-green-100 hover:text-white transition-colors"
              >
                • Kegiatan Masyarakat
              </Link>
              <Link
                href="/berita"
                className="block text-green-100 hover:text-white transition-colors"
              >
                • Informasi Desa Terkini
              </Link>
              <Link
                href="/galeri"
                className="block text-green-100 hover:text-white transition-colors"
              >
                • Dokumentasi Kegiatan
              </Link>
            </div>

            {/* External Resources */}
            <div className="mt-6">
              <h5 className="mb-3 text-sm font-semibold text-green-200 uppercase tracking-wider">
                Sumber Daya
              </h5>
              <div className="space-y-1">
                <Link
                  href="https://magelangkab.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-green-100 hover:text-white transition-colors text-sm"
                >
                  Pemkab Magelang ↗
                </Link>
                <Link
                  href="https://distan.jatengprov.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-green-100 hover:text-white transition-colors text-sm"
                >
                  Dinas Pertanian Jateng ↗
                </Link>
                <Link
                  href="https://sid.kemendesa.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-green-100 hover:text-white transition-colors text-sm"
                >
                  Portal Data Desa ↗
                </Link>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Hubungi Kami */}
          <div className="space-y-4">
            <h4 className="mb-4 text-lg font-semibold">Hubungi Kami</h4>
            <ul className="space-y-3">
              {/* Dynamic Address Links */}
              {settings.footer?.alamat &&
                Object.entries(settings.footer.alamat).map(([id, alamatData]) => {
                  if (!alamatData.alamat) return null;

                  const IconComponent = iconMap[alamatData.icon] || MapPin;
                  const isUrl = alamatData.alamat.startsWith("http");

                  return (
                    <li key={id}>
                      {isUrl ? (
                        <Link
                          href={alamatData.alamat}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2 text-green-100 transition-colors hover:text-white"
                        >
                          <IconComponent
                            className="mt-1 text-green-200 flex-shrink-0"
                            size={16}
                          />
                          <span>{alamatData.label || alamatData.alamat}</span>
                        </Link>
                      ) : (
                        <div className="flex items-start gap-2 text-green-100">
                          <IconComponent
                            className="mt-1 text-green-200 flex-shrink-0"
                            size={16}
                          />
                          <span>
                            {alamatData.label
                              ? `${alamatData.label}: ${alamatData.alamat}`
                              : alamatData.alamat}
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}

              {/* Dynamic Social Media Links */}
              {settings.footer?.socialMedia &&
                Object.entries(settings.footer.socialMedia).map(
                  ([id, socialData]) => {
                    if (!socialData.url) return null;

                    const IconComponent = iconMap[socialData.icon] || Share2;

                    return (
                      <li key={id}>
                        <Link
                          href={socialData.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-green-100 transition-colors hover:text-white"
                        >
                          <IconComponent
                            className="text-green-200 flex-shrink-0"
                            size={16}
                          />
                          <span>{socialData.platform || "Link"}</span>
                        </Link>
                      </li>
                    );
                  }
                )}

              {/* Default fallback if no data */}
              {(!settings.footer?.alamat ||
                Object.keys(settings.footer.alamat).length === 0) &&
                (!settings.footer?.socialMedia ||
                  Object.keys(settings.footer.socialMedia).length === 0) && (
                  <>
                    <li>
                      <Link
                        href="https://maps.app.goo.gl/N4V5m9pVRpyjReVc6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-green-100 transition-colors hover:text-white"
                      >
                        <MapPin
                          className="mt-1 text-green-200 flex-shrink-0"
                          size={16}
                        />
                        <span>
                          Jl. Raya Grenggeng, Kec. Bandongan, Kab. Magelang,
                          Jawa Tengah
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://instagram.com/dusungrenggeng"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-100 transition-colors hover:text-white"
                      >
                        <Instagram
                          className="text-green-200 flex-shrink-0"
                          size={16}
                        />
                        <span>Instagram</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-100 transition-colors hover:text-white"
                      >
                        <MessageCircle
                          className="text-green-200 flex-shrink-0"
                          size={16}
                        />
                        <span>WhatsApp</span>
                      </Link>
                    </li>
                  </>
                )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-green-700 pt-6 text-center text-sm text-green-200">
          <p>
            ©2025 {settings.footer?.title || "Dusun Grenggeng"}. Seluruh hak
            cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
