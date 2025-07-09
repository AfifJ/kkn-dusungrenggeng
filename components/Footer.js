"use client";
import {
  MapPin,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Footer() {
  const [settings, setSettings] = useState({
    footer: {
      title: "Dusun Grenggeng",
      description:
        "Desa penghasil tahu dan hasil tani berkualitas dengan keindahan alam yang mempesona.",
      alamat: "Jl. Raya Grenggeng, Kec. Bandongan, Kab. Magelang, Jawa Tengah",
      email: "dusun.grenggeng@example.com",
      telepon: "(0293) 1234567",
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
    <footer className="bg-green-800 pt-12 pb-8 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* Kolom Kiri - Brand & Kontak */}
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
          </div>

          {/* Kolom Kanan - Hubungi Kami */}
          <div className="grid gap-6">
            <div>
              <h4 className="mb-4 text-lg font-semibold">Hubungi Kami</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="https://maps.app.goo.gl/N4V5m9pVRpyjReVc6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-green-100 transition-colors hover:text-white"
                  >
                    <MapPin className="mt-1 text-green-200" />
                    <span>
                      {settings.footer?.alamat ||
                        "Jl. Raya Grenggeng, Kec. Bandongan, Kab. Magelang, Jawa Tengah"}
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
                    <Instagram className="text-sm" />
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
                    <MessageCircle className="text-sm" />
                    <span>WhatsApp Kadus</span>
                  </Link>
                </li>
              </ul>
            </div>
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
//           </div>
//         </div>

//         {/* Copyright */}
//         <div className="mt-8 border-t border-green-700 pt-6 text-center text-sm text-green-200">
//           <p>
//             ©2025 {settings.footer?.title || "Dusun Grenggeng"}. Seluruh hak cipta
//             dilindungi.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }
// }
