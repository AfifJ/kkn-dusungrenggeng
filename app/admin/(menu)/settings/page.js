"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Save, Plus, Trash2, Edit2, Factory, Users, Sprout, TrendingUp, Home, Building } from "lucide-react";

const iconOptions = [
  { name: 'Factory', component: Factory, label: 'Pabrik' },
  { name: 'Users', component: Users, label: 'Pengguna' },
  { name: 'Sprout', component: Sprout, label: 'Tanaman' },
  { name: 'TrendingUp', component: TrendingUp, label: 'Trend Naik' },
  { name: 'Home', component: Home, label: 'Rumah' },
  { name: 'Building', component: Building, label: 'Bangunan' }
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    hero: {
      title: "Selamat Datang di Dusun Grenggeng",
      subtitle: "Desa penghasil tahu dan hasil tani berkualitas dengan keindahan alam yang mempesona. Kami menjaga tradisi dengan cita rasa yang autentik.",
      backgroundImage: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    jelajahi: {
      title: "Jelajahi Grenggeng",
      description: "Grenggeng adalah sebuah dusun yang terletak di Candimulyo, Sidomulyo, Magelang, Jawa Tengah. Dusun ini dikenal sebagai sentra produksi tahu berkualitas dan hasil pertanian yang melimpah dengan keindahan alam pedesaan yang asri dan mempesona."
    },
    sambutan: {
      namaKepala: "Bapak Suyanto",
      pesanSambutan: "Selamat datang di Dusun Grenggeng. Kami bangga menjadi bagian dari komunitas yang menjaga tradisi pembuatan tahu berkualitas tinggi sambil terus berinovasi untuk masa depan yang lebih baik. Mari bersama-sama membangun dusun yang sejahtera dan lestari."
    },
    statistics: [
      { id: 1, label: "Pengusaha Tahu", value: "25", icon: "Factory" },
      { id: 2, label: "RT", value: "4", icon: "Users" },
      { id: 3, label: "Petani", value: "40+", icon: "Sprout" }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin?section=settings');
      const data = await response.json();
      if (data && Object.keys(data).length > 0) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: 'settings',
          data: settings
        }),
      });

      if (response.ok) {
        alert('Pengaturan berhasil disimpan!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const addStatistic = () => {
    const newId = Math.max(...settings.statistics.map(s => s.id)) + 1;
    setSettings({
      ...settings,
      statistics: [
        ...settings.statistics,
        { id: newId, label: "", value: "", icon: "Factory" }
      ]
    });
  };

  const updateStatistic = (id, field, value) => {
    setSettings({
      ...settings,
      statistics: settings.statistics.map(stat =>
        stat.id === id ? { ...stat, [field]: value } : stat
      )
    });
  };

  const deleteStatistic = (id) => {
    setSettings({
      ...settings,
      statistics: settings.statistics.filter(stat => stat.id !== id)
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Website</h1>
            <p className="text-gray-600">Kelola konten dan tampilan website</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'hero', label: 'Hero Section' },
              { id: 'jelajahi', label: 'Jelajahi Section' },
              { id: 'sambutan', label: 'Sambutan Kepala Dusun' },
              { id: 'statistics', label: 'Statistik' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Utama
                </label>
                <input
                  type="text"
                  value={settings.hero.title}
                  onChange={(e) => setSettings({
                    ...settings,
                    hero: { ...settings.hero, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <textarea
                  value={settings.hero.subtitle}
                  onChange={(e) => setSettings({
                    ...settings,
                    hero: { ...settings.hero, subtitle: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image URL
                </label>
                <input
                  type="url"
                  value={settings.hero.backgroundImage}
                  onChange={(e) => setSettings({
                    ...settings,
                    hero: { ...settings.hero, backgroundImage: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'jelajahi' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Jelajahi Section</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Section
                </label>
                <input
                  type="text"
                  value={settings.jelajahi.title}
                  onChange={(e) => setSettings({
                    ...settings,
                    jelajahi: { ...settings.jelajahi, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={settings.jelajahi.description}
                  onChange={(e) => setSettings({
                    ...settings,
                    jelajahi: { ...settings.jelajahi, description: e.target.value }
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'sambutan' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Sambutan Kepala Dusun</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kepala Dusun
                </label>
                <input
                  type="text"
                  value={settings.sambutan.namaKepala}
                  onChange={(e) => setSettings({
                    ...settings,
                    sambutan: { ...settings.sambutan, namaKepala: e.target.value }
                  })}
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
                  onChange={(e) => setSettings({
                    ...settings,
                    sambutan: { ...settings.sambutan, pesanSambutan: e.target.value }
                  })}
                  rows={6}
                  placeholder="Tulis pesan sambutan dari kepala dusun..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Preview */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Preview Sambutan</h4>
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
                    <p>{settings.sambutan.pesanSambutan || "Pesan sambutan akan muncul di sini..."}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Statistik Dusun</h3>
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
                  <div key={stat.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Statistik #{stat.id}</h4>
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
                          onChange={(e) => updateStatistic(stat.id, 'label', e.target.value)}
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
                          onChange={(e) => updateStatistic(stat.id, 'value', e.target.value)}
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
                          onChange={(e) => updateStatistic(stat.id, 'icon', e.target.value)}
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
                      <div className="text-3xl font-bold mb-2">{stat.value || "0"}</div>
                      <div className="text-lg mb-2">{stat.label || "Label"}</div>
                      <div className="flex justify-center">
                        {(() => {
                          const IconComponent = iconOptions.find(opt => opt.name === stat.icon)?.component || Factory;
                          return <IconComponent className="h-8 w-8 text-green-200" />;
                        })()}
                      </div>
                    </div>
                  </div>
                ))}

                {settings.statistics.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-lg mb-2">Belum ada statistik</div>
                    <p className="text-sm">Klik Tambah Statistik untuk menambah data</p>
                  </div>
                )}
              </div>

              {/* Grid Layout Preview */}
              {settings.statistics.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Preview Layout</h4>
                  <div className={`grid gap-4 ${
                    settings.statistics.length === 1 ? 'grid-cols-1' : 
                    settings.statistics.length === 2 ? 'grid-cols-2' : 
                    'grid-cols-3'
                  }`}>
                    {settings.statistics.map((stat) => (
                      <div key={stat.id} className="bg-green-700 text-white p-6 rounded-lg text-center">
                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm mb-2">{stat.label}</div>
                        <div className="flex justify-center">
                          {(() => {
                            const IconComponent = iconOptions.find(opt => opt.name === stat.icon)?.component || Factory;
                            return <IconComponent className="h-6 w-6 text-green-200" />;
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
