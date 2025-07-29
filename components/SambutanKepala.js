"use client";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function SambutanKepala() {
  const [settings, setSettings] = useState(null);
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
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-3 text-center text-3xl font-bold text-green-800 md:text-4xl">
              Sambutan Kepala Dusun
            </h2>
            <div className="mx-auto mb-6 h-1 w-20 bg-green-600"></div>
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-3xl font-bold text-green-800 md:text-4xl">
            Sambutan Kepala Dusun
          </h2>
          <div className="mx-auto mb-6 h-1 w-20 bg-green-600"></div>

          {settings?.sambutan ? (
            <div className="flex flex-col items-center gap-8 overflow-hidden rounded-lg border border-green-200 bg-green-50 ps-8 shadow-md md:flex-row">
              <div className="w-full p-6 md:p-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-green-700">
                    {settings.sambutan.nama}
                  </h3>
                  <p className="text-green-600">
                    Kepala Dusun Grenggeng
                  </p>
                </div>

                <div className="prose text-gray-700">
                  <p>
                    {settings.sambutan.paragraf}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
              <p className="text-gray-700">
                Sambutan kepala dusun belum tersedia.
              </p>
            </div>
          )}
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
