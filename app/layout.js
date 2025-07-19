import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dusun Grenggeng",
  description: "Website resmi Dusun Grenggeng",
  keywords: "dusun grenggeng, desa, wisata, budaya, tradisional, jawa tengah",
  author: "Dusun Grenggeng",
  robots: "index, follow",
  other: {
    "google-site-verification": "LF0FMYFTasQ1EOuVe9313bUOpjgRg7O9bZEVWVmeQQ4",
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
