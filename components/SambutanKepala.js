"use client";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { websiteData } from "@/data/website";

export default function SambutanKepala() {
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
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-3xl font-bold text-green-800 md:text-4xl">
            Sambutan Kepala Dusun
          </h2>
          <div className="mx-auto mb-6 h-1 w-20 bg-green-600"></div>

          <div className="flex flex-col items-center gap-8 overflow-hidden rounded-lg border border-green-200 bg-green-50 ps-8 shadow-md md:flex-row">
            <div className="w-full p-6 md:p-8">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-green-700">
                  {settings.sambutan?.nama || "Bapak Sutrisno"}
                </h3>
                <p className="text-green-600">
                  Kepala Dusun Grenggeng
                </p>
              </div>

              <div className="prose text-gray-700">
                <p>
                  {settings.sambutan?.paragraf || "Dengan segala kerendahan hati, saya menyambut Anda di website resmi Dusun Grenggeng. Dusun kami yang kecil ini telah dikenal sebagai penghasil tahu berkualitas dan hasil pertanian yang melimpah. Kami bangga dengan warisan kuliner tahu tradisional yang telah dipertahankan secara turun-temurun, serta semangat gotong royong masyarakat dalam mengelola hasil bumi. Melalui website ini, kami berharap dapat memperkenalkan kekayaan alam dan budaya Dusun Grenggeng kepada lebih banyak orang. Terima kasih atas kunjungan Anda."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// }
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
