"use client";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false); // Close mobile menu after click
  };

  const navItems = [
    { label: "Beranda", sectionId: "hero" },
    { label: "Tentang", sectionId: "tentang" },
    { label: "Produk", sectionId: "produk" },
    { label: "Galeri", sectionId: "galeri" },
    { label: "Agenda", sectionId: "agenda" },
    { label: "Kontak", sectionId: "kontak" },
  ];

  return (
    <nav className="bg-green-800 text-white shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-xl font-bold hover:text-green-200 transition-colors"
          >
            Dusun Grenggeng
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden space-x-6 md:flex">
          {navItems.map((item) => (
            <button
              key={item.sectionId}
              onClick={() => scrollToSection(item.sectionId)}
              className="transition hover:text-green-200 cursor-pointer"
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
                key={item.sectionId}
                onClick={() => scrollToSection(item.sectionId)}
                className="block w-full text-left py-2 px-2 hover:bg-green-600 rounded transition-colors"
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
