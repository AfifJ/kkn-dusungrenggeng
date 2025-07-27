// Central data export file
export { websiteData } from './website.js';
export { produkData } from './produk.js';
export { galeriData } from './galeri.js';
export { agendaData } from './agenda.js';

// Data utilities and helpers
export const getDataBySection = (section) => {
  switch (section) {
    case 'website':
    case 'settings':
      return websiteData;
    case 'produk':
      return produkData;
    case 'galeri':
      return galeriData;
    case 'agenda':
      return agendaData;
    default:
      return null;
  }
};

export const updateDataBySection = (section, newData) => {
  // This would be used with a state management solution
  // For now, it's a placeholder for the update logic
  console.log(`Updating ${section} with:`, newData);
};

// Data validation helpers
export const validateData = (section, data) => {
  // Add validation logic for each data type
  const requiredFields = {
    produk: ['nama', 'deskripsi', 'harga'],
    galeri: ['title', 'image', 'category'],
    agenda: ['judul', 'tanggal', 'waktu', 'tempat']
  };

  if (requiredFields[section]) {
    return requiredFields[section].every(field => 
      data[field] && data[field].toString().trim() !== ''
    );
  }
  
  return true;
};

// Search and filter utilities
export const searchData = (section, query) => {
  const data = getDataBySection(section);
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter(item => {
    const searchFields = ['judul', 'nama', 'deskripsi', 'konten', 'title'];
    return searchFields.some(field => 
      item[field] && item[field].toLowerCase().includes(query.toLowerCase())
    );
  });
};

export const filterDataByCategory = (section, category) => {
  const data = getDataBySection(section);
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter(item => item.kategori === category || item.category === category);
};

export const getPublishedData = (section) => {
  const data = getDataBySection(section);
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter(item => item.status === 'published' || item.status === 'active');
};
