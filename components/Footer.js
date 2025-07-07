import {
  Box,
  Home as HomeIcon,
  Info,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-green-800 pt-12 pb-8 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* Kolom Kiri - Brand & Kontak */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold">Dusun Grenggeng</h3>
            </div>

            <p className="text-green-100">
              Desa penghasil tahu dan hasil tani berkualitas dengan keindahan
              alam yang mempesona.
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 text-green-200" />
                <span className="text-green-100">
                  Jl. Raya Grenggeng, Kec. Bandongan, Kab. Magelang, Jawa Tengah
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-green-200" />
                <span className="text-green-100">
                  dusun.grenggeng@example.com
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-green-200" />
                <span className="text-green-100">(0293) 1234567</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Menu Links */}
          <div className="grid gap-6">
            <div>
              <h4 className="mb-4 text-lg font-semibold">Menu</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-green-100 transition-colors hover:text-white"
                  >
                    <HomeIcon className="text-sm" />
                    <span>Beranda</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-green-100 transition-colors hover:text-white"
                  >
                    <Info className="text-sm" />
                    <span>Tentang Kami</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-green-100 transition-colors hover:text-white"
                  >
                    <Box className="text-sm" />
                    <span>Produk</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-green-100 transition-colors hover:text-white"
                  >
                    <ShoppingBag className="text-sm" />
                    <span>Belanja</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-green-700 pt-6 text-center text-sm text-green-200">
          <p>©2025 Dusun Grenggeng. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
