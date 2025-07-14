"use client";
import { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  Factory,
  Users,
  Sprout,
  TrendingUp,
  Home,
  Building,
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
} from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { websiteData } from "@/data/website";
import ImageUploadInput from "./components/ImageUploadInput";

const iconOptions = [
  { name: "Factory", component: Factory, label: "Pabrik" },
  { name: "Users", component: Users, label: "Pengguna" },
  { name: "Sprout", component: Sprout, label: "Tanaman" },
  { name: "TrendingUp", component: TrendingUp, label: "Trend Naik" },
  { name: "Home", component: Home, label: "Rumah" },
  { name: "Building", component: Building, label: "Bangunan" },
];

const socialMediaOptions = [
  { name: "Instagram", component: Instagram, label: "Instagram" },
  { name: "Facebook", component: Facebook, label: "Facebook" },
  { name: "MessageCircle", component: MessageCircle, label: "WhatsApp" },
  { name: "Twitter", component: Twitter, label: "Twitter" },
  { name: "Youtube", component: Youtube, label: "YouTube" },
  { name: "Mail", component: Mail, label: "Email" },
  { name: "Phone", component: Phone, label: "Telepon" },
  { name: "MapPin", component: MapPin, label: "Lokasi/Alamat" },
  { name: "Globe", component: Globe, label: "Website" },
  { name: "Share2", component: Share2, label: "Lainnya" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState(websiteData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

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
        // Jika tidak ada data di Firebase, gunakan data default
        setSettings(websiteData);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Fallback to default data
      setSettings(websiteData);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "settings", "website");
      await setDoc(docRef, settings);
      alert("Pengaturan berhasil disimpan!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  const addStatistic = () => {
    const newId = Math.max(...settings.statistics.map((s) => s.id)) + 1;
    setSettings({
      ...settings,
      statistics: [
        ...settings.statistics,
        { id: newId, label: "", value: "", icon: "Factory" },
      ],
    });
  };

  const updateStatistic = (id, field, value) => {
    setSettings({
      ...settings,
      statistics: settings.statistics.map((stat) =>
        stat.id === id ? { ...stat, [field]: value } : stat
      ),
    });
  };

  const deleteStatistic = (id) => {
    setSettings({
      ...settings,
      statistics: settings.statistics.filter((stat) => stat.id !== id),
    });
  };

  // Footer Management Functions
  const addSocialMedia = () => {
    const id = `item_${Date.now()}`;
    setSettings({
      ...settings,
      footer: {
        ...settings.footer,
        socialMedia: {
          ...settings.footer.socialMedia,
          [id]: { platform: "Lainnya", url: "", icon: "Share2" },
        },
      },
    });
  };

  const addAlamat = () => {
    const id = `alamat_${Date.now()}`;
    setSettings({
      ...settings,
      footer: {
        ...settings.footer,
        alamat: {
          ...settings.footer.alamat,
          [id]: { label: "", alamat: "", icon: "MapPin" },
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pengaturan Website
          </h1>
          <p className="text-gray-600">Kelola konten dan tampilan website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Menyimpan..." : "Simpan Semua"}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "hero", label: "Hero Section" },
            { id: "jelajahi", label: "Jelajahi Section" },
            { id: "sambutan", label: "Sambutan Kepala Dusun" },
            { id: "statistics", label: "Statistik" },
            { id: "footer", label: "Footer" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === "hero" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Hero Section
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Utama
              </label>
              <input
                type="text"
                value={settings.hero.title}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <textarea
                value={settings.hero.subtitle}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, subtitle: e.target.value },
                  })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <ImageUploadInput
              label="Background Image URL"
              placeholder="Pilih gambar background atau masukkan URL..."
              value={settings.hero.backgroundImage}
              onChange={(url) =>
                setSettings({
                  ...settings,
                  hero: { ...settings.hero, backgroundImage: url },
                })
              }
            />
          </div>
        )}

        {activeTab === "jelajahi" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Jelajahi Section
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Section
              </label>
              <input
                type="text"
                value={settings.jelajahi.title}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    jelajahi: { ...settings.jelajahi, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={settings.jelajahi.description}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    jelajahi: {
                      ...settings.jelajahi,
                      description: e.target.value,
                    },
                  })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        )}

        {activeTab === "sambutan" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Sambutan Kepala Dusun
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kepala Dusun
              </label>
              <input
                type="text"
                value={settings.sambutan.namaKepala}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    sambutan: {
                      ...settings.sambutan,
                      namaKepala: e.target.value,
                    },
                  })
                }
                placeholder="Contoh: Bapak Suyanto"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesan Sambutan
              </label>
              <textarea
                value={settings.sambutan.pesanSambutan}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    sambutan: {
                      ...settings.sambutan,
                      pesanSambutan: e.target.value,
                    },
                  })
                }
                rows={6}
                placeholder="Tulis pesan sambutan dari kepala dusun..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Preview */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Preview Sambutan
              </h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Sambutan Kepala Dusun
                  </h3>
                  <p className="text-lg font-semibold text-gray-800">
                    {settings.sambutan.namaKepala || "Nama Kepala Dusun"}
                  </p>
                </div>
                <div className="text-gray-700 leading-relaxed text-justify">
                  <p>
                    {settings.sambutan.pesanSambutan ||
                      "Pesan sambutan akan muncul di sini..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "statistics" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Statistik Dusun
              </h3>
              <button
                onClick={addStatistic}
                className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah Statistik
              </button>
            </div>

            <div className="space-y-4">
              {settings.statistics.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      Statistik #{stat.id}
                    </h4>
                    <button
                      onClick={() => deleteStatistic(stat.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Label
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) =>
                          updateStatistic(stat.id, "label", e.target.value)
                        }
                        placeholder="Contoh: Pengusaha Tahu"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nilai
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) =>
                          updateStatistic(stat.id, "value", e.target.value)
                        }
                        placeholder="Contoh: 25"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon
                      </label>
                      <select
                        value={stat.icon}
                        onChange={(e) =>
                          updateStatistic(stat.id, "icon", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {iconOptions.map((option) => (
                          <option key={option.name} value={option.name}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-4 p-4 bg-green-700 text-white rounded-lg text-center">
                    <div className="text-3xl font-bold mb-2">
                      {stat.value || "0"}
                    </div>
                    <div className="text-lg mb-2">{stat.label || "Label"}</div>
                    <div className="flex justify-center">
                      {(() => {
                        const IconComponent =
                          iconOptions.find((opt) => opt.name === stat.icon)
                            ?.component || Factory;
                        return (
                          <IconComponent className="h-8 w-8 text-green-200" />
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}

              {settings.statistics.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg mb-2">Belum ada statistik</div>
                  <p className="text-sm">
                    Klik Tambah Statistik untuk menambah data
                  </p>
                </div>
              )}
            </div>

            {/* Grid Layout Preview */}
            {settings.statistics.length > 0 && (
              <div className="mt-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Preview Layout
                </h4>
                <div
                  className={`grid gap-4 ${
                    settings.statistics.length === 1
                      ? "grid-cols-1"
                      : settings.statistics.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
                  }`}
                >
                  {settings.statistics.map((stat) => (
                    <div
                      key={stat.id}
                      className="bg-green-700 text-white p-6 rounded-lg text-center"
                    >
                      <div className="text-2xl font-bold mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm mb-2">{stat.label}</div>
                      <div className="flex justify-center">
                        {(() => {
                          const IconComponent =
                            iconOptions.find((opt) => opt.name === stat.icon)
                              ?.component || Factory;
                          return (
                            <IconComponent className="h-6 w-6 text-green-200" />
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "footer" && (
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-900">
              Footer Information
            </h3>

            {/* Basic Footer Info - Simplified */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Footer
                </label>
                <input
                  type="text"
                  value={settings.footer?.title || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      footer: { ...settings.footer, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={settings.footer?.description || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      footer: {
                        ...settings.footer,
                        description: e.target.value,
                      },
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Social Media Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Media Sosial & Kontak
                </label>
                <button
                  onClick={addSocialMedia}
                  className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah Kontak
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(settings.footer?.socialMedia || {}).map(
                  ([id, socialData]) => (
                    <div
                      key={id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Icon Selector with Preview */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Platform
                          </label>
                          <select
                            value={socialData.icon || "Share2"}
                            onChange={(e) => {
                              const selectedOption = socialMediaOptions.find(opt => opt.name === e.target.value);
                              setSettings({
                                ...settings,
                                footer: {
                                  ...settings.footer,
                                  socialMedia: {
                                    ...settings.footer.socialMedia,
                                    [id]: {
                                      ...socialData,
                                      icon: e.target.value,
                                      platform: selectedOption?.label || e.target.value,
                                    },
                                  },
                                },
                              })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          >
                            {socialMediaOptions.map((option) => (
                              <option key={option.name} value={option.name}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          
                          {/* Icon Preview */}
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                            {(() => {
                              const IconComponent = socialMediaOptions.find(opt => opt.name === (socialData.icon || "Share2"))?.component || Share2;
                              return (
                                <>
                                  <IconComponent className="h-4 w-4" />
                                  <span>{socialData.platform || socialMediaOptions.find(opt => opt.name === (socialData.icon || "Share2"))?.label}</span>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {/* URL */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            URL/Link
                          </label>
                          <input
                            type="text"
                            value={socialData.url || ""}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                footer: {
                                  ...settings.footer,
                                  socialMedia: {
                                    ...settings.footer.socialMedia,
                                    [id]: {
                                      ...socialData,
                                      url: e.target.value,
                                    },
                                  },
                                },
                              })
                            }
                            placeholder="https://instagram.com/... atau https://wa.me/..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                          
                          {/* URL Hint based on selected platform */}
                          <div className="mt-1 text-xs text-gray-500">
                            {(() => {
                              const platformName = (socialData.icon || "Share2").toLowerCase();
                              if (platformName.includes('instagram')) return 'Contoh: https://instagram.com/username';
                              if (platformName.includes('facebook')) return 'Contoh: https://facebook.com/username';
                              if (platformName.includes('youtube')) return 'Contoh: https://youtube.com/@channel';
                              if (platformName.includes('twitter')) return 'Contoh: https://twitter.com/username';
                              if (platformName.includes('messagecircle')) return 'Contoh: https://wa.me/6281234567890';
                              if (platformName.includes('mail')) return 'Contoh: mailto:email@example.com';
                              if (platformName.includes('phone')) return 'Contoh: tel:+6281234567890';
                              if (platformName.includes('mappin')) return 'Contoh: https://maps.google.com/...';
                              if (platformName.includes('globe')) return 'Contoh: https://website.com';
                              return 'Masukkan URL atau link';
                            })()}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="flex items-end">
                          <button
                            onClick={() => {
                              const newSocialMedia = {
                                ...settings.footer.socialMedia,
                              };
                              delete newSocialMedia[id];
                              setSettings({
                                ...settings,
                                footer: {
                                  ...settings.footer,
                                  socialMedia: newSocialMedia,
                                },
                              });
                            }}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
