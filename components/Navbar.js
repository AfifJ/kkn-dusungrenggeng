"use client";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (item) => {
    setIsMenuOpen(false); // Close mobile menu after click
    
    if (item.type === 'page') {
      // Navigate to different page
      router.push(item.href);
    } else if (item.type === 'section') {
      // Check if we're on homepage
      if (pathname === '/') {
        // Scroll to section if on homepage
        const element = document.getElementById(item.sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to homepage first, then scroll
        router.push(`/#${item.sectionId}`);
      }
    }
  };

  const navItems = [
    { label: "Beranda", type: "section", sectionId: "hero" },
    { label: "Berita", type: "page", href: "/berita" },
    { label: "Produk", type: "page", href: "/produk" },
    { label: "Galeri", type: "page", href: "/galeri" },
    { label: "Kalender", type: "page", href: "/kalender" },
  ];

  return (
    <nav className="bg-green-800 text-white shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            className="text-xl font-bold hover:text-green-200 transition-colors"
          >
            Dusun Grenggeng
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden space-x-6 md:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item)}
              className={`transition hover:text-green-200 cursor-pointer ${
                (item.type === 'page' && pathname === item.href) ||
                (item.type === 'section' && pathname === '/' && item.sectionId === 'hero' && item.label === 'Beranda')
                  ? 'text-green-200 font-semibold'
                  : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-700">
          <div className="px-4 py-2 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className={`block w-full text-left py-2 px-2 hover:bg-green-600 rounded transition-colors ${
                  (item.type === 'page' && pathname === item.href) ||
                  (item.type === 'section' && pathname === '/' && item.sectionId === 'hero' && item.label === 'Beranda')
                    ? 'bg-green-600 font-semibold'
                    : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
