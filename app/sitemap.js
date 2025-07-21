import { beritaData } from '@/data/berita';
import { produkData } from '@/data/produk';
import { agendaData } from '@/data/agenda';
import { galeriData } from '@/data/galeri';

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
    // Dynamic routes - berita (using static data for now)
    const beritaRoutes = beritaData
      .filter(item => item.status === "published")
      .map((item) => ({
        url: `${baseUrl}/berita/${item.slug || item.judul.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}`,
        lastModified: item.tanggal ? new Date(item.tanggal) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));

    // Dynamic routes - produk (using static data for now)
    const produkRoutes = produkData
      .filter(item => item.status === "published" || !item.status)
      .map((item, index) => ({
        url: `${baseUrl}/produk/${item.slug || item.nama.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      }));

    // Dynamic routes - agenda
    const agendaRoutes = agendaData
      .filter(item => item.status === "scheduled" || !item.status)
      .map((item) => ({
        url: `${baseUrl}/agenda/${item.slug || item.judul.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}`,
        lastModified: item.tanggal ? new Date(item.tanggal) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.4,
      }));

    // Dynamic routes - galeri
    const galeriRoutes = galeriData
      .filter(item => item.status === "published" || !item.status)
      .map((item, index) => ({
        url: `${baseUrl}/galeri/${item.slug || item.judul.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}`,
        lastModified: item.tanggal ? new Date(item.tanggal) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.4,
      }));

    return [...staticRoutes, ...beritaRoutes, ...produkRoutes, ...agendaRoutes, ...galeriRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
