"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { 
  LayoutDashboard, 
  Newspaper, 
  Package, 
  Image, 
  Calendar,
  X,
  LogOut,
  Settings,
  Menu,
  Database,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Berita", href: "/admin/berita", icon: Newspaper },
  { name: "Produk", href: "/admin/produk", icon: Package },
  { name: "Galeri", href: "/admin/galeri", icon: Image },
  { name: "Agenda", href: "/admin/agenda", icon: Calendar },
  { name: "Data Dummy", href: "/admin/dummy", icon: Database },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Enable animation only after first interaction
  useEffect(() => {
    if (sidebarOpen) {
      setHasInteracted(true);
    }
  }, [sidebarOpen]);

  // Close sidebar when route changes on mobile
  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  const handleSignOut = async () => {
    if (!auth) return;
    
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <ProtectedRoute>
    <div className="bg-gray-50 h-screen overflow-hidden flex">
      {/* Sidebar */}
      <div className={`
        fixed h-screen inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex flex-col
        lg:relative lg:translate-x-0 lg:block lg:transition-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${hasInteracted ? 'transition-transform duration-300 ease-in-out lg:transition-none' : ''}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-bold text-green-700">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700 border-r-2 border-green-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={handleLinkClick}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-green-700' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 bg-white p-3">
          <div className="space-y-1">
            <Link
              href="/admin/settings"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === '/admin/settings'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={handleLinkClick}
            >
              <Settings className={`mr-3 h-5 w-5 ${
                pathname === '/admin/settings' ? 'text-green-700' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Pengaturan
            </Link>
            <Link
              href="/"
              className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={handleLinkClick}
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Kembali ke Situs
            </Link>
            <button
              onClick={handleSignOut}
              className="group flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" />
              <div className="flex flex-col items-start">
                <span>Logout</span>
                {user && (
                  <span className="text-xs text-red-400 group-hover:text-red-500 truncate max-w-[180px]">
                    {user.email}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
              </div>

              {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={`
            fixed inset-0 z-40 bg-black/50 lg:hidden
            ${hasInteracted ? 'transition-opacity duration-300' : ''}
          `}
          onClick={handleOverlayClick}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-0 flex flex-col h-screen">
        {/* Top Navigation Bar for Mobile */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-2">
              {user && (
                <div className="text-sm text-gray-600 text-right">
                  <div className="font-medium">Admin</div>
                  <div className="text-xs text-gray-500 truncate max-w-[120px]">
                    {user.email}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
