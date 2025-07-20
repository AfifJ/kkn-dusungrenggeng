import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://dusungrenggeng.vercel.app"),
  title: "Dusun Grenggeng",
  description: "Website resmi Dusun Grenggeng",
  keywords: "dusun grenggeng, desa, wisata, budaya, tradisional, jawa tengah",
  author: "Dusun Grenggeng",
  robots: "index, follow",
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
  ],
  verification: {
    google: "LF0FMYFTasQ1EOuVe9313bUOpjgRg7O9bZEVWVmeQQ4",
  },
  authors: [{ name: "Dusun Grenggeng" }],
  creator: "Dusun Grenggeng",
  publisher: "Dusun Grenggeng",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // icons: {
  //   icon: [{ url: "/favicon.ico" }],
  // },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://dusungrenggeng.vercel.app",
    siteName: "Dusun Grenggeng",
    title: "Dusun Grenggeng - Website Resmi Desa Tradisional",
    description:
      "Website resmi Dusun Grenggeng - Desa tradisional dengan budaya Jawa yang kaya. Informasi kegiatan masyarakat, produk UMKM lokal, dan agenda kegiatan desa di Jawa Tengah.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dusun Grenggeng - Desa Tradisional",
      },
    ],
  },
  category: "local government",
  classification: "Local Community",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "https://dusungrenggeng.vercel.app",
    languages: {
      "id-ID": "https://dusungrenggeng.vercel.app",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
