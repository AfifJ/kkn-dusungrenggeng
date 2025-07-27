"use client";
import { Factory, Users, Sprout, TrendingUp, Home, Building } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

const iconMap = {
  Factory,
  Users,
  Sprout,
  TrendingUp,
  Home,
  Building
};

export default function StatistikSection() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError("Settings data not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("Failed to load settings data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="text-center">Loading statistics...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : settings ? (
          <>
            <h2 className="mb-3 text-center text-3xl font-bold text-green-800 md:text-4xl">
              {settings.jelajahi?.title}
            </h2>
            <div className="mx-auto mb-6 h-1 w-20 bg-green-600"></div>

            <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-gray-600">
              {settings.jelajahi?.description}
            </p>
            
            <div className={`mx-auto grid max-w-6xl grid-cols-1 gap-8 ${
              settings.statistics?.length === 1 ? 'md:grid-cols-1' : 
              settings.statistics?.length === 2 ? 'md:grid-cols-2' : 
              settings.statistics?.length === 3 ? 'md:grid-cols-3' : 
              settings.statistics?.length === 4 ? 'md:grid-cols-4' : 
              'md:grid-cols-2 lg:grid-cols-5'
            }`}>
              {settings.statistics?.map((stat) => {
            const IconComponent = iconMap[stat.icon] || Factory;
            return (
              <div key={stat.id} className="bg-green-700/100 border-white/20 rounded-lg border p-8 text-center text-white backdrop-blur-sm backdrop-filter">
                <div className="mb-3 text-5xl font-bold">
                  {stat.value}
                </div>
                <div className="text-xl">
                  {stat.label}
                </div>
                <div className="mt-4">
                  <IconComponent className="mx-auto h-12 w-12 text-green-200" />
                </div>
              </div>
              );
            })}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
