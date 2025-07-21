"use client";

export default function StructuredData({ data, type = "Organization" }) {
  const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dusun Grenggeng",
    description: "Desa penghasil tahu dan hasil tani berkualitas dengan keindahan alam yang mempesona di Jawa Tengah",
    url: "https://dusungrenggeng.netlify.app",
    logo: "https://dusungrenggeng.netlify.app/og-image.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Candimulyo",
      addressRegion: "Sidomulyo",
      addressCountry: "Indonesia",
      postalCode: "56161"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-7.5200000",
      longitude: "110.2000000"
    },
    areaServed: {
      "@type": "Place",
      name: "Magelang, Jawa Tengah"
    },
    knowsAbout: [
      "Produksi Tahu Tradisional",
      "Pertanian",
      "Wisata Desa",
      "Budaya Jawa"
    ],
    memberOf: {
      "@type": "Organization",
      name: "Kabupaten Magelang"
    },
    sameAs: [
      "https://instagram.com/dusungrenggeng",
      "https://facebook.com/dusungrenggeng"
    ]
  });

  const generateLocalBusinessSchema = () => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Dusun Grenggeng",
    description: "Sentra produksi tahu tradisional dan hasil pertanian berkualitas",
    image: "https://dusungrenggeng.netlify.app/og-image.png",
    url: "https://dusungrenggeng.netlify.app",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Raya Grenggeng",
      addressLocality: "Candimulyo",
      addressRegion: "Sidomulyo, Magelang",
      postalCode: "56161",
      addressCountry: "ID"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -7.5200000,
      longitude: 110.2000000
    },
    openingHours: "Mo-Su 06:00-18:00",
    priceRange: "$$",
    servesCuisine: "Indonesian",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Produk Dusun Grenggeng",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Tahu Tradisional Grenggeng",
            description: "Tahu berkualitas tinggi dibuat dengan metode tradisional turun temurun"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Hasil Pertanian Segar",
            description: "Berbagai hasil pertanian segar dari sawah Dusun Grenggeng"
          }
        }
      ]
    }
  });

  const generateWebSiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dusun Grenggeng",
    alternateName: "Website Resmi Dusun Grenggeng",
    url: "https://dusungrenggeng.netlify.app",
    description: "Website resmi Dusun Grenggeng - Desa tradisional dengan budaya Jawa yang kaya. Informasi kegiatan masyarakat, produk UMKM lokal, dan agenda kegiatan desa di Jawa Tengah.",
    inLanguage: "id-ID",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://dusungrenggeng.netlify.app/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    publisher: {
      "@type": "Organization",
      name: "Dusun Grenggeng",
      url: "https://dusungrenggeng.netlify.app"
    }
  });

  const generateBreadcrumbSchema = (breadcrumbs) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  });

  const getSchema = () => {
    switch (type) {
      case "Organization":
        return generateOrganizationSchema();
      case "LocalBusiness":
        return generateLocalBusinessSchema();
      case "WebSite":
        return generateWebSiteSchema();
      case "BreadcrumbList":
        return generateBreadcrumbSchema(data);
      default:
        return generateOrganizationSchema();
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getSchema())
      }}
    />
  );
}
