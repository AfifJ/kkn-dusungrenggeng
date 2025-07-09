import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dusun Grenggeng",
  description: "Website resmi Dusun Grenggeng",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
