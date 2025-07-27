import { db } from '@/firebase/server';

export default async function sitemap() {
  const baseUrl = 'https://dusungrenggeng.netlify.app';
  
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/berita`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/galeri`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/produk`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kalender`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/agenda`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  try {
    // Fetch data from Firebase
    const [beritaSnapshot, produkSnapshot, agendaSnapshot, galeriSnapshot] = await Promise.all([
      db.collection('berita').get(),
      db.collection('produk').get(),
      db.collection('agenda').get(),
      db.collection('galeri').get()
    ]);

    // Dynamic routes - berita
    const beritaRoutes = beritaSnapshot.docs
      .filter(doc => doc.data().status === "published")
      .map(doc => ({
        url: `${baseUrl}/berita/${doc.data().slug || doc.data().judul.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}`,
        lastModified: doc.data().tanggal ? new Date(doc.data().tanggal) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));

    // Dynamic routes - produk
    const produkRoutes = produkSnapshot.docs
      .filter(doc => doc.data().status === "published" || !doc.data().status)
      .map(doc => ({
        url: `${baseUrl}/produk/${doc.data().slug || doc.data().nama.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      }));

    // Dynamic routes - agenda
    const agendaRoutes = agendaSnapshot.docs
      .filter(doc => doc.data().status === "scheduled" || !doc.data().status)
      .map(doc => ({
        url: `${baseUrl}/agenda/${doc.data().slug || doc.data().judul.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}`,
        lastModified: doc.data().tanggal ? new Date(doc.data().tanggal) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.4,
      }));

    // Dynamic routes - galeri
    const galeriRoutes = galeriSnapshot.docs
      .filter(doc => doc.data().status === "published" || !doc.data().status)
      .map(doc => ({
        url: `${baseUrl}/galeri/${doc.data().slug || doc.data().judul.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}`,
        lastModified: doc.data().tanggal ? new Date(doc.data().tanggal) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.4,
      }));

    return [...staticRoutes, ...beritaRoutes, ...produkRoutes, ...agendaRoutes, ...galeriRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
