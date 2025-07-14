"use client";
import { useState, useEffect } from "react";
import { X, Calendar, Clock, MapPin, Users, Tag } from "lucide-react";

const AgendaForm = ({ isOpen, onClose, onSubmit, editingItem, loading }) => {
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    tanggal: "",
    waktu: "",
    tempat: "",
    kategori: "",
    penyelenggara: "",
    peserta: "",
    status: "scheduled",
    prioritas: "sedang",
    agenda: [""]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        judul: editingItem.judul || "",
        deskripsi: editingItem.deskripsi || "",
        tanggal: editingItem.tanggal || "",
        waktu: editingItem.waktu || "",
        tempat: editingItem.tempat || "",
        kategori: editingItem.kategori || "",
        penyelenggara: editingItem.penyelenggara || "",
        peserta: editingItem.peserta || "",
        status: editingItem.status || "scheduled",
        prioritas: editingItem.prioritas || "sedang",
        agenda: editingItem.agenda || [""]
      });
    } else {
      setFormData({
        judul: "",
        deskripsi: "",
        tanggal: "",
        waktu: "",
        tempat: "",
        kategori: "",
        penyelenggara: "",
        peserta: "",
        status: "scheduled",
        prioritas: "sedang",
        agenda: [""]
      });
    }
    setErrors({});
  }, [editingItem, isOpen]);

  const kategoriOptions = [
    "Rapat",
    "Pelatihan", 
    "Festival",
    "Gotong Royong",
    "Kesehatan",
    "Pendidikan",
    "Sosial",
    "Ekonomi",
    "Budaya",
    "Olahraga",
    "Lingkungan",
    "Keagamaan"
  ];

  const prioritasOptions = [
    { value: "rendah", label: "Rendah", color: "text-gray-600" },
    { value: "sedang", label: "Sedang", color: "text-yellow-600" },
    { value: "tinggi", label: "Tinggi", color: "text-red-600" }
  ];

  const statusOptions = [
    { value: "scheduled", label: "Terjadwal", color: "text-blue-600" },
    { value: "ongoing", label: "Berlangsung", color: "text-yellow-600" },
    { value: "completed", label: "Selesai", color: "text-green-600" },
    { value: "cancelled", label: "Dibatalkan", color: "text-red-600" }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.judul.trim()) {
      newErrors.judul = "Judul kegiatan harus diisi";
    }

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = "Deskripsi harus diisi";
    }

    if (!formData.tanggal) {
      newErrors.tanggal = "Tanggal harus diisi";
    }

    if (!formData.waktu) {
      newErrors.waktu = "Waktu harus diisi";
    }

    if (!formData.tempat.trim()) {
      newErrors.tempat = "Tempat harus diisi";
    }

    if (!formData.kategori) {
      newErrors.kategori = "Kategori harus dipilih";
    }

    if (!formData.penyelenggara.trim()) {
      newErrors.penyelenggara = "Penyelenggara harus diisi";
    }

    if (!formData.peserta.trim()) {
      newErrors.peserta = "Peserta harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Filter out empty agenda items
    const filteredAgenda = formData.agenda.filter(item => item.trim() !== "");
    
    const submitData = {
      ...formData,
      agenda: filteredAgenda.length > 0 ? filteredAgenda : [""]
    };

    onSubmit(submitData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleAgendaChange = (index, value) => {
    const newAgenda = [...formData.agenda];
    newAgenda[index] = value;
    setFormData(prev => ({
      ...prev,
      agenda: newAgenda
    }));
  };

  const addAgendaItem = () => {
    setFormData(prev => ({
      ...prev,
      agenda: [...prev.agenda, ""]
    }));
  };

  const removeAgendaItem = (index) => {
    if (formData.agenda.length > 1) {
      const newAgenda = formData.agenda.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        agenda: newAgenda
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingItem ? "Edit Agenda" : "Tambah Agenda Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Judul */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Kegiatan *
              </label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.judul ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan judul kegiatan"
              />
              {errors.judul && (
                <p className="mt-1 text-sm text-red-600">{errors.judul}</p>
              )}
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi *
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.deskripsi ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan deskripsi kegiatan"
              />
              {errors.deskripsi && (
                <p className="mt-1 text-sm text-red-600">{errors.deskripsi}</p>
              )}
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Tanggal *
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.tanggal ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.tanggal && (
                <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>
              )}
            </div>

            {/* Waktu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Waktu *
              </label>
              <input
                type="time"
                name="waktu"
                value={formData.waktu}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.waktu ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.waktu && (
                <p className="mt-1 text-sm text-red-600">{errors.waktu}</p>
              )}
            </div>

            {/* Tempat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Tempat *
              </label>
              <input
                type="text"
                name="tempat"
                value={formData.tempat}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.tempat ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan lokasi kegiatan"
              />
              {errors.tempat && (
                <p className="mt-1 text-sm text-red-600">{errors.tempat}</p>
              )}
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                Kategori *
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.kategori ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Pilih kategori</option>
                {kategoriOptions.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
              {errors.kategori && (
                <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>
              )}
            </div>

            {/* Penyelenggara */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline w-4 h-4 mr-1" />
                Penyelenggara *
              </label>
              <input
                type="text"
                name="penyelenggara"
                value={formData.penyelenggara}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.penyelenggara ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan nama penyelenggara"
              />
              {errors.penyelenggara && (
                <p className="mt-1 text-sm text-red-600">{errors.penyelenggara}</p>
              )}
            </div>

            {/* Peserta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peserta *
              </label>
              <input
                type="text"
                name="peserta"
                value={formData.peserta}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.peserta ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan target peserta"
              />
              {errors.peserta && (
                <p className="mt-1 text-sm text-red-600">{errors.peserta}</p>
              )}
            </div>

            {/* Prioritas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioritas
              </label>
              <select
                name="prioritas"
                value={formData.prioritas}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {prioritasOptions.map((prioritas) => (
                  <option key={prioritas.value} value={prioritas.value}>
                    {prioritas.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Agenda/Rundown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agenda/Rundown Kegiatan
            </label>
            <div className="space-y-2">
              {formData.agenda.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleAgendaChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={`Agenda ${index + 1}`}
                  />
                  {formData.agenda.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAgendaItem(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAgendaItem}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                + Tambah item agenda
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : editingItem ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgendaForm;
