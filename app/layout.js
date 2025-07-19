import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dusun Grenggeng",
  description: "Website resmi Dusun Grenggeng",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="google-site-verification"
          content="LF0FMYFTasQ1EOuVe9313bUOpjgRg7O9bZEVWVmeQQ4"
        />
      </Head>
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
