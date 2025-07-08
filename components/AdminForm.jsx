'use client';
import { useState, useEffect } from 'react';

export default function AdminForm({ section }) {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [section]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin?section=${section}`);
      const data = await res.json();
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Get form fields based on section
  const getFormFields = () => {
    switch (section) {
      case 'berita':
        return [
          { name: 'judul', label: 'Judul', type: 'text', required: true },
          { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: true },
          { name: 'gambar', label: 'URL Gambar', type: 'text', required: true },
          { name: 'tanggal', label: 'Tanggal', type: 'text', required: true },
          { name: 'kategori', label: 'Kategori', type: 'text', required: true },
          { name: 'penulis', label: 'Penulis', type: 'text', required: true }
        ];
      case 'produk':
        return [
          { name: 'nama', label: 'Nama Produk', type: 'text', required: true },
          { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: true },
          { name: 'harga', label: 'Harga', type: 'text', required: true },
          { name: 'gambar', label: 'URL Gambar', type: 'text', required: true },
          { name: 'keunggulan', label: 'Keunggulan (pisahkan dengan koma)', type: 'text', required: true },
          { name: 'featured', label: 'Featured', type: 'checkbox' }
        ];
      case 'galeri':
        return [
          { name: 'judul', label: 'Judul', type: 'text', required: true },
          { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: true },
          { name: 'gambar', label: 'URL Gambar', type: 'text', required: true },
          { name: 'kategori', label: 'Kategori', type: 'text', required: true }
        ];
      case 'kalender':
        return [
          { name: 'date', label: 'Tanggal (YYYY-MM-DD)', type: 'date', required: true },
          { name: 'dayName', label: 'Nama Hari', type: 'text', required: true },
          { name: 'activities', label: 'Aktivitas (JSON)', type: 'textarea', required: true }
        ];
      default:
        return [];
    }
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      let processedData = { ...formData };
      
      // Process specific field types
      if (section === 'produk' && processedData.keunggulan) {
        processedData.keunggulan = processedData.keunggulan.split(',').map(k => k.trim());
      }
      
      if (section === 'kalender' && processedData.activities) {
        try {
          processedData.activities = JSON.parse(processedData.activities);
        } catch (e) {
          alert('Invalid JSON format for activities');
          return;
        }
      }

      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          data: processedData
        })
      });
      
      alert('Data saved successfully!');
      setEditingItem(null);
      setIsAddingNew(false);
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving data');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await fetch(`/api/admin?section=${section}&id=${id}`, {
        method: 'DELETE'
      });
      
      alert('Item deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting item');
    }
  };

  const FormFields = ({ item, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(item || {});
    const fields = getFormFields();

    const handleChange = (name, value) => {
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleFormSubmit} className="space-y-4 border p-4 rounded">
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full p-2 border rounded"
                rows={field.name === 'activities' ? 8 : 3}
                required={field.required}
              />
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={formData[field.name] || false}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                className="p-2 border rounded"
              />
            ) : (
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full p-2 border rounded"
                required={field.required}
              />
            )}
          </div>
        ))}
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage {section.charAt(0).toUpperCase() + section.slice(1)}</h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New {section.slice(0, -1)}
        </button>
      </div>

      {isAddingNew && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Add New Item</h3>
          <FormFields
            onSubmit={handleSubmit}
            onCancel={() => setIsAddingNew(false)}
          />
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded p-4">
            {editingItem === item.id ? (
              <FormFields
                item={item}
                onSubmit={handleSubmit}
                onCancel={() => setEditingItem(null)}
              />
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">
                    {item.nama || item.judul || item.title || `Item ${item.id}`}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem(item.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.deskripsi || item.description || 'No description'}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}