import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://dusungrenggeng.netlify.app"),
  title: {
    default: "Dusun Grenggeng - Desa Tradisional Penghasil Tahu Berkualitas",
    template: "%s | Dusun Grenggeng",
  },
  description:
    "Website resmi Dusun Grenggeng - Desa tradisional dengan budaya Jawa yang kaya. Informasi kegiatan masyarakat, produk UMKM lokal, dan agenda kegiatan desa di Jawa Tengah.",
  keywords: [
    "dusun grenggeng",
    "desa tradisional",
    "budaya jawa",
    "jawa tengah",
    "UMKM",
    "produk lokal",
    "agenda kegiatan",
    "desa",
    "kegiatan masyarakat",
    "budaya tradisional",
    "tahu tradisional",
    "pertanian",
    "magelang",
    "sidomulyo",
    "candimulyo",
  ],
  authors: [
    { name: "Dusun Grenggeng", url: "https://dusungrenggeng.netlify.app" },
  ],
  creator: "Dusun Grenggeng",
  publisher: "Dusun Grenggeng",
  applicationName: "Website Dusun Grenggeng",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "Local Government",
  classification: "Local Community Website",
  verification: {
    google: "LF0FMYFTasQ1EOuVe9313bUOpjgRg7O9bZEVWVmeQQ4",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://dusungrenggeng.netlify.app",
    siteName: "Dusun Grenggeng",
    title: "Dusun Grenggeng - Desa Tradisional Penghasil Tahu Berkualitas",
    description:
      "Website resmi Dusun Grenggeng - Desa tradisional dengan budaya Jawa yang kaya. Informasi kegiatan masyarakat, produk UMKM lokal, dan agenda kegiatan desa di Jawa Tengah.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dusun Grenggeng - Desa Tradisional",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dusun Grenggeng - Desa Tradisional Penghasil Tahu Berkualitas",
    description:
      "Website resmi Dusun Grenggeng - Desa tradisional dengan budaya Jawa yang kaya",
    images: ["/og-image.png"],
    creator: "@dusungrenggeng",
  },
  alternates: {
    canonical: "https://dusungrenggeng.netlify.app",
    languages: {
      "id-ID": "https://dusungrenggeng.netlify.app",
    },
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Dusun Grenggeng",
    "mobile-web-app-capable": "yes",
    "theme-color": "#166534",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id-ID">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <meta name="theme-color" content="#166534" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dusun Grenggeng" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
